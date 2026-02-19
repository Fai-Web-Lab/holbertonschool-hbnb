from flask import request
from flask_restx import Namespace, Resource, fields
from app.models.amenity import Amenity
from app.services.facade import facade

api = Namespace('amenities', description='Amenity operations')

amenity_model = api.model('Amenity', {
    'name': fields.String(required=True, description='Name of the amenity')
})

@api.route('/')
class AmenityList(Resource):

    @api.expect(amenity_model)
    @api.response(201, 'Amenity successfully created')
    @api.response(400, 'Invalid input data')
    def post(self):
        data = request.json
        try:
            amenity = facade.create_amenity(data)
            return amenity.to_dict(), 201
        except ValueError as e:
            return {"error": str(e)}, 400

    @api.response(200, 'List of amenities retrieved successfully')
    def get(self):
        amenities = facade.get_all_amenities()
        return [a.to_dict() for a in amenities], 200


@api.route('/<amenity_id>')
class AmenityResource(Resource):

    @api.response(200, 'Amenity details retrieved successfully')
    @api.response(404, 'Amenity not found')
    def get(self, amenity_id):
        amenity = facade.get_amenity(amenity_id)
        if not amenity:
            return {"error": "Amenity not found"}, 404
        return amenity.to_dict(), 200

    @api.expect(amenity_model)
    @api.response(200, 'Amenity updated successfully')
    @api.response(404, 'Amenity not found')
    @api.response(400, 'Invalid input data')
    def put(self, amenity_id):
        data = request.json
        try:
            updated = facade.update_amenity(amenity_id, data)
            if not updated:
                return {"error": "Amenity not found"}, 404
            return updated.to_dict(), 200
        except ValueError as e:
            return {"error": str(e)}, 400

