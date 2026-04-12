import { Link } from 'react-router-dom'
import Button from './Button'

/**
 * Calendar with X mark SVG
 */
function CalendarXIcon() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto text-primary">
      <rect x="15" y="30" width="90" height="70" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="15" y1="50" x2="105" y2="50" stroke="currentColor" strokeWidth="2" />
      <circle cx="35" cy="20" r="4" fill="currentColor" />
      <circle cx="85" cy="20" r="4" fill="currentColor" />
      <line x1="40" y1="65" x2="65" y2="90" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="65" y1="65" x2="40" y2="90" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

/**
 * Checkmark in circle SVG
 */
function CheckCircleIcon() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto text-primary">
      <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="2" />
      <polyline points="40,60 55,75 85,45" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * Book with plus sign SVG
 */
function BookPlusIcon() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto text-primary">
      <path d="M 25 30 L 25 85 Q 25 95 35 95 L 85 95 Q 95 95 95 85 L 95 30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="55" y1="50" x2="55" y2="70" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="45" y1="60" x2="65" y2="60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="30" y1="35" x2="90" y2="35" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

/**
 * Magnifying glass SVG
 */
function MagnifyingGlassIcon() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto text-primary">
      <circle cx="45" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <line x1="65" y1="70" x2="95" y2="100" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

/**
 * Empty State Component
 * Displays a styled empty state with icon, title, subtitle, and optional action
 * @param {string} variant - Type of empty state (no-workshops, no-pending, no-types, not-found)
 * @param {string} title - Custom title text
 * @param {string} subtitle - Custom subtitle text
 * @param {string} actionLabel - Label for action button
 * @param {Function} onAction - Click handler for action button
 * @param {string} actionHref - Link destination (makes button a Link)
 */
export default function EmptyState({
  variant = 'no-workshops',
  title,
  subtitle,
  actionLabel,
  onAction,
  actionHref,
}) {
  const config = {
    'no-workshops': {
      icon: <CalendarXIcon />,
      defaultTitle: 'No workshops yet',
      defaultSubtitle: 'Workshops you propose or accept will appear here',
    },
    'no-pending': {
      icon: <CheckCircleIcon />,
      defaultTitle: 'All caught up!',
      defaultSubtitle: 'No pending workshops to review right now',
    },
    'no-types': {
      icon: <BookPlusIcon />,
      defaultTitle: 'No workshop types',
      defaultSubtitle: 'Contact an instructor to add workshop types',
    },
    'not-found': {
      icon: <MagnifyingGlassIcon />,
      defaultTitle: 'Not found',
      defaultSubtitle: "The page or item you're looking for doesn't exist",
    },
  }

  const state = config[variant] || config['no-workshops']
  const displayTitle = title || state.defaultTitle
  const displaySubtitle = subtitle || state.defaultSubtitle

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      {/* Icon */}
      <div className="mb-6">{state.icon}</div>

      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{displayTitle}</h2>

      {/* Subtitle */}
      <p className="text-gray-600 text-sm max-w-sm mb-6">{displaySubtitle}</p>

      {/* Action Button */}
      {(actionLabel || actionHref) && (
        <div>
          {actionHref ? (
            <Link to={actionHref}>
              <Button variant="primary">{actionLabel}</Button>
            </Link>
          ) : (
            <Button variant="primary" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
