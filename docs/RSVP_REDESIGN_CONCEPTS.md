# RSVP Page Redesign - 3 Stunning Concepts

**Project**: Thousand Days of Love Wedding Website
**Current Issue**: RSVP page is functional but boring - just a search box, cards, and forms
**Goal**: Transform into a BEAUTIFUL, ENGAGING experience that feels like opening a wedding invitation

---

## Design System Reference

**Colors:**
- Background: `#F8F6F3` (warm cream)
- Primary Text: `#2C2C2C` (charcoal)
- Secondary Text: `#4A4A4A` (gray)
- Decorative: `#A8A8A8` (silver)

**Fonts:**
- Headings: Playfair Display
- Body: Crimson Text (italic)
- Monogram: Cormorant

**Style:** Elegant wedding invitation aesthetic, center-aligned, generous white space (80-150px margins)

**Components Available:**
- Video Hero (immersive full-screen with elegant overlay)
- Botanical Corners (decorative flourishes)
- Framer Motion animations
- Sanity CMS (timeline moments with photos/videos)
- Collage-style masonry gallery

---

## CONCEPT 1: "Immersive Gallery Journey"

### Visual Description

**Layout:**
- Full-screen immersive experience similar to VideoHeroSection
- Beautiful photo/video background from couple's journey (changes subtly based on user interaction)
- Foreground content floats elegantly over background with soft gradient overlay
- Search feels integrated into the romantic atmosphere
- Guest cards appear as elegant invitation envelopes that "open" to reveal details

**Colors & Spacing:**
- Deep gradient overlay: `linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.35), transparent)`
- All text in white/cream for contrast against photo background
- Content centered with max-width: 800px
- Vertical spacing: 64px between major sections
- Card spacing: 24px gap

**Typography:**
- Page Title: 96px Playfair Display, uppercase, letter-spacing: 0.2em, white
- Subtitle: 24px Crimson Text, italic, white/90% opacity
- Search placeholder: 18px Crimson Text, italic
- Guest names: 32px Playfair Display, semi-bold
- Body text: 18px Crimson Text

**Interactive Elements:**
```
Search Bar:
- Glassmorphism: rgba(255,255,255,0.15), backdrop-blur-lg
- Border: 2px solid rgba(255,255,255,0.3)
- Rounded: 24px
- Height: 72px (large touch target)
- Icon: Search icon animated on focus
- On type: Subtle pulse animation

Guest Cards (Envelope Style):
- Initial state: Closed envelope icon/illustration
- Glassmorphism background
- Hover: Envelope "opens" with rotation animation
- Click: Expands to full card with smooth scale transform
- Ribbon decoration at corner (botanical flourish)
```

### User Flow

1. **Landing (0-2s)**
   - Fade in from black with elegant timing
   - Background photo/video loads with poster image
   - Botanical corners animate in from edges
   - Hero text types in character-by-character (subtle)
   - Personal message from couple: "Procure seu nome para confirmar presença no nosso grande dia"

2. **Search Experience (2-10s)**
   - Focus automatically on search input
   - As user types, background subtly shifts between couple photos
   - Real-time search with elegant loading state
   - Each keystroke shows micro-animation feedback
   - If no results: Elegant "Não encontramos seu nome" with suggestion to contact couple

3. **Guest Card Reveal (10-20s)**
   - Cards fade in with stagger delay (100ms each)
   - Each card shows guest name in elegant calligraphy style
   - Hover shows preview: "Clique para abrir seu convite"
   - Click triggers envelope opening animation

4. **RSVP Form (20-60s)**
   - Card expands full-screen (or large modal)
   - Background blurs further
   - Form sections reveal sequentially with smooth transitions
   - Each input field has elegant focus state with botanical decoration
   - Plus ones selector: Beautiful stepper with +/- buttons
   - Dietary/songs/message: Expandable sections with icons

5. **Confirmation (60-65s)**
   - Background changes to celebratory couple moment
   - Confetti particles fall elegantly (not too crazy)
   - Success message with hearts floating upward
   - "Mal podemos esperar para celebrar com você!"
   - Next steps appear as elegant timeline cards

### Interactive Elements (Detailed)

**Search Bar Animations:**
```javascript
// Focus state
initial={{ scale: 1, boxShadow: '0 4px 12px rgba(255,255,255,0.2)' }}
whileFocus={{
  scale: 1.02,
  boxShadow: '0 8px 24px rgba(255,255,255,0.4)',
  borderColor: 'rgba(255,255,255,0.6)'
}}

// Typing animation
- Each character typed triggers subtle pulse
- Icon rotates 360deg smoothly
```

**Envelope Card Animation:**
```javascript
// Closed envelope
<motion.div
  initial={{ rotateX: 0, scale: 1 }}
  whileHover={{ rotateX: -5, scale: 1.05 }}
  whileTap={{ rotateX: 0, scale: 0.98 }}
>
  {/* Envelope flap illustration */}
</motion.div>

// Opening animation
variants={{
  closed: { rotateX: 0, transformOrigin: 'top' },
  opening: {
    rotateX: -120,
    transformOrigin: 'top',
    transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }
  }
}}
```

**Form Reveal Animation:**
```javascript
// Sequential reveal
sections.map((section, i) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: i * 0.15 }}
  >
    {section}
  </motion.div>
))
```

### Content Strategy

**Landing Copy:**
```
[H&Y Logo in white]

CONFIRME SUA PRESENÇA

1000 dias de amor. Uma celebração única.
Procure seu nome para responder ao nosso convite.

[Search bar: "Digite seu nome completo..."]

📅 20 de Novembro, 2025  |  📍 Constable Galerie, Fortaleza
```

**Guest Card Copy:**
```
[Envelope icon with wax seal illustration]

[Guest Name]
Você está convidado(a)

[Button: "Abrir Convite"]
```

**RSVP Form Copy:**
```
[Animated heart icon]

Querido(a) [Guest Name],

Será uma honra ter você conosco neste dia tão especial!
Por favor, confirme sua presença e nos conte um pouco mais...

[Form sections with elegant dividers]

✨ PRESENÇA
○ Sim, vou! (Mal posso esperar!)
○ Não posso (Vou sentir muita falta)

👥 ACOMPANHANTES
[Stepper: - 0 +]
*Apenas se não estiverem na lista de convidados

🍽️ RESTRIÇÕES ALIMENTARES
[Textarea: "Vegetariano, vegano, alergias..."]

🎵 MÚSICAS ESPECIAIS
[Textarea: "Que música não pode faltar?"]

💌 MENSAGEM PARA OS NOIVOS
[Textarea: "Deixe uma mensagem carinhosa..."]

[Button: "Confirmar Presença" with loading hearts]
```

**Success Modal Copy:**
```
[Animated celebration with floating hearts]

CONFIRMADO! 🎉

[Guest Name], mal podemos esperar
para celebrar com você!

📅 Marque seu Calendário
20 de Novembro, 2025 às 10h30

📍 Veja os Detalhes
Constable Galerie, Fortaleza

🎁 Nossa Lista de Presentes
Ajude a construir nosso lar

📖 Conheça Nossa História
1000 dias em palavras e imagens

[Share button: "Compartilhar via WhatsApp"]
```

### Photo/Video Integration

