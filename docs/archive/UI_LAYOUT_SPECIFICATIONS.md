# UI/Layout Specifications - Thousand Days of Love Wedding Website

## Executive Summary

This document provides comprehensive UI/UX specifications for transforming the "Thousand Days of Love" wedding website from a text-heavy template aesthetic to a **DTF-inspired cinematic storytelling experience**. The transformation leverages full-bleed visuals, elegant text overlays, and emotional narrative flow while maintaining the existing monochromatic wedding invitation design system.

### Design Vision

**From:** Text-heavy cards with static layouts feeling like a generic wedding template
**To:** Visually immersive storytelling experience that makes guests feel the 1000-day journey through cinematic visuals

### Key Design Decisions

1. **Homepage Hero:** Full-bleed video background (100vh) with minimal text overlay - creates immediate emotional connection
2. **Story Page:** Alternating full-bleed moment cards for timeline events - each milestone becomes immersive
3. **About Us:** Horizontal scroll gallery for pets with individual hero cards - transforms emoji circles into character introductions
4. **Gallery:** Keep existing video hero, enhance with transitional moments between sections
5. **Gifts:** Compact image hero (50vh) showing apartment - provides context without overwhelming functionality
6. **RSVP:** Minimal hero (40vh) with celebration photo - doesn't distract from form
7. **Location:** Full venue showcase hero with Casa HY video/photos - makes guests excited about the space

### Success Metrics

- **Emotional Impact:** Guests should feel connected to couple's story before reading any text
- **Engagement:** Average time on homepage should increase 2-3x with video hero
- **Memorability:** Website should be "the video wedding site" guests talk about
- **Conversion:** RSVP and gift contributions should increase with visual storytelling

---

## 1. Component Library - DTF-Inspired Reusable Components

### 1.1 VideoHero Component

**Purpose:** Full-bleed video background with text overlay for maximum cinematic impact

**Variants:**
- `full-screen` - 100vh height for homepage hero
- `tall` - 80vh for major section intros
- `compact` - 60vh for supporting sections

**Props Interface:**
```typescript
interface VideoHeroProps {
  videoSrc: string                    // Desktop video URL
  mobileSrc?: string                  // Optimized mobile video
  posterSrc: string                   // Loading state image
  fallbackSrc: string                 // Reduced motion image
  overlay: 'gradient-bottom' | 'gradient-center' | 'dark-tint'
  contentPosition: 'bottom-left' | 'bottom-center' | 'center'
  height?: '100vh' | '80vh' | '60vh'
  children: React.ReactNode
  showScrollIndicator?: boolean
}
```

**Layout Structure:**
```jsx
<section className="relative overflow-hidden" style={{ height }}>
  {/* Video Layer (z-0) */}
  <div className="absolute inset-0 z-0">
    <video autoPlay loop muted playsInline poster={posterSrc}>
      <source src={videoSrc} type="video/mp4" media="(min-width: 1024px)" />
      <source src={mobileSrc} type="video/mp4" media="(max-width: 1023px)" />
    </video>

    {/* Overlay Gradient */}
    <div className={`absolute inset-0 ${overlayClass}`} />
  </div>

  {/* Content Layer (z-10) */}
  <div className="relative z-10 h-full flex items-end justify-start p-20">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      {children}
    </motion.div>
  </div>

  {/* Scroll Indicator (z-20) */}
  {showScrollIndicator && <ScrollIndicator />}
</section>
```

**Spacing System:**
- Desktop padding: 80px (XXL)
- Tablet padding: 48px (XL)
- Mobile padding: 32px (L)

**Typography Hierarchy:**
```css
/* Monogram */
font-family: var(--font-cormorant)
font-size: clamp(4rem, 10vw, 6rem)
font-weight: 300
color: white
text-shadow: 0 2px 20px rgba(0,0,0,0.5)

/* Names */
font-family: var(--font-playfair)
font-size: clamp(3rem, 8vw, 5rem)
font-weight: 600
color: white
letter-spacing: 0.15em
text-transform: uppercase

/* Body Text */
font-family: var(--font-crimson)
font-size: clamp(1.25rem, 2vw, 1.5rem)
color: rgba(255,255,255,0.9)
font-style: italic
line-height: 1.8
```

**Overlay Options:**
```css
/* gradient-bottom - best for bottom content */
.gradient-bottom {
  background: linear-gradient(
    to top,
    rgba(0,0,0,0.9) 0%,
    rgba(0,0,0,0.5) 40%,
    transparent 100%
  );
}

/* gradient-center - best for centered content */
.gradient-center {
  background: radial-gradient(
    circle at center,
    rgba(0,0,0,0.7) 0%,
    rgba(0,0,0,0.3) 50%,
    transparent 100%
  );
}

/* dark-tint - uniform darkness */
.dark-tint {
  background: rgba(0,0,0,0.4);
}
```

**Responsive Breakpoints:**
```css
/* Desktop (1024px+) */
- Full video background
- 100vh height
- Large typography
- Parallax effects enabled

/* Tablet (768px-1023px) */
- Optimized video (720p)
- 80vh height
- Medium typography
- Reduced parallax

/* Mobile (<768px) */
- Static image (no video)
- 60vh height
- Small typography
- No parallax
```

**Animation Patterns:**
```typescript
// Fade in content after video loads
const contentVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.3,
      ease: "easeOut"
    }
  }
}

// Scroll indicator bounce
const scrollVariants = {
  animate: {
    y: [0, 8, 0],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}
```

**Technical Requirements:**
- Video format: MP4 (H.264 codec)
- Desktop resolution: 1920x1080 @ 30fps
- Mobile resolution: 1280x720 @ 24fps
- File size: <5MB desktop, <3MB mobile
- Bitrate: 5-8 Mbps desktop, 3-5 Mbps mobile
- Loop seamlessly (10-20 seconds)
- Poster image: High-quality frame in WebP format
- Fallback image: Same frame for reduced motion users

**Accessibility:**
```jsx
// Support reduced motion preference
const shouldReduceMotion = useReducedMotion()

if (shouldReduceMotion) {
  return <ImageHero imageSrc={fallbackSrc} {...props} />
}

// Add proper ARIA labels
<video aria-label="Hel and Ylana together at home">
  <track kind="captions" src="/captions/hero.vtt" />
</video>
```

---

### 1.2 ImageHero Component

**Purpose:** Full-bleed image background with parallax effects for static visual storytelling

**Variants:**
- `parallax` - Image scrolls slower than content (depth effect)
- `ken-burns` - Subtle zoom animation
- `static` - No animation (best performance)

**Props Interface:**
```typescript
interface ImageHeroProps {
  imageSrc: string
  imageAlt: string
  mobileImageSrc?: string
  overlay: 'gradient-bottom' | 'gradient-left' | 'gradient-right'
  contentPosition: 'bottom-left' | 'bottom-center' | 'center' | 'left'
  height?: '100vh' | '80vh' | '60vh' | '50vh' | '40vh'
  parallax?: boolean
  kenBurns?: boolean
  children: React.ReactNode
}
```

**Layout Structure:**
```jsx
<section className="relative overflow-hidden" style={{ height }}>
  {/* Image Layer */}
  <div className="absolute inset-0">
    <Image
      src={imageSrc}
      alt={imageAlt}
      fill
      priority
      className={`object-cover ${parallax ? 'scale-110' : ''} ${kenBurns ? 'animate-ken-burns' : ''}`}
    />

    {/* Overlay Gradient */}
    <div className={`absolute inset-0 ${overlayClass}`} />
  </div>

  {/* Content Layer */}
  <div className={`relative z-10 h-full flex ${positionClass}`}>
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="max-w-4xl"
    >
      {children}
    </motion.div>
  </div>
</section>
```

**Ken Burns Animation:**
```css
@keyframes ken-burns {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
  }
}

.animate-ken-burns {
  animation: ken-burns 20s ease-out infinite alternate;
}
```

**Parallax Implementation:**
```typescript
// Simple parallax with scroll position
const [scrollY, setScrollY] = useState(0)

useEffect(() => {
  const handleScroll = () => setScrollY(window.scrollY)
  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
}, [])

// Apply transform to image
<div style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
  <Image ... />
</div>
```

**Image Optimization:**
- Format: WebP with JPEG fallback
- Desktop: 2560x1440 @ 85% quality
- Tablet: 1920x1080 @ 80% quality
- Mobile: 1080x1920 (portrait) @ 75% quality
- Lazy loading for below-fold images
- Sharp focus on subjects (couple, venue)

---

### 1.3 SplitSection Component

**Purpose:** Side-by-side layout with image on one side, content on other - creates visual rhythm

**Props Interface:**
```typescript
interface SplitSectionProps {
  imagePosition: 'left' | 'right'
  imageSrc: string
  imageAlt: string
  imageOverlay?: boolean
  stickyImage?: boolean
  backgroundColor?: string
  children: React.ReactNode
}
```

**Layout Structure:**
```jsx
<section className="grid lg:grid-cols-2 min-h-screen">
  {/* Image Column - Order changes based on imagePosition */}
  <div className={`relative ${imagePosition === 'left' ? 'lg:order-1' : 'lg:order-2'}`}>
    <div className={stickyImage ? 'sticky top-0 h-screen' : 'h-screen'}>
      <Image src={imageSrc} alt={imageAlt} fill className="object-cover" />

      {imageOverlay && (
        <div className={`absolute inset-0 ${
          imagePosition === 'left'
            ? 'bg-gradient-to-r from-transparent to-[var(--background)]'
            : 'bg-gradient-to-l from-transparent to-[var(--background)]'
        }`} />
      )}
    </div>
  </div>

  {/* Content Column */}
  <div
    className={`${imagePosition === 'left' ? 'lg:order-2' : 'lg:order-1'}`}
    style={{ backgroundColor }}
  >
    <div className="flex items-center min-h-screen px-12 md:px-20 py-16">
      <div className="max-w-2xl mx-auto">
        {children}
      </div>
    </div>
  </div>
</section>
```

