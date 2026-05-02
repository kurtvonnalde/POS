# POS (Point of Sale) System

## Overview

A full-stack, role-based point-of-sale system designed for retail and inventory management. The application provides a comprehensive platform for managing sales transactions, inventory, product categories, suppliers, and user access control through a multi-tier role-based authorization system. The backend implements a RESTful API architecture using FastAPI with SQLAlchemy ORM for database abstraction, while the frontend delivers a responsive single-page application (SPA) with React and TypeScript, communicating via HTTP REST endpoints with CORS-enabled cross-origin requests.

## Technology Stack

### Backend

- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) v0.x - Modern, high-performance Python web framework for building APIs with automatic OpenAPI documentation
- **ORM**: [SQLAlchemy](https://www.sqlalchemy.org/) - SQL toolkit and Object-Relational Mapping library for database abstraction
- **Database**: PostgreSQL - Relational database management system
- **Authentication**: JWT (JSON Web Tokens) - Stateless token-based authentication
- **Data Validation**: [Pydantic](https://docs.pydantic.dev/) - Data validation and settings management library
- **Password Hashing**: bcrypt - Secure password hashing algorithm
- **Middleware**: CORS (Cross-Origin Resource Sharing) - Enable secure cross-origin requests
- **Environment Management**: python-dotenv - Load environment variables from .env files

### Frontend

- **Framework**: [React](https://react.dev/) v19.2.4 - JavaScript library for building user interfaces with component-based architecture
- **Language**: [TypeScript](https://www.typescriptlang.org/) v6.0.2 - Typed superset of JavaScript for type-safe development
- **Build Tool**: [Vite](https://vitejs.dev/) v8.0.4 - Next-generation frontend build tool with hot module replacement (HMR)
- **Routing**: [React Router](https://reactrouter.com/) v7.14.1 - Client-side routing and navigation
- **HTTP Client**: [Axios](https://axios-http.com/) v1.15.0 - Promise-based HTTP client for API communication
- **Styling**: [SASS](https://sass-lang.com/) v1.99.0 - CSS preprocessor with variables, mixins, and nesting
- **Icons**: 
  - [Lucide React](https://lucide.dev/) v1.8.0 - Lightweight SVG icon library
  - [React Icons](https://react-icons.github.io/react-icons/) v5.6.0 - Popular icon packs as React components
- **Linting**: [ESLint](https://eslint.org/) v9.39.4 - Code quality and style checking
- **UI Components**: [@react-login-page/page2](https://www.npmjs.com/package/@react-login-page/page2) - Pre-built login page components

## Project Architecture

### Backend Architecture (FastAPI)

```
backend/
├── app/
│   ├── api/
│   │   └── routes/           # Endpoint handlers
│   │       ├── auth.py       # Authentication (register, login, verify)
│   │       ├── users.py      # User management CRUD operations
│   │       ├── dashboard.py  # Role-based dashboard endpoints
│   │       ├── suppliers.py  # Supplier management
│   │       └── category.py   # Product category management
│   ├── models/               # SQLAlchemy ORM models
│   │   ├── user.py           # User model with roles
│   │   ├── role.py           # Role model for RBAC
│   │   ├── supplier.py       # Supplier model
│   │   └── category.py       # Product category model
│   ├── schemas/              # Pydantic request/response validators
│   │   ├── user.py
│   │   ├── supplier.py
│   │   └── category.py
│   ├── services/             # Business logic layer
│   │   ├── auth_service.py   # Authentication logic
│   │   ├── user_service.py   # User operations
│   │   ├── supplier_service.py
│   │   └── category_service.py
│   ├── utils/                # Utility functions
│   │   └── password.py       # bcrypt password operations
│   ├── exceptions/           # Custom exception classes
│   ├── database.py           # SQLAlchemy engine and session configuration
│   ├── base.py               # SQLAlchemy declarative base
│   └── main.py               # FastAPI app initialization
```

**Architectural Pattern**: Layered architecture with separation of concerns:
- **Routes Layer**: HTTP request/response handling and validation
- **Services Layer**: Business logic and database operations
- **Models Layer**: Data persistence and ORM definitions
- **Utils Layer**: Reusable functions and helpers

### Frontend Architecture (React + TypeScript)

```
frontend/src/
├── components/
│   ├── layout/               # Layout wrapper components
│   │   ├── AppLayout.tsx     # Main application layout
│   │   ├── Header.tsx        # Navigation header with sidebar
│   │   └── Footer.tsx        # Footer component
│   └── common/               # Reusable UI components
│       ├── ProtectedRoute.tsx # Route protection with authentication
│       └── notifications/    # Notification system components
├── pages/                    # Full-page view components
│   ├── Auth/
│   │   └── Login/            # Login page (credential validation)
│   ├── Inventory/            # Inventory management page
│   ├── Products/             # Product management page
│   ├── Sales/                # Sales transaction page
│   ├── Reports/              # Analytics and reporting page
│   └── Settings/             # App settings and configuration
│       ├── ManageUsers/      # User administration
│       ├── ManageSupplier/   # Supplier management
│       ├── ManageCategories/ # Category management
│       └── ManageInventory/  # Inventory configuration
├── services/                 # API service layer (Axios clients)
├── hooks/                    # Custom React hooks
├── context/                  # React Context API for state management
├── types/                    # TypeScript interfaces and type definitions
├── utils/                    # Helper functions and utilities
└── App.tsx                   # Root component with routing
```

**Architectural Pattern**: Component-based, modular SPA with:
- **Pages**: Route-bound container components
- **Components**: Reusable UI and layout components
- **Services**: API communication layer (Axios instances)
- **Context**: Global state management for authentication and user data

## Database Architecture

**Database System**: PostgreSQL

**Core Tables**:
- `users` - User accounts with email, password hash, roles
- `roles` - Role definitions (Admin, Manager, Staff)
- `user_roles` - Many-to-many relationship for RBAC (Role-Based Access Control)
- `suppliers` - Supplier information and contact details
- `categories` - Product category taxonomy
- `products` - Product catalog with inventory tracking
- `sales_transactions` - Point-of-sale transaction records
- `sales_items` - Line items for each transaction

**ORM Details**:
- SQLAlchemy handles schema definition via model classes
- Automatic table creation on application startup
- Connection pooling for performance optimization
- Session management with dependency injection in FastAPI

## API Communication Flow

```
React Component
    ↓
Axios HTTP Client (services/)
    ↓
FastAPI Route Handler (api/routes/)
    ↓
Pydantic Schema Validation
    ↓
Service Layer Business Logic (services/)
    ↓
SQLAlchemy Model & Database Query
    ↓
PostgreSQL
```

**Authentication Flow**:
1. User submits credentials via Login form
2. Backend validates and returns JWT token
3. Token stored in client-side storage (localStorage/sessionStorage)
4. Subsequent requests include token in Authorization header
5. Backend validates token before processing requests
6. ProtectedRoute component enforces frontend route protection

## Prerequisites

- **Python** 3.9+ (Backend)
- **Node.js** 18+ (Frontend)
- **PostgreSQL** 12+ (Database)
- **pip** (Python package manager)
- **npm** or **yarn** (Node package manager)

## Installation & Setup

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment**:
   ```bash
   python -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install fastapi uvicorn sqlalchemy psycopg2-binary pydantic python-dotenv bcrypt python-jose[cryptography]
   ```

4. **Configure environment variables** (create `.env` file):
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5433/pos_db
   SECRET_KEY=your-secret-key-for-jwt
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
   ```

5. **Create PostgreSQL database**:
   ```sql
   CREATE DATABASE pos_db;
   ```

6. **Run the backend server**:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
   API will be available at `http://localhost:8000`
   Interactive API docs at `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment configuration** (create `.env` file):
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   VITE_APP_NAME=POS System
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```
   Application will be available at `http://localhost:5173`

5. **Build for production**:
   ```bash
   npm run build
   ```
   Output will be in `dist/` directory

## Running the Application

### Development Environment

**Terminal 1 - Backend**:
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

**Access Application**:
- Frontend: `http://localhost:5173`
- API: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

### Production Deployment

**Backend** (using Gunicorn):
```bash
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```

**Frontend**:
```bash
npm run build
# Serve dist/ folder with web server (nginx, Apache, etc.)
```

## API Endpoints Overview

### Authentication Routes (`/auth`)
- `POST /auth/register` - User registration with email and password
- `POST /auth/login` - Credential validation and JWT token issuance
- `POST /auth/verify` - Token verification and user data retrieval

### User Management Routes (`/users`)
- `GET /users` - List all users with pagination
- `GET /users/{user_id}` - Get specific user details
- `PUT /users/{user_id}` - Update user information
- `DELETE /users/{user_id}` - Delete user account

### Supplier Management Routes (`/suppliers`)
- `GET /suppliers` - List all suppliers
- `POST /suppliers` - Create new supplier
- `PUT /suppliers/{supplier_id}` - Update supplier
- `DELETE /suppliers/{supplier_id}` - Delete supplier

### Category Management Routes (`/categories`)
- `GET /categories` - List all product categories
- `POST /categories` - Create new category
- `PUT /categories/{category_id}` - Update category
- `DELETE /categories/{category_id}` - Delete category

### Dashboard Routes (`/dashboard`)
- `GET /dashboard` - Role-specific dashboard data

**Full API documentation** available at `/docs` endpoint when backend is running (Swagger UI auto-generated by FastAPI).

## Role-Based Access Control (RBAC)

The system implements a hierarchical role model:

- **Admin**: Full system access, user management, configuration
- **Manager**: Inventory management, supplier/category administration, reports
- **Staff**: Sales transactions, inventory lookup, basic reporting

**Implementation**:
- Role associations stored in `user_roles` table
- JWT payload includes user roles
- Route handlers validate user permissions before processing
- Frontend ProtectedRoute component enforces UI-level access control

## Code Quality & Development Standards

### Backend

- **Code Style**: PEP 8 compliance
- **Naming Conventions**:
  - Files/Directories: snake_case (e.g., `auth_service.py`)
  - Classes: PascalCase (e.g., `AuthService`)
  - Functions: snake_case (e.g., `get_user_by_email`)
  - Constants: UPPER_CASE (e.g., `SECRET_KEY`)

### Frontend

- **Language**: TypeScript strict mode for type safety
- **Code Style**: ESLint configured for consistency
- **Naming Conventions**:
  - Components: PascalCase (e.g., `UserManagement.tsx`)
  - Utilities/Hooks: camelCase (e.g., `useApiNotifier.ts`)
  - Styles: Match component name with `.scss` extension

**Lint Check**:
```bash
npm run lint
```

## Environment Variables

### Backend (.env)
```env
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5433/pos_db

# JWT Configuration
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=POS System
```

## Project Structure Documentation

- **Backend Architecture**: See [backend/STRUCTURE.md](backend/STRUCTURE.md)
- **Frontend Architecture**: See [frontend/STRUCTURE.md](frontend/STRUCTURE.md)

## Contributing

### Git Workflow

1. Create a feature branch: `git checkout -b feature/feature-name`
2. Commit changes: `git commit -m "feat: description of changes"`
3. Push to repository: `git push origin feature/feature-name`
4. Create Pull Request for review

### Code Review Standards

- All code must pass linting checks
- Backend must follow layered architecture patterns
- Frontend components must be reusable and well-documented
- API changes must update OpenAPI documentation
- Database migrations must be tested locally before submission

## Troubleshooting

### Database Connection Issues

```bash
# Test PostgreSQL connection
psql -U postgres -h localhost -p 5433 -d pos_db

# Verify connection string in backend/.env
```

### CORS Errors

- Ensure `ALLOWED_ORIGINS` includes frontend URL in backend `.env`
- Check that CORS middleware is properly configured in `app/main.py`

### Port Already in Use

```bash
# Kill process on port 8000 (Backend)
lsof -i :8000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process on port 5173 (Frontend)
lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

## Performance Considerations

- **Frontend**: Vite's HMR enables instant module replacement during development
- **Backend**: SQLAlchemy session pooling reduces database connection overhead
- **Database**: PostgreSQL connection pooling configured for optimal concurrency
- **API Response**: Pagination implemented for large datasets

## Security Considerations

- JWT tokens expire after configured duration (default: 30 minutes)
- Passwords hashed using bcrypt with salt rounds
- CORS restricts requests to specified origins only
- SQL injection prevented via SQLAlchemy parameterized queries
- TypeScript type safety reduces runtime errors
- Environment variables keep sensitive data out of source control

## License

This project is part of the Point of Sale system initiative.

## Contact & Support

For issues, questions, or contributions, please refer to the project repository or contact the development team.

---

**Last Updated**: May 2, 2026
**Version**: 1.0.0