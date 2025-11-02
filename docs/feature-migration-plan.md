# Feature Migration Plan: homely-quad-mobile → homely-quad-next

**Document Version**: 1.3  
**Created**: November 2, 2025  
**Last Updated**: November 2, 2025  
**Status**: Phase 3 Complete ✅

---

## Executive Summary

This document outlines a phased approach to migrate all features from the standalone `homely-quad-mobile` application to the monorepo structure in `homely-quad-next`, specifically targeting:
- `homely-quad-next/packages/web` (Next.js web application)
- `homely-quad-next/packages/mobile` (React Native mobile app)

The migration will preserve all existing functionality while leveraging the new monorepo architecture with shared components, types, and business logic.

---

## Current State Analysis

### homely-quad-mobile (Source)
**Status**: ✅ Fully functional standalone app

**Key Features**:
- ✅ Complete authentication system (login, register, JWT)
- ✅ Role-based access control (tenant, landlord, workman, admin)
- ✅ Multi-tenancy support with organizations
- ✅ Property & premises management
- ✅ Rental unit management
- ✅ Lease management
- ✅ Maintenance request workflow system
- ✅ Chat & messaging system
- ✅ Profile management
- ✅ Organization management
- ✅ Dual platform support (mobile + web)

**Tech Stack**:
- React Native with Expo
- React Navigation (Stack, Bottom Tabs, Drawer)
- React Native Paper (Material Design)
- Expo Secure Store
- PostgreSQL backend (Express.js server)
- TypeScript

**Screen Count**: 20+ screens
**Components**: 10+ reusable components
**Backend**: Self-contained Express server with PostgreSQL

---

### homely-quad-next/packages/web (Target - Web)
**Status**: ⚠️ Minimal implementation

**Current Features**:
- Basic login/register pages
- UI component library (shadcn/ui)
- TailwindCSS styling
- Next.js 14.2.33 framework

**Missing Features**: All core business features

---

### homely-quad-next/packages/mobile (Target - Mobile)
**Status**: ⚠️ Partial implementation

**Current Features**:
- Some screens migrated
- Basic navigation structure
- Auth context
- Platform detection hooks

**Missing Features**: Full maintenance workflow, chat system, lease management, etc.

---

## Migration Strategy

### Shared Resources Approach
The monorepo structure allows for maximum code reuse:

```
homely-quad-next/packages/shared/
├── schema.ts              # Drizzle ORM schema (already exists)
├── types/                 # Shared TypeScript types
├── api/                   # API client utilities
├── hooks/                 # React hooks (usePlatform, etc.)
├── utils/                 # Helper functions
└── constants/             # Shared constants
```

### Platform-Specific Implementation
- **Web**: Next.js App Router, Server Components, TailwindCSS
- **Mobile**: React Native, Expo, React Native Paper

---

## Phase 1: Foundation & Infrastructure ✅ **COMPLETED**

**Completion Date**: November 2, 2025  
**Status**: All deliverables implemented and tested

### 1.1 Backend API Integration ✅ **COMPLETED**

**Objective**: Connect packages to the existing Drizzle database

**Tasks**:
- [x] Create API client utilities in `packages/shared/api/`
- [x] Set up API base URLs and configuration
- [x] Implement authentication API methods (login, register, refresh token)
- [x] Create error handling utilities
- [x] Set up API response typing

**Deliverables**: ✅
- `packages/shared/api/client.ts` - Base API client with token management
- `packages/shared/api/auth.ts` - Complete auth endpoints (login, register, logout, profile, password reset)
- `packages/shared/api/properties.ts` - Property CRUD and image upload endpoints
- `packages/shared/api/units.ts` - Unit management endpoints
- `packages/shared/api/leases.ts` - Lease lifecycle endpoints
- `packages/shared/api/maintenance.ts` - Maintenance workflow endpoints
- `packages/shared/api/payments.ts` - Payment tracking endpoints
- `packages/shared/api/messages.ts` - Messaging system endpoints
- `packages/shared/api/index.ts` - Unified API exports

**Dependencies**: None (Drizzle schema already exists)

---

### 1.2 Type System Migration ✅ **COMPLETED**

**Objective**: Move shared types to the monorepo

