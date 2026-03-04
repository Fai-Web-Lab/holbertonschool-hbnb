import unittest
from app.models.user import User
from app.models.place import Place
from app.models.review import Review
from app.models.amenity import Amenity


class TestModels(unittest.TestCase):

    # User Tests

    def test_user_valid(self):
        user = User(first_name="John", last_name="Smith", email="johnm@example.com")
        self.assertEqual(user.first_name, "John")
        self.assertEqual(user.last_name, "Smith")
        self.assertFalse(user.is_admin)

    def test_user_invalid_email(self):
        with self.assertRaises(ValueError):
            User(first_name="John", last_name="Smith", email="invalid-email")

    def test_user_long_first_name(self):
        with self.assertRaises(ValueError):
            User(first_name="A" * 60, last_name="Smith", email="john@example.com")

    def test_user_long_last_name(self):
        with self.assertRaises(ValueError):
            User(first_name="John", last_name="B" * 60, email="john@example.com")

    # Place Tests

    def test_place_valid(self):
        place = Place(
            title="Cozy Apartment",
            price=120,
            latitude=25.0,
            longitude=45.0,
            owner_id="owner123"
        )
        self.assertEqual(place.title, "Cozy Apartment")
        self.assertEqual(place.price, 120)

    def test_place_invalid_price(self):
        with self.assertRaises(ValueError):
            Place("Test", -5, 20, 30, "owner123")

    def test_place_invalid_latitude(self):
        with self.assertRaises(ValueError):
            Place("Test", 100, 200, 30, "owner123")

    def test_place_invalid_longitude(self):
        with self.assertRaises(ValueError):
            Place("Test", 100, 20, 300, "owner123")

    # Review Tests

    def test_review_valid(self):
        review = Review(text="Great place!", rating=5, user_id="u1", place_id="p1")
        self.assertEqual(review.text, "Great place!")

    def test_review_invalid_text(self):
        with self.assertRaises(ValueError):
            Review(text="", rating=5, user_id="u1", place_id="p1")

    # Relationship Tests

    def test_place_add_review(self):
        place = Place("Test", 100, 10, 20, "owner")
        review = Review(text="Nice", rating=4, user_id="u1", place_id=place.id)

        place.add_review(review)
        self.assertIn(review, place.reviews)

    def test_place_add_review_wrong_place(self):
        place = Place("Test", 100, 10, 20, "owner")
        review = Review(text="Nice", rating=4, user_id="u1", place_id="wrong_place")

        with self.assertRaises(ValueError):
            place.add_review(review)

    def test_place_add_amenity(self):
        place = Place("Test", 100, 10, 20, "owner")
        amenity = Amenity(name="Wifi")

        place.add_amenity(amenity)
        self.assertIn(amenity, place.amenities)

    def test_place_add_amenity_duplicate(self):
        place = Place("Test", 100, 10, 20, "owner")
        amenity = Amenity(name="Pool")

        place.add_amenity(amenity)
        place.add_amenity(amenity)  # should not duplicate

        self.assertEqual(len(place.amenities), 1)


if __name__ == "__main__":
    unittest.main()
