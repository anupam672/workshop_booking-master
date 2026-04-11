import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * FormField Component
 * Wrapper for form inputs with labels, error messages, and hints
 * Handles text, email, password, number, tel, textarea, and select inputs
 * @param {string} label - Field label
 * @param {string} name - Field name/register key
 * @param {string} type - Input type (text, email, password, number, tel, textarea, select)
 * @param {Function} register - React Hook Form register function
 * @param {string} error - Error message (falsy if no error)
 * @param {string} placeholder - Input placeholder
 * @param {boolean} required - Show required indicator
 * @param {Array<{value, label}>} options - Options for select type
 * @param {number} rows - Number of rows for textarea
 * @param {string} hint - Helper text below input
 * @param {string} className - Additional wrapper classes
 */
export default function FormField({
  label,
  name,
  type = 'text',
  register,
  error,
  placeholder,
  required = false,
  options = [],
  rows = 3,
  hint,
  className,
  ...inputProps
}) {
  const [showPassword, setShowPassword] = useState(false)

  const baseInputClasses =
    'w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none'

  const errorClasses = error
    ? 'border-danger focus:border-danger focus:ring-danger/20'
    : ''

  // Render select input
  if (type === 'select') {
    return (
      <div className={cn('mb-4', className)}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-danger ml-0.5">*</span>}
          </label>
        )}
        <select
          {...register(name)}
          className={cn(baseInputClasses, errorClasses)}
          {...inputProps}
        >
          <option value="">-- Select --</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-danger mt-1">{error}</p>}
        {!error && hint && (
          <p className="text-xs text-gray-500 mt-1">{hint}</p>
        )}
      </div>
    )
  }

  // Render textarea
  if (type === 'textarea') {
    return (
      <div className={cn('mb-4', className)}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-danger ml-0.5">*</span>}
          </label>
        )}
        <textarea
          {...register(name)}
          rows={rows}
          placeholder={placeholder}
          className={cn(baseInputClasses, errorClasses, 'resize-none')}
          {...inputProps}
        />
        {error && <p className="text-xs text-danger mt-1">{error}</p>}
        {!error && hint && (
          <p className="text-xs text-gray-500 mt-1">{hint}</p>
        )}
      </div>
    )
  }

  // Render password input with show/hide toggle
  if (type === 'password') {
    return (
      <div className={cn('mb-4', className)}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-danger ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            {...register(name)}
            type={showPassword ? 'text' : 'password'}
            placeholder={placeholder}
            className={cn(baseInputClasses, errorClasses, 'pr-12')}
            {...inputProps}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {error && <p className="text-xs text-danger mt-1">{error}</p>}
        {!error && hint && (
          <p className="text-xs text-gray-500 mt-1">{hint}</p>
        )}
      </div>
    )
  }

  // Render standard input
  return (
    <div className={cn('mb-4', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      <input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        className={cn(baseInputClasses, errorClasses)}
        {...inputProps}
      />
      {error && <p className="text-xs text-danger mt-1">{error}</p>}
      {!error && hint && (
        <p className="text-xs text-gray-500 mt-1">{hint}</p>
      )}
    </div>
  )
}

