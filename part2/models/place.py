from models.base_model import BaseModel
from models.user import User


class Place(BaseModel):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        self.title = kwargs.get("title")
        self.description = kwargs.get("description")
        self.price = kwargs.get("price")
        self.latitude = kwargs.get("latitude")
        self.longitude = kwargs.get("longitude")
        self.owner = kwargs.get("owner")
#--------------------------------------------------------
        # Title validation
        if not self.title:
            raise ValueError("Title is required")
        if len(self.title) > 100:
            raise ValueError("Title cannot exceed 100 characters")
        
        # Price validation
        if self.price is None or self.price < 0:
            raise ValueError("Price must be non-negative")

                # Latitude validation
        if self.latitude is None or not (-90.0 <= self.latitude <= 90.0):
            raise ValueError("Latitude must be between -90.0 and 90.0")

        # Longitude validation
        if self.longitude is None or not (-180.0 <= self.longitude <= 180.0):
            raise ValueError("Longitude must be between -180.0 and 180.0")

        # Owner validation
        if not isinstance(self.owner, User):
            raise ValueError("Owner must be a valid User instance")

#----------------------------------------------
        # Relationships
        self.amenities = []
        self.reviews = []

# Relationship Methods
    def add_amenity(self, amenity):
        
        if amenity not in self.amenities:
            self.amenities.append(amenity)

    def add_review(self, review):

        self.reviews.append(review)
