# Mobile Development Guide

## Overview

The mobile application is built with React Native and Expo, providing a cross-platform solution for iOS and Android. It was migrated from the monolithic Rently Mobile application and now shares business logic and components with the web application through the shared package.

## Key Features

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

### User Management
- Multi-role user system (tenant, landlord, workman, admin)
- Authentication and authorization
- Profile management

## Architecture

### Tech Stack
- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform and toolchain
- **TypeScript** - Type safety and better developer experience
- **React Navigation** - Navigation library
- **React Native Paper** - Material Design components
- **Shared Package** - Common business logic and components

### Project Structure

```
packages/mobile/
├── src/
│   ├── screens/           # Screen components
│   │   ├── auth/         # Authentication screens
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── PropertiesScreen.tsx
│   │   ├── PropertyDetailScreen.tsx
│   │   ├── SearchScreen.tsx
│   │   ├── FavoritesScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── PremisesManagementScreen.tsx
│   │   ├── RentalUnitsScreen.tsx
│   │   ├── RentalListingsScreen.tsx
│   │   ├── LeaseManagementScreen.tsx
│   │   ├── MyLeasesScreen.tsx
│   │   ├── RentPaymentsScreen.tsx
│   │   ├── OrganizationManagementScreen.tsx
│   │   ├── MaintenanceRequestsScreen.tsx
│   │   ├── LandlordMaintenanceScreen.tsx
│   │   ├── WorkmanMaintenanceScreen.tsx
│   │   ├── MaintenanceDashboardScreen.tsx
│   │   ├── ConversationsScreen.tsx
│   │   ├── ChatScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   └── HelpSupportScreen.tsx
│   ├── navigation/        # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── components/       # Mobile-specific components
│   │   ├── SideMenu.tsx
│   │   ├── NetworkStatus.tsx
│   │   └── ResponsiveLayout.tsx
│   ├── hooks/           # Mobile-specific hooks
│   │   └── usePlatform.ts
│   ├── utils/           # Mobile-specific utilities
│   │   └── responsive.ts
│   └── config/          # App configuration
│       └── app.ts
├── assets/               # Images, fonts, etc.
├── app.json             # Expo configuration
├── metro.config.js      # Metro bundler configuration
├── babel.config.js      # Babel configuration
└── package.json
```

## Development Setup

### Prerequisites
- Node.js 18+
- npm 9+
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Install dependencies**
   ```bash
   cd packages/mobile
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the development server**
   ```bash
   npm run start
   ```

### Development Commands

```bash
# Start Expo development server
npm run start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web browser
npm run web

# Build for production
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
```

## Navigation

The app uses React Navigation with a stack-based navigation system:

### Navigation Structure
- **Auth Stack** - Login and registration screens
- **Main Stack** - Main app screens
  - **Tab Navigator** - Bottom tab navigation
    - Home
    - Properties
    - Favorites
    - Profile
  - **Modal Screens** - Property details, search, etc.

### Navigation Configuration

```typescript
// AppNavigator.tsx
export default function AppNavigator({ isAuthenticated }: AppNavigatorProps) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainStack} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}
```

## State Management

### Authentication State
Uses the shared `useAuth` hook for authentication state:

```typescript
import { useAuth } from '@homely-quad/shared';

const { user, isAuthenticated, login, logout } = useAuth();
```

### API State
Uses the shared `useApi` hook for API calls:

```typescript
import { useApi } from '@homely-quad/shared';
import { propertyService } from '@homely-quad/shared';

const { data: properties, loading, error } = useApi(
  () => propertyService.getProperties(),
  { immediate: true }
);
```

## UI Components

### Shared Components
The app uses shared components from the shared package:

```typescript
import { Button, Input } from '@homely-quad/shared';

// These components automatically adapt to mobile platform
<Button title="Submit" onPress={handleSubmit} />
<Input label="Email" value={email} onChangeText={setEmail} />
```

### Platform-Specific Styling
Components automatically adapt to the mobile platform:

```typescript
// Button component automatically uses TouchableOpacity on mobile
// Input component uses TextInput on mobile
```

## Theming

### Theme Configuration
The app uses a consistent theme system:

```typescript
// theme/index.ts
export const theme = {
  colors: {
    primary: '#007AFF',
    secondary: '#6C757D',
    background: '#FFFFFF',
    // ... more colors
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  // ... more theme properties
};
```

### Using the Theme
```typescript
import { theme } from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
});
```

## API Integration

### API Client
Uses the shared API client for all network requests:

```typescript
import { apiClient, authService, propertyService } from '@homely-quad/shared';

// Automatic token management
apiClient.setToken(token);

// API calls
const properties = await propertyService.getProperties();
const user = await authService.getCurrentUser();
```

### Error Handling
Consistent error handling across the app:

```typescript
const { data, loading, error } = useApi(
  () => propertyService.getProperties(),
  { immediate: true }
);

if (error) {
  // Show error message
  return <ErrorComponent message={error} />;
}
```

## Platform-Specific Features

### iOS Features
- Native navigation gestures
- iOS-specific UI components
- Push notifications
- Biometric authentication

### Android Features
- Material Design components
- Android-specific navigation
- Push notifications
- Biometric authentication

### Cross-Platform Features
- Shared business logic
- Consistent API integration
- Unified state management
- Common UI patterns

## Performance Optimization

### Image Optimization
- Use appropriate image sizes
- Implement lazy loading
- Cache images locally

### Bundle Size
- Use Metro bundler optimizations
- Tree-shake unused code
- Optimize shared package imports

### Memory Management
- Proper component cleanup
- Optimize re-renders
- Use React.memo for expensive components

## Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Testing Strategy
- Test individual components
- Test navigation flows
- Test API integration
- Test authentication flows

## Building and Deployment

### Development Build
```bash
npm run build
```

### Production Build
```bash
# iOS
npm run build:ios

# Android
npm run build:android
```

### Expo Application Services (EAS)
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Configure EAS
eas build:configure

# Build for production
eas build --platform all

# Submit to app stores
eas submit --platform all
```

## Debugging

### React Native Debugger
- Install React Native Debugger
- Connect to Metro bundler
- Debug JavaScript and network requests

### Flipper
- Install Flipper
- Connect to development build
- Debug network, layout, and performance

### Console Logging
```typescript
import { logger } from '@homely-quad/shared';

logger.info('Debug message');
logger.error('Error message');
```

## Common Issues and Solutions

### Metro Bundler Issues
```bash
# Clear Metro cache
npx expo start --clear

# Reset Metro cache
npx expo r -c
```

### Build Issues
```bash
# Clean build
npm run clean
npm install
npm run build
```

### Navigation Issues
- Check navigation configuration
- Verify screen names
- Check navigation props

### API Issues
- Verify API endpoints
- Check authentication tokens
- Review network requests

## Best Practices

### Code Organization
- Keep screens in separate files
- Use custom hooks for complex logic
- Separate business logic from UI logic

### Performance
- Use React.memo for expensive components
- Implement proper loading states
- Optimize image loading

### Accessibility
- Add accessibility labels
- Support screen readers
- Test with accessibility tools

### Security
- Store sensitive data securely
- Validate all inputs
- Use secure authentication

## Resources

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Paper](https://reactnativepaper.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
