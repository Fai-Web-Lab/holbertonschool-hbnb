# Detailed Class Diagram for Business Logic Layer

## Table of Contents
1. [Introduction](#1-introduction)
2. [Entities and Attributes Specification](#2-entities-and-attributes-specification)
3. [Class Diagram](#3-class-diagram)

---

### 1. Introduction
The **Detailed Class Diagram** serves as the blueprint for the Business Logic Layer of the HBnB Evolution application. It visualizes the system's static structure by defining the core entities, their internal attributes, methods, and the relationships between them.

### 2. Entities and Attributes Specification

Below is the detailed specification of each class, including attributes and methods.

**Class: BaseModel**
* **Attributes:**
    * `+ id`: String (UUID4) - Unique identifier.
    * `+ created_at`: DateTime - Creation timestamp.
    * `+ updated_at`: DateTime - Last update timestamp.
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
    * `+ register()`: User
    * `+ update_profile(data)`: void
    * `+ delete()`: void

**Class: Place** (Inherits from BaseModel)
* **Attributes:**
    * `+ title`: String
    * `+ description`: String
    * `+ price`: Float
    * `+ latitude`: Float
    * `+ longitude`: Float
    * `+ owner_id`: String (FK)
    * `+ amenities`: List<Amenity>
* **Methods:**
    * `+ create()`: Place
    * `+ update(data)`: void
    * `+ delete()`: void
    * `+ list()`: List<Place>

**Class: Review** (Inherits from BaseModel)
* **Attributes:**
    * `+ rating`: Float
    * `+ comment`: String
    * `+ user_id`: String (FK)
    * `+ place_id`: String (FK)
* **Methods:**
    * `+ create()`: Review
    * `+ update(data)`: void
    * `+ delete()`: void
    * `+ list_by_place(place_id)`: List<Review>

**Class: Amenity** (Inherits from BaseModel)
* **Attributes:**
    * `+ name`: String
    * `+ description`: String
* **Methods:**
    * `+ create()`: Amenity
    * `+ update(data)`: void
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
