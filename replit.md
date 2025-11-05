# Homely Quad - Replit Project Documentation

## Overview
Homely Quad is a comprehensive rental property management platform designed as a monorepo. Its primary purpose is to provide a full-stack solution for managing rental properties, encompassing web and mobile applications, a robust backend, and shared utilities. The platform aims to streamline property, lease, maintenance, and payment management, offering distinct role-based workflows for tenants, landlords, and workmen.

## User Preferences
- **Development Style**: Modern TypeScript with strict typing
- **Package Manager**: npm (workspace monorepo)
- **Deployment**: Replit autoscale deployment

## Environment Configuration
- **API Proxy**: Frontend uses Next.js API proxy route (`/api/[...proxy]`) to forward requests to internal backend
- **Environment Variable**: `NEXT_PUBLIC_API_URL=/api` (set in web workflow command to override Replit OS environment)
- **Port Configuration**: Only port 5000 is publicly accessible; backend (port 3001) is internal-only
- **Workflow Commands**: 
  - Web: `cd homely-quad-next/packages/web && NEXT_PUBLIC_API_URL=/api npm run dev`
  - Server: `cd homely-quad-next/packages/server && npm run dev`

## Recent Changes (November 5, 2025)
- **Dashboard Folder Reorganization**: Restructured all dashboard pages under /dashboard folder for better organization
  - Moved properties, leases, maintenance, payments, and profile pages from root app folder to /app/dashboard/*
  - Updated all navigation links and breadcrumbs to use /dashboard/* paths consistently
  - Fixed breadcrumb builder to preserve /dashboard prefix for nested pages
  - Updated EditProfilePage redirect to use /dashboard/profile (from /profile)
  - All dashboard routes now follow consistent pattern: /dashboard/{section}
- **Responsive Layout Implementation**: Implemented mobile-first responsive design for public and dashboard pages
  - Added mobile hamburger menu with sliding sidebar for dashboard (hidden off-screen on mobile, visible on desktop)
  - Implemented mobile navigation menu for public home page with collapsible links
  - Added proper accessibility attributes (aria-label, aria-expanded, aria-controls) for screen reader support
  - Responsive breakpoints: mobile-first, md: tablet (768px+), lg: desktop (1024px+)
  - Mobile overlay with backdrop for sidebar closes on click outside
  - Responsive spacing adjustments (p-4 sm:p-6 lg:p-8) across all screen sizes
- **Logout Endpoint Fixed**: Removed authentication requirement from /logout endpoint
  - Users can now logout even with expired/invalid tokens (fixes 401 error)

## Recent Changes (November 4, 2025)
- **Login System Fixed**: Resolved authentication and navigation issues
  - Fixed API response unwrapping in api-client (handles {success, data} structure)
  - Updated User type to camelCase properties (firstName, role, etc.) to match API response
  - Configured environment variable override in web workflow command
  - Authentication flow now works correctly: login → store credentials → navigate to dashboard

## System Architecture
The project is structured as a monorepo containing:
-   **Web Application**: A Next.js 14.2.33 frontend (TypeScript) for a rich user experience.
-   **Mobile Application**: A React Native application for on-the-go access.
-   **Backend Server**: A Node.js/Express API server handling business logic and data persistence.
-   **Shared Package**: A common library for TypeScript types, API clients, and utilities to ensure consistency and reduce redundancy across platforms.

**Key Architectural Decisions and Features:**
-   **Monorepo Structure**: Facilitates code sharing and consistent development across web, mobile, and server components.
-   **Role-Based Access Control (RBAC)**: Implemented for tenants, landlords, and workmen, ensuring secure and appropriate access to features and data.
-   **Payment Tracking System** (Phase 5 Complete): Full-stack implementation with 8 backend APIs (stats, getAll, pending, overdue, detail, create, record payment, delete) featuring role-based filtering (tenants see their payments, landlords see their properties' payments), payment lifecycle management (pending → paid), and comprehensive financial tracking with stats. Frontend includes payment dashboard, list views (all/pending/overdue), detail pages, and recording functionality.
-   **Maintenance Request System** (Phase 4 Complete): Full-stack implementation with 7 backend APIs (stats, list, detail, create, update status, assign workman, get workmen) featuring role-based access control, performance optimizations (N+1 query elimination), and comprehensive security. Frontend includes dashboard, request listing, detail views, and submission form with lifecycle management (pending, approved, in_progress, completed) and priority levels.
-   **Property & Lease Management**: Full CRUD operations for properties and leases, including unit management, status tracking, and filtering capabilities.
-   **Authentication & User Management**: Cross-platform JWT-based authentication with token refresh, role selection during registration, password reset flows, and profile management.
-   **Database Seeding Infrastructure**: Comprehensive sample data system using Drizzle ORM with 10 users, 5 properties, 10 units, 5 leases, 6 maintenance requests, 12 payments, and 11 messages. Supports rapid development, testing, and demonstrations with realistic data across all user roles. Scripts available: `npm run db:seed` and `npm run db:reset`.
-   **Reusable Dashboard Layout**: Consistent UI component for all dashboard pages with fully responsive sidebar navigation (mobile hamburger menu, sliding sidebar, overlay), breadcrumbs, role-based menu items, and accessibility support (ARIA attributes for screen readers).
-   **Type Safety**: Extensive use of TypeScript across all packages for improved code quality and maintainability.
-   **Database**: PostgreSQL managed with Drizzle ORM, featuring a comprehensive schema for users, properties, units, leases, maintenance requests, and payments.
-   **UI/UX**: Mobile-first responsive design across all web components with TailwindCSS breakpoints (sm: 640px, md: 768px, lg: 1024px), color-coded badges, visual indicators for status and priority, and WCAG-compliant accessibility features.

## External Dependencies
-   **Frontend**: Next.js 14.2.33, React 18.2, TypeScript, TailwindCSS
-   **Backend**: Node.js, Express, Drizzle ORM, PostgreSQL (via Replit's built-in database and Neon serverless driver)
-   **Mobile**: React Native, Expo
-   **Authentication**: JSON Web Tokens (JWT)
-   **Testing**: Jest, React Testing Library
-   **Package Manager**: npm (workspace-based monorepo)
-   **Deployment Platform**: Replit (for hosting and PostgreSQL database)

## Code Patterns
- **Drizzle ORM Queries**: Build separate queries for each role/condition rather than reassigning query variables (prevents TypeScript type errors)
- **Route Validation**: Use express-validator arrays directly in routes without separate validateRequest middleware
- **Security**: All endpoints require JWT authentication with role-based filtering at query level (JOIN through related tables for landlords)
- **Performance**: Single-query approach with proper JOINs for efficient data retrieval, avoiding N+1 queries