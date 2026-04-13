# Quick Start - REST API Testing Guide

## Prerequisites

```bash
# Install packages
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create sample data
python manage.py create_sample_data

# Start server
python manage.py runserver
```

Server will run on: `http://localhost:8000`

---

## Quick Test Commands

### 1. Register a New User

```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_coordinator",
    "email": "coordinator@test.com",
    "first_name": "Test",
    "last_name": "Coordinator",
    "password": "TestPass123!",
    "password2": "TestPass123!",
    "profile": {
      "title": "Mr",
      "institute": "Test University",
      "department": "computer engineering",
      "phone_number": "9876543210",
      "position": "coordinator",
      "state": "IN-MH"
    }
  }'
```

### 2. Register Instructor

```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_instructor",
    "email": "instructor@test.com",
    "first_name": "Test",
    "last_name": "Instructor",
    "password": "TestPass123!",
    "password2": "TestPass123!",
    "profile": {
      "title": "Dr",
      "institute": "Test University",
      "department": "computer engineering",
      "phone_number": "9876543211",
      "position": "instructor",
      "state": "IN-MH"
    }
  }'
```

### 3. List Workshop Types

```bash
curl -X GET http://localhost:8000/api/workshop-types/
```

### 4. Login

```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_coordinator",
    "password": "TestPass123!"
  }'
```

**Save the `access` token from response**

### 5. Get User Profile (Authenticated)

```bash
curl -X GET http://localhost:8000/api/profile/me/ \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

### 6. Propose a Workshop (Coordinator)

```bash
curl -X POST http://localhost:8000/api/workshops/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <COORDINATOR_TOKEN>" \
  -d '{
    "workshop_type": 1,
    "date": "2024-05-20",
    "tnc_accepted": true
  }'
```

### 7. Accept Workshop (Instructor)

First login as instructor and get their token, then:

```bash
curl -X POST http://localhost:8000/api/workshops/1/accept/ \
  -H "Authorization: Bearer <INSTRUCTOR_TOKEN>"
```

### 8. Get Workshop Details

```bash
curl -X GET http://localhost:8000/api/workshops/1/ \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

### 9. Post Comment on Workshop

```bash
curl -X POST http://localhost:8000/api/workshops/1/comments/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{
    "comment": "Great workshop!",
    "public": true
  }'
```

### 10. Get Public Statistics

```bash
curl -X GET http://localhost:8000/api/statistics/public/
```

### 11. Get Team Statistics (Instructor)

```bash
curl -X GET http://localhost:8000/api/statistics/team/ \
  -H "Authorization: Bearer <INSTRUCTOR_TOKEN>"
```

### 12. Change Workshop Date

```bash
curl -X POST http://localhost:8000/api/workshops/1/change-date/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <COORDINATOR_TOKEN>" \
  -d '{
    "new_date": "2024-05-25"
  }'
```

---

## Testing with Postman

### 1. Set Base URL
- `Base URL: http://localhost:8000/api`

### 2. Create Environment Variables
```
{
  "base_url": "http://localhost:8000/api",
  "access_token": "",
  "refresh_token": ""
}
```

### 3. Register Collection
Create requests:
- POST /auth/register/
- POST /auth/login/
- GET /profile/me/
- GET /workshop-types/
- POST /workshops/
- etc.

### 4. After Login
- Copy `access` token from response
- Set `{{access_token}}` in environment
- Use in Authorization header: `Bearer {{access_token}}`

---

## Python Testing Script

```python
import requests
import json

BASE_URL = "http://localhost:8000/api"

# 1. Register
print("1. Registering user...")
register_data = {
    "username": "test_user",
    "email": "test@example.com",
    "first_name": "Test",
    "last_name": "User",
    "password": "TestPass123!",
    "password2": "TestPass123!",
    "profile": {
        "title": "Mr",
        "institute": "Test University",
        "department": "computer engineering",
        "phone_number": "9876543210",
        "position": "coordinator",
        "state": "IN-MH"
    }
}
r = requests.post(f"{BASE_URL}/auth/register/", json=register_data)
print(f"Status: {r.status_code}")
print(f"Response: {json.dumps(r.json(), indent=2)}\n")

# 2. Login
print("2. Logging in...")
login_data = {
    "username": "test_user",
    "password": "TestPass123!"
}
r = requests.post(f"{BASE_URL}/auth/login/", json=login_data)
print(f"Status: {r.status_code}")
response = r.json()
print(f"Response: {json.dumps(response, indent=2)}\n")

access_token = response['access']
refresh_token = response['refresh']
headers = {"Authorization": f"Bearer {access_token}"}

# 3. Get Profile
print("3. Getting profile...")
r = requests.get(f"{BASE_URL}/profile/me/", headers=headers)
print(f"Status: {r.status_code}")
print(f"Response: {json.dumps(r.json(), indent=2)}\n")

# 4. List Workshops
print("4. Listing workshops...")
r = requests.get(f"{BASE_URL}/workshops/", headers=headers)
print(f"Status: {r.status_code}")
print(f"Response: {json.dumps(r.json(), indent=2)}\n")

# 5. List Workshop Types
print("5. Listing workshop types...")
r = requests.get(f"{BASE_URL}/workshop-types/")
print(f"Status: {r.status_code}")
print(f"Response: {json.dumps(r.json()[:2], indent=2)}")
print(f"... (showing first 2 out of {len(r.json())} types)\n")
```

