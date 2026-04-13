import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { GraduationCap } from 'lucide-react'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import FormField from '../components/forms/FormField'
import Button from '../components/ui/Button'

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

export default function LoginPage() {
  const { login, isLoginLoading } = useAuth()
  const [hasError, setHasError] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data) => {
    setHasError(false)
    try {
      await login(data)
    } catch {
      setHasError(true)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center p-4"
    >
      <motion.div
        animate={hasError ? { x: [-10, 10, -8, 8, -5, 5, 0] } : { x: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 
                          bg-primary/10 rounded-2xl mb-4">
            <GraduationCap size={32} className="text-primary" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">
            FOSSEE Workshops
          </h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          
          <FormField
            label="Username"
            name="username"
            type="text"
            register={register}
            error={errors.username}
            placeholder="Enter your username"
            required
          />

          <FormField
            label="Password"
            name="password"
            type="password"
            register={register}
            error={errors.password}
            placeholder="Enter your password"
            required
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isLoginLoading}
            className="mt-2"
          >
            Sign In
          </Button>

        </form>

        {/* Links */}
        <div className="mt-6 pt-4 border-t border-gray-100 space-y-2 text-center">
          <p className="text-sm text-gray-600">
            New here?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Create an account
            </Link>
          </p>
          <Link
            to="/forgot-password"
            className="block text-sm text-gray-500 hover:text-primary transition-colors"
          >
            Forgot your password?
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}
