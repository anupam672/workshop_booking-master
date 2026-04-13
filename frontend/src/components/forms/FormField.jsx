import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * FormField Component
 * Comprehensive form input wrapper supporting both React Hook Form and controlled patterns.
 * 
 * PATTERN A (React Hook Form — pass register function):
 *   <FormField
 *     label="Username"
 *     name="username"
 *     register={register}        ← pass the register FUNCTION
 *     error={errors.username}
 *   />
 * 
 * PATTERN B (Controlled — pass value + onChange manually):
 *   <FormField
 *     label="Username"
 *     name="username"
 *     value={value}
 *     onChange={handleChange}
 *   />
 */
export default function FormField({
  label,
  name,
  type = 'text',
  register,                   // React Hook Form register FUNCTION (optional)
  error,                      // error object from formState.errors.fieldName
  placeholder,
  required = false,
  options = [],               // array of {value, label} for select type
  rows = 3,                   // for textarea
  hint,
  className,
  value,                      // for controlled usage (no register)
  onChange,                   // for controlled usage (no register)
  disabled = false,
  ...rest                     // any other HTML input attributes
}) {
  const [showPassword, setShowPassword] = useState(false)
  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type

  // Get registration props - support both patterns
  const registrationProps = register && name ? register(name) : {}
  
  // If value and onChange provided directly (controlled), use them
  const controlledProps = value !== undefined || onChange 
    ? { value: value || '', onChange } 
    : {}
  
  // Merge: registrationProps take precedence for RHF, controlledProps for manual
  const fieldProps = register ? registrationProps : controlledProps

  // BASE INPUT CLASSES
  const baseClasses = cn(
    'w-full rounded-xl border px-4 py-2.5 text-sm bg-white',
    'transition-all duration-200 focus:outline-none focus:ring-2',
    'font-body placeholder:text-gray-400'
  )

  // NORMAL STATE classes
  const normalClasses = 'border-gray-300 focus:border-primary focus:ring-primary/20'

  // ERROR STATE classes
  const errorClasses = error 
    ? 'border-danger focus:border-danger focus:ring-danger/20 bg-red-50/30' 
    : ''

  // DISABLED STATE
  const disabledClasses = disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed opacity-60' : ''

  return (
    <div className={cn('w-full', className)}>
      
      {/* Label */}
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}

      {/* Input wrapper — needed for password toggle */}
      <div className="relative">
        
        {/* TEXT / EMAIL / NUMBER / TEL / PASSWORD inputs */}
        {type !== 'textarea' && type !== 'select' && (
          <input
            id={name}
            type={inputType}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              baseClasses,
              normalClasses,
              error && errorClasses,
              disabled && disabledClasses,
              type === 'password' && 'pr-11'
            )}
            {...fieldProps}
            {...rest}
          />
        )}

        {/* Password show/hide toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 
                       hover:text-gray-600 transition-colors focus:outline-none"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}

        {/* TEXTAREA */}
        {type === 'textarea' && (
          <textarea
            id={name}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            className={cn(
              baseClasses,
              normalClasses,
              error && errorClasses,
              disabled && disabledClasses,
              'resize-none'
            )}
            {...fieldProps}
            {...rest}
          />
        )}

        {/* SELECT */}
        {type === 'select' && (
          <div className="relative">
            <select
              id={name}
              disabled={disabled}
              className={cn(
                baseClasses,
                normalClasses,
                error && errorClasses,
                disabled && disabledClasses,
                'appearance-none pr-10 cursor-pointer'
              )}
              {...fieldProps}
              {...rest}
            >
              <option value="">-- Select {label} --</option>
              {options?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {/* Custom dropdown arrow */}
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 
                            text-gray-400">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 10.5L3 5.5h10L8 10.5z"/>
              </svg>
            </div>
          </div>
        )}

      </div>

      {/* Error message */}
      {error && (
        <p className="mt-1.5 text-xs text-danger flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm0 4.5a.5.5 0 01.5.5v2a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm0-2a.75.75 0 110 1.5A.75.75 0 016 3.5z"/>
          </svg>
          {error.message || String(error)}
        </p>
      )}

      {/* Hint text (only shown if no error) */}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-gray-500">{hint}</p>
      )}

    </div>
  )
}

