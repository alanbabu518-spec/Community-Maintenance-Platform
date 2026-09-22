# Community Maintenance Platform

## Problem

Maintenance issues is residential communities are often reported through whatsapp ,phone calls, or manual registers. This makes it difficult to prioritize, assign, track,and resolve maintenance problem efficiently.

## Solution

A centralized platform where residents can report issues, mangeres can assign technicians, technicians can  resolve issues, and residents can track progress.

## Current Progress

## Day 1 - Initial Full-Stack Setup
- React frontend
- Node.js backend
- Express API
- frontend/backend connection

## Day 2 - Database Foundation

### Completed
- installed PostgreSQL
- Created `Community Maintainance` database 
- Configured prisma ORM
- Created database schema and relationships 
- added enums for roles, status, and priority
- Created and applied migration
- Connected Node.js -> Prisma -> PostgreSQL
- Verified database using Prisma Studio

### Learned 
- PostgreSQL and Prisma 
- Primary/Foreign Keys
- RelationShips
- Enums
- Migrations
- Database schema design

## Day 3 - Backend Architeture & User API

### Completed
- Created feature based user module
- Implmented route -> controller -> service -> repository architeture
- Connected user module with prisma 
- Created `GET/api/users`
- Created `POST/api/users`
- Tested api using postman
- Verified user data in PostgreSQl

### Learned
- Backend layered architecture
- REST API structure
- Controllers, Services & Repositories
- Express routing
- Prisma database operations
- HTTP request/response flow
- API testing with Postman

## Day 4 — Authentication Foundation

### Completed
- Installed and configured bcrypt
- Added Nodemon for development
- Created Auth module
- Added Zod registration validation
- Implemented password hashing
- Created registration API
- Connected Auth → User Repository → Prisma → PostgreSQL
- Tested registration with Postman
- Verified hashed password in Prisma Studio

### Learned
- Authentication basics
- Password hashing with bcrypt
- Request validation with Zod
- Auth Controller & Service
- Secure password storage
- REST API registration flow

## Day 5 — Login & JWT Authentication

### Completed
- Implemented login API
- Added bcrypt password verification
- Added JWT token generation
- Added JWT expiration
- Created authentication middleware
- Protected `GET /api/users`
- Tested protected API with and without JWT
- Prevented `passwordHash` from being returned in user responses

### Learned
- Login authentication flow
- JWT authentication
- Bearer tokens
- Authentication middleware
- Protected routes
- JWT verification
- Secure API responses

## Day 6 — Role-Based Authorization

### Completed
- Created role-based authorization middleware
- Added role checking for protected routes
- Added ADMIN and MANAGER access control
- Protected `GET /api/users` by role
- Tested unauthorized access with RESIDENT
- Tested authorized access with ADMIN
- Implemented 401 and 403 responses

### Learned
- Authentication vs Authorization
- Role-Based Access Control (RBAC)
- Authorization middleware
- JWT user data
- HTTP 401 vs 403
- Protected role-based routes

## Day 7 — Authentication Cleanup & Security

### Completed
- Created reusable authenticated user type
- Improved JWT type safety
- Added duplicate email handling
- Added proper 409 Conflict response
- Tested invalid JWT handling
- Verified authentication and authorization flows

### Learned
- Type-safe JWT authentication
- Express type extension
- Error handling
- HTTP 401 vs 403 vs 409
- Authentication security practices

## Day 8 — Maintenance Request API

### Completed
- Created Maintenance Request module
- Added Zod request validation
- Implemented maintenance request creation API
- Connected authenticated resident to maintenance requests
- Added resident-only authorization for creating requests
- Added GET maintenance requests API
- Implemented role-based request visibility
- Residents can view only their own requests
- Admins and Managers can view all requests
- Tested APIs using Postman
- Verified maintenance data in PostgreSQL

### Learned
- Feature-based backend architecture
- Route → Controller → Service → Repository flow
- Request validation with Zod
- Authentication vs authorization
- Role-based data access
- Using JWT user identity for data ownership
- Prisma filtering with `where`
- PostgreSQL foreign-key relationships
- HTTP 401, 403, and 500 responses
- Testing protected APIs with Postman

## Day 9 — Maintenance Request Details & Access Control

### Completed
- Implemented `GET /api/maintenance/:id`
- Added Prisma `findUnique()` query
- Added request ID route parameters
- Added invalid request ID validation
- Added `404 Not Found` handling
- Added related resident data
- Added Unit → Building → Community relationships
- Added related technician data
- Prevented `passwordHash` from being exposed
- Implemented resource-level access control
- Residents can view only their own requests
- Admins and Managers can view any request
- Tested API access using Postman

### Learned
- Express route parameters
- Prisma `findUnique()`
- Prisma `include`
- Prisma `select`
- Nested database relationships
- Resource-level authorization
- Data ownership
- HTTP 404 handling
- Secure API responses
- Protecting sensitive database fields

## Day 10 — Maintenance Request Updates & Status Workflow

### Completed
- Implemented `PATCH /api/maintenance/:id`
- Added partial request updates using PATCH
- Added Zod validation for update requests
- Added TypeScript update types
- Implemented Prisma update operation
- Added ADMIN and MANAGER authorization
- Implemented maintenance status transition rules
- Tested valid status transitions
- Tested invalid status transitions
- Verified status updates in PostgreSQL
- Tested protected update API using Postman

### Learned
- PATCH requests and partial updates
- Request validation with Zod
- Prisma update operations
- Business logic in the Service layer
- Status transition rules
- Role-based authorization
- HTTP 400, 403, and 200 responses
- Separating business logic from database logic
- Designing workflow/state machines
- Testing API business rules with Postman

## Day 11 — Technician Assignment Workflow

### Completed
- Created technician assignment validation with Zod
- Added technician lookup through User Repository
- Verified that assigned users have the TECHNICIAN role
- Implemented technician assignment service logic
- Added technician assignment API
- Added ADMIN and MANAGER authorization
- Added status workflow validation for technician assignment
- Automatically changed status from ACKNOWLEDGED to ASSIGNED
- Tested successful technician assignment
- Tested resident access restriction
- Tested invalid status transitions
- Verified technician assignment in PostgreSQL

### Learned
- Service-layer business rules
- Technician assignment workflow
- Role-based authorization
- Resource state validation
- Zod request validation
- Repository and service responsibilities
- Workflow/state-machine enforcement
- HTTP 403 authorization responses
- Updating related foreign-key data

## Day 12 — Role-Based Permissions & Workflow Refinement

### Completed
- Added technician-specific maintenance request filtering
- Implemented resource-level authorization for maintenance requests
- Verified residents can view only their own requests
- Verified technicians can view only their assigned requests
- Verified technicians cannot access unassigned requests
- Verified admins can view all maintenance requests
- Verified managers can view all maintenance requests
- Restricted technician assignment to ADMIN and MANAGER roles
- Enforced `ACKNOWLEDGED → ASSIGNED` assignment workflow
- Verified complete maintenance status workflow
- Tested role-based access control using Postman
- Ran TypeScript validation with `npx tsc --noEmit`

### Maintenance Workflow

