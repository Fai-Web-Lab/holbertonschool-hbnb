from flask_restx import Namespace, Resource, fields
from flask import request
from app import facade

api = Namespace('reviews', description='Review operations')

review_model = api.model('Review', {
    'text': fields.String(required=True, description='Text of the review'),
    'rating': fields.Integer(required=True, description='Rating (1-5)'),
    'user_id': fields.String(required=True, description='ID of the user'),
    'place_id': fields.String(required=True, description='ID of the place')
})


@api.route('/')
class ReviewList(Resource):
    @api.expect(review_model)
    def post(self):
        """Create new review"""
        data = request.json
        try:
            new_review = facade.create_review(data)
            return {'id': new_review.id, 'text': new_review.text}, 201
        except ValueError as e:
            return {'error': str(e)}, 400


@api.route('/<string:review_id>')
class ReviewResource(Resource):
    def delete(self, review_id):
        """Delete review"""
        try:
            facade.delete_review(review_id)
            return {'message': 'Review deleted successfully'}, 200
        except ValueError as e:
            return {'error': str(e)}, 404
