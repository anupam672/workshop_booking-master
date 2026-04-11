import { cn } from '../../utils/cn'

/**
 * FormField Component - Wrapper for form fields with labels and error messages
 */
export function FormField({
  label,
  error,
  required,
  children,
  className,
  ...props
}) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-600">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  )
}

/**
 * SelectField Component
 */
export function SelectField({
  label,
  error,
  required,
  options = [],
  className,
  ...props
}) {
  return (
    <FormField label={label} error={error} required={required}>
      <select
        className={cn(
          'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
          error && 'border-red-500',
          className
        )}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  )
}

export default FormField
