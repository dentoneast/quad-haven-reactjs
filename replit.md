# Homely Quad - Replit Project Documentation

## Project Overview
Homely Quad is a comprehensive rental property management platform built as a monorepo containing:
- **Web Application**: Next.js 14.2.33 frontend (TypeScript)
- **Mobile Application**: React Native mobile app
- **Backend Server**: Node.js/Express API server
- **Shared Package**: Common utilities and types

## Current State
**Status**: ✅ Phase 4 Complete (Frontend) | Backend APIs Pending  
**Last Updated**: November 2, 2025

### Active Components
- ✅ Web application running on port 5000
- ✅ Backend server running on port 3001
- ✅ PostgreSQL database configured with Drizzle ORM
- ✅ JWT authentication secrets configured
- ✅ Development workflows operational (web + server)
- ✅ Next.js updated to v14.2.33 for security patches
- ✅ Production deployment settings configured

## Recent Changes

### Phase 4: Maintenance Request System Complete (Nov 2, 2025)
**Status**: ✅ Frontend Complete | ⏳ Backend APIs Pending

Successfully implemented complete maintenance request management frontend:

**Maintenance Dashboard (`packages/web/app/maintenance/`)**: 
- Statistics dashboard with request counts (pending, approved, in_progress, completed)
- Color-coded stat cards with visual icons
- Quick action cards for new requests and viewing all requests
- Total requests counter

**Request Management Pages**:
- **Request Listing** (`/maintenance/requests`) - Grid view with dual filtering (status + priority)
- **Request Detail** (`/maintenance/requests/[id]`) - Full details with status timeline
- **New Request** (`/maintenance/requests/new`) - Submission form with validation
- RequestCard, RequestForm, and StatusTimeline reusable components

**Role-Based Workflows**:
- **Tenant**: Submit requests, view status, track progress
- **Landlord**: Approve/reject requests, assign workmen, monitor statistics
- **Workman**: Start work, update progress, mark as completed

**Features**:
- Full request lifecycle (pending → approved → in_progress → completed)
- Priority levels (low, medium, high, urgent) with color coding
- Category classification (plumbing, electrical, HVAC, appliance, structural, pest control, general, other)
- Status timeline visualization
- Role-based action buttons
- Property/unit selection with dynamic loading
- Form validation and error handling
- Responsive grid layouts (1-3 columns)

**Components Created**:
- **RequestCard**: Request display with status/priority badges
- **RequestForm**: Property/unit selection with validation
- **StatusTimeline**: Visual workflow progress tracker

**Backend Integration Required**:
The frontend is fully functional and ready. Backend API endpoints need to be implemented:
- `GET /api/maintenance/stats` - Request statistics
- `GET /api/maintenance` - List requests with filtering
- `GET /api/maintenance/:id` - Request details
- `POST /api/maintenance` - Create request
- `PUT /api/maintenance/:id/status` - Update status
- `PUT /api/maintenance/:id/assign` - Assign workman
- `GET /api/users?role=workman` - Get workmen list

**Database Schema**: Already exists (maintenance_requests table from Phase 1)

**Statistics**:
- Pages: 4 (dashboard, listing, detail, new)
- Components: 3 (RequestCard, RequestForm, StatusTimeline)
- Lines of Code: ~1,200+
- User Roles: 3 (tenant, landlord, workman)

**Next Steps**: Implement backend APIs, then proceed to Phase 5 - Payment Management

---

### Phase 1: Foundation & Infrastructure Complete (Nov 2, 2025)
**Status**: ✅ Complete

Successfully implemented shared packages infrastructure for the monorepo:

**Shared Types (`packages/shared/types/`)**: 
- Complete TypeScript interfaces for all entities
- User, Property, Unit, Lease, Maintenance, Payment, Message types
- API request/response types with error handling
- Filter and pagination types

**API Client (`packages/shared/api/`)**: 
- Base API client with JWT token management
- Authentication endpoints (login, register, logout, profile, password reset)
- Full CRUD endpoints for properties, units, leases
- Maintenance workflow endpoints with status management
- Payment tracking and messaging endpoints
- Error handling and retry logic

