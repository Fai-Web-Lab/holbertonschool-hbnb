# Business Logic Layer – Detailed Class Diagram

## Overview
This section describes the detailed class diagram for the **Business Logic Layer** of the HBnB Evolution application.  
It provides a clear representation of the core entities, their attributes, methods, and the relationships between them, serving as a blueprint for the implementation phase.

The Business Logic Layer contains the core models and enforces the business rules of the application, independently of the presentation and persistence layers.

---

## Class Diagram

```mermaid
classDiagram
class BaseModel {
    +UUID id
    +DateTime created_at
    +DateTime updated_at
}

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

class Place {
    +String title
    +String description
    +Float price
    +Float latitude
    +Float longitude
    +create()
    +update()
    +delete()
}

class Review {
    +Integer rating
    +String comment
    +create()
    +update()
    +delete()
}

class Amenity {
    +String name
    +String description
    +create()
    +update()
    +delete()
}

BaseModel <|-- User
BaseModel <|-- Place
BaseModel <|-- Review
BaseModel <|-- Amenity

User "1" --> "0..*" Place : owns
User "1" --> "0..*" Review : writes
Place "1" --> "0..*" Review : has
Place "0..*" -- "0..*" Amenity : associated_with
