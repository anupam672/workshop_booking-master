import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../components/ui/Button'

/**
 * 404 Not Found Page
 */
export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-md"
      >
        {/* 404 Number */}
        <div className="mb-6">
          <h1 className="text-8xl font-heading font-bold text-primary/20">404</h1>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
          Page not found
        </h2>

        {/* Subtitle */}
        <p className="text-gray-600 text-sm mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <Button
            variant="primary"
            onClick={() => navigate('/', { replace: true })}
          >
            Go Home
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