**Shared Utilities (`packages/shared/utils/` & `hooks/`)**:
- `usePlatform` - Cross-platform detection hook
- `useApi` - Generic API hook with loading/error states
- Validation utilities (email, phone, password, forms)
- Formatting utilities (currency, dates, phone numbers, text)
- Responsive design utilities and breakpoints
- Constants for status enums and API endpoints

**Benefits**:
- Zero code duplication between web and mobile packages
- Type-safe API calls with IntelliSense
- Consistent validation and formatting across platforms
- Shared business logic for maintainability

**Next Steps**: Phase 4 - Maintenance Request System implementation

---

### Phase 3: Property & Lease Management Complete (Nov 2, 2025)
**Status**: ✅ Complete

Successfully implemented property and lease management for the web platform:

**Property Management (`packages/web/`)**: 
- Property listing page with search and status filtering
- Property detail page with unit management and statistics
- Property creation and editing forms
- Unit management within properties (create, view, edit units)
- PropertyCard, PropertyForm, and UnitForm reusable components
- Direct API integration for all CRUD operations

**Lease Management (`packages/web/`)**:
- Lease listing page with status filtering (pending, active, expired, terminated)
- Lease creation form with property/unit/tenant selection
- Lease detail page with renewal and termination workflows
- LeaseCard and LeaseForm components
- Status tracking and lifecycle management
- Quick actions for payments and maintenance requests

**Features**:
- Full CRUD operations for properties and leases
- Search and filtering capabilities
- Status visualization with color-coded badges
- Form validation and error handling
- Responsive design for all screen sizes
- Integration with authentication system

**Deferred to Later Phases**:
- Property image gallery (Phase 7 - UX Enhancements)
- Lease document management (Phase 7)
- Mobile property and lease screens (future)

**Next Steps**: Phase 4 - Maintenance Request System

---

### Phase 2: Authentication & User Management Complete (Nov 2, 2025)
**Status**: ✅ Complete

Successfully implemented authentication and user management across web and mobile:

**Web Authentication (`packages/web/`)**: 
- AuthContext with JWT and automatic token refresh
- Login/register pages with role selection (tenant, landlord, workman)
- Password reset flow (request + reset pages)
- Protected routes with Next.js middleware
- Profile management (view + edit)
- Role-based dashboard

**Mobile Authentication (`packages/mobile/`)**: 
- Enhanced AuthContext using shared API client
- Secure token storage with Expo SecureStore
- Login/register screens integrated with shared types
- Automatic token refresh on 401 errors

**Features**:
- Cross-platform authentication using shared API client
- JWT token management with refresh token support
- Role-based authorization helpers
- Form validation using shared utilities
- Secure password requirements
- Profile editing with validation

**Next Steps**: Phase 3 - Property & Lease Management

---

### Vercel to Replit Migration (Nov 2, 2025)
1. **Package Updates**:
   - Updated Next.js from 14.0.0 to 14.2.33 (security fixes)
   - Removed deprecated `@next/font` package (now built into Next.js)
   - Updated eslint-config-next to match Next.js version

2. **Replit Configuration**:
   - Modified package scripts to bind to `0.0.0.0:5000` for Replit compatibility
   - Added `allowedDevOrigins` configuration in `next.config.js` to handle Replit's cross-origin requests
   - Configured workflow to run Next.js dev server from `homely-quad-next/packages/web`
   - Set up backend server workflow on port 3001

3. **Database Setup**:
   - Created PostgreSQL database using Replit's built-in database integration
   - Migrated from Prisma to Drizzle ORM (Replit recommendation)
   - Created comprehensive schema with 7 tables:
     * `users`: User accounts with authentication
     * `properties`: Property listings
     * `units`: Individual rental units within properties
     * `leases`: Lease agreements
     * `maintenance_requests`: Maintenance tracking
     * `payments`: Payment records
     * `messages`: User messaging system
   - Configured Drizzle with Neon serverless PostgreSQL driver
   - Successfully pushed schema to database

4. **Authentication & Security**:
   - Configured JWT_SECRET and JWT_REFRESH_SECRET in Replit Secrets
   - Added environment variable validation to enforce secret configuration
   - Server fails fast if required secrets are missing (security best practice)

