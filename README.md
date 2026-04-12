# FOSSEE Workshop Booking — Enhanced UI/UX

A comprehensive React + Django REST Framework application for managing and booking educational workshops. This project modernizes the FOSSEE Workshop Booking system with a responsive, mobile-first interface and improved user experience.

## Before & After

| Page | Before | After |
|------|--------|-------|
| Login | Basic form | Animated gradient card with validation feedback |
| Register | Single static form | Multi-step form with progress indicator |
| Workshop Status | Striped HTML tables | Beautiful card grid with status badges |
| Statistics | Chart.js charts + tables | Recharts visualizations with filtering |
| Profile | Basic text form | Two-column card layout with edit mode |
| Navigation | Hamburger menu | Native-feel bottom tab bar on mobile |

## Design Principles

### 1. Mobile-First Responsive Design
The entire application was built with mobile-first principles, ensuring optimal experiences across all device sizes. We use Tailwind CSS breakpoints strategically:
- Mobile layouts stack vertically with full-width cards
- Desktop layouts leverage multi-column grids (e.g., profile: 1-3 columns)
- Charts use ResponsiveContainer for adaptive sizing
- Forms are touch-friendly with proper spacing and input sizes
- Navigation uses a sticky bottom tab bar on mobile, traditional top nav on desktop

### 2. Visual Hierarchy & Design Tokens
Consistent design tokens throughout:
- **Primary Color**: `#0F4C81` (professional blue) for interactive elements
- **Accent Color**: `#F97316` (orange) for secondary actions
- **Typography**: Sora for headings (friendly, modern), DM Sans for body (readable)
- **Spacing**: 4px grid system (py-4, gap-6, etc.) for predictable layouts
- **Shadows & Borders**: Subtle borders (border-gray-200) instead of heavy shadows for lightness

### 3. Accessibility & Consistency
- All interactive elements meet WCAG standards (buttons, links, inputs)
- Color contrast ratios validated (text on backgrounds, button states)
- Form fields include labels and error states
- Clear focus indicators for keyboard navigation
- Loading states prevent user confusion during async operations

### 4. Decoupled Architecture
The challenge: Previously, Django handled both server rendering and authentication. Solution:
- Built API-first with Django REST Framework (JWT authentication)
- React SPA consumes the API independently
- Email verification still integrated (seamless flow to /activate)
- Zustand for lightweight client-state management
- TanStack Query for server-state synchronization

## Tech Stack

| Category | Technology | Reason |
|----------|-----------|--------|
| Frontend Framework | React 18 + Vite | Fast refresh during development, optimized bundle splitting |
| Routing | React Router v6 | Dynamic, nested routes with lazy loading and Suspense |
| Server State | TanStack Query | Automatic caching, background syncing, pagination support |
| Client State | Zustand | Minimal boilerplate, persist auth to localStorage |
| Styling | Tailwind CSS | Utility-first, zero runtime overhead, design system consistency |
| Forms | React Hook Form + Zod | Uncontrolled components, schema validation without extra deps |
| Animations | Framer Motion | Page transitions, button loading states, smooth interactions |
| Charts | Recharts | Lightweight, responsive, composable chart primitives |
| HTTP Client | Axios | Request/response interceptors for auth token, error handling |
| Backend API | Django REST Framework | Mature, battle-tested, excellent documentation |
| Authentication | JWT (SimpleJWT) | Stateless, mobile-app ready, no session affinity needed |

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 18+
- pip and npm

### Backend Setup
```bash
# Clone and navigate to project
git clone https://github.com/FOSSEE/workshop_booking.git
cd workshop_booking

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create sample test data (optional)
python manage.py createsuperuser
# Or use fixture:
python manage.py loaddata sample_workshops

# Start Django server
python manage.py runserver
# Runs on http://localhost:8000
```

### Frontend Setup
```bash
# Navigate to frontend folder
cd frontend

# Create environment file
cp .env.example .env
# Edit .env and set VITE_API_URL=http://localhost:8000/api

# Install dependencies
npm install

# Start development server
npm run dev
# Runs on http://localhost:5173
```

### Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api/
- **Admin Panel**: http://localhost:8000/admin

### Test Accounts (if using fixtures)
```
Instructor:
  Username: instructor1
  Password: testpass123

Coordinator:
  Username: coordinator1
  Password: testpass123
```

## Architecture

### Why React SPA + DRF?
The original system used Django templates with server-side rendering. We chose an API-first SPA architecture for:

1. **Mobile-Ready**: Same API serves web and future native apps
2. **Separation of Concerns**: Frontend and backend can evolve independently
3. **Stateless Auth**: JWT tokens allow horizontal scaling
4. **Offline-Ready**: PWA capabilities (service workers) possible
5. **Modern DX**: Hot module reloading, TypeScript-ready, component isolation

### Request Flow
```
React Component
    ↓
React Hook Form + Validation
    ↓
src/api/ (Axios client)
    ↓
Django REST Framework Views
    ↓
Database
```

