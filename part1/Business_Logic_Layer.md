# Table of Contents
1. Description
2. Class Diagram
3. Entities and Attributes
4. Key Relationships
5. Design Decisions
6. Author

## Description
This document provides a detailed visual and technical representation of the Business Logic Layer for the HBnB Evolution application. This layer acts as the "core" or "brain" of the system, where all business rules, data validation, and entity relationships are defined.

The design focuses on the four primary entities: User, Place, Review, and Amenity, all of which inherit from a common base to ensure consistency, auditability, and clean code principles (DRY).

## Class Diagram
Unable to render rich display

Parse error on line 59:
...elThe foundational class for all system
----------------------^
Expecting 'NEWLINE', 'EOF', 'SQS', 'STR', 'DOT', 'GENERICTYPE', 'LABEL', 'STRUCT_START', 'STRUCT_STOP', 'STYLE_SEPARATOR', 'ANNOTATION_END', 'ALPHA', 'AGGREGATION', 'EXTENSION', 'COMPOSITION', 'DEPENDENCY', 'LOLLIPOP', 'LINE', 'DOTTED_LINE', 'CALLBACK_NAME', 'HREF', 'NUM', 'MINUS', 'UNICODE_TEXT', 'BQUOTE_STR', got 'CLASS'

For more information, see https://docs.github.com/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams#creating-mermaid-diagrams

```mermaid
classDiagram
    class BaseModel {
        +UUID id
        +datetime created_at
        +datetime updated_at
        +save()
        +to_dict()
    }

    class User {
        +string first_name
        +string last_name
        +string email
        +string password
        +boolean is_admin
        +register()
        +update_profile()
    }

    class Place {
        +string title
        +string description
        +float price
        +float latitude
        +float longitude
        +string owner_id
        +create()
        +update()
        +list_all()
    }

    class Review {
        +string place_id
        +string user_id
        +int rating
        +string comment
        +create()
        +update()
    }

    class Amenity {
        +string name
        +string description
        +create()
        +list_all()
    }

    User --|> BaseModel : Inheritance
    Place --|> BaseModel : Inheritance
    Review --|> BaseModel : Inheritance
    Amenity --|> BaseModel : Inheritance

    User "1" -- "0..*" Place : owns
    User "1" -- "0..*" Review : writes
    Place "1" -- "0..*" Review : has
    Place "0..*" -- "0..*" Amenity : contains
Entities and Attributes
1. BaseModel
The foundational class for all system entities. It centralizes:

id: A unique identifier (UUID4) for every object.

created_at / updated_at: Automatic timestamps for tracking and auditing.

2. User
Manages system access and identity.

Key Attributes: email (unique), password (hashed), and is_admin for access control.

Methods: register() and update_profile().

3. Place
Represents the property listings created by Users.

Key Attributes: price (float), latitude / longitude (precision mapping), and owner_id.

4. Review
Stores user feedback for specific places.

Key Attributes: rating (integer 1-5) and comment.

Constraint: Linked to both a User and a Place.

5. Amenity
Global features that can be assigned to places.

Key Attributes: name and description.

Key Relationships
Inheritance (IS-A)
All entities share the standard behavior of BaseModel.

One-to-Many (1:N)
One User can own multiple Places.

One User can write multiple Reviews.

One Place can receive multiple Reviews.

Many-to-Many (M:N)
Places and Amenities share a relationship where many places can offer the same amenity.

Design Decisions
Standardization: Using BaseModel ensures a consistent structure for the persistence layer.

Scalability: Decoupling Amenity from Place allows global management without data duplication.

Security: The is_admin flag is at the logic level to facilitate role-based authorization.

Author
Mohammed Aloufi - GitHub Profile
