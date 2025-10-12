# Visual Transformation Prompt: From Text Boxes to Cinematic Storytelling

## Mission Brief

Transform thousanddaysoflove website from text-heavy card layouts to a visually rich, cinematic experience inspired by **dtf.com** (Din Tai Fung). Map every section that could benefit from full-bleed hero sections with video/image backgrounds and text overlays.

**Current Problem**: Website is lots of plain text and boxes. Images only exist in cards. Feels static.

**Goal**: Bring it to life using Hel & Ylana's personal videos and photos as immersive storytelling backgrounds.

---

## REFERENCE: DTF.com Analysis

### What Makes DTF Website Work:

1. **Full-Bleed Video/Image Heroes**
   - Video loops in background
   - Text overlay with perfect contrast
   - Scroll-based reveals
   - Cinematic aspect ratios

2. **Visual Hierarchy**
   - Large typography over visuals
   - Strategic use of overlays (gradients, tints)
   - White text on dark overlays
   - Generous padding around text

3. **Content Rhythm**
   - Hero section → Text section → Hero section → Text section
   - Breaks monotony
   - Keeps user engaged
   - Visual breathing room

4. **Technical Excellence**
   - Videos are optimized, loop seamlessly
   - Load fast (probably using CDN)
   - Responsive (video on desktop, image on mobile)
   - Subtle parallax effects

5. **Storytelling Flow**
   - Each section tells a micro-story
   - Visuals support the narrative
   - Transitions feel intentional
   - Journey, not just information

---

## CURRENT WEBSITE STRUCTURE AUDIT

### Page-by-Page Analysis:

#### **1. Homepage (page.tsx)**
**Current Sections**:
- Navigation
- HeroSection (has some visual appeal but could be more cinematic)
- StoryPreview (text cards)
- AboutUsSection (text cards with icons)
- QuickPreview (text cards)
- WeddingLocation (map + text cards)

**Opportunities**: 🟢🟢🟢🟢 (4/5 sections could benefit)

---

#### **2. /historia (Full Story Page)**
**Current Sections**:
- Navigation
- Hero intro (text only)
- StoryTimeline (vertical cards with thumbnails)
- AboutUsSection (text cards)

**Opportunities**: 🟢🟢🟢 (High potential for visual storytelling)

---

#### **3. /galeria (Gallery Page)**
**Current Sections**:
- Navigation
- HeroVideoSection (already has video!)
- MasonryGallery (grid of images)

**Opportunities**: 🟢 (Already visual, but could enhance transitions)

---

#### **4. /presentes (Gift Registry)**
**Current Sections**:
- Navigation
- Header (text + icon)
- Stats grid
- Filters
- Gift cards grid
- CTA section

**Opportunities**: 🟡 (Could add hero, but functionality is priority)

---

#### **5. /local (Wedding Location)**
**Current Sections**:
- Navigation
- WeddingLocation component
- Map
- Details cards

**Opportunities**: 🟢🟢 (Could show venue visually)

---

#### **6. /rsvp (RSVP Page)**
**Current Sections**:
- Navigation
- Header
- Search form
- Results cards

**Opportunities**: 🟡 (Functional page, light hero could work)

---

## TRANSFORMATION OPPORTUNITIES MAP

### 🔴 HIGH IMPACT: Must Transform

#### **1. Homepage Hero → Cinematic Opening**

**CURRENT STATE**:
```
- Background: Solid color
- H ♥ Y monogram
- Names
- Text copy
- Countdown timer
- Buttons
- Event details cards
```

