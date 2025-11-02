# Homely Quad - Replit Project Documentation

## Project Overview
Homely Quad is a comprehensive rental property management platform built as a monorepo containing:
- **Web Application**: Next.js 14.2.33 frontend (TypeScript)
- **Mobile Application**: React Native mobile app
- **Backend Server**: Node.js/Express API server
- **Shared Package**: Common utilities and types

## Current State
**Status**: ✅ Successfully migrated from Vercel to Replit  
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

### Vercel to Replit Migration (Nov 2, 2025)
1. **Package Updates**:
   - Updated Next.js from 14.0.0 to 14.2.33 (security fixes)
   - Removed deprecated `@next/font` package (now built into Next.js)
   - Updated eslint-config-next to match Next.js version

2. **Replit Configuration**:
   - Modified package scripts to bind to `0.0.0.0:5000` for Replit compatibility
   - Added `allowedDevOrigins` configuration in `next.config.js` to handle Replit's cross-origin requests
   - Configured workflow to run Next.js dev server from `homely-quad-web/packages/web`
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
   - Set build command: `cd homely-quad-web/packages/web && npm run build`
   - Set start command: `cd homely-quad-web/packages/web && npm run start`

## Project Architecture

### Directory Structure
```
homely-quad-web/
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
Located in `homely-quad-web/packages/web/`:
- `NEXT_PUBLIC_API_URL`: Backend API endpoint (currently: http://localhost:3001/api)
- `NEXT_PUBLIC_APP_NAME`: Application name
- `NEXT_PUBLIC_APP_VERSION`: Version number
- Feature flags for analytics, social login, etc.

### Server Application
Located in `homely-quad-web/packages/server/`:
- `DATABASE_URL`: PostgreSQL connection string ✅ **Configured via Replit Secrets**
- `JWT_SECRET`: JWT signing secret ✅ **Configured via Replit Secrets**
- `JWT_REFRESH_SECRET`: Refresh token secret ✅ **Configured via Replit Secrets**
- Email and Cloudinary configuration (optional for full functionality)

**Note**: Required secrets are configured and validated on server startup. Server will fail fast if required secrets are missing.

## Development Workflow

### Running the Application
The web application automatically starts via the configured workflow:
```bash
cd homely-quad-web/packages/web && npm run dev
```

Access at: `https://<your-repl-url>.replit.dev`

### Common Commands
```bash
# Install dependencies
cd homely-quad-web && npm install

# Run web dev server
cd homely-quad-web/packages/web && npm run dev

# Run server dev
cd homely-quad-web/packages/server && npm run dev

# Run tests
cd homely-quad-web && npm test

# Type checking
cd homely-quad-web && npm run type-check

# Build for production
cd homely-quad-web/packages/web && npm run build
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
- Project documentation: `/homely-quad-web/docs/`
- API documentation: See server package README
- Web app documentation: See web package README
- Migration notes: `/homely-quad-web/MIGRATION.md`
