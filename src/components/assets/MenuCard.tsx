'use client'

import React from 'react'
import Image from 'next/image'

export default function MenuCard() {
  return (
    <div className="flex gap-4">
      {/* FRONT SIDE */}
      <div
        className="relative bg-[var(--background)] overflow-hidden"
        style={{
          width: '374px', // 99mm at 96 DPI
          height: '794px', // 210mm at 96 DPI
        }}
      >
        {/* Top botanical corner */}
        <div className="absolute top-0 right-0 w-20 opacity-12">
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
        <div className="absolute bottom-0 left-0 w-20 opacity-12" style={{ transform: 'rotate(180deg)' }}>
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
        <div className="relative z-10 h-full flex flex-col items-center justify-center py-12 px-8">
          {/* Title at top */}
          <h1 className="font-heading text-5xl text-[var(--primary-text)] mb-16">
            Menu
          </h1>

          {/* HY Logo in center */}
          <div className="flex flex-grow justify-center mb-10">
            <Image
              src="/hy-logo.svg"
              alt="H & Y"
              width={140}
              height={47}
              className="opacity-80"
            />
          </div>

          {/* Date at bottom */}
          <div className="mt-auto">
            <p className="font-body text-sm text-[var(--secondary-text)] tracking-wider">
              20 DE NOVEMBRO DE 2025
            </p>
          </div>
        </div>

        {/* Decorative border */}
        <div className="absolute inset-4 border border-[var(--decorative)] opacity-15 rounded-sm pointer-events-none" />
      </div>

      {/* BACK SIDE */}
      <div
        className="relative bg-[var(--background)] overflow-hidden"
        style={{
          width: '374px', // 99mm at 96 DPI
          height: '794px', // 210mm at 96 DPI
        }}
      >
        {/* Top botanical corner */}
        <div className="absolute top-0 left-0 w-16 opacity-10" style={{ transform: 'scaleX(-1)' }}>
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
        <div className="absolute bottom-0 right-0 w-16 opacity-10" style={{ transform: 'rotate(180deg) scaleX(-1)' }}>
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
        <div className="relative z-10 h-full flex flex-col py-6 px-6">
          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="font-heading text-xl text-[var(--primary-text)] mb-2">
              Menu
            </h2>
            <div className="h-px w-20 bg-[var(--decorative)] opacity-30 mx-auto" />
          </div>

          {/* Menu Content - Compact */}
          <div className="flex flex-col justify-center flex-1 space-y-3 text-[var(--primary-text)]">
            {/* Entradas */}
            <div>
              <h3 className="font-heading text-xs uppercase tracking-wider mb-1.5 text-center">Entradas</h3>
              <div className="font-body text-[10px] leading-relaxed space-y-0.5 text-[var(--secondary-text)]">
                <p>• Carpaccio especial de carne com mel trufado</p>
                <p>• Camarão croc com redução de tamarindo</p>
                <p>• Salgadinhos fritos e forneados</p>
                <p>• Dadinho de tapioca com geleia de pimenta</p>
              </div>
            </div>

            {/* Divider */}
            <div className="flex justify-center py-1">
              <div className="h-px w-12 bg-[var(--decorative)] opacity-20" />
            </div>

            {/* Principal */}
            <div>
              <h3 className="font-heading text-xs uppercase tracking-wider mb-1.5 text-center">Principal</h3>
              <div className="font-body text-[10px] leading-relaxed space-y-0.5 text-[var(--secondary-text)]">
                <p>• Filé mignon ao molho de vinho e cogumelos</p>
                <p>• Salmão mediterrâneo grelhado</p>
                <p>• Arroz branco com amêndoas</p>
                <p>• Risotinho de limão siciliano</p>
                <p>• Salada verde com gorgonzola e morangos</p>
              </div>
            </div>

            {/* Divider */}
            <div className="flex justify-center py-1">
              <div className="h-px w-12 bg-[var(--decorative)] opacity-20" />
            </div>

            {/* Sobremesas */}
            <div>
              <h3 className="font-heading text-xs uppercase tracking-wider mb-1.5 text-center">Sobremesas</h3>
              <div className="font-body text-[10px] leading-relaxed space-y-0.5 text-[var(--secondary-text)]">
                <p>• Doces finos</p>
                <p>• Bem-casados</p>
                <p>• Torta de chocolate</p>
                <p>• Pudim</p>
              </div>
            </div>

            {/* Divider */}
            <div className="flex justify-center py-1">
              <div className="h-px w-12 bg-[var(--decorative)] opacity-20" />
            </div>

            {/* Bebidas */}
            <div>
              <h3 className="font-heading text-xs uppercase tracking-wider mb-1.5 text-center">Bebidas</h3>
              <div className="font-body text-[10px] leading-relaxed space-y-0.5 text-[var(--secondary-text)]">
                <p>• Água mineral sem gás</p>
                <p>• Sucos acerola e abacaxi</p>
                <p>• Refrigerante (tradicional e zero)</p>
                <p>• Vinho Branco</p>
                <p>• Espumante</p>
              </div>
            </div>

            {/* Divider */}
            <div className="flex justify-center py-1">
              <div className="h-px w-12 bg-[var(--decorative)] opacity-20" />
            </div>

            {/* Digestivos */}
            <div>
              <h3 className="font-heading text-xs uppercase tracking-wider mb-1.5 text-center">Digestivos</h3>
              <div className="font-body text-[10px] leading-relaxed space-y-0.5 text-[var(--secondary-text)]">
                <p>• Café</p>
                <p>• Bolo de casamento</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-4 pt-3 border-t border-[var(--decorative)] border-opacity-15">
            <p className="font-body text-[10px] text-[var(--secondary-text)] italic">
              Bom apetite!
            </p>
          </div>
        </div>

        {/* Subtle border */}
        <div className="absolute inset-3 border border-[var(--decorative)] opacity-10 rounded-sm pointer-events-none" />
      </div>
    </div>
  )
}
