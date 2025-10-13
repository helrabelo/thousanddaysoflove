# Option 3: Hybrid Hero (Compact Video + Info Cards) - Implementation

## Visual Description
- **Height:** 70vh video + info cards section
- **Background:** Shorter video hero with essential content only
- **Layout:** Video section + immediate info cards (no separate section)
- **Content:** Minimal text in video, details in cards below
- **Best For:** Balancing visual impact with information density

**Philosophy:** DTF-inspired visual + traditional wedding info = best of both worlds

## Component Code

```tsx
// components/sections/HybridHeroSection.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Heart, Calendar, MapPin, Clock, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import CountdownTimer from '@/components/ui/CountdownTimer'
import { CONSTABLE_GALERIE } from '@/lib/utils/maps'

export default function HybridHeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (videoRef.current && !shouldReduceMotion) {
      videoRef.current.play()
    }
  }, [shouldReduceMotion])

  return (
    <>
      {/* Compact Video Hero */}
      <section className="relative h-[70vh] overflow-hidden">
        {/* Background Video/Image */}
        {shouldReduceMotion ? (
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

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/90" />

        {/* Content - Minimal */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVideoLoaded ? 1 : 0, y: isVideoLoaded ? 0 : 30 }}
            transition={{ duration: 1, delay: 0.4 }}
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
                textShadow: '0 2px 25px rgba(0,0,0,0.6)'
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
                letterSpacing: '0.15em',
                lineHeight: '1.1',
                textShadow: '0 3px 35px rgba(0,0,0,0.7)',
                textTransform: 'uppercase'
              }}
            >
              Hel & Ylana
            </h1>

            {/* Tagline */}
            <p
              className="mb-10 max-w-2xl mx-auto"
              style={{
                fontFamily: 'var(--font-crimson)',
                fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
                fontWeight: '400',
                lineHeight: '1.6',
                color: 'rgba(255,255,255,0.95)',
                fontStyle: 'italic',
                textShadow: '0 2px 20px rgba(0,0,0,0.6)'
              }}
            >
              1000 dias. Sim, a gente fez a conta.
            </p>

            {/* Date Badge */}
            <div
              className="inline-block px-8 py-3 rounded-full backdrop-blur-md"
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
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-1"
          >
            <ChevronDown className="w-5 h-5 text-white/80" strokeWidth={1.5} />
          </motion.div>
        </motion.div>
      </section>

      {/* Integrated Info Section - Immediate Continuation */}
      <section
        className="relative -mt-1 py-16 px-8"
        
      >
        <div className="max-w-6xl mx-auto">
          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <CountdownTimer />
          </motion.div>

          {/* Event Details Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-8"
          >
            {/* Date Card */}
            <div
              className="text-center p-10 rounded-xl"
              style={{
                background: 'var(--white-soft)',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 4px 12px var(--shadow-subtle)'
              }}
            >
              <Calendar
                className="w-8 h-8 mx-auto mb-6"
                style={{ color: 'var(--decorative)', strokeWidth: 1.5 }}
              />
              <h3
                className="font-medium mb-4 uppercase tracking-wider"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  color: 'var(--primary-text)',
                  fontSize: '1.125rem'
                }}
              >
                Data
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-crimson)',
                  fontSize: '1.125rem',
                  lineHeight: '1.7',
                  color: 'var(--secondary-text)',
                  fontStyle: 'italic'
                }}
              >
                20 de Novembro de 2025
              </p>
              <p
                className="mt-3 text-sm"
                style={{
                  fontFamily: 'var(--font-crimson)',
                  color: 'var(--decorative)',
                  fontStyle: 'italic'
                }}
              >
                Exatamente 1000 dias desde aquele 6 de janeiro de 2023
              </p>
            </div>

            {/* Time Card */}
            <div
              className="text-center p-10 rounded-xl"
              style={{
                background: 'var(--white-soft)',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 4px 12px var(--shadow-subtle)'
              }}
            >
              <Clock
                className="w-8 h-8 mx-auto mb-6"
                style={{ color: 'var(--decorative)', strokeWidth: 1.5 }}
              />
              <h3
                className="font-medium mb-4 uppercase tracking-wider"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  color: 'var(--primary-text)',
                  fontSize: '1.125rem'
                }}
              >
                Horário
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-crimson)',
                  fontSize: '1.125rem',
                  lineHeight: '1.7',
                  color: 'var(--secondary-text)',
                  fontStyle: 'italic'
                }}
              >
                10h30 da manhã
              </p>
              <p
                className="mt-3 text-sm"
                style={{
                  fontFamily: 'var(--font-crimson)',
                  color: 'var(--decorative)',
                  fontStyle: 'italic'
                }}
              >
                60 pessoas. Pra quem é introvertido, isso é muita gente.
              </p>
            </div>

            {/* Location Card */}
            <div
              className="text-center p-10 rounded-xl"
              style={{
                background: 'var(--white-soft)',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 4px 12px var(--shadow-subtle)'
              }}
            >
              <MapPin
                className="w-8 h-8 mx-auto mb-6"
                style={{ color: 'var(--decorative)', strokeWidth: 1.5 }}
              />
              <h3
                className="font-medium mb-4 uppercase tracking-wider"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  color: 'var(--primary-text)',
                  fontSize: '1.125rem'
                }}
              >
                Local
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-crimson)',
                  fontSize: '1.125rem',
                  lineHeight: '1.7',
                  color: 'var(--secondary-text)',
                  fontStyle: 'italic'
                }}
              >
                {CONSTABLE_GALERIE.name}
              </p>
              <p
                className="mt-3 text-sm"
                style={{
                  fontFamily: 'var(--font-crimson)',
                  color: 'var(--decorative)',
                  fontStyle: 'italic'
                }}
              >
                Uma galeria de arte em Fortaleza
              </p>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-16"
          >
            <Button
              variant="wedding"
              size="lg"
              asChild
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
            >
              <Link href="/presentes">
                Lista de Presentes
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  )
}
```

