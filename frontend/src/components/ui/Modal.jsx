import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * Modal Component
 * Uses native <dialog> element with Framer Motion animations
 * Supports focus trapping and backdrop click/Esc to close
 * @param {boolean} isOpen - Whether modal is open
 * @param {() => void} onClose - Close handler
 * @param {string} title - Modal title (optional)
 * @param {React.ReactNode} children - Modal content
 * @param {React.ReactNode} footer - Footer content (optional)
 * @param {string} size - Modal size (sm, md, lg, xl)
 */
function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  className,
}) {
  const dialogRef = useRef(null)
  const previousActiveElement = useRef(null)

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      previousActiveElement.current = document.activeElement
      dialogRef.current.showModal()

      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose()
        }
      }

      const handleBackdropClick = (e) => {
        if (e.target === dialogRef.current) {
          onClose()
        }
      }

      document.addEventListener('keydown', handleEscape)
      dialogRef.current.addEventListener('click', handleBackdropClick)

      return () => {
        document.removeEventListener('keydown', handleEscape)
        if (dialogRef.current) {
          dialogRef.current.removeEventListener('click', handleBackdropClick)
        }
      }
    } else if (!isOpen && dialogRef.current) {
      dialogRef.current.close()
      if (previousActiveElement.current?.focus) {
        previousActiveElement.current.focus()
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 overflow-auto backdrop:bg-black/50"
      style={{
        '--dialog-transition': 'opacity 0.2s ease-out, transform 0.2s ease-out',
      }}
    >
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            key="modal-content"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none"
          >
            <div
              className={cn(
                'bg-white rounded-2xl shadow-lg pointer-events-auto w-full mx-4',
                sizeClasses[size],
                className
              )}
            >
              {/* Header */}
              {title && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-heading font-bold text-gray-900">
                    {title}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
                    aria-label="Close modal"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}

              {/* Body */}
              <div className="overflow-y-auto max-h-96 px-6 py-4">
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="px-6 py-4 border-t border-gray-100">
                  {footer}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </dialog>,
    document.body
  )
}

/**
 * Modal Header - Optional override for custom header
 */
function ModalHeader({ children, className, ...rest }) {
  return (
    <div
      className={cn('px-6 py-4 border-b border-gray-100', className)}
      {...rest}
    >
      {children}
    </div>
  )
}

/**
 * Modal Body - Optional override for custom body
 */
function ModalBody({ children, className, ...rest }) {
  return (
    <div
      className={cn('overflow-y-auto max-h-96 px-6 py-4', className)}
      {...rest}
    >
      {children}
    </div>
  )
}

/**
 * Modal Footer - Optional override for custom footer
 */
function ModalFooter({ children, className, ...rest }) {
  return (
    <div
      className={cn('px-6 py-4 border-t border-gray-100', className)}
      {...rest}
    >
      {children}
    </div>
  )
}

Modal.Header = ModalHeader
Modal.Body = ModalBody
Modal.Footer = ModalFooter

export default Modal

