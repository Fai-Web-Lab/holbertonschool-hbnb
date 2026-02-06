# Detailed Class Diagram for Business Logic Layer

## Table of Contents
- [1. Description](#1-description)
- [2. Entities and Attributes](#2-entities-and-attributes)
- [3. Class Diagram](#3-class-diagram)
- [4. Explanatory Notes](#4-explanatory-notes)
- [5. Author](#5-author)

---

## 1. Description
The objective of this task is to design a **detailed class diagram** for the Business Logic layer of the HBnB application. This layer serves as the "brain" of the system, encapsulating the core entities and their complex relationships.

---

## 2. Entities and Attributes

| Entity | Attributes | Responsibilities |
|-------|------------|-----------------|
| **Base Entity** | `id`, `createdAt`, `updatedAt` | Providing unique identification and audit timestamps. |
| **User** | `first_name`, `email`, `is_admin` | Handles registration and authentication logic. |
| **Place** | `title`, `price`, `latitude`, `longitude` | Represents property listings and associations. |
| **Review** | `comment`, `rating` | Stores feedback provided by users for places. |
| **Amenity** | `name`, `description` | Represents global features linked to places. |

---

## 3. Class Diagram



```mermaid
classDiagram
    class BaseEntity {
        +UUID id
        +DateTime createdAt
        +DateTime updatedAt
    }

    class User {
        +String first_name
        +String last_name
        +String email
        +String password
        +Boolean is_admin
        +authenticate(password, Boolean)
        +updateProfile(firstName, lastName, email) User
        +deleted(UUID user_id) Boolean
    }

    class Place {
        +string title
        +string description
        +Float price
        +Float latitude
        +Float longitude
        +List amenity
        +List reviews
        +User owner
        +String city
        +createPlace(title, description, price, Amenities, city) Place
        +updated(title, description, price, Amenities, city) Place
        +deleted(UUID place_id) Boolean
        +listedReview(Review review) List~Review~
        +listedAmenities(Amenity amenity) List~Amenity~
    }

    class Review {
        +String comment
        +Float rating
        +User user
        +Place place
        +createReview(user_id, place_id, comment, rating) Review
        +updateReview(reviewId, newComment, newRating) Review
        +deleteReview(reviewId) Boolean
    }

    class Amenity {
        +string name
        +str description
        +created(name, description) Amenity
        +update(name, description) Amenity
        +deleted(UUID amenity_id) Boolean
    }

    User --|> BaseEntity : Inheritance
    Place --|> BaseEntity : Inheritance
    Review --|> BaseEntity : Inheritance
    Amenity --|> BaseEntity : Inheritance

    User "1" *-- "1..*" Place : owner
    Place "1" *-- "0..*" Review : has
    Place "0..*" -- "0..*" Amenity : association
    User "1" -- "0..*" Review : write
4. Explanatory Notes
Key Relationships Breakdown
Inheritance: All entities inherit from BaseEntity for ID management.

Composition (User → Place): Marked by the filled diamond. A Place cannot exist without an owner.

Composition (Place → Review): Reviews are strictly bound to the Place lifecycle.

Association (Place ↔ Amenity): A flexible many-to-many relationship.


