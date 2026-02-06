Detailed Class Diagram for Business Logic Layer
Table of Contents

Overview

Core Entities

Class Relationships

Diagram

Explanatory Notes

1. Overview

The objective of this task is to design a detailed class diagram for the Business Logic Layer of the HBnB application.
This diagram illustrates the internal structure of the core entities, including their attributes, methods, and relationships.

The class diagram provides a clear representation of the system’s business rules and serves as a reference for the implementation phase in later parts of the project.

2. Core Entities
Entity	Description
User	Represents application users who can register, update their profiles, and interact with places and reviews.
Place	Represents properties listed by users, including pricing, location, and associated amenities.
Review	Represents user feedback for places, including ratings and comments.
Amenity	Represents features that can be associated with places.
BaseEntity	Provides shared attributes such as a unique identifier and audit timestamps for all entities.
3. Class Relationships

A User can own multiple Places.

A User can write multiple Reviews.

A Place is owned by a single User.

A Place can have multiple Reviews.

A Place can be associated with multiple Amenities, and each Amenity can be linked to multiple Places.

All entities inherit common attributes from BaseEntity.

4. Diagram
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

5. Explanatory Notes

User: Manages user-related data and actions such as registration, profile updates, and role identification.

Place: Encapsulates information related to property listings and their ownership.

Review: Connects users and places by storing ratings and comments.

Amenity: Represents reusable features that can enhance multiple places.

BaseEntity: Ensures consistency across all entities by providing unique identifiers and audit fields.

This class diagram accurately represents the structure of the Business Logic Layer and supports clear separation of responsibilities, maintainability, and scalability of the HBnB application.
