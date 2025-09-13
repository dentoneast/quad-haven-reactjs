# Web Development Guide

## Overview

The web application is built with Next.js 14 and React, providing a modern, responsive web experience with public pages and authenticated features. It was created as part of the migration from the monolithic Rently Mobile application and shares business logic and components with the mobile application through the shared package.

## Key Features

### Public Pages
- **Homepage** - Marketing page with features, pricing, and call-to-action
- **Authentication** - Login and registration pages
- **Marketing Content** - About, contact, pricing, and features pages

### Authenticated Features
- **Property Management** - Multi-tenant property management
- **Maintenance System** - Request workflow and work order management
- **Communication** - Real-time messaging and conversation management
- **User Management** - Profile management and role-based access

### Responsive Design
- **Desktop-First** - Optimized for desktop with mobile adaptation
- **Mobile Responsive** - Seamless experience across all devices
- **Modern UI** - Clean, professional design with Tailwind CSS

## Architecture

### Tech Stack
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Headless UI** - Accessible UI components
- **Framer Motion** - Animation library
- **Shared Package** - Common business logic and components

### Project Structure

```
packages/web/
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page (marketing)
│   │   ├── globals.css     # Global styles
│   │   ├── login/          # Login page
│   │   │   └── page.tsx
│   │   └── register/       # Registration page
│   │       └── page.tsx
│   ├── components/         # Web-specific components
│   │   └── ui/            # UI component library
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── card.tsx
│   │       ├── badge.tsx
│   │       ├── alert.tsx
│   │       ├── label.tsx
│   │       └── select.tsx
│   └── lib/               # Utility functions
│       └── utils.ts
├── public/                # Static assets
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind configuration
├── postcss.config.js      # PostCSS configuration
└── package.json
```

## Development Setup

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

1. **Install dependencies**
   ```bash
   cd packages/web
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Type checking
npm run type-check

# Linting
npm run lint

# Testing
npm run test
```

## Next.js App Router

### File-based Routing
The app uses Next.js 14's App Router with file-based routing:

```
src/app/
├── layout.tsx          # Root layout
├── page.tsx            # Home page (/)
├── (auth)/             # Auth route group
│   ├── login/          # Login page (/login)
│   └── register/       # Register page (/register)
├── properties/         # Properties pages
│   ├── page.tsx        # Properties list (/properties)
│   └── [id]/           # Dynamic property page
│       └── page.tsx    # Property details (/properties/[id])
└── profile/            # Profile pages
    └── page.tsx        # User profile (/profile)
```

### Layout System
```typescript
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
```

### Page Components
```typescript
// app/page.tsx
export default function HomePage() {
  return (
    <div>
      <h1>Welcome to Homely Quad</h1>
      {/* Page content */}
    </div>
  )
}
```

## Styling with Tailwind CSS

### Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          // ... more colors
        },
      },
    },
  },
  plugins: [],
}
```

### Custom Components
```typescript
// globals.css
@layer components {
  .btn {
    @apply inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors;
  }
  
  .btn-primary {
    @apply bg-primary-600 text-white hover:bg-primary-700;
  }
}
```

### Using Tailwind Classes
```typescript
<div className="bg-white shadow-lg rounded-lg p-6">
  <h2 className="text-2xl font-bold text-gray-900 mb-4">
    Property Title
  </h2>
  <p className="text-gray-600">
    Property description
  </p>
</div>
```

## State Management

### Authentication State
Uses the shared `useAuth` hook:

```typescript
'use client';

import { useAuth } from '@homely-quad/shared';

export default function Header() {
  const { user, isAuthenticated, login, logout } = useAuth();

  return (
    <header>
      {isAuthenticated ? (
        <div>
          <span>Welcome, {user?.firstName}</span>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <button onClick={() => login(credentials)}>Login</button>
        </div>
      )}
    </header>
  );
}
```

### API State
Uses the shared `useApi` hook:

```typescript
import { useApi } from '@homely-quad/shared';
import { propertyService } from '@homely-quad/shared';

