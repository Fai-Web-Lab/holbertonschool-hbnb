# Detailed Class Diagram for Business Logic Layer

## Table of Contents
1. [Introduction](#1-introduction)
2. [Entities and Attributes](#2-entities-and-attributes)
3. [Class Diagram](#3-class-diagram)
4. [Explanatory Notes](#4-explanatory-notes)
5. [Author](#author)

---

### 1. Introduction
The **Detailed Class Diagram** serves as the blueprint for the Business Logic Layer of the HBnB Evolution application. It visualizes the system's static structure by defining the core entities, their internal attributes, methods, and the relationships between them. This diagram ensures that the implementation follows the Object-Oriented Programming (OOP) principles and adheres to the project's business rules.

### 2. Entities and Attributes
The Business Logic Layer consists of the following key classes:

| Class | Type | Responsibilities |
| :--- | :--- | :--- |
| **BaseModel** | Parent Class | Acts as the base for all other entities. It manages the unique identifier (`id`) and audit timestamps (`created_at`, `updated_at`). |
| **User** | Entity | Represents the system users. Stores authentication data (`email`, `password`), profile info, and administrative status (`is_admin`). |
| **Place** | Entity | Represents a property listing. Contains details like location (`lat`, `long`), price, and description. It is linked to a specific Owner (User). |
| **Review** | Entity | Represents feedback left by a user for a place. Contains a rating and a text comment. |
| **Amenity** | Entity | Represents features available at a place (e.g., WiFi, Pool). Can be shared across multiple places. |

### 3. Class Diagram
**Tool used:** mermaid.js

```mermaid
classDiagram
    %% Base Class (Parent)
    class BaseModel {
        +String id
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
        +float price
        +float latitude
        +float longitude
        +String owner_id
        +List~Amenity~ amenities
        +create()
        +update()
        +delete()
        +list()
    }

    %% Review Entity
    class Review {
        +float rating
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

    %% Associations and Compositions
    User "1" --> "0..*" Place : owns
    User "1" --> "0..*" Review : writes
    Place "1" *-- "0..*" Review : has
    Place "0..*" o-- "0..*" Amenity : has_amenities
