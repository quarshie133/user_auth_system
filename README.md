# Auth API

A robust authentication and authorization backend built with Node.js, Express, MongoDB, and JSON Web Tokens (JWT). This project provides a solid foundation for user management, secure authentication flows, and protected route access.

## Features

- **User Registration (Signup)**: Creates a new user and hashes passwords securely using `bcryptjs` before saving to the database.
- **User Authentication (Login)**: Verifies user credentials and issues a JSON Web Token (JWT).
- **Protected Routes**: Custom middleware to restrict access to endpoints for authenticated users only.
- **Secure Password Storage**: Passwords are automatically hashed via Mongoose pre-save hooks and are never returned in default database queries.

## Tech Stack

- **Node.js & Express.js**: Backend server and API routing.
- **MongoDB & Mongoose**: Database and Object Data Modeling (ODM).
- **JSON Web Tokens (JWT)**: Secure, stateless authentication.
- **bcryptjs**: Password hashing and verification.
- **dotenv**: Environment variable management.
- **nodemon**: Development server with automatic restarts.

## Prerequisites

- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/) instance (local or Atlas)
- [Postman](https://www.postman.com/) for API testing

## Getting Started

1. **Navigate to the project directory** (or clone the repository).

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory and add the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key_here
   JWT_EXPIRES_IN=7d
   ```

4. **Run the server**:
   - For development mode (uses nodemon):
     ```bash
     npm run dev
     ```
   - For production mode:
     ```bash
     npm start
     ```
   
   The server should now be running on `http://localhost:5000`.

---

## API Endpoints

All testing for these endpoints was conducted using **Postman**. 

### Public Routes (No Token Required)

#### 1. User Signup
- **URL**: `/api/auth/signup`
- **Method**: `POST`
- **Body** (`application/json`):
  ```json
  {
    "username": "johndoe",
    "email": "johndoe@example.com",
    "password": "password123"
  }
  ```
- **Success Response** (201 Created): Returns a success message, the generated JWT token, and the user's basic info.

#### 2. User Login
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Body** (`application/json`):
  ```json
  {
    "email": "johndoe@example.com",
    "password": "password123"
  }
  ```
- **Success Response** (200 OK): Returns a success message, the generated JWT token, and the user's basic info.

### Protected Routes (Require JWT Token)

> **Important**: For the following endpoints, you must include the JWT token in the `Authorization` header in Postman.
> Format: `Authorization: Bearer <your_jwt_token>`

#### 3. Get Current User Profile
- **URL**: `/api/auth/me`
- **Method**: `GET`
- **Success Response** (200 OK): Returns the full profile data of the currently logged-in user.

#### 4. Access Dashboard (Example Protected Route)
- **URL**: `/api/protected/dashboard`
- **Method**: `GET`
- **Success Response** (200 OK): Returns a personalized welcome message containing the user's username.

---

## Testing with Postman Workflow

1. Start the server using `npm run dev`.
2. Open Postman.
3. **Register** a new user by sending a `POST` request to `http://localhost:5000/api/auth/signup` with the required JSON body.
4. Copy the `token` string received in the response body.
5. Create a new `GET` request for a protected route, such as `http://localhost:5000/api/auth/me`.
6. Navigate to the **Authorization** tab in Postman, select **Bearer Token** from the type dropdown, and paste the copied token.
7. Send the request to successfully access the protected data.
