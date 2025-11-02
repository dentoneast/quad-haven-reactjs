# Homely Quad - Rental Property Management Platform

**Status**: ✅ Migrated to Replit | 🚧 Phase 1 Complete  
**Last Updated**: November 2, 2025

A comprehensive rental property management platform built with modern web technologies. Homely Quad helps property owners, landlords, and tenants manage properties, leases, maintenance requests, payments, and communications all in one place.

## 📊 Migration Progress

✅ **Phase 1: Foundation & Infrastructure** (Completed November 2, 2025)
- Shared TypeScript types for all entities (users, properties, units, leases, maintenance, payments, messages)
- Complete API client with authentication, error handling, and token management
- API endpoints for all core features (properties, leases, maintenance, payments, messages)
- Shared hooks (usePlatform, useApi) and utilities (validation, formatting, responsive)
- Constants and reusable business logic

⏳ **Next Phase**: Authentication & User Management (Web + Mobile)

See [docs/feature-migration-plan.md](docs/feature-migration-plan.md) for the complete migration roadmap.

## 🏗️ Project Structure

This repository contains multiple packages organized as follows:

```
.
├── homely-quad-next/         # Monorepo for web and backend
│   ├── packages/
│   │   ├── web/              # Next.js frontend application
│   │   ├── server/           # Express backend API
│   │   ├── mobile/           # React Native mobile app
│   │   └── shared/           # Shared utilities and types
│   └── package.json          # Workspace configuration
├── homely-quad-mobile/       # Standalone React Native mobile app
└── legacy/                   # Legacy code (reference only)
```

## 🚀 Technology Stack

### Frontend (Web)
- **Framework**: Next.js 14.2.33
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI**: React 18.2

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **Authentication**: JWT-based authentication

### Mobile
- **Framework**: React Native
- **Build Tool**: Expo

### Development Tools
- **Package Manager**: npm (workspaces)
- **Testing**: Jest, React Testing Library
- **Deployment**: Replit Autoscale

## 📦 Database Schema

The application uses PostgreSQL with the following tables:

- **users** - User accounts with authentication and roles
- **properties** - Property listings and details
- **units** - Individual rental units within properties
- **leases** - Lease agreements between landlords and tenants
- **maintenance_requests** - Maintenance tracking and assignments
- **payments** - Payment records and transaction history
- **messages** - User-to-user messaging system

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd homely-quad
   ```

2. **Install dependencies**
   ```bash
   cd homely-quad-next
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**
   
   Required secrets (configure in Replit Secrets or `.env`):
   - `DATABASE_URL` - PostgreSQL connection string
   - `JWT_SECRET` - Secret for JWT token signing
   - `JWT_REFRESH_SECRET` - Secret for refresh tokens

   Optional variables:
   - Email service credentials (SMTP)
   - Cloudinary API keys (for image uploads)
   - Payment gateway credentials (Stripe, PayPal)

4. **Initialize the database**
   ```bash
   cd homely-quad-next/packages/server
   npm run db:push
   ```

### Running the Application

#### Development Mode

**Web Application** (runs on port 5000):
```bash
cd homely-quad-next/packages/web
npm run dev
```

**Backend Server** (runs on port 3001):
```bash
cd homely-quad-next/packages/server
npm run dev
```

**Mobile App**:
```bash
cd homely-quad-next/packages/mobile
npm start
```

#### Production Build

```bash
cd homely-quad-next/packages/web
npm run build
npm run start
```

## 📝 Available Scripts

### Monorepo Root (`homely-quad-next/`)
```bash
npm install              # Install all dependencies
npm test                 # Run all tests
npm run type-check       # Type check all packages
npm run lint             # Lint all packages
```

### Web Package (`homely-quad-next/packages/web/`)
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Lint code
npm run type-check       # Type check
```

### Server Package (`homely-quad-next/packages/server/`)
```bash
npm run dev              # Start development server with hot reload
npm run build            # Build TypeScript to JavaScript
npm run start            # Start production server
npm run db:push          # Push schema changes to database
npm run db:generate      # Generate migration files
```

### Shared Package (`homely-quad-next/packages/shared/`)
```bash
npm run build            # Build shared utilities
npm run dev              # Watch mode for development
npm test                 # Run tests
```

## 🔑 Key Features

- **Property Management**: Add, edit, and manage multiple properties
- **Unit Management**: Track individual rental units with details
- **Lease Management**: Create and manage lease agreements
- **Maintenance Tracking**: Submit and track maintenance requests
- **Payment Processing**: Record and track rental payments
- **User Authentication**: Secure JWT-based authentication
- **Role-Based Access**: Support for tenants, landlords, and administrators
- **Messaging System**: Built-in communication between users
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🗄️ Database Management

### Migrations
The project uses Drizzle ORM for database management. Migration files are stored in `homely-quad-next/packages/server/drizzle/`.

**Push schema changes** (development):
```bash
npm run db:push
```

**Generate migrations** (production):
```bash
npm run db:generate
```

### Schema Definition
Database schema is defined in `homely-quad-next/packages/shared/schema.ts` and shared across all packages.

## 🔐 Security

- JWT tokens for authentication (access + refresh tokens)
- Password hashing with bcrypt
- Environment variable validation (server fails fast if secrets missing)
- Secure database connections with connection pooling

## 🌐 API Endpoints

### Health Check
```
GET /api/health
```
Returns server status and database connectivity.

### Authentication
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh
POST /api/auth/logout
```

### Properties, Users, Leases, etc.
API documentation coming soon. See `homely-quad-next/packages/server/src/routes/` for available endpoints.

## 📱 Mobile Application

The mobile application is built with React Native and Expo, providing native iOS and Android experiences with the same features as the web application.

## 🚢 Deployment

The application is configured for deployment on Replit with autoscale settings:

- **Build Command**: `cd homely-quad-next/packages/web && npm run build`
- **Start Command**: `cd homely-quad-next/packages/web && npm run start`
- **Deployment Type**: Autoscale (stateless)

For production deployments, ensure all environment variables are properly configured in Replit Secrets.

## 📚 Documentation

- **Project Documentation**: See `replit.md` for detailed project information
- **Migration Guide**: See `homely-quad-next/MIGRATION.md` for Vercel to Replit migration notes
- **API Documentation**: Coming soon
- **Package READMEs**: Each package has its own README with specific details

## 🐛 Known Issues

- One moderate severity npm vulnerability in nodemailer (optional dependency)
- Peer dependency conflicts require `--legacy-peer-deps` flag for installation

## 🤝 Contributing

This is a private project. For questions or support, please contact the development team.

## 📄 License

MIT License - see individual package LICENSE files for details.

## 👥 Authors

Homely Quad Development Team

---

**Note**: This project was successfully migrated from Vercel to Replit on November 2, 2025, with enhanced database capabilities and improved deployment configuration.
