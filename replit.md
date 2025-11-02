# Homely Quad - Replit Project Documentation

## Overview
Homely Quad is a comprehensive rental property management platform designed as a monorepo. Its primary purpose is to provide a full-stack solution for managing rental properties, encompassing web and mobile applications, a robust backend, and shared utilities. The platform aims to streamline property, lease, and maintenance management, offering distinct role-based workflows for tenants, landlords, and workmen.

## User Preferences
- **Development Style**: Modern TypeScript with strict typing
- **Package Manager**: npm (workspace monorepo)
- **Deployment**: Replit autoscale deployment

## System Architecture
The project is structured as a monorepo containing:
-   **Web Application**: A Next.js 14.2.33 frontend (TypeScript) for a rich user experience.
-   **Mobile Application**: A React Native application for on-the-go access.
-   **Backend Server**: A Node.js/Express API server handling business logic and data persistence.
-   **Shared Package**: A common library for TypeScript types, API clients, and utilities to ensure consistency and reduce redundancy across platforms.

**Key Architectural Decisions and Features:**
-   **Monorepo Structure**: Facilitates code sharing and consistent development across web, mobile, and server components.
-   **Role-Based Access Control (RBAC)**: Implemented for tenants, landlords, and workmen, ensuring secure and appropriate access to features and data.
-   **Maintenance Request System** (Phase 4 Complete): Full-stack implementation with 7 backend APIs (stats, list, detail, create, update status, assign workman, get workmen) featuring role-based access control, performance optimizations (N+1 query elimination), and comprehensive security. Frontend includes dashboard, request listing, detail views, and submission form with lifecycle management (pending, approved, in_progress, completed) and priority levels.
-   **Property & Lease Management**: Full CRUD operations for properties and leases, including unit management, status tracking, and filtering capabilities.
-   **Authentication & User Management**: Cross-platform JWT-based authentication with token refresh, role selection during registration, password reset flows, and profile management.
-   **Database Seeding Infrastructure**: Comprehensive sample data system using Drizzle ORM with 10 users, 5 properties, 10 units, 5 leases, 6 maintenance requests, 12 payments, and 11 messages. Supports rapid development, testing, and demonstrations with realistic data across all user roles. Scripts available: `npm run db:seed` and `npm run db:reset`.
-   **Type Safety**: Extensive use of TypeScript across all packages for improved code quality and maintainability.
-   **Database**: PostgreSQL managed with Drizzle ORM, featuring a comprehensive schema for users, properties, units, leases, maintenance requests, and payments.
-   **UI/UX**: Responsive design principles applied across all web components, with color-coded badges and visual indicators for status and priority.

## External Dependencies
-   **Frontend**: Next.js 14.2.33, React 18.2, TypeScript, TailwindCSS
-   **Backend**: Node.js, Express, Drizzle ORM, PostgreSQL (via Replit's built-in database and Neon serverless driver)
-   **Mobile**: React Native, Expo
-   **Authentication**: JSON Web Tokens (JWT)
-   **Testing**: Jest, React Testing Library
-   **Package Manager**: npm (workspace-based monorepo)
-   **Deployment Platform**: Replit (for hosting and PostgreSQL database)