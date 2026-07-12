const API_BASE = 'http://127.0.0.1:5000/api/v1';

/* ---------- cookies / token ---------- */

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function setCookie(name, value, days) {
    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`;
}

function deleteCookie(name) {
    document.cookie = `${name}=; path=/; max-age=0`;
}

function getToken() {
    return getCookie('token');
}

function parseJwt(token) {
    try {
        const payload = token.split('.')[1];
        const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decoded);
    } catch (error) {
        return null;
    }
}

function getCurrentUser() {
    const token = getToken();
    if (!token) return null;
    const payload = parseJwt(token);
    if (!payload || !payload.sub) return null;
    return { id: payload.sub, is_admin: !!payload.is_admin };
}

function logout() {
    deleteCookie('token');
    window.location.href = 'index.html';
}

/* ---------- API helper ---------- */

async function apiRequest(path, { method = 'GET', body, auth = false } = {}) {
    const headers = {};
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (auth) {
        const token = getToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${path}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined
    });

    let data = null;
    try {
        data = await response.json();
    } catch (error) {
        data = null;
    }

    if (!response.ok) {
        const message = (data && (data.error || data.msg)) || `Request failed (${response.status})`;
        throw new Error(message);
    }

    return data;
}

/* ---------- nav ---------- */

function updateNav() {
    const user = getCurrentUser();
    const isAuthed = !!user;

    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const logoutLink = document.getElementById('logout-link');
    const profileLink = document.getElementById('profile-link');
    const addPlaceLink = document.getElementById('add-place-link');

    if (loginLink) loginLink.style.display = isAuthed ? 'none' : 'inline-block';
    if (registerLink) registerLink.style.display = isAuthed ? 'none' : 'inline-block';
    if (logoutLink) logoutLink.style.display = isAuthed ? 'inline-block' : 'none';
    if (profileLink) profileLink.style.display = isAuthed ? 'inline-block' : 'none';
    if (addPlaceLink) addPlaceLink.style.display = isAuthed ? 'inline-block' : 'none';

    if (logoutLink) {
        logoutLink.addEventListener('click', (event) => {
            event.preventDefault();
            logout();
        });
    }
}

/* ---------- shared helpers ---------- */

function getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
}

function imageForPlace(id) {
    let hash = 0;
    for (let i = 0; i < String(id).length; i++) hash += String(id).charCodeAt(i);
    const imageNum = (hash % 4) + 1;
    return imageNum === 4 ? 'p4.jpg' : `p${imageNum}.png`;
}

function renderStars(rating) {
    const full = Math.round(rating);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
}

function initStarRatingInput(containerId, hiddenInputId) {
    const container = document.getElementById(containerId);
    const hiddenInput = document.getElementById(hiddenInputId);
    if (!container || !hiddenInput) return;

    const stars = Array.from(container.querySelectorAll('span'));

    function paint(value) {
        stars.forEach((star) => {
            star.classList.toggle('filled', Number(star.dataset.value) <= value);
        });
    }

    stars.forEach((star) => {
        star.addEventListener('click', () => {
            hiddenInput.value = star.dataset.value;
            container.dataset.value = star.dataset.value;
            paint(Number(star.dataset.value));
        });
        star.addEventListener('mouseenter', () => paint(Number(star.dataset.value)));
    });

    container.addEventListener('mouseleave', () => paint(Number(hiddenInput.value) || 0));
}

/* ---------- page init ---------- */

document.addEventListener('DOMContentLoaded', () => {
    updateNav();

    if (document.getElementById('login-form')) initLoginPage();
    if (document.getElementById('register-form')) initRegisterPage();
    if (document.getElementById('places-list')) initIndexPage();
    if (document.getElementById('place-info')) initPlacePage();
    if (document.getElementById('review-form') && !document.getElementById('place-form')) initAddReviewPage();
    if (document.getElementById('place-form')) initPlaceFormPage();
    if (document.getElementById('profile-info')) initProfilePage();
});

/* ---------- login ---------- */

function initLoginPage() {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        try {
            const data = await apiRequest('/auth/login', { method: 'POST', body: { email, password } });
            setCookie('token', data.access_token, 7);
            window.location.href = 'index.html';
        } catch (error) {
            alert(`Login failed: ${error.message}`);
        }
    });
}

/* ---------- register ---------- */

function initRegisterPage() {
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const first_name = document.getElementById('first-name').value;
        const last_name = document.getElementById('last-name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        try {
            await apiRequest('/auth/register', { method: 'POST', body: { first_name, last_name, email, password } });
            alert('Account created! Please log in.');
            window.location.href = 'login.html';
        } catch (error) {
            alert(`Registration failed: ${error.message}`);
        }
    });
}

/* ---------- index / listing ---------- */

let allPlaces = [];

function initIndexPage() {
    fetchPlaces();

    const priceFilter = document.getElementById('price-filter');
    const searchInput = document.getElementById('search-input');
    if (priceFilter) priceFilter.addEventListener('change', applyFilters);
    if (searchInput) searchInput.addEventListener('input', applyFilters);
}

async function fetchPlaces() {
    try {
        allPlaces = await apiRequest('/places/');
        applyFilters();
    } catch (error) {
        const container = document.getElementById('places-list');
        if (container) container.innerHTML = `<p>Could not load places: ${error.message}</p>`;
    }
}

function applyFilters() {
    const priceFilter = document.getElementById('price-filter');
    const searchInput = document.getElementById('search-input');

    let places = allPlaces;

    if (priceFilter && priceFilter.value !== 'All') {
        const maxPrice = parseFloat(priceFilter.value);
        places = places.filter((place) => place.price <= maxPrice);
    }

    if (searchInput && searchInput.value.trim()) {
        const term = searchInput.value.trim().toLowerCase();
        places = places.filter((place) => place.title.toLowerCase().includes(term));
    }

    displayPlaces(places);
}

function displayPlaces(places) {
    const container = document.getElementById('places-list');
    if (!container) return;
    container.innerHTML = '';

    if (places.length === 0) {
        container.innerHTML = '<p>No places match your search.</p>';
        return;
    }

    places.forEach((place) => {
        const card = document.createElement('article');
        card.className = 'place-card';
        card.innerHTML = `
            <img src="${imageForPlace(place.id)}" alt="${place.title}">
            <h3>${place.title}</h3>
            <p><strong>Price:</strong> $${place.price} per night</p>
            <a href="place.html?id=${place.id}" class="details-button">View Details</a>
        `;
        container.appendChild(card);
    });
}

/* ---------- place details ---------- */

let currentPlace = null;

function initPlacePage() {
    const placeId = getQueryParam('id');
    if (!placeId) return;
    fetchPlaceDetails(placeId);

    const addReviewSection = document.getElementById('add-review');
    const user = getCurrentUser();
    if (addReviewSection) {
        if (user) {
            addReviewSection.style.display = 'block';
            const reviewLink = addReviewSection.querySelector('a');
            if (reviewLink) reviewLink.href = `add_review.html?id=${placeId}`;
        } else {
            addReviewSection.style.display = 'none';
        }
    }
}

async function fetchPlaceDetails(placeId) {
    try {
        currentPlace = await apiRequest(`/places/${placeId}`);
        displayPlaceDetails(currentPlace);
        displayReviews(currentPlace.reviews || []);
    } catch (error) {
        const infoContainer = document.getElementById('place-info');
        if (infoContainer) infoContainer.innerHTML = `<p>Could not load this place: ${error.message}</p>`;
    }
}

function displayPlaceDetails(place) {
    const infoContainer = document.getElementById('place-info');
    if (!infoContainer) return;

    const user = getCurrentUser();
    const isOwner = user && place.owner && user.id === place.owner.id;
    const ownerName = place.owner ? `${place.owner.first_name} ${place.owner.last_name}` : 'Unknown';
    const amenityNames = (place.amenities || []).map((a) => a.name).join(', ') || 'Not specified';

    infoContainer.innerHTML = `
        <h1>${place.title}</h1>
        <img src="${imageForPlace(place.id)}" alt="${place.title}" style="width:100%; max-width:800px; height:400px; object-fit:cover; border-radius:10px; margin-bottom:20px;">
        <p><strong>Host:</strong> ${ownerName}</p>
        <p><strong>Price:</strong> $${place.price} per night</p>
        <p><strong>Description:</strong> ${place.description || 'No description available.'}</p>
        <p><strong>Amenities:</strong> ${amenityNames}</p>
        ${isOwner ? `
            <div class="owner-actions">
                <a href="place_form.html?id=${place.id}" class="details-button">Edit Place</a>
                <button type="button" class="details-button danger" id="delete-place-button">Delete Place</button>
            </div>
        ` : ''}
    `;

    if (isOwner) {
        document.getElementById('delete-place-button').addEventListener('click', () => deletePlace(place.id));
    }
}

async function deletePlace(placeId) {
    if (!confirm('Delete this place? This cannot be undone.')) return;
    try {
        await apiRequest(`/places/${placeId}`, { method: 'DELETE', auth: true });
        window.location.href = 'index.html';
    } catch (error) {
        alert(`Could not delete place: ${error.message}`);
    }
}

function displayReviews(reviews) {
    const container = document.getElementById('reviews-container');
    if (!container) return;

    if (reviews.length === 0) {
        container.innerHTML = '<p>No reviews yet.</p>';
        return;
    }

    const user = getCurrentUser();
    container.innerHTML = '';

    reviews.forEach((review) => {
        const isAuthor = user && user.id === review.user_id;
        const reviewerName = `${review.reviewer_first_name || 'A'} ${review.reviewer_last_name || 'user'}`;
        const card = document.createElement('div');
        card.className = 'review-card';
        card.innerHTML = `
            <p class="review-stars">${renderStars(review.rating)}</p>
            <p>${review.text}</p>
            <p><strong>${reviewerName}</strong></p>
            ${isAuthor ? `
                <div class="review-actions">
                    <button type="button" class="details-button" data-action="edit">Edit</button>
                    <button type="button" class="details-button danger" data-action="delete">Delete</button>
                </div>
            ` : ''}
        `;

        if (isAuthor) {
            card.querySelector('[data-action="edit"]').addEventListener('click', () => startEditReview(card, review));
            card.querySelector('[data-action="delete"]').addEventListener('click', () => deleteReview(review.id));
        }

        container.appendChild(card);
    });
}

function startEditReview(card, review) {
    card.innerHTML = `
        <div class="star-rating" id="edit-rating-${review.id}" data-value="${review.rating}">
            ${[1, 2, 3, 4, 5].map((n) => `<span data-value="${n}" class="${n <= review.rating ? 'filled' : ''}">★</span>`).join('')}
        </div>
        <input type="hidden" id="edit-rating-input-${review.id}" value="${review.rating}">
        <textarea id="edit-text-${review.id}" rows="3">${review.text}</textarea>
        <div class="review-actions">
            <button type="button" class="details-button" data-action="save">Save</button>
            <button type="button" class="details-button danger" data-action="cancel">Cancel</button>
        </div>
    `;
    initStarRatingInput(`edit-rating-${review.id}`, `edit-rating-input-${review.id}`);

    card.querySelector('[data-action="cancel"]').addEventListener('click', () => displayReviews(currentPlace.reviews));
    card.querySelector('[data-action="save"]').addEventListener('click', async () => {
        const text = document.getElementById(`edit-text-${review.id}`).value;
        const rating = Number(document.getElementById(`edit-rating-input-${review.id}`).value);
        try {
            await apiRequest(`/reviews/${review.id}`, { method: 'PUT', auth: true, body: { text, rating } });
            await fetchPlaceDetails(currentPlace.id);
        } catch (error) {
            alert(`Could not update review: ${error.message}`);
        }
    });
}

async function deleteReview(reviewId) {
    if (!confirm('Delete this review?')) return;
    try {
        await apiRequest(`/reviews/${reviewId}`, { method: 'DELETE', auth: true });
        await fetchPlaceDetails(currentPlace.id);
    } catch (error) {
        alert(`Could not delete review: ${error.message}`);
    }
}

/* ---------- add review ---------- */

function initAddReviewPage() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    initStarRatingInput('rating-input', 'review-rating');

    const placeId = getQueryParam('id');
    const reviewForm = document.getElementById('review-form');

    reviewForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const text = document.getElementById('review-text').value;
        const rating = Number(document.getElementById('review-rating').value);

        if (!rating) {
            alert('Please select a star rating.');
            return;
        }

        try {
            await apiRequest('/reviews/', { method: 'POST', auth: true, body: { text, rating, place_id: placeId } });
            alert('Review submitted successfully!');
            window.location.href = `place.html?id=${placeId}`;
        } catch (error) {
            alert(`Could not submit review: ${error.message}`);
        }
    });
}

/* ---------- place form (create / edit) ---------- */

function initPlaceFormPage() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const placeId = getQueryParam('id');
    const form = document.getElementById('place-form');
    const heading = document.getElementById('place-form-heading');
    const amenitiesContainer = document.getElementById('amenities-list');

    loadAmenityCheckboxes(amenitiesContainer).then(async () => {
        if (placeId) {
            if (heading) heading.textContent = 'Edit Place';
            try {
                const place = await apiRequest(`/places/${placeId}`);
                if (!user.is_admin && (!place.owner || place.owner.id !== user.id)) {
                    alert('You can only edit your own places.');
                    window.location.href = 'index.html';
                    return;
                }
                document.getElementById('title').value = place.title;
                document.getElementById('description').value = place.description || '';
                document.getElementById('price').value = place.price;
                document.getElementById('latitude').value = place.latitude;
                document.getElementById('longitude').value = place.longitude;
                const ownedAmenityIds = new Set((place.amenities || []).map((a) => a.id));
                amenitiesContainer.querySelectorAll('input[type="checkbox"]').forEach((box) => {
                    box.checked = ownedAmenityIds.has(box.value);
                });
            } catch (error) {
                alert(`Could not load place: ${error.message}`);
                window.location.href = 'index.html';
            }
        }
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const amenities = Array.from(amenitiesContainer.querySelectorAll('input[type="checkbox"]:checked')).map((box) => box.value);
        const body = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            price: Number(document.getElementById('price').value),
            latitude: Number(document.getElementById('latitude').value),
            longitude: Number(document.getElementById('longitude').value),
            amenities
        };

        try {
            let place;
            if (placeId) {
                await apiRequest(`/places/${placeId}`, { method: 'PUT', auth: true, body });
                place = { id: placeId };
            } else {
                place = await apiRequest('/places/', { method: 'POST', auth: true, body });
            }
            window.location.href = `place.html?id=${place.id}`;
        } catch (error) {
            alert(`Could not save place: ${error.message}`);
        }
    });
}

async function loadAmenityCheckboxes(container) {
    if (!container) return;
    try {
        const amenities = await apiRequest('/amenities/');
        container.innerHTML = amenities.map((a) => `
            <label class="amenity-option">
                <input type="checkbox" value="${a.id}"> ${a.name}
            </label>
        `).join('');
    } catch (error) {
        container.innerHTML = `<p>Could not load amenities: ${error.message}</p>`;
    }
}

/* ---------- profile ---------- */

function initProfilePage() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    loadProfile(user.id);
    loadMyPlaces(user.id);

    const profileForm = document.getElementById('profile-form');
    profileForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const first_name = document.getElementById('profile-first-name').value;
        const last_name = document.getElementById('profile-last-name').value;
        try {
            await apiRequest(`/users/${user.id}`, { method: 'PUT', auth: true, body: { first_name, last_name } });
            alert('Profile updated.');
        } catch (error) {
            alert(`Could not update profile: ${error.message}`);
        }
    });
}

async function loadProfile(userId) {
    try {
        const profile = await apiRequest(`/users/${userId}`);
        document.getElementById('profile-info').innerHTML = `<p><strong>Email:</strong> ${profile.email}</p>`;
        document.getElementById('profile-first-name').value = profile.first_name;
        document.getElementById('profile-last-name').value = profile.last_name;
    } catch (error) {
        document.getElementById('profile-info').innerHTML = `<p>Could not load profile: ${error.message}</p>`;
    }
}

async function loadMyPlaces(userId) {
    const container = document.getElementById('my-places-list');
    if (!container) return;
    try {
        const places = await apiRequest('/places/');
        const myPlaces = places.filter((place) => place.owner_id === userId);

        if (myPlaces.length === 0) {
            container.innerHTML = '<p>You have not listed any places yet.</p>';
            return;
        }

        container.innerHTML = '';
        myPlaces.forEach((place) => {
            const card = document.createElement('article');
            card.className = 'place-card';
            card.innerHTML = `
                <img src="${imageForPlace(place.id)}" alt="${place.title}">
                <h3>${place.title}</h3>
                <p><strong>Price:</strong> $${place.price} per night</p>
                <a href="place.html?id=${place.id}" class="details-button">View</a>
                <a href="place_form.html?id=${place.id}" class="details-button">Edit</a>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        container.innerHTML = `<p>Could not load your places: ${error.message}</p>`;
    }
}
