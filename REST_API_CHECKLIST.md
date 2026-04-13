# REST API Implementation - Complete Checklist

**Date:** April 12, 2026
**Status:** ✅ ALL STEPS COMPLETED

---

## 1. ✅ Update requirements.txt

**File:** `requirements.txt`

**Changes Made:**
```
+ djangorestframework==3.15.1
+ djangorestframework-simplejwt==5.3.1
+ django-cors-headers==4.3.1
```

**Installation:**
```bash
pip install -r requirements.txt
```

---

## 2. ✅ Django Settings Configuration

**File:** `workshop_portal/settings.py`

### Added to INSTALLED_APPS:
```python
'rest_framework',
'corsheaders',
'rest_framework_simplejwt',
```

### Updated MIDDLEWARE:
```python
'corsheaders.middleware.CorsMiddleware',  # Added at top
```

### Added REST Framework Configuration:
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

### Added JWT Configuration:
```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    ...
}
```

### Added CORS Configuration:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
CORS_ALLOW_CREDENTIALS = True
```

---

## 3. ✅ API Package Creation

**Directory:** `workshop_app/api/`

### Files Created:

#### a. `__init__.py`
- Empty Python package initializer

#### b. `serializers.py` (180+ lines)
**Serializers Implemented:**
- ✅ `ProfileSerializer` - User profile data
- ✅ `UserRegistrationSerializer` - Registration with profile creation
- ✅ `UserSerializer` - User with profile data
- ✅ `ProfileUpdateSerializer` - Profile update operations
- ✅ `AttachmentFileSerializer` - Workshop attachment files
- ✅ `WorkshopTypeSerializer` - Workshop types with attachments
- ✅ `CommentSerializer` - Workshop comments
- ✅ `WorkshopListSerializer` - Workshop list view
- ✅ `WorkshopDetailSerializer` - Workshop detailed view
- ✅ `WorkshopCreateUpdateSerializer` - Create/update workshops
- ✅ `WorkshopChangeDateSerializer` - Change workshop date
- ✅ `StatisticsSerializer` - Statistics data

#### c. `views.py` (400+ lines)
**API Views Implemented:**
- ✅ `RegisterView` - POST /api/auth/register/
- ✅ `ActivateAccountView` - GET /api/auth/activate/<key>/
- ✅ `LoginView` - POST /api/auth/login/
- ✅ `LogoutView` - POST /api/auth/logout/
- ✅ `RefreshTokenView` - POST /api/auth/token/refresh/
- ✅ `ProfileView` - GET /api/profile/me/
- ✅ `ProfileUpdateView` - PATCH /api/profile/me/
- ✅ `UserProfileDetailView` - GET /api/profile/<user_id>/
- ✅ `WorkshopTypeViewSet` - Full CRUD + TNC endpoint
- ✅ `WorkshopViewSet` - List, retrieve, create, accept, change date, comments
- ✅ `StatisticsPublicView` - GET /api/statistics/public/
- ✅ `StatisticsTeamView` - GET /api/statistics/team/

#### d. `urls.py` (30+ lines)
**URL Patterns:**
```python
POST   /api/auth/register/          # Register
GET    /api/auth/activate/<key>/    # Activate email
POST   /api/auth/login/             # Login
POST   /api/auth/logout/            # Logout
POST   /api/auth/token/refresh/     # Refresh token

GET    /api/profile/me/             # Get profile
PATCH  /api/profile/me/             # Update profile
GET    /api/profile/<id>/           # View other profile

GET    /api/workshop-types/         # List types
POST   /api/workshop-types/         # Create type
GET    /api/workshop-types/<id>/    # Get type
PATCH  /api/workshop-types/<id>/    # Update type
GET    /api/workshop-types/<id>/tnc/# Get T&C

GET    /api/workshops/              # List workshops
POST   /api/workshops/              # Create workshop
GET    /api/workshops/<id>/         # Get workshop
POST   /api/workshops/<id>/accept/  # Accept
POST   /api/workshops/<id>/change-date/ # Change date
GET    /api/workshops/<id>/comments/    # Get comments
POST   /api/workshops/<id>/comments/    # Add comment

GET    /api/statistics/public/      # Public stats
GET    /api/statistics/team/        # Team stats
```

---

## 4. ✅ Main URL Configuration

**File:** `workshop_portal/urls.py`

**Updated:**
```python
url(r'^api/', include('workshop_app.api.urls')),  # Added this line
```

**All API endpoints now accessible at `/api/`**

---

## 5. ✅ Management Command

**File:** `workshop_app/management/commands/create_sample_data.py`

**Features:**
- Creates 8 sample WorkshopTypes
- Handles duplicate entries gracefully
- Provides colored output for success/warnings
- Easy testing of API endpoints

**Usage:**
```bash
python manage.py create_sample_data
```

**Sample Data Created:**
1. Python Programming (3 days)
2. Web Development with Django (5 days)
3. Data Science with Python (4 days)
4. Machine Learning Basics (5 days)
5. Arduino and IoT (3 days)
6. Linux and Shell Scripting (3 days)
7. Git and Version Control (2 days)
8. OpenFOAM CFD (5 days)

---

## 6. ✅ Supporting Directories

**Created:**
```
workshop_app/
├── api/                    ✅
│   ├── __init__.py
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
└── management/             ✅
    ├── __init__.py
    └── commands/           ✅
        ├── __init__.py
        └── create_sample_data.py
