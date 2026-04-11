# Django REST API Setup Guide

## Overview

This guide explains how to set up and use the new REST API for the FOSSEE Workshop Booking application. The API is built with Django REST Framework and provides JWT-based authentication.

## Installation

### 1. Install Required Packages

```bash
pip install -r requirements.txt
```

This will install:
- `djangorestframework==3.15.1`
- `djangorestframework-simplejwt==5.3.1`
- `django-cors-headers==4.3.1`

### 2. Run Migrations

```bash
python manage.py migrate
```

### 3. Create Sample Workshop Types (Optional)

```bash
python manage.py create_sample_data
```

This creates 8 sample workshop types for testing.

### 4. Start Django Server

```bash
python manage.py runserver
```

Backend will be available at `http://localhost:8000/api/`

---

## Configuration

The following configurations have been added to `workshop_portal/settings.py`:

### INSTALLED_APPS
```python
'rest_framework',
'corsheaders',
'rest_framework_simplejwt',
```

### MIDDLEWARE
```python
'corsheaders.middleware.CorsMiddleware',  # Added at the top
```

### REST_FRAMEWORK Settings
```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}
```

### JWT Token Settings
- Access Token Lifetime: 1 day
- Refresh Token Lifetime: 7 days
- Algorithm: HS256

### CORS Configuration
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",   # Vite dev server
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

---

## API Endpoints

### Authentication Endpoints

#### 1. User Registration
```
POST /api/auth/register/
Content-Type: application/json

{
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "password": "securepassword123",
    "password2": "securepassword123",
    "profile": {
        "title": "Mr",
        "institute": "IIT Bombay",
        "department": "computer engineering",
        "phone_number": "9876543210",
        "position": "coordinator",
        "state": "IN-MH"
    }
}

Response (201 Created):
{
    "message": "Registration successful. Activation email sent.",
    "user": {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com",
        "username": "john_doe",
        "profile": {
            "id": 1,
            "title": "Mr",
            "institute": "IIT Bombay",
            ...
        }
    }
}
```

#### 2. Activate Account
```
GET /api/auth/activate/<activation_key>/

Response (200 OK):
{
    "message": "Account activated successfully. You can now login."
}
```

#### 3. User Login
```
POST /api/auth/login/
Content-Type: application/json

{
    "username": "john_doe",
    "password": "securepassword123"
}

Response (200 OK):
{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "user": {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com",
        "username": "john_doe"
    }
}
```

#### 4. Refresh Access Token
```
POST /api/auth/token/refresh/
Content-Type: application/json

{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}

Response (200 OK):
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### 5. User Logout
```
POST /api/auth/logout/
Authorization: Bearer <access_token>
Content-Type: application/json

{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}

Response (200 OK):
{
    "message": "Logout successful."
}
```

### Profile Endpoints

#### 1. Get Current User Profile
```
GET /api/profile/me/
Authorization: Bearer <access_token>

Response (200 OK):
{
    "user": {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com"
    },
    "profile": {
        "id": 1,
        "title": "Mr",
        "institute": "IIT Bombay",
        "department": "computer engineering",
        "phone_number": "9876543210",
        "position": "coordinator",
        "state": "IN-MH",
        "is_email_verified": true
    }
}
```

#### 2. Update Current User Profile
```
PATCH /api/profile/me/
Authorization: Bearer <access_token>
Content-Type: application/json

{
    "phone_number": "9876543211",
    "location": "Mumbai",
    "institute": "IIT Bombay"
}

Response (200 OK):
{
    "message": "Profile updated successfully.",
    "profile": { ... }
}
```

#### 3. Get User Profile (Instructors Only)
```
GET /api/profile/<user_id>/
Authorization: Bearer <access_token>

Response (200 OK):
{
    "user": { ... }
}
```

### Workshop Type Endpoints

#### 1. List All Workshop Types
```
GET /api/workshop-types/

Response (200 OK):
[
    {
        "id": 1,
        "name": "Python Programming",
        "description": "Learn Python programming...",
        "duration": 3,
        "terms_and_conditions": "Participants must have...",
        "attachments": [
            {
                "id": 1,
                "attachments": ".../Python_Programming/schedule.pdf"
            }
        ]
    },
    ...
]
```

#### 2. Create Workshop Type (Instructor Only)
```
POST /api/workshop-types/
Authorization: Bearer <access_token>
Content-Type: application/json

{
    "name": "Advanced Python",
    "description": "Advanced Python programming concepts",
    "duration": 5,
    "terms_and_conditions": "Requires Python basics..."
}

Response (201 Created):
{ ... }
```

#### 3. Get Workshop Type Details
```
GET /api/workshop-types/<id>/

Response (200 OK):
{ ... }
```

#### 4. Update Workshop Type (Instructor Only)
```
PATCH /api/workshop-types/<id>/
Authorization: Bearer <access_token>
Content-Type: application/json

{
    "description": "Updated description...",
    "duration": 4
}

Response (200 OK):
{ ... }
```

#### 5. Get Terms and Conditions
```
GET /api/workshop-types/<id>/tnc/

Response (200 OK):
{
    "id": 1,
    "name": "Python Programming",
    "terms_and_conditions": "Participants must have basic computer knowledge..."
}
```

### Workshop Endpoints

#### 1. List Workshops
```
GET /api/workshops/ [?status=1&date_from=2024-04-20&date_to=2024-05-20]
Authorization: Bearer <access_token>

