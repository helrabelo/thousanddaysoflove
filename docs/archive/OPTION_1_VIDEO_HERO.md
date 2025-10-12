# Option 1: Full-Bleed Video Hero - Implementation

## Visual Description
- **Height:** Full viewport (100vh)
- **Background:** Looping video of Hel & Ylana together
- **Overlay:** Dark gradient from transparent (top) to black/80 (bottom)
- **Content Position:** Bottom-left with generous padding
- **Typography:** Large white text with shadow for readability
- **Animation:** Fade-in on load, scroll indicator bounce

## Component Code

```tsx
// components/sections/VideoHeroSection.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Heart, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import CountdownTimer from '@/components/ui/CountdownTimer'
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
```

## Info Cards Section (Below Hero)

```tsx
// components/sections/EventDetailsSection.tsx
import { Calendar, MapPin, Clock } from 'lucide-react'
import { CONSTABLE_GALERIE } from '@/lib/utils/maps'
import CountdownTimer from '@/components/ui/CountdownTimer'

export default function EventDetailsSection() {
  return (
    <section className="py-20 px-8" style={{ background: 'var(--background)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Countdown Timer */}
        <div className="mb-16 text-center">
          <CountdownTimer />
        </div>

        {/* Event Details Cards */}
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center p-8 rounded-lg bg-white/50 border border-[var(--border-subtle)]">
            <Calendar className="w-8 h-8 mx-auto mb-6 text-[var(--decorative)]" strokeWidth={1.5} />
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
                lineHeight: '1.6',
                color: 'var(--secondary-text)',
                fontStyle: 'italic'
              }}
            >
              20 de Novembro de 2025<br />
              <span className="text-[var(--decorative)] text-sm">
                Exatamente 1000 dias desde aquele 6 de janeiro de 2023
              </span>
            </p>
          </div>

          <div className="text-center p-8 rounded-lg bg-white/50 border border-[var(--border-subtle)]">
            <Clock className="w-8 h-8 mx-auto mb-6 text-[var(--decorative)]" strokeWidth={1.5} />
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
                lineHeight: '1.6',
                color: 'var(--secondary-text)',
                fontStyle: 'italic'
              }}
            >
              10h30 da manhã<br />
              <span className="text-[var(--decorative)] text-sm">
                60 pessoas. Pra quem é introvertido, isso é muita gente.
              </span>
            </p>
          </div>

          <div className="text-center p-8 rounded-lg bg-white/50 border border-[var(--border-subtle)]">
            <MapPin className="w-8 h-8 mx-auto mb-6 text-[var(--decorative)]" strokeWidth={1.5} />
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
                lineHeight: '1.6',
                color: 'var(--secondary-text)',
                fontStyle: 'italic'
              }}
            >
              {CONSTABLE_GALERIE.name}<br />
              <span className="text-[var(--decorative)] text-sm">
                Uma galeria de arte em Fortaleza
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
```

## Video Requirements

### Ideal Video Content
- **Duration:** 10-20 seconds (loops seamlessly)
- **Subject:** You two together - candid moment
- **Mood:** Romantic, authentic, happy
- **Settings:**
  - At home (cozy, natural light)
  - Walking together (cinematic)
  - Laughing/interacting naturally
  - With the dogs (showing family)

### Video Suggestions (Priority Order)
1. 🔴 **BEST:** Walking together outdoors (sunset/golden hour) - cinematic, romantic
2. 🔴 **EXCELLENT:** At home together on couch/kitchen - authentic, intimate
3. 🟡 **GOOD:** Petting the dogs together - shows family, warmth
4. 🟡 **GOOD:** Cooking together - shows partnership, daily life
5. 🟢 **NICE:** Any candid moment laughing/smiling together

### Technical Specs
- **Format:** MP4 (H.264 codec)
- **Resolution:** 1920x1080 (desktop) + 1280x720 (mobile)
- **Bitrate:** 5-8 Mbps
- **Frame Rate:** 24fps or 30fps
- **Size:** Under 5MB
- **Loop Point:** Seamless loop (last frame matches first)

### Fallback Options
If no suitable video exists:
1. Use high-quality photo with Ken Burns zoom effect
2. Use image from proposal/engagement (if available)
3. Use candid photo from your apartment with good lighting

## Implementation Steps

1. **Prepare Video:**
   ```bash
   # Optimize video with FFmpeg
   ffmpeg -i raw-video.mov \
     -vcodec libx264 \
     -crf 28 \
     -preset slow \
     -vf "scale=1920:1080" \
     -r 30 \
     hero-couple.mp4

   # Create mobile version
   ffmpeg -i raw-video.mov \
     -vcodec libx264 \
     -crf 30 \
     -vf "scale=1280:720" \
     -r 24 \
     hero-couple-mobile.mp4
   ```

2. **Extract Poster Frame:**
   ```bash
   ffmpeg -i hero-couple.mp4 -ss 00:00:02 -vframes 1 hero-poster.jpg
   ```

3. **Create Fallback Image** (for users with reduced motion):
   - Export highest quality frame
   - Optimize as WebP
   - Same dimensions as video

4. **Place Files:**
   ```
   public/
   ├── videos/
   │   ├── hero-couple.mp4          (desktop)
   │   └── hero-couple-mobile.mp4   (mobile)
   └── images/
       ├── hero-poster.jpg          (loading state)
       └── hero-couple.jpg          (reduced motion)
   ```

5. **Update Homepage:**
   ```tsx
   // app/page.tsx
   import VideoHeroSection from '@/components/sections/VideoHeroSection'
   import EventDetailsSection from '@/components/sections/EventDetailsSection'
   import StoryPreview from '@/components/sections/StoryPreview'
   // ... other imports

   export default function Home() {
     return (
       <main className="min-h-screen">
         <Navigation />
         <VideoHeroSection />
         <EventDetailsSection />
         <StoryPreview />
         <AboutUsSection />
         <QuickPreview />
         <WeddingLocation />
       </main>
     )
   }
   ```

## Accessibility

- ✅ Respects `prefers-reduced-motion` (shows image instead)
- ✅ Video is decorative (no essential information in video)
- ✅ Text has sufficient contrast (white over dark gradient)
- ✅ Keyboard navigable (scroll indicator clickable)
- ✅ Screen reader friendly (semantic HTML)

## Performance

- ✅ Video lazy loads below viewport
- ✅ Poster image shows during loading
- ✅ Mobile fallback to smaller video
- ✅ Reduced motion fallback to image
- ✅ Graceful degradation if video fails

## What Makes This DTF-Inspired?

1. **Full-Bleed Visual** - No boxes, no cards, just immersive content
2. **Text Overlay** - Large, bold typography over visuals
3. **Dark Gradient** - Ensures text readability
4. **Minimal Content** - Only essential info in hero
5. **Scroll Indicator** - Guides user to explore more
6. **Info Cards Below** - Functional details in separate section
7. **Cinematic Feel** - Like opening a film, not a form

## Expected Impact

- **Emotional Connection:** Immediate - see the couple, feel the love
- **Engagement:** Higher - video captures attention
- **Memorability:** Strong - unique, not template-like
- **Brand:** Reinforces "sophisticated, authentic couple"
- **Conversion:** Better - more likely to RSVP after emotional connection
