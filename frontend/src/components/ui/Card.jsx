import { cn } from '../../utils/cn'

/**
 * Card Component
 * @param {string} variant - Card style (default, elevated, bordered, flat)
 * @param {boolean} hover - Enable hover effect with lift and shadow
 * @param {string} className - Additional classes
 */
function Card({
  children,
  variant = 'default',
  className,
  hover = false,
  onClick,
  ...rest
}) {
  const variantClasses = {
    default:
      'bg-white rounded-2xl shadow-card border border-gray-100',
    elevated:
      'bg-white rounded-2xl shadow-card-hover border border-gray-100',
    bordered: 'bg-white rounded-2xl border-2 border-primary',
    flat: 'bg-gray-50 rounded-2xl border border-gray-200',
  }

  const hoverClasses = hover
    ? 'hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer'
    : ''

  return (
    <div
      className={cn(variantClasses[variant], hoverClasses, className)}
      onClick={onClick}
      {...rest}
    >
      {children}
    </div>
  )
}

/**
 * Card Header
 */
function CardHeader({ children, className, ...rest }) {
  return (
    <div className={cn('px-6 pt-6 pb-2', className)} {...rest}>
      {children}
    </div>
  )
}

/**
 * Card Body
 */
function CardBody({ children, className, ...rest }) {
  return (
    <div className={cn('px-6 py-4', className)} {...rest}>
      {children}
    </div>
  )
}

/**
 * Card Footer
 */
function CardFooter({ children, className, ...rest }) {
  return (
    <div className={cn('px-6 pt-2 pb-6', className)} {...rest}>
      {children}
    </div>
  )
}

Card.Header = CardHeader
Card.Body = CardBody
Card.Footer = CardFooter

export default Card

