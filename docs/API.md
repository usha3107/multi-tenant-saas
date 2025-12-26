# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

### Register Tenant
- **Endpoint**: `POST /auth/register-tenant`
- **Description**: Register a new tenant organization and admin user.
- **Body**:
  ```json
  {
    "tenantName": "Acme Corp",
    "subdomain": "acme",
    "adminEmail": "admin@acme.com",
    "adminFullName": "Admin User",
    "adminPassword": "password123"
  }
  ```

### Login
- **Endpoint**: `POST /auth/login`
- **Description**: Authenticate user and receive JWT.
- **Body**:
  ```json
  {
    "email": "admin@demo.com",
    "password": "Demo@123",
    "tenantSubdomain": "demo"
  }
  ```

### Get Current User
- **Endpoint**: `GET /auth/me`
- **Headers**: `Authorization: Bearer <token>`

## Projects

### List Projects
- **Endpoint**: `GET /projects`
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `page`, `limit`, `search`, `status`

### Create Project
- **Endpoint**: `POST /projects`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "name": "New Website",
    "description": "Redesign project"
  }
  ```

### Get Project Details
- **Endpoint**: `GET /projects/:id`
- **Headers**: `Authorization: Bearer <token>`

### Update Project
- **Endpoint**: `PUT /projects/:id`
- **Headers**: `Authorization: Bearer <token>`

### Delete Project
- **Endpoint**: `DELETE /projects/:id`
- **Headers**: `Authorization: Bearer <token>`

## Tasks

### List Tasks
- **Endpoint**: `GET /projects/:projectId/tasks`
- **Headers**: `Authorization: Bearer <token>`

### Create Task
- **Endpoint**: `POST /projects/:projectId/tasks`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "title": "Design Mockups",
    "description": "Figma files",
    "priority": "high",
    "dueDate": "2024-12-31"
  }
  ```

### Update Task Status
- **Endpoint**: `PATCH /tasks/:taskId/status`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  { "status": "in_progress" }
  ```

## Users (Tenant Admin Only)

### List Users
- **Endpoint**: `GET /tenants/:tenantId/users`
- **Headers**: `Authorization: Bearer <token>`

### Add User
- **Endpoint**: `POST /tenants/:tenantId/users`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "email": "employee@demo.com",
    "fullName": "John Doe",
    "role": "user"
  }
  ```

### Delete User
- **Endpoint**: `DELETE /users/:userId`
- **Headers**: `Authorization: Bearer <token>`
