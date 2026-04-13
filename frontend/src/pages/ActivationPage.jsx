import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, CheckCircle, XCircle, Loader2, GraduationCap } from 'lucide-react'
import toast from 'react-hot-toast'
import { activateUser } from '../api/auth'
import Button from '../components/ui/Button'

/**
 * Animated envelope SVG
 */
function EnvelopeIcon() {
  return (
    <motion.div
      animate={{ y: [-4, 4, -4] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      className="flex justify-center mb-6"
    >
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Envelope rectangle */}
        <rect x="8" y="20" width="64" height="44" rx="6" stroke="#0F4C81" strokeWidth="3" fill="#EFF6FF" />
        {/* Envelope flap V shape */}
        <path
          d="M8 26 L40 48 L72 26"
          stroke="#0F4C81"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Small lines suggesting text inside */}
        <line x1="22" y1="38" x2="36" y2="38" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
        <line x1="22" y1="46" x2="44" y2="46" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </motion.div>
  )
}

export default function ActivationPage() {
  const { key } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!key) return // No key = waiting screen, do nothing

    setStatus('loading')
    activateUser(key)
      .then(() => setStatus('success'))
      .catch((err) => {
        setStatus('error')
        setErrorMessage(
          err.response?.data?.error ||
            err.response?.data?.detail ||
            'This activation link is invalid or has expired.'
        )
      })
  }, [key])

  // STATE: No key (waiting for email) ─────────────────────────
  if (!key) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-10 text-center"
        >
          {/* Header: GraduationCap icon in circle */}
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <GraduationCap size={32} className="text-primary" />
          </div>

          {/* Animated envelope */}
          <EnvelopeIcon />

          <h1 className="font-heading text-2xl font-bold text-gray-900 mb-3">Check Your Email</h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-2">
            We've sent an activation link to your email address. Click the link to verify your account.
          </p>
          <p className="text-xs text-gray-400 mb-8">
            The link expires in <span className="font-semibold text-warning">24 hours</span>
          </p>

          {/* Info box with tips */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm text-primary mb-6 text-left">
            <p className="font-medium mb-1">Don't see the email?</p>
            <ul className="text-xs space-y-1 text-primary/70 list-disc list-inside">
              <li>Check your spam or junk folder</li>
              <li>Make sure you used the correct email</li>
              <li>Wait a few minutes and check again</li>
            </ul>
          </div>

          <Link to="/login" className="text-primary text-sm hover:underline font-medium">
            ← Back to Sign In
          </Link>
        </motion.div>
      </div>
    )
  }

  // STATE: Loading (processing key) ─────────────────────────
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-10 text-center"
        >
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 size={48} className="text-primary animate-spin" />
            <h2 className="font-heading text-xl font-semibold text-gray-800">Verifying your account...</h2>
            <p className="text-gray-500 text-sm">Please wait a moment</p>
          </div>
        </motion.div>
      </div>
    )
  }

  // STATE: Success ─────────────────────────
  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-10 text-center"
        >
          {/* Animated checkmark */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
              <motion.svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <motion.path
                  d="M8 20 L16 28 L32 12"
                  stroke="#16A34A"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                />
              </motion.svg>
            </div>
          </div>

          <h1 className="font-heading text-2xl font-bold text-gray-900 mb-3">Email Verified! 🎉</h1>
          <p className="text-gray-500 text-sm mb-8">
            Your account is ready. You can now sign in and start booking workshops.
          </p>
          <Button variant="primary" fullWidth onClick={() => navigate('/login')}>
            Go to Sign In
          </Button>
        </motion.div>
      </div>
    )
  }

  // STATE: Error ─────────────────────────
  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-10 text-center"
        >
          {/* Error icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-danger/10 flex items-center justify-center">
              <XCircle size={40} className="text-danger" />
            </div>
          </div>

          <h1 className="font-heading text-2xl font-bold text-gray-900 mb-3">Link Expired or Invalid</h1>
          <p className="text-gray-500 text-sm mb-2">{errorMessage}</p>
          <p className="text-xs text-gray-400 mb-8">
            Activation links expire after 24 hours. Please register again.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" fullWidth onClick={() => navigate('/register')}>
              Register Again
            </Button>
            <Button variant="primary" fullWidth onClick={() => navigate('/login')}>
              Back to Login
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  // This should not happen, but just in case
  return null
}

