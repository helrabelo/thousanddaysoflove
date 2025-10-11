'use client'

import { useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Heart, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function ImageHeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)
  const { scrollY } = useScroll()

  // Parallax effect - image moves slower than scroll
  const imageY = useTransform(scrollY, [0, 1000], [0, 200])
  const contentY = useTransform(scrollY, [0, 1000], [0, 50])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  return (
    <section className="relative h-[90vh] overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0 scale-110"
        style={{ y: imageY }}
      >
        <Image
          src="/images/hero-couple.jpg"
          alt="Hel e Ylana"
          fill
          className="object-cover"
          priority
          onLoad={() => setIsLoaded(true)}
        />
      </motion.div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

      {/* Content Overlay */}
      <motion.div
        className="relative z-10 h-full flex items-end justify-center pb-16 px-8"
        style={{ y: contentY, opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 50 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="max-w-4xl text-center"
        >
          {/* Monogram */}
          <div
            className="mb-6"
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(2.5rem, 7vw, 4rem)',
              fontWeight: '300',
              color: 'white',
              letterSpacing: '0.25em',
              textShadow: '0 2px 20px rgba(0,0,0,0.7)'
            }}
          >
            H <span className="text-white/90">♥</span> Y
          </div>

          {/* Names */}
          <h1
            className="mb-6"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(3.5rem, 12vw, 7rem)',
              fontWeight: '400',
              color: 'white',
              letterSpacing: '0.12em',
              lineHeight: '1',
              textShadow: '0 3px 40px rgba(0,0,0,0.8)',
              textTransform: 'uppercase'
            }}
          >
            Hel & Ylana
          </h1>

          {/* Divider */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="h-px w-16 bg-white/60" />
            <div className="w-2 h-2 rounded-full bg-white/80" />
            <div className="h-px w-16 bg-white/60" />
          </div>

          {/* Tagline */}
          <p
            className="mb-8 mx-auto max-w-2xl"
            style={{
              fontFamily: 'var(--font-crimson)',
              fontSize: 'clamp(1.25rem, 3vw, 2rem)',
              fontWeight: '400',
              lineHeight: '1.5',
              color: 'rgba(255,255,255,0.95)',
              fontStyle: 'italic',
              textShadow: '0 2px 20px rgba(0,0,0,0.6)'
            }}
          >
            1000 dias. Sim, a gente fez a conta.
          </p>

          {/* Date */}
          <div
            className="mb-12"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: '300',
              color: 'white',
              letterSpacing: '0.2em',
              textShadow: '0 2px 15px rgba(0,0,0,0.5)'
            }}
          >
            20 • 11 • 2025
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
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
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight * 0.9,
              behavior: 'smooth'
            })
          }}
        >
          <span
            className="text-white/90 text-xs tracking-[0.2em] uppercase"
            style={{ fontFamily: 'var(--font-crimson)' }}
          >
            Scroll
          </span>
          <ChevronDown className="w-5 h-5 text-white/90" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  )
}
