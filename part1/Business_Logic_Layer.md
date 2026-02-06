classDiagram
    %% Base Entity Definition
    class BaseEntity {
        +id: UUID
        -createdAt: DateTime
        -updatedAt: DateTime
    }

    %% User Hierarchy
    class User {
        +user_id: int UUID4
        +first_name: str
        +last_name: str
        +email: str
        +password: str
        +phone_number: int
        +is_admin: bool
        +is_owner: bool
        +create_at: date
        +update_at: date
        +register(type): type
        +updateProfile(String firstName, String lastName, String email): User
        +deleted(UUID user_id): Boolean
        +viewPlaceRoom(type): type
        +bookRoom(type): type
        +updateBook(type): type
        +deleteBook(type): type
        +addReviews(review_id): str
        +authenticate(password: String): Boolean
    }
    
    class Admin {
        +admin_id: int PK
        ++is_admin: true
        +add_room(type): type
        +update_room(): void
        +delete_room(): void
    }

    class Owner {
        +owner_id: int PK
        ++is_owner: true
        +add_room(type): type
        +update_room(): void
        +delete_room(): void
    }

    %% Core Business Entities
    class Place {
        +place_id: int PK
        +title: String
        +description: String
        +price: Float
        +latitude: Float
        +longitude: Float
        +amenities: List
        +reviews: List
        +owner_id: int FK
        +city: String
        +create_at: date
        +update_at: date
        +createPlace(string title, string description, Float price, list Amenitias, string city): Place
        +updated(string title, string description, Float price, list Amenitias, strng city): Place
        +deleted(UUID place_id): Boolean
        +listedReview(Review review): list~Review~
        +listedAmenities(Amenity amenity): List~Amenity~
        +cancelBooking(type): type
        +updateBooking(type): type
    }

    class Room {
        +room_id: int PK
        +type: str
        +price: int
        +Avalibalty: bool
        +create_at: date
        +update_at: date
        +viewRoomDetails(int room_id): str
    }

    class Booking {
        +booking_id: int PK
        +user_id: int FK
        +place_id: int FK
        +room_id: int FK
        +Room: Room
        +create_at: date
        +update_at: date
        +method(type): type
    }

    class Review {
        +review_id: UUID4
        +user_id: int
        +place_id: int FK
        +comment: String
        +rating: Float
        +create_at: date
        +update_at: date
        +createReview(UUID user_id, UUID Place_id, comment: String, rating: Float): Review
        +updateReview(reviewId: UUID, newComment: String, newRating: Float): Review
        +deleteReview(reviewId: UUID): Boolean
        +viewListReviews(int place_id): list
    }

    class Amenity {
        +amentie_id: int UUID4
        +name: String
        +description: str
        +create_at: date
        +update_at: date
        +created(name: String, description: String): Amenity
        +update(name: String, description: String): Amenity
        +deleted(UUID amenity_id): Boolean
        +viewListAmenties(int amentie_id): str
    }

    %% Relationships and Inheritance
    %% Inheritance from BaseEntity
    BaseEntity <|-- User
    BaseEntity <|-- Place
    BaseEntity <|-- Review
    BaseEntity <|-- Amenity

    %% User Inheritance
    User <|-- Admin
    User <|-- Owner

    %% Relationships
    User "1" --> "0..*" Booking : makes
    User "1" --> "1..*" Place : own
    User "1" --> "0..*" Review : write

    Place "1" --> "0..*" Booking : receives
    Place "1" --> "1..*" Room : contains
    Place "1" --> "1..*" Amenity : have
    Place "1" --> "0..*" Review : receive

    Room "1" --> "0..*" Booking : booked_in
