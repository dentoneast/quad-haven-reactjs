# Homely Quad - Server API

Backend API server for the Homely Quad rental property management platform.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (Neon Serverless)
- **ORM**: Drizzle ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi & Express Validator
- **Testing**: Jest & Supertest

## Project Structure

```
src/
├── controllers/        # Route handlers and business logic
├── middleware/         # Express middleware (auth, error handling)
├── routes/            # API route definitions
├── scripts/           # Database scripts
│   ├── data/         # Sample data fixtures
│   ├── seed-database.ts
│   └── reset-database.ts
├── db.ts              # Database connection
├── storage.ts         # Database queries
└── index.ts           # Server entry point
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (provided by Replit)
- Environment variables configured

### Installation

```bash
# Install dependencies (from monorepo root)
npm install

# Or install server dependencies only
cd packages/server
npm install
```

### Environment Variables

The server requires the following environment variables:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# JWT Secrets
JWT_SECRET=your-jwt-secret-key
JWT_REFRESH_SECRET=your-refresh-token-secret

# Server
PORT=3001
NODE_ENV=development
```

## Database Management

### Database Schema

The application uses Drizzle ORM for database management. Schema is defined in `packages/shared/schema.ts`.

### Available Commands

```bash
# Push schema changes to database
npm run db:push

# Push schema changes (force - use if data loss warning)
npm run db:push --force

# Generate migrations
npm run db:generate

# Open Drizzle Studio (database GUI)
npm run db:studio

# Seed database with sample data
npm run db:seed

# Reset database (drop all tables)
npm run db:reset
```

### Database Seeding

The project includes comprehensive sample data for development and testing.

#### Seeding the Database

To populate the database with sample data:

```bash
npm run db:seed
```

This will create:
- **10 Users** (1 admin, 2 landlords, 5 tenants, 2 workmen)
- **5 Properties** across different cities
- **10 Units** with various configurations
- **5 Leases** (active and expired)
- **6 Maintenance Requests** with different statuses
- **12 Payments** (paid, pending, overdue)
- **11 Messages** between users

#### Test User Credentials

All test users have the same password: `password123`

**Admin User:**
- Email: `admin@homelyquad.com`
- Username: `admin`
- Role: Admin

**Landlord Users:**
- Email: `john.landlord@example.com` / Username: `john_landlord`
- Email: `sarah.landlord@example.com` / Username: `sarah_landlord`
- Role: Landlord

**Tenant Users:**
- Email: `mike.tenant@example.com` / Username: `mike_tenant`
- Email: `emma.tenant@example.com` / Username: `emma_tenant`
- Email: `alex.tenant@example.com` / Username: `alex_tenant`
- Email: `lisa.tenant@example.com` / Username: `lisa_tenant`
- Role: Tenant

**Workman Users:**
- Email: `tom.workman@example.com` / Username: `tom_workman`
- Email: `rachel.workman@example.com` / Username: `rachel_workman`
- Role: Workman

#### Resetting the Database

To completely reset the database:

```bash
# Drop all tables
npm run db:reset

# Recreate schema
npm run db:push

# Reseed with sample data
npm run db:seed
```

**⚠️ Warning**: Database reset and seeding are **disabled in production** for safety.

#### Sample Data Details

The seeding script creates realistic, interconnected data:

**Properties:**
- Sunset Gardens Apartments (Los Angeles, CA) - 24 units
- Downtown Lofts (Chicago, IL) - 12 units
- Riverside Townhomes (Houston, TX) - 8 units
- Mountain View Estates (Phoenix, AZ) - Single family
- Oceanfront Condos (San Diego, CA) - 16 units

**Maintenance Requests:**
- Various priorities (low, medium, high, urgent)
- Different statuses (pending, approved, in_progress, completed)
- Assigned to workmen where appropriate
- Categories: plumbing, electrical, HVAC, appliance, general

**Payments:**
- Historical paid payments
- Pending current payments
- At least one overdue payment for testing

**Messages:**
- Conversations between tenants and landlords
- Maintenance-related communications
- Tenant-to-tenant community messages
- Workman notifications

