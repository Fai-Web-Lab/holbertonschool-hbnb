## Simple Web Client
### Project Overview:
Connect the HTML/CSS/JS front-end to the Python/Flask RESTful API. This involves implementing user authentication (JWT), dynamic data rendering, and ensuring secure communication between the client and the server.

### Phase 1: Server-Side Configuration (Back-End)
**1.1.** CORS ManagementTo allow your browser (on port 8000) to talk to your API (on port 5000), you must configure Cross-Origin Resource Sharing.
- *Task*: Update __init__.py to use flask-cors.
- *Code Snippet*:
```python
CORS(app, resources={r"/api/v1/*": {"origins": "*"}}, supports_credentials=True)
```

**1.2.** JWT Error Customization
Provide clear JSON feedback when a token is missing or expired to help the JavaScript logic handle redirects.
- *Task*: Implement `@jwt.unauthorized_loader` and `@jwt.expired_token_loader.`

### Phase 2: Authentication System
**2.1.** Admin InitializationSince the database starts empty, you cannot log in.
- *Task*: Use `flask shell` to manually create the first Admin User.
- *Fields*: `email`, `password`, `first_name`, `last_name`, `is_admin`.

**2.2.** Login Logic
- *Task*: Intercept the login form submission using `event.preventDefault()`.
- *API Call*: `POST /api/v1/auth/login`.
- *Storage*: Store the returned `access_token` in a Cookie for persistence.

**2.3.** Signup Logic
- *Task*: Create a registration flow.
- *Requirement*: Ensure all mandatory model fields (including `last_name`) are collected and sent.
- *API Call*: `POST /api/v1/users/`.

### Phase 3: Dynamic Data Rendering
*3.1.* Displaying Places (Home Page)
- *Task*: Fetch all places once the user is authenticated.
- *Header*: Pass `Authorization: Bearer <token>` in the fetch request.
- *Logic*: Map through the JSON array and generate HTML cards for each place.

*3.2.* Place Details Page
- *Task*: Use `URLSearchParams` to get the `id` from the URL (e.g., `place.html?id=...`).
- *API Call*: `GET /api/v1/places/<place_id>`.
- *Features*: Display host info, description, and list of amenities.

### Phase 4: Review System
*4.1.* Displaying Reviews
- *Task*: Render the reviews list associated with a specific place.
- *Formatting*: Display the user's name and their comment clearly.

*4.2.* Posting a Review
- *Task*: Only show the "Add Review" form if a valid token exists.
- *API Call*: `POST /api/v1/places/<place_id>/reviews`.
- *Refresh*: Update the UI after a successful post.

### Technical Requirements Table

| Task | HTTP Method | Endpoint | Auth Required |
| -------- | -------- | -------- | ------------ |
| Login   | POST     | `/api/v1/auth/login` | No |
| Register | POST     | `/api/v1/users/` | No |
| List Places | GET | `/api/v1/places/` | Yes |
| Place Details | GET | `/api/v1/places/<id>` | Yes |
| Add Review | POST | `/api/v1/places/<id>/reviews` | Yes |

### Testing Checklist
- [ ] CORS: Are you getting a "CORS Policy" error in the console? (Check `run.py`).
- [ ] Tokens: Is the `token` appearing in the browser's Application -> Cookies tab?
- [ ] Redirects: Does the app send you to `login.html` if the token is expired?
- [ ] Network: Open DevTools (`F12`) and check the Network tab to see if the JSON payload is correct.
