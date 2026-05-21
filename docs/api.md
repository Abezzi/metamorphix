# API Documentation ![guide](https://dev.to/zuplo/efficiently-document-apis-with-markdown-a-developers-guide-44lk)

## User Management

Base URL: `https://api.example.com`

| Method | Endpoint    | Description              |
| ------ | ----------- | ------------------------ |
| GET    | /users      | Retrieve all users       |
| GET    | /users/{id} | Retrieve a specific user |
| POST   | /users      | Create a new user        |
| PUT    | /users/{id} | Update an existing user  |
| DELETE | /users/{id} | Remove a user            |

### Authentication

All API requests require a valid API key included in the header:

`Authorization: Bearer YOUR_API_KEY`

## /api/auth
