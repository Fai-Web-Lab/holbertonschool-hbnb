from models.base_model import BaseModel

class Amenity(BaseModel):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

#-----------------------------------
        # Validations
        name = kwargs.get("name")
        if not name:
            raise ValueError("Amenity name cannot be empty")
        self.name = name

        # Max length 50
        if len(self.name) > 50:
            raise ValueError("Amenity name cannot exceed 50 characters")
