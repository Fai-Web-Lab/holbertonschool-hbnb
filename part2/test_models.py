from models.user import User
from models.place import Place
from models.review import Review
from models.amenity import Amenity


def test_hbnb_models():
    print("Start testing HBnB models")

    try:
        user1 = User(first_name="Fai", last_name="Saleh", email="fai@test.com")
        print(f"User created successfully: {user1.first_name}")

        try:
            User(first_name="Fai", last_name="Saleh", email="faiemail.com")
        except ValueError:
            print("Error: Unvalid Email!")
    except Exception as e:
        print(f"Failed user test: {e}")

    try:
        place1 = Place(title="Calm Villa", description="Great", price=500,
                       latitude=24.7136, longitude=46.6753, owner=user1)
        print(f"Place created successfully: {place1.title}")

        try:
            place1.price = -10
        except ValueError:
            print("Unvalid: negative value!")
    except Exception as e:
        print(f"Failed place test: {e}")

    try:
        review1 = Review(text="Excelent!", rating=5, place=place1, user=user1)
        place1.add_review(review1)
        print(f"Review created successfully: {review1.rating}/5")

        try:
            Review(text="Bad", rating=10, place=place1, user=user1)
        except ValueError:
            print("Failed: rating value is more than 5!")

        if review1 in place1.reviews:
            print("Review is conceted with place correctly")
    except Exception as e:
        print(f"Failed review test: {e}")

    try:
        wifi = Amenity(name="Wi-Fi")
        place1.add_amenity(wifi)
        if wifi in place1.amenities:
            print(f"Amenity added '{wifi.name}' to place successfully.")
    except Exception as e:
        print(f"Failed amenity test: {e}")

    print("\n All test were done successfully!")


if __name__ == "__main__":
    test_hbnb_models()
