'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Radio, Volume2, VolumeX } from 'lucide-react'
import { PinnedMomentsSection } from '@/components/live/PinnedMomentsSection'
import { LivePostStream } from '@/components/live/LivePostStream'
import { LivingPhotoMosaicHeader } from '@/components/live/LivingPhotoMosaicHeader'
import { getSoundManager } from '@/lib/utils/soundManager'
import useTimelineState from '@/hooks/useTimelineState'
import { LiveTimelineSidebar } from '@/components/live/LiveTimelineSidebar'

interface LiveFeedPageProps {
  variant?: 'default' | 'tv'
}

export function LiveFeedPage({ variant = 'default' }: LiveFeedPageProps) {
  const connectionStatus: 'live' | 'polling' = 'live'
  const [isMuted, setIsMuted] = useState(true) // Start muted by default
  const [feedRefreshKey, setFeedRefreshKey] = useState(0)
  const shouldReduceMotion = useReducedMotion()
  const isTV = variant === 'tv'
  const {
    data: timelineData,
    events: timelineEvents,
    isLoading: isTimelineLoading,
    error: timelineError,
    refresh: refreshTimeline,
    lastUpdatedAt: timelineUpdatedAt,
  } = useTimelineState({ updateIntervalMs: 20_000 })

  const timelineEventsById = useMemo(() => {
    return timelineEvents.reduce<Record<string, typeof timelineEvents[number]>>((acc, event) => {
      acc[event._id] = event
      return acc
    }, {})
  }, [timelineEvents])

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
    <div className="min-h-screen">
      <LivingPhotoMosaicHeader connectionStatus={connectionStatus} isMuted={isMuted} variant={variant} />

      {/* Main content */}
      <div className={`max-w-7xl mx-auto ${isTV ? 'px-6 py-10' : 'px-4 lg:px-6 py-8'}`}>
        {/* Main grid */}
        <div className={isTV ? 'grid grid-cols-1 xl:grid-cols-[3fr_2fr] gap-8' : 'grid grid-cols-1 lg:grid-cols-12 gap-6'}>
          {/* LEFT: LIVE FEED */}
          <div className={isTV ? 'space-y-8 xl:pr-6' : 'lg:col-span-9 space-y-6'}>
            {/* Pinned special moments */}
            <PinnedMomentsSection />

            {/* Live Feed Section */}
            <div className={`bg-white rounded-2xl border border-[#E8E6E3] relative ${isTV ? 'p-7 shadow-lg' : 'p-6 shadow-sm'}`}>
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
                className={`absolute top-4 right-4 z-10 rounded-full bg-[#F8F6F3]/20 backdrop-blur-sm border border-[#A8A8A8]/30 !w-fit transition-all duration-300 ${
                  isTV ? 'p-3.5 hover:bg-[#F8F6F3]/40' : 'p-3 hover:bg-[#F8F6F3]/30'
                }`}
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
              <LivePostStream key={feedRefreshKey} timelineEventsById={timelineEventsById} />
            </div>
          </div>

          {/* RIGHT: TIMELINE SIDEBAR */}
          <div className={isTV ? 'space-y-8 xl:pl-2' : 'lg:col-span-3 space-y-6'}>
            <LiveTimelineSidebar
              data={timelineData}
              isLoading={isTimelineLoading}
              error={timelineError}
              refresh={refreshTimeline}
              lastUpdatedAt={timelineUpdatedAt}
              variant={variant}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
