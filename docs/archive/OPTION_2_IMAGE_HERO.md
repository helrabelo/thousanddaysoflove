# Option 2: Image Hero with Parallax - Implementation

## Visual Description
- **Height:** 90vh (slightly shorter than full screen)
- **Background:** High-quality photo of Hel & Ylana
- **Effect:** Subtle parallax scroll effect
- **Overlay:** Dark gradient from transparent (top) to black/70 (bottom)
- **Content Position:** Bottom-center with generous padding
- **Typography:** Large white text with shadow
- **Animation:** Fade-in on load, parallax on scroll

**Best For:** When you have amazing photos but no suitable video

## Component Code

```tsx
// components/sections/ImageHeroSection.tsx
'use client'

import { useEffect, useState } from 'react'
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
```

## Alternative: Ken Burns Effect (If No Parallax Desired)

```tsx
// Alternative with Ken Burns zoom animation
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function ImageHeroKenBurns() {
  return (
    <section className="relative h-[90vh] overflow-hidden">
      {/* Background Image with Ken Burns Zoom */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1 }}
        animate={{ scale: 1.1 }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <Image
          src="/images/hero-couple.jpg"
          alt="Hel e Ylana"
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      {/* Rest of content same as above... */}
    </section>
  )
}
```

## Image Requirements

### Ideal Photo Content

**Subject:**
- You two together (primary focus)
- Natural, candid moment (not posed wedding photo look)
- Good lighting (golden hour ideal)
- Authentic emotion (laughing, smiling, looking at each other)

**Composition:**
- Space at bottom third for text overlay
- Not too busy (allows text to breathe)
- Good focal point on your faces
- Avoid harsh shadows or backlighting

**Settings (Priority Order):**
1. 🔴 **BEST:** At home together (couch, kitchen, balcony)
   - Why: Authentic, shows "us in our space"
   - Example: Cooking together, cuddling with dogs, laughing on couch

2. 🔴 **EXCELLENT:** Outdoor candid moment
   - Why: Romantic, cinematic lighting
   - Example: Walking together, sitting in park, golden hour photo

3. 🟡 **GOOD:** Travel/adventure photo
   - Why: Shows partnership, shared experiences
   - Example: Rio beach, Búzios sunset, São Paulo trip

4. 🟡 **GOOD:** Restaurant/date night
   - Why: Shows your foodie side, date life
   - Example: Mangue Azul, any favorite restaurant

5. 🟢 **NICE:** With the dogs at home
   - Why: Shows family, warmth
   - Example: All 6 of you together, chaos captured beautifully

### Photo Suggestions (Specific)

**Option A: Intimate Home Moment**
- Setting: Your apartment living room or kitchen
- Lighting: Natural window light (soft, flattering)
- Mood: Cozy, authentic, "this is us"
- Composition: Medium shot, both in frame, interacting naturally

**Option B: Outdoor Romantic Shot**
- Setting: Beach, park, or urban golden hour
- Lighting: Sunset/golden hour (warm tones)
- Mood: Romantic, cinematic, aspirational
- Composition: Wide shot with environment, you two as focal point

**Option C: The Proposal Photo** (if you have one)
- Setting: Wherever you proposed
- Lighting: Any (emotional moment trumps technical quality)
- Mood: THE moment - raw emotion
- Composition: Authentic documentation of that day

### Technical Specs

- **Format:** JPG or WebP
- **Resolution:** Minimum 2560x1440 (higher is better)
- **Aspect Ratio:** 16:9 or wider
- **File Size:** Under 500KB after optimization
- **Quality:** High (no visible compression artifacts)
- **Color:** Vibrant but not oversaturated
- **Focus:** Sharp on faces

### Optimization Process