**Background Rotation Strategy:**
```javascript
const backgroundMoments = [
  { url: '/hero-video.mp4', trigger: 'landing' },
  { url: '/proposal-photo.jpg', trigger: 'searching' },
  { url: '/first-date.jpg', trigger: 'guest-found' },
  { url: '/engaged.jpg', trigger: 'rsvp-yes' },
  { url: '/celebration.mp4', trigger: 'confirmed' }
]

// Smooth crossfade between moments
<AnimatePresence mode="wait">
  <motion.div
    key={currentMoment}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 1.5 }}
  >
    {renderBackground(currentMoment)}
  </motion.div>
</AnimatePresence>
```

**Specific Photo/Video Placements:**
- **Landing**: Hero proposal video (looping, muted initially)
- **Search Active**: Photo of couple looking at camera (inviting)
- **Guest Found**: Couple at venue/celebration moment
- **RSVP Form**: Soft-focus couple photo (background blur)
- **Success**: Confetti moment or couple kissing

### Mobile Adaptations

**Layout Changes:**
```css
@media (max-width: 768px) {
  /* Reduce vertical spacing */
  section-padding: 48px 24px;

  /* Simplify background */
  background: static image instead of video
  gradient: darker for text legibility

  /* Search bar */
  height: 64px (still large for touch)
  font-size: 16px (prevents zoom on iOS)

  /* Guest cards */
  full-width: calc(100vw - 48px)
  stack vertically: gap 16px

  /* RSVP form */
  becomes: bottom sheet (slides up)
  max-height: 90vh with scroll

  /* Touch targets */
  all buttons: min 48px height
  input fields: min 48px height
}
```

**Mobile-Specific Interactions:**
- **Search**: Bottom sheet slides up from bottom
- **Guest Cards**: Swipe left/right to browse (if multiple matches)
- **RSVP Form**: Sheet with drag handle, swipe down to dismiss
- **Success**: Full screen takeover with confetti animation

### Component Breakdown

```tsx
// Main Component Structure
<RSVPImmersiveGallery>
  <BackgroundCarousel /> // Photo/video rotation
  <GradientOverlay /> // Dynamic opacity based on state
  <BotanicalCorners /> // Decorative flourishes

  <ContentContainer>
    <HeroSection>
      <Logo />
      <Title />
      <Subtitle />
    </HeroSection>

    <SearchSection>
      <GlassmorphicSearchBar />
      <AnimatedSearchIcon />
    </SearchSection>

    <GuestResultsSection>
      <EnvelopeCard /> // Repeatable
    </GuestResultsSection>

    <RSVPFormModal>
      <FormHeader />
      <AttendanceRadio />
      <PlusOnesStepper />
      <DietaryTextarea />
      <SongRequestsTextarea />
      <MessageTextarea />
      <SubmitButton />
    </RSVPFormModal>

    <SuccessModal>
      <CelebrationAnimation />
      <ConfirmationMessage />
      <NextStepsCards />
      <ShareButtons />
    </SuccessModal>
  </ContentContainer>
</RSVPImmersiveGallery>
```

**New Components to Build:**
1. `BackgroundCarousel.tsx` - Smart background rotation
2. `GlassmorphicSearchBar.tsx` - Elegant search input
3. `EnvelopeCard.tsx` - Opening envelope animation
4. `PlusOnesStepper.tsx` - Beautiful number selector
5. `CelebrationAnimation.tsx` - Confetti/hearts
6. `FloatingHearts.tsx` - Success state animation

### Technical Considerations

**Framer Motion Animations:**
```javascript
// Page variants
const pageVariants = {
  initial: { opacity: 0 },
  enter: {
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: [0.43, 0.13, 0.23, 0.96]
    }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.8 }
  }
}

// Envelope opening
const envelopeVariants = {
  closed: {
    rotateX: 0,
    transformOrigin: 'top center'
  },
  opening: {
    rotateX: -120,
    transition: {
      duration: 0.8,
      ease: [0.43, 0.13, 0.23, 0.96]
    }
  }
}

// Stagger children
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
}
```

**Video Handling:**
```javascript
// Preload poster images for instant display
<video
  ref={videoRef}
  poster={posterUrl}
  preload="metadata"
  playsInline
  muted
  loop
  autoPlay
  onLoadedData={handleVideoLoaded}
>
  <source src={videoUrl} type="video/mp4" />
</video>

// Smooth transitions between videos
<AnimatePresence mode="wait">
  <motion.video
    key={currentVideo}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 1.5 }}
  />
</AnimatePresence>
```

**Image Optimization:**
```javascript
// Use Sanity CDN image transformations
const imageUrl = (url: string) => {
  return `${url}?w=1920&h=1080&fit=crop&crop=faces&auto=format&q=75`
}

// Responsive images
<Image
  src={imageUrl(backgroundImage)}
  alt="Hel & Ylana"
  fill
  priority
  sizes="100vw"
  style={{ objectFit: 'cover' }}
/>
```

**Performance Optimizations:**
1. Lazy load envelope cards (only render visible)
2. Debounce search input (300ms)
3. Optimize images with Sanity CDN params
4. Use `will-change: transform` for animated elements
5. Preload critical fonts
6. Compress videos (max 5MB, H.264)

---

## CONCEPT 2: "Story-Driven RSVP"

### Visual Description

**Layout:**
- Vertical scroll journey (single-page flow)
- Top 40vh: Personal video message from couple
- Middle section: Timeline moments appear as you search
- Bottom section: RSVP form integrated into story
- Success state: Personalized thank you moment

**Colors & Spacing:**
- White background with cream texture
- Content cards with soft shadows
- Timeline dots in decorative silver
- Generous padding: 120px vertical between sections
- Card max-width: 900px centered

**Typography:**
- Section Headers: 56px Playfair Display, centered
- Timeline Dates: 20px Crimson Text, italic
- Story Text: 18px Crimson Text, line-height: 1.8
- Form Labels: 16px Crimson Text, medium weight
- Button Text: 18px Playfair Display, uppercase, letter-spacing: 0.1em

**Interactive Elements:**
```
Video Message:
- Autoplays when in viewport (muted with unmute button)
- Play/pause controls appear on hover
- Subtitles in Portuguese
- Skip button: "Pular para RSVP" (bottom-right)

Timeline Moments:
- Horizontal scroll snap on mobile
- Vertical cards on desktop
- Photos zoom on hover
- Click to expand full-screen lightbox

Timeline Integration:
- As you scroll, moments reveal
- Each has: photo, date, caption
- Connected by elegant line with dots
- Relevant moment appears based on form progress
```

### User Flow

1. **Video Introduction (0-30s)**
   - Page loads with video hero (like VideoHeroSection)
   - Couple appears on screen with personal message:
     - "Oi! Somos Hel e Ylana..."
     - "Queremos muito você no nosso casamento..."
     - "Procure seu nome abaixo para confirmar!"
   - Subtle CTA button pulses below video
   - Background: Soft cream with botanical texture

2. **Search Section (30-45s)**
   - Scroll down reveals search section
   - Header: "Encontre Seu Convite"
   - Search bar with larger-than-life design
   - Placeholder: "Digite seu nome completo..."
   - As you type, timeline moments fade in around search
   - Guest cards appear below with timeline aesthetic

3. **Guest Selection + Story Reveal (45-90s)**
   - Click guest card
   - Timeline expands showing couple's journey
   - Moments relevant to guest appear (if friend/family)
   - Smooth scroll to RSVP section
   - Form appears integrated into timeline

4. **RSVP Form in Timeline (90-180s)**
   - Form sections appear as timeline milestones
   - Each field is a "moment" in the journey
   - Progress indicator: "Passo 1 de 5"
   - Photos appear alongside form sections:
     - Attendance: Wedding venue photo
     - Plus ones: Group celebration photo
     - Dietary: Food/catering photo
     - Songs: Dance floor photo
     - Message: Intimate couple moment
   - Submit button: "Confirmar Presença"