```text
OPEN
  ↓
ACKNOWLEDGED
  ↓
ASSIGNED
  ↓
IN_PROGRESS
  ↓
RESOLVED
  ↓
CLOSED
```

## Day 13 — Filtering & Pagination

### Completed
- Implemented pagination for maintenance requests
- Added `page` and `limit` query parameters
- Added pagination limits to prevent excessive data requests
- Added status filtering
- Added priority filtering
- Added category filtering
- Added combined filtering
- Added filtered result counts
- Added total pages to API responses
- Applied pagination and filtering to resident requests
- Applied pagination and filtering to technician requests
- Applied pagination and filtering to admin and manager requests
- Tested pagination using Postman
- Tested status, priority, and category filters
- Tested combined filters with pagination
- Verified TypeScript compilation with `npx tsc --noEmit`

### Example API Requests

#### Pagination

```text
GET /api/maintenance?page=1&limit=5
```

## Day 14 — Centralized Error Handling

### Completed
- Created custom `AppError` class
- Implemented centralized Express error middleware
- Registered error middleware after all routes
- Updated controllers to forward errors using `next(error)`
- Converted business errors to `AppError`
- Added proper HTTP status codes for business errors
- Added `404 Not Found` handling
- Added `403 Forbidden` handling
- Added `400 Bad Request` handling
- Added centralized Zod validation error handling
- Added safe `500 Internal Server Error` handling
- Tested centralized error handling using Postman
- Tested 404 request errors
- Tested 403 authorization errors
- Tested Zod validation errors
- Verified TypeScript compilation with `npx tsc --noEmit`

### Error Handling Flow

```text
Request
   ↓
Route
   ↓
Controller
   ↓
Service
   ↓
Error
   ↓
next(error)
   ↓
Central Error Middleware
   ↓
HTTP Response
```
## Day 15 — API Query Validation

### Completed
- Created Zod schema for maintenance query parameters
- Added runtime validation for `page`
- Added runtime validation for `limit`
- Added runtime validation for `status`
- Added runtime validation for `priority`
- Added runtime validation for `category`
- Added automatic type coercion for pagination values
- Added default values for `page` and `limit`
- Added category trimming and empty-value validation
- Removed manual TypeScript query parameter type assertions
- Connected query validation with centralized error handling
- Tested valid query parameters using Postman
- Tested invalid status values
- Tested invalid pagination values
- Tested invalid query parameter types
- Tested default pagination values
- Tested category trimming
- Tested empty category validation
- Verified TypeScript compilation with `npx tsc --noEmit`

### Query Validation Flow

```text
HTTP Query Parameters
        ↓
Zod Schema
        ↓
Validation + Type Conversion
        ↓
Controller
        ↓
Service
        ↓
Repository
        ↓
PostgreSQL
```

## Day 16 — API Response Design & Architecture Refinement

### Completed
- Created User API response DTO
- Created User response mapper
- Prevented `passwordHash` from being exposed through User APIs
- Updated User Service to return API response DTOs
- Updated User Controller to use centralized error handling
- Standardized User API response structure
- Created Maintenance Request response DTO
- Created Maintenance Request response mapper
- Created Maintenance Request detail response DTO
- Created Maintenance Request detail mapper
- Updated maintenance list API to return DTOs
- Updated maintenance detail API to return detailed DTOs
- Updated maintenance creation API to return DTOs
- Updated maintenance update API to return DTOs
- Updated technician assignment API to return DTOs
- Preserved existing authentication and authorization rules
- Tested User API with ADMIN role
- Tested User API authorization with RESIDENT role
- Tested user registration response
- Tested user login response
- Tested maintenance list response
- Tested maintenance detail response
- Tested maintenance creation response
- Tested maintenance update response
- Tested technician assignment response
- Verified sensitive fields are not exposed
- Removed `any` from maintenance detail mapper
- Verified TypeScript compilation with `npx tsc --noEmit`

### API Architecture

```text
HTTP Request
     ↓
Route
     ↓
Middleware
     ↓
Controller
     ↓
Service
     ↓
Repository
     ↓
Prisma
     ↓
PostgreSQL
```

## Day 17 — Backend Testing

### Completed
- Installed Vitest
- Configured Vitest for the backend
- Created unit tests for `AppError`
- Created maintenance service unit tests
- Tested valid maintenance status transitions
- Tested invalid maintenance status transitions
- Tested the complete maintenance workflow
- Tested technician assignment
- Tested invalid technician assignment
- Tested missing technician handling
- Tested missing maintenance request handling
- Created authentication service unit tests
- Tested successful login
- Tested invalid password
- Tested non-existent user login
- Tested password comparison failure
- Tested registration password hashing
- Verified `passwordHash` is not exposed
- Mocked repositories and external dependencies
- Added CI-friendly `test:run` script
- Verified complete test suite

### Test Structure

```text
src/tests/
├── AppError.test.ts
├── auth.service.test.ts
└── maintenance.service.test.ts
```

## Day 18 — API Integration Testing

### Completed
- Installed Supertest
- Separated Express app from HTTP server
- Created API integration tests using Supertest
- Tested health endpoint
- Tested login API
- Tested registration API
- Tested registration validation
- Tested duplicate email handling
- Tested missing JWT authentication
- Tested invalid JWT authentication
- Tested valid JWT authentication
- Tested role-based authorization
- Tested resident access restrictions
- Tested admin access
- Tested resident resource-level authorization
- Tested technician resource-level authorization
- Tested manager resource access
- Verified protected API routes
- Verified TypeScript compilation
- Verified complete API test suite

### API Integration Test Structure

```text
HTTP Request
     ↓
Express Route
     ↓
Middleware
     ↓
Controller
     ↓
Service
     ↓
HTTP Response
```

## Day 19 — Maintenance API Integration & CRUD Testing

### Completed
- Added integration tests for maintenance request creation
- Tested maintenance request listing
- Tested maintenance request details
- Tested maintenance request updates
- Tested technician assignment
- Tested authentication requirements
- Tested role-based authorization
- Tested resource-level authorization
- Tested request validation
- Tested pagination and filtering
- Tested maintenance status transitions
- Tested technician assignment business rules
- Tested 400, 401, 403, and 404 error responses
- Verified complete API test suite
- Verified TypeScript compilation

### API Test Coverage

| Endpoint | Tests |
|---|---:|
| POST /api/maintenance | 4 |
| GET /api/maintenance | 5 |
| GET /api/maintenance/:id | 8 |
| PATCH /api/maintenance/:id | 8 |
| PATCH /api/maintenance/:id/assign | 10 |

### Test Results

- Test Files: 12 passed
- Tests: 65 passed
- TypeScript: Passed

### Learned
- API integration testing
- Supertest
- CRUD API testing
- Authentication testing
- Role-based authorization testing
- Resource-level authorization
- Request validation testing
- Workflow/state-machine testing
- Mocking services with Vitest
- HTTP error handling
- Testing business rules through APIs

## Day 20 — API Documentation with Swagger/OpenAPI

### Completed
- Installed Swagger UI
- Installed swagger-jsdoc
- Configured OpenAPI 3.0
- Added Swagger UI to Express
- Created interactive API documentation
- Added JWT Bearer authentication to Swagger
- Documented Authentication APIs
- Documented Users APIs
- Documented Maintenance APIs
- Documented request bodies
- Documented path parameters
- Documented query parameters
- Documented API response status codes
- Added pagination and filtering documentation
- Added maintenance workflow documentation
- Verified Swagger UI
- Verified complete API test suite
- Verified TypeScript compilation

