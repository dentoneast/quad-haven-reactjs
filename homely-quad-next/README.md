# Homely Quad - Rental Property Management Platform

A comprehensive monorepo for rental property management with React Native mobile, Next.js web, and Node.js backend applications. Migrated from the monolithic Rently Mobile application into a scalable, maintainable architecture.

## 🏗️ Architecture Overview

This project demonstrates best practices for building a multi-platform rental property management application with:

- **React Native Mobile App** - Cross-platform mobile application for tenants, landlords, and maintenance workers
- **Next.js Web App** - Responsive web application with public pages and authenticated features
- **Node.js Backend** - Express.js API server with PostgreSQL database
- **Shared Package** - Common business logic, types, and utilities across all platforms

## 🏠 Key Features

### Property Management
- Multi-tenant property management
- Premises and rental unit management
- Lease tracking and management
- Rental listings and search

### Maintenance System
- Maintenance request workflow
- Work order management
- Role-based maintenance dashboards
- Photo and document management

### Communication
- Real-time messaging system
- Conversation management
- File sharing capabilities
- Notification system

### User Management
- Multi-role user system (tenant, landlord, workman, admin)
- Authentication and authorization
- Profile management
- Organization management

## 📁 Project Structure

```
homely-quad/
├── packages/
│   ├── shared/                 # Shared business logic
│   │   ├── src/
│   │   │   ├── api/           # API clients & services
│   │   │   ├── types/         # TypeScript definitions
│   │   │   ├── utils/         # Utility functions
│   │   │   ├── hooks/         # React hooks
│   │   │   └── components/    # Shared UI components
│   │   └── package.json
│   ├── mobile/                # React Native app
│   │   ├── src/
│   │   │   ├── screens/       # Mobile screens
│   │   │   ├── navigation/    # Navigation setup
│   │   │   └── theme/         # Mobile theme
│   │   └── package.json
│   ├── web/                   # React web app
│   │   ├── src/
│   │   │   └── app/           # Next.js app directory
│   │   └── package.json
│   └── server/                # Node.js backend
│       ├── src/
│       │   ├── controllers/   # API controllers
│       │   ├── routes/        # API routes
│       │   ├── middleware/    # Express middleware
│       │   └── utils/         # Server utilities
│       └── package.json
├── tools/                     # Build tools & scripts
├── docs/                      # Documentation
└── package.json               # Root package.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 9+
- PostgreSQL 12+
- Expo CLI (for mobile development)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd homely-quad
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up database**
   ```bash
   # Set up PostgreSQL database
   createdb homely_quad
   
   # Set up database tables and seed data
   npm run db:push
   ```

4. **Set up environment variables**
   ```bash
   # Copy environment files
   cp packages/server/env.example packages/server/.env
   cp packages/web/env.example packages/web/.env.local
   cp packages/mobile/env.example packages/mobile/.env
   ```

5. **Build shared package**
   ```bash
   npm run build:shared
   ```

### Development

Start all applications in development mode:

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:3001`
- Web app on `http://localhost:3000`
- Mobile app (Expo) on `http://localhost:19006`

### Individual Development

Start specific applications:

```bash
# Backend only
npm run dev:server

# Web app only
npm run dev:web

# Mobile app only
npm run dev:mobile

# Shared package (watch mode)
npm run dev:shared
```

## 🚀 Replit Deployment

This project is configured to run on Replit with the following setup:

### Workflow Configuration

The application uses two workflows on Replit:

1. **Server Workflow** (Backend API)
   ```bash
   cd homely-quad-next/packages/server && npm run dev
   ```
   - Runs on port 3001 (internal only)
   - Provides REST API endpoints
   - Connected to Replit PostgreSQL database

2. **Web Workflow** (Frontend)
   ```bash
   cd homely-quad-next/packages/web && NEXT_PUBLIC_API_URL=/api npm run dev
   ```
   - Runs on port 5000 (publicly accessible)
   - Next.js application with API proxy
   - Environment variable override for Replit deployment

### Important Replit Configuration

**Port Configuration:**
- Only port 5000 is publicly accessible on Replit
- Backend (port 3001) is internal-only
- Frontend uses Next.js API proxy route (`/api/[...proxy]`) to forward requests to internal backend

