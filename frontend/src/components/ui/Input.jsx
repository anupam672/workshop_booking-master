import { cn } from '../../utils/cn'

/**
 * Input Component
 */
export function Input({
  variant = 'default',
  size = 'md',
  className,
  error,
  ...props
}) {
  const baseStyles =
    'px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200'

  const variants = {
    default: 'border-gray-300 focus:ring-primary focus:border-transparent',
    outline: 'border-2 border-gray-400 focus:border-primary',
    error: 'border-red-500 focus:ring-red-500 focus:border-transparent',
  }

  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  return (
    <input
      className={cn(
        baseStyles,
        variants[error ? 'error' : variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
}

export default Input