### Swagger Documentation

Swagger UI:

http://localhost:5000/api-docs

### Documented APIs

#### Authentication
- POST /api/auth/register
- POST /api/auth/login

#### Users
- GET /api/users
- POST /api/users

#### Maintenance
- POST /api/maintenance
- GET /api/maintenance
- GET /api/maintenance/{id}
- PATCH /api/maintenance/{id}
- PATCH /api/maintenance/{id}/assign

### Authentication

Swagger supports JWT Bearer authentication through the Authorize button.

Request format:

Authorization: Bearer <JWT>

### OpenAPI

- OpenAPI version: 3.0
- Interactive documentation: Swagger UI
- Specification generation: swagger-jsdoc

### Test Results

- Test Files: 12 passed
- Tests: 65 passed
- TypeScript compilation: Passed

### Learned
- OpenAPI specification
- Swagger UI
- swagger-jsdoc
- API documentation
- API request/response documentation
- Query parameters
- Path parameters
- Request body schemas
- JWT Bearer authentication documentation
- Interactive API testing

## Day 21 — Frontend API Foundation, Redis OTP & Cookie Authentication

### Completed

- Created centralized frontend API service
- Added TypeScript API types for frontend-backend communication
- Implemented frontend health check API
- Implemented frontend maintenance requests API
- Connected React frontend with backend API
- Added Redis using Docker for OTP storage
- Created Redis client configuration
- Implemented 6-digit OTP generation
- Implemented OTP storage in Redis
- Added 5-minute OTP expiration
- Implemented OTP retrieval and deletion
- Added OTP verification API
- Added email verification status using `emailVerified`
- Implemented REGISTER → OTP verification flow
- Implemented cookie-based JWT authentication
- Added HTTP-only `access_token` cookie
- Configured CORS credentials for cookie authentication
- Added `credentials: "include"` to frontend authenticated requests
- Tested frontend login successfully
- Tested protected maintenance API from React
- Verified authentication using HTTP-only cookie

### Learned

- Frontend API service architecture
- Type-safe API communication with TypeScript
- Redis and key-value storage
- Redis TTL and temporary data
- OTP generation and verification
- OTP expiration
- Email verification workflow
- JWT authentication with cookies
- HTTP-only cookies
- Cookie-based authentication
- CORS credentials
- `credentials: "include"`
- Frontend → Backend authentication flow
- Protected API requests
- Separating API logic from React components

## Day 22 — Authentication UI & Session Management

### Completed

- Added React Router for frontend routing
- Created Register page
- Created OTP verification page
- Created Login page
- Created Home page
- Implemented controlled React form inputs
- Connected Register page with backend API
- Connected OTP verification with backend API
- Connected Login page with backend API
- Implemented authentication state using React Context
- Created `AuthProvider` and `useAuth`
- Implemented protected routes
- Added HTTP-only cookie based authentication
- Added `/auth/me` endpoint to restore authenticated user
- Implemented authentication persistence after browser refresh
- Added authentication loading state
- Implemented Logout API
- Added Logout functionality to Home page
- Implemented complete Register → OTP → Login → Home → Logout flow
- Tested protected route behavior
- Tested authentication persistence after refresh
- Tested logout and protected route redirection

### Learned

- React Router
- React controlled forms
- React Context API
- Authentication state management
- Protected routes
- HTTP-only cookies
- Cookie-based JWT authentication
- Authentication persistence
- `/auth/me` session restoration
- Loading states during authentication checks
- Logout flow
- Frontend → Backend authentication flow
- Route protection
- Separation of authentication logic from UI

## Day 23 — Frontend Architecture & Dashboard Foundation

### Completed

- Created feature-based frontend folder structure
- Added reusable layout components
- Created `DashboardLayout`
- Created reusable `Sidebar` component
- Added protected dashboard routes
- Created Dashboard page
- Connected Dashboard with backend maintenance API
- Added maintenance request statistics
- Added reusable `StatCard` component
- Created reusable `MaintenanceCard` component
- Displayed recent maintenance requests on Dashboard
- Created Maintenance page
- Connected Maintenance page with backend API
- Added role-based dashboard messaging
- Added responsive Register page using Tailwind CSS
- Added responsive Login page using Tailwind CSS
- Added Google, Facebook, GitHub, and LinkedIn social login UI
- Connected Login page with authentication flow
- Updated successful login to redirect to Dashboard
- Tested Dashboard navigation
- Tested Maintenance navigation
- Tested authentication-protected routes

### Learned

- Feature-based frontend architecture
- Component-based architecture
- Reusable React components
- React Router nested routes
- Dashboard layouts
- Sidebar navigation
- `Outlet` in React Router
- API data fetching in React
- Derived statistics from API data
- Role-based UI rendering
- Responsive design with Tailwind CSS
- Mobile-first responsive layouts
- Controlled form components
- Reusing authentication logic across pages
- Separation of pages, features, components, and services

## Day 24 — Reusable UI Components & Frontend UX

### Completed

- Created reusable `Button` component
- Created reusable `Input` component
- Created reusable `Badge` component
- Created reusable `Loading` component
- Implemented skeleton loading UI
- Created reusable `Spinner` component
- Added loading spinner to Login
- Added loading spinner to Register
- Created reusable `PageTransition` component
- Added page transition animation to Dashboard
- Added page transition animation to Login
- Added page transition animation to Register
- Added reduced-motion accessibility support
- Created reusable `ErrorMessage` component
- Added retry functionality for API errors
- Added skeleton loading to Maintenance page
- Added error handling to Maintenance page
- Refactored `MaintenanceCard` to use reusable badges
- Added priority-based badge styling
- Added status-based badge styling
- Improved reusable frontend UI architecture
- Tested loading, error, retry, spinner, and page transition states

### Learned

- Reusable React components
- Component abstraction
- Component composition
- TypeScript component props
- Native HTML attribute types
- Skeleton loading
- Loading spinners
- API loading states
- Error states
- Retry functionality
- Page transition animations
- Tailwind CSS animations
- `@keyframes`
- `prefers-reduced-motion`
- Separation of UI and business logic
- Consistent UI design
- Frontend UX patterns

## Day 25 — Reusable UI Components & Frontend Architecture

### Completed

- Created reusable `Select` component
- Refactored Register page to use `Select`
- Created reusable `FormField` component
- Refactored Register page to use `FormField`
- Refactored Login page to use `FormField`
- Refactored OTP verification page
- Added reusable `SocialButtons` component
- Reused `SocialButtons` in Register and Login
- Reused `Button` component across authentication pages
- Reused `Spinner` for loading states
- Reused `PageTransition` across pages
- Preserved existing authentication flow
- Preserved responsive authentication UI
- Added OTP input navigation with keyboard controls
- Added OTP paste support
- Added OTP validation
- Added loading and error states
- Reviewed frontend component responsibilities
- Avoided unnecessary component abstraction
- Completed frontend architecture cleanup
- Validated the frontend with TypeScript

