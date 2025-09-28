'use client'

import { cn } from '@/lib/utils'

interface RadioOption {
  value: string
  label: string
  description?: string
}

interface RadioGroupProps {
  name: string
  value?: string
  onChange: (value: string) => void
  options: RadioOption[]
  label?: string
  error?: string
  className?: string
  required?: boolean
}

export function RadioGroup({
  name,
  value,
  onChange,
  options,
  label,
  error,
  className,
  required
}: RadioGroupProps) {
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <legend className="block text-sm font-medium text-burgundy-700 mb-3">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </legend>
      )}

      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              'relative flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200',
              'bg-white/50 backdrop-blur-sm hover:bg-white/70',
              'border-blush-200 hover:border-blush-300',
              value === option.value && 'border-blush-400 bg-blush-50/50',
              error && 'border-red-400'
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="w-4 h-4 text-blush-600 border-blush-300 focus:ring-blush-500 focus:ring-2"
            />
            <div className="ml-3 flex-1">
              <span className="text-sm font-medium text-burgundy-700">
                {option.label}
              </span>
              {option.description && (
                <p className="text-sm text-gray-600 mt-1">{option.description}</p>
              )}
            </div>
          </label>
        ))}
      </div>

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
}