Response (200 OK):
[
    {
        "id": 1,
        "uid": "550e8400-e29b-41d4-a716-446655440000",
        "coordinator": 1,
        "coordinator_name": "John Doe",
        "instructor": 2,
        "instructor_name": "Jane Smith",
        "workshop_type": 1,
        "workshop_type_name": "Python Programming",
        "date": "2024-04-20",
        "status": 1,
        "status_display": "Accepted",
        "tnc_accepted": true
    }
]
```

#### 2. Create Workshop Proposal (Coordinator Only)
```
POST /api/workshops/
Authorization: Bearer <access_token>
Content-Type: application/json

{
    "workshop_type": 1,
    "date": "2024-04-20",
    "tnc_accepted": true
}

Response (201 Created):
{ ... }
```

#### 3. Get Workshop Details
```
GET /api/workshops/<id>/
Authorization: Bearer <access_token>

Response (200 OK):
{
    "id": 1,
    "uid": "550e8400-e29b-41d4-a716-446655440000",
    "coordinator": { ... },
    "instructor": { ... },
    "workshop_type": { ... },
    "date": "2024-04-20",
    "status": 1,
    "status_display": "Accepted",
    "tnc_accepted": true,
    "comments": [ ... ]
}
```

#### 4. Accept Workshop (Instructor Only)
```
POST /api/workshops/<id>/accept/
Authorization: Bearer <access_token>

Response (200 OK):
{
    "message": "Workshop accepted successfully.",
    "workshop": { ... }
}
```

#### 5. Change Workshop Date
```
POST /api/workshops/<id>/change-date/
Authorization: Bearer <access_token>
Content-Type: application/json

{
    "new_date": "2024-04-25"
}

Response (200 OK):
{
    "message": "Workshop date changed successfully.",
    "workshop": { ... }
}
```

#### 6. Get Workshop Comments
```
GET /api/workshops/<id>/comments/
Authorization: Bearer <access_token>

Response (200 OK):
[
    {
        "id": 1,
        "author": 1,
        "author_name": "John Doe",
        "author_email": "john@example.com",
        "comment": "Great workshop!",
        "public": true,
        "created_date": "2024-04-20T10:30:00Z"
    }
]
```

#### 7. Post Workshop Comment
```
POST /api/workshops/<id>/comments/
Authorization: Bearer <access_token>
Content-Type: application/json

{
    "comment": "Excellent workshop!",
    "public": true
}

Response (201 Created):
{
    "message": "Comment posted successfully.",
    "comment": { ... }
}
```

### Statistics Endpoints

#### 1. Public Statistics
```
GET /api/statistics/public/

Response (200 OK):
{
    "total_workshops": 25,
    "accepted_workshops": 25,
    "pending_workshops": 5,
    "states_count": 15,
    "types_count": 8
}
```

#### 2. Team Statistics (Instructor Only)
```
GET /api/statistics/team/
Authorization: Bearer <access_token>

Response (200 OK):
{
    "total_workshops": 10,
    "accepted_workshops": 8,
    "pending_workshops": 1,
    "deleted_workshops": 1
}
```

---

## Authentication

All endpoints (except public ones) require JWT authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Role-Based Access Control

**Coordinators:**
- View their own workshop proposals
- Propose new workshops
- Change workshop dates (if they're the coordinator)

**Instructors:**
- View workshops assigned to them
- Accept workshop proposals
- Create workshop types
- Update workshop types
- View team statistics
- View other user profiles

---

## Testing with cURL

### Register User
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "first_name": "Test",
    "last_name": "User",
    "password": "password123",
    "password2": "password123",
    "profile": {
      "title": "Mr",
      "institute": "Test Institute",
      "department": "computer engineering",
      "phone_number": "9876543210",
      "position": "coordinator",
      "state": "IN-MH"
    }
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

### Get Profile (with token)
```bash
curl -X GET http://localhost:8000/api/profile/me/ \
  -H "Authorization: Bearer <access_token>"
```

---

## Connecting with React Frontend

The React frontend in `/frontend` is already configured to communicate with this API:

1. API base URL: `http://localhost:8000/api`
2. Custom hooks handle authentication and data fetching
3. JWT tokens are automatically managed

### Frontend Setup
```bash
cd frontend
npm run dev
```

Then use the API hooks in React components:
```javascript
import { useAuth } from '@/hooks/useAuth'
const { login, register, user } = useAuth()
```

---

## Common HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Permission denied
- `404 Not Found` - Resource not found
- `500 Server Error` - Server-side error

---

## Troubleshooting

### CORS Error
Ensure `django-cors-headers` is installed and `CorsMiddleware` is in MIDDLEWARE.

### JWT Token Invalid
- Make sure the token hasn't expired (access token: 1 day)
- Use the refresh token to get a new access token
- Check that token is correctly formatted in Authorization header

### Email Not Sending
- Check `EMAIL_BACKEND` in settings (currently set to console)
- Configure real email settings in `local_settings.py`

---

## Security Notes

⚠️ **Production Deployment:**
- Change `SECRET_KEY` in settings
- Set `DEBUG = False`
- Use HTTPS/SSL
- Configure allowed hosts
- Use environment variables for sensitive data
- Implement rate limiting
- Add request validation
- Enable CSRF protection

---

## File Structure

```
workshop_app/
├── api/
│   ├── __init__.py
│   ├── serializers.py      # API serializers
│   ├── views.py            # API views
│   └── urls.py             # API URL patterns
├── management/
│   ├── __init__.py
│   └── commands/
│       ├── __init__.py
│       └── create_sample_data.py  # Management command
└── models.py               # Django models
```

---

**Documentation Updated:** April 12, 2026