**Tasks**:
- [x] Migrate TypeScript interfaces from `homely-quad-mobile/src/config/`
- [x] Create shared type definitions in `packages/shared/types/`
- [x] Define API request/response types
- [x] Create role enum and permission types
- [x] Define database entity types (aligned with Drizzle schema)

**Deliverables**: ✅
- `packages/shared/types/user.ts` - User, role, auth types
- `packages/shared/types/property.ts` - Property and filter types
- `packages/shared/types/unit.ts` - Unit status and management types
- `packages/shared/types/lease.ts` - Lease lifecycle types
- `packages/shared/types/maintenance.ts` - Maintenance workflow types with stats
- `packages/shared/types/payment.ts` - Payment tracking types with stats
- `packages/shared/types/message.ts` - Messaging and conversation types
- `packages/shared/types/api.ts` - API response, error, and pagination types
- `packages/shared/types/index.ts` - Unified type exports

**Dependencies**: Phase 1.1 (API structure)

---

### 1.3 Shared Utilities & Hooks ✅ **COMPLETED**

**Objective**: Extract reusable logic

**Tasks**:
- [x] Migrate `usePlatform.ts` to `packages/shared/hooks/`
- [x] Create `useApi` hook for API state management
- [x] Migrate `responsive.ts` utilities
- [x] Create form validation utilities
- [x] Create date formatting utilities

**Deliverables**: ✅
- `packages/shared/hooks/usePlatform.ts` - Cross-platform detection hook
- `packages/shared/hooks/useApi.ts` - Generic API hook with loading/error states
- `packages/shared/hooks/index.ts` - Hook exports
- `packages/shared/utils/validation.ts` - Email, phone, password, form validation
- `packages/shared/utils/formatting.ts` - Currency, date, phone, text formatting
- `packages/shared/utils/responsive.ts` - Breakpoints and responsive helpers
- `packages/shared/utils/index.ts` - Utility exports
- `packages/shared/constants/index.ts` - Status constants, roles, API endpoints
- `packages/shared/index.ts` - Main package entry point

**Dependencies**: Phase 1.2 (Type definitions)

---

## Phase 2: Authentication & User Management ✅ **COMPLETED**

**Completion Date**: November 2, 2025  
**Status**: All deliverables implemented and tested

### 2.1 Authentication System - Web ✅ **COMPLETED**

**Objective**: Implement full auth flow in Next.js

**Tasks**:
- [x] Create authentication context provider
- [x] Implement login page with form validation
- [x] Implement registration page with role selection
- [x] Set up protected routes with middleware
- [x] Implement JWT token management with localStorage
- [x] Create password reset flow (request + reset pages)
- [x] Add session management with automatic token refresh

**Deliverables**: ✅
- `packages/web/src/contexts/AuthContext.tsx` - Complete auth provider with shared API client
- `packages/web/src/app/login/page.tsx` - Enhanced login with validation
- `packages/web/src/app/register/page.tsx` - Registration with role selection (tenant, landlord, workman)
- `packages/web/src/app/forgot-password/page.tsx` - Password reset request page
- `packages/web/src/app/reset-password/page.tsx` - Password reset confirmation page
- `packages/web/src/middleware.ts` - Protected route middleware
- `packages/web/src/lib/auth.ts` - Role-based authorization helpers
- `packages/web/src/app/dashboard/page.tsx` - Role-based dashboard

**Dependencies**: Phase 1.1, 1.2

---

### 2.2 Authentication System - Mobile ✅ **COMPLETED**

**Objective**: Complete auth implementation for mobile

**Tasks**:
- [x] Enhance existing `AuthContext.tsx` with shared API client
- [x] Integrate login screen with enhanced validation
- [x] Integrate registration screen with shared types
- [x] Implement secure token storage (Expo SecureStore)
- [x] Implement auto-refresh token logic from shared API client

**Deliverables**: ✅
- `packages/mobile/src/contexts/AuthContext.tsx` - Enhanced with shared API client and types
- `packages/mobile/src/screens/LoginScreen.tsx` - Using shared auth API
- `packages/mobile/src/screens/RegisterScreen.tsx` - Using shared auth API
- Secure token storage with refresh token support

**Dependencies**: Phase 1.1, 1.2

---

### 2.3 Profile Management - Both Platforms ✅ **COMPLETED**