**Environment Variables:**
- `NEXT_PUBLIC_API_URL=/api` - Set in web workflow command to override Replit OS environment
- This ensures browser requests go through the Next.js proxy instead of directly to port 3001

**Database:**
- Uses Replit's built-in PostgreSQL database
- Connection configured via `DATABASE_URL` environment variable
- Automatic connection on server startup

### Authentication Flow (Fixed November 4, 2025)

The login system has been fully configured and tested on Replit:

**Key Fixes:**
1. **API Response Unwrapping** - Updated api-client to handle `{success, data}` response structure from backend
2. **User Type Definition** - Changed User interface from `snake_case` to `camelCase` to match API response
3. **Environment Configuration** - Configured workflow to override Replit OS environment variable
4. **Navigation Flow** - Fixed authentication state management for proper dashboard navigation

**Test Credentials:**
All users have password: `password123`

| Role | Email | Access Level |
|------|-------|-------------|
| Landlord | sarah.landlord@example.com | Property management, lease approval |
| Tenant | mike.tenant@example.com | View leases, submit maintenance requests |
| Admin | admin@homelyquad.com | Full system access |
| Workman | bob.workman@example.com | Maintenance work orders |

**Login Flow:**
1. User enters credentials on `/login` page
2. Frontend sends POST to `/api/auth/login` (Next.js proxy)
3. Proxy forwards to backend at `http://localhost:3001/api/auth/login`
4. Backend validates against PostgreSQL database
5. Returns JWT token + user data in camelCase format
6. Frontend stores credentials in localStorage
7. Navigates to role-based dashboard

### Database Setup on Replit

The database is automatically seeded with sample data:

```bash
# Reset and seed database
npm run db:reset

# Push schema changes only
npm run db:push
```

**Seeded Data:**
- 10 users (tenants, landlords, workmen, admins)
- 5 properties with multiple units
- 5 active leases
- 6 maintenance requests
- 12 payment records
- 11 messages

### Troubleshooting on Replit

**Login Issues:**
- Clear browser cache if seeing old authentication data
- Check browser console for API errors
- Verify both workflows are running

**API Errors:**
- Ensure `NEXT_PUBLIC_API_URL=/api` is set in web workflow command
- Restart workflows if backend changes aren't reflected
- Check server logs for database connection issues

**Database Issues:**
- Run `npm run db:push --force` to sync schema changes
- Check `DATABASE_URL` environment variable is set
- Verify PostgreSQL database is running in Replit

## 📱 Mobile App (React Native)

### Features

- Cross-platform mobile application
- Shared business logic with web app
- TypeScript support
- Expo for development and deployment
- React Navigation for routing
- React Native Paper for UI components

### Development

```bash
cd packages/mobile
npm run start
```

### Building

```bash
# Development build
npm run build

# Platform-specific builds
npm run build:android
npm run build:ios
```

## 🌐 Web App (Next.js)

### Features

- Server-side rendering with Next.js 14
- App Router architecture
- Tailwind CSS for styling
- TypeScript support
- Shared components with mobile app

### Development

```bash
cd packages/web
npm run dev
```

### Building

```bash
npm run build
npm run start
```

## 🖥️ Backend Server (Node.js)

### Features

- Express.js API server
- TypeScript support
- JWT authentication
- Input validation with express-validator
- Error handling middleware
- Logging with Winston
- Rate limiting
- CORS support

### Development

```bash
cd packages/server
npm run dev
```

### API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

#### Property Management
- `GET /api/premises` - Get all premises
- `POST /api/premises` - Create premises (landlord)
- `GET /api/rental-units` - Get rental units
- `POST /api/rental-units` - Create rental unit (landlord)
- `GET /api/rental-listings` - Get rental listings
- `POST /api/rental-listings` - Create rental listing (landlord)
- `GET /api/leases` - Get leases
- `POST /api/leases` - Create lease (landlord)

#### Maintenance System
- `GET /api/maintenance-requests` - Get maintenance requests
- `POST /api/maintenance-requests` - Create maintenance request (tenant)
- `PUT /api/maintenance-requests/:id/approve` - Approve request (landlord)
- `PUT /api/maintenance-requests/:id/reject` - Reject request (landlord)
- `GET /api/work-orders` - Get work orders (workman)
- `POST /api/maintenance-requests/:id/assign` - Assign work order (landlord)

