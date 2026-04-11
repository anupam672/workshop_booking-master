import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * Button Component
 * @param {string} variant - Button style variant (primary, secondary, outline, ghost, danger, accent)
 * @param {string} size - Button size (sm, md, lg)
 * @param {boolean} loading - Show loading state with spinner
 * @param {boolean} fullWidth - Make button full width
 * @param {boolean} disabled - Disable the button
 * @param {() => void} onClick - Click handler
 * @param {string} type - Button type (button, submit, reset)
 * @param {string} className - Additional classes
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  className,
  ...rest
}) {
  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-dark text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'text-gray-600 hover:bg-gray-100',
    danger: 'bg-danger hover:bg-red-700 text-white',
    accent: 'bg-accent hover:bg-accent-dark text-white',
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-5 py-2.5 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-xl',
  }

  const baseClasses =
    'inline-flex items-center justify-center gap-2 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'

  const computedClassName = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    className
  )

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={computedClassName}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      {...rest}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </motion.button>
  )
}

