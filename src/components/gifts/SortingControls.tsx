'use client'

/**
 * Sorting Controls Component
 * Elegant dropdown for sorting gift registry with wedding aesthetic
 */

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Shuffle } from 'lucide-react'
import { SortOption, SORT_OPTIONS } from '@/lib/utils/sorting'

interface SortingControlsProps {
  currentSort: SortOption
  onSortChange: (sort: SortOption) => void
  totalItems: number
}

export default function SortingControls({ currentSort, onSortChange, totalItems }: SortingControlsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentOption = SORT_OPTIONS.find((opt) => opt.value === currentSort) || SORT_OPTIONS[0]

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSortChange = (value: SortOption) => {
    onSortChange(value)
    setIsOpen(false)
  }

  return (
    <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
      {/* Item Count */}
      <div
        className="text-sm"
        style={{
          fontFamily: 'var(--font-crimson)',
          color: 'var(--secondary-text)',
          fontStyle: 'italic',
        }}
      >
        {totalItems} {totalItems === 1 ? 'presente' : 'presentes'} disponíveis
      </div>

      {/* Sorting Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 hover:shadow-md"
          style={{
            borderColor: 'var(--decorative)',
            backgroundColor: 'var(--background)',
            color: 'var(--primary-text)',
          }}
        >
          <Shuffle className="w-4 h-4" style={{ color: 'var(--decorative)' }} />
          <span
            className="text-sm font-medium"
            style={{
              fontFamily: 'var(--font-crimson)',
            }}
          >
            {currentOption.label}
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            style={{ color: 'var(--decorative)' }}
          />
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-72 rounded-xl shadow-2xl border overflow-hidden z-50"
              style={{
                backgroundColor: 'var(--background)',
                borderColor: 'var(--decorative)',
              }}
            >
              <div className="p-2">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className="w-full text-left px-4 py-3 rounded-lg transition-all duration-200 hover:shadow-md"
                    style={{
                      backgroundColor:
                        currentSort === option.value ? 'var(--accent)' : 'transparent',
                      color: 'var(--primary-text)',
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Radio indicator */}
                      <div className="mt-1">
                        <div
                          className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                          style={{
                            borderColor:
                              currentSort === option.value
                                ? 'var(--decorative)'
                                : 'var(--secondary-text)',
                          }}
                        >
                          {currentSort === option.value && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: 'var(--decorative)' }}
                            />
                          )}
                        </div>
                      </div>

                      {/* Option content */}
                      <div className="flex-1">
                        <div
                          className="font-medium mb-1"
                          style={{
                            fontFamily: 'var(--font-playfair)',
                            fontSize: '0.9375rem',
                          }}
                        >
                          {option.label}
                        </div>
                        <div
                          className="text-xs"
                          style={{
                            fontFamily: 'var(--font-crimson)',
                            color: 'var(--secondary-text)',
                            fontStyle: 'italic',
                          }}
                        >
                          {option.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Footer note for random sort */}
              {currentSort === 'random' && (
                <div
                  className="px-4 py-3 text-xs border-t"
                  style={{
                    backgroundColor: 'var(--accent)',
                    borderColor: 'var(--decorative)',
                    fontFamily: 'var(--font-crimson)',
                    color: 'var(--secondary-text)',
                    fontStyle: 'italic',
                  }}
                >
                  💡 A ordem aleatória permanece a mesma durante sua visita, mas muda quando você
                  volta depois
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