**Use Cases:**
- About Us section (couple photo + text)
- Story introduction (proposal photo + narrative)
- Venue details (Casa HY interior + practical info)

**Responsive Behavior:**
```css
/* Desktop: Side by side */
@media (min-width: 1024px) {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

/* Mobile: Stack vertically */
@media (max-width: 1023px) {
  display: flex;
  flex-direction: column;

  /* Image first, then content */
  .image-column { order: 1; height: 50vh; }
  .content-column { order: 2; }
}
```

---

### 1.4 HorizontalScrollGallery Component

**Purpose:** Swipeable card gallery for showcasing individual items (pets, timeline moments)

**Props Interface:**
```typescript
interface HorizontalScrollGalleryProps {
  items: Array<{
    id: string
    image: string
    title: string
    description: string
  }>
  cardWidth?: '85vw' | '60vw' | '40vw'
  aspectRatio?: '4/5' | '16/9' | '1/1'
  showDots?: boolean
}
```

**Layout Structure:**
```jsx
<div className="relative py-16">
  {/* Scrollable Container */}
  <div
    ref={scrollRef}
    className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-6 px-8"
  >
    {items.map((item, index) => (
      <motion.div
        key={item.id}
        className="flex-none w-[85vw] md:w-[60vw] lg:w-[40vw] snap-center"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        viewport={{ once: true }}
      >
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden group">
          {/* Image */}
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h3 className="text-3xl font-playfair text-white mb-3">
              {item.title}
            </h3>
            <p className="text-white/90 font-crimson italic leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>
      </motion.div>
    ))}
  </div>

  {/* Navigation Dots */}
  {showDots && (
    <div className="flex justify-center gap-2 mt-8">
      {items.map((_, index) => (
        <button
          key={index}
          onClick={() => scrollToIndex(index)}
          className="w-2 h-2 rounded-full bg-gray-300 hover:bg-gray-600 transition-colors"
        />
      ))}
    </div>
  )}
</div>
```

**Hide Scrollbar:**
```css
.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;  /* Chrome, Safari, Opera */
}
```

**Snap Scroll:**
```css
.snap-x {
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
}

.snap-center {
  scroll-snap-align: center;
}
```

**Touch Interactions:**
```typescript
// Smooth scroll to index
const scrollToIndex = (index: number) => {
  const container = scrollRef.current
  if (!container) return

  const cardWidth = container.offsetWidth * 0.85 // matches w-[85vw]
  container.scrollTo({
    left: cardWidth * index,
    behavior: 'smooth'
  })
}
```

---

### 1.5 ContentSection Component

**Purpose:** Text-only breathing room between visual sections - prevents visual overload

**Props Interface:**
```typescript
interface ContentSectionProps {
  backgroundColor?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  padding?: 'sm' | 'md' | 'lg' | 'xl'
  centered?: boolean
  children: React.ReactNode
}
```

**Layout Structure:**
```jsx
<section
  className={`py-${paddingMap[padding]}`}
  style={{ backgroundColor }}
>
  <div className={`max-w-${maxWidth} mx-auto px-8 ${centered ? 'text-center' : ''}`}>
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  </div>
</section>
```

**When to Use:**
- After a hero section (give eyes a rest)
- For detailed information (RSVP instructions, venue details)
- Between two visual sections (prevent monotony)

**Typography in Content Sections:**
```css
/* Headings */
h2 {
  font-family: var(--font-playfair);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 500;
  color: var(--primary-text);
  letter-spacing: 0.1em;
  margin-bottom: 1.5rem;
}

/* Body */
p {
  font-family: var(--font-crimson);
  font-size: clamp(1.125rem, 2vw, 1.25rem);
  line-height: 1.8;
  color: var(--secondary-text);
  font-style: italic;
  margin-bottom: 1rem;
}
```

---

### 1.6 TimelineMomentCard Component

**Purpose:** Full-width immersive card for timeline events with media background

**Props Interface:**
```typescript
interface TimelineMomentCardProps {
  date: string
  title: string
  description: string
  mediaSrc: string
  mediaType: 'photo' | 'video'
  layout: 'image-left' | 'image-right' | 'full-bleed'
}
```

**Layout Options:**

**A) Full-Bleed Layout:**
```jsx
<div className="relative h-screen">
  {/* Background Media */}
  <div className="absolute inset-0">
    {mediaType === 'video' ? (
      <video autoPlay loop muted playsInline className="w-full h-full object-cover" />
    ) : (
      <Image src={mediaSrc} fill className="object-cover" />
    )}

    {/* Dark gradient for text */}
    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
  </div>

  {/* Content Overlay */}
  <div className="relative z-10 h-full flex items-center px-20">
    <div className="max-w-2xl">
      <DateBadge>{formatDate(date)}</DateBadge>
      <h3 className="text-5xl font-playfair text-white mb-6">{title}</h3>
      <p className="text-xl text-white/90 font-crimson italic">{description}</p>
    </div>
  </div>
</div>
```

**B) Alternating Layout:**
```jsx
<div className="grid lg:grid-cols-2 gap-0 min-h-[80vh]">
  {/* Image Side */}
  <div className={layout === 'image-left' ? 'order-1' : 'order-2'}>
    <div className="h-full relative">
      <Image src={mediaSrc} fill className="object-cover" />
    </div>
  </div>

  {/* Content Side */}
  <div
    className={`flex items-center p-16 ${layout === 'image-left' ? 'order-2' : 'order-1'}`}
    style={{ backgroundColor: 'var(--background)' }}
  >
    <div>
      <DateBadge>{formatDate(date)}</DateBadge>
      <h3 className="text-4xl font-playfair mb-6">{title}</h3>
      <p className="text-lg font-crimson italic">{description}</p>
    </div>
  </div>
</div>
```

---

## 2. Page-by-Page Layout Specifications

### 2.1 HOMEPAGE (/)

**Current State:**
- Static cream background
- Text-heavy cards
- No visual storytelling
- Low emotional impact

**Transformed Layout:**
```
[Fixed Navigation - Always visible]

[SECTION 1: VIDEO HERO - 100vh]
├─ Full-bleed video loop (Hel & Ylana together)
├─ Dark gradient overlay (bottom 60%)
└─ Content (bottom-left, white text):
   ├─ Monogram: H ♥ Y (Cormorant, 6rem)
   ├─ Names: HEL & YLANA (Playfair, 5rem, uppercase)
   ├─ Tagline: "1000 dias. Sim, a gente fez a conta." (Crimson, italic)
   ├─ Date: 20.11.2025 (glass badge)
   └─ CTAs: [RSVP] [Nossa História]

[Scroll indicator - animated bounce]

[SECTION 2: EVENT DETAILS - Cream background, 120px padding]
├─ Countdown Timer (centered, large)
├─ Section Divider (botanical line)
└─ 3-Column Grid:
   ├─ [Calendar Icon] Data: 20 Nov 2025
   ├─ [Clock Icon] Horário: 10h30
   └─ [Map Icon] Local: Casa HY

[SECTION 3: STORY PREVIEW]
Option A - Split Section:
├─ Left: Image (couple at home, sticky scroll)
└─ Right: Content
   ├─ "Nossa História"
   ├─ Quote + preview text
   └─ [Ver História Completa →]

[SECTION 4: ABOUT US + PETS]
Option A - Horizontal Scroll Pet Gallery:
├─ Intro card (dark bg):
   └─ "Nossa Família: Agora Somos 6"
└─ 4 scrollable cards:
   ├─ Linda 👑 (full card with hero photo)
   ├─ Cacao 🍫 (full card)
   ├─ Olivia 🌸 (full card)
   └─ Oliver ⚡ (full card)

[SECTION 5: WEDDING LOCATION]
(Keep existing component - already good)

[SECTION 6: QUICK ACTIONS - Decorative background]
├─ Centered CTAs
├─ [Confirmar Presença]
├─ [Lista de Presentes]
└─ [Ver Galeria]

[Footer]
```

**Section 1 - Video Hero Implementation:**
```tsx
<VideoHero
  videoSrc="/videos/hel-ylana-home.mp4"
  mobileSrc="/videos/hel-ylana-home-mobile.mp4"
  posterSrc="/images/hero-poster.jpg"
  fallbackSrc="/images/hero-fallback.jpg"
  overlay="gradient-bottom"
  contentPosition="bottom-left"
  height="100vh"
  showScrollIndicator={true}
>
  {/* Monogram */}
  <motion.div
    className="wedding-monogram"
    style={{
      fontFamily: 'var(--font-cormorant)',
      fontSize: 'clamp(4rem, 10vw, 6rem)',
      fontWeight: 300,
      color: 'white',
      letterSpacing: '0.15em',
      marginBottom: '2rem'
    }}
  >
    H <span style={{ color: 'rgba(255,255,255,0.8)' }}>♥</span> Y
  </motion.div>

  {/* Names */}
  <motion.h1
    style={{
      fontFamily: 'var(--font-playfair)',
      fontSize: 'clamp(3rem, 8vw, 5rem)',
      fontWeight: 600,
      color: 'white',
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      marginBottom: '1.5rem'
    }}
  >
    Hel & Ylana
  </motion.h1>

  {/* Tagline */}
  <motion.p
    style={{
      fontFamily: 'var(--font-crimson)',
      fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
      color: 'rgba(255,255,255,0.9)',
      fontStyle: 'italic',
      marginBottom: '2rem'
    }}
  >
    1000 dias. Sim, a gente fez a conta.
  </motion.p>

  {/* Date Badge */}
  <motion.div
    className="glass-badge"
    style={{
      display: 'inline-block',
      padding: '12px 32px',
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: '999px',
      marginBottom: '2rem'
    }}
  >
    <span style={{ color: 'white', fontFamily: 'var(--font-playfair)', fontSize: '1.25rem', letterSpacing: '0.15em' }}>
      20.11.2025
    </span>
  </motion.div>

  {/* CTAs */}
  <div className="flex gap-6">
    <Button variant="glass-white" size="lg">
      RSVP
    </Button>
    <Button variant="glass-outline" size="lg">
      Nossa História
    </Button>
  </div>
</VideoHero>
```

