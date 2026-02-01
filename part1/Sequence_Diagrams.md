# Sequence Diagrams for API Calls

## Table of Contents
- [Description](#description)
- [System Architecture](#system-architecture)
- [Sequence Diagrams](#sequence-diagrams)
- [Explanatory Notes](#explanatory-notes)
- [Author](#author)

## Description  
`Sequence diagrams` are one of the four types of interaction diagrams in UML. They aim to visualize the interactions between objects within a use case, representing system behavior. They help developers design and analyze systems, understand complexity, and illustrate how different parts of a system work together from the initial user interaction at the presentation layer, through business logic processing, and finally to data persistence. In summary, they show how different components of a system interact in a specific sequence to accomplish a task.

## System Architecture  
**1. Presentation Layer (Services/API):**  
The entry point for all client requests. It handles HTTP routing, authentication headers, and sends the final JSON response back to the user.

**2. Business Logic Layer (Models/Services):**   
The "brain" of the app. This layer validates data (e.g., checking if an email is unique or if a price is positive) and applies business rules before passing data down.

**3. Persistence Layer (Database/Repository):**  
The storage engine. It is responsible for the CRUD (Create, Read, Update, Delete) operations within the database.

## Sequence Diagrams  
`Tool used: mermaid.ai`

**1. User Registration:**  
```
sequenceDiagram
    participant User
    participant API as Presentation Layer
    participant Logic as Business Logic
    participant DB as Persistence Layer

    User->>API: POST /users (registration data)
    API->>Logic: validateUser(data)
    
    alt User already exists
        Logic-->>API: Error: User already exists
        API-->>User: 400 Bad Request
    else New User
        Logic->>DB: save(new_user)
        DB-->>Logic: Confirm Saved
        Logic-->>API: User Created Object
        API-->>User: 201 Created (User Data)
    end
```
![User Registration Sequence Diagram](https://github.com/Fai-Web-Lab/holbertonschool-hbnb/blob/6037ba500df4cd2a4f9dd70aa70c753328ce1004/part1/User%20Registration.png?raw=true)

**2. Place Creation:**  
```
sequenceDiagram
    participant Owner as User
    participant API as Presentation Layer
    participant Logic as Business Logic
    participant DB as Persistence Layer

    Owner->>API: POST /places (place details)
    API->>Logic: validatePlace(details)
    
    alt Missing Required Fields
        Logic-->>API: Error: Incomplete Data
        API-->>Owner: 400 Bad Request
    else Valid Data
        Logic->>DB: storePlace(details)
        DB-->>Logic: Success
        Logic-->>API: Place Object
        API-->>Owner: 201 Created
    end
```
![Place Creation Sequence Diagram](https://github.com/Fai-Web-Lab/holbertonschool-hbnb/blob/6037ba500df4cd2a4f9dd70aa70c753328ce1004/part1/Place%20Creation.png?raw=true)

**3. Review Submission:**  
```
sequenceDiagram
    participant User
    participant API
    participant Logic
    participant DB

    User->>API: POST /places/{id}/reviews
    API->>Logic: checkPermission(user, place)
    
    opt Place doesn't exist
        Logic-->>API: 404 Not Found
        API-->>User: Error
    end

    Logic->>DB: addReview(rating, comment)
    DB-->>Logic: OK
    Logic-->>API: Review Summary
    API-->>User: 201 Created
```
![Review Submission Sequence Diagram](https://github.com/Fai-Web-Lab/holbertonschool-hbnb/blob/6037ba500df4cd2a4f9dd70aa70c753328ce1004/part1/Review%20Submission.png?raw=true)

**4. Fetching a List of Places:**  
```
sequenceDiagram
    participant User
    participant API
    participant Logic
    participant DB

    User->>API: GET /places?city=Paris
    API->>Logic: parseFilters(city)
    Logic->>DB: queryPlaces(criteria)
    DB-->>Logic: List of Places
    Logic-->>API: Filtered Objects
    API-->>User: 200 OK (JSON List)
```
![Fetching a List of Places Sequence Diagram](https://github.com/Fai-Web-Lab/holbertonschool-hbnb/blob/6037ba500df4cd2a4f9dd70aa70c753328ce1004/part1/Fetching%20a%20List%20of%20Places.png?raw=true)

## Explanatory Notes  
**Key Flow Breakdown**  

- Request Initiation: Every flow begins at the Presentation Layer, which acts as a gatekeeper.

- Validation Gate: Before touching the database, the Business Logic Layer performs crucial checks. For example, in User Registration, it ensures no duplicate emails exist.

- Data Persistence: The Persistence Layer is only reached if all business rules are satisfied, ensuring that the database remains clean and accurate.

- Response Cycle: The system uses a "bottom-up" response flow where the Database confirms to the Logic, the Logic confirms to the API, and the API finally notifies the User.  

**Strategic Use of Fragments**  

- Alt Fragments: Used in Registration and Place Creation to handle "Success" vs "Failure" scenarios. This is vital for showing how the API handles errors like 400 Bad Request.

- Opt Fragments: Used in Review Submission to show conditional checks, such as verifying if a place exists before allowing a review.

## Author  
**Fai AlSharekh** - [GitHub](https://github.com/Fai-Web-Lab)