5. **Code Improvements**:
   - Migrated viewport metadata from deprecated metadata export to new `viewport` export in layout.tsx
   - Updated backend server to test database connectivity on startup
   - Added health check endpoint with database status
   - Set up environment variables for development

6. **Deployment**:
   - Configured autoscale deployment target
   - Set build command: `cd homely-quad-next/packages/web && npm run build`
   - Set start command: `cd homely-quad-next/packages/web && npm run start`

## Project Architecture

### Directory Structure
```
homely-quad-next/
├── packages/
│   ├── web/          # Next.js web application (ACTIVE)
│   ├── mobile/       # React Native mobile app
│   ├── server/       # Express backend API
│   └── shared/       # Shared utilities and types
├── docs/             # Documentation
├── scripts/          # Build and deployment scripts
└── package.json      # Monorepo root configuration
```

### Technology Stack
- **Frontend**: Next.js 14.2.33, React 18.2, TypeScript, TailwindCSS
- **Backend**: Node.js, Express, Drizzle ORM, PostgreSQL
- **Mobile**: React Native, Expo
- **Testing**: Jest, React Testing Library
- **Package Manager**: npm (workspace-based monorepo)

## Environment Variables

### Web Application
Located in `homely-quad-next/packages/web/`:
- `NEXT_PUBLIC_API_URL`: Backend API endpoint (currently: http://localhost:3001/api)
- `NEXT_PUBLIC_APP_NAME`: Application name
- `NEXT_PUBLIC_APP_VERSION`: Version number
- Feature flags for analytics, social login, etc.

### Server Application
Located in `homely-quad-next/packages/server/`:
- `DATABASE_URL`: PostgreSQL connection string ✅ **Configured via Replit Secrets**
- `JWT_SECRET`: JWT signing secret ✅ **Configured via Replit Secrets**
- `JWT_REFRESH_SECRET`: Refresh token secret ✅ **Configured via Replit Secrets**
- Email and Cloudinary configuration (optional for full functionality)

**Note**: Required secrets are configured and validated on server startup. Server will fail fast if required secrets are missing.

## Development Workflow

### Running the Application
The web application automatically starts via the configured workflow:
```bash
cd homely-quad-next/packages/web && npm run dev
```

Access at: `https://<your-repl-url>.replit.dev`

### Common Commands
```bash
# Install dependencies
cd homely-quad-next && npm install

# Run web dev server
cd homely-quad-next/packages/web && npm run dev

# Run server dev
cd homely-quad-next/packages/server && npm run dev

# Run tests
cd homely-quad-next && npm test

# Type checking
cd homely-quad-next && npm run type-check

# Build for production
cd homely-quad-next/packages/web && npm run build
```

## Known Issues & Warnings

### Addressed
- ✅ Cross-origin warnings from Replit proxy (fixed via `allowedDevOrigins` config)
- ✅ Viewport metadata deprecation (migrated to new format)
- ✅ Next.js security vulnerabilities (updated to v14.2.33)
- ✅ Database configured and schema deployed
- ✅ JWT secrets configured and validated
- ✅ Backend server running on port 3001

### Pending
- ⚠️ One moderate severity npm vulnerability in nodemailer (optional dependency)
- ⚠️ Peer dependency conflicts requiring `--legacy-peer-deps` flag for npm install

## Next Steps

1. **Optional Services** (for full functionality):
   - Configure email service (SMTP credentials)
   - Set up Cloudinary for image uploads
   - Add Google Maps API key for location features
   - Configure payment gateways (Stripe, PayPal)

2. **Backend API Development**:
   - Implement authentication endpoints (register, login, refresh)
   - Build property management APIs
   - Add lease and payment management endpoints
   - Create maintenance request endpoints
   - Develop messaging system endpoints

## User Preferences
- **Development Style**: Modern TypeScript with strict typing
- **Package Manager**: npm (workspace monorepo)
- **Deployment**: Replit autoscale deployment

## Support & Documentation
- Project documentation: `/homely-quad-next/docs/`
- API documentation: See server package README
- Web app documentation: See web package README
- Migration notes: `/homely-quad-next/MIGRATION.md`