**Objective**: User profile viewing and editing

**Tasks**:
- [x] Create profile view UI for web
- [x] Create profile edit UI for web
- [x] Implement profile editing functionality
- [x] Profile screens available for mobile (existing)

**Deliverables**: ✅
- `packages/web/src/app/profile/page.tsx` - Profile view with formatted data
- `packages/web/src/app/profile/edit/page.tsx` - Profile editing with validation
- `packages/mobile/src/screens/ProfileScreen.tsx` - Mobile profile (existing, now using shared auth)

**Dependencies**: Phase 2.1, 2.2

---

## Phase 3: Property & Lease Management ✅ **COMPLETED**

**Completion Date**: November 2, 2025  
**Status**: Core deliverables implemented and functional

### 3.1 Property Management - Web ✅ **COMPLETED**

**Objective**: Full property CRUD operations

**Tasks**:
- [x] Create property listing page
- [x] Create property detail page
- [x] Implement add/edit property forms
- [x] Add property search and filtering
- [x] Create premises management UI
- [x] Implement rental units management
- [~] Add property images/gallery (deferred to Phase 7 - UX Enhancements)

**Deliverables**: ✅
- `packages/web/src/app/properties/page.tsx` - Property listing with search and status filtering
- `packages/web/src/app/properties/[id]/page.tsx` - Property detail view with unit management
- `packages/web/src/app/properties/new/page.tsx` - Property creation form
- `packages/web/src/app/properties/[id]/edit/page.tsx` - Property editing form
- `packages/web/src/app/properties/[id]/units/new/page.tsx` - Unit creation form
- `packages/web/src/components/properties/PropertyCard.tsx` - Property card component
- `packages/web/src/components/properties/PropertyForm.tsx` - Reusable property form component
- `packages/web/src/components/properties/UnitForm.tsx` - Reusable unit form component

**Dependencies**: Phase 2.1

---

### 3.2 Property Management - Mobile ⏳ **DEFERRED**

**Objective**: Mobile property management

**Status**: Deferred to focus on web platform completion. Mobile screens exist in original app and can be migrated later.

**Tasks**:
- [ ] Migrate `PremisesManagementScreen.tsx`
- [ ] Migrate `RentalUnitsScreen.tsx`
- [ ] Migrate `RentalListingsScreen.tsx`
- [ ] Migrate `SearchRentalsScreen.tsx`
- [ ] Migrate `SavedRentalsScreen.tsx`
- [ ] Create property detail screen
- [ ] Implement property filtering

**Dependencies**: Phase 2.2, Phase 3.1

---

### 3.3 Lease Management - Web ✅ **COMPLETED**

**Objective**: Complete lease lifecycle management

**Tasks**:
- [x] Create lease listing views (web)
- [x] Implement lease creation forms
- [x] Add lease detail views with status tracking
- [x] Implement lease renewal workflow
- [x] Add lease termination functionality
- [~] Create lease document management (deferred to Phase 7)

**Deliverables**: ✅
- `packages/web/src/app/leases/page.tsx` - Lease listing with status filtering
- `packages/web/src/app/leases/[id]/page.tsx` - Lease detail view with renewal and termination
- `packages/web/src/app/leases/new/page.tsx` - Lease creation with property/unit/tenant selection
- `packages/web/src/components/leases/LeaseCard.tsx` - Lease card component
- `packages/web/src/components/leases/LeaseForm.tsx` - Comprehensive lease form component
- `packages/shared/api/leases.ts` - API methods (from Phase 1)

**Mobile Deliverables**: ⏳ Deferred
- `packages/mobile/src/screens/leases/MyLeasesScreen.tsx`
- `packages/mobile/src/screens/leases/LeaseManagementScreen.tsx`
- `packages/mobile/src/screens/leases/LeaseDetailScreen.tsx`

**Dependencies**: Phase 3.1

---

## Phase 4: Maintenance Request System (Week 5-7)

### 4.1 Maintenance Core Features - Web

**Objective**: Full maintenance workflow on web

**Tasks**:
- [ ] Create maintenance dashboard for all roles
- [ ] Implement tenant request submission form
- [ ] Create landlord approval/rejection interface
- [ ] Build workman task management screen
- [ ] Implement work order assignment UI
- [ ] Add status tracking visualization
- [ ] Create maintenance history view

