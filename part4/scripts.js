let allPlaces = [];

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const placesList = document.getElementById('places-list');
    const priceFilter = document.getElementById('price-filter');
    const placeInfo = document.getElementById('place-info');
    const reviewForm = document.getElementById('review-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            try {
                const response = await fetch('http://127.0.0.1:5000/api/v1/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                if (response.ok) {
                    const data = await response.json();
                    document.cookie = `token=${data.access_token}; path=/; max-age=604800`;
                    window.location.href = 'index.html';
                } else {
                    alert('Login failed: Invalid credentials');
                }
            } catch (error) {
                alert('Connection error');
            }
        });
    }

    if (placesList) checkAuthenticationIndex();

    if (priceFilter) {
        priceFilter.addEventListener('change', (event) => {
            const selectedPrice = event.target.value;
            if (selectedPrice === 'All') {
                displayPlaces(allPlaces);
            } else {
                const maxPrice = parseInt(selectedPrice, 10);
                const filteredPlaces = allPlaces.filter(place => place.price_per_night <= maxPrice);
                displayPlaces(filteredPlaces);
            }
        });
    }

    if (placeInfo) checkAuthenticationPlace();

    if (reviewForm) checkAuthenticationAddReview();
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function getPlaceIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

function checkAuthenticationIndex() {
    const token = getCookie('token');
    const loginLink = document.getElementById('login-link');
    if (!token) {
        if (loginLink) loginLink.style.display = 'block';
        window.location.href = 'login.html';
    } else {
        if (loginLink) loginLink.style.display = 'none';
        fetchPlaces(token);
    }
}

async function fetchPlaces(token) {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/v1/places/', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        let places = await response.json();
        if (places.length === 0) {
            places = [
                { id: '1', name: 'Al-Faisaliah Suite', price_per_night: 450 },
                { id: '2', name: 'Kingdom Tower Room', price_per_night: 600 },
                { id: '3', name: 'Diriyah Heritage Villa', price_per_night: 300 },
                { id: '4', name: 'Diplomatic Quarter Loft', price_per_night: 250 }
            ];
        }
        allPlaces = places;
        displayPlaces(allPlaces);
    } catch (error) {
        console.error(error);
    }
}

function displayPlaces(places) {
    const container = document.getElementById('places-list');
    if(!container) return;
    container.innerHTML = '';
    places.forEach((place, index) => {
        let imageNum = (index % 4) + 1;
        let imageSrc = imageNum === 4 ? 'p4.jpg' : `p${imageNum}.png`;
        const card = document.createElement('article');
        card.className = 'place-card';
        card.innerHTML = `
            <img src="${imageSrc}" alt="Property">
            <h3>${place.name}</h3>
            <p><strong>Price:</strong> $${place.price_per_night} per night</p>
            <a href="place.html?id=${place.id}" class="details-button">View Details</a>
        `;
        container.appendChild(card);
    });
}

function checkAuthenticationPlace() {
    const token = getCookie('token');
    const loginLink = document.getElementById('login-link');
    const addReviewSection = document.getElementById('add-review');
    const placeId = getPlaceIdFromURL();

    if (!token) {
        if (loginLink) loginLink.style.display = 'block';
        if (addReviewSection) addReviewSection.style.display = 'none';
    } else {
        if (loginLink) loginLink.style.display = 'none';
        if (addReviewSection) {
            addReviewSection.style.display = 'block';
            const reviewLink = addReviewSection.querySelector('a');
            if(reviewLink && placeId) reviewLink.href = `add_review.html?id=${placeId}`;
        }
    }
    
    if(placeId) fetchPlaceDetails(token, placeId);
}

async function fetchPlaceDetails(token, placeId) {
    try {
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const response = await fetch(`http://127.0.0.1:5000/api/v1/places/${placeId}`, { headers });
        let place = null;

        if (response.ok) {
             place = await response.json();
        } else {
             const mockPlaces = [
                { id: '1', name: 'Al-Faisaliah Suite', price_per_night: 450, description: 'Luxury suite with city view.', host: 'Mohammed', amenities: ['WiFi', 'Pool'] },
                { id: '2', name: 'Kingdom Tower Room', price_per_night: 600, description: 'Premium room high above the city.', host: 'Ali', amenities: ['Gym', 'Spa'] },
                { id: '3', name: 'Diriyah Heritage Villa', price_per_night: 300, description: 'Historic villa in Diriyah.', host: 'Saleem', amenities: ['Kitchen', 'Parking'] },
                { id: '4', name: 'Diplomatic Quarter Loft', price_per_night: 250, description: 'Modern loft in DQ.', host: 'Sami', amenities: ['AC', 'TV'] }
            ];
            place = mockPlaces.find(p => p.id === placeId);
        }

        if(place) displayPlaceDetails(place);
    } catch (error) {
        console.error(error);
    }
}

function displayPlaceDetails(place) {
    const infoContainer = document.getElementById('place-info');
    let imageNum = (parseInt(place.id) % 4) || 4; 
    let imageSrc = imageNum === 4 ? 'p4.jpg' : `p${imageNum}.png`;

    infoContainer.innerHTML = `
        <h1>${place.name}</h1>
        <img src="${imageSrc}" alt="Place Image" style="width:100%; max-width:800px; height:400px; object-fit:cover; border-radius:10px; margin-bottom:20px;">
        <p><strong>Host:</strong> ${place.host || 'Unknown'}</p>
        <p><strong>Price:</strong> $${place.price_per_night} per night</p>
        <p><strong>Description:</strong> ${place.description || 'No description available.'}</p>
        <p><strong>Amenities:</strong> ${(place.amenities || []).join(', ') || 'Not specified'}</p>
    `;
}

function checkAuthenticationAddReview() {
    const token = getCookie('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }
    
    const loginLink = document.getElementById('login-link');
    if (loginLink) loginLink.style.display = 'none';

    const placeId = getPlaceIdFromURL();
    const reviewForm = document.getElementById('review-form');
    
    reviewForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const reviewText = document.getElementById('review-text').value;
        submitReview(token, placeId, reviewText);
    });
}

async function submitReview(token, placeId, reviewText) {
    try {
        await fetch(`http://127.0.0.1:5000/api/v1/places/${placeId}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ text: reviewText, place_id: placeId })
        });

        alert('Review submitted successfully!');
        document.getElementById('review-form').reset();
        window.location.href = `place.html?id=${placeId}`;
        
    } catch (error) {
        console.error(error);
        alert('Connection error');
    }
}
