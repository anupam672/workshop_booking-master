import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

// Lazy load all pages
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/RegisterPage'))
const ActivationPage = lazy(() => import('@/pages/ActivationPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const WorkshopStatusPage = lazy(() => import('@/pages/WorkshopStatusPage'))
const ProposeWorkshopPage = lazy(() => import('@/pages/ProposeWorkshopPage'))
const WorkshopDetailPage = lazy(() => import('@/pages/WorkshopDetailPage'))
const WorkshopTypeListPage = lazy(() => import('@/pages/WorkshopTypeListPage'))
const AddWorkshopTypePage = lazy(() => import('@/pages/AddWorkshopTypePage'))
const WorkshopTypeDetailPage = lazy(() => import('@/pages/WorkshopTypeDetailPage'))
const PublicStatisticsPage = lazy(() => import('@/pages/PublicStatisticsPage'))
const TeamStatisticsPage = lazy(() => import('@/pages/TeamStatisticsPage'))
const OwnProfilePage = lazy(() => import('@/pages/OwnProfilePage'))
const ViewCoordinatorProfilePage = lazy(() => import('@/pages/ViewCoordinatorProfilePage'))
const ChangePasswordPage = lazy(() => import('@/pages/ChangePasswordPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

/**
 * Page loading skeleton
 */
function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-primary" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}

/**
 * Protected Route wrapper
 * Redirects to login if not authenticated
 */
function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

/**
 * Public-only Route wrapper
 * Redirects to dashboard if already authenticated
 */
function PublicOnlyRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

/**
 * Main App component with routing
 */
export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          }
        />
        <Route path="/activate/:key" element={<ActivationPage />} />
        <Route
          path="/forgot-password"
          element={
            <PublicOnlyRoute>
              <ForgotPasswordPage />
            </PublicOnlyRoute>
          }
        />
        <Route path="/statistics" element={<PublicStatisticsPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workshops"
          element={
            <ProtectedRoute>
              <WorkshopStatusPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workshops/propose"
          element={
            <ProtectedRoute>
              <ProposeWorkshopPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workshops/:id"
          element={
            <ProtectedRoute>
              <WorkshopDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workshop-types"
          element={
            <ProtectedRoute>
              <WorkshopTypeListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workshop-types/add"
          element={
            <ProtectedRoute>
              <AddWorkshopTypePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workshop-types/:id"
          element={
            <ProtectedRoute>
              <WorkshopTypeDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/statistics/team"
          element={
            <ProtectedRoute>
              <TeamStatisticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <OwnProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <ViewCoordinatorProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePasswordPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all and redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