```bash
# Using ImageMagick to optimize
convert hero-couple-raw.jpg \
  -resize 2560x1440^ \
  -gravity center \
  -extent 2560x1440 \
  -quality 85 \
  hero-couple.jpg

# Create WebP version
cwebp -q 85 hero-couple.jpg -o hero-couple.webp

# Create mobile version
convert hero-couple-raw.jpg \
  -resize 1280x720^ \
  -gravity center \
  -extent 1280x720 \
  -quality 82 \
  hero-couple-mobile.jpg
```

## Implementation Steps

1. **Select Best Photo:**
   - Review all recent photos of you two together
   - Choose 3-5 candidates
   - Test with dark overlay (will text be readable?)
   - Pick the one that feels most "us"

2. **Optimize Image:**
   ```bash
   # Desktop version
   convert selected-photo.jpg \
     -resize 2560x1440^ \
     -gravity center \
     -extent 2560x1440 \
     -quality 85 \
     public/images/hero-couple.jpg

   # Mobile version (portrait crop)
   convert selected-photo.jpg \
     -resize 1080x1920^ \
     -gravity center \
     -extent 1080x1920 \
     -quality 82 \
     public/images/hero-couple-mobile.jpg
   ```

3. **Place Files:**
   ```
   public/
   └── images/
       ├── hero-couple.jpg        (desktop: 2560x1440)
       └── hero-couple-mobile.jpg (mobile: 1080x1920)
   ```

4. **Update Homepage:**
   ```tsx
   // app/page.tsx
   import ImageHeroSection from '@/components/sections/ImageHeroSection'
   import EventDetailsSection from '@/components/sections/EventDetailsSection'
   // ... rest of imports

   export default function Home() {
     return (
       <main className="min-h-screen">
         <Navigation />
         <ImageHeroSection />
         <EventDetailsSection />
         <StoryPreview />
         {/* ... rest of sections */}
       </main>
     )
   }
   ```

5. **Test Overlay:**
   - Check text readability on actual photo
   - Adjust gradient opacity if needed
   - Test on both light and dark areas of photo
   - Verify on mobile (different crop may show different area)

## Parallax Configuration

```tsx
// Adjust parallax intensity
const imageY = useTransform(scrollY, [0, 1000], [0, 150])  // Less movement
// OR
const imageY = useTransform(scrollY, [0, 1000], [0, 300])  // More movement

// Disable parallax on mobile (performance)
import { useMediaQuery } from '@/hooks/useMediaQuery'

const isMobile = useMediaQuery('(max-width: 768px)')
const imageY = useTransform(scrollY,
  [0, 1000],
  isMobile ? [0, 0] : [0, 200]  // No parallax on mobile
)
```

## What Makes This DTF-Inspired?

1. **Full-Bleed Visual** - Image fills entire screen
2. **Parallax Effect** - Adds depth and sophistication
3. **Text Overlay** - Large typography over visuals
4. **Center Alignment** - Classic, elegant composition
5. **Minimal Content** - Only essential info
6. **Dark Gradient** - Ensures readability
7. **Elegant Typography** - Large, sophisticated fonts

## Pros vs Option 1 (Video)

**Advantages:**
- ✅ Simpler to implement (no video encoding)
- ✅ Faster loading (smaller file size)
- ✅ Easier content selection (more photos than videos)
- ✅ No autoplay restrictions on mobile
- ✅ Better performance on slow connections

**Trade-offs:**
- ❌ Less dynamic (static vs moving)
- ❌ Lower engagement potential
- ❌ No storytelling through motion

## When to Choose This Option

Choose Image Hero if:
- You have stunning photos but no suitable video
- Performance is critical (slower connections)
- You prefer elegant simplicity over dynamic impact
- Your best content is in photo format
- You want faster development time

## Expected Impact

- **Emotional Connection:** Strong - high-quality photo of the couple
- **Engagement:** Good - parallax adds interest
- **Performance:** Excellent - fast loading
- **Sophistication:** High - elegant, not gimmicky
- **Conversion:** Good - clear CTAs with emotional context