---

## Common Issues & Solutions

### Issue: CORS Error
**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution:**
```python
# In settings.py, verify:
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Your frontend
    "http://127.0.0.1:5173",
]
CORS_ALLOW_CREDENTIALS = True
```

### Issue: Token Expired
**Error:** `401 Unauthorized`

**Solution:**
```bash
# Use refresh endpoint
curl -X POST http://localhost:8000/api/auth/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{"refresh": "<refresh_token>"}'
```

### Issue: Permission Denied
**Error:** `403 Forbidden`

**Solution:**
- Only instructors can create workshop types
- Only coordinators can propose workshops
- Only instructors can accept workshops

### Issue: Invalid Email on Registration
**Error:** `Email already registered`

**Solution:**
- Use a unique email address
- Or activate the existing account

### Issue: Email Not Sending
**Note:** In development, emails are printed to console

**To send real emails:**
```python
# In local_settings.py:
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'your-email@gmail.com'
EMAIL_HOST_PASSWORD = 'your-app-password'
EMAIL_USE_TLS = True
```

---

## API Response Examples

### Success Response (200 OK)
```json
{
  "id": 1,
  "username": "test_user",
  "email": "test@example.com",
  "first_name": "Test",
  "last_name": "User",
  "profile": { ... }
}
```

### Error Response (400 Bad Request)
```json
{
  "email": ["Email already registered."],
  "username": ["Username already taken."]
}
```

### Error Response (401 Unauthorized)
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### Error Response (403 Forbidden)
```json
{
  "error": "Only instructors can accept workshops."
}
```

### Error Response (404 Not Found)
```json
{
  "detail": "Not found."
}
```

---

## Frontend Integration

The React frontend is already set up to work with this API:

```javascript
// In frontend, make authenticated requests:
import client from '@/api/client'

// Get workshops
const response = await client.get('/workshops/')

// Create workshop (auto-adds auth token)
const response = await client.post('/workshops/', {
  workshop_type: 1,
  date: '2024-05-20',
  tnc_accepted: true
})
```

---

## Useful Commands

### View All API URLs
```bash
python manage.py show_urls | grep api
```

### View SQL Queries (Debug Mode)
```python
from django.db import connection
connection.queries  # Shows all SQL queries
```

### Create Superuser
```bash
python manage.py createsuperuser
# Then access admin at: http://localhost:8000/admin
```

### Reset Database
```bash
python manage.py flush  # Clears all data
python manage.py migrate  # Recreates tables
python manage.py create_sample_data  # Creates sample data
```

---

## Performance Optimization

### Use Pagination
```bash
curl -X GET "http://localhost:8000/api/workshops/?page=1"
```

### Filter Results
```bash
# By status
curl -X GET "http://localhost:8000/api/workshops/?status=1"

# By date range
curl -X GET "http://localhost:8000/api/workshops/?date_from=2024-04-20&date_to=2024-05-20"
```

### Cache Responses
Frontend automatically caches with React Query.

---

## Deployment Checklist

Before going to production:

- [ ] Set `DEBUG = False` in settings
- [ ] Change `SECRET_KEY`
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Set up proper email backend
- [ ] Enable HTTPS/SSL
- [ ] Configure `CORS_ALLOWED_ORIGINS` for production domain
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Set up database backups
- [ ] Configure logging
- [ ] Test all endpoints thoroughly

---

## Reference

**API Documentation:** [API_SETUP_GUIDE.md](API_SETUP_GUIDE.md)
**Full Checklist:** [REST_API_CHECKLIST.md](REST_API_CHECKLIST.md)
**Frontend Guide:** [frontend/README.md](frontend/README.md)
**Full Stack Guide:** [FULLSTACK_SETUP.md](FULLSTACK_SETUP.md)

---

**Last Updated:** April 12, 2026
