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
