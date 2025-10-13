'use client'

/**
 * Guest Photos Section
 * Displays approved guest-uploaded photos organized by phase (before/during/after)
 * with guest attribution and phase filtering tabs
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { MediaItem } from '@/types/wedding'

interface GuestPhotosSectionProps {
  photosByPhase: {
    before: MediaItem[]
    during: MediaItem[]
    after: MediaItem[]
  }
}

type Phase = 'all' | 'before' | 'during' | 'after'

const phaseLabels: Record<Phase, string> = {
  all: 'Todas as Fotos',
  before: 'Antes do Casamento',
  during: 'Dia do Casamento',
  after: 'Depois do Casamento',
}

export default function GuestPhotosSection({
  photosByPhase,
}: GuestPhotosSectionProps) {
  const [selectedPhase, setSelectedPhase] = useState<Phase>('all')

  // Get photos for selected phase
  const getPhotos = (): MediaItem[] => {
    if (selectedPhase === 'all') {
      return [...photosByPhase.before, ...photosByPhase.during, ...photosByPhase.after]
    }
    return photosByPhase[selectedPhase]
  }

  const displayedPhotos = getPhotos()
  const totalPhotos =
    photosByPhase.before.length +
    photosByPhase.during.length +
    photosByPhase.after.length

  if (totalPhotos === 0) {
    return null
  }

  return (
    <section className="py-20" style={{ background: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{
              fontFamily: 'var(--font-playfair)',
              color: 'var(--primary-text)',
              letterSpacing: '0.15em',
            }}
          >
            Fotos dos Convidados
          </h2>
          <div
            className="w-24 h-px mx-auto mb-8"
            style={{ background: 'var(--decorative)' }}
          />
          <p
            className="text-xl max-w-2xl mx-auto leading-relaxed"
            style={{
              fontFamily: 'var(--font-crimson)',
              color: 'var(--secondary-text)',
              fontStyle: 'italic',
            }}
          >
            Momentos capturados através dos olhos de nossos queridos amigos e
            familiares
          </p>
          <p
            className="text-lg mt-4"
            style={{
              fontFamily: 'var(--font-crimson)',
              color: 'var(--decorative)',
            }}
          >
            {totalPhotos} foto{totalPhotos !== 1 ? 's' : ''} compartilhada{totalPhotos !== 1 ? 's' : ''}
          </p>
        </motion.div>

        {/* Phase Filter Tabs */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {(['all', 'before', 'during', 'after'] as Phase[]).map((phase) => {
            const count =
              phase === 'all'
                ? totalPhotos
                : photosByPhase[phase as 'before' | 'during' | 'after'].length

            if (count === 0 && phase !== 'all') {
              return null // Don't show tabs with no photos
            }

            return (
              <button
                key={phase}
                onClick={() => setSelectedPhase(phase)}
                className="px-6 py-3 rounded-lg font-medium transition-all duration-300"
                style={{
                  fontFamily: 'var(--font-crimson)',
                  background:
                    selectedPhase === phase
                      ? 'var(--primary-text)'
                      : 'var(--white-soft)',
                  color:
                    selectedPhase === phase
                      ? 'var(--white-soft)'
                      : 'var(--primary-text)',
                  border:
                    selectedPhase === phase
                      ? 'none'
                      : '2px solid var(--border-subtle)',
                  boxShadow:
                    selectedPhase === phase
                      ? '0 4px 15px var(--shadow-medium)'
                      : '0 2px 8px var(--shadow-subtle)',
                }}
              >
                {phaseLabels[phase]}
                <span
                  className="ml-2 inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-xs"
                  style={{
                    background:
                      selectedPhase === phase
                        ? 'rgba(255, 255, 255, 0.2)'
                        : 'var(--accent)',
                    color:
                      selectedPhase === phase
                        ? 'var(--white-soft)'
                        : 'var(--primary-text)',
                  }}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </motion.div>

        {/* Photos Grid */}
        {displayedPhotos.length === 0 ? (
          <div className="text-center py-12">
            <p
              style={{
                fontFamily: 'var(--font-crimson)',
                color: 'var(--secondary-text)',
                fontStyle: 'italic',
              }}
            >
              Nenhuma foto nesta fase ainda
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedPhotos.map((photo, index) => (
              <GuestPhotoCard key={photo.id} photo={photo} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// Guest Photo Card Component
interface GuestPhotoCardProps {
  photo: MediaItem
  index: number
}

function GuestPhotoCard({ photo, index }: GuestPhotoCardProps) {
  const phaseColors = {
    before: {
      bg: 'rgba(168, 168, 168, 0.1)',
      text: 'var(--decorative)',
    },
    during: {
      bg: 'rgba(44, 44, 44, 0.1)',
      text: 'var(--primary-text)',
    },
    after: {
      bg: 'rgba(168, 168, 168, 0.15)',
      text: 'var(--decorative)',
    },
  }

  const phaseColor = photo.upload_phase
    ? phaseColors[photo.upload_phase]
    : phaseColors.before

  return (
    <motion.div
      className="group cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      viewport={{ once: true }}
    >
      <div
        className="relative overflow-hidden rounded-xl transition-all duration-500"
        style={{
          background: 'var(--white-soft)',
          boxShadow: '0 4px 20px var(--shadow-subtle)',
          border: '1px solid var(--border-subtle)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)'
          e.currentTarget.style.boxShadow = '0 8px 30px var(--shadow-medium)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 4px 20px var(--shadow-subtle)'
        }}
      >
        {/* Image */}
        <div className="aspect-square overflow-hidden relative">
          {photo.is_video ? (
            <video
              src={photo.url}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              muted
              loop
            />
          ) : (
            <Image
              src={photo.url}
              alt={photo.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          )}

          {/* Phase Badge */}
          {photo.upload_phase && (
            <div
              className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"
              style={{
                background: phaseColor.bg,
                color: phaseColor.text,
                fontFamily: 'var(--font-crimson)',
                border: `1px solid ${phaseColor.text}`,
              }}
            >
              {phaseLabels[photo.upload_phase]}
            </div>
          )}

          {/* Guest Upload Badge */}
          <div
            className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"
            style={{
              background: 'rgba(44, 44, 44, 0.8)',
              color: 'var(--white-soft)',
              fontFamily: 'var(--font-crimson)',
            }}
          >
            📸 Convidado
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Guest Attribution */}
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              style={{
                background: 'var(--decorative)',
                color: 'var(--white-soft)',
              }}
            >
              {photo.guest_name?.charAt(0).toUpperCase() || '?'}
            </div>
            <div>
              <p
                className="font-medium text-sm"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  color: 'var(--primary-text)',
                }}
              >
                {photo.guest_name || 'Convidado'}
              </p>
              {photo.date_taken && (
                <p
                  className="text-xs"
                  style={{
                    fontFamily: 'var(--font-crimson)',
                    color: 'var(--text-muted)',
                  }}
                >
                  {new Date(photo.date_taken).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>
          </div>

          {/* Caption */}
          {photo.description && (
            <p
              className="text-sm line-clamp-2 mt-2"
              style={{
                fontFamily: 'var(--font-crimson)',
                color: 'var(--secondary-text)',
                fontStyle: 'italic',
              }}
            >
              {photo.description}
            </p>
          )}
        </div>

        {/* Hover Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl"
          style={{
            background: 'linear-gradient(to top, rgba(44, 44, 44, 0.9), transparent 60%)',
          }}
        >
          <div
            className="absolute bottom-4 left-4 right-4"
            style={{ color: 'var(--white-soft)' }}
          >
            <p
              className="font-bold text-base mb-1"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              {photo.title}
            </p>
            {photo.description && (
              <p
                className="text-sm opacity-90 line-clamp-2"
                style={{ fontFamily: 'var(--font-crimson)', fontStyle: 'italic' }}
              >
                {photo.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
