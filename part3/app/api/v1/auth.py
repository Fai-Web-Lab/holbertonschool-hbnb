from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import create_access_token
from app.services import facade
from app.models.user import User
from flask import request

auth_ns = Namespace('auth', description='Authentication operations')

login_model = auth_ns.model('Login', {
    'email': fields.String(required=True),
    'password': fields.String(required=True)
})

register_model = auth_ns.model('Register', {
    'first_name': fields.String(required=True),
    'last_name': fields.String(required=True),
    'email': fields.String(required=True),
    'password': fields.String(required=True, description='Password')
})


@auth_ns.route('/login')
class LoginResource(Resource):
    @auth_ns.expect(login_model, validate=True)
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        user = User.query.filter_by(email=email).first()

        if user and user.verify_password(password):
            access_token = create_access_token(
                identity=user.id,
                additional_claims={'is_admin': user.is_admin}
            )
            return {'access_token': access_token}, 200

        return {'msg': 'Invalid credentials'}, 401


@auth_ns.route('/register')
class RegisterResource(Resource):
    @auth_ns.expect(register_model, validate=True)
    def post(self):
        """Self-registration - always creates a non-admin user"""
        data = request.get_json()
        data['is_admin'] = False

        try:
            new_user = facade.create_user(data)
        except ValueError as e:
            return {"error": str(e)}, 400

        return {
            "id": new_user.id,
            "message": "User registered successfully"
        }, 201