5. **Celebratory Confirmation (180-220s)**
   - Form submits with smooth animation
   - Timeline completes with final moment
   - Photo/video of couple celebrating appears
   - Confetti falls elegantly (CSS particles)
   - Hearts float upward (Framer Motion)
   - Success message: "Você agora faz parte da nossa história!"
   - Timeline continues showing "next chapters":
     - Wedding day
     - Honeymoon plans
     - Building life together

### Interactive Elements (Detailed)

**Video Message Component:**
```javascript
<VideoMessageHero>
  <video
    autoPlay
    muted
    controls={false}
    playsInline
    onEnded={() => setShowCTA(true)}
  >
    <source src="/videos/couple-invitation.mp4" />
    <track
      kind="subtitles"
      src="/subtitles/invitation-pt.vtt"
      srcLang="pt"
      label="Português"
    />
  </video>

  <VolumeControl />
  <SkipToRSVPButton />

  <AnimatePresence>
    {showCTA && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-12"
      >
        <Button variant="wedding" size="lg">
          Confirmar Presença ↓
        </Button>
      </motion.div>
    )}
  </AnimatePresence>
</VideoMessageHero>
```

**Timeline Moments Reveal:**
```javascript
// Scroll-triggered reveal
const { scrollYProgress } = useScroll()
const opacity = useTransform(scrollYProgress, [0.2, 0.3], [0, 1])
const y = useTransform(scrollYProgress, [0.2, 0.3], [50, 0])

<motion.div style={{ opacity, y }}>
  <TimelineMoment
    image="/images/first-date.jpg"
    date="6 de Janeiro, 2023"
    caption="Aquele primeiro 'oi' no WhatsApp"
    dayNumber="Dia 1"
  />
</motion.div>
```

**Form as Timeline Milestones:**
```javascript
<Timeline>
  {formSections.map((section, index) => (
    <TimelineMilestone
      key={section.id}
      number={index + 1}
      title={section.title}
      image={section.photo}
      completed={section.completed}
    >
      {section.fields}
    </TimelineMilestone>
  ))}
</Timeline>

// Example milestone
<TimelineMilestone
  number={1}
  title="Você Vai?"
  image="/images/venue.jpg"
  completed={attendanceSelected}
>
  <RadioGroup>
    <Radio value="yes">
      <Heart className="w-6 h-6" />
      Sim, vou!
    </Radio>
    <Radio value="no">
      Não posso
    </Radio>
  </RadioGroup>
</TimelineMilestone>
```

**Celebration Animation:**
```javascript
const ConfettiCelebration = () => {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            background: i % 3 === 0 ? '#A8A8A8' : '#E8E6E3',
            left: `${Math.random() * 100}%`,
            top: -20
          }}
          animate={{
            y: [0, window.innerHeight + 50],
            x: [0, (Math.random() - 0.5) * 200],
            rotate: [0, 360],
            opacity: [1, 0]
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 0.5,
            ease: 'linear'
          }}
        />
      ))}
    </div>
  )
}
```

### Content Strategy

**Video Message Script:**
```
[Hel & Ylana appear on screen, casual and warm]

HEL: "Oi! Somos Hel e Ylana..."

YLANA: "...e mal podemos esperar para celebrar com você!"

HEL: "Desde aquele primeiro 'oi' no WhatsApp em 6 de janeiro de 2023..."

YLANA: "...já se passaram exatos 1000 dias."

HEL: "Mil dias de amor, risadas, crescimento..."

YLANA: "...e agora queremos você lá para o nosso 'sim'."

BOTH: "Procure seu nome abaixo e confirme sua presença!"

[Fade to CTA: "Confirmar Presença ↓"]
```

**Search Section Copy:**
```
ENCONTRE SEU CONVITE

Digite seu nome completo para acessar
seu convite personalizado

[Search bar: "Ex: Maria Silva"]

💌 Seu convite está esperando por você
```

**Timeline Form Sections:**

**Milestone 1 - Attendance:**
```
[Photo: Wedding venue]
Dia 1000 • 20 de Novembro, 2025

VOCÊ VAI ESTAR LÁ?

○ Sim, vou!
  Mal posso esperar para celebrar com vocês!

○ Não posso
  Vou sentir muita saudade de vocês
```

**Milestone 2 - Plus Ones:**
```
[Photo: Group celebration]
Mais amigos, mais amor

QUEM VEM COM VOCÊ?

[Stepper: - 0 +]

💡 Dica: Adicione apenas acompanhantes
que NÃO estão na nossa lista
```

**Milestone 3 - Dietary:**
```
[Photo: Food/catering]
Queremos que você se sinta em casa

RESTRIÇÕES ALIMENTARES?

[Textarea: "Vegetariano, vegano, alergias..."]

🍽️ Nosso buffet terá opções para todos!
```

**Milestone 4 - Songs:**
```
[Photo: Dance floor]
A trilha sonora da nossa festa

QUE MÚSICA NÃO PODE FALTAR?

[Textarea: "Aquela música que te faz dançar..."]

🎵 Vamos criar a playlist juntos!
```

**Milestone 5 - Message:**
```
[Photo: Intimate couple moment]
Suas palavras significam tudo

MENSAGEM PARA OS NOIVOS

[Textarea: "Escreva algo do coração..."]

💌 Vamos guardar para sempre
```

**Success Celebration:**
```
[Confetti animation + Hearts floating]

🎉 VOCÊ FAZ PARTE DA NOSSA HISTÓRIA!

[Guest Name], sua presença
confirmada com muito amor!

📖 PRÓXIMOS CAPÍTULOS:

Capítulo 1000: O Casamento
20 de Novembro, 2025 • 10h30
[Ver Detalhes]

Capítulo 1001: Lua de Mel
Dezembro, 2025
[Curiosidades]

Capítulo ∞: Para Sempre
[Nossa História Completa]

[Share: "Compartilhar via WhatsApp"]
```

### Photo/Video Integration

**Video Content Required:**
```
1. Couple Invitation Video (45-60 seconds)
   - Script: Personal, warm, inviting
   - Location: Home or meaningful place
   - Subtitles: Portuguese (for accessibility)
   - File: 1920x1080, H.264, max 10MB

2. Thank You Video Snippet (10-15 seconds)
   - Quick celebration moment
   - Used in success state
   - Can be excerpt from main video
```

**Photo Placements:**
```javascript
const timelineMoments = [
  {
    id: 'day-1',
    image: '/images/first-message.jpg',
    date: '6 de Janeiro, 2023',
    caption: 'O primeiro "oi"',
    dayNumber: 'Dia 1',
    visible: 'on-search'
  },
  {
    id: 'first-date',
    image: '/images/first-date.jpg',
    date: 'Janeiro, 2023',
    caption: 'Nosso primeiro encontro',
    dayNumber: 'Dia 7',
    visible: 'on-search'
  },
  {
    id: 'proposal',
    image: '/images/proposal.jpg',
    date: 'Proposal day',
    caption: 'O pedido',
    dayNumber: 'Dia 850',
    visible: 'on-form'
  },
  {
    id: 'venue',
    image: '/images/venue.jpg',
    caption: 'Constable Galerie',
    visible: 'form-step-1'
  },
  {
    id: 'celebration',
    image: '/images/group-celebration.jpg',
    caption: 'Celebrando com amigos',
    visible: 'form-step-2'
  },
  {
    id: 'food',
    image: '/images/catering.jpg',
    caption: 'O menu',
    visible: 'form-step-3'
  },
  {
    id: 'dance',
    image: '/images/dancing.jpg',
    caption: 'A pista de dança',
    visible: 'form-step-4'
  },
  {
    id: 'intimate',
    image: '/images/couple-intimate.jpg',
    caption: 'Nossos momentos',
    visible: 'form-step-5'
  },
  {
    id: 'success',
    image: '/images/celebration-kiss.jpg',
    caption: 'Você confirmou!',
    visible: 'success-state'
  }
]
```

