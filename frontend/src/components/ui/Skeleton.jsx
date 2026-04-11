import { cn } from '../../utils/cn'

/**
 * Skeleton Component - Loading placeholder
 */
export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        'bg-gray-200 rounded-lg animate-pulse',
        className
      )}
      {...props}
    />
  )
}

/**
 * Card Skeleton - Loading state for cards
 */
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex gap-2 pt-4">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  )
}

export default Skeleton
