from models.base_model import BaseModel


class Place(BaseModel):
    def __init__(self, title, description, price, latitude, longitude, owner):
        super().__init__()
        if price < 0:
            raise ValueError("Price must be non-negative")
        if not (-90 <= latitude <= 90) or not (-180 <= longitude <= 180):
            raise ValueError("Invalid latitude or longitude")

        self.title = title
        self.description = description
        self.price = price
        self.latitude = latitude
        self.longitude = longitude
        self.owner = owner
        self.amenities = []
        self.reviews = []

    def add_amenity(self, amenity):
        """Add new amenities if not available"""
        if amenity not in self.amenities:
            self.amenities.append(amenity)

    def add_review(self, review):
        """Add new comment for the place"""
        self.reviews.append(review)
