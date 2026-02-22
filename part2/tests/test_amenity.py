import unittest
from app import create_app

class TestAmenityEndpoints(unittest.TestCase):

    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()

    def test_create_amenity_valid(self):
        response = self.client.post("/api/v1/amenities/", json={
            "name": "WiFi"
        })
        self.assertEqual(response.status_code, 201)

    def test_create_amenity_invalid(self):
        response = self.client.post("/api/v1/amenities/", json={
            "name": ""
        })
        self.assertEqual(response.status_code, 400)
