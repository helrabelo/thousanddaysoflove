'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { Heart, Volume2, VolumeX } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface VideoHeroProps {
  data?: {
    monogram?: boolean
    tagline?: string
    dateBadge?: string
    primaryCta?: {
      label: string
      href: string
    }
    secondaryCta?: {
      label: string
      href: string
    }
    backgroundVideo?: {
      asset?: {
        url: string
      }
    }
    backgroundImage?: {
      asset?: {
        url: string
      }
      alt?: string
    }
    posterImage?: {
      asset?: {
        url: string
      }
      alt?: string
    }
  }
}

export default function VideoHeroSection({ data }: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [showPoster, setShowPoster] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [contentVisibility, setContentVisibility] = useState<'initial' | 'audioOn' | 'idle'>('initial')
  const idleTimerRef = useRef<NodeJS.Timeout>()
  const fallbackTimerRef = useRef<NodeJS.Timeout>()

  // Debug logging for poster state
  useEffect(() => {
    console.log('📊 Hero state - showPoster:', showPoster, 'isVideoLoaded:', isVideoLoaded)
  }, [showPoster, isVideoLoaded])
  const shouldReduceMotion = useReducedMotion()

  // Fallback values
  const showMonogram = data?.monogram !== undefined ? data.monogram : false
  const tagline = data?.tagline || '1000 dias. Sim, a gente fez a conta.'
  const dateBadge = data?.dateBadge || '20.11.2025'
  const primaryCta = data?.primaryCta || { label: 'Confirmar Presença', href: '/rsvp' }
  const secondaryCta = data?.secondaryCta || { label: 'Nossa História', href: '/historia' }

  // Use backgroundImage as poster if no posterImage provided
  const posterUrl = data?.posterImage?.asset?.url || data?.backgroundImage?.asset?.url || '/images/hero-poster.jpg'
  const videoUrl = data?.backgroundVideo?.asset?.url || '/videos/hero-couple.mp4'

  useEffect(() => {
    // If reduced motion, show content immediately (static image, no video loading needed)
    if (shouldReduceMotion) {
      setIsVideoLoaded(true)
      setShowPoster(true) // Keep poster visible for reduced motion
      return
    }

    // Try to play video
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.log('Video autoplay prevented:', err)
      })
    }

    // Fallback: Show content and hide poster after 2 seconds regardless of video load state
    // This ensures content always appears even if video fails to load or loads slowly
    fallbackTimerRef.current = setTimeout(() => {
      console.log('⏱️ Fallback timer: hiding poster and showing content')
      setIsVideoLoaded(true)
      setShowPoster(false)
    }, 2000)

    return () => {
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current)
      }
    }
  }, [shouldReduceMotion])

  // Handle video loaded - trigger poster fade out
  const handleVideoLoaded = () => {
    console.log('🎬 Video loaded successfully')

    // Clear fallback timer since video loaded properly
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current)
    }

    setIsVideoLoaded(true)

    // Start poster fade out after a brief moment to ensure video is ready
    setTimeout(() => {
      console.log('✨ Hiding poster, showing video')
      setShowPoster(false)
    }, 300)
  }

  // Idle timer for persistent accessibility
  const startIdleTimer = () => {
    clearTimeout(idleTimerRef.current)
    idleTimerRef.current = setTimeout(() => {
      setContentVisibility('idle')
    }, 10000) // 10 seconds of inactivity
  }

  // Reset timer on user interaction
  useEffect(() => {
    const resetTimer = () => {
      if (contentVisibility === 'audioOn') {
        startIdleTimer()
      }
    }

    window.addEventListener('mousemove', resetTimer)
    window.addEventListener('touchstart', resetTimer)

    return () => {
      window.removeEventListener('mousemove', resetTimer)
      window.removeEventListener('touchstart', resetTimer)
      clearTimeout(idleTimerRef.current)
    }
  }, [contentVisibility])

  // Keyboard shortcuts for immersive mode
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && contentVisibility === 'audioOn') {
        setContentVisibility('idle') // Restore visibility
      }
      if (e.key === 'h' && !isMuted) {
        setContentVisibility(prev =>
          prev === 'audioOn' ? 'idle' : 'audioOn'
        ) // Toggle hide/show with 'h' key
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [contentVisibility, isMuted])

  const toggleAudio = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted
      setIsMuted(newMutedState)
      videoRef.current.muted = newMutedState

      // Audio ON → Immersive mode
      if (!newMutedState) {
        setContentVisibility('audioOn')
        startIdleTimer()
      } else {
        setContentVisibility('idle')
        clearTimeout(idleTimerRef.current)
      }
    }
  }

  // Audio Toggle Button Component (reusable)
  const AudioToggleButton = () => (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      onClick={toggleAudio}
      className="group"
      aria-label={isMuted ? 'Ativar áudio' : 'Desativar áudio'}
    >
      <motion.div
        className="relative flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-md border-2 border-white/60 cursor-pointer"
        style={{
          background: 'rgba(255,255,255,0.2)',
          boxShadow: '0 0 30px rgba(255,255,255,0.4), 0 0 60px rgba(255,255,255,0.2), 0 4px 20px rgba(0,0,0,0.3)'
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: isMuted
            ? '0 0 30px rgba(255,255,255,0.4), 0 0 60px rgba(255,255,255,0.2), 0 4px 20px rgba(0,0,0,0.3)'
            : ['0 0 40px rgba(255,255,255,0.6), 0 0 80px rgba(255,255,255,0.3), 0 0 0 0 rgba(255,255,255,0.8)',
               '0 0 40px rgba(255,255,255,0.6), 0 0 80px rgba(255,255,255,0.3), 0 0 0 25px rgba(255,255,255,0)']
        }}
        transition={{
          boxShadow: {
            duration: 1.5,
            repeat: isMuted ? 0 : Infinity,
            ease: 'easeOut'
          }
        }}
      >
        <motion.div
          animate={{ rotate: isMuted ? 0 : 360 }}
          transition={{ duration: 0.3 }}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-white" strokeWidth={1.5} />
          ) : (
            <Volume2 className="w-5 h-5 text-white" strokeWidth={1.5} />
          )}
        </motion.div>

        {/* Animated sound waves when audio is on */}
        {!isMuted && (
          <motion.div
            className="absolute -right-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute w-1 bg-white rounded-full"
                style={{
                  height: '6px',
                  right: `${-4 - i * 3}px`,
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
                animate={{
                  scaleY: [1, 1.5, 1],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: 'easeInOut'
                }}
              />
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Subtle tooltip in Portuguese */}
      <motion.div
        className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        style={{
          background: 'rgba(255,255,255,0.9)',
          color: 'var(--secondary-text)',
          fontFamily: 'var(--font-crimson)',
          fontStyle: 'italic',
          fontSize: '0.7rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        Assista ao pedido!
      </motion.div>
    </motion.button>
  )

  return (
    <section className="relative h-screen overflow-hidden -mt-20 w-screen" style={{ marginLeft: 'calc(-50vw + 50%)' }}>
      {/* Background Video or Image */}
      {shouldReduceMotion ? (
        // Static image for reduced motion preference
        <div className="absolute inset-0">
          <Image
            src={posterUrl}
            alt="Hel e Ylana"
            fill
            className="object-cover object-center"
            style={{
              minHeight: '100vh',
              minWidth: '100vw'
            }}
            priority
          />
        </div>
      ) : (
        // Video background with poster transition
        <div className="absolute inset-0">
          {/* Poster Image Layer - Animated exit */}
          <AnimatePresence>
            {showPoster && (
              <motion.div
                className="absolute inset-0 z-20"
                initial={{ opacity: 1, scale: 1 }}
                exit={{
                  opacity: 0,
                  scale: 1.05,
                  transition: {
                    duration: 1.2,
                    ease: [0.43, 0.13, 0.23, 0.96] // Custom cubic-bezier for elegant fade
                  }
                }}
              >
                <Image
                  src={posterUrl}
                  alt="Hel e Ylana"
                  fill
                  className="object-cover object-center"
                  style={{
                    minHeight: '100vh',
                    minWidth: '100vw'
                  }}
                  priority
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Video Layer - Animated entrance from behind */}
          <motion.div
            className="absolute inset-0 z-10"
            initial={{ opacity: 0 }}
            animate={{
              opacity: showPoster ? 0 : 1,
              transition: {
                duration: 1.2,
                ease: [0.43, 0.13, 0.23, 0.96],
                delay: 0.2 // Slight delay for smooth crossfade
              }
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              onLoadedData={handleVideoLoaded}
              className="w-full h-full object-cover object-center"
              style={{
                minHeight: '100vh',
                minWidth: '100vw'
              }}
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
          </motion.div>
        </div>
      )}

      {/* Gradient Overlay - Dynamic based on visibility state */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t z-30"
        animate={{
          backgroundImage: contentVisibility === 'initial'
            ? 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.3), transparent)'
            : contentVisibility === 'audioOn'
            ? 'linear-gradient(to top, rgba(0,0,0,0.2), transparent, transparent)'
            : 'linear-gradient(to top, rgba(0,0,0,0.3), transparent, transparent)'
        }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      />


      {/* Content Overlay */}
      <div className="relative z-40 h-full w-full flex-grow flex items-end pb-20 px-8 md:px-16 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: isVideoLoaded ? 1 : 0, y: isVideoLoaded ? 0 : 40 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="w-full"
        >
          {/* Logo Monogram */}
          {showMonogram && (
            <div className="mb-6 flex justify-start">
              <Image
                src="/hy-logo.svg"
                alt="H & Y"
                width={200}
                height={68}
                className="h-auto drop-shadow-2xl"
                style={{
                  width: 'clamp(150px, 20vw, 200px)',
                  filter: 'brightness(0) invert(1) drop-shadow(0 2px 20px rgba(0,0,0,0.5))'
                }}
                priority
              />
            </div>
          )}

          {/* Names - hardcoded as they're the couple's actual names */}
          <motion.h1
            className="mb-6"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(3rem, 10vw, 6rem)',
              fontWeight: '400',
              color: 'white',
              letterSpacing: '0.1em',
              lineHeight: '1.1',
              textShadow: '0 2px 30px rgba(0,0,0,0.7)',
              textTransform: 'uppercase'
            }}
            animate={{
              opacity: contentVisibility === 'initial' ? 1 :
                       contentVisibility === 'audioOn' ? 0 : 0.4,
              y: contentVisibility === 'audioOn' ? -20 : 0
            }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            Hel & Ylana
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="mb-8 max-w-2xl"
            style={{
              fontFamily: 'var(--font-crimson)',
              fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
              fontWeight: '400',
              lineHeight: '1.6',
              color: 'rgba(255,255,255,0.95)',
              fontStyle: 'italic',
              textShadow: '0 1px 15px rgba(0,0,0,0.5)'
            }}
            animate={{
              opacity: contentVisibility === 'initial' ? 0.9 :
                       contentVisibility === 'audioOn' ? 0 : 0,
              y: contentVisibility === 'audioOn' ? -15 : 0
            }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            {tagline}
          </motion.p>

          {/* Date Badge + Audio Toggle (Mobile only - space-between) */}
          <div className="flex items-center justify-between mb-10 md:justify-start md:mb-10">
            <motion.div
              className="inline-block px-8 py-4 rounded-full backdrop-blur-md"
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
                fontFamily: 'var(--font-playfair)',
                fontSize: '1.25rem',
                color: 'white',
                letterSpacing: '0.15em',
                textShadow: '0 1px 10px rgba(0,0,0,0.3)'
              }}
              animate={{
                opacity: contentVisibility === 'initial' ? 1 :
                         contentVisibility === 'audioOn' ? 0.3 : 0.6,
                scale: contentVisibility === 'audioOn' ? 0.75 : 1
              }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              {dateBadge}
            </motion.div>

            {/* Mobile Audio Toggle (hidden on desktop) */}
            {!shouldReduceMotion && isVideoLoaded && (
              <div className="md:hidden">
                <AudioToggleButton />
              </div>
            )}
          </div>

          {/* CTAs + Audio Toggle (Desktop - space-between) */}
          <div className="flex items-center justify-between w-full">
            {/* CTAs Container */}
            <motion.div
              className="flex flex-col sm:flex-row gap-6 flex-grow"
              animate={{
                opacity: contentVisibility === 'initial' ? 1 :
                         contentVisibility === 'audioOn' ? 0.4 : 0.7,
                y: contentVisibility === 'audioOn' ? 8 : 0,
                scale: contentVisibility === 'audioOn' ? 0.9 : 1
              }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              style={{ pointerEvents: 'auto' }}
            >
              <Button
                variant="wedding"
                size="lg"
                asChild
                className="backdrop-blur-sm shadow-2xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.98)',
                  color: '#2C2C2C',
                  borderColor: 'rgba(255, 255, 255, 0.98)',
                  fontWeight: '600'
                }}
              >
                <Link href={primaryCta.href} className="flex items-center hover:bg-white transition-colors duration-200">
                  <Heart className="w-5 h-5 mr-3" />
                  {primaryCta.label}
                </Link>
              </Button>

              <Button
                variant="wedding-outline"
                size="lg"
                asChild
                className="backdrop-blur-sm shadow-xl"
                style={{
                  borderWidth: '2px',
                  borderColor: 'rgba(255, 255, 255, 0.95)',
                  color: 'white',
                  fontWeight: '600',
                  textShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }}
              >
                <Link href={secondaryCta.href} className="hover:bg-white/20 transition-all duration-200">
                  {secondaryCta.label}
                </Link>
              </Button>
            </motion.div>

            {/* Desktop Audio Toggle (hidden on mobile) */}
            {!shouldReduceMotion && isVideoLoaded && (
              <div className="hidden md:block">
                <AudioToggleButton />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
