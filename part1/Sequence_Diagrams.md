# Sequence Diagrams for API Calls

## Contents
- [Sequence Diagrams](#sequence-diagrams)
- [Explanatory Notes](#explanatory-notes)
- [Author](#author)

## Sequence Diagrams  
`Tool used: Draw.io`

**1. User Registration:**  

![User Registration Sequence Diagram](https://github.com/Fai-Web-Lab/holbertonschool-hbnb/blob/357cd40047a7d64675e516357b61a1563686f6d4/part1/User%20Registration.png?raw=true)

**2. Place Creation:**  

![Place Creation Sequence Diagram](https://github.com/Fai-Web-Lab/holbertonschool-hbnb/blob/357cd40047a7d64675e516357b61a1563686f6d4/part1/Place%20Creation.png?raw=true)

**3. Review Submission:**  

![Review Submission Sequence Diagram](https://github.com/Fai-Web-Lab/holbertonschool-hbnb/blob/357cd40047a7d64675e516357b61a1563686f6d4/part1/Review%20Submission.png?raw=true)

**4. Fetching a List of Places:**  

![Fetching a List of Places Sequence Diagram](https://github.com/Fai-Web-Lab/holbertonschool-hbnb/blob/357cd40047a7d64675e516357b61a1563686f6d4/part1/Fetching%20a%20List%20of%20Places.png?raw=true)

## Explanatory Notes  
### 1- User Registration

- **Purpose:** 
This diagram illustrates the steps required to create a new user account while ensuring data integrity and uniqueness.

- **API Call:** POST /api/v1/users

- **Key Steps:**

The Presentation Layer (API) receives the registration data and passes it to the Business Logic for format validation.

The Business Logic layer coordinates with the Persistence Layer (DB) to check if the email already exists in the system.

- **Layer Contributions:**

Persistence Layer (DB): Performs the lookup. If the user is found, it returns an error; if not found, it executes the Save(new_user) command.

Business Logic: Acts as the decision-maker, returning either a 400 Bad Request (if user exists) or a 201 Created (if successful).

### 2- Place Creation

- **Purpose:** This diagram outlines the security and validation flow required to add a new place to the application.

- **API Call:** POST /api/v1/places

- **Key Steps:**

Before processing the data, the API sends the request to the Auth layer to validate the JWT Token.

Once the token is verified as valid, the Business Logic performs internal data validation.

- **Layer Contributions:**

Auth Layer: Ensures the user is authenticated and authorized to perform the action.

Business Logic: Ensures the place details meet the required business rules.

Persistence Layer (DB): Permanently inserts the record into the database.

### 3- Review Submission

- **Purpose:** This shows how the system handles user feedback, ensuring the user is logged in and the target entity exists.

- **API Call:** POST /api/v1/reviews

- **Key Steps:**

The request is first checked by the Auth layer. If the user is not authenticated, they receive a 401 Unauthorized and are redirected to login.

If authenticated, the Business Logic checks with the DB to ensure the place being reviewed actually exists.

- **Layer Contributions:**

Business Logic: Prevents "orphaned reviews" by verifying the existence of the place before saving.

Persistence Layer (DB): Confirms the place exists and then saves the review record.

### 4- Fetching a List of Places

- **Purpose:** This process describes how the system retrieves and filters data based on specific user criteria, such as a city.

- **API Call:** GET /api/v1/places?city=Riyadh

- **Key Steps:**

The Browser sends a GET request with a query parameter (city=Riyadh).

The API Layer extracts this filter and passes it to the Business Logic.

- **Layer Contributions:**

Business Logic: Formulates the search request for the database.

Persistence Layer (DB): Executes a filtered SQL query (e.g., SELECT * FROM places WHERE city='Riyadh') to ensure only relevant data is returned, optimizing performance.

## Author  
**Fai AlSharekh** 