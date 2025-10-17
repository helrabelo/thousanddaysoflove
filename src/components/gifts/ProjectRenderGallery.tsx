'use client'

/**
 * Project Render Gallery Component
 *
 * Displays renovation project renders in an elegant masonry grid.
 * Shows before/after, 3D renders, floor plans, and detail shots.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react'
import type { ProjectRender } from '@/types/wedding'

interface ProjectRenderGalleryProps {
  title: string
  description: string
  renders: ProjectRender[]
}

export default function ProjectRenderGallery({
  title,
  description,
  renders,
}: ProjectRenderGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  if (!renders || renders.length === 0) {
    return null
  }

  const sortedRenders = [...renders].sort((a, b) => a.displayOrder - b.displayOrder)

  const openLightbox = (index: number) => {
    setSelectedIndex(index)
    document.body.style.overflow = 'hidden' // Prevent background scrolling
  }

  const closeLightbox = () => {
    setSelectedIndex(null)
    document.body.style.overflow = '' // Restore scrolling
  }

  const goToPrevious = () => {
    if (selectedIndex === null) return
    setSelectedIndex(selectedIndex === 0 ? sortedRenders.length - 1 : selectedIndex - 1)
  }

  const goToNext = () => {
    if (selectedIndex === null) return
    setSelectedIndex(selectedIndex === sortedRenders.length - 1 ? 0 : selectedIndex + 1)
  }

  const getRenderTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      before: 'Antes',
      after: 'Depois',
      '3d-render': 'Render 3D',
      'floor-plan': 'Planta',
      detail: 'Detalhe',
    }
    return labels[type] || type
  }

  const currentRender = selectedIndex !== null ? sortedRenders[selectedIndex] : null

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{
              fontFamily: 'var(--font-playfair)',
              color: 'var(--primary-text)',
              letterSpacing: '0.15em',
            }}
          >
            {title}
          </h2>
          <div className="w-24 h-px mx-auto mb-6" style={{ background: 'var(--decorative)' }} />
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto"
            style={{
              fontFamily: 'var(--font-crimson)',
              color: 'var(--secondary-text)',
              fontStyle: 'italic',
            }}
          >
            {description}
          </p>
        </motion.div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedRenders.map((render, index) => (
            <motion.div
              key={render._key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative rounded-xl overflow-hidden cursor-pointer"
              style={{
                background: 'var(--white-soft)',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 2px 8px var(--shadow-subtle)',
              }}
              onClick={() => openLightbox(index)}
              whileHover={{ y: -4, boxShadow: '0 8px 20px var(--shadow-subtle)' }}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={render.asset.url}
                  alt={render.alt || render.title || 'Projeto de renovação'}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300" />

                {/* Zoom Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ZoomIn className="w-12 h-12 text-white" />
                </div>

                {/* Render Type Badge */}
                <div
                  className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
                  style={{
                    background: 'rgba(168, 168, 168, 0.9)',
                    color: 'var(--white-soft)',
                    fontFamily: 'var(--font-crimson)',
                  }}
                >
                  {getRenderTypeLabel(render.renderType)}
                </div>
              </div>

              {/* Caption */}
              {render.title && (
                <div className="p-4">
                  <h3
                    className="text-lg font-semibold mb-1"
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      color: 'var(--primary-text)',
                    }}
                  >
                    {render.title}
                  </h3>
                  {render.caption && (
                    <p
                      className="text-sm line-clamp-2"
                      style={{
                        fontFamily: 'var(--font-crimson)',
                        color: 'var(--secondary-text)',
                        fontStyle: 'italic',
                      }}
                    >
                      {render.caption}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && currentRender && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            style={{ background: 'rgba(0, 0, 0, 0.95)' }}
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 z-50 p-2 rounded-full hover:bg-white/10 transition-colors"
              onClick={closeLightbox}
              aria-label="Fechar"
            >
              <X className="w-8 h-8 text-white" />
            </button>

            {/* Navigation Arrows */}
            {sortedRenders.length > 1 && (
              <>
                <button
                  className="absolute left-4 z-50 p-3 rounded-full hover:bg-white/10 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    goToPrevious()
                  }}
                  aria-label="Anterior"
                >
                  <ChevronLeft className="w-8 h-8 text-white" />
                </button>
                <button
                  className="absolute right-4 z-50 p-3 rounded-full hover:bg-white/10 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    goToNext()
                  }}
                  aria-label="Próximo"
                >
                  <ChevronRight className="w-8 h-8 text-white" />
                </button>
              </>
            )}

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-6xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image */}
              <div className="relative w-full h-[70vh] flex items-center justify-center">
                <Image
                  src={currentRender.asset.url}
                  alt={currentRender.alt || currentRender.title || 'Projeto de renovação'}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>

              {/* Caption */}
              {(currentRender.title || currentRender.caption) && (
                <div className="mt-6 text-center max-w-3xl">
                  {currentRender.title && (
                    <h3
                      className="text-2xl font-bold mb-2 text-white"
                      style={{ fontFamily: 'var(--font-playfair)' }}
                    >
                      {currentRender.title}
                    </h3>
                  )}
                  {currentRender.caption && (
                    <p
                      className="text-lg text-white/80"
                      style={{ fontFamily: 'var(--font-crimson)', fontStyle: 'italic' }}
                    >
                      {currentRender.caption}
                    </p>
                  )}
                  <p
                    className="mt-2 text-sm text-white/60"
                    style={{ fontFamily: 'var(--font-crimson)' }}
                  >
                    {getRenderTypeLabel(currentRender.renderType)} • {selectedIndex + 1} de{' '}
                    {sortedRenders.length}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
