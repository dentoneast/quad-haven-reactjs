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
  "message": "Success message",
  "user": {},
  "token": "jwt-token"
}
```

Error responses:
```json
{
  "error": "Error message"
}
```

## Health Check

### GET /health
Get server health status.

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "app": "Homely Quad"
}
```

## Authentication Endpoints

### POST /auth/register
Register a new user.

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
  "message": "User created successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "date_of_birth": "1990-01-01",
    "address": "123 Main St",
    "user_type": "tenant",
    "is_verified": false,
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt-token"
}
```

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
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "date_of_birth": "1990-01-01",
    "address": "123 Main St",
    "user_type": "tenant",
    "is_verified": true,
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt-token"
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
  "id": 1,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890",
  "date_of_birth": "1990-01-01",
  "address": "123 Main St",
  "user_type": "tenant",
  "is_verified": true,
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

## Property Management Endpoints

### Premises

#### GET /premises
Get all premises.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Sunset Apartments",
    "address": "123 Sunset Blvd",
    "city": "Los Angeles",
    "state": "CA",
    "zip_code": "90210",
    "country": "USA",
    "property_type": "apartment",
    "total_units": 24,
    "year_built": 2018,
    "amenities": ["pool", "gym", "parking", "laundry"],
    "description": "Modern apartment complex with great amenities",
    "lessor_id": 2,
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### POST /premises
Create a new premises (landlord only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Downtown Lofts",
  "address": "456 Main St",
  "city": "San Francisco",
  "state": "CA",
  "zip_code": "94102",
  "country": "USA",
  "property_type": "condo",
  "total_units": 12,
  "year_built": 2020,
  "amenities": ["rooftop", "gym", "concierge"],
  "description": "Luxury condos in the heart of downtown"
}
```

### Rental Units

