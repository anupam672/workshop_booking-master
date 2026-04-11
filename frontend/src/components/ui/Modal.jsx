import { cn } from '../../utils/cn'
import { X } from 'lucide-react'

/**
 * Modal Component
 */
export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  ...props
}) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 max-w-md w-full mx-4',
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            {title && <h2 className="text-xl font-bold">{title}</h2>}
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </>
  )
}

export default Modal
