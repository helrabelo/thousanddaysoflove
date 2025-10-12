'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Heart, ChevronDown, Volume2, VolumeX } from 'lucide-react'
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
    scrollText?: string
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
  const [isMuted, setIsMuted] = useState(true)
  const shouldReduceMotion = useReducedMotion()

  // Fallback values
  const showMonogram = data?.monogram !== undefined ? data.monogram : false
  const tagline = data?.tagline || '1000 dias. Sim, a gente fez a conta.'
  const dateBadge = data?.dateBadge || '20.11.2025'
  const primaryCta = data?.primaryCta || { label: 'Confirmar Presença', href: '/rsvp' }
  const secondaryCta = data?.secondaryCta || { label: 'Nossa História', href: '/historia' }
  const scrollText = data?.scrollText || 'Explorar'

  // Use backgroundImage as poster if no posterImage provided
  const posterUrl = data?.posterImage?.asset?.url || data?.backgroundImage?.asset?.url || '/images/hero-poster.jpg'
  const videoUrl = data?.backgroundVideo?.asset?.url || '/videos/hero-couple.mp4'

  useEffect(() => {
    if (videoRef.current && !shouldReduceMotion) {
      videoRef.current.play().catch(err => {
        console.log('Video autoplay prevented:', err)
      })
    }
  }, [shouldReduceMotion])

  const toggleAudio = () => {
    if (videoRef.current) {
      setIsMuted(!isMuted)
      videoRef.current.muted = !isMuted
    }
  }

  return (
    <section className="relative h-screen overflow-hidden -mt-20">
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
        // Video background
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            poster={posterUrl}
            onLoadedData={() => setIsVideoLoaded(true)}
            className="w-full h-full object-cover object-center"
            style={{
              minHeight: '100vh',
              minWidth: '100vw'
            }}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        </div>
      )}

      {/* Gradient Overlay - Dark at bottom for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Audio Toggle Button - Only show when video is loaded and not in reduced motion */}
      {!shouldReduceMotion && isVideoLoaded && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          onClick={toggleAudio}
          className="absolute bottom-24 right-8 z-20 group"
          aria-label={isMuted ? 'Ativar áudio' : 'Desativar áudio'}
        >
          <motion.div
            className="relative flex items-center justify-center w-16 h-16 rounded-full backdrop-blur-md border-2 border-white/40 cursor-pointer shadow-xl"
            style={{
              background: 'rgba(255,255,255,0.15)'
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: isMuted
                ? '0 0 0 0 rgba(255,255,255,0)'
                : ['0 0 0 0 rgba(255,255,255,0.7)', '0 0 0 20px rgba(255,255,255,0)']
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
                <VolumeX className="w-6 h-6 text-white" strokeWidth={1.5} />
              ) : (
                <Volume2 className="w-6 h-6 text-white" strokeWidth={1.5} />
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

          {/* Tooltip */}
          <motion.div
            className="absolute top-full mt-3 right-0 px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{
              background: 'rgba(255,255,255,0.95)',
              color: 'var(--primary-text)',
              fontFamily: 'var(--font-crimson)',
              fontStyle: 'italic',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            {isMuted ? 'Ativar som' : 'Desativar som'}
          </motion.div>
        </motion.button>
      )}

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-end pb-20 px-8 md:px-16 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: isVideoLoaded ? 1 : 0, y: isVideoLoaded ? 0 : 40 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="max-w-4xl"
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
          <h1
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
          >
            Hel & Ylana
          </h1>

          {/* Tagline */}
          <p
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
          >
            {tagline}
          </p>

          {/* Date Badge */}
          <div
            className="inline-block mb-10 px-8 py-4 rounded-full backdrop-blur-md"
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.3)',
              fontFamily: 'var(--font-playfair)',
              fontSize: '1.25rem',
              color: 'white',
              letterSpacing: '0.15em',
              textShadow: '0 1px 10px rgba(0,0,0,0.3)'
            }}
          >
            {dateBadge}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-6">
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
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight,
              behavior: 'smooth'
            })
          }}
        >
          <span
            className="text-white/80 text-sm tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-crimson)', fontStyle: 'italic' }}
          >
            {scrollText}
          </span>
          <ChevronDown className="w-6 h-6 text-white/80" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  )
}
