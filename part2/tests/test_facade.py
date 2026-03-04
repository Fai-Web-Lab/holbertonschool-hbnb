import unittest
from app.services.facade import HBnBFacade

class TestFacade(unittest.TestCase):

    def setUp(self):
        self.facade = HBnBFacade()

        # Create a valid user for place/review tests
        self.user = self.facade.create_user({
            "first_name": "John",
            "last_name": "Doe",
            "email": "johnF@example.com"
        })

        # Create a valid amenity
        self.amenity = self.facade.create_amenity({"name": "WiFi"})

    # USER TESTS
    def test_create_user_duplicate_email(self):
        with self.assertRaises(ValueError):
            self.facade.create_user({
                "first_name": "Jane",
                "last_name": "Doe",
                "email": "johnF@example.com"
            })

    # PLACE TESTS
    def test_create_place_invalid_owner(self):
        data = {
            "title": "Test Place",
            "price": 100,
            "latitude": 10,
            "longitude": 20,
            "owner_id": "invalid-id",
            "amenities": []
        }
        with self.assertRaises(ValueError):
            self.facade.create_place(data)

    def test_create_place_invalid_amenity(self):
        data = {
            "title": "Test Place",
            "price": 100,
            "latitude": 10,
            "longitude": 20,
            "owner_id": self.user.id,
            "amenities": ["bad-id"]
        }
        with self.assertRaises(ValueError):
            self.facade.create_place(data)

    def test_update_place_invalid_owner(self):
        place = self.facade.create_place({
            "title": "Test",
            "price": 100,
            "latitude": 10,
            "longitude": 20,
            "owner_id": self.user.id,
            "amenities": []
        })

        with self.assertRaises(ValueError):
            self.facade.update_place(place.id, {"owner_id": "invalid-id"})

    # REVIEW TESTS
    def test_create_review_invalid_rating(self):
        place = self.facade.create_place({
            "title": "Test",
            "price": 100,
            "latitude": 10,
            "longitude": 20,
            "owner_id": self.user.id,
            "amenities": []
        })

        with self.assertRaises(ValueError):
            self.facade.create_review({
                "text": "Bad rating",
                "rating": 10,
                "user_id": self.user.id,
                "place_id": place.id
            })

    def test_update_review_invalid_text(self):
        place = self.facade.create_place({
            "title": "Test",
            "price": 100,
            "latitude": 10,
            "longitude": 20,
            "owner_id": self.user.id,
            "amenities": []
        })

        review = self.facade.create_review({
            "text": "Nice",
            "rating": 5,
            "user_id": self.user.id,
            "place_id": place.id
        })

        with self.assertRaises(ValueError):
            self.facade.update_review(review.id, {"text": ""})

    def test_delete_review_removes_from_place(self):
        place = self.facade.create_place({
            "title": "Test",
            "price": 100,
            "latitude": 10,
            "longitude": 20,
            "owner_id": self.user.id,
            "amenities": []
        })

        review = self.facade.create_review({
            "text": "Nice",
            "rating": 5,
            "user_id": self.user.id,
            "place_id": place.id
        })

        self.facade.delete_review(review.id)

        self.assertNotIn(review, place.reviews)

    def test_review_rating_boundaries(self):
        place = self.facade.create_place({
            "title": "Test",
            "price": 100,
            "latitude": 10,
            "longitude": 20,
            "owner_id": self.user.id,
            "amenities": []
        })

        review1 = self.facade.create_review({
            "text": "Low",
            "rating": 1,
            "user_id": self.user.id,
            "place_id": place.id
        })
        self.assertEqual(review1.rating, 1)

        review2 = self.facade.create_review({
            "text": "High",
            "rating": 5,
            "user_id": self.user.id,
            "place_id": place.id
        })
        self.assertEqual(review2.rating, 5)

if __name__ == "__main__":
    unittest.main()
