import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Loader2 } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import FormField from '../components/forms/FormField'
import { useChangePassword } from '../hooks/useProfile'
import { useNavigate } from 'react-router-dom'
import { cn } from '../utils/cn'

/**
 * Helper function to calculate password strength
 */
function getPasswordStrength(password) {
  if (!password) return 0
  if (password.length < 8) return 1
  
  const hasLetters = /[a-zA-Z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  
  let strength = 1
  if (hasLetters && hasNumbers) strength = 2
  if (hasLetters && hasNumbers && hasSpecial) strength = 3
  if (password.length >= 12 && hasLetters && hasNumbers && hasSpecial) strength = 4
  
  return strength
}

/**
 * Password strength level descriptor
 */
function getStrengthLabel(strength) {
  const labels = ['', 'Weak', 'Fair', 'Strong', 'Very Strong']
  return labels[strength] || 'Weak'
}

/**
 * Password strength color
 */
function getStrengthColor(strength) {
  const colors = {
    1: 'bg-danger',
    2: 'bg-warning',
    3: 'bg-success',
    4: 'bg-success',
  }
  return colors[strength] || 'bg-gray-300'
}

/**
 * Zod schema for password change validation
 */
const passwordSchema = z.object({
  old_password: z
    .string()
    .min(1, 'Current password is required'),
  new_password1: z
    .string()
    .min(8, 'New password must be at least 8 characters')
    .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
    .regex(/\d/, 'Password must contain at least one number'),
  new_password2: z.string().min(1, 'Password confirmation is required'),
}).refine((data) => data.new_password1 === data.new_password2, {
  message: 'Passwords do not match',
  path: ['new_password2'],
})

/**
 * Password Strength Indicator Component
 */
function PasswordStrengthIndicator({ password }) {
  const strength = useMemo(() => getPasswordStrength(password), [password])
  
  return (
    <div className="mt-3 space-y-2">
      {/* Strength bar */}
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={cn(
              'flex-1 h-1.5 rounded-full transition-all',
              level <= strength ? getStrengthColor(strength) : 'bg-gray-300'
            )}
          />
        ))}
      </div>
      
      {/* Strength label */}
      <p className={cn(
        'text-xs font-medium',
        strength === 1 && 'text-danger',
        strength === 2 && 'text-warning',
        (strength === 3 || strength === 4) && 'text-success'
      )}>
        {getStrengthLabel(strength)}
      </p>
    </div>
  )
}

/**
 * Change Password Page
 */
export default function ChangePasswordPage() {
  const navigate = useNavigate()
  const [newPasswordValue, setNewPasswordValue] = useState('')
  
  const { changePassword, isChanging, error } = useChangePassword()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      old_password: '',
      new_password1: '',
      new_password2: '',
    },
  })

  const newPassword = watch('new_password1')

  const handleChangePassword = (formData) => {
    changePassword(formData)
  }

  return (
    <PageWrapper title="Change Password">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/profile')}
          className="mb-6"
        >
          <ArrowLeft size={16} />
          Back to Profile
        </Button>

        {/* Card */}
        <Card className="space-y-6">
          {/* Header */}
          <h1 className="text-2xl font-heading font-bold text-gray-900">
            Change Password
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit(handleChangePassword)} className="space-y-4">
            {/* Current Password */}
            <FormField
              label="Current Password"
              name="old_password"
              type="password"
              register={register}
              error={errors.old_password?.message}
              placeholder="Enter current password"
              required
            />

            {/* New Password */}
            <div>
              <FormField
                label="New Password"
                name="new_password1"
                type="password"
                register={register}
                error={errors.new_password1?.message}
                placeholder="Enter new password"
                required
              />
              
              {/* Password Strength Indicator */}
              {watch('new_password1') && (
                <PasswordStrengthIndicator password={watch('new_password1')} />
              )}
            </div>

            {/* Confirm Password */}
            <FormField
              label="Confirm New Password"
              name="new_password2"
              type="password"
              register={register}
              error={errors.new_password2?.message}
              placeholder="Confirm new password"
              required
            />

            {/* API Error */}
            {error && (
              <div className="p-3 bg-danger/10 border border-danger/30 rounded-lg">
                <p className="text-sm text-danger">{error.message}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={isChanging}
              className="mt-6"
            >
              {isChanging ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </Button>
          </form>

          {/* Hints */}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-xs text-gray-600 space-y-1">
              <strong className="block">Password Requirements:</strong>
              <span className="block">• At least 8 characters</span>
              <span className="block">• At least one letter</span>
              <span className="block">• At least one number</span>
            </p>
          </div>
        </Card>
      </div>
    </PageWrapper>
  )
}
