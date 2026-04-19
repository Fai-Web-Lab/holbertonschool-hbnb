from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import create_access_token
from app.models.user import User
from flask import request

auth_ns = Namespace('auth', description='Authentication operations')

login_model = auth_ns.model('Login', {
    'email': fields.String(required=True),
    'password': fields.String(required=True)
})

@auth_ns.route('/login')
class LoginResource(Resource):
    def post(self):
        data = request.get_json()
        print(f"DEBUG: Received data: {data}")
        
        email = data.get('email')
        password = data.get('password')
        
        user = User.query.filter_by(email=email).first()
        
        if user:
            print(f"DEBUG: User found in DB. DB Password: {user.password} | Sent Password: {password}")
            if user.password == password:
                access_token = create_access_token(identity={'email': user.email})
                return {'access_token': access_token}, 200
        
        return {'msg': 'Invalid credentials'}, 401