**Dynamic Background Strategy:**
```javascript
// Background changes based on scroll position
const backgroundImage = useMemo(() => {
  if (scrollProgress < 0.2) return '/images/hero-couple.jpg'
  if (scrollProgress < 0.4) return '/images/timeline-collage.jpg'
  if (scrollProgress < 0.6) return '/images/venue-exterior.jpg'
  if (scrollProgress < 0.8) return '/images/celebration.jpg'
  return '/images/sunset-couple.jpg'
}, [scrollProgress])

<div
  className="fixed inset-0 -z-10"
  style={{
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(80px) opacity(0.15)',
    transition: 'background-image 1.5s ease'
  }}
/>
```

### Mobile Adaptations

**Responsive Layout:**
```css
@media (max-width: 768px) {
  /* Video hero */
  .video-hero {
    height: 60vh; /* Shorter on mobile */
    padding: 24px;
  }

  /* Timeline */
  .timeline-moments {
    display: flex;
    overflow-x: scroll;
    scroll-snap-type: x mandatory;
    gap: 16px;
    padding: 0 24px;
  }

  .timeline-moment {
    flex: 0 0 80vw;
    scroll-snap-align: center;
  }

  /* Form milestones */
  .timeline-milestone {
    padding: 32px 24px;
    margin-bottom: 24px;
  }

  .timeline-milestone-image {
    aspect-ratio: 16/9;
    margin-bottom: 24px;
  }

  /* Success state */
  .celebration {
    padding: 48px 24px;
  }
}
```

**Mobile-Specific Interactions:**
- **Video**: Tap to play/pause (no hover controls)
- **Timeline**: Horizontal swipe with dots indicator
- **Form**: One milestone visible at a time, "Continue" button
- **Progress**: Sticky top bar showing completion (1/5, 2/5, etc.)

**Touch Optimizations:**
```javascript
// Touch-friendly timeline
<div
  className="timeline-scroll"
  onTouchStart={handleTouchStart}
  onTouchMove={handleTouchMove}
  onTouchEnd={handleTouchEnd}
>
  {moments.map((moment, i) => (
    <TimelineMoment
      key={moment.id}
      active={activeIndex === i}
      onSwipe={() => setActiveIndex(i)}
    />
  ))}
</div>

// Progress indicator
<div className="fixed top-20 left-0 right-0 h-1 bg-cream">
  <motion.div
    className="h-full bg-decorative"
    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
    layoutId="progress"
  />
</div>
```

### Component Breakdown

```tsx
// Main Component Structure
<RSVPStoryDriven>
  <VideoInvitationHero>
    <video />
    <VolumeControl />
    <Subtitles />
    <SkipButton />
    <CTAButton />
  </VideoInvitationHero>

  <SearchSection>
    <SectionHeader />
    <SearchBar />
    <TimelinePreview /> // Faded moments
  </SearchSection>

  <GuestCardsSection>
    <TimelineGuestCard /> // Repeatable
  </GuestCardsSection>

  <StoryTimelineForm>
    <TimelineConnector /> // Vertical line with dots

    <TimelineMilestone number={1}>
      <MilestoneImage />
      <MilestoneHeader />
      <AttendanceRadio />
    </TimelineMilestone>

    <TimelineMilestone number={2}>
      <MilestoneImage />
      <MilestoneHeader />
      <PlusOnesStepper />
    </TimelineMilestone>

    {/* ...more milestones... */}

    <TimelineSubmit>
      <SubmitButton />
    </TimelineSubmit>
  </StoryTimelineForm>

  <CelebrationSection>
    <ConfettiAnimation />
    <FloatingHearts />
    <SuccessMessage />
    <NextChaptersTimeline />
    <ShareButtons />
  </CelebrationSection>
</RSVPStoryDriven>
```

**New Components to Build:**
1. `VideoInvitationHero.tsx` - Personal message video
2. `TimelineConnector.tsx` - Vertical line with dots
3. `TimelineMilestone.tsx` - Form section as timeline moment
4. `MilestoneProgress.tsx` - Sticky progress indicator
5. `NextChaptersTimeline.tsx` - Future moments preview
6. `ConfettiAnimation.tsx` - CSS-based celebration
7. `FloatingHearts.tsx` - Framer Motion hearts
8. `TimelineGuestCard.tsx` - Guest card with timeline aesthetic

### Technical Considerations

**Video Optimization:**
```javascript
// Lazy load video for performance
const [shouldLoadVideo, setShouldLoadVideo] = useState(false)

useEffect(() => {
  const timer = setTimeout(() => {
    setShouldLoadVideo(true)
  }, 500) // Load after critical content
  return () => clearTimeout(timer)
}, [])

// Video with fallback poster
<video
  poster="/images/video-poster.jpg"
  preload="metadata"
  playsInline
  muted={isMuted}
  ref={videoRef}
>
  {shouldLoadVideo && (
    <source src="/videos/invitation.mp4" type="video/mp4" />
  )}
</video>
```

**Scroll Progress Tracking:**
```javascript
// Track form completion
const { scrollYProgress } = useScroll({
  target: formRef,
  offset: ["start end", "end start"]
})

const formProgress = useTransform(
  scrollYProgress,
  [0, 0.2, 0.4, 0.6, 0.8, 1],
  [0, 1, 2, 3, 4, 5]
)

// Use for visual feedback
<ProgressBar progress={formProgress} />
```

**Timeline Reveal on Scroll:**
```javascript
// Intersection Observer for moments
const { ref, inView } = useInView({
  threshold: 0.3,
  triggerOnce: true
})

<motion.div
  ref={ref}
  initial={{ opacity: 0, y: 50 }}
  animate={inView ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 0.8 }}
>
  <TimelineMoment />
</motion.div>
```

**Performance:**
1. Lazy load timeline images (below fold)
2. Use Intersection Observer for scroll animations
3. Debounce scroll events (16ms)
4. Compress video (H.264, CRF 28, max 5MB)
5. Use WebP for images with JPEG fallback
6. Preload critical fonts and hero image

---

## CONCEPT 3: "Interactive Experience"

### Visual Description

**Layout:**
- Full-page immersive design with parallax scrolling
- Three distinct "acts" in the experience:
  - Act 1: The Invitation (unwrap)
  - Act 2: Your Story (personalized)
  - Act 3: The Celebration (confirmation)
- Content slides/fades between acts with cinematic transitions
- Vertical scroll controls progression

**Colors & Spacing:**
- Dynamic color scheme that evolves:
  - Act 1: Warm cream tones (invitation paper)
  - Act 2: Soft blush with photos (romantic)
  - Act 3: Celebratory gold/silver (party)
- Full-screen sections (100vh each)
- Content centered with max-width: 1000px
- Section transitions: 200px overlap with parallax

**Typography:**
- Act Headers: 72px Playfair Display, centered, fade-in
- Guest Name: 96px Cormorant (monogram style)
- Story Text: 22px Crimson Text, italic, generous line-height
- Interactive Labels: 18px Crimson Text, uppercase
- CTAs: 20px Playfair Display, bold