**Video Content Recommendations (Priority Order):**
1. **At home together** - cozy, natural, shows intimacy (BEST)
2. **Walking together outdoors** - golden hour, romantic
3. **With all 4 dogs** - shows family, warmth
4. **Cooking together** - shows partnership
5. **Candid laughing moment** - genuine emotion

**Video Specs:**
- Duration: 12-15 seconds (seamless loop)
- Resolution: 1920x1080 (desktop), 1280x720 (mobile)
- File size: <5MB desktop, <3MB mobile
- Frame rate: 30fps
- Format: MP4 (H.264)
- Audio: None (muted)

**Section 2 - Event Details:**
- Background: var(--background) #F8F6F3
- Padding: 120px vertical
- Max-width: 1280px
- Countdown: 48px font size, centered
- Cards: White with subtle shadow, 12px gap between

**Section 3 - Story Preview (Split Section):**
```tsx
<SplitSection
  imagePosition="left"
  imageSrc="/images/couple-proposal.jpg"
  imageAlt="Hel and Ylana at proposal"
  stickyImage={true}
  backgroundColor="var(--background)"
>
  <div className="max-w-xl">
    <h2 className="text-4xl font-playfair mb-6">Nossa História</h2>
    <blockquote className="text-xl font-crimson italic mb-6">
      "Do primeiro 'oi' no WhatsApp até a Casa HY.
      1000 dias de construir algo muito maior do que qualquer um imagina."
    </blockquote>
    <p className="text-lg font-crimson mb-8">
      6 de janeiro de 2023. Um "oi" no WhatsApp. Tinder antes.
      Hoje, 1000 dias depois, a gente se casa...
    </p>
    <Button variant="wedding-outline" size="lg">
      Ver História Completa →
    </Button>
  </div>
</SplitSection>
```

**Section 4 - Pets Gallery:**
```tsx
<HorizontalScrollGallery
  items={[
    {
      id: '1',
      image: '/images/pets/linda-hero.jpg',
      title: 'Linda 👑',
      description: 'Veio primeiro. Autista, síndrome de Down, rainha absoluta desta casa. Ela que manda, a gente só paga as contas.'
    },
    {
      id: '2',
      image: '/images/pets/cacao-hero.jpg',
      title: 'Cacao 🍫',
      description: '1 libra de Spitz Alemão. Volume no máximo 24/7. A Ylana não deu muita escolha pro Hel. Casamento, né?'
    },
    {
      id: '3',
      image: '/images/pets/olivia-hero.jpg',
      title: 'Olivia 🌸',
      description: 'Filha da Linda. A calma da família (alguém tinha que ser). Elegante como a mãe, sem o drama todo.'
    },
    {
      id: '4',
      image: '/images/pets/oliver-hero.jpg',
      title: 'Oliver ⚡',
      description: 'Filho da Linda. Energia pura. Cacao versão 2.0 no quesito barulho. A casa não tem mais silêncio.'
    }
  ]}
  cardWidth="60vw"
  aspectRatio="4/5"
  showDots={true}
/>
```

**Mobile Adaptations:**
- Video hero: 60vh height (not 100vh)
- Show static image instead of video
- Single column layout for event details
- Stack split sections vertically
- Pets gallery: 85vw card width (full screen swipe)

**Performance Optimizations:**
- Lazy load video (only when in viewport)
- Preload poster image
- Reduce motion: show static image
- Compress video aggressively
- Use CDN for video hosting (Vercel Blob)

---

### 2.2 FULL STORY PAGE (/historia)

**Current State:**
- Text-only intro
- Small thumbnail cards in timeline
- Generic card design
- No visual immersion

**Transformed Layout:**
```
[Fixed Navigation]

[SECTION 1: HERO INTRO - 70vh]
├─ Full-bleed image (proposal or meaningful moment)
├─ Dark center gradient overlay
└─ Centered content (white):
   ├─ Icon: Heart in circle
   ├─ "Nossa História Completa"
   ├─ Subtitle: "Daquele 'oi' no WhatsApp até o casamento..."
   └─ Scroll indicator

[SECTION 2: TIMELINE - Full-Bleed Moments]
├─ Event 1: Dia 1 - Primeiro "Oi"
│  └─ Full-bleed card (80vh):
│     ├─ Background: Screenshot of first message (blurred)
│     ├─ Gradient: Left dark to right light
│     └─ Content (left side):
│        ├─ Date badge: "6 Jan 2023"
│        ├─ Title: "Dia 1 - O Primeiro 'Oi'"
│        └─ Description: Full story text
│
├─ Spacer (80px breathing room)
│
├─ Event 2: Dia 8 - Primeiro Encontro
│  └─ Full-bleed card (80vh):
│     ├─ Background: Photo from first date
│     ├─ Gradient: Right dark to left light (alternates)
│     └─ Content (right side)
│
├─ Spacer (80px)
│
├─ Event 3: Dia 50 - Namoro Official
├─ Event 4: Dia 434 - Casa Própria
├─ Event 5: Dia 930 - Pedido em Icaraí
├─ Event 6: Dia 1000 - Casamento na Casa HY
│
[SECTION 3: ABOUT US]
(Keep existing component - already good)

[SECTION 4: BACK TO HOME]
└─ Centered CTA: [← Voltar ao Início]
```

**Timeline Event Card - Full-Bleed Implementation:**
```tsx
<motion.div
  className="relative h-[80vh] overflow-hidden"
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ duration: 0.8 }}
  viewport={{ once: true, margin: "-100px" }}
>
  {/* Background Media */}
  <div className="absolute inset-0">
    {event.media_type === 'video' ? (
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
        src={event.media_url}
      />
    ) : (
      <Image
        src={event.media_url}
        alt={event.title}
        fill
        className="object-cover"
      />
    )}

    {/* Gradient Overlay (alternates direction) */}
    <div className={`absolute inset-0 ${
      index % 2 === 0
        ? 'bg-gradient-to-r from-black/95 via-black/60 to-transparent'
        : 'bg-gradient-to-l from-black/95 via-black/60 to-transparent'
    }`} />
  </div>

  {/* Content Overlay */}
  <div className={`relative z-10 h-full flex items-center px-16 lg:px-24 ${
    index % 2 === 0 ? 'justify-start' : 'justify-end'
  }`}>
    <motion.div
      className="max-w-2xl"
      initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      viewport={{ once: true }}
    >
      {/* Date Badge */}
      <div className="inline-block mb-6 px-6 py-3 rounded-full"
           style={{
             background: 'rgba(255,255,255,0.15)',
             backdropFilter: 'blur(10px)',
             border: '1px solid rgba(255,255,255,0.3)'
           }}>
        <span className="text-white font-playfair text-lg tracking-wide">
          {formatDate(event.date)} • Dia {daysSinceStart}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-5xl lg:text-6xl font-playfair font-semibold text-white mb-6 leading-tight">
        {event.title}
      </h3>

      {/* Description */}
      <p className="text-xl lg:text-2xl text-white/90 font-crimson italic leading-relaxed">
        {event.description}
      </p>

      {/* Location (if available) */}
      {event.location && (
        <div className="mt-6 flex items-center gap-2 text-white/80">
          <MapPin className="w-5 h-5" />
          <span className="font-crimson text-lg">{event.location}</span>
        </div>
      )}
    </motion.div>
  </div>
</motion.div>

{/* Spacer between events */}
<div className="h-20"  />
```