## Video/Image Requirements

**Same as Options 1 & 2:**
- Video: 10-20 seconds, optimized, loops seamlessly
- Or high-quality photo of you two together
- See OPTION_1_VIDEO_HERO.md or OPTION_2_IMAGE_HERO.md for detailed specs

## Implementation Steps

1. **Prepare Media:**
   - Use same process as Option 1 (video) or Option 2 (image)
   - Optimize for web delivery
   - Create mobile fallback

2. **Place Files:**
   ```
   public/
   ├── videos/
   │   └── hero-couple.mp4
   └── images/
       ├── hero-poster.jpg
       └── hero-couple.jpg (for reduced motion)
   ```

3. **Update Homepage:**
   ```tsx
   // app/page.tsx
   import HybridHeroSection from '@/components/sections/HybridHeroSection'
   import StoryPreview from '@/components/sections/StoryPreview'
   // ... other imports

   export default function Home() {
     return (
       <main className="min-h-screen">
         <Navigation />
         <HybridHeroSection />  {/* Includes both video + info cards */}
         <StoryPreview />
         <AboutUsSection />
         <QuickPreview />
         <WeddingLocation />
       </main>
     )
   }
   ```

## What Makes This Different?

### vs Option 1 (Full Video Hero)
- ✅ **More Information:** Shows event details immediately
- ✅ **Less Scrolling:** Guests see all key info faster
- ✅ **Familiar Pattern:** Matches wedding website expectations
- ❌ **Less Cinematic:** Shorter video = less immersion
- ❌ **More Traditional:** Feels more like wedding site, less like DTF

### vs Option 2 (Image Hero)
- ✅ **Dynamic:** Video adds movement and life
- ✅ **Storytelling:** Motion enhances emotional connection
- ❌ **Complexity:** More technical work (video encoding)
- ❌ **Performance:** Larger files than static image

## Design Philosophy

**The Best of Both Worlds:**
1. **Visual Impact** (from DTF approach)
   - Full-bleed video/image
   - Text overlay with shadow
   - Cinematic feel
   - Emotional first impression

2. **Information Clarity** (from wedding tradition)
   - Event details in clear cards
   - Countdown visible early
   - All key info above fold
   - No hunting for date/time/location

**When This Works Best:**
- Your guests expect traditional wedding info
- You want DTF aesthetics without radical departure
- You need to balance beauty with practicality
- You want fastest path to RSVP (all info visible)

## Pros & Cons

**Advantages:**
- ✅ Cinematic opening + practical info
- ✅ Less scrolling for guests
- ✅ Meets wedding website expectations
- ✅ Fast access to CTAs
- ✅ Works for both "browsers" and "task-completers"

**Trade-offs:**
- ❌ Less immersive than full-screen hero
- ❌ Splits focus between video and cards
- ❌ Shorter video = less emotional impact
- ❌ Cards compete with video for attention

## When to Choose This Option

Choose Hybrid Hero if:
- Your guests are older/less tech-savvy
- You need information density
- You want to reduce guest confusion
- You're worried about too much scrolling
- You want both beauty AND function
- You're on the fence between DTF-style and traditional

**Don't Choose This If:**
- You want maximum cinematic impact
- You're willing to sacrifice info density for emotion
- Your guests are younger/more digital-native
- You want to fully commit to DTF aesthetic

## Expected Impact

- **Emotional Connection:** Good - video creates warmth
- **Information Clarity:** Excellent - all key details visible
- **Engagement:** Good - balance of beauty and utility
- **Conversion:** High - low friction to RSVP
- **Brand:** "Sophisticated but practical couple"