#### Communication
- `GET /api/conversations` - Get conversations
- `POST /api/conversations` - Create conversation
- `GET /api/conversations/:id/messages` - Get messages
- `POST /api/conversations/:id/messages` - Send message

#### Health Check
- `GET /api/health` - Server health status

## 🔧 Shared Package

The shared package contains common business logic used across all applications:

### API Services
- `authService` - Authentication operations (login, register, logout, profile)
- `propertyService` - Property management (premises, rental units, leases, listings)
- `maintenanceService` - Maintenance system (requests, work orders, approvals)
- `chatService` - Communication (conversations, messages)
- `apiClient` - HTTP client with interceptors

### Types & Interfaces
- `User` - User types (tenant, landlord, workman, admin)
- `Premises` - Property premises management
- `RentalUnit` - Individual rental units
- `Lease` - Lease agreements
- `MaintenanceRequest` - Maintenance request workflow
- `Conversation` - Chat and messaging

### Hooks
- `useAuth` - Authentication state management with login, register, logout
- `usePlatform` - Platform detection (web, iOS, Android)

### Utilities
- `validation` - Form validation schemas
- `formatting` - Data formatting functions
- `storage` - Platform-agnostic storage
- `platform` - Platform detection utilities
- `responsive` - Responsive design utilities

### Components
- `Button` - Cross-platform button component
- `Input` - Cross-platform input component

## 🛠️ Build & Deployment

### Building All Applications

```bash
npm run build
```

### Individual Builds

```bash
npm run build:shared
npm run build:web
npm run build:mobile
npm run build:server
```

### Testing

```bash
# Run all tests
npm run test

# Run specific package tests
npm run test:shared
npm run test:web
npm run test:mobile
npm run test:server
```

### Linting

```bash
# Lint all packages
npm run lint

# Lint specific package
npm run lint:shared
npm run lint:web
npm run lint:mobile
npm run lint:server
```

## 🔐 Environment Variables

### Server (.env)
```env
NODE_ENV=development
PORT=3001
DB_USER=postgres
DB_HOST=localhost
DB_NAME=homely_quad
DB_PASSWORD=password
DB_PORT=5432
JWT_SECRET=your-super-secret-jwt-key-here
```

### Web (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

### Mobile (.env)
```env
EXPO_PUBLIC_API_URL=http://localhost:3001/api
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
EXPO_PUBLIC_ANALYTICS_ID=your-analytics-id
```

## 📚 Code Sharing Best Practices

### 1. Shared Business Logic
- API services and data models
- Authentication and authorization logic
- Data validation schemas
- Utility functions

### 2. Type Safety
- Shared TypeScript interfaces
- API response types
- Component prop types
- Platform-specific types

### 3. Component Sharing
- Platform-agnostic components
- Conditional rendering based on platform
- Shared styling patterns
- Common UI patterns

### 4. State Management
- Shared state management patterns
- API state management
- Authentication state
- User preferences

## 🚀 Deployment

### Web App
Deploy to Vercel, Netlify, or any static hosting service:

```bash
cd packages/web
npm run build
# Deploy the .next folder
```

### Mobile App
Deploy using Expo Application Services (EAS):

```bash
cd packages/mobile
npx eas build --platform all
npx eas submit --platform all
```

### Backend Server
Deploy to any Node.js hosting service:

```bash
cd packages/server
npm run build
npm start
```

## 🧪 Testing Strategy

### Unit Tests
- Test individual functions and components
- Mock external dependencies
- Test business logic in shared package

### Integration Tests
- Test API endpoints
- Test database interactions
- Test authentication flows

### E2E Tests
- Test complete user workflows
- Test cross-platform functionality
- Test API integration

## 📖 Documentation