**Timeline Events Content:**
```typescript
const timelineEvents = [
  {
    date: '2023-01-06',
    day: 1,
    title: 'Dia 1 - O Primeiro "Oi"',
    description: 'Do Tinder ao WhatsApp. Aquele primeiro "oi" que mudou tudo. Conversamos até tarde, descobrindo que tinha muito mais em comum do que esperávamos. Quem diria que esse match se tornaria nossa história de 1000 dias?',
    media_url: '/images/timeline/primeiro-oi.jpg',
    media_type: 'photo',
    location: 'WhatsApp - Primeiro Contato'
  },
  {
    date: '2023-01-14',
    day: 8,
    title: 'Dia 8 - Primeiro Encontro Real',
    description: 'Casa Fontana pra jantar, depois Avatar VIP nas poltronas F11 e F12. A química que existia nas mensagens era ainda melhor pessoalmente. Conversamos, rimos, e já sabíamos que isso era diferente.',
    media_url: '/images/timeline/primeiro-encontro.jpg',
    media_type: 'photo',
    location: 'Casa Fontana, Fortaleza'
  },
  {
    date: '2023-02-10',
    day: 35,
    title: 'Dia 35 - O Gesto Que Mudou Tudo',
    description: 'Hel ficou doente. Ylana apareceu com remédio e chá. Nada muito, né? Mas pra quem nunca teve isso... na hora ele já sabia: é ela. Às vezes os gestos pequenos revelam os sentimentos grandes.',
    media_url: '/images/timeline/cuidado.jpg',
    media_type: 'photo',
    location: 'Casa do Hel'
  },
  {
    date: '2023-02-25',
    day: 50,
    title: 'Dia 50 - Pedido de Namoro em Guaramiranga',
    description: 'Hel tinha planejado um jantar romântico especial. Mas não conseguiu esperar! Pediu namoro na manhã mesmo, lá nas montanhas de Guaramiranga. Às vezes o coração não aguarda o momento perfeito - porque TODO momento com a pessoa certa é perfeito.',
    media_url: '/images/timeline/namoro.jpg',
    media_type: 'photo',
    location: 'Guaramiranga, Ceará'
  },
  {
    date: '2024-03-15',
    day: 434,
    title: 'Dia 434 - Casa Própria, Finalmente!',
    description: 'O apartamento que o Hel passava de bicicleta na faculdade sonhando em morar. Anos de trabalho duro, economia, planejamento. E agora é NOSSO. Não mais alugado - é casa própria. Família de 6 (contando Linda, Cacao, Olivia e Oliver).',
    media_url: '/images/timeline/casa-propria.jpg',
    media_type: 'photo',
    location: 'Nosso Apartamento dos Sonhos'
  },
  {
    date: '2024-12-25',
    day: 719,
    title: 'Dia 719 - Primeiro Natal na Nossa Casa',
    description: 'Natal recebendo a família em NOSSA casa. Não mais em casa alugada ou na casa dos outros. Nossa. A mesa montada, a comida feita por nós, os 4 cachorros bagunçando tudo. Foi perfeito justamente porque era nosso.',
    media_url: '/images/timeline/natal-casa.jpg',
    media_type: 'photo',
    location: 'Nossa Casa'
  },
  {
    date: '2025-08-30',
    day: 965,
    title: 'Dia 965 - O Pedido em Icaraí',
    description: '"Vamos jantar no restaurante", ele disse. Era mentira. Tinha montado a surpresa na suíte - velas, pétalas, tudo preparado. As câmeras ligadas. E o SIM mais lindo que ele já ouviu. 35 dias antes dos 1000 dias, porque não dava pra esperar mais.',
    media_url: '/videos/timeline/pedido-completo.mp4',
    media_type: 'video',
    location: 'Icaraí de Amontada, Ceará'
  },
  {
    date: '2025-11-20',
    day: 1000,
    title: 'Dia 1000 - Para Sempre na Casa HY',
    description: 'Casa HY, 10h30 da manhã. Exatamente 1000 dias após aquele primeiro "oi" no WhatsApp. 60 pessoas (pra quem é introvertido, é muita gente). Mas cada uma delas importa. E hoje, nesse espaço de arte em Fortaleza, mil dias se tornam eternidade.',
    media_url: '/images/timeline/casamento.jpg',
    media_type: 'photo',
    location: 'Casa HY, Fortaleza'
  }
]
```

**Alternative: Alternating Split Layout**
(If performance is concern or prefer more traditional layout)

```tsx
<div className={`grid lg:grid-cols-2 min-h-[80vh] ${
  index % 2 === 0 ? '' : 'lg:direction-rtl'
}`}>
  {/* Image Column */}
  <div className="relative">
    <Image src={event.media_url} fill className="object-cover" />
  </div>

  {/* Content Column */}
  <div className="flex items-center p-16 lg:p-24" >
    <div>
      <DateBadge />
      <h3 className="text-4xl lg:text-5xl font-playfair mb-6">{event.title}</h3>
      <p className="text-lg lg:text-xl font-crimson italic">{event.description}</p>
    </div>
  </div>
</div>
```

**Mobile Adaptations:**
- Full-bleed cards: 60vh height (not 80vh)
- Stack image on top, content below
- Smaller typography (3rem for title)
- Less padding (16px instead of 24px)
- All content left-aligned (no alternating)

**Content Loading Strategy:**
- First 2 events: Load immediately
- Remaining events: Lazy load when scrolling
- Videos: Load poster frame first, video on demand
- Images: Progressive WebP loading

---

### 2.3 GALLERY PAGE (/galeria)

**Current State:**
- Already has video hero (GOOD!)
- Masonry gallery (GOOD!)
- Needs: Transitional moments between sections

**Enhanced Layout:**
```
[Fixed Navigation]

[SECTION 1: HERO VIDEO - 100vh]
(Keep existing HeroVideoSection - already cinematic!)

[SECTION 2: TIMELINE PREVIEW]
(Keep existing StoryTimeline - already good!)

[Transitional Moment - 60vh]
├─ Static image with overlay
├─ Text: "2023: O Ano do Primeiro Encontro"
└─ Fade to next section

[SECTION 3: PHOTO GALLERY 2023]
├─ MasonryGallery with filters
└─ Photos from 2023

[Transitional Moment - 60vh]
├─ Static image with overlay
├─ Text: "2024: O Ano da Casa Própria"
└─ Fade to next section

[SECTION 4: PHOTO GALLERY 2024]

[Transitional Moment - 60vh]
├─ Video loop (short)
├─ Text: "2025: O Ano do Sim"
└─ Fade to next section

[SECTION 5: PHOTO GALLERY 2025]

[SECTION 6: VIDEO GALLERY]
(Keep existing VideoGallery - already good!)

[SECTION 7: FEATURED MEMORIES]
(Keep existing - already good!)

[SECTION 8: CTA]
(Keep existing - already good!)
```

**Transitional Moment Component:**
```tsx
function TransitionalMoment({
  imageSrc,
  text,
  year
}: TransitionalMomentProps) {
  return (
    <motion.section
      className="relative h-[60vh] overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt={`${year} transition`}
          fill
          className="object-cover"
        />

        {/* Dark overlay for text */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Centered Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {/* Year */}
          <div className="text-8xl lg:text-9xl font-playfair font-bold text-white/20 mb-4">
            {year}
          </div>

          {/* Text */}
          <h2 className="text-4xl lg:text-5xl font-playfair text-white mb-6">
            {text}
          </h2>

          {/* Divider */}
          <div className="w-32 h-px bg-white/50 mx-auto" />
        </motion.div>
      </div>
    </motion.section>
  )
}

// Usage
<TransitionalMoment
  year="2024"
  text="O Ano da Casa Própria"
  imageSrc="/images/transitions/2024-apartment.jpg"
/>
```

**Why This Works:**
- Provides visual breathing room between galleries
- Creates narrative structure (year by year)
- Prevents "wall of photos" monotony
- Adds cinematic transitions
- Low development effort (reuses ImageHero logic)

**No Other Changes Needed:**
- Existing HeroVideoSection is already excellent
- MasonryGallery with filters works well
- VideoGallery is functional and beautiful
- Featured memories section is perfect
- Just add transitional moments between years

---

### 2.4 GIFT REGISTRY PAGE (/presentes)

**Current State:**
- Text header with icon
- Functional stats and filters
- Gift cards grid

**Transformed Layout:**
```
[Fixed Navigation]

[SECTION 1: COMPACT HERO - 50vh]
├─ Background: Photo of your apartment exterior
├─ Overlay: Strong dark gradient (text needs contrast)
└─ Centered content (white):
   ├─ Eyebrow: "Ajudem a Construir Nosso Lar"
   ├─ Title: "O Apartamento dos Sonhos"
   ├─ Subtitle: "Esse apartamento que o Hel passava de bicicleta..."
   └─ (No CTA - goes straight to gifts)

[SECTION 2: STATS GRID]
(Keep existing - works well!)

[SECTION 3: FILTERS]
(Keep existing - functional!)

[SECTION 4: GIFTS GRID]
(Keep existing - well designed!)

[SECTION 5: THANK YOU CTA]
(Keep existing - perfect!)
```

**Compact Hero Implementation:**
```tsx
<ImageHero
  imageSrc="/images/apartment-exterior.jpg"
  imageAlt="Nosso apartamento dos sonhos"
  overlay="dark-tint" // Strong overlay for text clarity
  contentPosition="center"
  height="50vh"
>
  <div className="text-center max-w-3xl">
    {/* Eyebrow */}
    <motion.p
      className="text-lg tracking-widest uppercase mb-4"
      style={{
        fontFamily: 'var(--font-playfair)',
        color: 'rgba(255,255,255,0.8)',
        letterSpacing: '0.2em'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      Ajudem a Construir Nosso Lar
    </motion.p>

    {/* Title */}
    <motion.h1
      className="text-5xl lg:text-6xl font-playfair font-bold text-white mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      O Apartamento dos Sonhos
    </motion.h1>

    {/* Description */}
    <motion.p
      className="text-xl lg:text-2xl text-white/90 font-crimson italic leading-relaxed"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      Esse apartamento que o Hel passava de bicicleta na faculdade sonhando?
      Agora é nosso. Casa própria depois de anos de trabalho.
      Família de 6. Se quiser ajudar a fazer dela um lar de verdade,
      a gente agradece demais.
    </motion.p>
  </div>
</ImageHero>
```

