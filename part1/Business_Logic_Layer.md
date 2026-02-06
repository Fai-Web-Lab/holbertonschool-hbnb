# Detailed Class Diagram for Business Logic Layer

## Table of Contents
1. [Description](#description)
2. [Class Diagram](#class-diagram)
3. [Entities and Attributes](#entities-and-attributes)
4. [Key Relationships](#key-relationships)
5. [Design Decisions](#design-decisions)
6. [Author](#author)

---

## Description
This document provides a detailed visual and technical representation of the **Business Logic Layer** for the HBnB Evolution application. This layer acts as the "core" or "brain" of the system, where all business rules, data validation, and entity relationships are defined. 

The design focuses on the four primary entities: **User, Place, Review, and Amenity**, all of which inherit from a common base to ensure consistency, auditability, and clean code principles (DRY).

---

## Class Diagram

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

Key Attributes: email (must be unique), password (to be hashed), and is_admin for access control.

Methods: register() and update_profile() to manage user lifecycle.

3. Place
Represents the property listings created by Users.

Key Attributes: price (float for precision), latitude/longitude (for mapping), and owner_id for ownership tracking.

4. Review
Stores user feedback for specific places.

Key Attributes: rating (integer validation) and comment.

Constraint: Linked directly to both a specific User and a Place.

5. Amenity
Global features that can be assigned to places.

Key Attributes: name and description (e.g., "WiFi", "Pool").

Key Relationships
Inheritance (IS-A): Ensures all entities share the standard behavior of BaseModel.

One-to-Many (1:N): * One User can own multiple Places.

One User can write multiple Reviews.

One Place can receive multiple Reviews.

Many-to-Many (M:N): Places and Amenities share a complex relationship where many places can offer the same amenity, and one place can have many different amenities.

Design Decisions
Standardization: Implementing BaseModel ensures that every entity has a consistent structure, which is critical for the persistence layer later on.

Scalability: By decoupling Amenity from Place, we allow for global management of services without duplicating data.

Data Precision: Latitude and longitude are stored as floats to ensure compatibility with modern GPS and map APIs.

Security Integrity: The is_admin attribute is placed at the logic level to facilitate role-based authorization in the presentation layer.

Author
Mohammed Aloufi - GitHub Profile
