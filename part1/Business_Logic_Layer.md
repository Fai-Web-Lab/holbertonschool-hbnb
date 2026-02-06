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
