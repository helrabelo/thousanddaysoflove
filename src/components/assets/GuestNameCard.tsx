'use client'

import React from 'react'
import Image from 'next/image'

interface GuestNameCardProps {
  name: string
  tableNumber: string // Not used anymore, but keeping for API compatibility
}

export default function GuestNameCard({ name }: GuestNameCardProps) {
  return (
    <div
      className="relative bg-[var(--background)]"
      style={{
        width: '500px',
        height: '900px',
        aspectRatio: '5/9'
      }}
    >
      {/* TOP HALF - Will be upside down when folded (just logo) */}
      <div className="absolute inset-0 top-0 h-1/2 flex items-center justify-center" style={{ transform: 'rotate(180deg)' }}>
        <div className="relative z-10">
          <Image
            src="/hy-logo.svg"
            alt="H & Y"
            width={120}
            height={40}
            className="opacity-80"
          />
        </div>
      </div>

      {/* FOLD LINE - Dashed line in the middle */}
      <div className="absolute left-0 right-0 top-1/2 flex items-center justify-center" style={{ transform: 'translateY(-50%)' }}>
        <div className="w-full border-t-2 border-dashed border-[var(--decorative)] opacity-30" />
      </div>

      {/* BOTTOM HALF - Main display side with guest name */}
      <div className="absolute inset-0 top-1/2 h-1/2 flex flex-col items-center justify-center">
        {/* Top botanical corner */}
        <div className="absolute top-0 right-0 w-24 opacity-15">
          <Image
            src="/corner-plant.svg"
            alt=""
            width={971}
            height={1752}
            className="w-full h-auto"
            style={{ filter: 'brightness(0) saturate(100%)' }}
          />
        </div>

        {/* Bottom botanical corner */}
        <div className="absolute bottom-0 left-0 w-24 opacity-15" style={{ transform: 'rotate(180deg)' }}>
          <Image
            src="/corner-plant.svg"
            alt=""
            width={971}
            height={1752}
            className="w-full h-auto"
            style={{ filter: 'brightness(0) saturate(100%)' }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-12 text-center w-full">
          {/* HY Logo PNG */}
          <div className="mb-6">
            <Image
              src="/hy-logo.svg"
              alt="H & Y"
              width={150}
              height={51}
              className="opacity-80"
            />
          </div>

          {/* Decorative divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-16 bg-[var(--decorative)]" />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="2" fill="var(--decorative)" opacity="0.4"/>
            </svg>
            <div className="h-px w-16 bg-[var(--decorative)]" />
          </div>

          {/* Guest Name */}
          <div className="mb-8">
            <h2
              className="font-heading text-4xl text-[var(--primary-text)] leading-tight"
              style={{
                wordBreak: 'break-word',
                hyphens: 'auto'
              }}
            >
              {name}
            </h2>
          </div>

          {/* Date */}
          <div>
            <p className="font-body text-sm text-[var(--secondary-text)] tracking-wider">
              20 • NOVEMBRO • 2025
            </p>
          </div>
        </div>

        {/* Decorative border on bottom half */}
        <div className="absolute inset-4 border border-[var(--decorative)] opacity-15 rounded-sm" />
      </div>

      {/* Subtle background pattern on entire card */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots-namecard" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="var(--decorative)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots-namecard)" />
        </svg>
      </div>
    </div>
  )
}
