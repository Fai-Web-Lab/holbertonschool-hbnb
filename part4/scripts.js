document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://127.0.0.1:5000';
    
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const reviewForm = document.getElementById('review-form');
    const errorMessage = document.getElementById('error-message');
    const loginLink = document.getElementById('login-link');
    const priceFilter = document.getElementById('price-filter');
    const placesContainer = document.getElementById('places-list');

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function getPlaceIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    function checkAuthentication() {
        const token = getCookie('token');
        const isAddReviewPage = window.location.pathname.includes('add_review.html');

        if (!token && isAddReviewPage) {
            window.location.href = 'index.html';
            return null;
        }

        if (loginLink) {
            loginLink.style.display = token ? 'none' : 'block';
        }
        return token;
    }

    async function handleResponse(response) {
        if (response.status === 401) {
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.href = 'login.html';
            return null;
        }
        return await response.json();
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${API_BASE_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                if (response.ok) {
                    document.cookie = `token=${data.access_token}; path=/; max-age=3600; SameSite=Lax`;
                    window.location.href = 'index.html';
                } else {
                    alert(data.message || 'Login failed');
                }
            } catch (error) {
                alert('Connection error');
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = {
                first_name: document.getElementById('first_name').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            };

            try {
                const response = await fetch(`${API_BASE_URL}/users`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert('Registration successful!');
                    window.location.href = 'login.html';
                } else {
                    const data = await response.json();
                    alert(data.message || 'Registration failed');
                }
            } catch (error) {
                alert('Connection error');
            }
        });
    }

    async function fetchPlaces(token) {
        try {
            const response = await fetch(`${API_BASE_URL}/places`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const places = await handleResponse(response);
            if (places) displayPlaces(places);
        } catch (error) {
            console.error('Error fetching places:', error);
        }
    }

    function displayPlaces(places) {
        if (!placesContainer) return;
        placesContainer.innerHTML = '';
        places.forEach(place => {
            const card = document.createElement('div');
            card.className = 'place-card';
            card.setAttribute('data-price', place.price_per_night);
            card.innerHTML = `
                <h3>${place.name}</h3>
                <p>${place.description}</p>
                <p><strong>Price:</strong> $${place.price_per_night}</p>
                <a href="place.html?id=${place.id}" class="details-button">View Details</a>
            `;
            placesContainer.appendChild(card);
        });
    }

    async function fetchPlaceDetails(token, placeId) {
        try {
            const response = await fetch(`${API_BASE_URL}/places/${placeId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const place = await handleResponse(response);
            if (place) displayPlaceDetails(place, token);
        } catch (error) {
            console.error('Error fetching details:', error);
        }
    }

    function displayPlaceDetails(place, token) {
        const nameElem = document.getElementById('place-name');
        if (!nameElem) return;

        nameElem.textContent = place.name;
        document.getElementById('place-host').textContent = place.host_name || 'Owner';
        document.getElementById('place-price').textContent = place.price_per_night;
        document.getElementById('place-description').textContent = place.description;
        document.getElementById('place-amenities').textContent = place.amenities.map(a => a.name).join(', ');

        const reviewsList = document.getElementById('reviews-list');
        reviewsList.innerHTML = place.reviews.map(rev => `
            <article class="review-card">
                <p><strong>User:</strong> ${rev.user_name}</p>
                <p class="comment">"${rev.comment}"</p>
            </article>
        `).join('');

        const addReviewSection = document.getElementById('add-review');
        if (addReviewSection && token) {
            addReviewSection.style.display = 'block';
        }
    }

    if (reviewForm) {
        reviewForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const token = getCookie('token');
            const placeId = getPlaceIdFromURL();
            const reviewText = document.getElementById('review-text').value;
            const rating = document.getElementById('rating').value;

            try {
                const response = await fetch(`${API_BASE_URL}/places/${placeId}/reviews`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ review: reviewText, rating: rating })
                });

                if (response.ok) {
                    alert('Review submitted!');
                    window.location.href = `place.html?id=${placeId}`;
                } else {
                    alert('Failed to submit review');
                }
            } catch (error) {
                alert('Connection error');
            }
        });
    }

    if (priceFilter) {
        priceFilter.addEventListener('change', (e) => {
            const val = e.target.value;
            document.querySelectorAll('.place-card').forEach(card => {
                const price = parseFloat(card.getAttribute('data-price'));
                card.style.display = (val === 'All' || price <= parseFloat(val)) ? 'block' : 'none';
            });
        });
    }

    const token = checkAuthentication();
    const placeId = getPlaceIdFromURL();

    if (placesContainer && token) fetchPlaces(token);
    if (window.location.pathname.includes('place.html') && placeId) fetchPlaceDetails(token, placeId);
});
