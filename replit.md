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
- Web application running on port 5000
- Development workflow configured and operational
- Next.js updated to v14.2.33 for security patches
- Production deployment settings configured

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

3. **Code Improvements**:
   - Migrated viewport metadata from deprecated metadata export to new `viewport` export in layout.tsx
   - Set up environment variables for development

4. **Deployment**:
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
- **Backend**: Node.js, Express, Prisma ORM, PostgreSQL
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
- `DATABASE_URL`: PostgreSQL connection string ⚠️ **Required - Not yet configured**
- `JWT_SECRET`: JWT signing secret ⚠️ **Required - Not yet configured**
- `JWT_REFRESH_SECRET`: Refresh token secret ⚠️ **Required - Not yet configured**
- Email and Cloudinary configuration (optional for full functionality)

**Note**: Sensitive environment variables (API keys, secrets) need to be configured via Replit Secrets.

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

### Pending
- ⚠️ One moderate severity npm vulnerability in nodemailer (optional dependency)
- ⚠️ Database not yet configured - `DATABASE_URL` needs to be set
- ⚠️ JWT secrets need to be configured for authentication to work
- ⚠️ Backend server not currently running (only frontend is active)

## Next Steps

1. **Configure Database**:
   - Set up PostgreSQL database using Replit's database tools
   - Add `DATABASE_URL` to Replit Secrets
   - Run database migrations: `cd homely-quad-web/packages/server && npm run db:setup`

2. **Configure Authentication**:
   - Add `JWT_SECRET` and `JWT_REFRESH_SECRET` to Replit Secrets
   - Configure CORS origins if running separate backend

3. **Optional Services** (for full functionality):
   - Configure email service (SMTP credentials)
   - Set up Cloudinary for image uploads
   - Add Google Maps API key for location features
   - Configure payment gateways (Stripe, PayPal)

4. **Backend Server**:
   - Once database is configured, set up workflow for backend server
   - Update API URL environment variable to point to backend

## User Preferences
- **Development Style**: Modern TypeScript with strict typing
- **Package Manager**: npm (workspace monorepo)
- **Deployment**: Replit autoscale deployment

## Support & Documentation
- Project documentation: `/homely-quad-web/docs/`
- API documentation: See server package README
- Web app documentation: See web package README
- Migration notes: `/homely-quad-web/MIGRATION.md`