## Development

### Running the Server

```bash
# Development mode with hot reload
npm run dev

# Production build
npm run build
npm start
```

The server runs on `http://localhost:3001` by default.

### API Documentation

#### Authentication Endpoints

```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - User login
POST   /api/auth/refresh      - Refresh access token
POST   /api/auth/logout       - User logout
GET    /api/auth/me           - Get current user
PUT    /api/auth/profile      - Update user profile
POST   /api/auth/forgot-password    - Request password reset
POST   /api/auth/reset-password     - Reset password
```

#### Property Endpoints

```
GET    /api/properties        - List properties (landlord/admin)
POST   /api/properties        - Create property (landlord/admin)
GET    /api/properties/:id    - Get property details
PUT    /api/properties/:id    - Update property (landlord/admin)
DELETE /api/properties/:id    - Delete property (landlord/admin)
GET    /api/properties/:id/units - Get units for property
```

#### Unit Endpoints

```
GET    /api/units             - List all units
POST   /api/units             - Create unit (landlord/admin)
GET    /api/units/:id         - Get unit details
PUT    /api/units/:id         - Update unit (landlord/admin)
DELETE /api/units/:id         - Delete unit (landlord/admin)
```

#### Lease Endpoints

```
GET    /api/leases            - List leases (filtered by role)
POST   /api/leases            - Create lease (landlord/admin)
GET    /api/leases/:id        - Get lease details
PUT    /api/leases/:id        - Update lease (landlord/admin)
DELETE /api/leases/:id        - Delete lease (landlord/admin)
```

#### Maintenance Request Endpoints

```
GET    /api/maintenance       - List maintenance requests
POST   /api/maintenance       - Create maintenance request (tenant)
GET    /api/maintenance/stats - Get maintenance statistics
GET    /api/maintenance/:id   - Get maintenance request details
PUT    /api/maintenance/:id   - Update maintenance request
PUT    /api/maintenance/:id/status - Update request status
PUT    /api/maintenance/:id/assign - Assign workman (landlord/admin)
GET    /api/maintenance/workmen     - Get available workmen (landlord/admin)
```

#### Payment Endpoints

```
GET    /api/payments          - List payments (filtered by role)
POST   /api/payments          - Create payment (landlord/admin)
GET    /api/payments/:id      - Get payment details
PUT    /api/payments/:id      - Update payment
```

#### Message Endpoints

```
GET    /api/messages          - List user messages
POST   /api/messages          - Send message
GET    /api/messages/:id      - Get message details
PUT    /api/messages/:id/read - Mark message as read
```

### Authentication & Authorization

The API uses JWT-based authentication with role-based access control (RBAC).

**Roles:**
- `admin` - Full system access
- `landlord` - Property and tenant management
- `tenant` - View own leases, submit maintenance requests
- `workman` - View and update assigned maintenance requests

**Protected Routes:**

Add authentication middleware to protected routes:

```typescript
import { authenticate, requireRole } from '../middleware/auth';

// Require authentication
router.get('/protected', authenticate, handler);

// Require specific role
router.post('/admin-only', authenticate, requireRole(['admin']), handler);

// Multiple roles allowed
router.get('/landlord-or-admin', authenticate, requireRole(['landlord', 'admin']), handler);
```

### Request Filtering

The API automatically filters data based on user role:

- **Tenants**: Only see their own leases, payments, and maintenance requests
- **Landlords**: See all data for their properties
- **Workmen**: See maintenance requests assigned to them
- **Admins**: See all data

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Code Quality

```bash
# Run TypeScript type checking
npm run type-check

# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix
```

## Deployment

The server is configured for deployment on Replit with autoscale.

### Build for Production

```bash
npm run build
```

### Environment Configuration

Ensure all environment variables are set in the Replit deployment:
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `NODE_ENV=production`

## Contributing

1. Follow TypeScript best practices
2. Use existing patterns for new features
3. Add tests for new functionality
4. Run type-check and lint before committing
5. Update API documentation when adding endpoints

## License

MIT
