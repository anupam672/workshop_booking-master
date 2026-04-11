import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { FormField } from '../components/forms/FormField';
import { requestPasswordReset } from '../api/auth';

const resetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await requestPasswordReset({ email: data.email });
      setIsSubmitted(true);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8"
      >
        {!isSubmitted ? (
          <>
            {/* Back Link */}
            <Link
              to="/login"
              className="flex items-center gap-2 text-primary hover:text-primary-dark mb-6 text-sm font-medium"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>

            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-primary mb-2" style={{ fontFamily: 'Sora' }}>
                Reset Password
              </h1>
              <p className="text-gray-500 text-sm">
                Enter your email to receive a password reset link
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormField label="Email" error={errors.email?.message} required>
                <input
                  type="email"
                  placeholder="your@email.com"
                  {...register('email')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </FormField>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        ) : (
          <>
            {/* Success State */}
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex justify-center mb-6"
              >
                <Mail size={40} className="text-primary" />
              </motion.div>

              <h1 className="text-2xl font-bold text-primary mb-2" style={{ fontFamily: 'Sora' }}>
                Email Sent!
              </h1>
              <p className="text-gray-600 mb-8">
                Check your inbox for password reset instructions.
              </p>

              <Link
                to="/login"
                className="inline-block px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
