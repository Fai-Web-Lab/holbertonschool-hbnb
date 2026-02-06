# Detailed Class Diagram for Business Logic Layer

## Table of Contents
1. Overview  
2. Core Entities  
3. Class Relationships  
4. Diagram  
5. Explanatory Notes  

---

## Overview
The objective of this task is to design a detailed class diagram for the Business Logic Layer of the HBnB application.  
This diagram illustrates the internal structure of the core entities, including their attributes, methods, and relationships.

The class diagram provides a clear representation of the system’s business rules and serves as a reference for the implementation phase in later parts of the project.

---

## Core Entities

| Entity | Description |
|------|------------|
| User | Represents application users who can register, update their profiles, and interact with places and reviews. |
| Place | Represents properties listed by users, including pricing, location, and associated amenities. |
| Review | Represents user feedback for places, including ratings and comments. |
| Amenity | Represents features that can be associated with places. |
| BaseEntity | Provides shared attributes such as a unique identifier and audit timestamps for all entities. |

---

## Class Relationships
- A **User** can own multiple **Places**.
- A **User** can write multiple **Reviews**.
- A **Place** is owned by a single **User**.
- A **Place** can have multiple **Reviews**.
- A **Place** can be associated with multiple **Amenities**, and each **Amenity** can be linked to multiple **Places**.
- All entities inherit common attributes from **BaseEntity**.

---

## Diagram

```mermaid
classDiagram

class BaseEntity {
  +UUID id
  +datetime created_at
  +datetime updated_at
  +save()
  +update()
  +delete()
}

class User {
  +string first_name
  +string last_name
  +string email
  +string password
  +bool is_admin
  +register()
  +update_profile()
  +delete()
}

class Place {
  +string title
  +string description
  +float price
  +float latitude
  +float longitude
  +create()
  +update()
  +delete()
  +list()
}

class Review {
  +int rating
  +string comment
  +create()
  +update()
  +delete()
}

class Amenity {
  +string name
  +string description
  +create()
  +update()
  +delete()
  +list()
}

BaseEntity <|-- User
BaseEntity <|-- Place
BaseEntity <|-- Review
BaseEntity <|-- Amenity

User "1" --> "0..*" Place : owns
User "1" --> "0..*" Review : writes
Place "1" --> "0..*" Review : has
Place "*" -- "*" Amenity : includes

