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