# Homely Quad - Monorepo Architecture

A comprehensive monorepo for React Native mobile, React web, and Node.js backend applications with shared business logic and components.

## 🏗️ Architecture Overview

This project demonstrates best practices for building a multi-platform application with:

- **React Native Mobile App** - Cross-platform mobile application
- **React Web App** - Next.js web application
- **Node.js Backend** - Express.js API server
- **Shared Package** - Common business logic, types, and utilities

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

3. **Set up environment variables**
   ```bash
   # Copy environment files
   cp packages/server/env.example packages/server/.env
   cp packages/web/env.example packages/web/.env.local
   cp packages/mobile/env.example packages/mobile/.env
   ```

4. **Build shared package**
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
- `PUT /api/auth/profile` - Update user profile

#### Properties
- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get property by ID
- `POST /api/properties` - Create property (authenticated)
- `PUT /api/properties/:id` - Update property (authenticated)
- `DELETE /api/properties/:id` - Delete property (authenticated)
- `GET /api/properties/featured` - Get featured properties
- `POST /api/properties/search` - Search properties

#### Users
- `GET /api/users/profile` - Get user profile (authenticated)
- `PUT /api/users/profile` - Update user profile (authenticated)
- `DELETE /api/users/profile` - Delete user profile (authenticated)

## 🔧 Shared Package

The shared package contains common business logic used across all applications:

### API Services
- `authService` - Authentication operations
- `propertyService` - Property management
- `apiClient` - HTTP client with interceptors

### Hooks
- `useAuth` - Authentication state management
- `useApi` - API call management
- `useApiMutation` - API mutation management

### Utilities
- `validation` - Form validation schemas
- `formatting` - Data formatting functions
- `storage` - Platform-agnostic storage
- `platform` - Platform detection utilities

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
DATABASE_URL=postgresql://username:password@localhost:5432/homely_quad
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:19006
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

## 🔄 Version History

- **v1.0.0** - Initial release with basic functionality
  - React Native mobile app
  - Next.js web app
  - Express.js backend
  - Shared package with common logic

---

**Built with ❤️ by the Homely Quad Team**