**Deliverables**:
- `packages/web/src/app/maintenance/page.tsx` (dashboard)
- `packages/web/src/app/maintenance/requests/page.tsx`
- `packages/web/src/app/maintenance/requests/new/page.tsx`
- `packages/web/src/app/maintenance/requests/[id]/page.tsx`
- `packages/web/src/app/maintenance/work-orders/page.tsx`
- `packages/web/src/components/maintenance/RequestCard.tsx`
- `packages/web/src/components/maintenance/RequestForm.tsx`
- `packages/web/src/components/maintenance/WorkOrderCard.tsx`
- `packages/web/src/components/maintenance/StatusTimeline.tsx`

**Dependencies**: Phase 3.3

---

### 4.2 Maintenance Core Features - Mobile

**Objective**: Full maintenance workflow on mobile

**Tasks**:
- [ ] Migrate `MaintenanceDashboardScreen.tsx`
- [ ] Migrate `MaintenanceRequestsScreen.tsx` (tenant)
- [ ] Migrate `LandlordMaintenanceScreen.tsx`
- [ ] Migrate `WorkmanMaintenanceScreen.tsx`
- [ ] Implement request creation flow
- [ ] Add work order management
- [ ] Create status update functionality

**Deliverables**:
- `packages/mobile/src/screens/maintenance/MaintenanceDashboardScreen.tsx`
- `packages/mobile/src/screens/maintenance/MaintenanceRequestsScreen.tsx`
- `packages/mobile/src/screens/maintenance/LandlordMaintenanceScreen.tsx`
- `packages/mobile/src/screens/maintenance/WorkmanMaintenanceScreen.tsx`
- `packages/mobile/src/screens/maintenance/CreateRequestScreen.tsx`
- `packages/mobile/src/components/maintenance/RequestCard.tsx`

**Dependencies**: Phase 3.3

---

### 4.3 Advanced Maintenance Features

**Objective**: Priority, ratings, and workflow enhancements

**Tasks**:
- [ ] Implement request priority system
- [ ] Add request type categorization
- [ ] Create rating/feedback system
- [ ] Implement cost tracking
- [ ] Add time tracking for workmen
- [ ] Create emergency request workflow
- [ ] Implement notifications

**Deliverables**:
- Priority selection components (web & mobile)
- Rating system UI (web & mobile)
- Cost estimation forms
- Time tracking interface
- Emergency request handling
- `packages/shared/api/maintenance.ts` (enhanced)

**Dependencies**: Phase 4.1, 4.2

---

## Phase 5: Payments & Financial Management (Week 7-8)

### 5.1 Payment Tracking - Web

**Objective**: Payment management for landlords and tenants

**Tasks**:
- [ ] Create payment dashboard
- [ ] Implement payment history view
- [ ] Add payment recording functionality
- [ ] Create payment due alerts
- [ ] Generate payment receipts
- [ ] Implement payment filtering and search

**Deliverables**:
- `packages/web/src/app/payments/page.tsx`
- `packages/web/src/app/payments/[id]/page.tsx`
- `packages/web/src/app/payments/record/page.tsx`
- `packages/web/src/components/payments/PaymentCard.tsx`
- `packages/web/src/components/payments/PaymentForm.tsx`

**Dependencies**: Phase 3.3

---

### 5.2 Payment Tracking - Mobile

**Objective**: Mobile payment management

**Tasks**:
- [ ] Migrate `RentPaymentsScreen.tsx`
- [ ] Create payment recording screen
- [ ] Implement payment history
- [ ] Add payment reminders
- [ ] Create receipt viewing

**Deliverables**:
- `packages/mobile/src/screens/payments/RentPaymentsScreen.tsx`
- `packages/mobile/src/screens/payments/PaymentDetailScreen.tsx`
- `packages/mobile/src/screens/payments/RecordPaymentScreen.tsx`
- `packages/mobile/src/components/payments/PaymentCard.tsx`

**Dependencies**: Phase 3.3

---

## Phase 6: Communication & Messaging (Week 8-9)

### 6.1 Chat System - Web

**Objective**: Real-time messaging on web