**DTF-INSPIRED TRANSFORMATION**:
```jsx
<FullBleedVideoHero>
  {/* Background Video/Image */}
  <BackgroundVideo
    src="/videos/hel-ylana-moment.mp4"
    poster="/images/hero-poster.jpg"
    overlay="gradient-dark-bottom" // dark gradient at bottom for text
  />

  {/* Content Overlay */}
  <ContentOverlay position="bottom-left" padding="80px">
    <AnimatedMonogram>H ♥ Y</AnimatedMonogram>
    <LargeTitle>Hel & Ylana</LargeTitle>
    <Subtitle>1000 dias. Sim, a gente fez a conta.</Subtitle>
    <DateBadge>20.11.2025</DateBadge>
    <CTAButton variant="glass">RSVP</CTAButton>
  </ContentOverlay>

  {/* Scroll Indicator */}
  <ScrollIndicator position="bottom-center" />
</FullBleedVideoHero>
```

**Video Suggestions**:
- Proposal moment (if you have video)
- Walking together (cinematic, slow-mo)
- Laughing together at home
- Petting the dogs together
- Cooking together (you're foodies)
- ANY candid moment that shows "us"

**Fallback**: If no video, use high-quality photo with subtle Ken Burns zoom

---

#### **2. About Us Section → Visual Split Story**

**CURRENT STATE**:
```
- "Sobre Nós" heading
- Quote in text
- Two cards: "Caseiros" and "Paixões"
- Icon grid (Ylana, Hel, Fitness, Viagens)
- Pets section with icon circles
```

**DTF-INSPIRED TRANSFORMATION**:

**Option A: Side-by-Side Visual Story**
```jsx
<TwoColumnVisualSection>
  <LeftColumn>
    <BackgroundImage
      src="/images/hel-ylana-home.jpg"
      overlay="gradient-right" // fade to white on right
    />
  </LeftColumn>

  <RightColumn background="cream">
    <SectionLabel>Sobre Nós</SectionLabel>
    <Quote>
      "Tem o que as pessoas sabem. Tem o que elas veem.
      E tem o que a gente tem entre a gente.
      E isso é muito maior do que qualquer um imagina."
    </Quote>
    <Body>
      A gente é caseiro. Introvertido. Mas isso não quer dizer...
    </Body>
  </RightColumn>
</TwoColumnVisualSection>
```

**Option B: Full-Bleed with Text Overlay**
```jsx
<FullBleedImageSection>
  <BackgroundImage
    src="/images/us-at-home.jpg"
    overlay="gradient-dark-center" // dark in middle for text
  />

  <CenteredContent>
    <Eyebrow>Quem Somos</Eyebrow>
    <LargeQuote color="white">
      "O que a gente tem entre a gente
      é muito maior do que qualquer um imagina."
    </LargeQuote>
    <ButtonLink>Leia Mais →</ButtonLink>
  </CenteredContent>
</FullBleedImageSection>

{/* Followed by text section with details */}
<TextSection background="white">
  <IntrovertedSection />
  <PassionsSection />
</TextSection>
```

**Image Suggestions**:
- You two at home (cozy, authentic)
- Cooking together in kitchen
- On the couch with all 4 dogs
- Traveling together (one of your trips)
- At Mangue Azul (your favorite restaurant)
- Working out together at gym

---

#### **3. The Pets Section → Hero Gallery**

**CURRENT STATE**:
```
- Card with icon
- "Nossa Família: Agora Somos 6"
- Text description
- 4 small circles with emojis
- Text under each pet
```

**DTF-INSPIRED TRANSFORMATION**:

**Option A: Horizontal Scroll Pet Gallery**
```jsx
<FullWidthPetGallery>
  <SectionIntro background="dark" textColor="white">
    <h2>Nossa Família: Agora Somos 6</h2>
    <p>De 2 pra 4. A casa não tem mais silêncio...</p>
  </SectionIntro>

  <HorizontalScrollGallery>
    <PetCard background="/images/linda-hero.jpg">
      <Overlay position="bottom" gradient="dark">
        <PetName>Linda 👑</PetName>
        <PetDescription>
          Veio primeiro. Autista, síndrome de Down,
          rainha absoluta desta casa.
        </PetDescription>
      </Overlay>
    </PetCard>

    <PetCard background="/images/cacao-hero.jpg">
      <Overlay position="bottom" gradient="dark">
        <PetName>Cacao 🍫</PetName>
        <PetDescription>
          1 libra de Spitz Alemão. Volume no máximo 24/7...
        </PetDescription>
      </Overlay>
    </PetCard>

    {/* Olivia, Oliver same pattern */}
  </HorizontalScrollGallery>
</FullWidthPetGallery>
```

**Option B: Grid with Large Hero Images**
```jsx
<PetHeroGrid>
  {/* Each pet gets a large card with their photo as background */}
  <PetHeroCard
    background="/images/linda-large.jpg"
    overlay="gradient-bottom-dark"
    size="large" // Linda is the queen, she gets bigger card
  >
    <ContentOverlay position="bottom-left">
      <PetEmoji>👑</PetEmoji>
      <PetName>Linda</PetName>
      <PetBio>
        Veio primeiro. Autista, síndrome de Down,
        rainha absoluta desta casa.
      </PetBio>
    </ContentOverlay>
  </PetHeroCard>

  {/* Cacao, Olivia, Oliver in grid */}
</PetHeroGrid>
```

**Image/Video Suggestions**:
- MUST: Individual hero shots of each dog
- Linda in her throne (favorite spot)
- Cacao barking (action shot, hilarious)
- Olivia being calm (contrast to others)
- Oliver running/playing (energy captured)
- Group shot of all 4 (chaos captured)

---

#### **4. Story Timeline → Cinematic Moments**

**CURRENT STATE**:
```
- Vertical timeline
- Small thumbnail images in cards
- Date + title + description
- Generic card design
```

**DTF-INSPIRED TRANSFORMATION**:

**Option A: Full-Bleed Moment Cards**
```jsx
<TimelineSection>
  {events.map(event => (
    <TimelineMoment key={event.id}>
      {/* Each moment is a full-width hero */}
      <FullBleedMoment>
        <BackgroundMedia
          type={event.media_type} // video or image
          src={event.media_url}
          overlay="gradient-left-dark"
        />

        <ContentColumn position="left">
          <DateBadge>{formatDate(event.date)}</DateBadge>
          <MomentTitle>{event.title}</MomentTitle>
          <MomentDescription>
            {event.description}
          </MomentDescription>
        </ContentColumn>
      </FullBleedMoment>

      {/* Spacer between moments */}
      <Spacer height="80px" />
    </TimelineMoment>
  ))}
</TimelineSection>
```

**Option B: Alternating Layout**
```jsx
<AlternatingTimeline>
  {/* Odd events: Image on left, text on right */}
  <TimelineItem layout="image-left">
    <ImageColumn>
      <FullHeightImage src={event.image} />
    </ImageColumn>
    <TextColumn>
      <Date />
      <Title />
      <Description />
    </TextColumn>
  </TimelineItem>

  {/* Even events: Text on left, image on right */}
  <TimelineItem layout="image-right">
    <TextColumn />
    <ImageColumn />
  </TimelineItem>
</AlternatingTimeline>
```

**Option C: Scroll-Reveal Immersive**
```jsx
<ImmersiveTimeline>
  {/* Background image changes as you scroll */}
  <FixedBackground>
    <AnimatedBackground currentEvent={scrollPosition} />
  </FixedBackground>

  {/* Text cards scroll over background */}
  <ScrollingContent>
    {events.map(event => (
      <FloatingCard
        onEnterViewport={() => changeBackground(event.image)}
      >
        <Date />
        <Title />
        <Description />
      </FloatingCard>
    ))}
  </ScrollingContent>
</ImmersiveTimeline>
```

**Content Opportunities**:
- First date photos (if you have them)
- Travel moments (Rio, Búzios, etc.)
- Home moments (apartment life)
- Proposal video/photos (MUST if you have it)
- Family moments (pets arriving)
- Anniversary celebrations (Mangue Azul?)

---

#### **5. Wedding Location → Venue Showcase**

**CURRENT STATE**:
```
- Text description of venue
- Google Map
- Details cards (parking, dress code, etc.)
- Transport info
```

**DTF-INSPIRED TRANSFORMATION**:

```jsx
<VenueShowcaseSection>
  {/* Hero: Venue exterior/interior */}
  <FullBleedVenueHero>
    <BackgroundVideo
      src="/videos/casa-hy-tour.mp4" // if you have venue video
      fallback="/images/casa-hy-exterior.jpg"
      overlay="gradient-bottom-dark"
    />

    <ContentOverlay position="bottom-center">
      <VenueName>Casa HY</VenueName>
      <VenueTagline>Uma galeria de arte em Fortaleza</VenueTagline>
      <Address>Eng. Luciano Cavalcante</Address>
    </ContentOverlay>
  </FullBleedVenueHero>

  {/* Details section - can stay as cards or... */}
  <DetailsSplitSection>
    <LeftColumn>
      <InteractiveMap />
    </LeftColumn>
    <RightColumn>
      <PracticalDetails />
    </RightColumn>
  </DetailsSplitSection>
</VenueShowcaseSection>
```

**Image/Video Suggestions**:
- Venue exterior (golden hour if possible)
- Venue interior (the gallery space)
- Venue details (art, architecture)
- If possible: walkthrough video

---

### 🟡 MEDIUM IMPACT: Nice to Have

#### **6. Gift Registry Hero**

**CURRENT STATE**:
```
- Text heading + icon
- Description text
- Stats grid
- Gift cards grid
```

**DTF-INSPIRED TRANSFORMATION**:

```jsx
<GiftRegistryPage>
  {/* Light hero - not too distracting from functionality */}
  <CompactHero height="50vh">
    <BackgroundImage
      src="/images/apartment-dream.jpg" // the apartment you dreamed about
      overlay="gradient-dark-strong" // strong overlay so text pops
    />

    <CenteredContent>
      <Eyebrow>Ajudem a Construir Nosso Lar</Eyebrow>
      <HeroTitle>O Apartamento</HeroTitle>
      <HeroDescription>
        Esse apartamento que o Hel passava de bicicleta sonhando?
        Agora é nosso. Casa própria depois de anos de trabalho.
      </HeroDescription>
    </CenteredContent>
  </CompactHero>

  {/* Then the functional grid below */}
  <GiftGrid />
</GiftRegistryPage>
```

**Image Suggestions**:
- Your apartment exterior
- Your apartment interior (showing it's a real home)
- You two in the apartment
- Neighborhood/area photo

---

#### **7. RSVP Page Hero**

**CURRENT STATE**:
```
- Text heading
- Search input
- Results
```

**DTF-INSPIRED TRANSFORMATION**:

```jsx
<RsvpPage>
  {/* Minimal hero - don't distract from form */}
  <CompactHero height="40vh">
    <BackgroundImage
      src="/images/celebration-moment.jpg"
      overlay="gradient-dark-medium"
    />

    <CenteredContent>
      <HeroTitle>Confirma Presença?</HeroTitle>
      <HeroSubtitle>
        60 pessoas. Pra quem é introvertido, isso é muita gente.
      </HeroSubtitle>
    </CenteredContent>
  </CompactHero>

  {/* Search form in white section below */}
  <FormSection background="white">
    <SearchForm />
  </FormSection>
</RsvpPage>
```

---

### 🟢 ENHANCEMENT: Polish Existing

#### **8. Gallery Page**

**CURRENT STATE**:
- Already has HeroVideoSection ✅
- MasonryGallery with images ✅

**ENHANCEMENT IDEAS**:
```jsx
// Add video backgrounds between gallery sections
<GalleryPage>
  <HeroVideoSection /> {/* Keep this */}

  <GallerySection title="2023">
    <MasonryGrid />
  </GallerySection>

  {/* Add video transition */}
  <VideoTransition
    src="/videos/year-transition.mp4"
    text="2024: O Ano da Casa"
  />

  <GallerySection title="2024">
    <MasonryGrid />
  </GallerySection>
</GalleryPage>
```

---

## IMPLEMENTATION STRATEGY

### Phase 1: Core Heroes (Week 1)
**Priority Order**:
1. ✅ Homepage Hero (biggest impact)
2. ✅ About Us Visual Section (shows personality)
3. ✅ Pets Hero Gallery (most photos available?)

### Phase 2: Story Enhancement (Week 2)
4. ✅ Timeline Cinematic Moments
5. ✅ Wedding Location Showcase

### Phase 3: Supporting Heroes (Week 3)
6. 🟡 Gift Registry Hero (nice to have)
7. 🟡 RSVP Hero (nice to have)
8. 🟢 Gallery transitions (polish)

---

## TECHNICAL IMPLEMENTATION GUIDE

### 1. Video Background Component

```tsx
// components/ui/VideoHero.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface VideoHeroProps {
  videoSrc: string
  posterSrc: string
  overlay?: 'gradient-dark-bottom' | 'gradient-dark-center' | 'dark-tint'
  children: React.ReactNode
  height?: string
}

export function VideoHero({
  videoSrc,
  posterSrc,
  overlay = 'gradient-dark-bottom',
  children,
  height = '100vh'
}: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play()
    }
  }, [])

  const overlayClasses = {
    'gradient-dark-bottom': 'bg-gradient-to-t from-black/80 via-black/30 to-transparent',
    'gradient-dark-center': 'bg-gradient-radial from-black/60 via-black/40 to-transparent',
    'dark-tint': 'bg-black/40'
  }

  return (
    <section className="relative overflow-hidden" style={{ height }}>
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster={posterSrc}
          onLoadedData={() => setIsLoaded(true)}
          className="w-full h-full object-cover"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>

        {/* Overlay */}
        <div className={`absolute inset-0 ${overlayClasses[overlay]}`} />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-full"
        >
          {children}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-white/80 text-sm font-crimson">Scroll</span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}
```

---

### 2. Image Hero with Text Overlay

```tsx
// components/ui/ImageHero.tsx
'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

interface ImageHeroProps {
  imageSrc: string
  imageAlt: string
  overlay?: 'gradient-dark-bottom' | 'gradient-dark-left' | 'gradient-dark-right'
  contentPosition?: 'bottom-left' | 'bottom-center' | 'center' | 'left'
  children: React.ReactNode
  height?: string
  parallax?: boolean
}

export function ImageHero({
  imageSrc,
  imageAlt,
  overlay = 'gradient-dark-bottom',
  contentPosition = 'bottom-left',
  children,
  height = '80vh',
  parallax = false
}: ImageHeroProps) {
  const overlayClasses = {
    'gradient-dark-bottom': 'bg-gradient-to-t from-black/90 via-black/50 to-transparent',
    'gradient-dark-left': 'bg-gradient-to-r from-black/90 via-black/40 to-transparent',
    'gradient-dark-right': 'bg-gradient-to-l from-black/90 via-black/40 to-transparent'
  }

  const positionClasses = {
    'bottom-left': 'items-end justify-start p-12 md:p-20',
    'bottom-center': 'items-end justify-center p-12 md:p-20',
    'center': 'items-center justify-center',
    'left': 'items-center justify-start p-12 md:p-20'
  }

  return (
    <section className="relative overflow-hidden" style={{ height }}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className={`object-cover ${parallax ? 'scale-110' : ''}`}
          style={parallax ? { transform: 'translateZ(-1px) scale(1.5)' } : {}}
          priority
        />

        {/* Overlay */}
        <div className={`absolute inset-0 ${overlayClasses[overlay]}`} />
      </div>

      {/* Content */}
      <div className={`relative z-10 h-full flex ${positionClasses[contentPosition]}`}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl"
        >
          {children}
        </motion.div>
      </div>
    </section>
  )
}
```

---

### 3. Two-Column Split Section

```tsx
// components/ui/SplitSection.tsx
'use client'

interface SplitSectionProps {
  imagePosition: 'left' | 'right'
  imageSrc: string
  imageAlt: string
  imageOverlay?: boolean
  backgroundColor?: string
  children: React.ReactNode
}

export function SplitSection({
  imagePosition,
  imageSrc,
  imageAlt,
  imageOverlay = true,
  backgroundColor = 'var(--background)',
  children
}: SplitSectionProps) {
  return (
    <section className="grid lg:grid-cols-2 min-h-screen">
      {/* Image Column */}
      <div
        className={`relative ${imagePosition === 'left' ? 'lg:order-1' : 'lg:order-2'}`}
      >
        <div className="sticky top-0 h-screen">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
          />
          {imageOverlay && (
            <div
              className={`absolute inset-0 ${
                imagePosition === 'left'
                  ? 'bg-gradient-to-r from-transparent to-[var(--background)]'
                  : 'bg-gradient-to-l from-transparent to-[var(--background)]'
              }`}
            />
          )}
        </div>
      </div>

      {/* Content Column */}
      <div
        className={`${imagePosition === 'left' ? 'lg:order-2' : 'lg:order-1'}`}
        style={{ backgroundColor }}
      >
        <div className="flex items-center min-h-screen p-12 md:p-20">
          <div className="max-w-2xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}
```

---

### 4. Horizontal Scroll Gallery

```tsx
// components/ui/HorizontalScrollGallery.tsx
'use client'

import { useRef } from 'react'
import Image from 'next/image'

interface GalleryItem {
  id: string
  image: string
  title: string
  description: string
}

interface HorizontalScrollGalleryProps {
  items: GalleryItem[]
}

export function HorizontalScrollGallery({ items }: HorizontalScrollGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-6 px-8 py-12"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="flex-none w-[85vw] md:w-[60vw] lg:w-[40vw] snap-center"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden group">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3
                  className="text-3xl font-playfair text-white mb-3"
                  style={{ fontWeight: 500 }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-white/90 font-crimson italic leading-relaxed"
                  style={{ fontSize: '1.125rem' }}
                >
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll Indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              const container = scrollRef.current
              if (container) {
                const cardWidth = container.offsetWidth * 0.85
                container.scrollTo({
                  left: cardWidth * index,
                  behavior: 'smooth'
                })
              }
            }}
            className="w-2 h-2 rounded-full bg-gray-300 hover:bg-gray-600 transition-colors"
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
```

---

## VIDEO OPTIMIZATION GUIDE

### 1. Video Specs for Web
```
Format: MP4 (H.264 codec)
Resolution: 1920x1080 (Full HD)
Frame Rate: 30fps (or 24fps for cinematic feel)
Bitrate: 5-8 Mbps (balance quality/size)
Duration: 10-30 seconds (loops seamlessly)
Size Target: Under 5MB for hero videos
```

### 2. Compression Tools
```bash
# Using FFmpeg
ffmpeg -i input.mov \
  -vcodec libx264 \
  -crf 28 \
  -preset slow \
  -vf "scale=1920:1080" \
  -r 30 \
  output.mp4

# For mobile-optimized version
ffmpeg -i input.mov \
  -vcodec libx264 \
  -crf 30 \
  -vf "scale=1280:720" \
  -r 24 \
  mobile-output.mp4
```

### 3. Responsive Video Strategy
```tsx
<video>
  <source
    src="/videos/hero-desktop.mp4"
    type="video/mp4"
    media="(min-width: 1024px)"
  />
  <source
    src="/videos/hero-mobile.mp4"
    type="video/mp4"
    media="(max-width: 1023px)"
  />
</video>
```

### 4. Poster Image (Fallback)
- High-quality still from video
- Same aspect ratio as video
- Optimized WebP format
- Shows instantly while video loads

---

## CONTENT COLLECTION CHECKLIST

### Videos to Gather (Priority Order)

**🔴 Critical (Homepage Heroes)**:
- [ ] Us together - candid moment (10-15 sec)
- [ ] Proposal video (if available)
- [ ] Home/apartment moment (showing our space)

**🟡 Important (Section Heroes)**:
- [ ] Each dog individual video (5-10 sec each)
- [ ] Cooking together / Mangue Azul
- [ ] Travel moments (Rio, Búzios, São Paulo)
- [ ] Apartment exterior/interior walkthrough

**🟢 Nice to Have**:
- [ ] Venue video (Casa HY)
- [ ] Workout together
- [ ] Friends gathering at home
- [ ] Year transitions (2023 → 2024 → 2025)

### Photos to Gather (High Priority)

**🔴 Hero Images Needed**:
- [ ] Us at home (high-quality, well-lit)
- [ ] Each pet (individual portrait shots)
- [ ] Apartment exterior (golden hour)
- [ ] Proposal location (if you have photos)
- [ ] Casa HY venue exterior/interior

**🟡 Timeline Moments**:
- [ ] First date / early relationship
- [ ] Moving into apartment
- [ ] Travel photos (each trip)
- [ ] Anniversaries
- [ ] Family moments (pets arriving)

**🟢 Supporting Content**:
- [ ] Food photos (Mangue Azul, home cooking)
- [ ] Candid moments at home
- [ ] Friends gatherings
- [ ] Workout photos

---

## VISUAL HIERARCHY GUIDE

### Text Over Images/Videos

**DO**:
```tsx
// Large, bold, white text with shadow
<h1 style={{
  fontSize: 'clamp(3rem, 8vw, 6rem)',
  fontWeight: 600,
  color: 'white',
  textShadow: '0 2px 20px rgba(0,0,0,0.5)',
  lineHeight: 1.1
}}>
  Hel & Ylana
</h1>

// Body text with slight transparency
<p style={{
  fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
  color: 'rgba(255,255,255,0.9)',
  textShadow: '0 1px 10px rgba(0,0,0,0.3)',
  lineHeight: 1.6
}}>
  1000 dias. Sim, a gente fez a conta.
</p>
```

**DON'T**:
```tsx
// Small text that's hard to read
<p style={{ fontSize: '0.875rem', color: '#666' }}>
  Hard to read over images
</p>

// Text without overlay/shadow
<h1 style={{ color: 'white' }}>
  Gets lost against bright backgrounds
</h1>
```

### Overlay Strategies

**1. Gradient Overlays** (Best for dynamic content)
```css
/* Bottom gradient - good for footer content */
.gradient-dark-bottom {
  background: linear-gradient(
    to top,
    rgba(0,0,0,0.9) 0%,
    rgba(0,0,0,0.5) 40%,
    transparent 100%
  );
}

/* Left gradient - good for side content */
.gradient-dark-left {
  background: linear-gradient(
    to right,
    rgba(0,0,0,0.9) 0%,
    rgba(0,0,0,0.4) 50%,
    transparent 100%
  );
}

/* Center radial - good for centered text */
.gradient-dark-center {
  background: radial-gradient(
    circle at center,
    rgba(0,0,0,0.7) 0%,
    rgba(0,0,0,0.3) 50%,
    transparent 100%
  );
}
```

**2. Tint Overlays** (Consistent darkness)
```css
.dark-tint {
  background: rgba(0, 0, 0, 0.4);
}

.darker-tint {
  background: rgba(0, 0, 0, 0.6);
}
```

**3. Blur Overlays** (For text readability)
```css
.glass-overlay {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

---

## RESPONSIVE STRATEGY

### Desktop (1024px+)
- Full video backgrounds
- Parallax effects
- Large hero sections (100vh)
- Hover states on images

### Tablet (768px - 1023px)
- Video backgrounds (optimized version)
- Reduced parallax
- Medium hero sections (80vh)
- Touch-friendly interactions

### Mobile (< 768px)
- Static images instead of videos (performance)
- No parallax
- Shorter hero sections (60vh)
- Swipe gestures for galleries
- Stack columns vertically

```tsx
// Example responsive video/image
<div className="hero-background">
  {/* Video on desktop */}
  <video
    className="hidden lg:block"
    src="/videos/hero-desktop.mp4"
    autoPlay loop muted playsInline
  />

  {/* Image on mobile */}
  <Image
    className="lg:hidden"
    src="/images/hero-mobile.jpg"
    alt="Hero"
    fill
  />
</div>
```

---

## ACCESSIBILITY CONSIDERATIONS

### 1. Video Accessibility
```tsx
<video
  autoPlay
  loop
  muted
  playsInline
  aria-label="Hel and Ylana together at home"
>
  <track kind="captions" src="/captions/hero-en.vtt" />
</video>
```

### 2. Text Contrast
- Ensure text over images meets WCAG AA (4.5:1)
- Use overlays to guarantee contrast
- Test with contrast checker tools

### 3. Reduced Motion
```tsx
'use client'

import { useReducedMotion } from 'framer-motion'

export function VideoHero({ videoSrc, posterSrc }) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    // Show static image instead
    return <ImageHero imageSrc={posterSrc} />
  }

  // Show video
  return <video src={videoSrc} ... />
}
```

---

## PERFORMANCE OPTIMIZATION

### 1. Lazy Load Below Fold
```tsx
<VideoHero
  loading="eager" // First hero loads immediately
