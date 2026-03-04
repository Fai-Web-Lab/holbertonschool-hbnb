import unittest
from app import create_app

class TestAmenityAPI(unittest.TestCase):

    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()

    def test_create_amenity_success(self):
        res = self.client.post("/api/v1/amenities/", json={"name": "Pool"})
        self.assertEqual(res.status_code, 201)

    def test_create_amenity_invalid(self):
        res = self.client.post("/api/v1/amenities/", json={"name": ""})
        self.assertEqual(res.status_code, 400)

    def test_get_amenity_not_found(self):
        res = self.client.get("/api/v1/amenities/not-found")
        self.assertEqual(res.status_code, 404)
