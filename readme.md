# Password Manager

A simple password manager that generates passwords, asks the user for which app it is and stores them in a MongoDB database. It also shows the user the passwords for the apps they have created.
# Authentication

The application requires user authentication to access the password management features. Users can register and log in using their credentials. The backend uses `bcrypt` to hash passwords and `jsonwebtoken` for token-based authentication. The frontend manages authentication state and sends credentials via HTTP headers.

