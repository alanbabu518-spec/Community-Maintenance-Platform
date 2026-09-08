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