### Learned

- Reusable UI components
- Component composition
- Form abstraction
- Feature-based frontend architecture
- Component responsibility
- Separation of UI and business logic
- Component reuse
- Avoiding unnecessary abstraction
- Reusable form components
- OTP input handling
- Keyboard navigation
- Clipboard/paste handling
- Loading and error states
- Responsive component design
- Frontend architecture cleanup
- TypeScript validation

## Day 26 — Frontend API Architecture

### Completed

- Created centralized `apiClient`
- Added centralized API request handling
- Added credentials and headers automatically
- Added query parameter support
- Added centralized API error handling
- Created `ApiError` with HTTP status
- Added network error handling
- Created `auth.api.ts`
- Created `health.api.ts`
- Created `maintenance.api.ts`
- Removed the old `api.ts`
- Migrated authentication APIs to `auth.api.ts`
- Migrated health API to `health.api.ts`
- Migrated maintenance APIs to `maintenance.api.ts`
- Connected feature APIs with `apiClient`
- Updated API imports across the frontend
- Connected login with `AuthContext`
- Updated authentication state after login
- Verified protected route authentication
- Validated frontend with TypeScript

### Learned

- Frontend API architecture
- API client abstraction
- Feature-based API organization
- Centralized HTTP request handling
- API error handling
- Custom `ApiError` class
- HTTP status handling
- Network error handling
- Query parameter handling
- Separation of API logic from UI
- Authentication state management
- Protected routes
- Scalable frontend architecture

## Day 27 — Frontend Performance & Data Fetching

### Completed

- Optimized Dashboard statistics using `useMemo`
- Reduced multiple array iterations into a single statistics calculation
- Used `useCallback` for stable async functions
- Installed TanStack Query
- Added `QueryClientProvider`
- Migrated Maintenance API fetching to TanStack Query
- Added query caching
- Added `staleTime` configuration
- Added query invalidation after mutations
- Added dynamic status filtering
- Added server-side pagination
- Added pagination metadata
- Added Previous and Next pagination controls
- Prevented navigation beyond the first and last pages
- Added `placeholderData` for smoother pagination
- Added `isFetching` background loading indicator
- Added server-side search
- Added debounced search using a reusable `useDebounce` hook
- Reset pagination when changing filters
- Reset pagination when searching
- Added search across maintenance title and description
- Added case-insensitive search
- Updated backend filtering and counting for search
- Added automatic scroll-to-top when changing pages
- Tested search, filtering, pagination, caching, and loading states

### Learned

- React rendering and performance
- `useMemo`
- `useCallback`
- TanStack Query
- Server-state management
- Query keys
- Query caching
- `staleTime`
- `placeholderData`
- `isFetching` vs `isLoading`
- Query invalidation
- Server-side pagination
- Pagination metadata
- Dynamic query parameters
- Debouncing
- Custom React hooks
- Search optimization
- PostgreSQL filtering with Prisma
- Case-insensitive database search
- Synchronizing pagination with filters
- Smooth pagination UX
- Frontend performance optimization

## Day 28 — Advanced Frontend Data Architecture

### Completed

- Created feature-level maintenance query hooks
- Created centralized maintenance query keys
- Created reusable maintenance query configuration
- Added individual maintenance request query hook
- Added maintenance request detail API
- Implemented TanStack Query prefetching
- Prefetched the next maintenance page when available
- Added cache invalidation for maintenance mutations
- Created `useCreateMaintenanceRequest` mutation hook
- Separated maintenance query and mutation logic from UI components
- Improved frontend server-state architecture
- Verified frontend production build successfully

### Learned

- Feature-based data architecture
- TanStack Query custom hooks
- Query key factories
- Query configuration
- Individual resource queries
- Query prefetching
- `useQueryClient`
- Query cache invalidation
- Mutations with `useMutation`
- `onSuccess` mutation handling
- Server-state management
- Cache consistency
- Separation of API logic and UI logic
- Frontend scalability patterns
- Production-oriented React architecture

## Day 29 — Maintenance UI, Issue Reporting & File Attachments

### Completed

- Built responsive Maintenance dashboard UI
- Added responsive sidebar navigation
- Added mobile navigation drawer
- Added maintenance request cards
- Added Maintenance Request Details page
- Added Report an Issue page
- Added controlled maintenance request form
- Added dynamic maintenance categories
- Added custom category input for Other
- Added dynamic unit selection
- Added maintenance priority selection
- Added success notification after issue submission
- Added responsive photo selection UI
- Added mobile camera support
- Added multiple photo selection
- Added photo preview and removal functionality
- Limited issue attachments to 5 photos
- Added Multer file upload handling
- Added image file validation
- Added 5 MB file size limit
- Added Cloudinary image storage
- Added MaintenanceAttachment database model
- Added maintenance request → attachment relationship
- Added attachment metadata storage in PostgreSQL
- Added attachment upload service
- Added maintenance request attachment retrieval
- Added photo gallery to Maintenance Request Details
- Added Cloudinary image preview
- Added full-size image access
- Tested maintenance request creation with Postman
- Tested image upload and Cloudinary storage
- Verified attachment records in PostgreSQL
- Tested complete issue reporting flow from the React UI
- Verified responsive maintenance UI
- Verified frontend production build

### Learned

- Responsive dashboard UI design
- Tailwind CSS responsive layouts
- Mobile navigation patterns
- React controlled forms
- Dynamic form fields
- File input handling in React
- Mobile camera capture
- Multiple file selection
- File previews
- Multipart/form-data
- Multer
- Memory-based file uploads
- File validation
- File size limits
- Cloudinary
- Image storage architecture
- PostgreSQL file metadata storage
- Database relationships
- One-to-many relationships
- Cascading deletes
- Upload service architecture
- API handling for multipart requests
- Frontend → Backend → Cloudinary → PostgreSQL flow
- Separating file storage from database metadata
- Production-oriented file upload architecture
- Responsive frontend architecture

## Day 30 — Maintenance Data Architecture, Filtering & Sorting

### Completed

- Improved Maintenance Requests page UI
- Added professional responsive maintenance layout
- Added server-side search
- Added debounced search
- Added status filtering
- Added server-side pagination
- Added pagination metadata
- Added server-side sorting
- Added newest-first sorting
- Added oldest-first sorting
- Added highest-priority sorting
- Added lowest-priority sorting
- Implemented correct priority ordering
- Applied sorting across resident, technician, manager, and admin queries
- Added search support across maintenance request queries
- Added pagination reset when search changes
- Added pagination reset when filters change
- Added pagination reset when sorting changes
- Added active filter indicators
- Added clear filters functionality
- Added result count
- Added professional search and filter controls
- Added improved pagination controls
- Added responsive empty state
- Added background fetching indicator
- Preserved global API error handling
- Tested search functionality
- Tested status filtering
- Tested all sorting options
- Tested combined search, filtering, and sorting
- Tested pagination with filters and sorting
- Verified responsive Maintenance UI
- Verified frontend production build
- Verified backend production build

### Learned

