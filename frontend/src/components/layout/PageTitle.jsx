import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

/**
 * Page Title Component
 * Displays page title, subtitle, breadcrumbs, and action buttons
 * @param {string} title - Main title
 * @param {string} subtitle - Optional subtitle text
 * @param {Array<{label, href}>} breadcrumbs - Breadcrumb trail array
 * @param {React.ReactNode} actions - Optional action buttons
 */
export default function PageTitle({
  title,
  subtitle,
  breadcrumbs,
  actions,
}) {
  return (
    <div className="mb-8">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mb-4 flex items-center gap-1 text-sm">
          {breadcrumbs.map((crumb, idx) => (
            <div key={idx} className="flex items-center gap-1">
              {idx > 0 && <ChevronRight size={16} className="text-gray-400" />}
              {crumb.href ? (
                <Link
                  to={crumb.href}
                  className="text-primary hover:underline transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-gray-600">{crumb.label}</span>
              )}
            </div>
          ))}
        </nav>
      )}

      {/* Title and Action Row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-600 text-sm mt-1">{subtitle}</p>
          )}
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex gap-2 flex-shrink-0">{actions}</div>
        )}
      </div>
    </div>
  )
}
