import { cn } from '../../utils/cn'

/**
 * Badge Component
 */
export function Badge({ variant = 'default', className, children, ...props }) {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary text-white',
    success: 'bg-success text-white',
    warning: 'bg-warning text-white',
    danger: 'bg-red-100 text-red-800',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge
