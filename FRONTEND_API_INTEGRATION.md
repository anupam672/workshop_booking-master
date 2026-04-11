# Frontend-Backend Integration Guide

## Overview

This guide explains how the React frontend connects to the Django REST API backend.

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│  React Frontend (localhost:5173)                │
├─────────────────────────────────────────────────┤
│  ├─ App.jsx (Router)                            │
│  ├─ useAuth() hook → Zustand auth store         │
│  ├─ useWorkshops() hook → React Query           │
│  └─ API Client → Axios with JWT interceptors   │
└────────────────┬────────────────────────────────┘
                 │ HTTP Requests + JWT Token
                 ▼
┌─────────────────────────────────────────────────┐
│  Django Backend (localhost:8000)                │
├─────────────────────────────────────────────────┤
│  ├─ workshop_app/api/ (REST endpoints)          │
│  ├─ Authentication (JWT + Simple JWT)           │
│  ├─ Permissions (Role-based)                    │
│  └─ Database (SQLite/PostgreSQL)                │
└─────────────────────────────────────────────────┘
```

---

## Frontend Implementation

### 1. API Client Setup

**File:** `frontend/src/api/client.js`

```javascript
import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

// Create axios instance with base URL
const client = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add JWT token
client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor - Handle 401 and refresh token
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, try to refresh
      const refreshToken = useAuthStore.getState().refreshToken
      if (refreshToken) {
        try {
          const { data } = await axios.post(
            'http://localhost:8000/api/auth/token/refresh/',
            { refresh: refreshToken }
          )
          useAuthStore.getState().setAccessToken(data.access)
          // Retry original request
          return client(error.config)
        } catch {
          useAuthStore.getState().logout()
        }
      } else {
        useAuthStore.getState().logout()
      }
    }
    return Promise.reject(error)
  }
)

export default client
```

### 2. Authentication Store

**File:** `frontend/src/store/authStore.js`

```javascript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      // Actions
      setTokens: (access, refresh) =>
        set({
          accessToken: access,
          refreshToken: refresh,
          isAuthenticated: true,
        }),

      setAccessToken: (token) =>
        set({ accessToken: token }),

      setUser: (user) =>
        set({ user, isAuthenticated: true }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
```

### 3. Authentication Hook

**File:** `frontend/src/hooks/useAuth.js`

```javascript
import { useMutation } from '@tanstack/react-query'
import client from '@/api/client'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

export const useAuth = () => {
  const { setTokens, setUser, logout } = useAuthStore()

  const registerMutation = useMutation({
    mutationFn: async (data) => {
      const response = await client.post('/auth/register/', data)
      return response.data
    },
    onSuccess: () => {
      toast.success('Registration successful! Check your email.')
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Registration failed')
    },
  })

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }) => {
      const response = await client.post('/auth/login/', { username, password })
      return response.data
    },
    onSuccess: (data) => {
      setTokens(data.access, data.refresh)
      setUser(data.user)
      toast.success('Login successful!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Login failed')
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await client.post('/auth/logout/')
    },
    onSuccess: () => {
      logout()
      toast.success('Logged out')
    },
  })

  return {
    registerMutation,
    loginMutation,
    logoutMutation,
  }
}
```

### 4. Workshops Hook

**File:** `frontend/src/hooks/useWorkshops.js`

```javascript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import client from '@/api/client'
import toast from 'react-hot-toast'

export const useWorkshops = () => {
  const queryClient = useQueryClient()

  // Get workshops
  const workshopsQuery = useQuery({
    queryKey: ['workshops'],
    queryFn: async () => {
      const { data } = await client.get('/workshops/')
      return data
    },
    onError: (error) => {
      toast.error('Failed to load workshops')
    },
  })

  // Get workshop details
  const workshopQuery = (id) =>
    useQuery({
      queryKey: ['workshop', id],
      queryFn: async () => {
        const { data } = await client.get(`/workshops/${id}/`)
        return data
      },
    })

  // Create workshop
  const createWorkshopMutation = useMutation({
    mutationFn: async (data) => {
      const response = await client.post('/workshops/', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workshops'] })
      toast.success('Workshop proposed successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to create workshop')
    },
  })

  // Accept workshop
  const acceptWorkshopMutation = useMutation({
    mutationFn: async (id) => {
      const response = await client.post(`/workshops/${id}/accept/`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workshops'] })
      toast.success('Workshop accepted!')
    },
    onError: (error) => {
      toast.error('Failed to accept workshop')
    },
  })

  return {
    workshopsQuery,
    workshopQuery,
    createWorkshopMutation,
    acceptWorkshopMutation,
  }
}
```

### 5. Protected Route Example

**File:** `frontend/src/components/ProtectedRoute.jsx`

```javascript
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export function ProtectedRoute({ children, requiredRole = null }) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user?.profile?.position !== requiredRole) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}
```

---

## Data Flow Examples

### User Registration Flow

```
1. User submits registration form
   ├─ frontend/src/pages/Register.jsx
   └─ collects: username, email, password, profile data

