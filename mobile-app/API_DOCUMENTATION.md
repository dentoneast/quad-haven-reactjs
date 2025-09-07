# Rently API Documentation

## Overview
The Rently API provides comprehensive endpoints for managing rental properties, units, leases, and listings. All endpoints use JWT authentication for secure access.

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "address": "123 Main St",
  "userType": "tenant"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "date_of_birth": "1990-01-01",
    "address": "123 Main St",
    "user_type": "tenant",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "token": "jwt-token-here"
}
```

#### POST /api/auth/login
Authenticate user and receive JWT token.

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
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe"
  },
  "token": "jwt-token-here"
}
```

#### POST /api/auth/logout
Logout user and invalidate JWT token.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Logout successful"
}
```

### User Management

#### GET /api/user/profile
Get current user's profile information.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "date_of_birth": "1990-01-01",
    "address": "123 Main St",
    "profile_image_url": null,
    "is_verified": false,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### PUT /api/user/profile
Update current user's profile information.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+1987654321",
  "address": "456 Oak Ave"
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "Jane",
    "last_name": "Smith",
    "phone": "+1987654321",
    "address": "456 Oak Ave",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### PUT /api/user/change-password
Change user's password.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "message": "Password changed successfully"
}
```

### Premises Management

#### POST /api/premises
Create a new premises (property).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Sunset Apartments",
  "address": "123 Sunset Blvd",
  "city": "Los Angeles",
  "state": "CA",
  "zipCode": "90210",
  "country": "USA",
  "propertyType": "apartment",
  "totalUnits": 50,
  "yearBuilt": 2020,
  "amenities": ["pool", "gym", "parking"],
  "description": "Modern apartment complex with great amenities"
}
```

**Response:**
```json
{
  "message": "Premises created successfully",
  "premises": {
    "id": 1,
    "name": "Sunset Apartments",
    "address": "123 Sunset Blvd",
    "city": "Los Angeles",
    "state": "CA",
    "zip_code": "90210",
    "property_type": "apartment",
    "total_units": 50,
    "year_built": 2020,
    "amenities": ["pool", "gym", "parking"],
    "description": "Modern apartment complex with great amenities",
    "lessor_id": 1,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### GET /api/premises
Get all premises with optional filtering.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `city` (optional): Filter by city
- `state` (optional): Filter by state
- `propertyType` (optional): Filter by property type
- `minPrice` (optional): Minimum rent price
- `maxPrice` (optional): Maximum rent price

**Response:**
```json
{
  "premises": [
    {
      "id": 1,
      "name": "Sunset Apartments",
      "address": "123 Sunset Blvd",
      "city": "Los Angeles",
      "state": "CA",
      "property_type": "apartment",
      "total_units": 50,
      "lessor_name": "John Doe",
      "lessor_email": "john@example.com",
      "total_units": 50,
      "available_units": 5,
      "min_rent": 1500,
      "max_rent": 3000
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

#### GET /api/premises/:id
Get specific premises by ID.

**Response:**
```json
{
  "premises": {
    "id": 1,
    "name": "Sunset Apartments",
    "address": "123 Sunset Blvd",
    "city": "Los Angeles",
    "state": "CA",
    "zip_code": "90210",
    "property_type": "apartment",
    "total_units": 50,
    "year_built": 2020,
    "amenities": ["pool", "gym", "parking"],
    "description": "Modern apartment complex with great amenities",
    "lessor_name": "John Doe",
    "lessor_email": "john@example.com",
    "lessor_phone": "+1234567890"
  }
}
```

#### PUT /api/premises/:id
Update premises information.

**Headers:** `Authorization: Bearer <token>`

**Request Body:** Same as POST, but all fields are optional.

**Response:**
```json
{
  "message": "Premises updated successfully",
  "premises": {
    "id": 1,
    "name": "Sunset Apartments Updated",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### DELETE /api/premises/:id
Delete premises (soft delete).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Premises deleted successfully"
}
```

### Rental Units Management

#### POST /api/rental-units
Create a new rental unit.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "unitNumber": "A101",
  "premisesId": 1,
  "unitType": "2BR",
  "squareFeet": 1200,
  "bedrooms": 2,
  "bathrooms": 2.0,
  "floorNumber": 1,
  "rentAmount": 2500,
  "securityDeposit": 2500,
  "utilitiesIncluded": false,
  "availableFrom": "2024-02-01",
  "features": ["balcony", "walk-in closet"],
  "images": ["image1.jpg", "image2.jpg"]
}
```

**Response:**
```json
{
  "message": "Rental unit created successfully",
  "unit": {
    "id": 1,
    "unit_number": "A101",
    "premises_id": 1,
    "unit_type": "2BR",
    "square_feet": 1200,
    "bedrooms": 2,
    "bathrooms": 2.0,
    "rent_amount": 2500,
    "security_deposit": 2500,
    "is_available": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### GET /api/rental-units
Get all rental units with optional filtering.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `premisesId` (optional): Filter by premises ID
- `unitType` (optional): Filter by unit type
- `minRent` (optional): Minimum rent amount
- `maxRent` (optional): Maximum rent amount
- `available` (optional): Filter by availability (true/false)
- `city` (optional): Filter by city
- `state` (optional): Filter by state

**Response:**
```json
{
  "units": [
    {
      "id": 1,
      "unit_number": "A101",
      "unit_type": "2BR",
      "square_feet": 1200,
      "bedrooms": 2,
      "bathrooms": 2.0,
      "rent_amount": 2500,
      "is_available": true,
      "premises_name": "Sunset Apartments",
      "premises_address": "123 Sunset Blvd",
      "city": "Los Angeles",
      "state": "CA",
      "lessor_name": "John Doe",
      "lessor_email": "john@example.com"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

#### GET /api/rental-units/:id
Get specific rental unit by ID.

**Response:**
```json
{
  "unit": {
    "id": 1,
    "unit_number": "A101",
    "unit_type": "2BR",
    "square_feet": 1200,
    "bedrooms": 2,
    "bathrooms": 2.0,
    "rent_amount": 2500,
    "security_deposit": 2500,
    "is_available": true,
    "premises_name": "Sunset Apartments",
    "premises_address": "123 Sunset Blvd",
    "city": "Los Angeles",
    "state": "CA",
    "lessor_name": "John Doe",
    "lessor_email": "john@example.com",
    "lessor_phone": "+1234567890"
  }
}
```

#### PUT /api/rental-units/:id
Update rental unit information.

**Headers:** `Authorization: Bearer <token>`

**Request Body:** Same as POST, but all fields are optional.

**Response:**
```json
{
  "message": "Rental unit updated successfully",
  "unit": {
    "id": 1,
    "rent_amount": 2600,
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### DELETE /api/rental-units/:id
Delete rental unit.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Rental unit deleted successfully"
}
```

### Leases Management

#### POST /api/leases
Create a new lease agreement.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "rentalUnitId": 1,
  "lesseeId": 2,
  "startDate": "2024-02-01",
  "endDate": "2025-01-31",
  "monthlyRent": 2500,
  "securityDeposit": 2500,
  "termsConditions": "Standard lease terms apply"
}
```

**Response:**
```json
{
  "message": "Lease created successfully",
  "lease": {
    "id": 1,
    "rental_unit_id": 1,
    "lessor_id": 1,
    "lessee_id": 2,
    "start_date": "2024-02-01",
    "end_date": "2025-01-31",
    "monthly_rent": 2500,
    "security_deposit": 2500,
    "lease_status": "active",
    "terms_conditions": "Standard lease terms apply",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### GET /api/leases
Get all leases for the authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by lease status
- `role` (optional): Filter by user role ('lessor', 'lessee', or both)

**Response:**
```json
{
  "leases": [
    {
      "id": 1,
      "start_date": "2024-02-01",
      "end_date": "2025-01-31",
      "monthly_rent": 2500,
      "lease_status": "active",
      "unit_number": "A101",
      "unit_type": "2BR",
      "premises_name": "Sunset Apartments",
      "premises_address": "123 Sunset Blvd",
      "city": "Los Angeles",
      "state": "CA",
      "lessor_first_name": "John",
      "lessor_last_name": "Doe",
      "lessee_first_name": "Jane",
      "lessee_last_name": "Smith"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

#### GET /api/leases/:id
Get specific lease by ID.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "lease": {
    "id": 1,
    "start_date": "2024-02-01",
    "end_date": "2025-01-31",
    "monthly_rent": 2500,
    "security_deposit": 2500,
    "lease_status": "active",
    "terms_conditions": "Standard lease terms apply",
    "unit_number": "A101",
    "unit_type": "2BR",
    "premises_name": "Sunset Apartments",
    "premises_address": "123 Sunset Blvd",
    "city": "Los Angeles",
    "state": "CA",
    "lessor_first_name": "John",
    "lessor_last_name": "Doe",
    "lessor_phone": "+1234567890",
    "lessee_first_name": "Jane",
    "lessee_last_name": "Smith",
    "lessee_phone": "+1987654321"
  }
}
```

#### PUT /api/leases/:id
Update lease information.

**Headers:** `Authorization: Bearer <token>`

**Request Body:** Same as POST, but all fields are optional.

**Response:**
```json
{
  "message": "Lease updated successfully",
  "lease": {
    "id": 1,
    "monthly_rent": 2600,
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### DELETE /api/leases/:id
Delete lease agreement.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Lease deleted successfully"
}
```

### Rental Listings Management

#### POST /api/rental-listings
Create a new rental listing.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "rentalUnitId": 1,
  "title": "Beautiful 2BR Apartment in Sunset Apartments",
  "description": "Spacious 2-bedroom apartment with modern amenities",
  "monthlyRent": 2500,
  "availableFrom": "2024-02-01",
  "listingStatus": "active",
  "featured": true,
  "contactPhone": "+1234567890",
  "contactEmail": "john@example.com"
}
```

**Response:**
```json
{
  "message": "Rental listing created successfully",
  "listing": {
    "id": 1,
    "rental_unit_id": 1,
    "title": "Beautiful 2BR Apartment in Sunset Apartments",
    "description": "Spacious 2-bedroom apartment with modern amenities",
    "monthly_rent": 2500,
    "available_from": "2024-02-01",
    "listing_status": "active",
    "featured": true,
    "views_count": 0,
    "contact_phone": "+1234567890",
    "contact_email": "john@example.com",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### GET /api/rental-listings
Get all rental listings with optional filtering.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by listing status
- `featured` (optional): Filter by featured status (true/false)
- `minRent` (optional): Minimum rent amount
- `maxRent` (optional): Maximum rent amount
- `city` (optional): Filter by city
- `state` (optional): Filter by state
- `unitType` (optional): Filter by unit type
- `available` (optional): Filter by availability (true/false)

**Response:**
```json
{
  "listings": [
    {
      "id": 1,
      "title": "Beautiful 2BR Apartment in Sunset Apartments",
      "description": "Spacious 2-bedroom apartment with modern amenities",
      "monthly_rent": 2500,
      "listing_status": "active",
      "featured": true,
      "views_count": 15,
      "unit_number": "A101",
      "unit_type": "2BR",
      "square_feet": 1200,
      "bedrooms": 2,
      "bathrooms": 2.0,
      "premises_name": "Sunset Apartments",
      "premises_address": "123 Sunset Blvd",
      "city": "Los Angeles",
      "state": "CA",
      "lessor_name": "John Doe",
      "lessor_email": "john@example.com"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

#### GET /api/rental-listings/:id
Get specific rental listing by ID.

**Response:**
```json
{
  "listing": {
    "id": 1,
    "title": "Beautiful 2BR Apartment in Sunset Apartments",
    "description": "Spacious 2-bedroom apartment with modern amenities",
    "monthly_rent": 2500,
    "listing_status": "active",
    "featured": true,
    "views_count": 16,
    "unit_number": "A101",
    "unit_type": "2BR",
    "square_feet": 1200,
    "bedrooms": 2,
    "bathrooms": 2.0,
    "features": ["balcony", "walk-in closet"],
    "images": ["image1.jpg", "image2.jpg"],
    "premises_name": "Sunset Apartments",
    "premises_address": "123 Sunset Blvd",
    "city": "Los Angeles",
    "state": "CA",
    "property_type": "apartment",
    "amenities": ["pool", "gym", "parking"],
    "lessor_name": "John Doe",
    "lessor_email": "john@example.com",
    "lessor_phone": "+1234567890"
  }
}
```

#### PUT /api/rental-listings/:id
Update rental listing information.

**Headers:** `Authorization: Bearer <token>`

**Request Body:** Same as POST, but all fields are optional.

**Response:**
```json
{
  "message": "Rental listing updated successfully",
  "listing": {
    "id": 1,
    "monthly_rent": 2600,
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### DELETE /api/rental-listings/:id
Delete rental listing.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Rental listing deleted successfully"
}
```

### Health Check

#### GET /api/health
Check API server status.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Validation error message",
  "errors": [
    {
      "msg": "Field validation message",
      "param": "fieldName",
      "location": "body"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Access token required"
}
```

### 403 Forbidden
```json
{
  "error": "Access denied"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Data Types

### Property Types
- `apartment`
- `house`
- `condo`
- `townhouse`
- `duplex`
- `studio`

### Unit Types
- `studio`
- `1BR`
- `2BR`
- `3BR`
- `4BR+`

### Lease Status
- `draft`
- `active`
- `expired`
- `terminated`

### Listing Status
- `draft`
- `active`
- `pending`
- `rented`
- `inactive`

### User Types
- `tenant`
- `landlord`
- `admin`

## Rate Limiting
Currently, no rate limiting is implemented. Consider implementing rate limiting for production use.

## Security Notes
- All sensitive endpoints require JWT authentication
- Passwords are hashed using bcrypt
- JWT tokens expire after 7 days
- Input validation is performed on all endpoints
- SQL injection protection through parameterized queries 