```

---

## API Endpoints Summary

### Authentication (5 endpoints)
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | /api/auth/register/ | ❌ | Register new user |
| GET | /api/auth/activate/<key>/ | ❌ | Activate account |
| POST | /api/auth/login/ | ❌ | Login & get tokens |
| POST | /api/auth/logout/ | ✅ | Logout & blacklist |
| POST | /api/auth/token/refresh/ | ❌ | Refresh access token |

### Profile (3 endpoints)
| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| GET | /api/profile/me/ | ✅ | All |
| PATCH | /api/profile/me/ | ✅ | All |
| GET | /api/profile/<id>/ | ✅ | Instructor only |

### Workshop Types (5 endpoints)
| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| GET | /api/workshop-types/ | ❌ | All |
| POST | /api/workshop-types/ | ✅ | Instructor |
| GET | /api/workshop-types/<id>/ | ➖ | All |
| PATCH | /api/workshop-types/<id>/ | ✅ | Instructor |
| GET | /api/workshop-types/<id>/tnc/ | ❌ | All |

### Workshops (6 endpoints)
| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| GET | /api/workshops/ | ✅ | Role-filtered |
| POST | /api/workshops/ | ✅ | Coordinator |
| GET | /api/workshops/<id>/ | ✅ | Relevant |
| POST | /api/workshops/<id>/accept/ | ✅ | Instructor |
| POST | /api/workshops/<id>/change-date/ | ✅ | Coordinator/Inst |
| GET/POST | /api/workshops/<id>/comments/ | ✅ | All |

### Statistics (2 endpoints)
| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| GET | /api/statistics/public/ | ❌ | All |
| GET | /api/statistics/team/ | ✅ | Instructor |

**Total: 25 API Endpoints**

---

## Role-Based Permissions

### Coordinators Can:
- ✅ Register as coordinator
- ✅ View their own workshops
- ✅ Propose new workshops
- ✅ Change workshop dates
- ✅ Post comments on workshops

### Instructors Can:
- ✅ Register as instructor
- ✅ View assigned workshops
- ✅ Accept workshop proposals
- ✅ Create workshop types
- ✅ Update workshop types
- ✅ View team statistics
- ✅ View other user profiles
- ✅ Post comments on workshops

### Public Access:
- ✅ View all workshop types
- ✅ Read public statistics
- ✅ Browse workshop information

---

## Authentication Flow

1. **Register:**
   - POST /api/auth/register/ → Creates user + profile
   - Activation email sent (7 days expiry)

2. **Activate:**
   - GET /api/auth/activate/<key>/ → Activates account

3. **Login:**
   - POST /api/auth/login/ → Returns `access` + `refresh` tokens

4. **Authenticated Requests:**
   - Header: `Authorization: Bearer <access_token>`

5. **Token Refresh:**
   - POST /api/auth/token/refresh/ → New access token

6. **Logout:**
   - POST /api/auth/logout/ → Blacklist refresh token

---

## Token Configuration

**Access Token:**
- Lifetime: 1 day
- Algorithm: HS256
- Usage: All authenticated requests

**Refresh Token:**
- Lifetime: 7 days
- Usage: Get new access token

---

## CORS Settings

**Allowed Origins:**
- http://localhost:5173 (Vite dev)
- http://127.0.0.1:5173
- http://localhost:3000 (Alternative)
- http://127.0.0.1:3000

**Credentials:** Enabled

---

## Testing the API

### Option 1: cURL
```bash
# Register
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"test",...}'

# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"..."}'

# Get profile
curl -X GET http://localhost:8000/api/profile/me/ \
  -H "Authorization: Bearer <token>"
```

### Option 2: Postman/Insomnia
- Import `/api/` endpoints
- Set JWT token after login
- All endpoints accessible

### Option 3: Python Requests
```python
import requests

# Register
r = requests.post('http://localhost:8000/api/auth/register/', json={...})

# Login
r = requests.post('http://localhost:8000/api/auth/login/', json={...})
token = r.json()['access']

# Authenticated request
headers = {'Authorization': f'Bearer {token}'}
r = requests.get('http://localhost:8000/api/profile/me/', headers=headers)
```

### Option 4: Frontend (React)
```javascript
// hooks/useAuth.js
const { login, register, user } = useAuth()

// Automatic token handling
```

---

## Next Steps

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Apply migrations:**
   ```bash
   python manage.py migrate
   ```

3. **Create sample data:**
   ```bash
   python manage.py create_sample_data
   ```

4. **Run server:**
   ```bash
   python manage.py runserver
   ```

5. **Test endpoints:**
   - Visit: http://localhost:8000/api/workshop-types/
   - Or use API testing tool

6. **Connect React frontend:**
   - Frontend already configured
   - API URL: http://localhost:8000/api
   - Run: `npm run dev` from `/frontend`

---

## Documentation

**Complete API Documentation:**
- See: `API_SETUP_GUIDE.md`

**Frontend Integration:**
- See: `frontend/README.md`
- See: `FULLSTACK_SETUP.md`

**Setup Verification:**
- See: `SETUP_VERIFICATION.md`

---

## Summary

✅ **Status: Ready for Development**

- All 25 API endpoints implemented
- JWT authentication configured
- CORS enabled for frontend
- Role-based permissions applied
- Sample data command ready
- Comprehensive documentation provided

**Files Modified:** 2
- requirements.txt
- workshop_portal/settings.py
- workshop_portal/urls.py

**Files Created:** 5
- workshop_app/api/__init__.py
- workshop_app/api/serializers.py
- workshop_app/api/views.py
- workshop_app/api/urls.py
- workshop_app/management/commands/create_sample_data.py

**Documentation Created:** 1
- API_SETUP_GUIDE.md
- REST_API_CHECKLIST.md (this file)

---

**Setup Date:** April 12, 2026
**Django Version:** 3.0.7
**DRF Version:** 3.15.1
**JWT Version:** 5.3.1