export default function PropertiesPage() {
  const { data: properties, loading, error } = useApi(
    () => propertyService.getProperties(),
    { immediate: true }
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {properties?.map(property => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
```

## UI Components

### Shared Components
Use shared components that automatically adapt to web platform:

```typescript
import { Button, Input } from '@homely-quad/shared';

// These components render as HTML elements on web
<Button title="Submit" onPress={handleSubmit} />
<Input label="Email" value={email} onChangeText={setEmail} />
```

### Web-Specific Components
Create web-specific components when needed:

```typescript
// components/PropertyCard.tsx
interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img 
        src={property.images[0]} 
        alt={property.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{property.title}</h3>
        <p className="text-gray-600">{property.location.city}</p>
        <p className="text-xl font-bold text-primary-600">
          {formatCurrency(property.price, property.currency)}
        </p>
      </div>
    </div>
  );
}
```

## API Integration

### API Client Configuration
```typescript
// lib/api.ts
import { apiClient } from '@homely-quad/shared';

// Configure API client for web
apiClient.setBaseURL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api');
```

### Server-Side Rendering
```typescript
// app/properties/page.tsx
import { propertyService } from '@homely-quad/shared';

export default async function PropertiesPage() {
  // This runs on the server
  const properties = await propertyService.getProperties();

  return (
    <div>
      {properties.map(property => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
```

### Client-Side Data Fetching
```typescript
'use client';

import { useApi } from '@homely-quad/shared';
import { propertyService } from '@homely-quad/shared';

export default function PropertiesPage() {
  const { data: properties, loading, error } = useApi(
    () => propertyService.getProperties(),
    { immediate: true }
  );

  // Component logic
}
```

## Responsive Design

### Breakpoints
```typescript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
}
```

### Responsive Components
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {properties.map(property => (
    <PropertyCard key={property.id} property={property} />
  ))}
</div>
```

### Mobile-First Approach
```typescript
// Mobile-first responsive design
<div className="
  p-4          // Mobile: 16px padding
  md:p-6       // Medium screens: 24px padding
  lg:p-8       // Large screens: 32px padding
">
  <h1 className="
    text-2xl    // Mobile: 24px text
    md:text-3xl // Medium screens: 30px text
    lg:text-4xl // Large screens: 36px text
  ">
    Properties
  </h1>
</div>
```

## Performance Optimization

### Image Optimization
```typescript
import Image from 'next/image';

<Image
  src={property.images[0]}
  alt={property.title}
  width={400}
  height={300}
  className="rounded-lg"
  priority // For above-the-fold images
/>
```

### Code Splitting
```typescript
import dynamic from 'next/dynamic';

// Lazy load heavy components
const PropertyMap = dynamic(() => import('./PropertyMap'), {
  loading: () => <div>Loading map...</div>,
  ssr: false // Disable SSR for client-only components
});
```

### Caching
```typescript
// app/properties/page.tsx
export const revalidate = 3600; // Revalidate every hour

export default async function PropertiesPage() {
  const properties = await propertyService.getProperties();
  // ...
}
```

## SEO Optimization

### Metadata
```typescript
// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Homely Quad - Find Your Perfect Home',
  description: 'Discover and rent the perfect property with Homely Quad.',
  keywords: 'rental, property, apartment, house, real estate',
  openGraph: {
    title: 'Homely Quad',
    description: 'Find your perfect home',
    images: ['/og-image.jpg'],
  },
};
```

### Page-Specific Metadata
```typescript
// app/properties/page.tsx
export const metadata: Metadata = {
  title: 'Properties - Homely Quad',
  description: 'Browse our selection of rental properties.',
};
```

### Structured Data
```typescript
// components/PropertySchema.tsx
export function PropertySchema({ property }: { property: Property }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Apartment",
    "name": property.title,
    "description": property.description,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": property.location.address,
      "addressLocality": property.location.city,
      "addressRegion": property.location.state,
      "postalCode": property.location.postalCode,
    },
    "offers": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": property.currency,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

## Testing

### Unit Tests
```typescript
// __tests__/PropertyCard.test.tsx
import { render, screen } from '@testing-library/react';
import { PropertyCard } from '../components/PropertyCard';

test('renders property card', () => {
  const property = {
    id: '1',
    title: 'Test Property',
    price: 1000,
    currency: 'USD',
    // ... other properties
  };

  render(<PropertyCard property={property} />);
  
  expect(screen.getByText('Test Property')).toBeInTheDocument();
  expect(screen.getByText('$1,000')).toBeInTheDocument();
});
```

### E2E Tests
```typescript
// e2e/properties.spec.ts
import { test, expect } from '@playwright/test';

test('should display properties list', async ({ page }) => {
  await page.goto('/properties');
  
  await expect(page.getByText('Properties')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();
});
```

## Deployment

### Vercel Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.homelyquad.com
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-api-key
```

### Build Optimization
```javascript
// next.config.js
module.exports = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['via.placeholder.com'],
  },
  compress: true,
  poweredByHeader: false,
};
```

## Common Issues and Solutions

### Hydration Mismatch
```typescript
// Use useEffect for client-only code
'use client';

import { useEffect, useState } from 'react';

export default function ClientComponent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <div>Client-only content</div>;
}
```

### API Route Issues
```typescript
// app/api/properties/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const properties = await propertyService.getProperties();
    return NextResponse.json({ success: true, data: properties });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch properties' }, { status: 500 });
  }
}
```

### Build Issues
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Build again
npm run build
```

## Best Practices

### Code Organization
- Keep components small and focused
- Use custom hooks for complex logic
- Separate business logic from UI logic

### Performance
- Use Next.js Image component for images
- Implement proper loading states
- Optimize bundle size

### Accessibility
- Use semantic HTML elements
- Add proper ARIA labels
- Test with screen readers

### Security
- Validate all inputs
- Use HTTPS in production
- Implement proper authentication

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Headless UI](https://headlessui.com/)
