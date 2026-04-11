# FOSSEE Workshop Booking - Full Stack Setup Guide

This guide covers setting up both the Django backend and the new React frontend for the Workshop Booking application.

## Project Structure

```
workshop_booking-master/
├── backend/                 # Django backend
│   ├── manage.py
│   ├── requirements.txt
│   ├── workshop_portal/     # Django project
│   ├── workshop_app/        # Main app
│   ├── cms/
│   ├── teams/
│   └── statistics_app/
├── frontend/                # React frontend (NEW)
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── README.md
└── FULLSTACK_SETUP.md      # This file
```

## Quick Start (Development)

### Terminal 1 - Backend
```bash
cd workshop_booking-master
# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Configure Django settings
# Edit local_settings.py if needed

# Run migrations
python manage.py migrate

# Start Django server
python manage.py runserver
# Backend runs on http://localhost:8000
```

### Terminal 2 - Frontend
```bash
cd workshop_booking-master/frontend

# Install dependencies (if not already done)
npm install

# Start Vite dev server
npm run dev
# Frontend runs on http://localhost:5173
```

## Backend Setup (Django)

### Prerequisites
- Python 3.8+
- pip
- virtualenv (recommended)

### Installation Steps

1. **Navigate to project root**
   ```bash
   cd workshop_booking-master
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment**
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Configure local settings**
   ```bash
   cp .sampleenv local_settings.py
   # Edit local_settings.py with your configuration
   ```

6. **Run migrations**
   ```bash
   python manage.py migrate
   ```

7. **Create superuser** (optional)
   ```bash
   python manage.py createsuperuser
   ```

8. **Start development server**
   ```bash
   python manage.py runserver
   ```

Backend will be available at `http://localhost:8000`

### Important: Enable CORS for Frontend

Add to your Django `settings.py` or `local_settings.py`:

```python
INSTALLED_APPS = [
    # ...existing apps...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    # ...other middleware...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    # Add production URLs here when deploying
]

CORS_ALLOW_CREDENTIALS = True

# For development, allow all origins (NOT recommended for production)
# CORS_ALLOW_ALL_ORIGINS = True
```

Install `django-cors-headers`:
```bash
pip install django-cors-headers
```

## Frontend Setup (React)

### Prerequisites
- Node.js 20.15.0+
- npm or yarn

### Installation Steps

1. **Navigate to frontend directory**
   ```bash
   cd workshop_booking-master/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your backend URL
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

Frontend will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

## Frontend Project Structure

```
frontend/src/
├── api/
│   ├── client.js       # Axios with auth interceptors
│   ├── auth.js         # Auth endpoints
│   └── workshops.js    # Workshop endpoints
├── components/
│   ├── ui/             # UI components
│   ├── layout/         # Layout components
│   └── forms/          # Form components
├── hooks/
│   ├── useAuth.js      # Auth logic
│   └── useWorkshops.js # Workshop logic
├── pages/              # Page components
├── store/
│   └── authStore.js    # Zustand auth store
├── utils/
│   └── cn.js           # Helper utilities
├── App.jsx             # Main app
└── main.jsx            # Entry point
```

## API Documentation

### Authentication Endpoints

**Login**
```
POST /api/token/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "access": "access_token",
  "refresh": "refresh_token",
  "user": {...}
}
```

**Register**
```
POST /api/register/
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "User Name"
}
```

**Refresh Token**
```
POST /api/token/refresh/
Content-Type: application/json

{
  "refresh": "refresh_token"
}
```

### Workshop Endpoints

**List Workshops**
```
GET /api/workshops/?page=1&limit=10
Authorization: Bearer access_token
```

**Get Single Workshop**
```
GET /api/workshops/{id}/
Authorization: Bearer access_token
```

**Create Workshop**
```
POST /api/workshops/
Authorization: Bearer access_token
Content-Type: application/json

{
  "title": "Workshop Title",
  "description": "...",
  "date": "2024-04-20",
  "instructor": "Instructor ID"
}
```

## Development Workflow

1. **Start both servers**
   - Backend on terminal 1
   - Frontend on terminal 2

2. **Make changes to Django models**
   - Create migrations: `python manage.py makemigrations`
   - Apply migrations: `python manage.py migrate`

3. **Create API endpoints** in Django
   - Use Django REST Framework for consistency

4. **Update frontend** to consume new APIs
   - Create API function in `src/api/`
   - Create hook in `src/hooks/`
   - Use hook in component

5. **Test thoroughly**
   - API integration
   - Form validation
   - Error handling

## Database

### Viewing Database Contents

**Using Django Shell**
```bash
python manage.py shell
>>> from workshop_app.models import Workshop
>>> Workshop.objects.all()
```

**Using Django Admin**
```bash
python manage.py createsuperuser  # If not created
python manage.py runserver
# Visit http://localhost:8000/admin/
```

## Troubleshooting

### Frontend Connection Issues

**Problem**: Frontend can't connect to backend
- **Solution**: Ensure Django is running on `http://localhost:8000`
- Check CORS configuration in Django settings
- Check frontend `.env` file has correct API URL

### Frontend Build Errors

**Problem**: `npm install` fails
- **Solution**: Clear cache and reinstall
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

**Problem**: Tailwind styles not applied
- **Solution**: Ensure `tailwind.config.js` has correct content paths
  ```javascript
  content: ['./index.html', './src/**/*.{js,jsx}']
  ```

### Django Errors

**Problem**: Port 8000 already in use
- **Solution**: Use different port
  ```bash
  python manage.py runserver 8001
  ```

**Problem**: Database errors
- **Solution**: Reset database
  ```bash
  python manage.py migrate zero  # Revert all
  python manage.py migrate       # Apply from start
  ```

## Environment Variables

### Backend (.env / local_settings.py)
```
DATABASE_URL=... (if using environment)
DEBUG=True (development)
SECRET_KEY=your-secret-key
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=Workshop Booking
```

## Deployment (Future)

### Deploying Frontend
1. Build: `npm run build`
2. Deploy `dist/` folder to static hosting (Vercel, Netlify, AWS S3, etc.)

### Deploying Backend
1. Collect static files: `python manage.py collectstatic`
2. Deploy to server (Heroku, AWS, Linode, etc.)
3. Set environment variables on production server
4. Update CORS_ALLOWED_ORIGINS with production domain

## Code Style & Best Practices

### Frontend (JavaScript/React)
- Use functional components and hooks
- Use ES6+ syntax
- Format with Prettier (if available)
- Follow React best practices

### Backend (Python/Django)
- Use PEP 8 style guide
- Use Django best practices
- Keep views clean and focused
- Use serializers for API responses

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Django Documentation](https://docs.djangoproject.com)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Tailwind CSS](https://tailwindcss.com)

## Git Workflow

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "Add your feature"

# Push to repository
git push origin feature/your-feature-name

# Create a Pull Request
```

## Support & Contributing

For issues or contributions, please visit the FOSSEE Workshop Booking repository on GitHub.

## License

This project is maintained by FOSSEE and follows their licensing terms.

---

**Last Updated**: April 2026
**Version**: 1.0.0
