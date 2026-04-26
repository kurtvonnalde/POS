# Exceptions __init__.py
class AppException(Exception):
    """Base exception for the application"""
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

class UserAlreadyExists(AppException):
    """Exception raised when user already exists"""
    def __init__(self):
        super().__init__("Username already registered", 400)

class InvalidCredentials(AppException):
    """Exception raised when credentials are invalid"""
    def __init__(self):
        super().__init__("Invalid credentials", 401)

class TokenInvalid(AppException):
    """Exception raised when token is invalid"""
    def __init__(self):
        super().__init__("Invalid token", 401)

class UnauthorizedError(AppException):
    """Exception raised when user is not authorized"""
    def __init__(self):
        super().__init__("Not authorized", 403)
