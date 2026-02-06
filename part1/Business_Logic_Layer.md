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

Below is the detailed specification of each class, including attributes and methods.

**Class: Booking**
* **Attributes:**
    * `+ booking_id`: int (PK)
    * `+ user_id`: int (FK)
    * `+ place_id`: int (FK)
    * `+ room_id`: int (FK)
    * `+ create_at`: date
    * `+ update_at`: date
* **Methods:**
    * `+ method(type)`: type

**Class: Room**
* **Attributes:**
    * `+ room_id`: int (PK)
    * `+ type`: str
    * `+ price`: int
    * `+ Availability`: bool
    * `+ create_at`: date
    * `+ update_at`: date
* **Methods:**
    * `+ viewRoomDetails(room_id)`: str

**Class: User**
* **Attributes:**
    * `+ user_id`: int (UUID4)
    * `+ first_name`: str
    * `+ last_name`: str
    * `+ email`: str
    * `+ password`: str
    * `+ phone_number`: int
    * `+ is_admin`: bool
    * `+ is_owner`: bool
    * `+ create_at`: date
    * `+ update_at`: date
* **Methods:**
    * `+ register(type)`: type
    * `+ updateProfile(type)`: type
    * `+ deleted()`: void
    * `+ viewPlaceRoom(type)`: type
    * `+ bookRoom(type)`: type
    * `+ updateBook(type)`: type
    * `+ deleteBook(type)`: type
    * `+ addReviews(review_id)`: str

**Class: Admin** (Inherits from User)
* **Attributes:**
    * `+ admin_id`: int (PK)
    * `+ is_admin`: true
* **Methods:**
    * `+ add_room(type)`: type
    * `+ update_room()`: void
    * `+ delete_room()`: void

**Class: Owner** (Inherits from User)
* **Attributes:**
    * `+ owner_id`: int (PK)
    * `+ is_owner`: true
* **Methods:**
    * `+ add_room(type)`: type
    * `+ update_room()`: void
    * `+ delete_room()`: void

**Class: Place**
* **Attributes:**
    * `+ place_id`: int (PK)
    * `+ title`: int
    * `+ description`: str
    * `+ price`: float
    * `+ latitude`: float
    * `+ longitude`: float
    * `+ amenties`: list
    * `+ owner_id`: int (FK)
    * `+ create_at`: date
    * `+ update_at`: date
* **Methods:**
    * `+ created()`: void
    * `+ updated()`: void
    * `+ deleted()`: void
    * `+ listed()`: void
    * `+ cancelBooking(type)`: type
    * `+ updateBooking(type)`: type

**Class: Review**
* **Attributes:**
    * `+ review_id`: UUID4
    * `+ user_id`: int
    * `+ place_id`: int (FK)
    * `+ comment`: str
    * `+ rating`: float
    * `+ create_at`: date
    * `+ update_at`: date
* **Methods:**
    * `+ created()`: void
    * `+ updated()`: void
    * `+ deleted()`: void
    * `+ listed()`: void
    * `+ viewListReviews(place_id)`: list

**Class: Amenties**
* **Attributes:**
    * `+ amentie_id`: int (UUID4)
    * `+ name`: string
    * `+ description`: str
    * `+ create_at`: date
    * `+ update_at`: date
* **Methods:**
    * `+ viewListAmenties(amentie_id)`: str

### 3. Class Diagram
**Tool used:** mermaid.js

```mermaid
classDiagram
    %% Base Entities (Conceptually grouped attributes)
    class Booking {
        +int booking_id
        +int user_id
        +int place_id
        +int room_id
        +date create_at
        +date update_at
        +method(type)
    }

    class Room {
        +int room_id
        +str type
        +int price
        +bool Availability
        +date create_at
        +date update_at
        +viewRoomDetails(room_id)
    }

    class User {
        +int user_id
        +str first_name
        +str last_name
        +str email
        +str password
        +int phone_number
        +bool is_admin
        +bool is_owner
        +date create_at
        +date update_at
        +register(type)
        +updateProfile(type)
        +deleted()
        +viewPlaceRoom(type)
        +bookRoom(type)
        +updateBook(type)
        +deleteBook(type)
        +addReviews(review_id)
    }

    class Admin {
        +int admin_id
        +bool is_admin
        +add_room(type)
        +update_room()
        +delete_room()
    }

    class Owner {
        +int owner_id
        +bool is_owner
        +add_room(type)
        +update_room()
        +delete_room()
    }

    class Place {
        +int place_id
        +int title
        +str description
        +float price
        +float latitude
        +float longitude
        +list amenties
        +int owner_id
        +date create_at
        +date update_at
        +created()
        +updated()
        +deleted()
        +listed()
        +cancelBooking(type)
        +updateBooking(type)
    }

    class Review {
        +UUID4 review_id
        +int user_id
        +int place_id
        +str comment
        +float rating
        +date create_at
        +date update_at
        +created()
        +updated()
        +deleted()
        +listed()
        +viewListReviews(place_id)
    }

    class Amenties {
        +int amentie_id
        +string name
        +str description
        +date create_at
        +date update_at
        +viewListAmenties(amentie_id)
    }

    %% Inheritance
    User <|-- Admin
    User <|-- Owner

    %% Relationships
    User "1" --> "0..*" Booking : makes
    User "1" --> "0..*" Review : writes
    Owner "1" --> "0..*" Place : owns
    Place "1" --> "0..*" Booking : has
    Place "1" *-- "0..*" Review : includes
    Place "0..*" o-- "0..*" Amenties : features
    Place "1" *-- "0..*" Room : contains
    Booking "1" --> "1" Room : reserves
