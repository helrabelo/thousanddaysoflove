'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import AnimatedTitle from './AnimatedTitle'

interface HeroVideoSectionProps {
  videoUrl: string
  posterUrl?: string
  title: string
  subtitle?: string
  overlayOpacity?: number
  textPosition?: 'center' | 'left' | 'right'
  autoPlay?: boolean
  showControls?: boolean
  height?: string
}

export default function HeroVideoSection({
  videoUrl,
  posterUrl,
  title,
  subtitle,
  overlayOpacity = 0.4,
  textPosition = 'center',
  autoPlay = true,
  showControls = true,
  height = 'h-screen'
}: HeroVideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const togglePlay = () => {
    const video = document.getElementById('hero-video') as HTMLVideoElement
    if (video) {
      if (isPlaying) {
        video.pause()
      } else {
        video.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    const video = document.getElementById('hero-video') as HTMLVideoElement
    if (video) {
      video.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const getTextAlignment = () => {
    switch (textPosition) {
      case 'left':
        return 'text-left items-start'
      case 'right':
        return 'text-right items-end'
      default:
        return 'text-center items-center'
    }
  }

  return (
    <section className={`relative ${height} flex ${getTextAlignment()} justify-center overflow-hidden`}>
      {/* Background Video or Image for Mobile */}
      {!isMobile ? (
        <video
          id="hero-video"
          autoPlay={autoPlay}
          loop
          muted={isMuted}
          playsInline
          poster={posterUrl}
          className="absolute inset-0 w-full h-full object-cover"
          onLoadedData={() => setIsLoaded(true)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : (
        // Mobile fallback to poster image
        posterUrl && (
          <div className="absolute inset-0">
            <Image
              src={posterUrl}
              alt="Hero background"
              fill
              className="object-cover"
              priority
            />
          </div>
        )
      )}

      {/* Gradient Overlay for Brazilian Romantic Aesthetic */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/40"
        style={{ opacity: overlayOpacity }}
      />

      {/* Romantic Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-gray-200/20 text-4xl"
            initial={{
              x: Math.random() * window.innerWidth || 0,
              y: window.innerHeight || 0,
              rotate: 0
            }}
            animate={{
              y: -100,
              rotate: 360,
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: i * 1.5,
              ease: 'easeOut'
            }}
          >
            {['💕', '💖', '🌹', '💝', '💗', '🤍'][i]}
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className={`relative z-10 max-w-6xl mx-auto px-6 flex flex-col ${getTextAlignment()}`}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h1 className="hero-title text-white mb-6 leading-none">
            {title === '1000' ? (
              <AnimatedTitle
                className="bg-gradient-to-r from-gray-200 via-gray-200 to-gray-200 bg-clip-text text-transparent"
                delay={1.5}
              />
            ) : (
              <span className="bg-gradient-to-r from-gray-200 via-gray-200 to-gray-200 bg-clip-text text-transparent">
                {title}
              </span>
            )}
          </h1>

          {subtitle && (
            <motion.p
              className="story-text text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              {subtitle}
            </motion.p>
          )}

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <button className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              Ver Nossa Galeria
            </button>
            <button className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20">
              Nossa História
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Video Controls */}
      {showControls && !isMobile && isLoaded && (
        <motion.div
          className="absolute bottom-8 right-8 flex space-x-3 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <button
            onClick={togglePlay}
            className="bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20"
            aria-label={isPlaying ? 'Pausar vídeo' : 'Reproduzir vídeo'}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          <button
            onClick={toggleMute}
            className="bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20"
            aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </motion.div>
      )}

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
      >
        <motion.div
          className="flex flex-col items-center text-white/80"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-sm mb-2 font-medium">Role para ver mais</span>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* Brazilian Wedding Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Corner Ornaments */}
        <div className="absolute top-8 left-8 text-white/20">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="currentColor">
            <path d="M30 5 L35 20 L50 15 L40 30 L55 35 L40 40 L50 55 L35 50 L30 65 L25 50 L10 55 L20 40 L5 35 L20 30 L10 15 L25 20 Z" />
          </svg>
        </div>
        <div className="absolute top-8 right-8 text-white/20">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="currentColor">
            <path d="M30 5 L35 20 L50 15 L40 30 L55 35 L40 40 L50 55 L35 50 L30 65 L25 50 L10 55 L20 40 L5 35 L20 30 L10 15 L25 20 Z" />
          </svg>
        </div>
      </div>
    </section>
  )
}
