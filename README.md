# 🏠 Rently - Multi-Platform Rental Application

A comprehensive rental property management platform supporting both mobile (React Native) and web (Next.js) applications with shared business logic.

## 🏗️ Architecture Overview

Rently follows a **monorepo architecture** with three main packages:

- **`shared/`** - Shared business logic, types, and API services
- **`web/`** - Traditional web application built with Next.js 14
- **`mobile/`** - React Native mobile application with Expo

### Key Benefits

- **Code Reuse**: Shared business logic, types, and API services
- **Consistency**: Unified data models and business rules across platforms
- **Maintainability**: Single source of truth for core functionality
- **Scalability**: Easy to add new platforms while maintaining consistency

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 8+
- PostgreSQL database
- Expo CLI (for mobile development)

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd rental_app
   npm run install:all
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your database and API configuration
   ```

3. **Set up the database:**
   ```bash
   npm run db:push
   ```

4. **Build shared package:**
   ```bash
   npm run build:shared
   ```

## 🎯 Development

### Shared Business Logic

The `shared/` package contains:

- **Types**: TypeScript interfaces for all data models
- **API Services**: HTTP client and service classes
- **Hooks**: React hooks for common functionality
- **Utilities**: Helper functions and constants

```bash
cd shared
npm run dev    # Watch mode for development
npm run build  # Build for production
```

### Web Application

The `web/` package is a Next.js 14 application with:

- **Modern UI**: Tailwind CSS with custom component system
- **Type Safety**: Full TypeScript support
- **Performance**: App Router and optimized builds
- **Responsive**: Mobile-first design approach

```bash
cd web
npm run dev    # Development server
npm run build  # Production build
npm run start  # Production server
```

### Mobile Application

The `mobile/` package is a React Native app with:

- **Cross-platform**: iOS and Android support
- **Modern UI**: React Native Paper components
- **Navigation**: React Navigation with drawer and tabs
- **Web Support**: Can also run in web browsers

```bash
cd mobile
npm start      # Expo development server
npm run ios    # iOS simulator
npm run android # Android emulator
npm run web    # Web browser
```

## 🗂️ Project Structure

```
rental_app/
├── shared/                    # Shared business logic
│   ├── api/                  # API client and services
│   ├── hooks/                # React hooks
│   ├── types/                # TypeScript interfaces
│   ├── utils/                # Utility functions
│   └── package.json
├── web/                      # Next.js web application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # React components
│   │   └── lib/             # Web-specific utilities
│   ├── public/              # Static assets
│   └── package.json
├── mobile/                   # React Native application
│   ├── src/
│   │   ├── components/      # Mobile components
│   │   ├── navigation/      # Navigation setup
│   │   ├── screens/         # App screens
│   │   └── utils/           # Mobile utilities
│   └── package.json
├── server/                   # Backend API server
│   ├── index.js             # Express server
│   ├── setup-db.js          # Database setup
│   └── seed-db.js           # Sample data
└── package.json              # Monorepo root
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rently_db
DB_USER=your_username
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key

# API
API_PORT=3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Optional: External services
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Database Setup

1. **Create PostgreSQL database:**
   ```sql
   CREATE DATABASE rently_db;
   ```

2. **Run database setup:**
   ```bash
   npm run db:push
   ```

## 👤 Test Users (Seed Data)

After seeding the database, you can log in using the following accounts. All test users share the same password.

- **Default password**: `password123`

- **Tenants**:
  - `john.doe@example.com`
  - `mike.johnson@example.com`
  - `david.brown@example.com`
  - `alex.garcia@example.com`

- **Landlords**:
  - `jane.smith@example.com`
  - `sarah.wilson@example.com`
  - `emma.davis@example.com`
  - `lisa.martinez@example.com`
  - `rachel.taylor@example.com`

- **Workman**:
  - `tom.anderson@example.com`

Notes:
- Seed script source: `server/seed-db.js`
- If users already exist, the seeder skips creating duplicates.
- Roles are assigned via the `user_type` field in the seed data.

## 🚀 Deployment

### Web Application

1. **Build the application:**
   ```bash
   npm run build:web
   ```

2. **Deploy to your preferred hosting:**
   - Vercel (recommended for Next.js)
   - Netlify
   - AWS Amplify
   - Self-hosted server

### Mobile Application

1. **Build for production:**
   ```bash
   cd mobile
   npm run build:android  # Android APK
   npm run build:ios      # iOS build
   ```

2. **Publish to app stores:**
   - Google Play Store
   - Apple App Store

### Shared Package

1. **Build for production:**
   ```bash
   npm run build:shared
   ```

2. **Publish to npm (optional):**
   ```bash
   cd shared
   npm publish
   ```

## 🧪 Testing

### API Testing

```bash
npm run test-api
```

### Component Testing

```bash
# Web components
cd web && npm run test

# Mobile components
cd mobile && npm run test
```

## 📱 Features

### Core Functionality

- **User Management**: Registration, authentication, profiles
- **Property Management**: Listings, search, filters
- **Lease Management**: Contract creation and tracking
- **Maintenance System**: Request tracking and work orders
- **Communication**: Messaging between tenants and landlords

### Platform-Specific Features

#### Web Application
- **Public Pages**: Landing page, property search, about
- **Dashboard**: Role-based dashboards for all user types
- **Advanced Search**: Filters, saved searches, favorites
- **Property Management**: Full CRUD operations
- **Analytics**: Charts and reporting tools

#### Mobile Application
- **Native Experience**: Platform-specific UI components
- **Offline Support**: Cached data and offline functionality
- **Push Notifications**: Real-time updates
- **Camera Integration**: Photo uploads for maintenance
- **Location Services**: Property search by location

## 🔒 Security

- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Server-side validation with express-validator
- **SQL Injection Protection**: Parameterized queries with pg
- **CORS Configuration**: Controlled cross-origin requests
- **Environment Variables**: Secure configuration management

## 📊 Performance

### Web Application
- **Next.js 14**: Latest React framework with optimizations
- **Image Optimization**: Automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Static Generation**: Pre-rendered pages where possible

### Mobile Application
- **Expo**: Optimized React Native development
- **Lazy Loading**: On-demand component loading
- **Memory Management**: Efficient state management
- **Bundle Optimization**: Tree shaking and dead code elimination

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Test thoroughly** across all platforms
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines

- **TypeScript**: Use strict typing for all new code
- **Testing**: Write tests for new features
- **Documentation**: Update docs for API changes
- **Cross-platform**: Ensure changes work on all platforms
- **Performance**: Consider impact on bundle size and runtime

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions
- **Wiki**: Check the project wiki for detailed guides

## 🗺️ Roadmap

### Phase 1: Foundation ✅
- [x] Monorepo structure
- [x] Shared business logic
- [x] Basic web application
- [x] Mobile application refactoring

### Phase 2: Enhancement 🚧
- [ ] Advanced search and filtering
- [ ] Real-time messaging
- [ ] Payment integration
- [ ] Advanced analytics

### Phase 3: Scale 🚧
- [ ] Multi-tenant support
- [ ] API rate limiting
- [ ] Caching layer
- [ ] Performance monitoring

### Phase 4: Innovation 🚧
- [ ] AI-powered recommendations
- [ ] Virtual property tours
- [ ] Blockchain integration
- [ ] Mobile app store deployment

---

**Built with ❤️ by the Rently Team** 