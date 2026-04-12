import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from '@/store/authStore'
import ErrorBoundary from '@/components/ui/ErrorBoundary'

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
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
      </div>
    </div>
  )
}

/**
 * Protected Route wrapper
 * Redirects to login if not authenticated
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user && !user.is_email_verified) {
    return <Navigate to="/activate" replace />
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
  const location = useLocation()

  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
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
              path="/profile/:userId"
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
        </AnimatePresence>
      </Suspense>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#16A34A',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#DC2626',
              secondary: '#fff',
            },
          },
        }}
      />
    </ErrorBoundary>
  )
}
