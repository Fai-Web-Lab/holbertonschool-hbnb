document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';
    
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const reviewForm = document.getElementById('review-form');
    const loginLink = document.getElementById('login-link');
    const placesContainer = document.getElementById('places-list');
    const priceFilter = document.getElementById('price-filter');

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function checkAuthentication() {
        const token = getCookie('token');
        if (loginLink) {
            loginLink.style.display = token ? 'none' : 'block';
            if (token && !document.getElementById('logout-btn')) {
                const logoutBtn = document.createElement('button');
                logoutBtn.id = 'logout-btn';
                logoutBtn.innerText = 'Logout';
                logoutBtn.onclick = () => {
                    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    window.location.reload();
                };
                loginLink.parentNode.appendChild(logoutBtn);
            }
        }
        return token;
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                if (response.ok) {
                    document.cookie = `token=${data.access_token}; path=/; max-age=3600; SameSite=Lax`;
                    window.location.href = 'index.html';
                } else {
                    alert(data.error || data.message || 'Login failed');
                }
            } catch (err) {
                alert('Server connection failed');
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = {
                first_name: document.getElementById('first_name').value,
                last_name: document.getElementById('last_name')?.value || "Guest", // تأكدي من وجود الحقل في HTML
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            };

            try {
                const response = await fetch(`${API_BASE_URL}/users/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert('Registration successful!');
                    window.location.href = 'login.html';
                } else {
                    const data = await response.json();
                    alert(data.error || data.message || 'Signup failed');
                }
            } catch (err) {
                alert('Server connection failed');
            }
        });
    }

    checkAuthentication();
});