- Server-side sorting
- Server-side filtering
- Server-side search
- PostgreSQL enum ordering
- Priority ordering
- Query parameter design
- Zod query validation
- Sorting with Prisma
- Pagination with sorting
- Combining search, filters, sorting, and pagination
- TanStack Query query keys
- Server-state synchronization
- Debounced search
- Pagination state management
- Responsive dashboard UI
- Production-oriented data-fetching architecture
- Frontend-to-database request flow

## Day 31 — URL State Management & Maintenance UX

### Completed

- Migrated maintenance search state to URL parameters
- Migrated maintenance status filter to URL parameters
- Migrated maintenance sorting to URL parameters
- Migrated maintenance pagination to URL parameters
- Removed duplicated React state for URL-controlled values
- Added browser Back/Forward state restoration
- Added refresh persistence for maintenance filters and pagination
- Added shareable maintenance URLs
- Added URL state synchronization
- Added invalid page handling
- Automatically corrected out-of-range page numbers
- Preserved filters when correcting invalid page numbers
- Added invalid status parameter handling
- Added invalid sorting parameter handling
- Added automatic URL normalization
- Reset pagination when changing search, status, or sorting
- Preserved valid URL parameters
- Tested combined search, filtering, sorting, and pagination
- Tested browser Back/Forward navigation
- Tested refresh and shareable URLs
- Tested invalid URL parameters
- Improved Maintenance page URL-state architecture

### Learned

- URL state management
- React Router `useSearchParams`
- Synchronizing URL state with React UI
- Query parameters
- URL-driven application state
- Shareable application state
- Browser history navigation
- Back/Forward state restoration
- URL parameter validation
- URL normalization
- Pagination state management
- Filter and pagination synchronization
- Sorting state management
- Search state management
- Handling invalid URL parameters
- Managing derived state from URL parameters
- Production-oriented frontend architecture
- State persistence across page refreshes

## Day 32 — API Architecture, CRUD & RBAC

Day 32 focused on connecting the React frontend with the Express backend and building a secure maintenance request workflow.

### Completed

- Built REST APIs for maintenance requests
- Implemented maintenance request creation
- Implemented maintenance request listing
- Implemented maintenance request details
- Implemented maintenance request updates
- Added pagination
- Added search
- Added filtering by status, priority and category
- Added sorting
- Added role-based maintenance request access
- Added resident ownership protection
- Added technician ownership protection
- Added technician assignment
- Implemented maintenance status workflow
- Added role-based dashboard statistics
- Integrated frontend APIs with React Query
- Added centralized API error handling
- Added HTTP status-aware error handling
- Added custom error pages for API failures
- Tested authentication and authorization through the application

### Maintenance Workflow

```text
OPEN
  ↓
ACKNOWLEDGED
  ↓
ASSIGNED
  ↓
IN_PROGRESS
  ↓
RESOLVED
  ↓
CLOSED
```

## Day 33 — Frontend Architecture & Performance

### Goal

Improve the frontend architecture of CommunityCare and apply practical React performance and scalability techniques.

### Topics Covered

- Frontend architecture review
- Feature-based folder structure
- React Query optimization
- Query key architecture
- Query prefetching
- Route-level code splitting
- React rendering optimization
- Error and loading architecture
- Form architecture and validation
- File preview memory management
- Production build verification

---

### 1. Frontend Architecture Review

Reviewed the frontend structure and moved feature-specific code into their respective feature modules.

Example:

```text
src/features/maintenance/
├── components/
├── hooks/
├── services/
├── types/
├── maintenance.keys.ts
└── maintenance.queries.ts
```

## Day 34 — Backend Architecture, Security & Performance

### Goals

- Review backend architecture
- Improve Controller, Service and Repository separation
- Standardize API errors and validation
- Strengthen authentication and authorization
- Implement rate limiting
- Prevent role escalation
- Improve database performance
- Update frontend/backend contracts

### Completed

#### 1. Backend Architecture

Maintained the layered architecture:

Request → Route → Middleware → Controller → Service → Repository → Prisma → PostgreSQL

Refactored duplicated maintenance repository logic.

#### 2. API & Validation

- Standardized error responses
- Strengthened Zod validation
- Added centralized error handling

#### 3. Security

- JWT authentication with HttpOnly cookies
- CORS with environment-based client URL
- RBAC and ownership checks
- Sensitive data protection
- Rate limiting for authentication and OTP
- Public registration restricted to `RESIDENT`

#### 4. Database Performance

Added indexes for frequently queried fields:

- residentId
- technicianId
- status
- priority
- category
- createdAt

#### 5. Frontend Integration

Updated registration to send only:

- name
- email
- password

The backend automatically assigns the `RESIDENT` role.

### Verification

- Backend build passed
- Frontend build passed
- Maintenance list API tests verified
- Full test-suite cleanup postponed to final testing

## Day 35 — User Management & Admin Foundation

### Goals

- Build User Management
- Implement Admin-only authorization
- Create Manager and Technician accounts
- Add pagination, search, filtering and sorting
- Protect sensitive user data
- Build Admin User Management UI
- Complete testing

### Completed

- User Management API
- Admin-only RBAC
- Staff creation
- bcrypt password hashing
- Sensitive data protection
- User search, filtering, sorting and pagination
- React Query integration
- Protected `/users` route
- Access Denied page
- Full test suite fixed and passed
- Cloudinary mocked in service tests

### Key Concepts

- RBAC
- Password hashing
- API pagination
- React Query mutations
- Query invalidation
- Protected routes
- Unit testing and mocking

### Verification

- Backend build passed
- Frontend build passed
- Full test suite passed

## Day 36 — Redis Caching & Performance

### Goals

- Understand caching
- Implement Cache-Aside pattern
- Cache maintenance list responses
- Add Redis TTL
- Implement cache invalidation
- Prevent stale data

### Completed

- Redis caching utility
- Maintenance list caching
- 60-second TTL
- Cache invalidation after create
- Cache invalidation after update
- Cache expiration testing
- Redis cache verification

### Cache Flow

GET Maintenance
→ Check Redis
→ Cache Hit → Return cached data
→ Cache Miss → PostgreSQL → Store in Redis

When data changes:

CREATE / UPDATE
→ PostgreSQL
→ Invalidate Redis
→ Next GET fetches fresh data

### Key Concepts

- Redis
- Caching
- Cache-Aside Pattern
- TTL
- Cache Invalidation
- Cache Consistency
- Performance Optimization

### Verification

- Redis connection verified
- Cache creation verified
- 60-second TTL verified
- Cache expiration verified
- Update invalidation verified
- Create invalidation verified

### Result

Maintenance list responses are cached in Redis to reduce repeated database queries while invalidating stale cache data whenever maintenance requests are created or updated.

## Day 37 — Redis Caching, Resilience & Testing

### Goals

- Improve Redis configuration
- Handle Redis failures gracefully
- Design structured cache keys
- Measure cache performance
- Add automated cache tests
- Verify backend resilience

### Completed

- Environment-based Redis configuration
- Graceful Redis error handling
- PostgreSQL fallback when Redis is unavailable
- Structured maintenance cache keys
- Cache-aside pattern
- 60-second TTL
- Cache invalidation
- Cache hit/miss performance verification
- Redis utility tests
- Full backend test verification

### Cache Flow

