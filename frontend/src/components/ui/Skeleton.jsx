import { cn } from '../../utils/cn'

/**
 * Base Skeleton
 * Loading placeholder animation
 */
function Skeleton({ className, ...rest }) {
  return (
    <div
      className={cn('animate-pulse bg-gray-200 rounded', className)}
      {...rest}
    />
  )
}

/**
 * Text Skeleton
 * Multiple lines of skeleton text with last line at 3/4 width
 */
function SkeletonText({ lines = 1, className, ...rest }) {
  return (
    <div className={cn('space-y-2', className)} {...rest}>
      {Array.from({ length: lines }).map((_, i) => {
        const isLastLine = i === lines - 1
        return (
          <Skeleton
            key={i}
            className={cn(
              'h-4 w-full rounded',
              isLastLine && 'w-3/4'
            )}
          />
        )
      })}
    </div>
  )
}

/**
 * Card Skeleton
 * Placeholder for loading state of a card
 */
function SkeletonCard({ className, ...rest }) {
  return (
    <Skeleton className={cn('w-full h-32 rounded-2xl', className)} {...rest} />
  )
}

/**
 * Avatar Skeleton
 * Circular placeholder for avatar images
 */
function SkeletonAvatar({ size = 'md', className, ...rest }) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  }

  return (
    <Skeleton
      className={cn(
        'rounded-full',
        sizeClasses[size],
        className
      )}
      {...rest}
    />
  )
}

/**
 * Workshop Card Skeleton
 * Realistic loading state for a workshop card
 */
function SkeletonWorkshopCard({ className, ...rest }) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl shadow-card border border-gray-100 p-6 space-y-4',
        className
      )}
      {...rest}
    >
      {/* Title */}
      <Skeleton className="h-6 w-4/5 rounded" />

      {/* Description lines */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />
      </div>

      {/* Date info */}
      <div className="flex gap-4 pt-2">
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-4 w-28 rounded" />
      </div>

      {/* Badge and button */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>
    </div>
  )
}

Skeleton.Text = SkeletonText
Skeleton.Card = SkeletonCard
Skeleton.Avatar = SkeletonAvatar
Skeleton.WorkshopCard = SkeletonWorkshopCard

export default Skeleton

