'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Check, ChevronDown, Loader2 } from 'lucide-react'

function normalizeValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return ''
  return String(value)
}

interface InlineEditableTextProps {
  active: boolean
  value: string | number | null | undefined
  onSave: (nextValue: string) => Promise<void>
  placeholder?: string
  type?: string
  trim?: boolean
  className?: string
  displayClassName?: string
  inputClassName?: string
  displayValue?: ReactNode
  emptyDisplay?: ReactNode
  disabled?: boolean
  maxLength?: number
  autoFocus?: boolean
}

export function InlineEditableText({
  active,
  value,
  onSave,
  placeholder,
  type = 'text',
  trim = true,
  className,
  displayClassName,
  inputClassName,
  displayValue,
  emptyDisplay,
  disabled,
  maxLength,
  autoFocus,
}: InlineEditableTextProps) {
  const stableValue = normalizeValue(value)
  const [draft, setDraft] = useState(stableValue)
  const [dirty, setDirty] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [justSaved, setJustSaved] = useState(false)

  useEffect(() => {
    if (!active) {
      setDraft(stableValue)
      setDirty(false)
      setIsSaving(false)
      setJustSaved(false)
    }
  }, [active, stableValue])

  useEffect(() => {
    if (!dirty) {
      setDraft(stableValue)
    }
  }, [stableValue, dirty])

  useEffect(() => {
    if (!justSaved) return
    const timeout = window.setTimeout(() => setJustSaved(false), 1500)
    return () => window.clearTimeout(timeout)
  }, [justSaved])

  const commit = async () => {
    if (!active || isSaving) return
    const prepared = trim ? draft.trim() : draft

    if (!dirty || prepared === stableValue) {
      setDirty(false)
      setDraft(stableValue)
      return
    }

    setIsSaving(true)
    try {
      await onSave(prepared)
      setDirty(false)
      setJustSaved(true)
    } catch (error) {
      console.error('InlineEditableText: failed to save value', error)
      setDraft(stableValue)
      setDirty(false)
    } finally {
      setIsSaving(false)
    }
  }

  const cancel = () => {
    setDraft(stableValue)
    setDirty(false)
    setIsSaving(false)
    setJustSaved(false)
  }

  if (!active) {
    return (
      <span className={cn('inline-flex items-center', className)}>
        {displayValue ?? (
          stableValue ? (
            <span className={cn('leading-5', displayClassName)}>{stableValue}</span>
          ) : (
            emptyDisplay ?? (
              <span className={cn('text-sm text-[#A8A8A8]', displayClassName)}>
                {placeholder || '—'}
              </span>
            )
          )
        )}
      </span>
    )
  }

  return (
    <div className={cn('relative flex items-center', className)}>
      <Input
        value={draft}
        type={type}
        placeholder={placeholder}
        disabled={disabled || isSaving}
        onChange={(event) => {
          setDraft(event.target.value)
          setDirty(true)
          setJustSaved(false)
        }}
        onBlur={() => {
          void commit()
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            event.currentTarget.blur()
          }
          if (event.key === 'Escape') {
            event.preventDefault()
            cancel()
            event.currentTarget.blur()
          }
        }}
        className={cn('pr-8 text-sm', inputClassName)}
        maxLength={maxLength}
        autoFocus={autoFocus}
      />
      {isSaving ? (
        <Loader2 className="absolute right-2 h-4 w-4 animate-spin text-gray-400" />
      ) : justSaved ? (
        <Check className="absolute right-2 h-4 w-4 text-green-500" />
      ) : null}
    </div>
  )
}

interface SelectOption {
  value: string
  label: string
}

interface InlineEditableSelectProps {
  active: boolean
  value: string | null | undefined
  options: SelectOption[]
  onSave: (nextValue: string) => Promise<void>
  placeholder?: string
  className?: string
  displayClassName?: string
  displayValue?: ReactNode
  emptyDisplay?: ReactNode
  disabled?: boolean
}

export function InlineEditableSelect({
  active,
  value,
  options,
  onSave,
  placeholder,
  className,
  displayClassName,
  displayValue,
  emptyDisplay,
  disabled,
}: InlineEditableSelectProps) {
  const baseValue = value ?? ''
  const [draft, setDraft] = useState(baseValue)
  const [dirty, setDirty] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [justSaved, setJustSaved] = useState(false)

  useEffect(() => {
    if (!active) {
      setDraft(baseValue)
      setDirty(false)
      setIsSaving(false)
      setJustSaved(false)
    }
  }, [active, baseValue])

  useEffect(() => {
    if (!dirty) {
      setDraft(baseValue)
    }
  }, [baseValue, dirty])

  useEffect(() => {
    if (!justSaved) return
    const timeout = window.setTimeout(() => setJustSaved(false), 1500)
    return () => window.clearTimeout(timeout)
  }, [justSaved])

  const commit = async (nextValue: string) => {
    if (!active || isSaving) return

    if (!dirty && nextValue === baseValue) {
      return
    }

    if (nextValue === baseValue) {
      setDirty(false)
      return
    }

    setIsSaving(true)
    try {
      await onSave(nextValue)
      setDirty(false)
      setJustSaved(true)
    } catch (error) {
      console.error('InlineEditableSelect: failed to save value', error)
      setDraft(baseValue)
      setDirty(false)
    } finally {
      setIsSaving(false)
    }
  }

  const currentOption = options.find((option) => option.value === baseValue)

  if (!active) {
    return (
      <span className={cn('inline-flex items-center', className)}>
        {displayValue ?? (
          currentOption ? (
            <span className={cn('leading-5', displayClassName)}>{currentOption.label}</span>
          ) : (
            emptyDisplay ?? (
              <span className={cn('text-sm text-[#A8A8A8]', displayClassName)}>
                {placeholder || 'Selecionar'}
              </span>
            )
          )
        )}
      </span>
    )
  }

  return (
    <div className={cn('relative flex items-center', className)}>
      <select
        value={draft}
        disabled={disabled || isSaving}
        onChange={async (event) => {
          const next = event.target.value
          setDraft(next)
          setDirty(true)
          await commit(next)
        }}
        onBlur={async () => {
          if (!dirty) return
          await commit(draft)
        }}
        className={cn(
          'w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#2C2C2C]',
          displayClassName
        )}
      >
        <option value="" disabled>
          {placeholder || 'Selecionar'}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {isSaving ? (
        <Loader2 className="absolute right-2 h-4 w-4 animate-spin text-gray-400" />
      ) : justSaved ? (
        <Check className="absolute right-2 h-4 w-4 text-green-500" />
      ) : (
        <ChevronDown className="pointer-events-none absolute right-2 h-4 w-4 text-gray-400" />
      )}
    </div>
  )
}