GET Maintenance
→ Generate Cache Key
→ Check Redis
→ Cache Hit → Return Cached Data
→ Cache Miss → PostgreSQL → Store in Redis

When data changes:

CREATE / UPDATE / ASSIGN
→ PostgreSQL
→ Invalidate Maintenance Cache
→ Next GET fetches fresh data

### Resilience

If Redis becomes unavailable:

Request
→ Redis fails
→ Continue without cache
→ PostgreSQL
→ Return response

The API remains available even when Redis is unavailable.

### Testing

- 13 test files passed
- 71 tests passed
- Production build passed

### Key Concepts

- Redis
- Cache-Aside Pattern
- Cache Keys
- TTL
- Cache Invalidation
- Cache Consistency
- Graceful Degradation
- Performance Measurement
- Automated Testing

### Result

The application now uses Redis for performance optimization while remaining functional when Redis is unavailable.

## Day 38 — Redis Production Optimization

### Goals

- Improve Redis cache invalidation
- Replace KEYS with SCAN
- Handle large Redis keyspaces safely
- Test multi-batch cache invalidation

### Completed

- Replaced Redis KEYS with SCAN
- Added SCAN cursor handling
- Added batch scanning with COUNT
- Added multi-iteration SCAN testing
- Preserved graceful Redis error handling
- Verified cache invalidation

### Cache Invalidation

DELETE maintenance:list:*

→ Redis SCAN
→ Find matching keys in batches
→ Delete matching keys
→ Continue until cursor reaches "0"

### Why SCAN?

KEYS can scan the entire keyspace at once and may block Redis when many keys exist.

SCAN processes keys incrementally, making it more suitable for production workloads.

### Testing

- 13 test files passed
- 72 tests passed
- Production build passed

### Key Concepts

- Redis SCAN
- Redis Cursor
- Batch Processing
- Cache Invalidation
- Cache Consistency
- Production Optimization

### Result

Redis cache invalidation now uses SCAN instead of KEYS, making the implementation safer for larger production environments.

## Day 39 — Background Jobs & Queues

### Goals

- Understand background jobs
- Understand queues and workers
- Implement BullMQ
- Use Redis as the queue backend
- Add retry handling
- Connect maintenance requests to background jobs

### Completed

- Installed BullMQ
- Created notification queue
- Created notification worker
- Connected BullMQ to Redis
- Added job retry configuration
- Added exponential backoff
- Tested failed jobs and retries
- Connected maintenance request creation to the notification queue
- Verified real frontend → queue → worker flow

### Queue Flow

Maintenance Request
→ PostgreSQL
→ BullMQ Queue
→ Redis
→ Notification Worker
→ Process Notification
→ Completed

### Retry Configuration

- Maximum attempts: 3
- Backoff: exponential
- Initial delay: 1000ms
- Completed jobs retained: 100
- Failed jobs retained: 500

### Failure Handling

A test job was intentionally failed to verify retry behavior.

Result:

Attempt 1 → Failed
Attempt 2 → Failed
Attempt 3 → Failed

### Real Integration Test

A maintenance request created from the frontend successfully created a
`maintenance-created` BullMQ job.

The worker received and processed the job successfully.

### Key Concepts

- Background Jobs
- Message Queues
- BullMQ
- Redis
- Workers
- Retry Mechanism
- Exponential Backoff
- Failure Handling
- Asynchronous Processing

### Result

CommunityCare can now move notification-related work into background jobs instead of processing everything synchronously during the HTTP request.

## Day 40 — Notification System

### Overview

Implemented the notification system that connects maintenance requests with background jobs and persistent user notifications.

The notification flow is:

Maintenance Request → BullMQ Queue → Notification Worker → Notification Service → PostgreSQL → Notification API

### Features

- Notification database model using Prisma
- User-to-notification relationship
- Notification repository layer
- Notification service layer
- Notification controller
- Protected notification routes
- BullMQ worker creates notifications asynchronously
- Redis used by BullMQ for background job processing
- Notification pagination
- Mark notifications as read
- `isRead` and `readAt` tracking
- Database indexes for notification queries
- Unit-test mocking for BullMQ/Redis dependencies

### Notification Model

The `Notification` model contains:

- `id` — Unique notification ID
- `userId` — User receiving the notification
- `type` — Notification type
- `title` — Notification title
- `message` — Notification message
- `isRead` — Whether the notification has been read
- `readAt` — Timestamp when it was read
- `createdAt` — Notification creation timestamp

Indexes:

- `[userId, isRead]`
- `[createdAt]`

### API Endpoints

#### Get My Notifications

```http
GET /api/notifications
```

# Day 41 — Real-Time & Push Notifications

## Goal

Build a complete notification system for CommunityCare that supports:

- Real-time in-app notifications
- Persistent notifications in PostgreSQL
- Unread notification count
- Marking notifications as read
- Web Push notifications
- Notifications when the application is closed or in the background

## What Was Built

### 1. Socket.IO Real-Time Notifications

Integrated Socket.IO between the backend and frontend.

Flow:

Maintenance Request
→ BullMQ
→ Notification Worker
→ PostgreSQL
→ Socket.IO
→ Resident UI

Each authenticated user joins a private Socket.IO room:

`user:{userId}`

Notifications are emitted only to the intended user.

### 2. Notification Database

Added the `Notification` model with:

- User association
- Notification type
- Title
- Message
- Read/unread status
- Read timestamp
- Creation timestamp

Indexes were added for efficient user notification queries.

### 3. Notification API

Implemented:

- Get current user's notifications
- Pagination
- Mark a notification as read

Endpoints:

`GET /api/notifications`

`PATCH /api/notifications/:id/read`

### 4. Notification Worker

Updated the BullMQ notification worker to:

1. Create the notification in PostgreSQL
2. Send a Web Push notification
3. Emit a Socket.IO event

This keeps notification processing outside the HTTP request.

### 5. Notification Dropdown

Added a frontend notification dropdown containing:

- Notification title
- Notification message
- Creation time
- Read/unread state
- Unread indicator
- Mark-as-read functionality

### 6. Unread Notification Count

Added an unread notification badge to the Navbar.

The count is synchronized when:

- Notifications are loaded
- A notification is marked as read
- The notification dropdown is opened
- A new real-time notification arrives

The count is calculated from notification data rather than relying only on a local counter.

### 7. Web Push Notifications

Added Web Push support using:

- VAPID
- Service Worker
- Push API
- `web-push`

Push subscriptions are stored in PostgreSQL.

Each subscription contains:

- User ID
- Endpoint
- `p256dh`
- `auth`

### 8. Service Worker

The frontend Service Worker handles incoming push events.

Behavior:

- Application visible → in-app Socket.IO notification
- Application closed/background → OS notification

This prevents duplicate notifications while the application is actively being viewed.

### 9. Push Subscription Management

Implemented automatic subscription registration after authentication.

Expired subscriptions returning HTTP `404` or `410` are removed from the database.

## Final Notification Architecture

```text
                    Maintenance Request
                           │
                           ▼
                        BullMQ
                           │
                           ▼
                  Notification Worker
                     │      │      │
                     │      │      │
                     ▼      ▼      ▼
                PostgreSQL  Socket.IO  Web Push
                     │         │          │
                     │         ▼          ▼
                     │    In-App UI    Service Worker
                     │                    │
                     │                    ▼
                     │               OS Notification
                     │
                     ▼
              Notification History
 ```