**Tasks**:
- [ ] Create conversations list view
- [ ] Implement chat interface
- [ ] Add message sending/receiving
- [ ] Implement real-time updates (polling or WebSocket)
- [ ] Create conversation management
- [ ] Add message notifications

**Deliverables**:
- `packages/web/src/app/messages/page.tsx`
- `packages/web/src/app/messages/[id]/page.tsx`
- `packages/web/src/components/messages/ConversationList.tsx`
- `packages/web/src/components/messages/ChatWindow.tsx`
- `packages/web/src/components/messages/MessageBubble.tsx`

**Dependencies**: Phase 2.1

---

### 6.2 Chat System - Mobile

**Objective**: Mobile messaging experience

**Tasks**:
- [ ] Migrate `ConversationsScreen.tsx`
- [ ] Migrate `ChatScreen.tsx`
- [ ] Implement message input with keyboard handling
- [ ] Add push notifications for new messages
- [ ] Create message read receipts

**Deliverables**:
- `packages/mobile/src/screens/messages/ConversationsScreen.tsx`
- `packages/mobile/src/screens/messages/ChatScreen.tsx`
- `packages/mobile/src/components/messages/MessageBubble.tsx`
- `packages/mobile/src/components/messages/MessageInput.tsx`

**Dependencies**: Phase 2.2

---

## Phase 7: Navigation & UX Enhancements (Week 9-10)

### 7.1 Navigation System - Web

**Objective**: Comprehensive web navigation

**Tasks**:
- [ ] Create responsive sidebar navigation
- [ ] Implement top navbar with user menu
- [ ] Add role-based menu items
- [ ] Create breadcrumb navigation
- [ ] Implement mobile hamburger menu
- [ ] Add search functionality

**Deliverables**:
- `packages/web/src/components/layout/Sidebar.tsx`
- `packages/web/src/components/layout/Navbar.tsx`
- `packages/web/src/components/layout/Breadcrumbs.tsx`
- `packages/web/src/components/layout/MobileMenu.tsx`
- `packages/web/src/app/layout.tsx` (enhanced)

**Dependencies**: All previous phases

---

### 7.2 Navigation System - Mobile

**Objective**: Enhanced mobile navigation

**Tasks**:
- [ ] Migrate and enhance `SideMenu.tsx`
- [ ] Implement role-based menu sections
- [ ] Create bottom tab navigation
- [ ] Add quick action shortcuts
- [ ] Implement deep linking
- [ ] Create onboarding flow

**Deliverables**:
- `packages/mobile/src/components/navigation/SideMenu.tsx`
- `packages/mobile/src/navigation/AppNavigator.tsx` (enhanced)
- `packages/mobile/src/navigation/BottomTabNavigator.tsx`
- `packages/mobile/src/screens/OnboardingScreen.tsx`

**Dependencies**: All previous phases

---

### 7.3 Settings & Help

**Objective**: Settings and support screens

**Tasks**:
- [ ] Create settings page (web & mobile)
- [ ] Implement help & support screens
- [ ] Add FAQ section
- [ ] Create user preferences management
- [ ] Add notification settings

**Deliverables**:
- `packages/web/src/app/settings/page.tsx`
- `packages/web/src/app/help/page.tsx`
- `packages/mobile/src/screens/SettingsScreen.tsx`
- `packages/mobile/src/screens/HelpSupportScreen.tsx`

**Dependencies**: Phase 2

---

## Phase 8: Organization & Admin Features (Week 10-11)

### 8.1 Organization Management

**Objective**: Multi-tenant organization features

**Tasks**:
- [ ] Create organization dashboard
- [ ] Implement organization profile management
- [ ] Add member management
- [ ] Create subscription plan display
- [ ] Implement organization settings

**Deliverables**:
- `packages/web/src/app/organization/page.tsx`
- `packages/web/src/app/organization/members/page.tsx`
- `packages/web/src/app/organization/settings/page.tsx`
- `packages/mobile/src/screens/OrganizationManagementScreen.tsx`

**Dependencies**: Phase 2

---

### 8.2 Admin Features

**Objective**: Admin-only functionality

**Tasks**:
- [ ] Create admin dashboard
- [ ] Implement user management
- [ ] Add system settings
- [ ] Create analytics/reporting
- [ ] Implement audit logging

