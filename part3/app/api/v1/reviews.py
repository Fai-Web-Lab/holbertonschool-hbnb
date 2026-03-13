from flask_restx import Namespace, Resource, fields
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.services.facade import facade

api = Namespace('reviews', description='Review operations')

review_model = api.model('Review', {
    'text': fields.String(required=True, description='Text of the review'),
    'rating': fields.Integer(required=True, description='Rating (1-5)'),
    'place_id': fields.String(required=True, description='ID of the place')
})

review_update_model = api.model('ReviewUpdate', {
    'text': fields.String(description='Updated text of the review'),
    'rating': fields.Integer(description='Updated rating (1-5)')
})


@api.route('/')
class ReviewList(Resource):

    @api.expect(review_model)
    @api.response(201, 'Review successfully created')
    @api.response(400, 'Invalid input data')
    @jwt_required()
    def post(self):
        """Create a review - authenticated users only"""
        # Get user_id from JWT token instead of request body
        current_user_id = get_jwt_identity()
        data = request.json
        data['user_id'] = current_user_id

        # Check that the place exists
        place = facade.get_place(data.get('place_id'))
        if not place:
            return {'error': 'Place not found'}, 404

        # Prevent owner from reviewing their own place
        if place.owner_id == current_user_id:
            return {'error': 'You cannot review your own place'}, 400

        # Prevent duplicate reviews on the same place
        existing_reviews = facade.get_reviews_for_place(data['place_id'])
        for r in existing_reviews:
            if r.user_id == current_user_id:
                return {'error': 'You have already reviewed this place'}, 400

        try:
            new_review = facade.create_review(data)
        except ValueError as e:
            return {'error': str(e)}, 400

        return {
            'id': new_review.id,
            'text': new_review.text,
            'rating': new_review.rating,
            'user_id': new_review.user_id,
            'place_id': new_review.place_id
        }, 201

    @api.response(200, 'List of reviews retrieved successfully')
    def get(self):
        """Retrieve all reviews - public endpoint"""
        reviews = facade.get_all_reviews()
        return [
            {
                'id': r.id,
                'text': r.text,
                'rating': r.rating,
                'user_id': r.user_id,
                'place_id': r.place_id
            }
            for r in reviews
        ], 200


@api.route('/<string:review_id>')
class ReviewResource(Resource):

    @api.response(200, 'Review details retrieved successfully')
    @api.response(404, 'Review not found')
    def get(self, review_id):
        """Retrieve a review - public endpoint"""
        review = facade.get_review(review_id)
        if not review:
            return {'error': 'Review not found'}, 404
        return {
            'id': review.id,
            'text': review.text,
            'rating': review.rating,
            'user_id': review.user_id,
            'place_id': review.place_id
        }, 200

    @api.expect(review_update_model)
    @api.response(200, 'Review updated successfully')
    @api.response(404, 'Review not found')
    @api.response(400, 'Invalid input data')
    @jwt_required()
    def put(self, review_id):
        """Update a review - only the author can modify"""
        current_user_id = get_jwt_identity()

        review = facade.get_review(review_id)
        if not review:
            return {"error": "Review not found"}, 404

        # Only the author can update their review
        if review.user_id != current_user_id:
            return {"error": "Unauthorized action"}, 403

        data = request.json

        try:
            facade.update_review(review_id, data)
            return {'message': 'Review updated successfully'}, 200
        except ValueError as e:
            return {"error": str(e)}, 400

    @api.response(200, 'Review deleted successfully')
    @api.response(404, 'Review not found')
    @jwt_required()
    def delete(self, review_id):
        """Delete a review - only the author can delete"""
        current_user_id = get_jwt_identity()

        review = facade.get_review(review_id)
        if not review:
            return {"error": "Review not found"}, 404

        # Only the author can delete their review
        if review.user_id != current_user_id:
            return {"error": "Unauthorized action"}, 403

        try:
            facade.delete_review(review_id)
            return {"message": "Review deleted successfully"}, 200
        except ValueError:
            return {"error": "Review not found"}, 404