/>

<VideoHero
  loading="lazy" // Second hero lazy loads
/>
```

### 2. Intersection Observer
```tsx
'use client'

import { useEffect, useRef, useState } from 'react'

export function LazyVideoHero({ videoSrc, posterSrc }) {
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
    <video ref={videoRef} poster={posterSrc}>
      {shouldLoad && <source src={videoSrc} type="video/mp4" />}
    </video>
  )
}
```

### 3. CDN Hosting
- Host videos on Vercel Blob Storage or Cloudinary
- Use CDN URLs for fast delivery
- Enable compression and caching

---

## COPY-PASTE PROMPT FOR AGENTS

Use this prompt with design/frontend agents:

```
I want to transform my wedding website from text-heavy card layouts to a visually rich,
cinematic experience inspired by dtf.com (Din Tai Fung restaurant website).

Reference Document: /Users/helrabelo/code/personal/thousanddaysoflove/VISUAL_TRANSFORMATION_PROMPT.md

Current State:
- Lots of plain text and boxes
- Images only in cards
- Feels static and template-like
- We have lots of videos and photos we can use

Goal:
- Add full-bleed hero sections with video/image backgrounds
- Text overlays with perfect contrast
- Cinematic storytelling rhythm
- Make it feel alive and personal

Priority Sections to Transform:
1. Homepage Hero - needs full video background with text overlay
2. About Us Section - needs visual split or image background
3. Pets Section - needs individual hero images for each pet
4. Story Timeline - needs cinematic moment cards with backgrounds
5. Wedding Location - needs venue showcase with video/images

