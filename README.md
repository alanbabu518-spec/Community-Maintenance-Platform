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