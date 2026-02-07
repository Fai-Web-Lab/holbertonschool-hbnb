# Sequence Diagrams for API Calls

## Contents
- [Diagrams](#diagrams)
- [Explanatory Notes](#explanatory-notes)
- [Author](#author)

## Diagrams  
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

### Shapes, Lines, and Arrows:
In a UML Sequence Diagram, every shape, line, and arrow has a specific technical meaning Based on the diagrams for the project, here is a breakdown of the notation used and how each element contributes to describing the system's behavior.

1. The Lifeline (Boxes and Vertical Dashed Lines):

Each vertical element represents a participant in the interaction.Rectangular Box (Head): Represents an Object or a Layer in the system (e.g., Browser, Presentation Layer, Business Logic).Vertical Dashed Line: This is the Lifeline. It represents the existence of the component over time. The interaction moves from top to bottom, representing the passage of time.

2. Activation Bars (Thin Vertical Rectangles):

The Shape: These are the thin "rectangles" placed on top of the lifelines.Meaning: An activation bar indicates that the component is currently active or performing a process. For example, in the "Place Creation" diagram, the Auth layer has a short activation bar because it only works during the token validation phase.Duration: When a bar ends, it means the component has finished its task for that specific part of the request.

3. Message Arrows (The Lines):

Arrows represent communication between components. Solid Line with Solid Arrowhead ($\rightarrow$): Represents a Synchronous Message. The sender (e.g., the Browser) sends a request and waits for the receiver (e.g., the API) to process it before moving on.Dashed Line with Open Arrowhead ($\dashrightarrow$): Represents a Return Message. This is used to pass data back to the original sender after a process is complete, such as the 201 Created response.Self-Loop Arrow: An arrow that starts and ends at the same activation bar (e.g., Validate place data). This represents a Self-Message or an internal method execution within that layer.

4. Combined Fragments:

The Alt box is visually divided into horizontal sections (often appearing as two or more "squares" or regions) separated by a dashed line. Each section represents a different path:

Upper Region (The "If" path): This region contains the interaction that occurs if the first condition (called a Guard) is met. In your registration diagram, this is labeled [User already exists].

Lower Region (The "Else" path): This region contains the interaction that occurs if the previous condition is false. In your diagram, this is labeled [New User].

5. Actors and Objects:

They are represented as participants in the interaction, but they serve distinct roles in the system's architecture.

- Actors (External Entities):
Shape: Represented by a stick figure.

Meaning: An Actor is an external entity that exists outside the software system. It initiates interactions with the application.

- Objects (Internal Components):
Shape: Represented by rectangular boxes at the top and bottom of the diagram.

Meaning: These represent internal components, layers, or specific instances of classes within the system.

6. Notes:

are specialized shapes used to provide additional context or clarify complex logic that cannot be easily captured by arrows alone.

The Shape of a Note:
Visual Appearance: A Note is represented as a rectangle with a folded corner (dog-eared), resembling a piece of paper.

Placement: It can be placed over a single lifeline or spanned across multiple lifelines to describe a specific interaction.




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