2. useAuth().registerMutation.mutate(data)
   ├─ frontend/src/api/client.js
   └─ POST /api/auth/register/

3. Backend processes
   ├─ workshop_app/api/views.py → RegisterView
   ├─ Creates User + Profile
   ├─ Generates activation key
   ├─ Sends activation email
   └─ Returns 201 Created

4. Frontend shows success
   ├─ toast.success('Registration successful!')
   └─ Redirect to login page
```

### Workshop Proposal Flow

```
1. Coordinator fills workshop form
   ├─ workshop_type: (select from list)
   ├─ date: (future date only)
   └─ tnc_accepted: true

2. useWorkshops().createWorkshopMutation.mutate(data)
   ├─ frontend/src/api/client.js
   └─ POST /api/workshops/
      └─ Includes JWT token

3. Backend verifies
   ├─ workshop_app/api/views.py → WorkshopViewSet.create()
   ├─ Check: User is coordinator
   ├─ Check: Date is in future
   ├─ Creates Workshop record
   └─ Returns 201 Created

4. Frontend updates
   ├─ queryClient.invalidateQueries(['workshops'])
   ├─ React Query refetches workshops list
   ├─ UI updates with new workshop
   └─ toast.success('Workshop proposed!')
```

### Workshop Acceptance Flow

```
1. Instructor sees pending workshop
   ├─ useWorkshops().workshopsQuery
   ├─ Filters: status = 0 (Pending)
   └─ Shows with "Accept" button

2. Instructor clicks accept
   ├─ useWorkshops().acceptWorkshopMutation.mutate(id)
   └─ POST /api/workshops/{id}/accept/
      └─ Includes JWT token

3. Backend verifies
   ├─ Check: User is instructor
   ├─ Check: Workshop exists and pending
   ├─ Updates: status = 1, instructor = user
   └─ Returns 200 OK

4. Frontend updates
   ├─ queryClient.invalidateQueries(['workshops'])
   ├─ React Query refetches data
   ├─ UI shows updated workshop
   └─ toast.success('Workshop accepted!')
```

---

## API Endpoints Classification

### Public Endpoints (No Auth)
```
GET  /api/workshop-types/
GET  /api/workshop-types/{id}/
GET  /api/workshop-types/{id}/tnc/
GET  /api/statistics/public/
```

### Authentication Endpoints
```
POST /api/auth/register/
GET  /api/auth/activate/{key}/
POST /api/auth/login/
POST /api/auth/logout/
POST /api/auth/token/refresh/
```

### Authenticated Endpoints (Any User)
```
GET  /api/profile/me/
PATCH /api/profile/me/
GET  /api/workshops/
GET  /api/workshops/{id}/
GET  /api/workshops/{id}/comments/
POST /api/workshops/{id}/comments/
```

### Role-Based Endpoints
```
# Coordinator Only
POST /api/workshops/
POST /api/workshops/{id}/change-date/

# Instructor Only
GET  /api/profile/{user_id}/
POST /api/workshops/{id}/accept/
POST /api/workshop-types/
PATCH /api/workshop-types/{id}/
GET  /api/statistics/team/
```

---

## Error Handling

### Frontend Error Handling

```javascript
// In hooks/mutations
onError: (error) => {
  const message = error.response?.data?.detail || 
                  error.response?.data?.error ||
                  'An error occurred'
  toast.error(message)
}

// In components
try {
  const result = await mutation.mutateAsync(data)
} catch (error) {
  // Handle error
}