**Image Recommendations:**
1. Apartment exterior (golden hour)
2. Apartment interior (showing it's real home)
3. You two in the apartment
4. Neighborhood/building photo
5. View from apartment window

**Why Compact (50vh)?**
- Not primary focus - gifts are
- Provides context without overwhelming
- Faster scroll to functional content
- Mobile-friendly height

**Dark Tint Overlay:**
- Use stronger overlay (60% opacity)
- Ensure text contrast meets WCAG AA
- White text must be readable
- Test with contrast checker

---

### 2.5 RSVP PAGE (/rsvp)

**Current State:**
- Simple text header
- Search interface (functional)
- Results cards

**Transformed Layout:**
```
[Fixed Navigation]

[SECTION 1: MINIMAL HERO - 40vh]
├─ Background: Photo of celebration/gathering
├─ Overlay: Medium dark gradient
└─ Centered content (white):
   ├─ Title: "Confirma Presença?"
   └─ Subtitle: "60 pessoas. Pra quem é introvertido, isso é muita gente."

[SECTION 2: SEARCH FORM]
(Keep existing - works perfectly!)

[SECTION 3: RESULTS]
(Keep existing - functional!)
```

**Minimal Hero Implementation:**
```tsx
<ImageHero
  imageSrc="/images/celebration-moment.jpg"
  imageAlt="Celebrando juntos"
  overlay="gradient-bottom"
  contentPosition="center"
  height="40vh"
>
  <div className="text-center">
    {/* Title */}
    <motion.h1
      className="text-5xl lg:text-6xl font-playfair font-bold text-white mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      Confirma Presença?
    </motion.h1>

    {/* Subtitle */}
    <motion.p
      className="text-xl lg:text-2xl text-white/90 font-crimson italic"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      60 pessoas. Pra quem é introvertido, isso é muita gente.
    </motion.p>
  </div>
</ImageHero>
```

**Why Minimal (40vh)?**
- RSVP is functional - form is priority
- Just adds personality without distraction
- Quick to scroll past to search
- Mobile-friendly

**Image Recommendations:**
1. You two with friends at home
2. Gathering/party moment
3. Celebration photo
4. Group hug/toast
5. Casa HY exterior (venue preview)

---

### 2.6 WEDDING LOCATION PAGE (/local)

**Current State:**
- WeddingLocation component (functional)
- Map integration
- Details cards

**Transformed Layout:**
```
[Fixed Navigation]

[SECTION 1: VENUE SHOWCASE HERO - 80vh]
├─ Background: Video tour of Casa HY OR image of venue
├─ Overlay: Gradient bottom
└─ Bottom-center content (white):
   ├─ Venue Name: "Casa HY"
   ├─ Tagline: "Uma galeria de arte em Fortaleza"
   ├─ Address: "Eng. Luciano Cavalcante"
   └─ [Ver Detalhes ↓] (scrolls to map)

[SECTION 2: VENUE DETAILS SPLIT]
├─ Left: Interactive Google Map (sticky)
└─ Right: Details cards
   ├─ Address
   ├─ Parking
   ├─ Dress code
   └─ Transport options

[SECTION 3: VENUE GALLERY]
└─ 4-6 photos of Casa HY interior/exterior
   (Small masonry grid)

[SECTION 4: CTA]
└─ Centered: [Confirmar Presença]
```

**Venue Showcase Hero:**
```tsx
{hasVenueVideo ? (
  <VideoHero
    videoSrc="/videos/casa-hy-tour.mp4"
    mobileSrc="/videos/casa-hy-tour-mobile.mp4"
    posterSrc="/images/casa-hy-poster.jpg"
    fallbackSrc="/images/casa-hy-exterior.jpg"
    overlay="gradient-bottom"
    contentPosition="bottom-center"
    height="80vh"
  >
    <VenueContent />
  </VideoHero>
) : (
  <ImageHero
    imageSrc="/images/casa-hy-exterior.jpg"
    imageAlt="Casa HY - Local do Casamento"
    overlay="gradient-bottom"
    contentPosition="bottom-center"
    height="80vh"
    kenBurns={true}
  >
    <VenueContent />
  </ImageHero>
)}

function VenueContent() {
  return (
    <div className="text-center">
      <motion.h1
        className="text-6xl lg:text-7xl font-playfair font-bold text-white mb-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Casa HY
      </motion.h1>

      <motion.p
        className="text-2xl lg:text-3xl text-white/90 font-crimson italic mb-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Uma galeria de arte em Fortaleza
      </motion.p>

      <motion.div
        className="flex items-center justify-center gap-2 text-white/80"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <MapPin className="w-6 h-6" />
        <span className="text-lg font-playfair tracking-wide">
          Eng. Luciano Cavalcante, Fortaleza
        </span>
      </motion.div>
    </div>
  )
}
```

**Split Section for Details:**
```tsx
<SplitSection
  imagePosition="left"
  imageSrc="/images/casa-hy-map-placeholder.jpg" // Placeholder for map
  imageAlt="Localização Casa HY"
  stickyImage={true}
  backgroundColor="var(--background)"
>
  {/* Replace image with actual Google Map using custom component */}
  <div className="space-y-8">
    <h2 className="text-4xl font-playfair">Como Chegar</h2>

    {/* Address Card */}
    <Card variant="wedding">
      <CardContent>
        <h3 className="text-xl font-playfair mb-2">Endereço</h3>
        <p className="font-crimson">{CASA_HY.address}</p>
      </CardContent>
    </Card>

    {/* Parking Card */}
    <Card variant="wedding">
      <CardContent>
        <h3 className="text-xl font-playfair mb-2">Estacionamento</h3>
        <p className="font-crimson">Estacionamento próprio no local</p>
      </CardContent>
    </Card>

    {/* More details... */}
  </div>
</SplitSection>
```

**Media Recommendations:**
1. **Video:** Walkthrough tour of Casa HY (if available from venue)
2. **Photos:** Exterior golden hour, interior art gallery, ceremony space
3. **Backup:** Use high-quality photos with Ken Burns effect

---

## 3. Responsive Strategy - Breakpoint Adaptations

### 3.1 Desktop (1024px and above)

**Full Experience:**
- Full video backgrounds on all heroes
- 100vh heights for main heroes
- Parallax effects active
- Multi-column layouts (2-3 columns)
- Large typography (5-6rem for h1)
- Generous spacing (80-120px vertical)
- Hover effects on cards
- Smooth scroll animations

**Example:**
```css
@media (min-width: 1024px) {
  .video-hero { height: 100vh; }
  .hero-title { font-size: 5rem; }
  .section-padding { padding: 120px 0; }
  .grid-layout { grid-template-columns: repeat(3, 1fr); }
  .split-section { display: grid; grid-template-columns: 1fr 1fr; }
}
```

---

### 3.2 Tablet (768px - 1023px)

**Optimized Experience:**
- Video backgrounds (720p optimized)
- 80vh heights for heroes (not 100vh)
- Reduced parallax (0.3x instead of 0.5x)
- 2-column layouts where possible
- Medium typography (3-4rem for h1)
- Medium spacing (48-64px vertical)
- Touch-optimized interactions
- Simplified animations

**Example:**
```css
@media (min-width: 768px) and (max-width: 1023px) {
  .video-hero {
    height: 80vh;
    video { max-width: 1280px; }
  }
  .hero-title { font-size: 3.5rem; }
  .section-padding { padding: 64px 0; }
  .grid-layout { grid-template-columns: repeat(2, 1fr); }
}
```

**Interaction Changes:**
- Touch targets: minimum 44x44px
- Swipe gestures for galleries
- Remove hover states (use tap)
- Larger form inputs (16px font minimum)

---

### 3.3 Mobile (<768px)

**Performance-First Experience:**
- Static images (NO video backgrounds)
- 60vh heights for heroes (conserve screen space)
- No parallax effects
- Single column layouts
- Small typography (2.5-3rem for h1)
- Compact spacing (32-48px vertical)
- Stack all split sections vertically
- Simplified animations (faster, less complex)
- Optimized images (50% smaller file size)

**Example:**
```css
@media (max-width: 767px) {
  .video-hero {
    height: 60vh;
    background-image: url('/images/hero-mobile.jpg');
    video { display: none; } /* Hide video completely */
  }

  .hero-title {
    font-size: 2.5rem;
    line-height: 1.1;
  }

  .section-padding { padding: 32px 16px; }

  .grid-layout {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .split-section {
    display: flex;
    flex-direction: column;
  }

  .horizontal-scroll-gallery {
    .card { width: 85vw; } /* Full width swipe */
  }
}
```

**Mobile-Specific Optimizations:**
```typescript
// Detect mobile and serve optimized content
const isMobile = window.innerWidth < 768

return isMobile ? (
  <ImageHero imageSrc={mobileImageSrc} height="60vh" />
) : (
  <VideoHero videoSrc={videoSrc} height="100vh" />
)
```

**Touch Interactions:**
```css
/* Remove hover states on mobile */
@media (hover: none) {
  .card:hover {
    transform: none; /* Disable hover scale */
  }
}

/* Enable active states for touch */
.card:active {
  transform: scale(0.98);
  opacity: 0.9;
}
```

**Font Size Scaling:**
```css
/* Use clamp() for responsive typography */
.hero-title {
  font-size: clamp(2.5rem, 8vw, 5rem);
  /* Mobile: 2.5rem, Desktop: 5rem, scales between */
}

.body-text {
  font-size: clamp(1rem, 2vw, 1.25rem);
}
```

---

## 4. Animation & Interaction Patterns

### 4.1 Scroll-Based Animations

**Fade In On Scroll:**
```typescript
const fadeInVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
}

// Usage
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}
  variants={fadeInVariants}
>
  {content}
</motion.div>
```

**Staggered Children:**
```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
}

// Usage - timeline events appear one by one
<motion.div variants={containerVariants} initial="hidden" whileInView="visible">
  {events.map(event => (
    <motion.div key={event.id} variants={itemVariants}>
      <TimelineCard {...event} />
    </motion.div>
  ))}
</motion.div>
```

**Parallax Scroll Effect:**
```typescript
const [scrollY, setScrollY] = useState(0)

useEffect(() => {
  const handleScroll = () => setScrollY(window.scrollY)
  window.addEventListener('scroll', handleScroll, { passive: true })
  return () => window.removeEventListener('scroll', handleScroll)
}, [])

// Apply to background image
<div style={{
  transform: `translateY(${scrollY * 0.5}px)`,
  willChange: 'transform'
}}>
  <Image src={bgImage} />
</div>
```

**Progress Indicators:**
```typescript
// Reading progress bar
const [progress, setProgress] = useState(0)

useEffect(() => {
  const updateProgress = () => {
    const scrolled = window.scrollY
    const total = document.documentElement.scrollHeight - window.innerHeight
    setProgress((scrolled / total) * 100)
  }

  window.addEventListener('scroll', updateProgress, { passive: true })
  return () => window.removeEventListener('scroll', updateProgress)
}, [])

// Render
<motion.div
  className="fixed top-0 left-0 right-0 h-1 bg-decorative z-50"
  style={{ scaleX: progress / 100, transformOrigin: 'left' }}
/>
```

---

### 4.2 Hover States (Desktop Only)

**Card Hover Effect:**
```typescript
const cardHoverVariants = {
  rest: {
    scale: 1,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  hover: {
    scale: 1.02,
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
}

// Usage
<motion.div
  variants={cardHoverVariants}
  initial="rest"
  whileHover="hover"
  className="card"
>
  {content}
</motion.div>
```

**Image Scale On Hover:**
```css
.image-container {
  overflow: hidden;
  border-radius: 16px;
}

.image-container img {
  transition: transform 0.5s ease-out;
}

.image-container:hover img {
  transform: scale(1.1);
}
```

**Button Hover Effects:**
```typescript
const buttonVariants = {
  rest: {
    scale: 1,
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  hover: {
    scale: 1.05,
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  tap: {
    scale: 0.98
  }
}

<motion.button
  variants={buttonVariants}
  initial="rest"
  whileHover="hover"
  whileTap="tap"
>
  {label}
</motion.button>
```

**Link Underline Animation:**
```css
.animated-link {
  position: relative;
  text-decoration: none;
  color: var(--primary-text);
}

.animated-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 0;
  height: 2px;
  background: var(--decorative);
  transition: width 0.3s ease-out;
}

.animated-link:hover::after {
  width: 100%;
}
```

---

### 4.3 Page Transitions

**Route Change Fade:**
```typescript
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3
    }
  }
}

// Apply to page wrapper
<motion.div
  variants={pageVariants}
  initial="initial"
  animate="animate"
  exit="exit"
>
  {pageContent}
</motion.div>
```

**Loading States:**
```typescript
function LoadingSpinner() {
  return (
    <motion.div
      className="w-16 h-16 border-4 border-decorative border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  )
}
```

---

### 4.4 Micro-Interactions

**Scroll Indicator Bounce:**
```typescript
const scrollIndicatorVariants = {
  animate: {
    y: [0, 8, 0],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

<motion.div
  variants={scrollIndicatorVariants}
  animate="animate"
  className="absolute bottom-8 left-1/2 -translate-x-1/2"
>
  <ChevronDown className="w-6 h-6 text-white" />
</motion.div>
```

**Heartbeat Animation:**
```typescript
const heartbeatVariants = {
  animate: {
    scale: [1, 1.2, 1],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      repeatDelay: 2
    }
  }
}

<motion.span
  variants={heartbeatVariants}
  animate="animate"
>
  ♥
</motion.span>
```

**Form Input Focus:**
```css
.form-input {
  border: 2px solid var(--border-subtle);
  transition: all 0.3s ease;
}

.form-input:focus {
  border-color: var(--decorative);
  box-shadow: 0 0 0 4px rgba(168, 168, 168, 0.1);
  outline: none;
}
```

**Toast Notification:**
```typescript
const toastVariants = {
  initial: {
    opacity: 0,
    y: -50,
    scale: 0.9
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.2
    }
  }
}

<AnimatePresence>
  {showToast && (
    <motion.div
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4"
    >
      RSVP confirmado!
    </motion.div>
  )}
</AnimatePresence>
```

---

## 5. Design System Application

### 5.1 Color Usage

**Defined Palette:**
```css
:root {
  --background: #F8F6F3;        /* Warm off-white/cream */
  --primary-text: #2C2C2C;      /* Charcoal black */
  --secondary-text: #4A4A4A;    /* Medium gray */
  --decorative: #A8A8A8;        /* Silver-gray */
  --accent: #E8E6E3;            /* Subtle warm gray */
  --white-soft: #FFFFFF;        /* Pure white for contrast */
  --border-subtle: rgba(44, 44, 44, 0.08);
  --shadow-subtle: rgba(0, 0, 0, 0.08);
  --shadow-medium: rgba(0, 0, 0, 0.15);
}
```

**Color Application Rules:**

**Backgrounds:**
```css
/* Page background - always cream */
body { background: var(--background); }

/* Cards and elevated surfaces - soft white */
.card { background: var(--white-soft); }

/* Accent sections - subtle warm gray */
.accent-section { background: var(--accent); }

/* Dark decorative sections - silver-gray */
.decorative-section { background: var(--decorative); }
```

**Text:**
```css
/* Primary headings - charcoal */
h1, h2, h3 { color: var(--primary-text); }

/* Body text - medium gray */
p, span { color: var(--secondary-text); }

/* Decorative text (dates, labels) - silver */
.eyebrow, .date { color: var(--decorative); }

/* White text on dark backgrounds */
.hero-overlay h1 { color: var(--white-soft); }
```

**Interactive Elements:**
```css
/* Primary button */
.btn-primary {
  background: var(--decorative);
  color: var(--white-soft);
  border: none;
}

.btn-primary:hover {
  background: #8A8A8A; /* Darker decorative */
}

/* Secondary button */
.btn-secondary {
  background: transparent;
  color: var(--primary-text);
  border: 2px solid var(--decorative);
}

.btn-secondary:hover {
  background: var(--accent);
}

/* Links */
a {
  color: var(--primary-text);
  text-decoration: none;
}

a:hover {
  color: var(--decorative);
}
```

**Borders & Shadows:**
```css
/* Subtle borders */
.card {
  border: 1px solid var(--border-subtle);
}

/* Subtle shadow */
.card {
  box-shadow: 0 2px 8px var(--shadow-subtle);
}

/* Medium shadow (hover, elevated) */
.card:hover {
  box-shadow: 0 8px 30px var(--shadow-medium);
}
```

---

### 5.2 Typography Scale

**Font Families:**
```css
:root {
  --font-cormorant: 'Cormorant', serif;  /* Monogram, decorative */
  --font-playfair: 'Playfair Display', serif;  /* Headings, names */
  --font-crimson: 'Crimson Text', serif;  /* Body, italic */
}
```

**Type Scale:**

**Display (Hero Names):**
```css
.display {
  font-family: var(--font-playfair);
  font-size: clamp(3rem, 8vw, 5rem); /* 48-80px */
  font-weight: 600;
  letter-spacing: 0.15em;
  line-height: 1.1;
  text-transform: uppercase;
}
```

**Monogram:**
```css
.monogram {
  font-family: var(--font-cormorant);
  font-size: clamp(4rem, 10vw, 7rem); /* 64-112px */
  font-weight: 300;
  letter-spacing: 0.15em;
  line-height: 1.1;
}
```

**H1 (Page Titles):**
```css
h1 {
  font-family: var(--font-playfair);
  font-size: clamp(2.5rem, 6vw, 4rem); /* 40-64px */
  font-weight: 600;
  letter-spacing: 0.1em;
  line-height: 1.2;
}
```

**H2 (Section Headers):**
```css
h2 {
  font-family: var(--font-playfair);
  font-size: clamp(2rem, 5vw, 3rem); /* 32-48px */
  font-weight: 500;
  letter-spacing: 0.1em;
  line-height: 1.3;
}
```

**H3 (Card Titles):**
```css
h3 {
  font-family: var(--font-playfair);
  font-size: clamp(1.5rem, 3vw, 2rem); /* 24-32px */
  font-weight: 500;
  letter-spacing: 0.05em;
  line-height: 1.4;
}
```

**Body:**
```css
p, .body {
  font-family: var(--font-crimson);
  font-size: clamp(1.125rem, 2vw, 1.25rem); /* 18-20px */
  font-style: italic;
  line-height: 1.8;
  color: var(--secondary-text);
}
```

**Small (Captions, Labels):**
```css
.small, .caption {
  font-family: var(--font-crimson);
  font-size: clamp(0.875rem, 1.5vw, 1rem); /* 14-16px */
  line-height: 1.6;
  color: var(--decorative);
}
```

**Eyebrow (Section Labels):**
```css
.eyebrow {
  font-family: var(--font-playfair);
  font-size: 0.875rem; /* 14px */
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--decorative);
}
```

---

### 5.3 Spacing System

**Scale:**
```css
:root {
  --space-xxs: 4px;
  --space-xs: 8px;
  --space-s: 16px;
  --space-m: 24px;
  --space-l: 32px;
  --space-xl: 48px;
  --space-xxl: 64px;
  --space-xxxl: 96px;
  --space-huge: 120px;
}
```

**Application Rules:**

**Component Internal Spacing:**
```css
/* Card padding */
.card { padding: var(--space-l); } /* 32px */

/* Section padding */
.section { padding: var(--space-huge) 0; } /* 120px vertical */

/* Element gaps */
.flex-container { gap: var(--space-m); } /* 24px */
```

**Vertical Rhythm:**
```css
/* Heading margins */
h1 { margin-bottom: var(--space-xl); } /* 48px */
h2 { margin-bottom: var(--space-l); } /* 32px */
h3 { margin-bottom: var(--space-m); } /* 24px */

/* Paragraph margins */
p { margin-bottom: var(--space-s); } /* 16px */

/* Section spacing */
section { margin-bottom: var(--space-xxxl); } /* 96px */
```

**Responsive Spacing:**
```css
/* Desktop */
@media (min-width: 1024px) {
  .section { padding: var(--space-huge) var(--space-xl); }
  .hero { padding: var(--space-xxxl); }
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  .section { padding: var(--space-xxl) var(--space-l); }
  .hero { padding: var(--space-xxl); }
}

/* Mobile */
@media (max-width: 767px) {
  .section { padding: var(--space-xl) var(--space-s); }
  .hero { padding: var(--space-l); }
}
```

---

### 5.4 Component Styling

**Buttons:**

**Primary Button (Wedding):**
```css
.btn-wedding {
  padding: 16px 40px;
  background: var(--decorative);
  color: var(--white-soft);
  font-family: var(--font-playfair);
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px var(--shadow-subtle);
}

.btn-wedding:hover {
  background: #8A8A8A; /* Darker decorative */
  transform: translateY(-2px);
  box-shadow: 0 8px 25px var(--shadow-medium);
}

.btn-wedding:active {
  transform: translateY(0);
}
```

**Outline Button:**
```css
.btn-wedding-outline {
  padding: 16px 40px;
  background: transparent;
  color: var(--primary-text);
  font-family: var(--font-playfair);
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  border: 2px solid var(--decorative);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-wedding-outline:hover {
  background: var(--accent);
  border-color: var(--primary-text);
}
```

**Glass Button (on dark backgrounds):**
```css
.btn-glass {
  padding: 16px 40px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  font-family: var(--font-playfair);
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-glass:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
}
```

**Cards:**

**Wedding Card:**
```css
.card-wedding {
  background: var(--white-soft);
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  padding: var(--space-l);
  box-shadow: 0 2px 8px var(--shadow-subtle);
  transition: all 0.3s ease;
}

.card-wedding:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px var(--shadow-medium);
}
```

**Form Inputs:**

**Text Input:**
```css
.input {
  width: 100%;
  padding: 16px 20px;
  background: var(--background);
  color: var(--primary-text);
  font-family: var(--font-crimson);
  font-size: 16px; /* Prevents zoom on iOS */
  border: 2px solid var(--border-subtle);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.input:focus {
  outline: none;
  border-color: var(--decorative);
  box-shadow: 0 0 0 4px rgba(168, 168, 168, 0.1);
}

.input::placeholder {
  color: var(--decorative);
  font-style: italic;
}
```

**Select Dropdown:**
```css
.select {
  width: 100%;
  padding: 16px 20px;
  background: var(--background);
  color: var(--primary-text);
  font-family: var(--font-crimson);
  font-size: 16px;
  border: 2px solid var(--border-subtle);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.select:focus {
  outline: none;
  border-color: var(--decorative);
}
```

**Icons:**
```css
/* Icon sizing */
.icon-sm { width: 16px; height: 16px; }
.icon-md { width: 24px; height: 24px; }
.icon-lg { width: 32px; height: 32px; }

/* Icon color */
.icon {
  color: var(--decorative);
  stroke-width: 1.5;
}
```

---

## 6. Technical Implementation Guide

### 6.1 Performance Optimization

**Image Optimization:**

**Format Selection:**
```typescript
// Use WebP with JPEG fallback
<picture>
  <source srcSet={imageWebP} type="image/webp" />
  <source srcSet={imageJPEG} type="image/jpeg" />
  <img src={imageJPEG} alt={alt} />
</picture>
```

**Responsive Images:**
```typescript
// Next.js Image component with sizes
<Image
  src={imageSrc}
  alt={alt}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  quality={85}
  priority={isAboveFold} // Only for hero images
/>
```

**Lazy Loading Strategy:**
```typescript
// Lazy load images below fold
<Image
  src={imageSrc}
  alt={alt}
  loading="lazy"
  placeholder="blur"
  blurDataURL={blurDataURL}
/>
```

**Video Optimization:**

**Compression:**
```bash
# FFmpeg command for hero video
ffmpeg -i input.mov \
  -vcodec libx264 \
  -crf 28 \
  -preset slow \
  -vf "scale=1920:1080" \
  -r 30 \
  -movflags +faststart \
  output.mp4

# Mobile version
ffmpeg -i input.mov \
  -vcodec libx264 \
  -crf 30 \
  -vf "scale=1280:720" \
  -r 24 \
  -movflags +faststart \
  output-mobile.mp4
```

**Lazy Loading:**
```typescript
'use client'

function LazyVideo({ src, poster }: { src: string, poster: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' } // Load 200px before entering viewport
    )

    if (videoRef.current) {
      observer.observe(videoRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <video ref={videoRef} poster={poster} autoPlay loop muted playsInline>
      {shouldLoad && <source src={src} type="video/mp4" />}
    </video>
  )
}
```

**Font Loading:**

**Preload Critical Fonts:**
```tsx
// In app/layout.tsx or page head
<link
  rel="preload"
  href="/fonts/playfair-display-v30-latin-600.woff2"
  as="font"
  type="font/woff2"
  crossOrigin="anonymous"
/>
```

**Font Display Strategy:**
```css
@font-face {
  font-family: 'Playfair Display';
  src: url('/fonts/playfair-display.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap; /* Show fallback immediately, swap when ready */
}
```

**Code Splitting:**
```typescript
// Lazy load heavy components
const MediaLightbox = dynamic(() => import('@/components/gallery/MediaLightbox'), {
  ssr: false,
  loading: () => <LoadingSpinner />
})

// Only load when needed
{showLightbox && <MediaLightbox ... />}
```

---

### 6.2 Accessibility

**Color Contrast:**

**WCAG AA Compliance:**
```typescript
// Text on light backgrounds
const textOnLight = {
  primary: '#2C2C2C', // 15.14:1 contrast ratio ✅
  secondary: '#4A4A4A', // 10.01:1 contrast ratio ✅
}

// Text on dark backgrounds (hero overlays)
const textOnDark = {
  primary: '#FFFFFF', // Minimum 4.5:1 required
  secondary: 'rgba(255,255,255,0.9)', // 4.05:1 ✅
}

// Ensure overlays provide enough contrast
const darkOverlay = 'rgba(0,0,0,0.7)' // Strong enough for white text
```

**Test Contrast:**
```bash
# Use online tools:
# - WebAIM Contrast Checker
# - Chrome DevTools Lighthouse
# - Axe DevTools

# Minimum ratios:
# - Normal text: 4.5:1
# - Large text (18pt+): 3:1
# - UI components: 3:1
```

**Reduced Motion:**

**Respect User Preference:**
```typescript
'use client'
import { useReducedMotion } from 'framer-motion'

export function ResponsiveVideoHero(props: VideoHeroProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    // Show static image instead of video
    return <ImageHero imageSrc={props.fallbackSrc} {...props} />
  }

  // Show animated video
  return <VideoHero {...props} />
}
```

**CSS Approach:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  video {
    display: none; /* Hide autoplay videos */
  }
}
```

**Keyboard Navigation:**

**Focus Visible:**
```css
/* Remove default outline */
*:focus {
  outline: none;
}

