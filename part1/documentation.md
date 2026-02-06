## Business Logic Layer

### Overview
The Business Logic Layer is the core of the **HBnB Evolution** application. It serves as the intermediary between the Presentation Layer and the Persistence Layer. Its primary responsibility is to define the system's entities, enforce business rules (such as data validation and ownership constraints), and ensure data integrity before any information is stored in the database.

### Detailed Class Diagram
The following UML class diagram depicts the static structure of the Business Logic Layer. It details the key entities, their attributes, methods, and the relationships that bind them, adhering to the project's requirements.

**Tool used:** Mermaid.js

```mermaid
classDiagram
    %% Base Class for common attributes
    class BaseModel {
        +String id
        +DateTime created_at
        +DateTime updated_at
        +save()
        +to_dict()
    }

    %% User Entity
    class User {
        +String email
        +String password
        +String first_name
        +String last_name
        +Boolean is_admin
        +register()
        +update_profile()
        +delete()
    }

    %% Place Entity
    class Place {
        +String title
        +String description
        +Float price
        +Float latitude
        +Float longitude
        +String owner_id
        +create()
        +update()
        +delete()
        +list()
    }

    %% Review Entity
    class Review {
        +Integer rating
        +String comment
        +String user_id
        +String place_id
        +create()
        +update()
        +delete()
        +list_by_place()
    }

    %% Amenity Entity
    class Amenity {
        +String name
        +String description
        +create()
        +update()
        +delete()
        +list()
    }

    %% Inheritance Relationships
    BaseModel <|-- User
    BaseModel <|-- Place
    BaseModel <|-- Review
    BaseModel <|-- Amenity

    %% Association Relationships
    User "1" -- "0..*" Place : owns
    User "1" -- "0..*" Review : writes
    Place "1" -- "0..*" Review : receives
    
    %% Many-to-Many Relationship
    Place "*" -- "*" Amenity : has
Explanatory Notes
1. Entity Design & Architecture
BaseModel (Abstraction):

Purpose: Acts as a superclass to enforce the DRY (Don't Repeat Yourself) principle.

Function: Automatically handles the generation of unique identifiers (UUID4) and maintains audit timestamps (created_at, updated_at) for every object in the system.

User: Represents the actors within the system. It encapsulates authentication data (email, password) and role management via the is_admin flag.

Place: The central entity representing the property listings. It holds business data (price, location) and links to the owner.

Review: A relational entity that captures feedback, linking a specific User to a specific Place with a rating and comment.

Amenity: Represents reusable features (e.g., WiFi, Pool) that can be associated with multiple places independent of the places themselves.

2. Relationship Logic
Inheritance (<|--): All four main entities (User, Place, Review, Amenity) inherit from BaseModel. This ensures consistent ID and timestamp management across the entire application.

Associations:

User owns Place (1-to-Many): A strict ownership rule; a user can own multiple places, but a place belongs to exactly one user.

User writes Review (1-to-Many): A user can write multiple reviews.

Place receives Review (1-to-Many): A place can have multiple reviews attached to it.

Place has Amenities (Many-to-Many): Modeled to allow flexibility. A single amenity object (like "WiFi") can be linked to thousands of different places without duplication.
