import unittest
from app import create_app

class TestUserAPI(unittest.TestCase):

    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()
        

    def test_create_user_success(self):
        res = self.client.post("/api/v1/users/", json={
            "first_name": "John",
            "last_name": "Doe",
            "email": "JohnU@example.com"
        })
        self.assertEqual(res.status_code, 201)

    def test_create_user_invalid_email(self):
        res = self.client.post("/api/v1/users/", json={
            "first_name": "A",
            "last_name": "B",
            "email": "bad-email"
        })
        self.assertEqual(res.status_code, 400)

    def test_get_user_not_found(self):
        res = self.client.get("/api/v1/users/not-found")
        self.assertEqual(res.status_code, 404)
