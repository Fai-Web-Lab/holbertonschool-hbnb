# Detailed Class Diagram for Business Logic Layer

## Table of Contents
1. [Introduction](#1-introduction)
2. [Entities and Attributes Specification](#2-entities-and-attributes-specification)
3. [Class Diagram](#3-class-diagram)
4. [Explanatory Notes](#4-explanatory-notes)
5. [Author](#author)

---

### 1. Introduction
The **Detailed Class Diagram** serves as the blueprint for the Business Logic Layer of the HBnB Evolution application. It visualizes the system's static structure by defining the core entities, their internal attributes, methods, and the relationships between them.

### 2. Entities and Attributes Specification

Below is the detailed specification of each class, structured as requested.

**Class: BaseModel**
* **Attributes:**
    * `+ id`: UUID (PK)
    * `+ created_at`: DateTime
    * `+ updated_at`: DateTime
* **Methods:**
    * `+ save()`: void
    * `+ to_dict()`: dict

**Class: User** (Inherits from BaseModel)
* **Attributes:**
    * `+ email`: String
    * `+ password`: String
    * `+ first_name`: String
    * `+ last_name`: String
    * `+ is_admin`: Boolean
* **Methods:**
    * `+ register(email, password)`: User
    * `+ update_profile(data)`: User
    * `+ delete()`: void

**Class: Place** (Inherits from BaseModel)
* **Attributes:**
    * `+ title`: String
    * `+ description`: String
    * `+ price`: Float
    * `+ latitude`: Float
    * `+ longitude`: Float
    * `+ owner_id`: UUID (FK)
    * `+ amenities`: List<Amenity>
* **Methods:**
    * `+ create(data)`: Place
    * `+ update(data)`: Place
    * `+ delete()`: void
    * `+ list()`: List<Place>

**Class: Review** (Inherits from BaseModel)
* **Attributes:**
    * `+ rating`: Float
    * `+ comment`: String
    * `+ user_id`: UUID (FK)
    * `+ place_id`: UUID (FK)
* **Methods:**
    * `+ create(user_id, place_id, data)`: Review
    * `+ update(data)`: Review
    * `+ delete()`: void
    * `+ list_by_place(place_id)`: List<Review>

**Class: Amenity** (Inherits from BaseModel)
* **Attributes:**
    * `+ name`: String
    * `+ description`: String
* **Methods:**
    * `+ create(name)`: Amenity
    * `+ update(data)`: Amenity
    * `+ delete()`: void
    * `+ list()`: List<Amenity>

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