## Day 42 — Announcements, Real-Time Updates & Web Push

### Overview

Day 42 added a complete community announcement system to CommunityCare.

The system supports:

- Announcement creation with role-based access control
- Announcement persistence in PostgreSQL
- Community-based announcement retrieval
- Real-time announcement delivery using Socket.IO
- Browser Web Push subscriptions
- OS notifications when the application is closed
- Automatic cleanup of expired push subscriptions
- Frontend real-time announcement updates
- Announcement filtering and search

---

### 1. Day 42 Objectives

The main goals were:

1. Build the announcement backend
2. Add announcement API endpoints
3. Apply RBAC to announcement creation
4. Connect announcements to the frontend
5. Add real-time announcement delivery
6. Add Web Push support
7. Display OS notifications when the application is closed
8. Verify the complete announcement workflow

---

### 2. Announcement Architecture

The announcement system follows the existing layered backend architecture:

```text
HTTP Request
    ↓
Route
    ↓
Authentication Middleware
    ↓
Authorization Middleware
    ↓
Controller
    ↓
Service
    ↓
Repository
    ↓
Prisma
    ↓
PostgreSQL
```

# Day 43 — Notification Queues & Reliable Web Push

## Overview

Day 43 improved the CommunityCare notification architecture by moving announcement Web Push processing into the existing BullMQ background job system.

The main goal was to prevent the announcement API request from directly performing potentially expensive push operations.

Day 43 also introduced separate notification job types and isolated individual push failures so one user's failed notification does not fail the entire community announcement job.

---

## 1. Day 43 Objectives

The main goals were:

1. Separate maintenance and announcement notification jobs
2. Move announcement Web Push processing into BullMQ
3. Process community notifications through the background worker
4. Reuse existing Redis infrastructure
5. Preserve BullMQ retry and backoff configuration
6. Isolate individual push failures
7. Verify the complete asynchronous notification flow

---

### 2. Previous Architecture

Before Day 43, announcement creation directly performed Web Push processing.

```text
Admin
  ↓
Announcement API
  ↓
Create announcement
  ↓
Find community users
  ↓
Send Web Push
  ↓
HTTP response
```

# Day 44 — Notification Preferences & User Control

## Goal

Build a notification preference system that allows users to control Web Push notifications.

* Push notification control
* Maintenance notifications
* Announcement notifications
* PostgreSQL preference storage
* BullMQ worker integration
* Real-time in-app notifications

## What Was Built

### 1. Notification Preferences

Added `NotificationPreference` model with:

```text
pushEnabled
announcements
maintenance
```

Default values are `true`.

### 2. Preference API

```http
GET /api/notification-preferences
PATCH /api/notification-preferences
```

Users can update their own notification preferences.

### 3. Notification Worker

Updated the BullMQ worker to check preferences before sending Web Push.

```text
Notification Event
        ↓
     BullMQ
        ↓
Notification Worker
        ↓
Check Preferences
        ↓
   Web Push
```

### 4. Verification

Tested:

* Push ON/OFF
* Maintenance ON/OFF
* Announcement ON/OFF
* Notification persistence
* Socket.IO notifications

## Result

Users can now control their Web Push notifications while in-app notifications and notification history remain available.

## Day 45 — Notification Reliability & Cleanup

### Goal

Improve notification reliability and error handling in CommunityCare.

* Type-safe Web Push errors
* Invalid subscription cleanup
* BullMQ retries
* Push failure isolation
* Worker logging

### What Was Built

### 1. Push Error Handling

Replaced `any` with `unknown` for safe error handling.

```ts
catch (error: unknown) {
```

### 2. Invalid Subscription Cleanup

Automatically removes subscriptions when Web Push returns:

```text
404 / 410
```

### 3. BullMQ Retry System

```ts
attempts: 3,
backoff: {
  type: "exponential",
  delay: 1000,
}
```

### 4. Push Failure Isolation

```text
Notification
     ↓
BullMQ
     ↓
Worker
     ↓
Web Push
  ┌──┴──┐
  ↓     ↓
Success Failure
        ↓
     Log Error
```

### 5. Verification

* TypeScript passed
* Tests passed
* Production build passed
* Push failure handling verified
* Invalid subscription cleanup verified

### Result

CommunityCare now has a more reliable notification system with retries, cleanup, failure isolation, and worker logging.

## Day 46 — API Security Hardening

### Goal

Improve the security and production readiness of the CommunityCare backend.

* Security headers
* CORS hardening
* Request body limits
* Secure JWT cookies
* Rate-limit review
* Environment variable security

### What Was Built

### 1. Security Headers

Added Helmet for HTTP security headers.

```ts
app.use(helmet());
```

### 2. CORS Hardening

Moved the frontend URL to an environment variable.

```env
CLIENT_URL=http://localhost:5173
```

### 3. Request Body Limits

Added a `1mb` limit for JSON and URL-encoded requests.

```ts
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
```

### 4. JWT Cookie Security

Configured the authentication cookie with:

```text
httpOnly
secure
sameSite
7-day expiration
```

The JWT expiration was also changed to:

```ts
expiresIn: "7d"
```

### 5. Rate Limiting

Reviewed existing authentication and OTP rate limits.

```text
Authentication → 10 requests / 15 minutes
OTP            → 5 requests / 10 minutes
```

### 6. Environment Security

Added `.env.example` files for client and server while keeping real secrets in `.env`.

```text
.env          → Not committed
.env.example  → Committed
```

### Verification

* TypeScript passed
* Tests passed
* Production build passed

### Result

CommunityCare backend is now more secure and prepared for production deployment.

## Day 47 — Resend Email System

### Goal

Add a real email delivery system using Resend.

* Resend API integration
* OTP email delivery
* Email verification flow
* OTP resend
* Redis OTP storage
* Email rate limiting

### What Was Built

### 1. Resend Integration

Added Resend configuration using an environment variable.

```env
RESEND_API_KEY=
```

### 2. OTP Email Service

Created a reusable email service:

```text
src/modules/auth/email.service.ts
```

It sends verification emails containing:

```text
6-digit OTP
5-minute expiration
CommunityCare branding
```

### 3. Registration Email Flow

```text
Register
   ↓
Create User
   ↓
Generate OTP
   ↓
Store OTP in Redis
   ↓
Send Email with Resend
```

### 4. Resend OTP

Added:

```http
POST /api/auth/resend-otp
```

with OTP rate limiting.

### 5. Resend Testing

Successfully verified:

```text
Registration
   ↓
OTP generated
   ↓
Redis
   ↓
Resend
   ↓
Email received
```

### Verification

* TypeScript passed
* Tests passed
* Production build passed
* OTP email received successfully
* Resend integration verified

### Result

CommunityCare now has a working email delivery system using Resend for OTP verification and resend functionality.

## Day 48 — Email Verification & Password Reset

### Goal

Complete the email authentication and password recovery system in CommunityCare.

- Forgot password
- Password reset emails
- Secure reset tokens
- Redis token storage
- Password reset frontend
- Account enumeration protection
- Password reset rate limiting
- Authentication tests

