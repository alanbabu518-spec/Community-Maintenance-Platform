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