**Interactive Elements:**
```
Unwrapping Animation:
- Envelope illustration with wax seal
- Click/tap seal to "break" it
- Envelope flap opens with 3D rotation
- Invitation card slides out
- Card unfolds to reveal guest name

Personalized Story:
- If guest is family: Show family photos
- If guest is friend: Show friendship moments
- If guest is colleague: Show professional respect
- Dynamically pulled from Sanity timeline

Video Message Option:
- "Leave a video message" CTA
- Opens camera permission
- Record 15-30 second message
- Preview and submit
- Stored in Supabase

Celebration Animation:
- Interactive confetti cannon
- Click/drag to "throw" confetti
- Heart balloons float up
- Personalized thank you video plays
```

### User Flow

1. **Act 1: The Invitation (0-20s)**
   - Landing: Full-screen envelope with wax seal
   - Botanical decorations frame the envelope
   - Soft animation: Envelope gently breathes (subtle scale)
   - Text: "Você tem um convite especial"
   - Instruction: "Clique no selo para abrir"

2. **Unwrap Interaction (20-35s)**
   - Click wax seal: Breaks with particle effect
   - Envelope flap rotates open (3D transform)
   - Invitation card slides out smoothly
   - Card unfolds with paper sound effect
   - Reveals search section

3. **Act 2: Find Yourself (35-60s)**
   - Search bar appears with elegant animation
   - Placeholder: "Digite seu nome para personalizar"
   - As you type, background subtly shows your photos
   - Guest found: Name appears in beautiful calligraphy
   - Parallax scroll reveals your personalized story

4. **Your Personalized Story (60-120s)**
   - Dynamic content based on guest relationship:
     - **Family**: "Você é família. Nossa base."
     - **Best Friend**: "Você esteve lá desde o início"
     - **Close Friend**: "Momentos que guardamos no coração"
     - **Colleague**: "Do trabalho para a vida"
   - Photo gallery: Moments with this guest (if available)
   - Timeline: How long you've known each other
   - Message: Why you're important to the couple
   - Scroll to continue to RSVP

5. **Act 3: The Response (120-180s)**
   - Dramatic reveal: "Vai ou não vai?"
   - Two large interactive options:
     - **YES**: Expands into celebration
     - **NO**: Gentle understanding message
   - If YES: Form slides in elegantly
   - Form sections with smooth transitions
   - Optional: "Record a video message"
   - Submit with loading animation

6. **Celebration Finale (180-220s)**
   - Interactive confetti cannon
   - Click/tap to shoot confetti
   - Heart balloons float upward
   - Personalized thank you:
     - Short video from couple OR
     - Animated message with guest name
   - Next steps appear as floating cards
   - Share button with QR code

### Interactive Elements (Detailed)

**Envelope Unwrapping:**
```javascript
const EnvelopeUnwrap = () => {
  const [sealBroken, setSealBroken] = useState(false)
  const [flapOpen, setFlapOpen] = useState(false)
  const [cardOut, setCardOut] = useState(false)

  const breakSeal = () => {
    setSealBroken(true)
    // Particle effect
    setTimeout(() => setFlapOpen(true), 300)
    setTimeout(() => setCardOut(true), 1000)
  }

  return (
    <div className="envelope-container">
      {/* Wax seal */}
      <motion.div
        className="wax-seal"
        onClick={breakSeal}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {!sealBroken && <WaxSealIcon />}
      </motion.div>

      {/* Seal break particles */}
      <AnimatePresence>
        {sealBroken && (
          <div className="particles">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="particle"
                initial={{
                  x: 0, y: 0,
                  opacity: 1,
                  scale: 1
                }}
                animate={{
                  x: (Math.random() - 0.5) * 200,
                  y: (Math.random() - 0.5) * 200,
                  opacity: 0,
                  scale: 0
                }}
                transition={{
                  duration: 1,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Envelope flap */}
      <motion.div
        className="envelope-flap"
        animate={{
          rotateX: flapOpen ? -120 : 0
        }}
        transition={{
          duration: 1.2,
          ease: [0.43, 0.13, 0.23, 0.96]
        }}
        style={{
          transformOrigin: 'top center',
          transformStyle: 'preserve-3d'
        }}
      />

      {/* Invitation card */}
      <motion.div
        className="invitation-card"
        animate={{
          y: cardOut ? 0 : 200,
          opacity: cardOut ? 1 : 0
        }}
        transition={{
          duration: 1.5,
          ease: [0.43, 0.13, 0.23, 0.96]
        }}
      >
        <SearchSection />
      </motion.div>
    </div>
  )
}
```

**Personalized Story Generation:**
```javascript
const PersonalizedStory = ({ guest, relationship }) => {
  // Get relevant photos from Sanity timeline
  const photos = useMemo(() => {
    return timelineMoments
      .filter(moment =>
        moment.tags.includes(guest.id) ||
        moment.category === relationship
      )
      .slice(0, 6)
  }, [guest, relationship])

  // Calculate days known
  const daysKnown = useMemo(() => {
    if (!guest.firstMetDate) return null
    return Math.floor(
      (new Date() - new Date(guest.firstMetDate)) / (1000 * 60 * 60 * 24)
    )
  }, [guest])

  const storyContent = {
    family: {
      title: "Você É Família",
      subtitle: "Nossa base. Nossa força.",
      message: "Desde sempre você está ao nosso lado. Este dia não seria o mesmo sem você.",
      icon: "👨‍👩‍👧‍👦"
    },
    best_friend: {
      title: "Você Esteve Lá",
      subtitle: "Desde o primeiro 'oi'",
      message: `${daysKnown ? `Há ${daysKnown} dias` : 'Há tanto tempo'} você faz parte da nossa história. Obrigado por cada momento.`,
      icon: "💕"
    },
    friend: {
      title: "Momentos Que Guardamos",
      subtitle: "No coração",
      message: "Risadas, conversas, memórias. Você é parte essencial desta jornada.",
      icon: "✨"
    },
    colleague: {
      title: "Do Trabalho Para A Vida",
      subtitle: "Conexões que importam",
      message: "Começou profissionalmente, mas virou amizade verdadeira. Queremos você lá!",
      icon: "🤝"
    }
  }

  const content = storyContent[relationship] || storyContent.friend

  return (
    <section className="personalized-story">
      {/* Header */}
      <motion.div
        className="story-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <span className="story-icon">{content.icon}</span>
        <h2 className="story-title">{content.title}</h2>
        <p className="story-subtitle">{content.subtitle}</p>
      </motion.div>

      {/* Photo Gallery */}
      {photos.length > 0 && (
        <motion.div
          className="story-photos"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <ParallaxGallery images={photos} />
        </motion.div>
      )}

      {/* Timeline */}
      {daysKnown && (
        <motion.div
          className="days-together"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <span className="days-number">{daysKnown.toLocaleString()}</span>
          <span className="days-label">dias de amizade</span>
        </motion.div>
      )}

      {/* Personal Message */}
      <motion.p
        className="story-message"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.7 }}
      >
        {content.message}
      </motion.p>

      {/* Continue CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <Button variant="wedding" size="lg">
          Confirmar Presença ↓
        </Button>
      </motion.div>
    </section>
  )
}
```

