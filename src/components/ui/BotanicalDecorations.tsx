'use client'

import React from 'react'

// Corner flourish SVG component (eucalyptus branches)
export const CornerFlourish: React.FC<{
  className?: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: 'sm' | 'md' | 'lg';
}> = ({ className = '', position, size = 'md' }) => {
  const sizes = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24'
  }

  const rotations = {
    'top-left': 'rotate-0',
    'top-right': 'rotate-90',
    'bottom-right': 'rotate-180',
    'bottom-left': 'rotate-[270deg]'
  }

  return (
    <div className={`absolute pointer-events-none opacity-60 ${sizes[size]} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full ${rotations[position]}`}
      >
        <g stroke="var(--decorative)" strokeWidth="1.5" fill="none">
          {/* Main eucalyptus branch */}
          <path d="M20 80 Q35 65 50 50 Q65 35 80 20" strokeLinecap="round"/>

          {/* Eucalyptus leaves - left side */}
          <ellipse cx="28" cy="72" rx="4" ry="8" transform="rotate(-45 28 72)" opacity="0.7"/>
          <ellipse cx="35" cy="65" rx="3" ry="6" transform="rotate(-45 35 65)" opacity="0.6"/>
          <ellipse cx="42" cy="58" rx="4" ry="7" transform="rotate(-45 42 58)" opacity="0.8"/>

          {/* Eucalyptus leaves - right side */}
          <ellipse cx="32" cy="68" rx="3" ry="7" transform="rotate(-135 32 68)" opacity="0.6"/>
          <ellipse cx="39" cy="61" rx="4" ry="8" transform="rotate(-135 39 61)" opacity="0.7"/>
          <ellipse cx="46" cy="54" rx="3" ry="6" transform="rotate(-135 46 54)" opacity="0.6"/>

          {/* Secondary small branches */}
          <path d="M30 70 Q25 65 22 60" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
          <path d="M45 55 Q40 50 37 45" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>

          {/* Small berries/buds */}
          <circle cx="22" cy="60" r="1.5" fill="var(--decorative)" opacity="0.4"/>
          <circle cx="37" cy="45" r="1.5" fill="var(--decorative)" opacity="0.4"/>
          <circle cx="75" cy="25" r="1.5" fill="var(--decorative)" opacity="0.4"/>
        </g>
      </svg>
    </div>
  )
}

// Section divider SVG component (delicate botanical sprig)
export const SectionDivider: React.FC<{ className?: string; variant?: 'horizontal' | 'vertical' }> = ({
  className = '',
  variant = 'horizontal'
}) => {
  if (variant === 'vertical') {
    return (
      <div className={`flex justify-center my-16 ${className}`}>
        <svg width="4" height="120" viewBox="0 0 4 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g stroke="var(--decorative)" strokeWidth="1" fill="none" opacity="0.6">
            <line x1="2" y1="0" x2="2" y2="120" strokeLinecap="round"/>
            <circle cx="2" cy="20" r="2" fill="var(--decorative)" opacity="0.3"/>
            <circle cx="2" cy="60" r="2" fill="var(--decorative)" opacity="0.3"/>
            <circle cx="2" cy="100" r="2" fill="var(--decorative)" opacity="0.3"/>
          </g>
        </svg>
      </div>
    )
  }

  return (
    <div className={`flex justify-center my-16 ${className}`}>
      <svg width="200" height="24" viewBox="0 0 200 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g stroke="var(--decorative)" strokeWidth="1.5" fill="none" opacity="0.6">
          {/* Central stem */}
          <path d="M40 12 Q70 8 100 12 Q130 16 160 12" strokeLinecap="round"/>

          {/* Small leaves and flowers along the stem */}
          <ellipse cx="55" cy="10" rx="2" ry="4" transform="rotate(-20 55 10)" opacity="0.7"/>
          <ellipse cx="75" cy="14" rx="2" ry="4" transform="rotate(30 75 14)" opacity="0.7"/>
          <ellipse cx="125" cy="10" rx="2" ry="4" transform="rotate(-40 125 10)" opacity="0.7"/>
          <ellipse cx="145" cy="14" rx="2" ry="4" transform="rotate(20 145 14)" opacity="0.7"/>

          {/* Central flower */}
          <circle cx="100" cy="12" r="3" stroke="var(--decorative)" strokeWidth="1" fill="none" opacity="0.4"/>
          <circle cx="100" cy="12" r="1.5" fill="var(--decorative)" opacity="0.3"/>

          {/* Decorative dots */}
          <circle cx="30" cy="12" r="1" fill="var(--decorative)" opacity="0.5"/>
          <circle cx="170" cy="12" r="1" fill="var(--decorative)" opacity="0.5"/>
        </g>
      </svg>
    </div>
  )
}

