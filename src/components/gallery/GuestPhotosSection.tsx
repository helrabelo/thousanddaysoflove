// @ts-nocheck: Legacy framer-motion + CMS types pending refactor
'use client'

/**
 * Guest Photos Section
 * Displays approved guest-uploaded photos with social interactions
 * Organized by phase (before/during/after) with reactions and comments
 */

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import PhotoCard from './PhotoCard'
import { getPhotosWithInteractions, type PhotoWithInteractions } from '@/lib/supabase/photo-interactions'
import { GUEST_SESSION_COOKIE } from '@/lib/auth/guestAuth'
import Cookies from 'js-cookie'
import type { MediaItem } from '@/types/wedding'

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
  const [photos, setPhotos] = useState<PhotoWithInteractions[]>([])
  const [guestSessionId, setGuestSessionId] = useState<string | null>(null)
  const [guestName, setGuestName] = useState('Convidado')
  const [isLoading, setIsLoading] = useState(true)

  // Load guest session from cookie and verify it
  useEffect(() => {
    const loadGuestSession = async () => {
      const sessionToken = Cookies.get(GUEST_SESSION_COOKIE)
      console.log('[GuestPhotosSection] Session token from cookie:', sessionToken)

      if (!sessionToken) {
        console.log('[GuestPhotosSection] No session token found')
        return
      }

      try {
        // Verify session with server
        const response = await fetch('/api/auth/verify-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionToken }),
        })

        if (!response.ok) {
          console.error('[GuestPhotosSection] Session verification failed:', response.status)
          return
        }

        const { session } = await response.json()
        console.log('[GuestPhotosSection] Session verified:', session)

        if (session && session.guest) {
          setGuestSessionId(session.id)
          setGuestName(session.guest.name || 'Convidado')
        }
      } catch (error) {
        console.error('[GuestPhotosSection] Error verifying session:', error)
      }
    }

    loadGuestSession()
  }, [])

  // Load photos with interactions
  useEffect(() => {
    void loadPhotos()
  }, [loadPhotos])

  const loadPhotos = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getPhotosWithInteractions(
        selectedPhase === 'all' ? undefined : selectedPhase
      )
      console.log('[GuestPhotosSection] Loaded photos:', data.length, data)
      setPhotos(data)
    } catch (error) {
      console.error('[GuestPhotosSection] Error loading photos:', error)
    } finally {
      setIsLoading(false)
    }
  }, [selectedPhase])

  const fallbackPhotoCount =
    photosByPhase.before.length + photosByPhase.during.length + photosByPhase.after.length
  const totalPhotos = photos.length || fallbackPhotoCount

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{
              fontFamily: 'var(--font-playfair)',
              color: 'var(--primary-text)',
              letterSpacing: '0.15em',
            }}
          >
            Memórias Compartilhadas
          </h2>
          <div
            className="w-24 h-px mx-auto mb-8"
            style={{ background: 'var(--decorative)' }}
          />
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
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {(['all', 'before', 'during', 'after'] as Phase[]).map((phase) => (
            <button
              key={phase}
              onClick={() => setSelectedPhase(phase)}
              className="px-6 py-3 rounded-xl font-medium transition-all duration-300"
              style={{
                fontFamily: 'var(--font-crimson)',
                background: selectedPhase === phase ? 'var(--primary-text)' : '#F8F6F3',
                color: selectedPhase === phase ? '#F8F6F3' : 'var(--primary-text)',
                border: selectedPhase === phase ? 'none' : '1px solid var(--decorative)',
              }}
            >
              {phaseLabels[phase]}
            </button>
          ))}
        </div>

        {/* Photos Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p
              className="text-lg text-[#A8A8A8]"
              style={{ fontFamily: 'var(--font-crimson)' }}
            >
              Carregando fotos...
            </p>
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-12">
            <motion.div
              className="text-5xl mb-3"
              animate={{
                rotate: [0, -10, 10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              📸
            </motion.div>
            <p
              style={{
                fontFamily: 'var(--font-crimson)',
                color: 'var(--secondary-text)',
                fontStyle: 'italic',
              }}
            >
              Nenhuma foto ainda. Seja o primeiro a compartilhar!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                guestSessionId={guestSessionId}
                guestName={guestName}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
