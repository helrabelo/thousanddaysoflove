'use client'

import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Sparkles, Radio, Volume2, VolumeX } from 'lucide-react'
import { LiveStats } from '@/components/live/LiveStats'
import { PinnedMomentsSection } from '@/components/live/PinnedMomentsSection'
import { LivePostStream } from '@/components/live/LivePostStream'
import { getSoundManager } from '@/lib/utils/soundManager'

export function LiveFeedPage() {
  const [connectionStatus, setConnectionStatus] = useState<'live' | 'polling'>('live')
  const [isMuted, setIsMuted] = useState(true) // Start muted by default
  const [feedRefreshKey, setFeedRefreshKey] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    // Initialize sound manager
    const soundManager = getSoundManager()
    setIsMuted(soundManager.getMuteState())

    // Listen for post-created event from GlobalGuestActions
    const handlePostCreated = () => {
      console.log('🔄 [LiveFeedPage] Post created event received, refreshing feed...')
      setFeedRefreshKey(prev => prev + 1)
    }

    // Listen for media-uploaded event from GlobalGuestActions
    const handleMediaUploaded = () => {
      console.log('🔄 [LiveFeedPage] Media uploaded event received, refreshing feed...')
      // Refresh the unified feed to show new photos
      setFeedRefreshKey(prev => prev + 1)
    }

    window.addEventListener('post-created', handlePostCreated as EventListener)
    window.addEventListener('media-uploaded', handleMediaUploaded as EventListener)

    // Cleanup
    return () => {
      window.removeEventListener('post-created', handlePostCreated as EventListener)
      window.removeEventListener('media-uploaded', handleMediaUploaded as EventListener)
    }
  }, [])

  const toggleSound = () => {
    const soundManager = getSoundManager()
    const newMutedState = soundManager.toggleMute()
    setIsMuted(newMutedState)

    // Initialize audio context on first unmute (required by browser autoplay policies)
    if (!newMutedState) {
      soundManager.initialize()
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F6F3]">
      {/* Hero section with monochromatic elegance */}
      <div className="bg-[#2C2C2C] text-[#F8F6F3] py-12 px-6 relative overflow-hidden border-b-2 border-[#A8A8A8]">

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.div
                animate={shouldReduceMotion ? {} : {
                  scale: [1, 1.2, 1],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <Sparkles className="w-8 h-8" />
              </motion.div>
              <motion.h1
                className="text-4xl md:text-5xl font-playfair font-bold"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                Hel & Ylana
              </motion.h1>
              <motion.div
                animate={shouldReduceMotion ? {} : {
                  scale: [1, 1.2, 1],
                  rotate: [0, -360]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.5
                }}
              >
                <Sparkles className="w-8 h-8" />
              </motion.div>
            </div>

            <motion.p
              className="text-xl md:text-2xl font-crimson mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              O dia 1000
            </motion.p>

            {/* Connection status indicator with elegant pulse */}
            <motion.div
              className="inline-flex items-center gap-2 bg-[#F8F6F3]/10 backdrop-blur-sm px-4 py-2 rounded-full border border-[#A8A8A8]/30"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
            >
              <motion.div
                animate={shouldReduceMotion ? {} : {
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <div className={`w-2 h-2 rounded-full ${connectionStatus === 'live' ? 'bg-[#A8A8A8]' : 'bg-[#E8E6E3]'
                  }`} />
              </motion.div>
              <span className="text-sm font-medium font-crimson italic">
                {connectionStatus === 'live' ? 'Ao Vivo' : 'Atualizando...'}
              </span>
            </motion.div>

            {/* Sound hint for first-time visitors */}
            {isMuted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mt-4 text-sm text-[#E8E6E3] font-crimson italic"
              >
                <motion.span
                  animate={shouldReduceMotion ? {} : {
                    opacity: [1, 0.6, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                >
                  💡 Toque no ícone de som para ativar efeitos sonoros
                </motion.span>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        {/* Main grid - Live feed takes 9/12, sidebar takes 3/12 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: LIVE FEED - 9 columns (75% width) */}
          <div className="lg:col-span-9 space-y-6">
            {/* Pinned special moments */}
            <PinnedMomentsSection />

            {/* Live Feed Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8E6E3] relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <Radio className="w-6 h-6 text-[#2C2C2C]" />
                  <motion.div
                    animate={shouldReduceMotion ? {} : {
                      scale: [1, 1.5, 1],
                      opacity: [1, 0, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                    className="absolute inset-0 bg-[#A8A8A8] rounded-full blur-md"
                  />
                </div>
                <h2 className="text-3xl font-playfair font-bold text-[#2C2C2C]">
                  Feed Ao Vivo
                </h2>
              </div>

              {/* Live posts and photos stream with refresh key (merged feed) */}
              {/* Floating sound toggle button */}
              <motion.button
                onClick={toggleSound}
                className="absolute top-4 right-4 z-10 p-3 rounded-full bg-[#F8F6F3]/20 backdrop-blur-sm hover:bg-[#F8F6F3]/30 transition-all duration-300 border border-[#A8A8A8]/30 !w-fit"
                whileHover={shouldReduceMotion ? {} : { scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                title={isMuted ? 'Ativar sons' : 'Silenciar sons'}
              >
                <motion.div
                  animate={!isMuted && !shouldReduceMotion ? {
                    scale: [1, 1.2, 1]
                  } : {}}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-[#text-3xl font-playfair font-bold text-[#2C2C2C]]" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-[#text-3xl font-playfair font-bold text-[#2C2C2C]]" />
                  )}
                </motion.div>
              </motion.button>
              <LivePostStream key={feedRefreshKey} />
            </div>
          </div>

          {/* RIGHT: COMPACT SIDEBAR - 3 columns (25% width) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Compact stats */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E8E6E3]">
              <h3 className="text-lg font-playfair font-bold text-[#2C2C2C] mb-4">
                Estatísticas
              </h3>
              <LiveStats compact />
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
