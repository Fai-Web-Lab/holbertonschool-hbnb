from app.models.base_model import BaseModel


class Amenity(BaseModel):
    def __init__(self, name):
        super().__init__()

        if not name:
            raise ValueError("Amenity name cannot be empty")

        if len(name) > 50:
            raise ValueError("Amenity name cannot exceed 50 characters")

        self.name = name
