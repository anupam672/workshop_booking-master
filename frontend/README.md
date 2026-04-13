# Workshop Booking - React Frontend

Modern React + Vite frontend for the FOSSEE Workshop Booking Application.

## Tech Stack

- **React 18.2** - UI library
- **Vite 5.0** - Build tool and dev server
- **React Router v6** - Client-side routing
- **TanStack React Query** - Server state management
- **Zustand** - Client state management (Auth)
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **Lucide React** - Icons

## Project Structure

```
frontend/
├── src/
│   ├── api/              # API client and endpoints
│   │   ├── client.js     # Axios instance with interceptors
│   │   ├── auth.js       # Auth API endpoints
│   │   └── workshops.js  # Workshop API endpoints
│   ├── components/       # Reusable components
│   │   ├── ui/           # UI components (Button, Input, Card, etc)
│   │   ├── layout/       # Layout components (Navbar, PageWrapper, etc)
│   │   └── forms/        # Form components (FormField, etc)
│   ├── hooks/            # Custom React hooks
│   │   ├── useAuth.js    # Authentication hook
│   │   └── useWorkshops.js # Workshops hook
│   ├── pages/            # Page components (one per route)
│   ├── store/            # Zustand stores
│   │   └── authStore.js  # Auth state management
│   ├── utils/            # Utility functions
│   │   └── cn.js         # Class name merger
│   ├── App.jsx           # Main app component with routing
│   ├── main.jsx          # App entry point
│   └── index.css         # Global styles
├── index.html            # HTML entry point
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind configuration
├── postcss.config.js     # PostCSS configuration
├── .env                  # Environment variables (local)
├── .env.example          # Example environment variables
└── package.json          # Dependencies and scripts

```

## Getting Started

### Prerequisites
- Node.js 20.15.0 or higher
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create environment file** (if not exists)
   ```bash
   cp .env.example .env
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

### Development

#### Development Server
```bash
npm run dev
```

#### Build for Production
```bash
npm run build
```

#### Preview Production Build
```bash
npm run preview
```

## Backend API Integration

The frontend is configured to communicate with Django backend at `http://localhost:8000/api`.

### Running Backend Locally

1. Ensure Django project is set up (in the parent directory)
2. Install requirements: `pip install -r requirements.txt`
3. Run migrations: `python manage.py migrate`
4. Start server: `python manage.py runserver`

### CORS Configuration

Make sure your Django backend has CORS enabled. Install `django-cors-headers`:

```bash
pip install django-cors-headers
```

Then add to Django settings:
```python
INSTALLED_APPS = [
    # ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    # ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

## API Endpoints

The frontend expects the following API structure:

### Authentication
- `POST /api/token/` - Login
- `POST /api/token/refresh/` - Refresh token
- `POST /api/register/` - Register
- `GET /api/user/` - Get current user
- `PUT /api/user/` - Update user
- `POST /api/user/change-password/` - Change password
- `POST /api/logout/` - Logout

### Workshops
- `GET /api/workshops/` - List workshops
- `GET /api/workshops/{id}/` - Get workshop details
- `POST /api/workshops/` - Create workshop (Instructor only)
- `PUT /api/workshops/{id}/` - Update workshop
- `DELETE /api/workshops/{id}/` - Delete workshop
- `POST /api/workshops/{id}/book/` - Book workshop
- `POST /api/workshops/{id}/cancel/` - Cancel booking

### Statistics
- `GET /api/statistics/` - Get statistics

## Styling Guide

### Color Scheme
- **Primary**: `#0F4C81` (Deep Blue)
- **Accent**: `#F97316` (Orange)
- **Success**: `#16A34A` (Green)
- **Warning**: `#CA8A04` (Amber)

### Typography
- **Headings**: Sora (400, 500, 600, 700)
- **Body**: DM Sans (400, 500, 700)

### Tailwind Configuration

The project uses custom Tailwind configuration with:
- Extended colors
- Custom font families
- Tailwind Forms plugin for better form styling

## Creating New Features

### Adding a New Page

1. Create a new file in `src/pages/`
2. Add the route to `src/App.jsx`
3. Use hooks for data fetching

Example:
```jsx
// src/pages/WorkshopsPage.jsx
import { useWorkshops } from '../hooks/useWorkshops'
import { Skeleton } from '../components/ui/Skeleton'

export default function WorkshopsPage() {
  const { workshops, isLoading } = useWorkshops()

  if (isLoading) {
    return <Skeleton />
  }

  return (
    <div>
      {workshops.map(workshop => (
        // Render workshop
      ))}
    </div>
  )
}
```

### Adding a New Component

1. Create file in appropriate folder under `components/`
2. Export component from file
3. Use in your pages

### Making API Calls

Use the existing hooks or create new ones:

```javascript
import { useWorkshops } from '../hooks/useWorkshops'

// Inside component
const { workshops, isLoading, error } = useWorkshops()
```

## Error Handling

The app uses `react-hot-toast` for notifications. Errors from API calls are automatically displayed as toast notifications via the custom hooks.

## State Management

- **Authentication**: Zustand store (`useAuthStore`)
- **Server state**: React Query (`@tanstack/react-query`)
- **Tokens**: Persisted in localStorage via Zustand middleware

## Best Practices

1. **Use custom hooks** for data fetching
2. **Use the `cn()` utility** for conditional class names
3. **Keep components small** and reusable
4. **Use React Query** for server state
5. **Validate forms** with React Hook Form + Zod
6. **Handle errors** gracefully with toasts

## Troubleshooting

### API Not Connecting
- Ensure Django backend is running on `http://localhost:8000`
- Check CORS configuration in Django settings
- Verify `.env` file has correct `VITE_API_URL`

### Styles Not Applying
- Ensure Tailwind CSS is properly configured
- Check `tailwind.config.js` content paths
- Run `npm run dev` to rebuild styles

### Build Issues
- Delete `node_modules` and `.npm` cache
- Run `npm install` again
- Delete `.env` and `.env.local` files

## Contributing

1. Create a feature branch
2. Make your changes
3. Test locally
4. Submit a pull request

## License

This project is part of the FOSSEE project and follows the same license.