**Video Message Recording:**
```javascript
const VideoMessageRecorder = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [recording, setRecording] = useState(false)
  const [recorded, setRecorded] = useState(false)
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null)
  const [countdown, setCountdown] = useState(3)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: true
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }

      // Countdown before recording
      let count = 3
      const countdownInterval = setInterval(() => {
        count--
        setCountdown(count)
        if (count === 0) {
          clearInterval(countdownInterval)
          actuallyStartRecording(stream)
        }
      }, 1000)

    } catch (error) {
      console.error('Camera access denied:', error)
      alert('Precisamos de acesso à câmera para gravar sua mensagem!')
    }
  }

  const actuallyStartRecording = (stream: MediaStream) => {
    const mediaRecorder = new MediaRecorder(stream)
    const chunks: Blob[] = []

    mediaRecorder.ondataavailable = (e) => {
      chunks.push(e.data)
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' })
      setVideoBlob(blob)
      setRecorded(true)

      // Stop camera
      stream.getTracks().forEach(track => track.stop())
    }

    mediaRecorder.start()
    mediaRecorderRef.current = mediaRecorder
    setRecording(true)

    // Auto-stop after 30 seconds
    setTimeout(() => {
      if (mediaRecorder.state === 'recording') {
        stopRecording()
      }
    }, 30000)
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setRecording(false)
    }
  }

  const submitVideo = async () => {
    if (!videoBlob) return

    const formData = new FormData()
    formData.append('video', videoBlob, 'message.webm')
    formData.append('guest_id', guestId)

    try {
      await fetch('/api/video-messages', {
        method: 'POST',
        body: formData
      })

      setShowSuccess(true)
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  return (
    <div className="video-recorder">
      {!recorded && (
        <>
          <video
            ref={videoRef}
            className="camera-preview"
            muted
            playsInline
          />

          {countdown > 0 && countdown < 3 && (
            <motion.div
              className="countdown-overlay"
              initial={{ scale: 2, opacity: 1 }}
              animate={{ scale: 1, opacity: 0 }}
              transition={{ duration: 1 }}
            >
              {countdown}
            </motion.div>
          )}

          {!recording && (
            <Button onClick={startRecording} size="lg">
              <Video className="w-5 h-5 mr-2" />
              Gravar Mensagem
            </Button>
          )}

          {recording && (
            <div className="recording-controls">
              <div className="recording-indicator">
                <span className="recording-dot" />
                Gravando...
              </div>
              <Button onClick={stopRecording} variant="destructive">
                Parar
              </Button>
            </div>
          )}
        </>
      )}

      {recorded && videoBlob && (
        <div className="playback">
          <video
            src={URL.createObjectURL(videoBlob)}
            controls
            className="recorded-video"
          />

          <div className="playback-actions">
            <Button
              onClick={() => {
                setRecorded(false)
                setVideoBlob(null)
              }}
              variant="outline"
            >
              Gravar Novamente
            </Button>
            <Button onClick={submitVideo} variant="wedding">
              Enviar Mensagem
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
```

**Interactive Confetti Cannon:**
```javascript
const ConfettiCannon = () => {
  const [particles, setParticles] = useState<Array<{
    id: number
    x: number
    y: number
    color: string
    rotation: number
  }>>([])

  const shootConfetti = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: Date.now() + i,
      x,
      y,
      color: ['#A8A8A8', '#E8E6E3', '#C5C5C5'][Math.floor(Math.random() * 3)],
      rotation: Math.random() * 360
    }))

    setParticles(prev => [...prev, ...newParticles])

    // Clean up after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(n => n.id === p.id)))
    }, 2000)
  }

  return (
    <div
      className="confetti-stage"
      onClick={shootConfetti}
    >
      <motion.div
        className="cannon-icon"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9, rotate: -45 }}
      >
        🎉
      </motion.div>

      <AnimatePresence>
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="confetti-particle"
            style={{
              background: particle.color,
              left: particle.x,
              top: particle.y
            }}
            initial={{
              scale: 0,
              rotate: particle.rotation,
              opacity: 1
            }}
            animate={{
              scale: [0, 1.5, 1],
              y: [0, -200 - Math.random() * 200],
              x: [(Math.random() - 0.5) * 300],
              rotate: particle.rotation + 360,
              opacity: [1, 1, 0]
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2,
              ease: "easeOut"
            }}
          />
        ))}
      </AnimatePresence>

      <p className="cannon-instruction">
        Clique para jogar confetti!
      </p>
    </div>
  )
}
```

### Content Strategy

**Act 1: The Invitation**
```
[Full-screen envelope with botanical frame]

VOCÊ TEM UM CONVITE ESPECIAL

[Wax seal with H&Y monogram]

👆 Clique no selo para abrir
```

**Envelope Interior (after opening):**
```
[Elegant invitation card design]

Hel & Ylana
CONVIDAM VOCÊ PARA O DIA MAIS ESPECIAL

1000 dias de amor viram para sempre

Digite seu nome para personalizar seu convite:

[Search bar: "Seu nome completo..."]
```

**Act 2: Personalized Story - Family Example**
```
[Header with heart icon]

👨‍👩‍👧‍👦

VOCÊ É FAMÍLIA

Nossa base. Nossa força.

[Photo gallery: 6 family moments]

[Days counter]
10,950
dias de família

Desde sempre você está ao nosso lado.
Este dia não seria o mesmo sem você.

A família que escolhemos. A família que nos escolheu.
Obrigado por cada abraço, cada conselho, cada momento.

[CTA: "Confirmar Presença ↓"]
```

**Act 2: Personalized Story - Best Friend Example**
```
[Header with sparkle icon]

💕

VOCÊ ESTEVE LÁ

Desde o primeiro 'oi'

[Photo gallery: Moments with friend]

[Timeline visualization]
Dia 1 → Dia 487 → Dia 850 → Dia 1000
(First meet) (Trip) (Proposal) (Wedding)

2,847
dias de amizade

Você viu o começo. Você esteve nos altos e baixos.
Você é parte fundamental desta história.

Do primeiro "ela é legal" até o "eu te amo",
você estava lá. E queremos você no nosso "sim".

[CTA: "Confirmar Presença ↓"]
```

**Act 3: The Big Question**
```
[Dramatic full-screen]

ENTÃO...

VAI OU NÃO VAI?

[Two large buttons side-by-side]

[Left button - Green glow]
💚 SIM, VOU!
Mal posso esperar!

[Right button - Gentle gray]
💙 NÃO POSSO
Vou sentir saudade
```

**RSVP Form (if YES):**
```
[Elegant form with sections]

PERFEITO! QUEREMOS SABER MAIS...

━━━━━━━━━━━━━━━━━━━

👥 ACOMPANHANTES
Quantas pessoas vêm com você?

[Visual stepper with photos]
[- | 0 | +]

━━━━━━━━━━━━━━━━━━━

🍽️ RESTRIÇÕES ALIMENTARES
Queremos que você se sinta em casa

[Textarea with placeholder]
"Vegetariano, vegano, alergias..."

━━━━━━━━━━━━━━━━━━━

🎵 TRILHA SONORA
Que música não pode faltar na pista?

[Textarea with music note icon]
"Aquela que te faz dançar..."

━━━━━━━━━━━━━━━━━━━

💌 PALAVRAS PARA OS NOIVOS
Escreva algo do coração

[Textarea with heart icon]
"Seus pensamentos..."

━━━━━━━━━━━━━━━━━━━

🎥 MENSAGEM EM VÍDEO (OPCIONAL)
Grave uma mensagem especial!

[Button: "Gravar Mensagem" | "Pular"]

━━━━━━━━━━━━━━━━━━━

[Submit button with loading hearts]
✨ Confirmar Minha Presença ✨
```

