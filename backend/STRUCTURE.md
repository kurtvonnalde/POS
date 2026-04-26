# Backend Project Structure

This document describes the organized FastAPI project structure following best practices for scalability and maintainability.

## Directory Structure

```
backend/app/
├── __init__.py
├── main.py                  # FastAPI app initialization and route registration
├── database.py              # Database configuration and session management
├── base.py                  # SQLAlchemy declarative base
├── api/
│   ├── __init__.py
│   └── routes/              # API route endpoints
│       ├── __init__.py
│       ├── auth.py          # Authentication endpoints (register, login, verify)
│       ├── users.py         # User management endpoints
│       └── dashboard.py     # Dashboard endpoints by role
├── models/                  # SQLAlchemy ORM models
│   ├── __init__.py
│   └── user.py              # User model
├── schemas/                 # Pydantic request/response schemas
│   ├── __init__.py
│   └── user.py              # User schemas (UserCreate, UserLogin, UserResponse)
├── services/                # Business logic layer
│   ├── __init__.py
│   ├── auth_service.py      # Authentication service
│   └── user_service.py      # User service
├── utils/                   # Utility functions
│   ├── __init__.py
│   └── password.py          # Password hashing/verification functions
└── exceptions/              # Custom exceptions
    └── __init__.py          # AppException, UserAlreadyExists, InvalidCredentials, etc.
```

## Naming Conventions

- **Files**: Use snake_case for Python files (e.g., `auth_service.py`, `user_schema.py`)
- **Folders**: Use snake_case for Python folders (e.g., `/models`, `/schemas`)
- **Classes**: Use PascalCase (e.g., `User`, `AuthService`, `UserAlreadyExists`)
- **Functions**: Use snake_case (e.g., `register_user`, `get_all_users`)
- **Constants**: Use UPPER_CASE (e.g., `SECRET_KEY`, `ALGORITHM`)

## Layer Description

### Routes (`api/routes/`)
- Handles HTTP requests and responses
- Validates input using Pydantic schemas
- Delegates business logic to services
- Returns appropriate HTTP status codes and error responses

### Models (`models/`)
- SQLAlchemy ORM models
- Database table definitions
- One model per file for clarity

### Schemas (`schemas/`)
- Pydantic models for request/response validation
- Separate schemas from models for flexibility
- Request models (Create, Update, Login)
- Response models with database-friendly configuration

### Services (`services/`)
- Business logic layer
- Database operations (queries, inserts, updates)
- Complex validation and processing
- Raises custom exceptions for error handling

### Utils (`utils/`)
- Reusable utility functions
- Password hashing and verification
- Common helpers and formatters

### Exceptions (`exceptions/`)
- Custom exception classes
- Centralized error handling
- Extends from base `AppException`

## Import Patterns

```python
# Routes importing from services
from app.services import AuthService, UserService
from app.schemas import UserCreate, UserLogin
from app.models import User

# Services importing from models and utils
from app.models import User
from app.utils import hash_password, verify_password
from app.exceptions import UserAlreadyExists

# Main app importing routes
from app.api.routes import auth_router, users_router, dashboard_router
```

## Database Flow

```
Route → Dependency (get_db) → Service → Model → Database
```

Example:
1. HTTP POST request to `/auth/register` hits the route
2. Route validates input with `UserCreate` schema
3. Route calls `AuthService.register_user()`
4. Service queries `User` model to check if user exists
5. Service creates new `User` instance and commits to database
6. Route returns response with status 200 and user data

## Error Handling

Custom exceptions are used for cleaner error handling:

```python
try:
    user = AuthService.register_user(user_data, db)
except UserAlreadyExists as e:
    raise HTTPException(status_code=e.status_code, detail=e.message)
except InvalidCredentials as e:
    raise HTTPException(status_code=e.status_code, detail=e.message)
```

## Best Practices

1. **Separation of Concerns**: Routes handle HTTP, services handle logic, models handle data
2. **DRY (Don't Repeat Yourself)**: Common operations in services or utils
3. **Error Handling**: Use custom exceptions for application-specific errors
4. **Type Hints**: Use Python type hints for better code clarity
5. **Dependency Injection**: Use FastAPI's `Depends()` for database sessions
6. **Validation**: Use Pydantic schemas for input validation
7. **Security**: Hash passwords, validate tokens, use CORS appropriately
8. **Logging**: Add logging for debugging and monitoring (future addition)

## Future Additions

- **middleware/**: Custom middleware for authentication, logging, etc.
- **config.py**: Configuration management (environment variables, settings)
- **tests/**: Unit and integration tests
- **migrations/**: Database migrations using Alembic
- **events/**: Background tasks and event handlers
