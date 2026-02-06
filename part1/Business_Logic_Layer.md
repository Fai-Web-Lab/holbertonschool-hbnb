classDiagram
    class BaseEntity {
        +id: UUID
        -createdAt: DateTime
        -updatedAt: DateTime
    }

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
        +updateProfile(type): type
        +deleted(): void
        +viewPlaceRoom(type): type
        +bookRoom(type): type
        +updateBook(type): type
        +deleteBook(type): type
        +addReviews(review_id): str
        +authenticate(password: String): Boolean
        +updateProfile(String firstName, String lastName, String email): User
        +deleted(UUID user_id): Boolean
    }
    BaseEntity <|-- User

    class Admin {
        +admin_id: int PK
        ++is_admin: true
        +add_room(type): type
        +update_room():
        +delete_room():
    }
    User <|-- Admin

    class Owner {
        +owner_id: int PK
        ++is_owner: true
        +add_room(type): type
        +update_room():
        +delete_room():
    }
    User <|-- Owner

    class Booking {
        +booking_id: int PK
        +user_id: int FK
        +place_id: int FK
        +room_id: int FK
        +Room
        +create_at: date
        +update_at: date
        +method(type): type
    }
    Booking "*" --> "1" User
    Booking "*" --> "1" Room
    Booking "*" --> "1" Place

    class Room {
        +room_id: int PK
        +type: str
        +price: int
        +Avalibalty: bool
        +create_at: date
        +update_at: date
        +viewRoomDetails(int room_id): str
    }

    class Place {
        +place_id: int PK
        +title: int
        +description: str
        +price: float
        +latitude: float
        +longitude: float
        +amenities: list
        +owner_id: int FK
        +create_at: date
        +update_at: date
        +created
        +updated
        +deleted
        +listed
        +cancelBooking(type): type
        +updateBooking(type): type
        +title: string
        +description: string
        +price: Float
        +latitude: Float
        +longitude: Float
        +amenity: List
        +reviews: List
        +city: String
        +owner: User
        +createPlace(string title, string description, Float price, list Amenitias, string city): Place
        +updated(string title, string description, Float price, list Amenitias, strng city): Place
        +deleted(UUID place_id): Boolean
        +listedReview(Review review): list<Review>
        +listedAmenities(Amenity amenity): List<Amenity>
    }
    BaseEntity <|-- Place
    Place "1" <-- "*" Room : have
    Place "1" --> "*" Amenity : have
    Place "1" --> "*" Review : receive

    class Review {
        +review_id: UUID4
        +user_id: int
        +place_id: int FK
        +comment: str
        +rating: float
        +create_at: date
        +update_at: date
        +created
        +updated
        +deleted
        +listed
        +viewListReviews(int place_id): list
        +comment: String
        +rating: Float
        +user: User
        +place: Place
        +createReview(UUID user_id, UUID Place_id, comment: String, rating: Float): Review
        +updateReview(reviewId: UUID, newComment: String, newRating: Float): Review
        +deleteReview(reviewId: UUID): Boolean
    }
    BaseEntity <|-- Review
    Review "*" --> "1" User : write
    Review "*" --> "1" Place : receive

    class Amenity {
        +amentie_id: int UUID4
        +name: string
        +description: str
        +create_at: date
        +update_at: date
        +viewListAmenties(int amentie_id): str
        +name: string
        +description: str
        +created(name: String, description: String): Amenity
        +update(name: String, description: String): Amenity
        +deleted(UUID amenity_id): Boolean
    }
    BaseEntity <|-- Amenity

    User "1" --> "*" Place : own
    Review "*" --> "1" User : write