**Celebration Finale:**
```
[Interactive confetti stage]

🎉 VOCÊ CONFIRMOU! 🎉

[Animated name in calligraphy]
[Guest Name]

[Confetti cannon icon]
👆 Clique para celebrar!

━━━━━━━━━━━━━━━━━━━

PRÓXIMOS PASSOS:

[Floating cards with icons]

📅 SALVE A DATA
20 de Novembro, 2025 • 10h30
[Botão: Adicionar ao Calendário]

📍 CONHEÇA O LOCAL
Constable Galerie, Fortaleza
[Botão: Ver Mapa]

🎁 LISTA DE PRESENTES
Ajude a construir nosso lar
[Botão: Ver Presentes]

📖 NOSSA HISTÓRIA
Do dia 1 ao dia 1000
[Botão: Ler História]

━━━━━━━━━━━━━━━━━━━

COMPARTILHE A ALEGRIA

[QR Code]
Escaneie para compartilhar

[WhatsApp button]
Convide seus amigos!
```

**Decline Message (if NO):**
```
[Gentle, understanding design]

💙

ENTENDEMOS

A vida tem seus momentos,
e respeitamos o seu.

Mesmo de longe, você é importante para nós.

━━━━━━━━━━━━━━━━━━━

VOCÊ AINDA PODE:

📖 Conhecer Nossa História
[Botão: Ler]

🎁 Enviar um Presente
[Botão: Ver Lista]

💌 Deixar Uma Mensagem
[Textarea]

━━━━━━━━━━━━━━━━━━━

Obrigado por fazer parte da nossa jornada,
mesmo à distância.

Com amor,
Hel & Ylana 💕
```

### Photo/Video Integration

**Required Media:**
```javascript
const mediaAssets = {
  // Act 1: Invitation
  envelope: {
    illustration: '/illustrations/envelope.svg',
    waxSeal: '/illustrations/wax-seal.svg',
    invitationCard: '/images/invitation-card.jpg'
  },

  // Act 2: Personalized Stories
  relationships: {
    family: [
      '/images/family-gathering.jpg',
      '/images/family-celebration.jpg',
      '/images/childhood-memory.jpg',
      '/images/family-dinner.jpg',
      '/images/holiday-together.jpg',
      '/images/family-hug.jpg'
    ],
    best_friend: [
      '/images/first-meeting.jpg',
      '/images/road-trip.jpg',
      '/images/graduation.jpg',
      '/images/late-night-talks.jpg',
      '/images/proposal-celebration.jpg',
      '/images/recent-hangout.jpg'
    ],
    friend: [
      '/images/group-photo.jpg',
      '/images/party-moment.jpg',
      '/images/coffee-chat.jpg'
    ],
    colleague: [
      '/images/office-celebration.jpg',
      '/images/team-event.jpg',
      '/images/after-work-drinks.jpg'
    ]
  },

  // Act 3: Form backgrounds
  formBackgrounds: {
    plusOnes: '/images/group-celebration-blur.jpg',
    dietary: '/images/food-spread-blur.jpg',
    songs: '/images/dance-floor-blur.jpg',
    message: '/images/intimate-couple-blur.jpg'
  },

  // Celebration
  celebration: {
    video: '/videos/thank-you-message.mp4',
    staticImage: '/images/celebration-kiss.jpg',
    confettiGif: '/animations/confetti.gif'
  },

  // Parallax backgrounds
  parallax: {
    layer1: '/images/botanical-front.png',
    layer2: '/images/couple-mid.jpg',
    layer3: '/images/botanical-back.png'
  }
}
```

**Dynamic Photo Loading:**
```javascript
// Load photos based on guest tags
const useGuestPhotos = (guestId: string, relationship: string) => {
  const [photos, setPhotos] = useState<string[]>([])

  useEffect(() => {
    const fetchPhotos = async () => {
      const query = groq`
        *[_type == "storyMoment" &&
          (tags[]->id match "${guestId}" ||
           category == "${relationship}") &&
          defined(image.asset)
        ] {
          "url": image.asset->url,
          "alt": image.alt,
          displayOrder
        } | order(displayOrder asc) [0...6]
      `

      const result = await sanityClient.fetch(query)
      setPhotos(result.map(r => r.url))
    }

    fetchPhotos()
  }, [guestId, relationship])

  return photos
}
```

### Mobile Adaptations

**Responsive Layout:**
```css
@media (max-width: 768px) {
  /* Act 1: Envelope */
  .envelope-container {
    padding: 24px;
    scale: 0.8; /* Fit on smaller screens */
  }

  .wax-seal {
    width: 80px;
    height: 80px;
    /* Larger touch target */
  }

  /* Act 2: Story */
  .personalized-story {
    padding: 48px 24px;
  }

  .story-photos {
    grid-template-columns: repeat(2, 1fr);
    /* 2 columns instead of 3 */
  }

  .days-number {
    font-size: 72px;
    /* Slightly smaller */
  }

  /* Act 3: Form */
  .rsvp-form {
    padding: 32px 24px;
  }

  .form-section {
    margin-bottom: 40px;
  }

  /* Video recorder */
  .camera-preview {
    max-height: 50vh;
    /* Don't take full screen */
  }

  /* Confetti cannon */
  .confetti-stage {
    height: 60vh;
    /* Shorter on mobile */
  }

  /* Success cards */
  .next-steps-cards {
    grid-template-columns: 1fr;
    /* Stack vertically */
  }
}

/* Landscape mobile */
@media (max-width: 896px) and (orientation: landscape) {
  .envelope-container {
    scale: 0.6;
    /* Even smaller in landscape */
  }

  .personalized-story {
    padding: 32px 24px;
  }

  section {
    min-height: auto;
    /* Don't force 100vh */
  }
}
```

**Mobile-Specific Interactions:**
```javascript
// Touch gestures
const useTouchGestures = () => {
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY)
  }

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 150) {
      // Swiped up - go to next act
      nextAct()
    }

    if (touchStart - touchEnd < -150) {
      // Swiped down - go to previous act
      previousAct()
    }
  }

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  }
}

// Haptic feedback for interactions
const hapticFeedback = (type: 'light' | 'medium' | 'heavy') => {
  if ('vibrate' in navigator) {
    const patterns = {
      light: 10,
      medium: 20,
      heavy: 30
    }
    navigator.vibrate(patterns[type])
  }
}

// Use in envelope seal break
const breakSeal = () => {
  hapticFeedback('medium')
  setSealBroken(true)
  // ... rest of animation
}
```

**Progressive Enhancement:**
```javascript
// Feature detection
const features = {
  hasCamera: 'mediaDevices' in navigator,
  hasVibration: 'vibrate' in navigator,
  hasWebGL: (() => {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
  })()
}

// Conditionally render features
{features.hasCamera && (
  <VideoMessageRecorder />
)}

{features.hasWebGL ? (
  <WebGLConfetti />
) : (
  <CSSConfetti />
)}
```

### Component Breakdown

