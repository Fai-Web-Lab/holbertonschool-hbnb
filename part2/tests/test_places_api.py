import unittest
from app import create_app
from app.services.facade import facade

class TestPlaceAPI(unittest.TestCase):

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
            "email": "johnP@example.com"
        })

        self.amenity = self.facade.create_amenity({"name": "WiFi"})

    def test_create_place_success(self):
        res = self.client.post("/api/v1/places/", json={
            "title": "Nice Place",
            "price": 120,
            "latitude": 20,
            "longitude": 30,
            "owner_id": self.user.id,
            "amenities": [self.amenity.id]
        })
        self.assertEqual(res.status_code, 201)

    def test_create_place_invalid_owner(self):
        res = self.client.post("/api/v1/places/", json={
            "title": "Bad Place",
            "price": 100,
            "latitude": 10,
            "longitude": 20,
            "owner_id": "fake-id",
            "amenities": []
        })
        self.assertEqual(res.status_code, 400)

    def test_create_place_invalid_amenity(self):
        res = self.client.post("/api/v1/places/", json={
            "title": "Bad Place",
            "price": 100,
            "latitude": 10,
            "longitude": 20,
            "owner_id": self.user.id,
            "amenities": ["wrong-id"]
        })
        self.assertEqual(res.status_code, 400)

    def test_update_place_success(self):
        place = self.facade.create_place({
            "title": "Old",
            "price": 100,
            "latitude": 10,
            "longitude": 20,
            "owner_id": self.user.id,
            "amenities": []
        })

        res = self.client.put(f"/api/v1/places/{place.id}", json={
            "title": "Updated"
        })
        self.assertEqual(res.status_code, 200)

    def test_update_place_invalid_owner(self):
        place = self.facade.create_place({
            "title": "Old",
            "price": 100,
            "latitude": 10,
            "longitude": 20,
            "owner_id": self.user.id,
            "amenities": []
        })

        res = self.client.put(f"/api/v1/places/{place.id}", json={
            "owner_id": "fake-id"
        })
        self.assertEqual(res.status_code, 400)
