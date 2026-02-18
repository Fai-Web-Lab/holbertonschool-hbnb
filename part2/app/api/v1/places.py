@api.route('/<string:place_id>')
class PlaceResource(Resource):
    def get(self, place_id):
        place = facade.get_place(place_id)
        if not place:
            return {'error': 'Place not found'}, 404

        reviews_list = [
            {'id': r.id, 'text': r.text, 'rating': r.rating}
            for r in place.reviews
        ]

        return {
            'id': place.id,
            'title': place.title,
            'reviews': reviews_list
        }, 200
