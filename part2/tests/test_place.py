import unittest
from app import create_app

class TestPlaceEndpoints(unittest.TestCase):

    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()

    def test_create_place_valid(self):
        response = self.client.post("/api/v1/places/", json={
            "title": "Nice Apartment",
            "price": 120,
            "latitude": 24.7,
            "longitude": 46.7
        })
        self.assertEqual(response.status_code, 201)

    def test_create_place_invalid(self):
        response = self.client.post("/api/v1/places/", json={
            "title": "",
            "price": -10,
            "latitude": 200,
            "longitude": -500
        })
        self.assertEqual(response.status_code, 400)
