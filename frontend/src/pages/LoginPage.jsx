import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Eye, EyeOff } from 'lucide-react';
import { FormField } from '../components/forms/FormField';
import useAuth from '../hooks/useAuth';

const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [shakeError, setShakeError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
      setShakeError(false);
    } catch (err) {
      setShakeError(true);
      setTimeout(() => setShakeError(false), 600);
    }
  };

  const shakeVariants = {
    shake: {
      x: [-10, 10, -10, 10, 0],
      transition: { duration: 0.5 },
    },
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center p-4">
      <motion.div
        initial="initial"
        animate="animate"
        variants={cardVariants}
        className={shakeError ? 'animate-pulse' : ''}
      >
        <motion.div
          animate={shakeError ? 'shake' : 'normal'}
          variants={shakeVariants}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <GraduationCap size={40} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-primary mb-2" style={{ fontFamily: 'Sora' }}>
              FOSSEE Workshops
            </h1>
            <p className="text-gray-500 text-sm">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username */}
            <FormField label="Username" error={errors.username?.message} required>
              <input
                type="text"
                placeholder="Username"
                {...register('username')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </FormField>

            {/* Password */}
            <FormField label="Password" error={errors.password?.message} required>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  {...register('password')}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </FormField>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-primary text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-xs text-gray-500">OR</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Links */}
          <div className="space-y-3 text-center">
            <p className="text-sm">
              New here?{' '}
              <Link to="/register" className="text-primary hover:underline font-semibold">
                Create an account
              </Link>
            </p>
            <p className="text-sm">
              <Link to="/forgot-password" className="text-primary hover:underline font-semibold">
                Forgot password?
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
