# API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error message",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Authentication Endpoints

### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "1",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "isActive": true
    },
    "token": "jwt-token",
    "refreshToken": "refresh-token",
    "expiresIn": 86400
  },
  "message": "Login successful"
}
```

### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "2",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "isActive": true
    },
    "token": "jwt-token",
    "refreshToken": "refresh-token",
    "expiresIn": 86400
  },
  "message": "Registration successful"
}
```

### POST /auth/logout
Logout the current user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### GET /auth/me
Get current user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "isActive": true
  },
  "message": "User data retrieved successfully"
}
```

### PUT /auth/profile
Update user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "email": "user@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "phone": "+1234567890",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Profile updated successfully"
}
```

## Property Endpoints

### GET /properties
Get all properties with optional filtering.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `propertyType` (array): Property types to filter by
- `location` (string): Location search term

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "Modern Apartment in Downtown",
      "description": "Beautiful modern apartment...",
      "price": 2500,
      "currency": "USD",
      "location": {
        "address": "123 Main St",
        "city": "New York",
        "state": "NY",
        "country": "USA",
        "postalCode": "10001",
        "coordinates": {
          "lat": 40.7128,
          "lng": -74.0060
        }
      },
      "images": ["https://example.com/image1.jpg"],
      "features": [
        {
          "id": "1",
          "name": "Bedrooms",
          "value": 2,
          "category": "basic"
        }
      ],
      "type": "apartment",
      "status": "available",
      "owner": {
        "id": "1",
        "email": "owner@example.com",
        "firstName": "John",
        "lastName": "Doe"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  },
  "message": "Properties retrieved successfully"
}
```

### GET /properties/:id
Get a specific property by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "Modern Apartment in Downtown",
    // ... property details
  },
  "message": "Property retrieved successfully"
}
```

### POST /properties
Create a new property (authenticated).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Beautiful House",
  "description": "A beautiful house with garden",
  "price": 3000,
  "currency": "USD",
  "location": {
    "address": "456 Oak St",
    "city": "San Francisco",
    "state": "CA",
    "country": "USA",
    "postalCode": "94102",
    "coordinates": {
      "lat": 37.7749,
      "lng": -122.4194
    }
  },
  "images": ["https://example.com/image1.jpg"],
  "features": [
    {
      "name": "Bedrooms",
      "value": 3,
      "category": "basic"
    }
  ],
  "type": "house"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "3",
    "title": "Beautiful House",
    // ... property details
  },
  "message": "Property created successfully"
}
```

### PUT /properties/:id
Update a property (authenticated).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "price": 3500
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "Updated Title",
    "price": 3500,
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Property updated successfully"
}
```

### DELETE /properties/:id
Delete a property (authenticated).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Property deleted successfully"
}
```

### GET /properties/featured
Get featured properties.

**Response:**
```json
{
  "success": true,
  "data": [
    // ... featured properties
  ],
  "message": "Featured properties retrieved successfully"
}
```

### POST /properties/search
Search properties with advanced filters.

**Request Body:**
```json
{
  "filters": {
    "minPrice": 1000,
    "maxPrice": 5000,
    "propertyType": ["apartment", "house"],
    "location": "New York",
    "features": ["parking", "gym"]
  },
  "sortBy": "price",
  "sortOrder": "asc",
  "page": 1,
  "limit": 10
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    // ... search results
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  },
  "message": "Search completed successfully"
}
```

### POST /properties/:id/favorite
Toggle favorite status for a property (authenticated).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isFavorited": true
  },
  "message": "Favorite status updated successfully"
}
```

### GET /properties/favorites
Get user's favorite properties (authenticated).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    // ... favorite properties
  ],
  "message": "Favorites retrieved successfully"
}
```

## User Endpoints

### GET /users/profile
Get user profile (authenticated).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Profile retrieved successfully"
}
```

### PUT /users/profile
Update user profile (authenticated).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "email": "user@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "phone": "+1234567890",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Profile updated successfully"
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

## Rate Limiting

The API implements rate limiting:
- 100 requests per 15 minutes per IP address
- Exceeded requests return 429 status code

## CORS

The API supports CORS for the following origins:
- `http://localhost:3000` (Web app)
- `http://localhost:19006` (Mobile app)

Additional origins can be configured via the `ALLOWED_ORIGINS` environment variable.
