# Multi-Tenant SaaS Platform

A production-ready, multi-tenant SaaS application for project and task management. It features complete data isolation, role-based access control (RBAC), and subscription management.

## Features
- **Multi-Tenancy**: Complete data isolation with subdomain support.
- **Role-Based Access Control**: Super Admin, Tenant Admin, and User roles.
- **Authentication**: JWT-based stateless auth with 24h expiry.
- **Project Management**: Create, update, and track projects.
- **Task Tracking**: Assign tasks, set priorities, and track status.
- **Subscription Plans**: Free, Pro, and Enterprise tiers with resource limits.
- **Modern UI**: "Cyberpunk/SaaS" dark theme with responsive layout.
- **Dockerized**: specific Docker setup for database, backend, and frontend.
- **Audit Logging**: Security tracking for critical actions.

## Technology Stack
- **Frontend**: React 18, Vite, CSS Variables (Dark Theme)
- **Backend**: Node.js, Express
- **Database**: PostgreSQL 15
- **Containerization**: Docker, Docker Compose

## Architecture Overview
The system follows a 3-tier architecture:
1.  **Client**: React SPA interacting via REST API.
2.  **Server**: Node.js/Express API handling auth, multi-tenancy logic, and business rules.
3.  **Database**: PostgreSQL with foreign-key based tenant isolation.

## Installation & Setup

### Prerequisites
- Docker and Docker Compose installed
- Node.js (v18+) (optional, for local dev)

### Quick Start
Run the entire stack with a single command:
```bash
docker-compose up -d --build
```

Access the application:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

### Setup Details
Database migrations and seed data are automatically applied when the backend container starts.

## Environment Variables
Defined in `docker-compose.yml`:
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`: Database connection.
- `JWT_SECRET`: Secret key for token signing.
- `FRONTEND_URL`: URL for CORS configuration.

## API Documentation
See [docs/API.md](docs/API.md) for full endpoint details.

### Main Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register-tenant` - Register new organization
- `GET /api/projects` - List projects (tenant-isolated)
- `POST /api/project/:id/tasks` - Create task

## Testing Credentials (Seed Data)
**Super Admin:**
- Email: `superadmin@system.com`
- Password: `Admin@123`

**Demo Tenant Admin:**
- Subdomain: `demo`
- Email: `admin@demo.com`
- Password: `Demo@123`
