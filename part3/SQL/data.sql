INSERT INTO users (id, email, password, first_name, last_name, is_admin)
VALUES (UUID(), 'admin@hbnb.com', 'scrypt:32768:8:1$exPmPryVPxkz7gSh$2a2af83334a5ab6d01d8098f5a0cd2b44bb11888a2de20721a7d4b419333bb671ff795d87c3635dd432d50a15fbd77409ec569dbc5714385e54ef9d609d9d5ed', 'Admin', 'User', 1);

# INSERT INTO User (id, first_name, last_name, email, password, is_admin)
# VALUES ('36c9050e-ddd3-4c3b-9731-9f487208bbc1', 'Admin', 'HBnB', 'admin@hbnb.io', '$2b$12$6G3x9uR7k9p3/8Hj9qW1ueXFjR2eK/VzY8tW5S6N0mI2oP7Q6L8S.', TRUE);

INSERT INTO Amenity (id, name) VALUES ('56781234-abcd-4321-bcde-1234567890ab', 'WiFi');
INSERT INTO Amenity (id, name) VALUES ('98765432-fedc-1234-abcd-0987654321ba', 'Swimming Pool');
INSERT INTO Amenity (id, name) VALUES ('12345678-aaaa-bbbb-cccc-8765432109de', 'Air Conditioning');
