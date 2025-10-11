'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Heart, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function VideoHeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (videoRef.current && !shouldReduceMotion) {
      videoRef.current.play().catch(err => {
        console.log('Video autoplay prevented:', err)
      })
    }
  }, [shouldReduceMotion])

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Video or Image */}
      {shouldReduceMotion ? (
        // Static image for reduced motion preference
        <div className="absolute inset-0">
          <Image
            src="/images/hero-couple.jpg"
            alt="Hel e Ylana"
            fill
            className="object-cover"
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
            muted
            playsInline
            poster="/images/hero-poster.jpg"
            onLoadedData={() => setIsVideoLoaded(true)}
            className="w-full h-full object-cover"
          >
            <source src="/videos/hero-couple.mp4" type="video/mp4" />
          </video>
        </div>
      )}

      {/* Gradient Overlay - Dark at bottom for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-end pb-20 px-8 md:px-16 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: isVideoLoaded ? 1 : 0, y: isVideoLoaded ? 0 : 40 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="max-w-4xl"
        >
          {/* Monogram */}
          <div
            className="mb-6"
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(3rem, 8vw, 5rem)',
              fontWeight: '300',
              color: 'white',
              letterSpacing: '0.2em',
              textShadow: '0 2px 20px rgba(0,0,0,0.5)'
            }}
          >
            H <span className="text-white/90">♥</span> Y
          </div>

          {/* Names */}
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
            1000 dias. Sim, a gente fez a conta.
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
            20.11.2025
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-6">
            <Button
              variant="wedding"
              size="lg"
              asChild
              className="backdrop-blur-sm bg-white/95 hover:bg-white text-[var(--primary-text)] shadow-2xl"
            >
              <Link href="/rsvp" className="flex items-center">
                <Heart className="w-5 h-5 mr-3" />
                Confirmar Presença
              </Link>
            </Button>

            <Button
              variant="wedding-outline"
              size="lg"
              asChild
              className="backdrop-blur-sm border-2 border-white/90 text-white hover:bg-white/20"
            >
              <Link href="/historia">
                Nossa História
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
            Explorar
          </span>
          <ChevronDown className="w-6 h-6 text-white/80" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  )
}