```tsx
// Main Component Structure
<RSVPInteractiveExperience>
  <ProgressIndicator /> // Dots showing act 1/2/3

  {/* ACT 1: THE INVITATION */}
  <section className="act act-1">
    <BotanicalFrame />
    <EnvelopeUnwrap
      onComplete={() => setCurrentAct(2)}
    >
      <WaxSeal />
      <EnvelopeFlap />
      <InvitationCard>
        <SearchSection />
      </InvitationCard>
    </EnvelopeUnwrap>
  </section>

  {/* ACT 2: YOUR STORY */}
  <section className="act act-2">
    <ParallaxBackground />
    <PersonalizedStory
      guest={selectedGuest}
      relationship={guestRelationship}
      photos={guestPhotos}
      onContinue={() => setCurrentAct(3)}
    />
  </section>

  {/* ACT 3: THE RESPONSE */}
  <section className="act act-3">
    <TheQuestion
      onYes={() => setShowForm(true)}
      onNo={() => setShowDeclineMessage(true)}
    />

    <AnimatePresence>
      {showForm && (
        <RSVPInteractiveForm
          guest={selectedGuest}
          onSubmit={handleSubmit}
        >
          <FormSection name="plusOnes">
            <PlusOnesStepper />
          </FormSection>

          <FormSection name="dietary">
            <DietaryTextarea />
          </FormSection>

          <FormSection name="songs">
            <SongRequestTextarea />
          </FormSection>

          <FormSection name="message">
            <MessageTextarea />
          </FormSection>

          <FormSection name="video" optional>
            <VideoMessageRecorder />
          </FormSection>

          <SubmitButton />
        </RSVPInteractiveForm>
      )}
    </AnimatePresence>

    <AnimatePresence>
      {showSuccess && (
        <CelebrationFinale
          guest={selectedGuest}
        >
          <ConfettiCannon />
          <FloatingHearts />
          <ThankYouMessage />
          <NextStepsCards />
          <ShareSection />
        </CelebrationFinale>
      )}
    </AnimatePresence>
  </section>
</RSVPInteractiveExperience>
```

**New Components to Build:**
1. `EnvelopeUnwrap.tsx` - Animated envelope opening
2. `WaxSeal.tsx` - Interactive seal with break effect
3. `ParallaxBackground.tsx` - Layered background with depth
4. `PersonalizedStory.tsx` - Dynamic story generation
5. `TheQuestion.tsx` - Dramatic yes/no choice
6. `RSVPInteractiveForm.tsx` - Multi-step form with animations
7. `VideoMessageRecorder.tsx` - Camera integration
8. `ConfettiCannon.tsx` - Interactive particle system
9. `FloatingHearts.tsx` - Celebration animation
10. `ThankYouMessage.tsx` - Personalized confirmation
11. `ProgressIndicator.tsx` - Act navigation dots
12. `FormSection.tsx` - Reusable form milestone

### Technical Considerations

**3D Transformations:**
```css
/* Envelope flap with 3D effect */
.envelope-flap {
  transform-style: preserve-3d;
  transform-origin: top center;
  backface-visibility: hidden;
  perspective: 1000px;
}

.envelope-flap-inner {
  transform: translateZ(10px);
}

/* Parallax layers */
.parallax-container {
  perspective: 1000px;
  transform-style: preserve-3d;
}

.parallax-layer {
  position: absolute;
  inset: 0;
}

.parallax-layer-1 {
  transform: translateZ(0px);
}

.parallax-layer-2 {
  transform: translateZ(-50px) scale(1.05);
}

.parallax-layer-3 {
  transform: translateZ(-100px) scale(1.1);
}
```

**Parallax Scroll Effect:**
```javascript
const useParallax = () => {
  const { scrollYProgress } = useScroll()

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150])

  const scale1 = useTransform(scrollYProgress, [0, 1], [1, 1.05])
  const scale2 = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  const opacity1 = useTransform(scrollYProgress, [0.7, 1], [1, 0])

  return { y1, y2, y3, scale1, scale2, opacity1 }
}

// Use in component
<motion.div style={{ y: y1, scale: scale1, opacity: opacity1 }}>
  <Image src="/layer1.png" />
</motion.div>
```

**Camera API Integration:**
```javascript
// Check camera permission
const checkCameraPermission = async () => {
  try {
    const result = await navigator.permissions.query({
      name: 'camera' as PermissionName
    })

    if (result.state === 'granted') {
      return true
    } else if (result.state === 'prompt') {
      // Will prompt user
      return 'prompt'
    } else {
      return false
    }
  } catch (error) {
    // Permissions API not supported
    return 'unknown'
  }
}

// Request with fallback
const requestCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: true
    })
    return stream
  } catch (error) {
    if (error.name === 'NotAllowedError') {
      alert('Precisamos de permissão da câmera!')
    } else if (error.name === 'NotFoundError') {
      alert('Câmera não encontrada no dispositivo')
    }
    return null
  }
}
```

**Confetti Particle System:**
```javascript
// Canvas-based confetti (better performance)
const CanvasConfetti = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])

  class Particle {
    x: number
    y: number
    vx: number
    vy: number
    color: string
    rotation: number
    rotationSpeed: number

    constructor(x: number, y: number) {
      this.x = x
      this.y = y
      this.vx = (Math.random() - 0.5) * 10
      this.vy = -Math.random() * 15 - 5
      this.color = ['#A8A8A8', '#E8E6E3', '#C5C5C5'][Math.floor(Math.random() * 3)]
      this.rotation = Math.random() * 360
      this.rotationSpeed = (Math.random() - 0.5) * 10
    }

    update() {
      this.x += this.vx
      this.y += this.vy
      this.vy += 0.5 // Gravity
      this.rotation += this.rotationSpeed
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.save()
      ctx.translate(this.x, this.y)
      ctx.rotate((this.rotation * Math.PI) / 180)
      ctx.fillStyle = this.color
      ctx.fillRect(-5, -5, 10, 10)
      ctx.restore()
    }
  }

  const animate = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particles.current = particles.current.filter(particle => {
      particle.update()
      particle.draw(ctx)
      return particle.y < canvas.height
    })

    requestAnimationFrame(animate)
  }

  const shoot = (x: number, y: number) => {
    for (let i = 0; i < 30; i++) {
      particles.current.push(new Particle(x, y))
    }
  }

  useEffect(() => {
    animate()
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      onClick={(e) => shoot(e.clientX, e.clientY)}
    />
  )
}
```

**Performance Optimizations:**
1. Use `will-change: transform` for animated elements
2. Lazy load Act 2 and Act 3 content
3. Compress envelope illustration (SVG optimize)
4. Use WebP for photos with JPEG fallback
5. Implement virtual scrolling for large photo galleries
6. Debounce parallax calculations (16ms)
7. Use CSS animations for simple effects
8. Preload critical images in Act 1
9. Lazy load video recorder library
10. Use canvas for confetti (better than DOM particles)

---

## Implementation Priority Recommendation

**Quick Win (1-2 days):** Concept 1 - Immersive Gallery Journey
- Reuses existing VideoHeroSection component
- Simpler state management
- Fewer new components
- Beautiful results quickly

**Medium Effort (3-4 days):** Concept 2 - Story-Driven RSVP
- Requires video production
- More content organization
- Good storytelling potential
- Progressive enhancement

**High Impact (5-7 days):** Concept 3 - Interactive Experience
- Most innovative and memorable
- Requires most new components
- Camera integration adds complexity
- Best for TikTok/social sharing

**Hybrid Approach:**
Start with Concept 1 foundation, add Concept 2's timeline storytelling, and sprinkle Concept 3's interactive elements (confetti, video message) as enhancements.

---

## Next Steps

1. **Choose Concept** or create hybrid
2. **Content Audit**: Identify photos/videos needed
3. **Component Build Order**: Start with core, add delight
4. **Test Mobile First**: Touch interactions critical
5. **Progressive Enhancement**: Ensure fallbacks work
6. **Accessibility**: WCAG 2.1 AA compliance
7. **Performance**: Lighthouse score 90+

Each concept transforms the boring RSVP into an **emotional experience** that guests will remember and share. The key is balancing beauty with usability - stunning visuals that don't sacrifice form functionality.