// Small accent element for cards
export const CardAccent: React.FC<{ className?: string; variant?: 'top' | 'bottom' | 'corner' }> = ({
  className = '',
  variant = 'corner'
}) => {
  if (variant === 'top') {
    return (
      <div className={`absolute top-4 right-4 opacity-40 ${className}`}>
        <svg width="32" height="16" viewBox="0 0 32 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g stroke="var(--decorative)" strokeWidth="1" fill="none">
            <path d="M4 8 Q12 4 20 8 Q24 10 28 8" strokeLinecap="round"/>
            <circle cx="16" cy="8" r="1.5" fill="var(--decorative)" opacity="0.6"/>
          </g>
        </svg>
      </div>
    )
  }

  if (variant === 'bottom') {
    return (
      <div className={`absolute bottom-4 left-4 opacity-40 ${className}`}>
        <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g stroke="var(--decorative)" strokeWidth="1" fill="none">
            <path d="M2 6 Q8 2 14 6 Q18 8 22 6" strokeLinecap="round"/>
            <ellipse cx="8" cy="4" rx="1" ry="2" opacity="0.5"/>
            <ellipse cx="16" cy="8" rx="1" ry="2" opacity="0.5"/>
          </g>
        </svg>
      </div>
    )
  }

  return (
    <div className={`absolute top-3 right-3 opacity-40 ${className}`}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g stroke="var(--decorative)" strokeWidth="1" fill="none">
          <path d="M5 15 Q10 10 15 15" strokeLinecap="round"/>
          <path d="M6 12 Q10 8 14 12" strokeLinecap="round" opacity="0.7"/>
          <circle cx="10" cy="10" r="1" fill="var(--decorative)" opacity="0.4"/>
        </g>
      </svg>
    </div>
  )
}

// Wildflower motif for special sections
export const WildflowerMotif: React.FC<{ className?: string; size?: 'sm' | 'md' | 'lg' }> = ({
  className = '',
  size = 'md'
}) => {
  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  }

  return (
    <div className={`${sizes[size]} opacity-50 ${className}`}>
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g stroke="var(--decorative)" strokeWidth="1.5" fill="none">
          {/* Main stem */}
          <path d="M32 54 L32 24" strokeLinecap="round"/>

          {/* Flower petals */}
          <ellipse cx="32" cy="20" rx="4" ry="8" opacity="0.7"/>
          <ellipse cx="32" cy="20" rx="8" ry="4" opacity="0.6"/>
          <ellipse cx="32" cy="20" rx="6" ry="6" transform="rotate(45 32 20)" opacity="0.5"/>
          <ellipse cx="32" cy="20" rx="6" ry="6" transform="rotate(-45 32 20)" opacity="0.5"/>

          {/* Flower center */}
          <circle cx="32" cy="20" r="2" fill="var(--decorative)" opacity="0.4"/>

          {/* Small leaves */}
          <ellipse cx="28" cy="35" rx="3" ry="6" transform="rotate(-30 28 35)" opacity="0.6"/>
          <ellipse cx="36" cy="40" rx="3" ry="6" transform="rotate(30 36 40)" opacity="0.6"/>

          {/* Small buds */}
          <circle cx="30" cy="28" r="1.5" fill="var(--decorative)" opacity="0.3"/>
          <circle cx="34" cy="32" r="1.5" fill="var(--decorative)" opacity="0.3"/>
        </g>
      </svg>
    </div>
  )
}