**Deliverables**:
- `packages/web/src/app/admin/page.tsx`
- `packages/web/src/app/admin/users/page.tsx`
- `packages/web/src/app/admin/settings/page.tsx`
- Admin role protection middleware

**Dependencies**: Phase 2.1

---

## Phase 9: Testing & Quality Assurance (Week 11-12)

### 9.1 Component Testing

**Tasks**:
- [ ] Write unit tests for shared utilities
- [ ] Test API client methods
- [ ] Test authentication flows
- [ ] Test form validations
- [ ] Test routing and navigation

**Deliverables**:
- Test files for all shared packages
- Integration test suite
- E2E test coverage

**Dependencies**: All previous phases

---

### 9.2 Cross-Platform Testing

**Tasks**:
- [ ] Test web app on all browsers
- [ ] Test mobile app on iOS
- [ ] Test mobile app on Android
- [ ] Verify responsive design
- [ ] Test role-based access control
- [ ] Performance testing

**Dependencies**: All previous phases

---

## Phase 10: Documentation & Deployment (Week 12-13)

### 10.1 Documentation

**Tasks**:
- [ ] Update README files for all packages
- [ ] Create API documentation
- [ ] Write user guides
- [ ] Document deployment procedures
- [ ] Create development setup guides

**Deliverables**:
- Updated package READMEs
- API documentation
- User manual
- Developer guide

---

### 10.2 Deployment Preparation

**Tasks**:
- [ ] Configure production environment variables
- [ ] Set up CI/CD pipelines
- [ ] Configure analytics
- [ ] Set up error monitoring (Sentry)
- [ ] Configure performance monitoring
- [ ] Create backup procedures

**Deliverables**:
- Production deployment configuration
- Monitoring dashboards
- Backup/restore procedures

---

## Success Criteria

### Phase Completion Checklist
Each phase is complete when:
- [ ] All tasks are implemented
- [ ] Code is reviewed and merged
- [ ] Tests are written and passing
- [ ] Documentation is updated
- [ ] Feature is tested on both platforms (where applicable)

### Overall Migration Success
- [ ] All 20+ screens migrated
- [ ] Feature parity with `homely-quad-mobile`
- [ ] Shared code in `packages/shared` properly utilized
- [ ] Both web and mobile apps fully functional
- [ ] All tests passing (>80% coverage)
- [ ] Documentation complete
- [ ] Production deployment successful

---

## Risk Mitigation

### Technical Risks

**Risk**: Breaking changes in dependencies
- **Mitigation**: Lock dependency versions, thorough testing

**Risk**: Data inconsistency during backend integration
- **Mitigation**: Use existing Drizzle schema, validate all API calls

**Risk**: Platform-specific bugs
- **Mitigation**: Extensive cross-platform testing, platform detection utilities

### Timeline Risks

**Risk**: Underestimated complexity
- **Mitigation**: Buffer time in schedule, prioritize core features

**Risk**: Scope creep
- **Mitigation**: Strict phase definitions, regular reviews

---

## Dependencies Map

```
Phase 1 (Foundation)
  └─> Phase 2 (Auth)
        ├─> Phase 3 (Properties & Leases)
        │     ├─> Phase 4 (Maintenance)
        │     │     └─> Phase 7 (Navigation)
        │     └─> Phase 5 (Payments)
        ├─> Phase 6 (Messaging)
        └─> Phase 8 (Organization)

Phase 7 + Phase 8 + Phase 9
  └─> Phase 10 (Documentation & Deployment)
```

---

## Resource Requirements

### Development Team
- **Web Developer**: Next.js, React, TypeScript
- **Mobile Developer**: React Native, Expo
- **Backend Developer**: Database integration, API endpoints
- **QA Engineer**: Testing across platforms

### Tools & Services
- GitHub for version control
- Replit for development and deployment
- PostgreSQL database (already configured)
- Testing frameworks (Jest, React Testing Library)

---

## Next Steps

1. **Review & Approval**: Stakeholder review of this migration plan
2. **Resource Allocation**: Assign developers to phases
3. **Kickoff**: Begin Phase 1 implementation
4. **Weekly Standups**: Track progress and blockers
5. **Sprint Reviews**: Demo completed features after each phase

---

## Appendix: Screen Migration Matrix