- [API Documentation](./docs/api.md)
- [Mobile Development Guide](./docs/mobile.md)
- [Web Development Guide](./docs/web.md)
- [Deployment Guide](./docs/deployment.md)
- [Contributing Guidelines](./docs/contributing.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review existing issues and discussions

## 📋 Migration from Rently Mobile

This project was migrated from the monolithic Rently Mobile application into a scalable monorepo architecture. The migration includes:

### ✅ What Was Migrated
- **Complete Database Schema** - All tables and relationships from PostgreSQL
- **All Mobile Screens** - Every screen from the original mobile app
- **Backend API** - Full Express.js server with authentication and business logic
- **Business Logic** - Shared types, utilities, and API services
- **User Roles** - Tenant, landlord, workman, and admin functionality

### 🆕 What Was Added
- **Responsive Web Application** - Modern Next.js website with public pages
- **Enhanced UI Components** - Radix UI components for web
- **Improved Architecture** - Monorepo structure with shared packages
- **Better Type Safety** - Comprehensive TypeScript implementation
- **Modern Tooling** - Updated dependencies and development tools

### 📁 Original vs New Structure
```
rently-mobile/                 →    homely-quad/
├── src/                      →    ├── packages/
│   ├── screens/              →    │   ├── mobile/src/screens/
│   ├── components/           →    │   ├── shared/src/components/
│   └── contexts/             →    │   └── shared/src/hooks/
├── server/                   →    └── packages/server/src/
└── package.json              →    └── packages/*/package.json
```

## 🔄 Version History

- **v1.1.0** - Expo SDK 53 Upgrade (September 2024)
  - **Mobile App Upgrades:**
    - Upgraded from Expo SDK 50 to SDK 53
    - Updated React from 18.2.0 to 19.0.0
    - Updated React Native from 0.73.6 to 0.79.5
    - Updated React Navigation to v7 for compatibility
    - Updated all Expo modules to SDK 53 compatible versions
    - Disabled New Architecture for stability (`newArchEnabled: false`)
    - Fixed TypeScript configuration for SDK 53 compatibility
    - Updated Metro configuration to extend `expo/metro-config`
    - Resolved `PlatformConstants` and `babel-plugin-module-resolver` issues
  - **Configuration Changes:**
    - Updated `tsconfig.json` with proper module resolution
    - Enhanced `app.json` with explicit New Architecture settings
    - Added `jsEngine: "hermes"` configuration
    - Created placeholder asset files for app icons and splash screens
  - **Dependencies Updated:**
    - All Expo packages aligned with SDK 53
    - React Native ecosystem packages updated
    - Development dependencies updated for compatibility

- **v1.0.0** - Initial release with basic functionality
  - React Native mobile app
  - Next.js web app
  - Express.js backend
  - Shared package with common logic
  - Migrated from Rently Mobile monolithic app

## 🔧 Recent Fixes & Current Status (January 2025)

### ✅ **Resolved Issues:**
- **@babel/runtime/helpers/interopRequireDefault Error**
  - **Root Cause**: `@babel/runtime` was in devDependencies instead of dependencies
  - **Fix**: Moved `@babel/runtime@^7.24.7` to dependencies for runtime availability
  - **Status**: ✅ **RESOLVED**

- **Dependency Conflicts**
  - **Root Cause**: Conflicting packages causing module resolution issues
  - **Fix**: Removed problematic packages (`expo-dev-client`, `expo-router`, extra babel presets)
  - **Status**: ✅ **RESOLVED**

- **Babel Configuration Issues**
  - **Root Cause**: Complex babel config with conflicting presets
  - **Fix**: Simplified to use only `babel-preset-expo` for SDK 50 compatibility
  - **Status**: ✅ **RESOLVED**

### 🔄 **Current Status:**
- **Expo SDK**: Reverted to SDK 50 (stable version)
- **React**: 18.2.0
- **React Native**: 0.73.6
- **Development Server**: Testing startup after dependency fixes

### ⚠️ **Outstanding Issues:**
- **expo/config Module Not Found**
  - **Status**: ✅ **RESOLVED**
  - **Description**: Development server fails to start due to missing `expo/config` module
  - **Fix**: Reinstalled expo package and removed conflicting plugins
  - **Result**: expo/config error resolved

- **react-native Resolution Error**
  - **Status**: ✅ **RESOLVED**
  - **Description**: `expo-modules-core` cannot resolve `react-native` from relative path
  - **Fix**: Reinstalled react-native package and resolved module resolution
  - **Result**: react-native resolution error resolved

- **Asset Registry Path Error**
  - **Status**: ✅ **RESOLVED**
  - **Description**: Missing asset registry path for React Native LogBox images
  - **Error**: `Unable to resolve "missing-asset-registry-path" from "..\..\node_modules\react-native\Libraries\LogBox\UI\LogBoxImages\close.png"`
  - **Fix**: Implemented custom Metro resolver to handle missing asset registry path and React Native internal assets
  - **Result**: Asset resolution working correctly, React Native internal assets properly resolved, LogBox images handled gracefully

### 🎯 **Next Steps:**
1. **Verify App Startup** - Confirm development server starts without errors
2. **Test Basic Functionality** - Ensure "Hello World" app loads correctly
3. **Document Final Configuration** - Update setup instructions with working config
4. **Consider SDK Upgrade** - Evaluate upgrading to newer Expo SDK once stability is confirmed

### 📋 **Final Configuration Summary:**
- **Expo SDK**: 53.0.22 (matching working rently-mobile)
- **React**: 19.0.0 (required by Expo SDK 53)
- **React Native**: 0.79.5
- **New Architecture**: Enabled (`newArchEnabled: true`) for Expo Go compatibility
- **Configuration**: Using Expo defaults (no custom Metro/Babel configs)
- **Dependencies**: Aligned with working rently-mobile configuration
- **Status**: ✅ **FINAL CONFIGURATION COMPLETE - READY FOR DEVELOPMENT**

### 🔧 **Troubleshooting History:**
1. **Initial SDK 53 Upgrade Attempt** - Failed due to compatibility issues
2. **Babel Runtime Error** - Fixed by moving `@babel/runtime` to dependencies
3. **expo/config Error** - Resolved by reinstalling expo package
4. **Dependency Conflicts** - Cleaned up by removing problematic packages
5. **Asset Registry Path Error** - Resolved with custom Metro resolver
6. **Configuration Analysis** - Analyzed working rently-mobile configuration
7. **Final Solution** - Matched working configuration exactly

### ✅ **Successful Configuration Match (January 2025):**
- **Reference**: Analyzed working `/rently-mobile` configuration
- **Strategy**: Exact configuration replication instead of custom fixes
- **Result**: All previous errors resolved by using proven working setup
- **Key Changes**:
  - Upgraded to Expo SDK 53.0.22
  - Updated React to 18.3.1 and React Native to 0.79.5 (stable combination)
  - Disabled New Architecture (`newArchEnabled: false`) for stability
  - Removed custom Metro and Babel configurations
  - Added `@expo/metro-runtime` package
  - Simplified app.json to match working configuration
  - Fixed React 19 compatibility issues by using React 18.3.1

### 🎯 **Current Status:**
- **React Version Mismatch**: Resolved by upgrading to React 19.0.0 (required by Expo SDK 53)
- **New Architecture Warning**: Resolved by enabling New Architecture for Expo Go compatibility
- **Module Resolution Errors**: Resolved by using Expo defaults
- **ConfigError**: Resolved by updating package.json main field to index.ts
- **TypeError Errors**: Currently troubleshooting - testing with minimal app to isolate issue
- **Development Server**: Running with simplified configuration for debugging
- **Expo Go Compatibility**: Achieved by matching exact version requirements

### ✅ **Complete Implementation (January 2025):**
- **Reference**: Analyzed working `/rently-mobile` project structure
- **Strategy**: Implemented complete navigation and context structure
- **Result**: All errors resolved by matching working project architecture
- **Key Implementation**:
  - Updated App.tsx with proper navigation structure (PaperProvider, AuthProvider, AppNavigator)
  - Simplified tsconfig.json to use `expo/tsconfig.base` like working project
  - Renamed index.js to index.ts and updated content
  - Added @expo/vector-icons dependency for navigation icons
  - Created complete AuthContext with login/register/logout functionality
  - Created AppNavigator with tab and stack navigation
  - Created usePlatform hook for cross-platform compatibility
  - Created config/app.ts for API configuration
  - Created basic screen components (Home, Profile, Login, Register)
  - Implemented proper error handling and loading states

---

**Built with ❤️ by the Homely Quad Team**
