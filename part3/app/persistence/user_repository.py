from app.models.user import User
from app import db
from .sqlalchemy_repository import SQLAlchemyRepository
from sqlalchemy.exc import IntegrityError

class UserRepository(SQLAlchemyRepository):
    def __init__(self):
        super().__init__(User)

    def get_user_by_email(self, email):

        return self.model.query.filter_by(email=email).first()

    def get_admin_users(self):

        return self.model.query.filter_by(is_admin=True).all()

    def create_user(self, user_data):

        try:
            required_fields = ['first_name', 'last_name', 'email']
            for field in required_fields:
                if field not in user_data:
                    return None, f"Missing required field: {field}"
            existing_user = self.get_user_by_email(user_data.get('email'))
            if existing_user:
                return None, "Email already exists"

            password = user_data.pop('password', None)
            
            user = User(**user_data)

            if password:
                user.hash_password(password)
                 
            self.add(user)
            db.session.commit()

            return user, None
            
        except IntegrityError:
            db.session.rollback()
            return None, "Database integrity error"
        except Exception as e:
            db.session.rollback()
            return None, str(e)

    def update_user(self, user_id, user_data):
        try:
            user = self.get(user_id)
            if not user:
                return None, "User not found"

            if 'email' in user_data:
                if user_data['email'] != user.email:
                    existing_user = self.get_user_by_email(user_data['email'])
                    if existing_user:
                        return None, "Email already in use"
                else:
                    user_data.pop('email')

            if 'password' in user_data:
                password = user_data.pop('password')
                user.hash_password(password)

            for key, value in user_data.items():
                if hasattr(user, key):
                    setattr(user, key, value)
            
            db.session.commit()
            return user, None
            
        except Exception as e:
            db.session.rollback()
            return None, str(e)

    def search_users(self, search_term):

        return self.model.query.filter(
            (User.first_name.ilike(f'%{search_term}%')) |
            (User.last_name.ilike(f'%{search_term}%')) |
            (User.email.ilike(f'%{search_term}%'))
        ).all()

    def delete_user(self, user_id):

        user = self.get(user_id)
        if not user:
            return False, "User not found"
        
        try:
            db.session.delete(user)
            db.session.commit()
            return True, "User deleted successfully"
        except Exception as e:
            db.session.rollback()
            return False, str(e)

    def get_users_with_places(self):

        return self.model.query.filter(User.places.any()).all()