#### GET /rental-units
Get all rental units.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "unit_number": "101",
    "premises_id": 1,
    "unit_type": "1BR",
    "square_feet": 750,
    "bedrooms": 1,
    "bathrooms": 1.0,
    "floor_number": 1,
    "rent_amount": 2500.00,
    "security_deposit": 2500.00,
    "utilities_included": false,
    "available_from": "2024-01-01",
    "is_available": true,
    "features": ["balcony", "dishwasher", "air_conditioning"],
    "images": [],
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### POST /rental-units
Create a new rental unit (landlord only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "unit_number": "201",
  "premises_id": 1,
  "unit_type": "2BR",
  "square_feet": 1100,
  "bedrooms": 2,
  "bathrooms": 2.0,
  "floor_number": 2,
  "rent_amount": 3500.00,
  "security_deposit": 3500.00,
  "utilities_included": false,
  "available_from": "2024-01-01",
  "is_available": true,
  "features": ["balcony", "dishwasher", "air_conditioning", "walk_in_closet"],
  "images": []
}
```

### Rental Listings

#### GET /rental-listings
Get all rental listings.

**Response:**
```json
[
  {
    "id": 1,
    "rental_unit_id": 1,
    "title": "Beautiful 1BR Apartment",
    "description": "Modern apartment with great amenities",
    "monthly_rent": 2500.00,
    "available_from": "2024-01-01",
    "listing_status": "active",
    "featured": false,
    "views_count": 0,
    "contact_phone": "+1234567890",
    "contact_email": "landlord@example.com",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### POST /rental-listings
Create a new rental listing (landlord only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "rental_unit_id": 1,
  "title": "Beautiful 1BR Apartment",
  "description": "Modern apartment with great amenities",
  "monthly_rent": 2500.00,
  "available_from": "2024-01-01",
  "listing_status": "active",
  "featured": false,
  "contact_phone": "+1234567890",
  "contact_email": "landlord@example.com"
}
```

### Leases

#### GET /leases
Get all leases.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "rental_unit_id": 1,
    "lessor_id": 2,
    "lessee_id": 1,
    "start_date": "2024-01-01",
    "end_date": "2024-12-31",
    "monthly_rent": 2500.00,
    "security_deposit": 2500.00,
    "lease_status": "active",
    "terms_conditions": "Standard lease agreement",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### POST /leases
Create a new lease (landlord only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "rental_unit_id": 1,
  "lessee_id": 1,
  "start_date": "2024-01-01",
  "end_date": "2024-12-31",
  "monthly_rent": 2500.00,
  "security_deposit": 2500.00,
  "lease_status": "active",
  "terms_conditions": "Standard lease agreement"
}
```

## Maintenance System Endpoints

### Maintenance Requests

#### GET /maintenance-requests
Get maintenance requests.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "tenant_id": 1,
    "landlord_id": 2,
    "rental_unit_id": 1,
    "request_type": "routine",
    "priority": "medium",
    "title": "Kitchen faucet leak",
    "description": "The kitchen faucet has been dripping for a few days. Needs repair.",
    "status": "pending",
    "estimated_cost": 150.00,
    "actual_cost": null,
    "photos": [],
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### POST /maintenance-requests
Create a maintenance request (tenant only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "rental_unit_id": 1,
  "request_type": "routine",
  "priority": "medium",
  "title": "Kitchen faucet leak",
  "description": "The kitchen faucet has been dripping for a few days. Needs repair.",
  "estimated_cost": 150.00,
  "photos": []
}
```

#### PUT /maintenance-requests/:id/approve
Approve a maintenance request (landlord only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Maintenance request approved successfully"
}
```

#### PUT /maintenance-requests/:id/reject
Reject a maintenance request (landlord only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "reason": "Not covered under lease agreement"
}
```

### Work Orders

#### GET /work-orders
Get work orders (workman only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "maintenance_request_id": 1,
    "workman_id": 3,
    "title": "Fix kitchen faucet",
    "description": "Repair leaking kitchen faucet in unit 101",
    "instructions": "Replace O-ring and check for other leaks",
    "estimated_hours": 2.0,
    "actual_hours": null,
    "status": "assigned",
    "assigned_at": "2024-01-01T00:00:00.000Z",
    "started_at": null,
    "completed_at": null,
    "notes": null,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### POST /maintenance-requests/:id/assign
Assign work order to workman (landlord only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "workman_id": 3,
  "title": "Fix kitchen faucet",
  "description": "Repair leaking kitchen faucet in unit 101",
  "instructions": "Replace O-ring and check for other leaks",
  "estimated_hours": 2.0
}
```

## Communication Endpoints

### Conversations

#### GET /conversations
Get user conversations.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Maintenance Discussion",
    "type": "direct",
    "created_by": 1,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### POST /conversations
Create a new conversation.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Maintenance Discussion",
  "type": "direct",
  "participant_ids": [2, 3]
}
```

### Messages

#### GET /conversations/:id/messages
Get messages in a conversation.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "conversation_id": 1,
    "sender_id": 1,
    "content": "Hello, I need help with my maintenance request",
    "message_type": "text",
    "is_read": false,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### POST /conversations/:id/messages
Send a message in a conversation.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "content": "Hello, I need help with my maintenance request",
  "message_type": "text"
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
| 500 | Internal Server Error - Server error |

## Database Setup

### Setup Database Tables
```bash
npm run db:setup
```

### Seed Database with Sample Data
```bash
npm run db:seed
```

### Setup and Seed in One Command
```bash
npm run db:push
```

## User Roles

The API supports the following user roles:

- **tenant** - Can create maintenance requests, view leases, send messages
- **landlord** - Can manage properties, approve/reject maintenance requests, assign work orders
- **workman** - Can view assigned work orders, update work order status
- **admin** - Full access to all endpoints

## CORS

The API supports CORS for the following origins:
- `http://localhost:3000` (Web app)
- `http://localhost:19006` (Mobile app)

Additional origins can be configured via environment variables.