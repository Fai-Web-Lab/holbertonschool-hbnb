from flask import Flask
from flask_restx import Api
from flask_cors import CORS

# Import namespaces
from api.v1.amenities import api as amenities_ns
from api.v1.places import api as places_ns


def create_app():
    app = Flask(__name__)
    CORS(app)

    # Create API object
    api = Api(
        app,
        version="1.0",
        title="HBnB Application API",
        description="HBnB REST API - Part 2",
        doc='/api/v1/'
    )

    # Register namespaces
    api.add_namespace(amenities_ns, path="/api/v1/amenities")
    api.add_namespace(places_ns, path="/api/v1/places")

    return app