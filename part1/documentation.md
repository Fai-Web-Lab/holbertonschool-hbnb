## Detailed Class Diagram for Business Logic Layer

### Class Diagram
**Tool used:** Mermaid.js

```mermaid
classDiagram
    %% Base Class for common attributes
    class BaseModel {
        +UUID id
        +DateTime created_at
        +DateTime updated_at
        +save()
        +to_dict()
    }

    %% User Entity
    class User {
        +String first_name
        +String last_name
        +String email
        +String password
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
        +List amenities
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

    %% Relationships and Inheritance
    BaseModel <|-- User
    BaseModel <|-- Place
    BaseModel <|-- Review
    BaseModel <|-- Amenity

    User "1" -- "0..*" Place : Owns
    User "1" -- "0..*" Review : Writes
    Place "1" -- "0..*" Review : Receives
    Place "*" -- "*" Amenity : Has
Explanatory Notes
BaseModel (Abstraction):

Acts as the parent class for all entities to enforce the DRY (Don't Repeat Yourself) principle.

It automatically manages the unique identifier (id as UUID) and audit timestamps (created_at, updated_at) for every object created in the system.

Key Entities:

User: Represents the system's actors. It includes is_admin to distinguish between regular users and administrators.

Place: Holds the property details (price, location, etc.) and links to a specific owner_id.

Review: Functions as a link between a User and a Place, storing the rating and comment.

Amenity: Represents features (like Wifi, Pool) that can be associated with multiple places.

Relationships:

Inheritance: All entities inherit from BaseModel.

Composition/Association:

User - Place: A One-to-Many relationship (A user can own multiple places).

Place - Amenity: A Many-to-Many relationship (A place has many amenities, and an amenity belongs to many places).

User/Place - Review: A User writes many reviews; a Place rec
