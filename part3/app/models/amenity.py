from app.extensions import db
from app.models.base_model import BaseModel


class Amenity(BaseModel):
    __tablename__ = 'amenities'

    name = db.Column(db.String(50), nullable=False, unique=True)

    def __init__(self, name, **kwargs):
        super().__init__(**kwargs)

        if not name:
            raise ValueError("Amenity name cannot be empty")
        if len(name) > 50:
            raise ValueError("Amenity name cannot exceed 50 characters")

        self.name = name

    def to_dict(self):
        data = super().to_dict()
        data.update({
            "name": self.name,
        })
        return data