/* Add custom focus style */
*:focus-visible {
  outline: 3px solid var(--decorative);
  outline-offset: 4px;
  border-radius: 4px;
}

/* Ensure interactive elements are focusable */
button, a, input, select, textarea {
  &:focus-visible {
    outline: 3px solid var(--decorative);
    outline-offset: 2px;
  }
}
```

**Skip Links:**
```tsx
// Add to layout.tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-white focus:rounded-lg"
>
  Pular para conteúdo principal
</a>

// Main content
<main id="main-content">
  {children}
</main>
```

**ARIA Labels:**
```tsx
// Video with proper labeling
<video
  aria-label="Hel and Ylana together at home"
  role="img"
>
  <track
    kind="captions"
    src="/captions/hero.vtt"
    srcLang="pt-BR"
    label="Português"
  />
</video>

// Buttons with clear labels
<button aria-label="Confirmar presença no casamento">
  RSVP
</button>

// Navigation
<nav aria-label="Navegação principal">
  <ul>
    <li><a href="/">Início</a></li>
    <li><a href="/historia">Nossa História</a></li>
  </ul>
</nav>
```

**Screen Reader Support:**
```tsx
// Hide decorative elements
<div aria-hidden="true">
  <DecorativeFlourish />
</div>

// Provide alternative text
<Image
  src={imageSrc}
  alt="Hel e Ylana rindo juntos em casa com os 4 cachorros"