| Screen Name | Source Location | Web Target | Mobile Target | Phase |
|-------------|----------------|------------|---------------|-------|
| LoginScreen | homely-quad-mobile | app/login/page.tsx | screens/auth/LoginScreen.tsx | 2.1, 2.2 |
| RegisterScreen | homely-quad-mobile | app/register/page.tsx | screens/auth/RegisterScreen.tsx | 2.1, 2.2 |
| HomeScreen | homely-quad-mobile | app/page.tsx | screens/HomeScreen.tsx | 7.1, 7.2 |
| ProfileScreen | homely-quad-mobile | app/profile/page.tsx | screens/ProfileScreen.tsx | 2.3 |
| PremisesManagementScreen | homely-quad-mobile | app/properties/page.tsx | screens/properties/PremisesManagementScreen.tsx | 3.1, 3.2 |
| RentalUnitsScreen | homely-quad-mobile | app/properties/[id]/units/page.tsx | screens/properties/RentalUnitsScreen.tsx | 3.1, 3.2 |
| RentalListingsScreen | homely-quad-mobile | app/listings/page.tsx | screens/properties/RentalListingsScreen.tsx | 3.2 |
| SearchRentalsScreen | homely-quad-mobile | app/search/page.tsx | screens/properties/SearchScreen.tsx | 3.2 |
| SavedRentalsScreen | homely-quad-mobile | app/favorites/page.tsx | screens/FavoritesScreen.tsx | 3.2 |
| LeaseManagementScreen | homely-quad-mobile | app/leases/page.tsx | screens/leases/LeaseManagementScreen.tsx | 3.3 |
| MyLeasesScreen | homely-quad-mobile | app/my-leases/page.tsx | screens/leases/MyLeasesScreen.tsx | 3.3 |
| MaintenanceDashboardScreen | homely-quad-mobile | app/maintenance/page.tsx | screens/maintenance/MaintenanceDashboardScreen.tsx | 4.1, 4.2 |
| MaintenanceRequestsScreen | homely-quad-mobile | app/maintenance/requests/page.tsx | screens/maintenance/MaintenanceRequestsScreen.tsx | 4.1, 4.2 |
| LandlordMaintenanceScreen | homely-quad-mobile | app/maintenance/landlord/page.tsx | screens/maintenance/LandlordMaintenanceScreen.tsx | 4.1, 4.2 |
| WorkmanMaintenanceScreen | homely-quad-mobile | app/maintenance/workman/page.tsx | screens/maintenance/WorkmanMaintenanceScreen.tsx | 4.1, 4.2 |
| RentPaymentsScreen | homely-quad-mobile | app/payments/page.tsx | screens/payments/RentPaymentsScreen.tsx | 5.1, 5.2 |
| ConversationsScreen | homely-quad-mobile | app/messages/page.tsx | screens/messages/ConversationsScreen.tsx | 6.1, 6.2 |
| ChatScreen | homely-quad-mobile | app/messages/[id]/page.tsx | screens/messages/ChatScreen.tsx | 6.1, 6.2 |
| OrganizationManagementScreen | homely-quad-mobile | app/organization/page.tsx | screens/OrganizationManagementScreen.tsx | 8.1 |
| SettingsScreen | homely-quad-mobile | app/settings/page.tsx | screens/SettingsScreen.tsx | 7.3 |
| HelpSupportScreen | homely-quad-mobile | app/help/page.tsx | screens/HelpSupportScreen.tsx | 7.3 |

---

## Appendix: Component Migration Matrix

| Component | Source | Target (Shared) | Notes |
|-----------|--------|-----------------|-------|
| NetworkStatus | homely-quad-mobile | packages/shared/components/ | Platform-agnostic |
| ResponsiveLayout | homely-quad-mobile | packages/shared/components/ | Platform-specific wrappers |
| SideMenu | homely-quad-mobile | packages/mobile/src/components/ | Mobile-only |
| WebNavigation | homely-quad-mobile | packages/web/src/components/layout/ | Web-only |
| WebSidebar | homely-quad-mobile | packages/web/src/components/layout/ | Web-only |

---

**Document Status**: Ready for Review  
**Next Review Date**: After Phase 1 completion  
**Maintained By**: Development Team
