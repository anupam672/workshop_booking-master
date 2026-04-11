import { cn } from '../../utils/cn'

/**
 * Badge Component
 * @param {string} variant - Badge style (pending, accepted, deleted, info, default)
 * @param {string} size - Badge size (sm, md)
 * @param {boolean} pulse - Show animated pulsing dot
 */
function Badge({
  children,
  variant = 'default',
  size = 'md',
  pulse = false,
  className,
  ...rest
}) {
  const variantClasses = {
    pending: 'bg-warning/10 text-warning border border-warning/30',
    accepted: 'bg-success/10 text-success border border-success/30',
    deleted: 'bg-danger/10 text-danger border border-danger/30',
    info: 'bg-primary/10 text-primary border border-primary/30',
    default: 'bg-gray-100 text-gray-600 border border-gray-200',
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs rounded-full',
    md: 'px-3 py-1 text-sm rounded-full',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...rest}
    >
      {pulse && (
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      )}
      {children}
    </span>
  )
}

/**
 * Helper function to render status badge
 * @param {0|1|2} status - Status code (0=pending, 1=accepted, 2=deleted)
 * @returns {React.ReactNode} Badge component
 */
export function getStatusBadge(status) {
  if (status === 0) {
    return (
      <Badge variant="pending" pulse>
        Pending
      </Badge>
    )
  }
  if (status === 1) {
    return <Badge variant="accepted">Accepted</Badge>
  }
  if (status === 2) {
    return <Badge variant="deleted">Deleted</Badge>
  }
  return <Badge variant="default">Unknown</Badge>
}

export default Badge

