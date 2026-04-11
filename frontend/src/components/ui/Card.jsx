import { cn } from '../../utils/cn'

/**
 * Card Component
 */
export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-sm border border-gray-200 p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Card Header
 */
export function CardHeader({ className, children, ...props }) {
  return (
    <div
      className={cn('border-b border-gray-200 pb-4 mb-4', className)}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Card Title
 */
export function CardTitle({ className, children, ...props }) {
  return (
    <h2
      className={cn('text-2xl font-bold text-gray-900', className)}
      {...props}
    >
      {children}
    </h2>
  )
}

/**
 * Card Description
 */
export function CardDescription({ className, children, ...props }) {
  return (
    <p className={cn('text-gray-600 text-sm', className)} {...props}>
      {children}
    </p>
  )
}

/**
 * Card Content
 */
export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  )
}

/**
 * Card Footer
 */
export function CardFooter({ className, children, ...props }) {
  return (
    <div
      className={cn('border-t border-gray-200 pt-4 mt-4', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