// With React Query
if (query.isError) {
  return <ErrorDisplay error={query.error} />
}
```

### Common Error Codes

| Code | Meaning | Frontend Action |
|------|---------|-----------------|
| 401 | Unauthorized (token expired) | Show login page |
| 403 | Forbidden (insufficient permissions) | Show access denied |
| 404 | Not found | Navigate back |
| 422 | Validation error | Show field errors |
| 500 | Server error | Show error message |

---

## Environment Configuration

### Frontend `.env` File

```
VITE_API_URL=http://localhost:8000/api
VITE_API_TIMEOUT=30000
```

### Backend `local_settings.py`

```python
DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]

# Email (console backend for development)
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
```

---

## Testing the Integration

### 1. Start Backend
```bash
cd workshop_booking-master
python manage.py runserver
```

### 2. Start Frontend
```bash
cd workshop_booking-master/frontend
npm run dev
```

### 3. Test Registration
- Navigate to `http://localhost:5173/register`
- Fill form and submit
- Check backend console for activation email
- Copy activation link and activate account

### 4. Test Login
- Navigate to `http://localhost:5173/login`
- Enter credentials
- Verify token stored in localStorage
- Check `useAuthStore` in application state

### 5. Test API Calls
- Open browser DevTools → Network
- Perform actions (create, update, delete)
- Watch API requests/responses
- Verify JWT token in Authorization header

---

## Debugging Tips

### Check Authentication State
```javascript
// In browser console
import { useAuthStore } from 'src/store/authStore'
useAuthStore.getState()
// Returns: { user, accessToken, refreshToken, isAuthenticated }
```

### Verify API Requests
```javascript
// In browser console
// View all network requests to /api/
// Watch request headers for Authorization: Bearer <token>
// Watch response status codes
```

### Check React Query
```javascript
// Use React Query DevTools (imported in main.jsx)
// Open DevTools drawer to see cached queries
// See query state, data, and errors
```

### Real-Time API Testing
```bash
# Use curl from terminal
curl -X GET http://localhost:8000/api/workshops/ \
  -H "Authorization: Bearer <token>"

# Or use Postman with environment variables
```

---

## Performance Optimization

### Caching Strategy
- React Query caches all GET requests
- Cache invalidation on mutations
- Stale time: 5 minutes (configurable)
- Background refetching enabled

### Request Optimization
- Pagination: 20 items per page
- Lazy loading for large lists
- Request debouncing for search

### Build Optimization
- Vite automatically code-splits
- Tree-shaking removes unused code
- CSS minification enabled

---

## Security Considerations

### Token Security
- Access token stored in localStorage (1-day expiry)
- Refresh token stored in localStorage (7-day expiry)
- Tokens sent only to same backend
- HTTPS enforced in production

### CORS Configuration
- Only allowed origins can access API
- Credentials withCredentials enabled
- Preflight requests properly handled

### Input Validation
- Frontend: React Hook Form + Zod validation
- Backend: Django REST Framework validation
- Email, phone, dates validated server-side

---

## Deployment

### Frontend Deployment

```bash
# Build for production
npm run build

# Output: frontend/dist/
# Deploy to: Vercel, Netlify, AWS S3 + CloudFront

# Configuration for backend URL
# Use environment variable: VITE_API_URL
```

### Backend Deployment

```bash
# Production settings
DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com', 'www.yourdomain.com']

CORS_ALLOWED_ORIGINS = [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
]

# Use PostgreSQL instead of SQLite
# Configure proper email backend
# Enable HTTPS/SSL
```

---

## Troubleshooting

### CORS Error
```
Solution: Check CORS_ALLOWED_ORIGINS in Django settings
Include frontend URL: http://localhost:5173
```

### Token Expired
```
Solution: Automatic refresh happens when making requests
If manual refresh needed: useAuthStore().setAccessToken(newToken)
```

### API Not Responding
```
Solution: Check backend is running: python manage.py runserver
Check port 8000 is accessible: http://localhost:8000/api/
```

### Components Not Updating
```
Solution: Use React Query devtools to check cache
Verify: queryClient.invalidateQueries() called after mutation
```

---

## Reference

**API Documentation:** [API_SETUP_GUIDE.md](API_SETUP_GUIDE.md)
**Frontend Setup:** [frontend/README.md](frontend/README.md)
**Quick Start:** [API_QUICK_START.md](API_QUICK_START.md)
**Checklist:** [REST_API_CHECKLIST.md](REST_API_CHECKLIST.md)

---

**Last Updated:** April 12, 2026