/>

// Loading states
<div role="status" aria-live="polite">
  {loading ? 'Carregando galeria...' : 'Galeria carregada'}
</div>
```

---

### 6.3 Browser Support

**Target Browsers:**
```
Chrome: Last 2 versions
Safari: Last 2 versions (iOS 15+)
Firefox: Last 2 versions
Edge: Last 2 versions
```

**Polyfills:**
```typescript
// polyfills.ts
if (typeof window !== 'undefined') {
  // IntersectionObserver (for older browsers)
  if (!('IntersectionObserver' in window)) {
    import('intersection-observer')
  }

  // ResizeObserver
  if (!('ResizeObserver' in window)) {
    import('@juggle/resize-observer').then(({ ResizeObserver }) => {
      window.ResizeObserver = ResizeObserver
    })
  }
}
```

**Feature Detection:**
```typescript
// Check for video support
const supportsVideo = (() => {
  const video = document.createElement('video')
  return !!(video.canPlayType && video.canPlayType('video/mp4').replace(/no/, ''))
})()

// Check for WebP support
const supportsWebP = (() => {
  const canvas = document.createElement('canvas')
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
})()

// Use appropriate format
const imageSrc = supportsWebP ? imageWebP : imageJPEG
```

**CSS Fallbacks:**
```css
/* Backdrop filter fallback */
.glass-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
}

@supports not (backdrop-filter: blur(10px)) {
  .glass-card {
    background: rgba(255, 255, 255, 0.9); /* More opaque fallback */
  }
}