### State Management
```
Authentication → Zustand (useAuthStore)
Server Data → TanStack Query (useQuery, useMutation)
Form State → React Hook Form (useForm)
UI State → Component useState (modals, filters)
```

## Folder Structure

### Frontend (`frontend/src/`)
```
src/
├── api/              # API functions (axios calls)
│   ├── auth.js       # Authentication endpoints
│   ├── workshops.js  # Workshop CRUD
│   ├── statistics.js # Analytics endpoints
│   └── profile.js    # User profile endpoints
├── hooks/            # Custom React hooks
│   ├── useAuth.js    # Auth logic
│   ├── useWorkshops.js
│   ├── useProfile.js
│   └── ...
├── components/       # Reusable components
│   ├── ui/           # Button, Card, Badge, etc.
│   ├── forms/        # FormField, form helpers
│   └── layout/       # Navbar, PageWrapper, Sidebar
├── pages/            # Route-level pages (lazy)
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── WorkshopStatusPage.jsx
│   └── ...
├── store/            # Zustand stores
│   └── authStore.js
├── utils/            # Utility functions
│   └── cn.js         # Tailwind class merging, date formatting
└── App.jsx           # Main router
```

### Backend (`workshop_app/api/`)
```
api/
├── serializers.py   # DRF serializers for data validation
├── views.py         # API viewsets
├── permissions.py   # Custom permission classes
└── urls.py          # API routing
```

## Key Features Implemented

### Authentication
- JWT token-based auth (access + refresh tokens)
- Email verification flow with activation keys
- Protected routes (ProtectedRoute component)
- Auto-redirect to login if unauthenticated
- Persistent auth (localStorage with Zustand)

### Workshops
- Create, read, update, delete workshops
- Filter by status (pending, accepted)
- Search and pagination
- Accept/reject workflow for instructors
- Workshop type selection with TNC display

### Statistics
- Public-facing workshop analytics
- Filter by date range, state, workshop type
- Recharts visualizations (bar, pie charts)
- CSV export functionality
- Team performance metrics (instructor-only)

### Profile Management
- Edit profile (name, institute, phone, location)
- View other coordinator profiles
- Workshop history per coordinator
- Change password with strength meter
- Email verification status

### Mobile Experience
- Bottom navigation bar (iOS-like)
- Responsive cards instead of tables on small screens
- Touch-friendly button sizes (48px min)
- Collapsible filters on mobile
- Sticky headers for long lists

## Performance Optimizations

### Code Splitting
- Lazy load all page components with `React.lazy()`
- PageLoader skeleton during route transitions
- Suspense boundaries at route level

### Bundle Size
- Recharts tree-shaking (only used exports included)
- Tailwind CSS purging (unused styles removed in build)
- Zustand (2.5KB) over Redux (for simplicity)
- System fonts where possible (fonts.css only for headings)

### Network
- Request debouncing on search inputs
- Pagination for large lists (20 items/page default)
- TanStack Query background refetching
- Stale-while-revalidate pattern

## Error Handling

### Error Boundary
Wraps the entire app to catch React render errors. Falls back to:
- Error message display
- "Try Again" button (resets error state)
- "Go Home" link (safe fallback)

### API Errors
Each hook catches errors and displays toast notifications:
- `400 Bad Request`: Field-level validation feedback
- `401 Unauthorized`: Auto-redirect to login
- `404 Not Found`: NavigateTo route or empty state
- `500 Server Error`: Generic error message

### User Feedback
- Toast notifications (top-right, 3s auto-dismiss)
- Loading spinners on buttons and tables
- Disabled states during submission
- Inline field error messages

## Contributing

### Branch Naming
```
feature/description    # New features
bug/description        # Bug fixes
docs/description       # Documentation
refactor/description   # Code improvements
```

### Commit Format
```
feat(scope): brief description
fix(scope): brief description
docs(scope): brief description
refactor(scope): brief description
```

### Before Submitting a PR
1. Create a feature branch from `main`
2. Test locally: `npm run dev`
3. Lint: `npm run lint`
4. Build: `npm run build`
5. Write a clear commit message
6. Push and open a GitHub Pull Request

## Troubleshooting

### "Module not found" errors
- Clear node_modules: `rm -rf frontend/node_modules && npm install`
- Restart dev server: `npm run dev`

### CORS errors from frontend
- Ensure Django is running on `http://localhost:8000`
- Check `VITE_API_URL` in `frontend/.env`
- Verify Django CORS settings allow localhost

### Authentication failing
- Check if refresh token expired: clear localStorage and re-login
- Verify Django `SECRET_KEY` is set
- Ensure `database` (db.sqlite3) exists and migrations ran

### Email verification not working
- Check Django email config in `settings.py`
- Verify activation key format in session
- Check email backend (console in development)

## License
[FOSSEE Project License](LICENSE)

## Acknowledgments
Built with ❤️ by the FOSSEE team. Special thanks to the Django and React communities for excellent tooling.

---

**Last Updated**: April 2026
**Version**: 2.0 (Enhanced UI/UX)