### What Was Built

### 1. Password Reset Tokens

Created secure password reset tokens using Node.js `crypto`.

```text
User
 ↓
Forgot Password
 ↓
Generate Reset Token
 ↓
Store Token in Redis
 ↓
Send Reset Email
```
Users receive a confirmation message after submitting the request.

### 4. Reset Password Page

Added a dedicated reset password page.

```
Reset Link
 ↓
Read Token
 ↓
Enter New Password
 ↓
Confirm Password
 ↓
Reset Password
 ↓
Success
```
The token is sent to the backend for validation before the password is changed.

### 5. Account Enumeration Protection

The forgot-password endpoint returns the same response whether the email exists or not.

```json
{
  "message": "Password reset instructions sent"
}
```

This prevents attackers from discovering which email addresses have CommunityCare accounts.

```
Existing Email
      ↓
Response + Email Sent

Unknown Email
      ↓
Same Response + No Email
```

### 6. Password Reset Rate Limiting

Created a dedicated password reset rate limiter.

```
Window: 15 minutes
Limit: 5 requests
```

```
5 requests → Allowed
6th request → 429 Too Many Requests
```

### 7. Unit Test Mocking

Updated authentication unit tests to mock:

```
Redis password reset utilities
Email service
```

This keeps unit tests independent of external services.

### 8. Testing

Verified:

- [x] Password reset email flow
- [x] Forgot password frontend
- [x] Reset password frontend
- [x] Account enumeration protection
- [x] Password reset rate limiting
- [x] TypeScript compilation
- [x] Unit tests
- [x] Production build

### Result

CommunityCare now has a complete and secure email authentication

## Day 49 — Google OAuth & Authentication Cleanup

### Overview

Day 49 focused on completing Google OAuth authentication and cleaning up the authentication architecture.

The Google authentication flow was redesigned to use a single OAuth callback with a secure Redis-backed OAuth state containing the authentication intent (`login` or `register`).

### Completed

- Implemented Google OAuth login
- Implemented Google OAuth registration
- Added Google OAuth state generation and validation
- Stored OAuth state in Redis with expiration
- Added `login` and `register` OAuth intents
- Created a single Google OAuth callback
- Added Google ID token verification
- Added Google email verification checks
- Added protection against duplicate Google accounts
- Added protection against registering with an existing email
- Added Google OAuth error redirects
- Improved authentication controller separation
- Separated Google routes into `google.routes.ts`
- Added Google-specific controller and service logic
- Fixed frontend Google OAuth error handling
- Verified normal authentication and logout flows
- Tested duplicate-account scenarios

### Google OAuth Flow

```text
Login
  ↓
/api/auth/google
  ↓
Google OAuth
  ↓
/api/auth/google/callback
  ↓
Validate OAuth State
  ↓
Intent = login
  ↓
Find / Link Account
  ↓
Create JWT
  ↓
Set httpOnly Cookie
  ↓
Redirect to Dashboard
```

```
Register
  ↓
/api/auth/google/register
  ↓
Google OAuth
  ↓
/api/auth/google/callback
  ↓
Validate OAuth State
  ↓
Intent = register
  ↓
Check Existing Google ID
  ↓
Check Existing Email
  ↓
Create Account
  ↓
Create JWT
  ↓
Set httpOnly Cookie
  ↓
Redirect to Dashboard
```

### Authentication Security

- [x] JWT stored in an `httpOnly` cookie
- [x] Google OAuth state stored in Redis
- [x] OAuth state expires automatically
- [x] OAuth state is deleted after verification
- [x] Google ID token audience is verified
- [x] Google email verification is required
- [x] Duplicate email registration is prevented
- [x] Duplicate Google account registration is prevented
- [x] OAuth login cannot automatically create an account

### Authentication Architecture

```
auth/
├── auth.controller.ts
├── auth.service.ts
├── auth.schema.ts
├── auth.routes.ts
├── google.controller.ts
├── google.service.ts
├── google.routes.ts
└── ...
```

### Testing

The following authentication scenarios were tested:

- [x] Normal registration
- [x] Normal login
- [x] Normal logout
- [x] Google login
- [x] Google registration
- [x] Existing email + Google registration
- [x] Existing Google account + Google registration
- [x] Invalid/expired OAuth state
- [x] Unauthenticated `/me` request

## Day 50 — Authentication Security Audit & Production Readiness

### Completed

Day 50 focused on reviewing the authentication system, strengthening session security, validating authorization boundaries, and restoring the complete automated test suite after the security changes.

### Authentication Security

- Added `NODE_ENV` configuration for environment-aware cookie security.
- Added configurable `COOKIE_MAX_AGE`.
- JWT authentication now uses:
  - `httpOnly: true`
  - `secure: true` in production
  - `sameSite: "lax"`
  - Configurable 7-day expiration
- Added `tokenVersion` to JWT payloads.
- Added `tokenVersion` to the `User` model.
- Authentication middleware now verifies:
  - JWT signature
  - User existence
  - JWT `tokenVersion` against the database
- Invalid or expired sessions return `401 Unauthorized`.
- Password reset now invalidates existing sessions by incrementing `tokenVersion`.

### Authentication Rate Limiting

Verified rate limiting for authentication-related endpoints:

| Limiter | Limit |
|---|---|
| Authentication | 10 requests / 15 minutes |
| OTP | 5 requests / 10 minutes |
| Password Reset | 5 requests / 15 minutes |

### Authorization & IDOR Security Review

Reviewed authenticated resource access and role-based authorization.

Verified:

- Residents cannot assign technicians.
- Only authorized roles can assign technicians.
- Residents cannot update maintenance requests.
- Maintenance request ownership is enforced.
- Notification access is restricted to the authenticated user.
- Push subscriptions use the authenticated user's ID.
- User management endpoints are protected by role-based authorization.
- Foreign notification IDs cannot be used to modify another user's notification.
- No client-controlled `userId` is trusted for protected notification operations.

### File Upload Security

Reviewed maintenance request image uploads.

Implemented and verified:

- Maximum file count: `5`
- Maximum file size: `5 MB`
- Only image MIME types are accepted.
- Uploaded file content is additionally validated using `file-type`.
- Supported image formats:
  - JPEG
  - PNG
  - WebP
- Invalid file types are rejected.
- Multer upload errors are handled by the global error middleware.
- Cloudinary uploads use image resource type.

### Password Reset Security

Verified the password reset flow:

- Reset tokens are generated using cryptographically secure random bytes.
- Reset tokens are stored in Redis.
- Reset token expiration: `15 minutes`.
- Reset tokens are deleted after successful password reset.
- Forgot-password responses avoid revealing whether an email exists.
- Password reset increments the user's `tokenVersion`.
- Existing sessions become invalid after password reset.
- Login with the new password creates a valid new session.

### OTP Security

- OTP generation uses Node.js `crypto.randomInt()`.
- OTP expiration: `5 minutes`.
- OTP verification updates the user's verification status.
- OTP is deleted after successful verification.

### Security Headers

Verified Helmet security headers are enabled.

The application also uses:

- CORS configuration
- HTTP-only authentication cookies
- Request body size limits
- JWT validation
- Role-based authorization
- Rate limiting

