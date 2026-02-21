from app.models.base_model import BaseModel


class Place(BaseModel):
    def __init__(
        self,
        title,
        price,
        latitude,
        longitude,
        owner_id,
        description=None,
        amenities=None,
        reviews=None,
    ):
        super().__init__()

        if not title:
            raise ValueError("Title is required")
        if len(title) > 100:
            raise ValueError("Title cannot exceed 100 characters")

        if price is None or price < 0:
            raise ValueError("Price must be non-negative")

        if latitude is None or not (-90 <= latitude <= 90):
            raise ValueError("Latitude must be between -90 and 90")

        if longitude is None or not (-180 <= longitude <= 180):
            raise ValueError("Longitude must be between -180 and 180")

        if owner_id is None:
            owner_id = ""

        self.title = title
        self.description = description
        self.price = price
        self.latitude = latitude
        self.longitude = longitude
        self.owner_id = owner_id

        self.amenities = amenities or []
        self.reviews = reviews or []