/* CSS Grid fallback */
.grid-layout {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

@supports not (display: grid) {
  .grid-layout {
    display: flex;
    flex-wrap: wrap;
  }

  .grid-layout > * {
    flex: 0 0 33.333%;
  }
}
```

---

## 7. Implementation Roadmap

### Phase 1: Homepage Transformation (Week 1)

**Priority: HIGHEST**

**Tasks:**
1. Create `VideoHero` component
2. Find/capture couple video (12-15 seconds)
3. Optimize video (FFmpeg compression)
4. Implement homepage video hero section
5. Move event details to separate section
6. Test across devices

**Deliverables:**
- `/components/ui/VideoHero.tsx`
- `/public/videos/hel-ylana-home.mp4` (desktop)
- `/public/videos/hel-ylana-home-mobile.mp4` (mobile)
- `/public/images/hero-poster.jpg` (loading state)
- `/public/images/hero-fallback.jpg` (reduced motion)
- Updated `/app/page.tsx`

**Success Criteria:**
- Video loads in <3 seconds on 4G
- Plays automatically on desktop
- Shows static image on mobile
- Text overlay is readable (WCAG AA)

---

### Phase 2: Story Page Enhancement (Week 2)

**Priority: HIGH**

**Tasks:**
1. Create `TimelineMomentCard` component (full-bleed)
2. Gather photos/videos for each timeline event
3. Implement alternating gradient overlays
4. Add spacers between events
5. Test scroll performance

**Deliverables:**
- `/components/timeline/TimelineMomentCard.tsx`
- Timeline event images (8 events)
- Updated `/app/historia/page.tsx`

**Success Criteria:**
- Each event tells visual story
- Alternating layout prevents monotony
- Smooth scroll performance
- Mobile stack layout works

---

### Phase 3: Pets Gallery (Week 2)

**Priority: HIGH**

**Tasks:**
1. Create `HorizontalScrollGallery` component
2. Take individual hero photos of each pet
3. Implement swipeable cards
4. Add navigation dots
5. Test touch interactions

**Deliverables:**
- `/components/ui/HorizontalScrollGallery.tsx`
- Pet hero photos (4 dogs)
- Updated `AboutUsSection` integration

**Success Criteria:**
- Swipe works smoothly on mobile
- Each pet has distinct hero moment
- Navigation dots show position
- Cards snap to center

---

### Phase 4: Supporting Page Heroes (Week 3)

**Priority: MEDIUM**

**Tasks:**
1. Create `ImageHero` component
2. Gift Registry: Apartment photo hero (50vh)
3. RSVP: Celebration photo hero (40vh)
4. Wedding Location: Venue showcase hero (80vh)
5. Test all heroes across devices

**Deliverables:**
- `/components/ui/ImageHero.tsx`
- Apartment exterior photo
- Celebration photo
- Casa HY venue photos/video
- Updated page files

**Success Criteria:**
- Each page has visual identity
- Heroes don't distract from functionality
- Load times under 2 seconds
- WCAG AA compliance

---

### Phase 5: Gallery Enhancements (Week 3)

**Priority: LOW**

**Tasks:**
1. Create `TransitionalMoment` component
2. Add year transition sections
3. Gather transition images
4. Test scroll flow

**Deliverables:**
- `/components/gallery/TransitionalMoment.tsx`
- Year transition images (2023, 2024, 2025)
- Updated `/app/galeria/page.tsx`

**Success Criteria:**
- Transitions create narrative flow
- Don't slow down gallery browsing
- Work on mobile

---

### Phase 6: Polish & Optimization (Week 4)

**Priority: ONGOING**

**Tasks:**
1. Performance audit (Lighthouse)
2. Accessibility audit (Axe, WAVE)
3. Cross-browser testing
4. Mobile device testing
5. Fix any issues found
6. Final QA

**Testing Checklist:**
- [ ] Chrome desktop
- [ ] Safari desktop
- [ ] Firefox desktop
- [ ] Safari iOS (iPhone)
- [ ] Chrome Android
- [ ] Slow 3G throttling
- [ ] Reduced motion enabled
- [ ] Screen reader (VoiceOver/NVDA)
- [ ] Keyboard navigation only

---

## 8. File Structure

**New Components to Create:**
```
src/components/
├── ui/
│   ├── VideoHero.tsx                  ← NEW
│   ├── ImageHero.tsx                  ← NEW
│   ├── SplitSection.tsx               ← NEW
│   ├── HorizontalScrollGallery.tsx    ← NEW
│   ├── ContentSection.tsx             ← NEW (optional)
│   └── ScrollIndicator.tsx            ← NEW
├── timeline/
│   ├── TimelineMomentCard.tsx         ← NEW
│   └── FullBleedMoment.tsx            ← NEW (variant)
└── gallery/
    └── TransitionalMoment.tsx         ← NEW
```

**Assets to Add:**
```
public/
├── videos/
│   ├── hel-ylana-home.mp4             ← Homepage hero (desktop)
│   ├── hel-ylana-home-mobile.mp4      ← Homepage hero (mobile)
│   ├── casa-hy-tour.mp4               ← Venue showcase (optional)
│   └── timeline/
│       ├── primeiro-encontro.mp4      ← Timeline events
│       └── pedido-completo.mp4
├── images/
│   ├── hero-poster.jpg                ← Video loading state
│   ├── hero-fallback.jpg              ← Reduced motion fallback
│   ├── apartment-exterior.jpg         ← Gift registry hero
│   ├── celebration-moment.jpg         ← RSVP hero
│   ├── casa-hy-exterior.jpg           ← Venue hero
│   ├── pets/
│   │   ├── linda-hero.jpg             ← Pet gallery
│   │   ├── cacao-hero.jpg
│   │   ├── olivia-hero.jpg
│   │   └── oliver-hero.jpg
│   ├── timeline/
│   │   ├── primeiro-oi.jpg            ← Timeline events
│   │   ├── primeiro-encontro.jpg
│   │   ├── namoro.jpg
│   │   ├── casa-propria.jpg
│   │   ├── natal-casa.jpg
│   │   └── casamento.jpg
│   └── transitions/
│       ├── 2023-year.jpg              ← Gallery transitions
│       ├── 2024-year.jpg
│       └── 2025-year.jpg
```

---

## 9. Content Gathering Checklist

### Videos Needed (Priority Order)

**Critical:**
- [ ] Homepage hero: Couple at home (12-15 sec, candid, natural light)
- [ ] Timeline: Proposal video (if available)

**Important:**
- [ ] Venue: Casa HY tour (if available from venue)
- [ ] Timeline: Walking together outdoors
- [ ] Timeline: With all 4 dogs together

**Nice to Have:**
- [ ] Timeline: Cooking together
- [ ] Timeline: Laughing/candid moment
- [ ] Gallery: Year transitions

### Photos Needed (Priority Order)

**Critical:**
- [ ] Pet heroes: Linda individual (well-lit, shows personality)
- [ ] Pet heroes: Cacao individual
- [ ] Pet heroes: Olivia individual
- [ ] Pet heroes: Oliver individual
- [ ] Timeline: First date moment
- [ ] Timeline: Namoro official
- [ ] Timeline: Casa própria (apartment)
- [ ] Timeline: Natal in new house
- [ ] Timeline: Wedding day (Casa HY)

**Important:**
- [ ] Gift registry: Apartment exterior (golden hour)
- [ ] RSVP: Celebration with friends
- [ ] Location: Casa HY exterior
- [ ] Location: Casa HY interior
- [ ] Story preview: Couple at home (intimate)
- [ ] Timeline: Guaramiranga trip
- [ ] Timeline: Meaningful moments

**Nice to Have:**
- [ ] Gallery transitions: 2023 representative moment
- [ ] Gallery transitions: 2024 representative moment
- [ ] Gallery transitions: 2025 representative moment
- [ ] About Us: Additional lifestyle photos

---

## 10. Developer Handoff Notes

### For Developers Implementing This:

**Start With:**
1. Read DTF reference doc (`VISUAL_TRANSFORMATION_PROMPT.md`)
2. Read hero analysis (`HOMEPAGE_HERO_TRANSFORMATION_SUMMARY.md`)
3. Start with `VideoHero` component - it's the foundation

**Component Build Order:**
1. `VideoHero` → Homepage transformation (biggest impact)
2. `HorizontalScrollGallery` → Pets section (high visual impact)
3. `TimelineMomentCard` → Story page (storytelling enhancement)
4. `ImageHero` → Supporting pages (completes visual system)
5. `TransitionalMoment` → Gallery polish (optional enhancement)

**Don't Forget:**
- Test reduced motion preference
- Test on actual mobile devices
- Run Lighthouse audit
- Check WCAG contrast
- Test keyboard navigation
- Compress all videos with FFmpeg

**Performance Tips:**
- Lazy load everything below fold
- Use CDN for videos (Vercel Blob)
- Implement progressive image loading
- Add loading skeletons
- Monitor Core Web Vitals

**When You're Stuck:**
- Reference DTF website for inspiration
- Check existing components for patterns
- Use Framer Motion docs for animations
- Test on real devices, not just browser devtools

---

## Appendix: Quick Reference

### Color Palette
```
Background: #F8F6F3
Primary Text: #2C2C2C
Secondary Text: #4A4A4A
Decorative: #A8A8A8
Accent: #E8E6E3
White Soft: #FFFFFF
```

### Typography
```
Monogram: Cormorant, 4-7rem, 300 weight
Display: Playfair Display, 3-5rem, 600 weight
H1: Playfair Display, 2.5-4rem, 600 weight
H2: Playfair Display, 2-3rem, 500 weight
H3: Playfair Display, 1.5-2rem, 500 weight
Body: Crimson Text, 1.125-1.25rem, italic
```

### Spacing
```
XXS: 4px, XS: 8px, S: 16px, M: 24px
L: 32px, XL: 48px, XXL: 64px, XXXL: 96px, HUGE: 120px
```

### Breakpoints
```
Mobile: <768px
Tablet: 768px-1023px
Desktop: 1024px+
```

### Video Specs
```
Format: MP4 (H.264)
Desktop: 1920x1080 @ 30fps, <5MB
Mobile: 1280x720 @ 24fps, <3MB
Duration: 10-20 seconds
Bitrate: 5-8 Mbps desktop, 3-5 Mbps mobile
```

### Image Specs
```
Format: WebP (with JPEG fallback)
Hero: 2560x1440 @ 85% quality
Standard: 1920x1080 @ 80% quality
Mobile: 1080x1920 @ 75% quality
Thumbnail: 400x400 @ 70% quality
```

---

**This specification document provides everything needed to transform the wedding website into a DTF-inspired cinematic experience while maintaining the elegant wedding invitation aesthetic. Start with the homepage hero for maximum impact, then progressively enhance other pages.**

**Questions? Reference the DTF analysis doc and hero analysis for detailed examples and code snippets.**
