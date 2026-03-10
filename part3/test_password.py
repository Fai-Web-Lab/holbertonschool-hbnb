from app.models.user import User

user = User("Ali", "Test", "ali@test.com")

user.hash_password("123456")

print("Stored password:", user.password)

print("Correct password:", user.verify_password("123456"))
print("Wrong password:", user.verify_password("wrong"))
