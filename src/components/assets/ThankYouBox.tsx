'use client'

import React from 'react'
import Image from 'next/image'

export default function ThankYouBox() {
  return (
    <div
      className="relative bg-[var(--background)] flex flex-col items-center justify-center"
      style={{
        width: '450px',
        height: '550px',
        aspectRatio: '4.5/5.5'
      }}
    >
      {/* Top Right botanical corner */}
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

      {/* Bottom Left botanical corner */}
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
      <div className="relative z-10 flex flex-col items-center justify-center px-12 text-center">
        {/* HY Logo */}
        <div className="mb-6">
          <Image
            src="/hy-logo.svg"
            alt="H & Y"
            width={120}
            height={41}
            className="opacity-80"
          />
        </div>

        {/* Thank You Message */}
        <div className="mb-8">
          <h2 className="font-heading text-3xl text-[var(--primary-text)] mb-3">
            Obrigado!
          </h2>
          <p className="font-body text-base text-[var(--secondary-text)] italic leading-relaxed">
            Por fazer parte do nosso
            <br />
            dia mais especial
          </p>
        </div>

        {/* Date */}
        <div>
          <p className="font-body text-xs text-[var(--secondary-text)] tracking-widest">
            20 • 11 • 2025
          </p>
        </div>

        {/* Small heart accent */}
        <div className="mt-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="var(--decorative)" opacity="0.2"/>
          </svg>
        </div>
      </div>

      {/* Subtle border */}
      <div className="absolute inset-4 border border-[var(--decorative)] opacity-20 rounded-sm" />
    </div>
  )
}
