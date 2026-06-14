# GEMINI.md - Full-Stack API Contract & Frontend Guide

# Project: Student Talent & Project Hub

## 🏗️ Project Architecture

- Backend: FastAPI, PostgreSQL (Neon), asyncpg. Base URL: `http://127.0.0.1:8000`
- Frontend: React (Vite), Tailwind CSS v4. Base URL: `http://localhost:5173`
- User Roles: `student`, `recruiter`, `admin`.

---

## 📖 API CONTRACT & SCHEMAS (STRICT RULE)

When building frontend components and fetch services, strictly use the following endpoint routes and JSON schemas.

### 1. USERS & AUTHENTICATION

All protected routes require header: `Authorization: Bearer <access_token>`

- POST /users/register
  - Request Body (application/json):
    {
    "email": "string",
    "password": "string",
    "name": "string",
    "role": "student | recruiter | admin",
    "nim": "string (nullable, for student)",
    "major": "string (nullable)"
    }
  - Response (201 Created):
    {
    "id": "uuid-string",
    "email": "string",
    "name": "string",
    "role": "string",
    "nim": "string",
    "major": "string",
    "status": "active | banned"
    }

- POST /users/login
  - Request Body (application/x-www-form-urlencoded):
    MUST use URLSearchParams with keys: `username` (contains email) and `password`.
  - Response:
    {
    "access_token": "jwt-token-string",
    "token_type": "bearer"
    }

- GET /users/me
  - Requires Auth: Yes
  - Response: Returns the same User object schema as register response.

- GET /users/ (Admin Only)
  - Requires Auth: Yes
  - Response: Array of User objects.

### 2. SKILLS MANAGEMENT

- POST /skills/categories (Admin Only)
  - Request (application/json): {"name": "string", "description": "string"}
  - Response: {"id": "uuid-string", "name": "string", "description": "string"}

- GET /skills/categories (Public)
  - Response: Array of Skill Category objects.

- POST /skills/user-skills (Student Only)
  - Requires Auth: Yes
  - Request (application/json):
    {
    "skill_id": "uuid-string",
    "proficiency_level": "beginner | intermediate | expert"
    }
  - Response: {"id": "uuid-string", "user_id": "uuid", "skill_id": "uuid", "proficiency_level": "string"}

- DELETE /skills/user-skills/{skill_id}
  - Requires Auth: Yes
  - Response: 204 No Content

### 3. PROJECT HUB & COLLABORATION

- POST /projects/ (Student Only)
  - Requires Auth: Yes
  - Request (application/json):
    {
    "title": "string",
    "description": "string",
    "github_link": "string (nullable)",
    "figma_link": "string (nullable)",
    "thumbnail_url": "string (nullable)",
    "is_open": boolean
    }
  - Response: Returns Project object (adds `id`, `owner_id`, `status: published`, `created_at`).

- GET /projects/
  - Query Params: `?is_open=true` (optional)
  - Response: Array of Project objects.

- GET /projects/{project_id}
  - Response: Project object INCLUDING an array of `contributors`.
    "contributors": [
    {
    "id": "uuid",
    "user_id": "uuid",
    "role": "UI/UX | Backend | etc",
    "joined_at": "timestamp"
    }
    ]

- POST /projects/{project_id}/contributors (Project Owner Only)
  - Requires Auth: Yes
  - Request (application/json):
    {
    "user_id": "uuid-string (the student being added)",
    "role": "string (e.g., Backend, Frontend)"
    }

### 4. ENDORSEMENTS

- POST /endorsements/
  - Requires Auth: Yes
  - Request (application/json):
    {
    "to_user_id": "uuid-string",
    "skill_id": "uuid-string (nullable)",
    "project_id": "uuid-string (nullable)",
    "message": "string"
    }
  - Response: Endorsement object (adds `id`, `from_user_id`, `created_at`).

- GET /endorsements/user/{user_id}
  - Response: Array of Endorsement objects received by the user.

---

## 🤖 AI AGENT INSTRUCTIONS FOR FRONTEND

### Phase 1: Global Layout & UI Shell

1. Use Tailwind CSS v4 for all styling.
2. Build a responsive "DashboardLayout" component:
   - Left Sidebar (fixed, dark theme).
   - Top Header (profile snippet, logout button).
   - Dynamic nav links based on `role` (Admin vs Student).

### Phase 2: API & State Integration

1. **API Service (`src/services/api.js`)**:
   - Implement global fetch wrappers.
   - For `/login`, STRICTLY use `application/x-www-form-urlencoded` with `URLSearchParams`.
   - For all protected routes, auto-inject `Authorization: Bearer <token>`.
   - If API returns 401, automatically clear localStorage and redirect to `/login`.

### Phase 3: Core Pages

1. **Auth (`/login`, `/register`)**: Card forms, visual error handling.
2. **Student Dashboard (`/dashboard`)**:
   - Fetch `GET /users/me`.
   - Section for "My Skills" (allow adding via `POST /skills/user-skills`).
   - Section for "Endorsements Received".
3. **Project Hub (`/projects`)**:
   - Grid of project cards (`GET /projects/`). Add `is_open` filter toggle.
   - Click card -> detail view (`GET /projects/{id}`) showing contributors.
   - Modal to "Create Project".
4. **Admin Panel (`/admin`)**:
   - Table of users (`GET /users/`).
   - Form to add master skills (`POST /skills/categories`).

**Coding Standards:**

- Use functional React components and Hooks.
- Always implement loading states (disable buttons/show spinners) during fetch.
- Use `try...catch` and display user-friendly error alerts.
