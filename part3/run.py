import os
from app import create_app

cfg = os.getenv("FLASK_CONFIG", "development")
app = create_app(cfg)

if __name__ == "__main__":
    app.run()