Design Principles:
- Sophisticated minimalism (not overwhelming)
- White text over dark gradients
- Large, bold typography
- Videos that loop seamlessly
- Authentic over perfect
- DTF-style immersive visuals

Please analyze [SPECIFIC SECTION] and provide:
1. Current state analysis
2. 2-3 transformation options (with code examples)
3. Specific video/image recommendations
4. Implementation code (React/Next.js/Tailwind)

Use the components from VISUAL_TRANSFORMATION_PROMPT.md as reference:
- VideoHero
- ImageHero
- SplitSection
- HorizontalScrollGallery

Make it feel like US - sophisticated, authentic, tech-savvy couple who values
good design and wants to tell our story visually.
```

---

## FINAL CHECKLIST

Before implementing each hero section:

- [ ] Do we have good quality video/images for this section?
- [ ] Does the overlay provide enough text contrast?
- [ ] Is the text hierarchy clear (large title, readable body)?
- [ ] Does it load fast? (< 5MB videos, optimized images)
- [ ] Does it work on mobile? (fallback to image?)
- [ ] Does it respect reduced motion preference?
- [ ] Does it tell a story? (not just decoration)
- [ ] Does it feel like US? (not generic wedding)

---

**Ready to bring the website to life with your personal videos and photos!** 🎬✨
