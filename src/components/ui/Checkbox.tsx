'use client'

import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  description?: string
  error?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  className,
  label,
  description,
  error,
  id,
  ...props
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className={cn(
          'relative flex items-start p-4 border rounded-xl cursor-pointer transition-all duration-200',
          'bg-white/50 backdrop-blur-sm hover:bg-white/70',
          'border-blush-200 hover:border-blush-300',
          props.checked && 'border-blush-400 bg-blush-50/50',
          error && 'border-red-400',
          className
        )}
      >
        <input
          type="checkbox"
          id={inputId}
          ref={ref}
          className="w-4 h-4 mt-0.5 text-blush-600 border-blush-300 rounded focus:ring-blush-500 focus:ring-2"
          {...props}
        />

        {(label || description) && (
          <div className="ml-3 flex-1">
            {label && (
              <span className="text-sm font-medium text-burgundy-700">
                {label}
              </span>
            )}
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>
        )}
      </label>

      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
})

Checkbox.displayName = 'Checkbox'

export { Checkbox }