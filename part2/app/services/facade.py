from app.persistence.repository import InMemoryRepository


class HBnBFacade:
    def __init__(self):
        self.user_repo = InMemoryRepository()
        self.place_repo = InMemoryRepository()
        self.review_repo = InMemoryRepository()
        self.amenity_repo = InMemoryRepository()

    def get_user(self, user_id):
        return self.user_repo.get(user_id)

    def get_place(self, place_id):
        return self.place_repo.get(place_id)

    def create_review(self, review_data):
        from models.review import Review

        user = self.get_user(review_data['user_id'])
        place = self.get_place(review_data['place_id'])

        if not user or not place:
            raise ValueError("User or Place not found")

        new_review = Review(
            text=review_data['text'],
            rating=review_data['rating'],
            place=place,
            user=user
        )

        self.review_repo.add(new_review)
        place.add_review(new_review)

        return new_review

    def get_review(self, review_id):
        return self.review_repo.get(review_id)

    def get_all_reviews(self):
        return self.review_repo.get_all()

    def update_review(self, review_id, review_data):
        review = self.get_review(review_id)
        if not review:
            raise ValueError("Review not found")

        review.text = review_data.get('text', review.text)
        review.rating = review_data.get('rating', review.rating)

        update_data = {"text": review.text, "rating": review.rating}
        self.review_repo.update(review_id, update_data)
        return review

    def delete_review(self, review_id):
        review = self.get_review(review_id)
        if not review:
            raise ValueError("Review not found")

        self.review_repo.delete(review_id)

        if review in review.place.reviews:
            review.place.reviews.remove(review)
