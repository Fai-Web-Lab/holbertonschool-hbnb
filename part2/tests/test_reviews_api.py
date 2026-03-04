import unittest
from app import create_app
from app.services.facade import facade

class TestReviewAPI(unittest.TestCase):

    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()
        self.facade = facade

        self.facade.user_repo._storage = {}
        self.facade.place_repo._storage = {}
        self.facade.review_repo._storage = {}
        self.facade.amenity_repo._storage = {}

        self.user = self.facade.create_user({
            "first_name": "John",
            "last_name": "Doe",
            "email": "johnR@example.com"
        })

        self.place = self.facade.create_place({
            "title": "Test Place",
            "price": 100,
            "latitude": 10,
            "longitude": 20,
            "owner_id": self.user.id,
            "amenities": []
        })

    def test_create_review_success(self):
        res = self.client.post("/api/v1/reviews/", json={
            "text": "Great!",
            "rating": 5,
            "user_id": self.user.id,
            "place_id": self.place.id
        })
        self.assertEqual(res.status_code, 201)

    def test_create_review_invalid_rating(self):
        res = self.client.post("/api/v1/reviews/", json={
            "text": "Bad",
            "rating": 10,
            "user_id": self.user.id,
            "place_id": self.place.id
        })
        self.assertEqual(res.status_code, 400)

    def test_update_review_success(self):
        review = self.facade.create_review({
            "text": "Nice",
            "rating": 5,
            "user_id": self.user.id,
            "place_id": self.place.id
        })

        res = self.client.put(f"/api/v1/reviews/{review.id}", json={
            "text": "Updated",
            "rating": 4
        })
        self.assertEqual(res.status_code, 200)

    def test_update_review_invalid_rating(self):
        review = self.facade.create_review({
            "text": "Nice",
            "rating": 5,
            "user_id": self.user.id,
            "place_id": self.place.id
        })

        res = self.client.put(f"/api/v1/reviews/{review.id}", json={
            "rating": 0
        })
        self.assertEqual(res.status_code, 400)

    def test_delete_review_success(self):
        review = self.facade.create_review({
            "text": "Nice",
            "rating": 5,
            "user_id": self.user.id,
            "place_id": self.place.id
        })

        res = self.client.delete(f"/api/v1/reviews/{review.id}")
        self.assertEqual(res.status_code, 200)

    def test_create_review_missing_rating(self):
        res = self.client.post("/api/v1/reviews/", json={
            "text": "Nice place",
            "user_id": self.user.id,
            "place_id": self.place.id
        })
        self.assertEqual(res.status_code, 400)

    def test_delete_review_not_found(self):
        res = self.client.delete("/api/v1/reviews/not-found")
        self.assertEqual(res.status_code, 404)
