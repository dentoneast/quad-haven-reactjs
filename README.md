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

## 🔐 User Access Management (Mobile App)

The mobile application features a comprehensive user access management system with role-based access control:

### Authentication Features
- **Login Screen**: Email/password authentication with validation
- **Registration Screen**: Multi-step signup with user type selection (tenant, landlord, workman)
- **Profile Management**: View and edit user profile information
- **Password Management**: Secure password change functionality
- **Session Management**: Automatic login state persistence and logout

### Role-Based Access Control
- **Tenant Role**: Can view properties, create maintenance requests, view leases, make payments
- **Landlord Role**: Can manage properties, handle maintenance requests, manage leases, view reports
- **Workman Role**: Can view work orders, update maintenance status, access schedule

### Navigation & UI Features
- **Role-based Dashboard**: Personalized home screen with role-specific quick actions
- **Tab Navigation**: Bottom navigation with Messages, Search, and Profile tabs
- **Settings Screen**: Comprehensive app preferences and account management
- **Protected Routes**: Route-level access control based on user permissions
- **Role Guards**: Component-level permission checking

### Key Screens Implemented
- `LoginScreen.tsx` - User authentication
- `RegisterScreen.tsx` - User registration with role selection
- `ProfileScreen.tsx` - User profile display and management
- `EditProfileScreen.tsx` - Profile editing functionality
- `ChangePasswordScreen.tsx` - Password change interface
- `HomeScreen.tsx` - Role-based dashboard with quick actions
- `SearchScreen.tsx` - Property search with filters
- `MessagesScreen.tsx` - Communication interface
- `SettingsScreen.tsx` - App preferences and account settings

### Security Features
- **Authentication Context**: Centralized auth state management
- **Role Permissions Hook**: Granular permission checking
- **Protected Components**: UI elements that respect user permissions
- **Session Persistence**: Secure token storage and management
- **Error Handling**: Comprehensive error handling and user feedback

### Technical Implementation
- **Shared Business Logic**: Authentication logic shared between web and mobile
- **TypeScript Support**: Full type safety with proper interfaces
- **Material Design**: Consistent UI with React Native Paper components
- **Responsive Layout**: Mobile-optimized design and navigation
- **Loading States**: Proper loading indicators for async operations

## 🔧 Development Environment Setup

### Expo Development Issues & Solutions

When developing the mobile application, you may encounter network connectivity issues with Expo's API. Here are the solutions:

#### Common Network Errors
- `FetchError: request to https://api.expo.dev/v2/sdks/49.0.0/native-modules failed`
- `TypeError: Cannot read properties of undefined (reading 'bodyStream')`
- `socket hang up` errors when starting Metro bundler
- `java.net.SocketTimeoutException: timeout` in Android emulator

#### Recommended Development Approaches

**Option 1: Web Development (Recommended)**
```bash
cd mobile
npx expo start --web
```
- Opens in browser at `http://localhost:8081`
- No native module API calls required
- Perfect for testing user access management features
- Full functionality without network dependencies

**Option 2: Offline Mode**
```bash
cd mobile
npx expo start --offline
```
- Works without internet connection
- Uses cached native module information
- Bypasses Expo's cloud services

**Option 3: Local Development Server**
```bash
cd mobile
npx expo start --localhost
```
- Uses local network only
- Avoids external API calls

#### Troubleshooting Steps
1. **Clear all caches**: `npx expo start --clear --reset-cache`
2. **Update dependencies**: `npx expo install --fix`
3. **Use web mode**: `npx expo start --web` (most reliable)
4. **Check network connectivity**: Ensure no firewall blocking Expo's servers
5. **Fix SocketTimeoutException**: Use `npx expo start --localhost --android` or switch to web mode
6. **Restart Metro bundler**: Stop all processes and restart with `npx expo start --clear`

#### Testing the User Access Management
The web version allows full testing of all implemented features:
- ✅ Authentication screens (Login/Register)
- ✅ Role-based dashboards (Tenant/Landlord/Workman)
- ✅ Profile management and settings
- ✅ Navigation and protected routes
- ✅ All UI components and interactions

Use test users from the [Test Users section](#-test-users-seed-data) with password `password123`.

### Recent Fixes & Improvements

#### Mobile Application Configuration
- **✅ Expo Router Plugin Error Fixed**: Removed conflicting `expo-router` configuration from `app.json` since the app uses React Navigation
- **✅ Asset Files Resolved**: Fixed missing `splash.png` by updating configuration to use existing `splash-icon.png`
- **✅ Dependencies Updated**: 
  - Upgraded to Expo SDK 50 for Android API level 34 compliance
  - Updated React Native to 0.73.6
  - Updated React Native Reanimated to 3.6.2
  - Updated React Native Screens to 3.29.0
  - Updated React Native Safe Area Context to 4.8.2
  - Updated Expo Vector Icons to 14.0.0
- **✅ Dependency Cleanup**: Removed `@types/react-native` (included with react-native package)
- **✅ Metro Configuration**: Properly configured to extend `expo/metro-config` with monorepo support

#### Development Environment Options
- **Web Development**: `npx expo start --web` (recommended, no login required)
- **Localhost Mode**: `npx expo start --localhost` (local network only, no internet required)
- **Tunnel Mode**: `npx expo start --tunnel` (works through firewalls, requires internet)
- **EAS Services**: `npx expo login` (required for production builds and app store submission)

**Note**: `--offline` mode requires cached development certificates and may not work on first run. Use `--web` or `--localhost` for reliable offline development.

#### EAS (Expo Application Services) Integration
- **Authentication Required**: EAS services require `npx expo login` for production features
- **Local Development**: Full functionality available without EAS login using web/offline modes
- **Production Ready**: Configured for EAS Build, Submit, and Update services when needed

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