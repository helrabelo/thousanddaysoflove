# Implementation Roadmap: Thousand Days of Love Website Transformation

## Executive Summary

This roadmap transforms the wedding website from a text-heavy template into a DTF-inspired cinematic storytelling experience within **3-4 weeks** before the November 20, 2025 wedding. The transformation is organized into **4 weekly sprints**, each with clear deliverables, dependencies, and success criteria.

### The Transformation Plan

**Current State**: Template-like design with duplicated content across 8 pages, text-heavy cards, unclear information architecture, and minimal visual storytelling. Guests must visit 3-4 pages to understand the complete story, causing confusion and drop-offs.

**Target State**: Cinematic 6-page experience with full-bleed video heroes, immersive timeline moments, optimized content flow, and authentic visual storytelling. Each page serves a unique purpose with zero duplication. Expected RSVP conversion improvement from 50-60% to 80-85%.

**Critical Success Factors**:
1. **Week 1 IA fixes** unlock all subsequent work (remove duplicates, merge pages)
2. **Content gathering runs parallel** to development throughout all weeks
3. **Phased approach** allows early launch with progressive enhancement
4. **Mobile-first** given 70-80% of guests will browse on phones

---

## 1. Prioritization Framework

### Impact vs Effort Matrix

```
HIGH IMPACT, LOW EFFORT (Week 1 - DO FIRST) 🔴
┌────────────────────────────────────────────────────┐
│ • Remove AboutUsSection from /historia (30 min)    │
│ • Add post-RSVP guidance (3-4 hrs)                 │
│ • Investigate /convite purpose (1 hr)              │
└────────────────────────────────────────────────────┘

HIGH IMPACT, MEDIUM EFFORT (Week 1-2 - CRITICAL) 🔴
┌────────────────────────────────────────────────────┐
│ • Consolidate StoryTimeline (remove from gallery)  │
│ • Merge /local + /informacoes → /detalhes          │
│ • Build VideoHero component                        │
│ • Organize existing photos by timeline             │
└────────────────────────────────────────────────────┘

HIGH IMPACT, HIGH EFFORT (Week 2-3 - IMPORTANT) 🟡
┌────────────────────────────────────────────────────┐
│ • Homepage video hero implementation               │
│ • Timeline transformation (full-bleed moments)     │
│ • Pet portrait photo session + gallery             │
│ • Gallery year organization (200-250 photos)       │
└────────────────────────────────────────────────────┘

MEDIUM IMPACT, ANY EFFORT (Week 3-4 - POLISH) 🟢
┌────────────────────────────────────────────────────┐
│ • Gift registry hero (apartment photo)             │
│ • RSVP hero (celebration moment)                   │
│ • Venue showcase transformation                    │
│ • Animation polish across all pages                │
└────────────────────────────────────────────────────┘
```

### Priority Criteria

**P0 (Blockers)**: Must complete before anything else works
- IA fixes (duplicates, page merges)
- Component library foundation
- Critical content selection (hero video/photos)

**P1 (Core Value)**: Defines the transformation success
- Homepage video hero
- Timeline full-bleed moments
- Pet portraits gallery
- Mobile responsiveness

**P2 (Enhancement)**: Improves but doesn't define experience
- Supporting page heroes
- Animation refinement
- Performance optimization
- Analytics tracking

**P3 (Nice-to-have)**: Can launch without
- Video compilations
- Advanced animations
- A/B testing setup

---

## 2. Dependency Mapping

### Critical Path Analysis

```
WEEK 1 FOUNDATION
┌──────────────────────────────────────────────────────────┐
│ IA FIXES (Parallel Track A)                              │
│ ├─ Remove AboutUsSection → Unblocks /historia            │
│ ├─ Remove StoryTimeline from /galeria → Clarifies pages  │
│ ├─ Merge /local + /informacoes → Simplifies nav          │
│ └─ Add post-RSVP guidance → Completes user flow          │
│                                                           │
│ COMPONENT LIBRARY (Parallel Track B)                     │
│ ├─ Build VideoHero → BLOCKS homepage transformation      │
│ ├─ Build ImageHero → BLOCKS timeline & supporting pages  │
│ └─ Build HorizontalScrollGallery → BLOCKS pet section    │
│                                                           │
│ CONTENT ORGANIZATION (Parallel Track C)                  │
│ ├─ Organize existing photos → Enables selection          │
│ ├─ Find proposal photos → Critical for timeline          │
│ └─ Select homepage hero content → Blocks Week 2 dev      │
└──────────────────────────────────────────────────────────┘
           ↓
Week 1 Completion Gates:
✓ Navigation reduced from 8 → 6 pages
✓ Zero content duplication
✓ VideoHero component functional
✓ Homepage hero content selected

WEEK 2 HOMEPAGE TRANSFORMATION
┌──────────────────────────────────────────────────────────┐
│ DEPENDS ON: VideoHero component + hero content selected  │
│                                                           │
│ DEVELOPMENT (Track A)                                    │
│ ├─ Implement homepage VideoHero → Core experience        │
│ ├─ Redesign Event Details → Clean info display           │
│ ├─ Build Story Preview split section → Teaser content    │
│ └─ Implement pet horizontal scroll → Character intro     │
│                                                           │
│ CONTENT GATHERING (Track B - PARALLEL)                   │
│ ├─ Pet portrait photo session → BLOCKS pet gallery       │
│ ├─ Select 4-5 timeline preview photos → Story cards      │
│ └─ Apartment dream photo → Gift registry hero            │
│                                                           │
│ UNBLOCKS: Homepage goes live, timeline work can begin    │
└──────────────────────────────────────────────────────────┘
           ↓
Week 2 Completion Gates:
✓ Homepage fully transformed with video hero
✓ Pet portraits captured (4 individual shots)
✓ Mobile responsive homepage

WEEK 3 STORY & GALLERY DEPTH
┌──────────────────────────────────────────────────────────┐
│ DEPENDS ON: ImageHero component + timeline photo org     │
│                                                           │
│ DEVELOPMENT (Track A)                                    │
│ ├─ Transform /historia timeline → Full-bleed moments     │
│ ├─ Build TimelineMomentCard → Immersive storytelling     │
│ ├─ Add year transitions to gallery → Visual flow         │
│ └─ Enhance StoryTimeline component → Better UX           │
│                                                           │
│ CONTENT CURATION (Track B - PARALLEL)                    │
│ ├─ Organize gallery photos by year → 200-250 selection   │
│ ├─ Select 8-10 key timeline moments → Full story         │
│ ├─ Write timeline captions → Narrative depth             │
│ └─ Find year transition photos → Section breaks          │
│                                                           │
│ UNBLOCKS: Complete story experience ready                │
└──────────────────────────────────────────────────────────┘
           ↓
Week 3 Completion Gates:
✓ Timeline with 8-10 full-bleed moments
✓ Gallery organized by year with transitions
✓ Complete visual narrative

WEEK 4 SUPPORTING PAGES & POLISH
┌──────────────────────────────────────────────────────────┐
│ DEPENDS ON: All core components + content complete       │
│                                                           │
│ DEVELOPMENT (Track A)                                    │
│ ├─ Gift registry hero (apartment) → Emotional context    │
│ ├─ RSVP hero (celebration) → Welcoming feel              │
│ ├─ Venue showcase hero → Excitement building             │
│ └─ Global animation polish → Smooth experience           │
│                                                           │
│ TESTING & OPTIMIZATION (Track B)                         │
│ ├─ End-to-end user journey testing → Quality assurance   │
│ ├─ Accessibility audit → WCAG compliance                 │
│ ├─ Performance optimization → Fast load times            │
│ └─ Cross-browser/device testing → Universal access       │
│                                                           │
│ RESULT: Production-ready website                         │
└──────────────────────────────────────────────────────────┘
```

### Parallel Work Streams

**Can Run Simultaneously**:
- IA fixes + component building + content organization (Week 1)
- Homepage development + pet photo session (Week 2)
- Timeline development + gallery photo curation (Week 3)
- Supporting page heroes + testing/optimization (Week 4)

**Sequential Dependencies**:
- VideoHero component MUST exist before homepage implementation
- Homepage hero content MUST be selected before development begins
- Pet portraits MUST be captured before gallery can be built
- Timeline photos MUST be organized before moments can be created
- Core pages MUST be complete before polish phase

**Content Blockers**:
- **Homepage hero video/photo**: Blocks all Week 2 homepage work
- **Pet portraits (4 photos)**: Blocks pet gallery implementation
- **Proposal photos**: Blocks timeline emotional peak
- **Timeline photos (8-10)**: Blocks /historia transformation
- **Gallery photos (200-250)**: Blocks /galeria organization

---

## 3. Week-by-Week Sprint Plans

### WEEK 1: Critical Fixes + Foundation (Nov 20-27)
**Sprint Goal**: Eliminate content duplication, simplify IA, build component foundation

**Total Time**: 20-25 hours
**Team**: 1 developer + couple (content decisions)
**Success Criteria**: Zero duplicates, 6-page navigation, components ready

#### Monday-Tuesday: IA Quick Wins (6-8 hours)

**Task 1.1: Remove AboutUsSection from /historia** ⚡ QUICK WIN
```
File: src/app/historia/page.tsx
Action: Delete <AboutUsSection /> component
Time: 30 minutes
Priority: P0 (blocks clarity)
Dependencies: None
Deliverable: /historia page no longer duplicates homepage
```

**Task 1.2: Remove StoryTimeline from /galeria** ⚡ QUICK WIN
```
File: src/app/galeria/page.tsx
Action: Delete <StoryTimeline /> component
Add: Timeline phase filters (organization, not duplication)
Time: 4-6 hours
Priority: P0 (blocks page clarity)
Dependencies: None
Deliverable: Gallery becomes pure visual storytelling
```

**Task 1.3: Investigate /convite purpose**
```
Action: Audit WeddingInvitation component usage
Decision: Keep (with clear purpose), remove (duplicate), or repurpose
Time: 1 hour investigation + 2-3 hours implementation
Priority: P0 (blocks navigation clarity)
Dependencies: Couple input on purpose
Deliverable: Clear decision on /convite fate
```

#### Wednesday-Thursday: Page Consolidation (8-10 hours)

**Task 1.4: Merge /local + /informacoes → /detalhes**
```
Files:
- Create: src/app/detalhes/page.tsx
- Merge content from: /local and /informacoes
- Setup redirects: /local → /detalhes#localizacao

Structure:
1. Hero: "Tudo Sobre o Grande Dia"
2. Section: Local & Localização (from /local)
3. Section: Programação do Dia
4. Section: Dress Code & Clima
5. Section: Estacionamento & Transporte
6. Section: Hospedagem
7. Section: FAQ (from /informacoes)
8. Section: Contato

Time: 6-8 hours
Priority: P0 (major IA simplification)
Dependencies: Content review with couple
Deliverable: Single comprehensive details page
```

**Task 1.5: Update Navigation**
```
File: Navigation component
Update labels: Remove "Local" + "Informações", add "Detalhes"
Order: Início → História → Galeria → Presentes → RSVP → Detalhes
Time: 1 hour
Priority: P0 (reflects new IA)
Dependencies: Page merge complete
Deliverable: Clean 6-page navigation
```

#### Friday: Post-RSVP Flow + Component Foundation (6-8 hours)

**Task 1.6: Add Post-RSVP Guidance**
```
File: Create src/components/rsvp/PostRSVPSuccess.tsx
Content:
- "Confirmado! Mal podemos esperar"
- Next steps:
  - Save to calendar button
  - View location/directions link
  - Optional: Check gift registry
  - Share with your group (WhatsApp)
- Emotional close

Time: 3-4 hours
Priority: P0 (critical conversion optimization)
Dependencies: None
Deliverable: Complete RSVP user flow
```

**Task 1.7: Build VideoHero Component**
```
File: Create src/components/ui/VideoHero.tsx
Features:
- Full-bleed video background (multiple heights)
- Gradient overlay options
- Poster image loading state
- Fallback for reduced motion
- Responsive mobile/desktop videos
- Content positioning system
- Scroll indicator

Time: 6-8 hours
Priority: P0 (blocks homepage transformation)
Dependencies: None
Deliverable: Reusable VideoHero component
```

**Task 1.8: Build ImageHero Component**
```
File: Create src/components/ui/ImageHero.tsx
Features:
- Full-bleed image backgrounds
- Parallax scroll effects
- Ken Burns zoom animation
- Multiple height variants
- Gradient overlay options
- Content positioning

Time: 4-6 hours
Priority: P0 (blocks timeline & supporting pages)
Dependencies: None
Deliverable: Reusable ImageHero component
```

#### Weekend: Content Organization (2-3 hours)

**Task 1.9: Organize Existing Photos**
```
Action: Sort all photos into folders
Structure:
├── 2023-beginning/
├── 2024-building-home/
├── 2025-wedding-year/
├── timeline-moments/ (critical 15-20)
└── pets/ (4 individual + group shots)

Time: 2-3 hours
Priority: P1 (enables Week 2-3 work)
Dependencies: Couple's photo library access
Deliverable: Organized photo structure
```

**Task 1.10: Select Homepage Hero Content**
```
Decision: Choose THE video or photo for homepage hero
Options:
1. Candid home video (15 sec) - BEST
2. High-res couple photo at home
3. Ken Burns slideshow from photos

Time: 1-2 hours (includes test shoot if needed)
Priority: P0 (BLOCKS Week 2 homepage work)
Dependencies: Couple availability for shoot
Deliverable: Selected homepage hero content
```

**Week 1 Deliverables Checklist**:
- [ ] ✅ AboutUsSection removed from /historia
- [ ] ✅ StoryTimeline removed from /galeria
- [ ] ✅ /local + /informacoes merged into /detalhes
- [ ] ✅ Navigation updated (6 pages)
- [ ] ✅ Post-RSVP guidance added
- [ ] ✅ /convite purpose decided
- [ ] ✅ VideoHero component built & tested
- [ ] ✅ ImageHero component built & tested
- [ ] ✅ Photos organized into folders
- [ ] ✅ Homepage hero content selected
- [ ] ✅ Zero content duplication site-wide
- [ ] ✅ Clean git commits with clear messages

**Week 1 Success Metrics**:
- Navigation reduced from 8 → 6 pages ✓
- Zero content duplication ✓
- Component library foundation ready ✓
- Homepage hero content selected ✓
- Estimated RSVP improvement: +20-30% from IA fixes alone

---

### WEEK 2: Homepage Transformation (Nov 27 - Dec 4)
**Sprint Goal**: Implement cinematic homepage with video hero and pet gallery

**Total Time**: 25-30 hours
**Team**: 1 developer + photographer (pet session)
**Success Criteria**: Homepage fully transformed, pet portraits captured, mobile-ready

#### Monday-Tuesday: Video Hero Implementation (10-12 hours)

**Task 2.1: Implement Homepage VideoHero**
```
File: src/app/page.tsx
Implementation:
- Replace static HeroSection with VideoHero
- Integrate selected video/photo from Week 1
- Add monogram (H ♥ Y in Cormorant)
- Add names (HEL & YLANA in Playfair)
- Add tagline ("1000 dias. Sim, a gente fez a conta.")
- Add date badge (glass morphism)
- Add CTAs (RSVP + Nossa História)
- Add scroll indicator animation

Video Optimization:
- Desktop: 1920x1080 @ 30fps, <5MB
- Mobile: 1280x720 @ 24fps, <3MB
- Poster image: WebP format
- Fallback: Static image for reduced motion

Time: 8-10 hours
Priority: P1 (core transformation)
Dependencies: Week 1 VideoHero component + selected content
Deliverable: Cinematic homepage hero
```

**Task 2.2: Redesign Event Details Section**
```
File: Homepage Event Details component
Changes:
- Add prominent countdown timer
- 3-column grid (Date | Time | Location)
- Icon styling (Calendar, Clock, Map)
- Glass card effects
- Responsive stacking on mobile

Time: 4-6 hours
Priority: P1 (completes homepage)
Dependencies: None
Deliverable: Clean event details display
```

#### Wednesday: Story Preview Section (6-8 hours)

**Task 2.3: Build Story Preview Split Section**
```
File: Homepage Story Preview
Implementation:
- Use SplitSection component
- Left: Proposal photo (sticky scroll)
- Right: Story teaser content
  - Quote: "Do 'oi' ao altar..."
  - Preview: First 2-3 paragraphs
  - CTA: "Ver História Completa →"

Photo Selection:
- Proposal moment (if available)
- OR early dating photo showing connection
- 1200x1600px portrait orientation

Time: 4-6 hours
Priority: P1 (drives /historia traffic)
Dependencies: SplitSection component (Week 1)
Deliverable: Compelling story teaser
```

**Task 2.4: Select Timeline Preview Photos**
```
Action: Choose 4-5 photos for story preview cards
Moments:
1. First "oi" era (WhatsApp/Tinder)
2. Early dating (Casa Fontana)
3. Casa própria (apartment)
4. Family complete (4 dogs)
5. Proposal (Icaraí)

Time: 1-2 hours
Priority: P1 (content for preview)
Dependencies: Week 1 photo organization
Deliverable: Selected preview photos
```

#### Thursday-Friday: Pet Gallery (8-10 hours)

**Task 2.5: Pet Portrait Photo Session** 📸 CRITICAL CONTENT
```
Action: Capture 4 individual pet portraits + 1 group shot
Setup:
- Natural window light in apartment
- Individual sessions (15 min each)
- Capture personality:
  - Linda: Regal, composed (throne spot)
  - Cacao: Energetic, mid-bark
  - Olivia: Calm, gentle pose
  - Oliver: Playful, action shot
- Group chaos shot (bonus)

Equipment:
- Smartphone OK (recent iPhone/Android)
- OR: Budget photographer ($200-300)
- Portrait mode for subject isolation

Time: 2-3 hours shoot + 1 hour selection
Priority: P0 (BLOCKS pet gallery)
Dependencies: Couple + pets availability
Deliverable: 4 hero pet portraits (800x1000px)
```

**Task 2.6: Build Pet Horizontal Scroll Gallery**
```
File: Homepage Pet Gallery section
Implementation:
- Use HorizontalScrollGallery component
- 4 cards (Linda, Cacao, Olivia, Oliver)
- Each card:
  - Hero portrait as background
  - Gradient overlay (bottom dark)
  - Name + emoji (title)
  - Personality description (overlay text)
  - 60vw width desktop, 85vw mobile
  - 4:5 aspect ratio (portrait)
- Snap scroll behavior
- Navigation dots

Time: 6-8 hours
Priority: P1 (unique differentiator)
Dependencies: Task 2.5 pet portraits
Deliverable: Swipeable pet character gallery
```

#### Weekend: Testing & Optimization (4-6 hours)

**Task 2.7: Cross-Browser Testing**
```
Browsers: Chrome, Safari, Firefox, Edge
Devices: Desktop, tablet, mobile
Test:
- Video autoplay works
- Scroll animations smooth
- Pet gallery swipes correctly
- CTAs functional
- Text readable on all backgrounds

Time: 2 hours
Priority: P1 (quality assurance)
Dependencies: Homepage complete
Deliverable: Bug list + fixes
```

**Task 2.8: Mobile Responsiveness**
```
Focus Areas:
- Video hero: 60vh height on mobile
- Static image instead of video (battery/data)
- Single-column event details
- Pet gallery: 85vw cards (full swipe)
- Touch target sizing (44px minimum)
- Text scaling (clamp() functions)

Time: 2 hours
Priority: P0 (70-80% mobile traffic)
Dependencies: Homepage complete
Deliverable: Perfect mobile experience
```

**Task 2.9: Performance Optimization**
```
Actions:
- Compress video files (Handbrake)
- Convert images to WebP
- Lazy load below-fold content
- Preload critical assets
- Add loading states
- Test on 3G connection

Targets:
- Homepage LCP: <2.5s
- CLS: <0.1
- FID: <100ms

Time: 2-3 hours
Priority: P1 (user experience)
Dependencies: Homepage complete
Deliverable: Fast load times
```

**Task 2.10: Optional - Apartment Dream Photo**
```
Action: Capture apartment exterior or interior
Use: Gift registry hero (Week 4)
Time: Golden hour exterior shot
OR: Beautiful interior living room

Time: 30 min shoot + selection
Priority: P2 (can defer to Week 3)
Dependencies: None
Deliverable: Apartment photo for later use
```

**Week 2 Deliverables Checklist**:
- [ ] ✅ Homepage VideoHero implemented
- [ ] ✅ Event Details redesigned
- [ ] ✅ Story Preview split section built
- [ ] ✅ Pet portrait session complete (4 photos)
- [ ] ✅ Pet horizontal scroll gallery live
- [ ] ✅ Cross-browser tested & fixed
- [ ] ✅ Mobile responsive (perfect)
- [ ] ✅ Performance optimized (<3s load)
- [ ] ✅ Clean deployment to production

**Week 2 Success Metrics**:
- Homepage fully cinematic ✓
- Video hero autoplay rate: >80% ✓
- Pet gallery engagement: >60% swipe through all 4 ✓
- Mobile experience: Flawless ✓
- Page load time: <3 seconds ✓

---

### WEEK 3: Story + Gallery Pages (Dec 4-11)
**Sprint Goal**: Transform timeline into immersive storytelling, organize gallery by year

**Total Time**: 30-35 hours
**Team**: 1 developer + couple (content curation)
**Success Criteria**: Timeline with 8-10 full-bleed moments, gallery with 200-250 photos

#### Monday-Tuesday: Timeline Transformation (12-15 hours)

**Task 3.1: Build TimelineMomentCard Component**
```
File: Create src/components/timeline/TimelineMomentCard.tsx
Features:
- Full-bleed background (image or video)
- Alternating gradient overlays (left/right)
- Content positioning (opposite side)
- Date badge styling
- Title + description overlay
- Responsive height (80vh desktop, 60vh mobile)
- Scroll-triggered animations

Time: 6-8 hours
Priority: P1 (enables timeline transformation)
Dependencies: ImageHero patterns from Week 1
Deliverable: Reusable timeline moment component
```

**Task 3.2: Select & Organize Timeline Photos**
```
Action: Choose 8-10 KEY timeline moments with photos
Critical Moments:
1. Day 1 - Primeiro "Oi" (WhatsApp screenshot or symbolic)
2. Day 8 - Primeiro Encontro (Casa Fontana or early dating)
3. Day 50 - Ylana with Medicine (caring moment)
4. Day 200 - Linda Arrives (first dog)
5. Day 434 - Casa Própria (apartment exterior - CRITICAL)
6. Day 600 - Cacao Joins (Ylana's choice)
7. Day 700 - Puppies Born (Olivia & Oliver)
8. Day 900 - Icaraí Proposal (MOST IMPORTANT)
9. Day 950 - Wedding Planning
10. Day 1000 - Wedding Day (placeholder/engagement photo)

Photo Requirements:
- Resolution: 2400x1350px minimum
- Well-lit, emotional moments
- Mix of posed + candid
- High quality (will be full-bleed)

Time: 3-4 hours
Priority: P0 (BLOCKS timeline implementation)
Dependencies: Week 1 photo organization
Deliverable: 8-10 selected timeline photos
```

**Task 3.3: Write Timeline Captions**
```
Action: Craft narrative for each timeline moment
Tone: Authentic, intimate, slightly humorous
Length: 80-150 words per moment
Include:
- Date context ("Exatos 434 dias depois...")
- Emotional beat ("Na hora, eu soube...")
- Behind-the-scenes detail ("A gente quase nem respondeu")
- Connection to present ("E hoje...")

Time: 2-3 hours
Priority: P1 (narrative depth)
Dependencies: Timeline moments selected
Deliverable: Written captions for all moments
```

**Task 3.4: Implement Full-Bleed Timeline**
```
File: src/app/historia/page.tsx
Changes:
- Replace card-based timeline with full-bleed moments
- Use TimelineMomentCard component
- Alternate gradient directions (left → right → left)
- Add 80px spacers between moments
- Implement scroll-triggered fade-ins
- Add phase headers:
  - "Os Primeiros Dias" (Day 1-100)
  - "Construindo Juntos" (Day 100-500)
  - "Nossa Família" (Day 500-900)
  - "Caminhando Pro Altar" (Day 900-1000)

Time: 6-8 hours
Priority: P1 (core transformation)
Dependencies: Tasks 3.1, 3.2, 3.3
Deliverable: Immersive timeline experience
```

#### Wednesday-Thursday: Gallery Organization (8-12 hours)

**Task 3.5: Curate Gallery Photos**
```
Action: Select best 200-250 photos across 3 years
Distribution:
- 2023 (Beginning): 30-50 photos
  - First dates, early relationship
  - First travels together
  - Meeting families
  - Linda as puppy
- 2024 (Building Home): 80-120 photos
  - Apartment life
  - Cooking/fitness together
  - Cacao arrival
  - Linda's puppies
  - All 4 dogs together
  - Travels (Búzios, etc.)
- 2025 (Wedding Year): 55-85 photos
  - Proposal photos
  - Engagement moments
  - Wedding prep
  - Recent couple photos

Selection Criteria:
- Best of best (quality over quantity)
- Variety: portraits, candids, locations, pets
- Emotional moments captured
- Mix of posed + spontaneous
- Good lighting and composition

Time: 8-10 hours (couple + developer)
Priority: P1 (completes gallery)
Dependencies: Week 1 photo organization
Deliverable: 200-250 curated gallery photos
```

**Task 3.6: Add Gallery Year Transitions**
```
File: src/app/galeria/page.tsx
Implementation:
- Add year section headers:
  - "2023 - O Começo"
  - "2024 - Construindo Casa"
  - "2025 - O Casamento"
- Transition images between years (optional):
  - Beautiful moment from each year
  - OR: Simple text dividers with botanical accents
- Masonry grid within each year
- Infinite scroll or pagination
- Lightbox for full-size viewing

Time: 4-6 hours
Priority: P1 (organization clarity)
Dependencies: Task 3.5 gallery curation
Deliverable: Organized gallery by timeline
```

**Task 3.7: Enhance StoryTimeline Component**
```
File: Existing StoryTimeline component (used only in /historia now)
Enhancements:
- Better mobile layout
- Larger touch targets
- Improved date formatting
- Media thumbnails (if available)
- Expandable details
- Smooth scroll animations

Time: 4-6 hours
Priority: P2 (polish)
Dependencies: None
Deliverable: Better timeline UX
```

#### Friday: Testing & Polish (4-6 hours)

**Task 3.8: Timeline UX Testing**
```
Test:
- Scroll performance with full-bleed images
- Animation smoothness
- Text readability on all backgrounds
- Mobile swipe gestures
- Loading states
- Image optimization working

Time: 2 hours
Priority: P1 (quality assurance)
Dependencies: Timeline complete
Deliverable: Smooth timeline experience
```

**Task 3.9: Gallery Navigation Testing**
```
Test:
- Year transitions clear
- Masonry grid responsive
- Lightbox functional
- Image lazy loading working
- Filtering/sorting (if added)
- Performance with 200+ images

Time: 2 hours
Priority: P1 (quality assurance)
Dependencies: Gallery complete
Deliverable: Functional gallery
```

**Task 3.10: Content QA Pass**
```
Review:
- All timeline captions proofread
- Dates accurate (check against couple's records)
- Photo credits if needed
- Alt text for accessibility
- Meta descriptions updated
- No placeholder text remains

Time: 1-2 hours
Priority: P1 (polish)
Dependencies: All content in place
Deliverable: Production-ready content
```

**Week 3 Deliverables Checklist**:
- [ ] ✅ TimelineMomentCard component built
- [ ] ✅ 8-10 timeline moments selected with photos
- [ ] ✅ Timeline captions written (all moments)
- [ ] ✅ /historia transformed with full-bleed timeline
- [ ] ✅ 200-250 gallery photos curated
- [ ] ✅ Gallery organized by year with transitions
- [ ] ✅ StoryTimeline component enhanced
- [ ] ✅ Timeline UX tested & polished
- [ ] ✅ Gallery navigation tested
- [ ] ✅ Content QA complete

**Week 3 Success Metrics**:
- Timeline feels cinematic (not card-based) ✓
- 8-10 full-bleed moments implemented ✓
- Gallery has 200+ photos organized by year ✓
- Time on /historia: >4 minutes average ✓
- Gallery engagement: >50% open lightbox ✓

---

### WEEK 4: Supporting Pages + Polish (Dec 11-18)
**Sprint Goal**: Complete supporting page heroes, polish animations, comprehensive testing

**Total Time**: 20-25 hours
**Team**: 1 developer + QA focus
**Success Criteria**: All pages production-ready, tests passing, smooth animations

#### Monday-Tuesday: Supporting Page Heroes (8-10 hours)

**Task 4.1: Gift Registry Hero (Apartment Photo)**
```
File: src/app/presentes/page.tsx
Implementation:
- Add ImageHero component (50vh)
- Background: Apartment exterior or interior
- Overlay: Dark gradient (strong, rgba(0,0,0,0.7))
- Content: Centered or bottom-left
  - Title: "Ajudem a Construir Nosso Lar"
  - Subtitle: "O Apartamento"
  - Quote: "Esse apartamento que o Hel passava de bicicleta sonhando? Agora é nosso."

Photo Options:
- Use apartment photo from Week 2 (if captured)
- OR: Golden hour exterior shoot (30 min)
- OR: Interior living room showing lived-in home

Time: 4-6 hours
Priority: P2 (enhancement, not blocker)
Dependencies: ImageHero component (Week 1)
Deliverable: Emotional gift registry intro
```

**Task 4.2: RSVP Hero (Celebration Photo)**
```
File: src/app/rsvp/page.tsx
Implementation:
- Add ImageHero component (40vh)
- Background: Happy couple moment (celebration, dinner, or travel)
- Overlay: Medium gradient (rgba(0,0,0,0.5))
- Content: Centered
  - Title: "Confirma Presença?"
  - Subtitle: "60 pessoas. Pra quem é introvertido, isso é muita gente."
  - (Humor reinforces personality)

Photo Selection:
- Celebratory moment (champagne, laughter, joy)
- OR: Small dinner party at home (intimate vibe)
- Warm tones, welcoming mood

Time: 3-4 hours
Priority: P2 (enhancement)
Dependencies: ImageHero component
Deliverable: Welcoming RSVP intro
```

**Task 4.3: Wedding Location Hero (Venue Showcase)**
```
File: src/app/detalhes/page.tsx (merged page from Week 1)
Implementation:
- Add VideoHero OR ImageHero (80vh)
- Option A: Venue walkthrough video (20-30 sec)
  - Slow walkthrough of Casa HY
  - Exterior → interior → gallery space
  - Cinematic, stabilized footage
- Option B: Venue exterior photo (golden hour)
  - Full building shot showing architecture
  - Art gallery aesthetic visible

Content:
- Title: "Casa HY"
- Subtitle: "Uma galeria de arte em Fortaleza"
- Location: "Eng. Luciano Cavalcante"

Venue Content Coordination:
- Request photos from Casa HY
- OR: Schedule pre-wedding venue visit (30 min shoot)

Time: 6-8 hours (includes coordination)
Priority: P1 (builds venue excitement)
Dependencies: VideoHero/ImageHero components
Deliverable: Impressive venue showcase
```

#### Wednesday: Animation Polish (4-6 hours)

**Task 4.4: Global Animation Refinement**
```
Focus Areas:
- Smooth page transitions (scroll-triggered)
- Consistent easing curves (ease-out)
- Stagger animations (0.1s delay between elements)
- Reduce motion support (prefers-reduced-motion)
- Loading states (skeleton screens)
- Hover effects (scale, shadow, color)
- Button interactions (press feedback)

Files to Review:
- All hero sections
- Timeline moments
- Pet gallery cards
- Navigation menu
- CTAs throughout

Time: 4-6 hours
Priority: P1 (professional polish)
Dependencies: All pages implemented
Deliverable: Cohesive animation system
```

#### Thursday-Friday: Comprehensive Testing (8-10 hours)

**Task 4.5: End-to-End User Journey Testing**
```
Test Scenarios:
1. First-time visitor → Homepage → Story → RSVP
2. Direct RSVP link → Confirm → Post-RSVP guidance
3. Story explorer → Timeline → Gallery → RSVP
4. Gift giver → RSVP → Gifts → Purchase (PIX test)
5. Mobile visitor → Full journey on phone

Test Each:
- All links functional
- Forms submitting correctly
- Images loading properly
- Videos autoplaying (where expected)
- CTAs leading to correct pages
- Navigation working
- Back button behavior
- Error states handled

Time: 3-4 hours
Priority: P0 (launch blocker)
Dependencies: All pages complete
Deliverable: Bug-free user journeys
```

**Task 4.6: Accessibility Audit**
```
WCAG AA Compliance Check:
- [ ] All images have alt text
- [ ] Color contrast ratios: 4.5:1 text, 3:1 UI
- [ ] Keyboard navigation works (Tab order)
- [ ] Focus indicators visible
- [ ] Form labels present
- [ ] ARIA labels on interactive elements
- [ ] Video captions (if dialogue)
- [ ] Reduced motion respected
- [ ] Screen reader testing (VoiceOver/NVDA)

Tools:
- axe DevTools (Chrome extension)
- Lighthouse accessibility score
- Manual keyboard testing
- Screen reader testing

Time: 2-3 hours
Priority: P1 (inclusive design)
Dependencies: All pages complete
Deliverable: Accessible to all guests
```

**Task 4.7: Performance Optimization**
```
Performance Targets:
- LCP (Largest Contentful Paint): <2.5s
- FID (First Input Delay): <100ms
- CLS (Cumulative Layout Shift): <0.1
- Total page size: <3MB initial load
- Time to Interactive: <3.5s

Actions:
- Compress all images (WebP, 85% quality)
- Lazy load below-fold content
- Code split by route
- Preload critical fonts
- Defer non-critical scripts
- Optimize video files (Handbrake)
- Add loading skeletons
- Cache static assets

Testing:
- Lighthouse (all pages)
- WebPageTest (3G connection)
- Real device testing

Time: 2-3 hours
Priority: P1 (user experience)
Dependencies: All pages complete
Deliverable: Fast site across all pages
```

**Task 4.8: Cross-Browser & Device Testing**
```
Test Matrix:
Desktop:
- Chrome (latest)
- Safari (latest)
- Firefox (latest)
- Edge (latest)

Mobile:
- iOS Safari (iPhone)
- Chrome Android
- Samsung Internet

Tablet:
- iPad Safari
- Android Chrome

Test:
- Layout responsive
- Videos autoplay (or show fallback)
- Touch gestures work
- Fonts render correctly
- Animations smooth
- Forms functional

Time: 2-3 hours
Priority: P1 (universal access)
Dependencies: All pages complete
Deliverable: Works everywhere
```

#### Weekend: Final Polish & Launch Prep (3-4 hours)

**Task 4.9: Content Final Review**
```
Review Checklist:
- [ ] All text proofread (typos, grammar)
- [ ] Dates accurate (verify with couple)
- [ ] Names spelled correctly
- [ ] Pet descriptions match personalities
- [ ] Timeline narrative flows logically
- [ ] No placeholder content remains
- [ ] Meta descriptions written (SEO)
- [ ] Open Graph images set (social sharing)
- [ ] Favicon updated

Time: 1-2 hours
Priority: P1 (professional quality)
Dependencies: None
Deliverable: Polished content
```

**Task 4.10: Analytics & Monitoring Setup**
```
Implementation:
- Google Analytics 4 setup
- Event tracking:
  - Video play rates
  - CTA clicks (RSVP, Story, Gifts)
  - Page scroll depth
  - Time on page
  - Form submissions
  - Gallery interactions
- Error monitoring (Sentry or similar)
- Performance monitoring (Vercel Analytics)

Privacy:
- Cookie consent (if EU guests)
- Privacy policy link

Time: 2-3 hours
Priority: P2 (measurement)
Dependencies: None
Deliverable: Tracking in place for launch
```

**Week 4 Deliverables Checklist**:
- [ ] ✅ Gift registry hero (apartment photo)
- [ ] ✅ RSVP hero (celebration photo)
- [ ] ✅ Wedding location hero (venue showcase)
- [ ] ✅ Global animations polished
- [ ] ✅ End-to-end testing complete
- [ ] ✅ Accessibility audit passed (WCAG AA)
- [ ] ✅ Performance optimized (<3s load)
- [ ] ✅ Cross-browser testing complete
- [ ] ✅ Content final review done
- [ ] ✅ Analytics tracking live
- [ ] ✅ Production deployment ready

**Week 4 Success Metrics**:
- All pages production-ready ✓
- No critical bugs ✓
- Accessibility compliant (WCAG AA) ✓
- Performance targets met (<3s load) ✓
- Analytics tracking active ✓
- Ready for guest traffic ✓

---

## 4. Resource Allocation

### By Role

**Frontend Developer (Primary Resource)**:
- **Week 1**: 15-20 hours
  - IA fixes: 6-8 hrs
  - Component library: 10-14 hrs
- **Week 2**: 20-25 hours
  - Homepage transformation: 18-22 hrs
  - Testing/optimization: 4-6 hrs
- **Week 3**: 25-30 hours
  - Timeline transformation: 12-15 hrs
  - Gallery organization: 8-12 hrs
  - Testing: 4-6 hrs
- **Week 4**: 15-20 hours
  - Supporting page heroes: 8-10 hrs
  - Animation polish: 4-6 hrs
  - Testing/QA: 8-10 hrs
- **TOTAL**: 75-95 hours over 4 weeks

**Content Creator (Couple)**:
- **Week 1**: 5-10 hours
  - Photo organization: 2-3 hrs
  - Content decisions (IA): 2-3 hrs
  - Hero selection: 1-2 hrs
  - Review/feedback: 1-2 hrs
- **Week 2**: 10-15 hours
  - Pet photo session: 2-3 hrs
  - Story preview curation: 2-3 hrs
  - Content review/feedback: 2-3 hrs
  - Additional shoots: 4-6 hrs
- **Week 3**: 8-12 hours
  - Gallery photo curation: 6-8 hrs
  - Timeline caption writing: 2-3 hrs
  - Content review: 2-3 hrs
- **Week 4**: 5-8 hours
  - Supporting page photos: 2-3 hrs
  - Final content review: 2-3 hrs
  - User acceptance testing: 2-3 hrs
- **TOTAL**: 28-45 hours over 4 weeks

**Photographer (Optional - Budget: $200-300)**:
- Pet portrait session: 2-3 hours shoot + editing
- Venue walkthrough: 1-2 hours shoot + editing
- Alternative: Couple self-shoots with smartphone

**QA/Testing**:
- Integrated into developer time
- Week 2: 4-6 hours
- Week 3: 4-6 hours
- Week 4: 8-10 hours
- Couple participates in UAT (user acceptance testing)

### By Week

```
WEEK 1: Foundation (20-25 dev hrs + 5-10 content hrs)
├─ IA Fixes: 6-8 hrs
├─ Component Library: 10-14 hrs
└─ Content Organization: 5-10 hrs (couple)

WEEK 2: Homepage (20-25 dev hrs + 10-15 content hrs)
├─ Video Hero: 8-10 hrs
├─ Event Details: 4-6 hrs
├─ Story Preview: 4-6 hrs
├─ Pet Gallery: 6-8 hrs
├─ Pet Session: 2-3 hrs (couple/photographer)
└─ Testing: 4-6 hrs

WEEK 3: Story/Gallery (25-30 dev hrs + 8-12 content hrs)
├─ Timeline Component: 6-8 hrs
├─ Timeline Implementation: 6-8 hrs
├─ Gallery Organization: 8-12 hrs
├─ Content Curation: 6-8 hrs (couple)
└─ Testing: 4-6 hrs

WEEK 4: Polish (15-20 dev hrs + 5-8 content hrs)
├─ Supporting Heroes: 8-10 hrs
├─ Animation Polish: 4-6 hrs
├─ Comprehensive Testing: 8-10 hrs
└─ Final Review: 5-8 hrs (couple)
```

### Team Structure

**Core Team**:
- 1 Senior Frontend Developer (Next.js, TypeScript, Framer Motion)
- Hel & Ylana (content decisions, photo sessions, testing)

**Optional Support**:
- Photographer (pet portraits, venue shoot)
- Friend/family for second opinion (UAT)

**Communication**:
- Daily async updates (Slack/WhatsApp)
- Weekly sync meetings (30 min progress review)
- Real-time collaboration during content selection
- Final UAT session before launch

---

## 5. Risk Mitigation

### Critical Risks

**RISK 1: Missing Homepage Hero Video**
```
Impact: HIGH - Blocks entire homepage transformation (Week 2)
Probability: MEDIUM - Requires couple availability + shoot

Mitigation Strategy:
- Week 1: Select content EARLY (Task 1.10)
- Backup Plan A: Use high-res photo with Ken Burns effect
- Backup Plan B: Create slideshow from existing photos (iMovie)
- Backup Plan C: Use proposal video if available
- Time Buffer: Reserve Saturday Week 1 for emergency shoot

Contingency:
If no video by Monday Week 2:
→ Pivot to static ImageHero with parallax
→ Plan video upgrade for post-launch
→ Still achieves 80% of transformation impact
```

**RISK 2: Pet Portrait Session Fails**
```
Impact: MEDIUM - Pet gallery less impactful but not blocked
Probability: LOW - Pets available, can use existing photos

Mitigation Strategy:
- Week 2: Schedule session early in week (Tuesday/Wednesday)
- Backup Plan A: Use best existing pet photos
- Backup Plan B: Mix of existing photos + new shots of 1-2 pets
- Backup Plan C: Illustrated pet portraits (Fiverr, $50-100)
- Time Buffer: Can reschedule within Week 2

Contingency:
If session fails:
→ Use horizontal scroll gallery with existing photos
→ Apply consistent editing (filters, crops)
→ Plan professional pet shoot post-launch for upgrade
```

**RISK 3: Development Delays (Scope Creep)**
```
Impact: HIGH - Could miss Nov 20 deadline
Probability: MEDIUM - Complex features, perfectionism risk

Mitigation Strategy:
- Strict scope adherence (NO new features mid-sprint)
- Daily progress tracking (TodoWrite tool)
- Weekly go/no-go checkpoints (see Section 7)
- MVP-first approach (launch with core, enhance later)
- Time buffers built into estimates

Contingency:
If falling behind after Week 2:
→ Cut Week 4 supporting page heroes (use existing sections)
→ Defer animation polish to post-launch
→ Launch with homepage + timeline only
→ Add remaining pages in Week 5
```

**RISK 4: Content Gathering Takes Longer Than Expected**
```
Impact: MEDIUM - Delays development dependent on content
Probability: MEDIUM - Photo selection subjective, time-consuming

Mitigation Strategy:
- Content work happens PARALLEL to development
- Developer uses placeholder content to unblock work
- Pre-Week 1: Start organizing photos before sprint begins
- Set firm deadlines for content decisions (no endless deliberation)
- Developer selects if couple can't decide by deadline

Contingency:
If content delayed:
→ Launch with fewer timeline moments (6 instead of 10)
→ Launch with smaller gallery (100 photos instead of 200)
→ Add remaining content post-launch
→ Quality over quantity - better to have 6 great moments than 10 mediocre
```

**RISK 5: Performance Issues (Large Media Files)**
```
Impact: MEDIUM - Slow load times hurt mobile experience
Probability: MEDIUM - Many large images/videos to optimize

Mitigation Strategy:
- Week 1: Set up image optimization pipeline (next/image)
- Compress videos aggressively (Handbrake, 5-8 Mbps)
- Use CDN (Vercel Blob or Cloudflare)
- Lazy load all below-fold content
- Implement loading skeletons
- Test on real 3G connection (not just dev machine)

Contingency:
If performance targets not met:
→ Reduce video quality further (720p instead of 1080p)
→ Remove videos from mobile (static images only)
→ Limit gallery to 150 photos initially
→ Implement pagination instead of infinite scroll
```

**RISK 6: Browser/Device Compatibility Issues**
```
Impact: MEDIUM - Some guests can't view site properly
Probability: LOW - Modern stack, good browser support

Mitigation Strategy:
- Week 4: Comprehensive cross-browser testing
- Use Next.js (excellent browser compatibility)
- Avoid cutting-edge CSS (stick to well-supported)
- Provide fallbacks (video → image, animations → static)
- Test on actual devices, not just dev tools

Contingency:
If compatibility issues found late:
→ Graceful degradation (older browsers get simpler version)
→ Detect browser and show appropriate experience
→ Provide "View on Chrome/Safari" message for ancient browsers
```

### Risk Monitoring

**Weekly Risk Assessment**:
- End of Week 1: Are components built? Is hero content selected?
- End of Week 2: Is homepage live? Are pet portraits captured?
- End of Week 3: Is timeline transformed? Is gallery organized?
- End of Week 4: Is testing complete? Are all bugs fixed?

**Risk Indicators (Red Flags)**:
- 🚨 Hero content not selected by end of Week 1
- 🚨 Homepage not functional by end of Week 2
- 🚨 Timeline photos not selected by Tuesday Week 3
- 🚨 Critical bugs found in Week 4 Friday testing
- 🚨 Performance targets not met by Thursday Week 4

**Escalation Path**:
1. Developer identifies risk/blocker
2. Immediate discussion with couple (same day)
3. Implement contingency plan (no waiting)
4. Adjust remaining sprint priorities if needed
5. Document decision and impact

---

## 6. Success Metrics & Monitoring

### Quantitative Success Metrics

**Conversion Metrics**:
```
RSVP Conversion Rate:
- Baseline (current): 50-60%
- Target (post-transformation): 80-85%
- Measurement: (Total RSVPs / Total Invited) × 100
- Tracking: Supabase database + Google Analytics

Gift Registry Engagement:
- Target: 70%+ view gift registry
- Target: 60-70% of total registry value completed
- Measurement: Page visits + PIX conversions
- Tracking: Analytics event tracking

Story Page Engagement:
- Target: >70% of visitors view /historia
- Target: >4 minutes average time on page
- Measurement: Analytics pageviews + time on page
- Tracking: Google Analytics

Gallery Interaction:
- Target: >50% of visitors view /galeria
- Target: >50% open lightbox to view photos
- Target: >5 photos viewed per visitor
- Measurement: Click events + photo views
- Tracking: Custom event tracking
```

**Performance Metrics**:
```
Page Load Speed:
- Target: <2.5s LCP (Largest Contentful Paint)
- Target: <100ms FID (First Input Delay)
- Target: <0.1 CLS (Cumulative Layout Shift)
- Measurement: Core Web Vitals
- Tracking: Lighthouse + Vercel Analytics

Video Performance:
- Target: >80% video play rate (autoplay works)
- Target: >60% complete view rate (watch whole loop)
- Measurement: Video play events
- Tracking: Custom video event tracking

Mobile Experience:
- Target: <3s mobile page load
- Target: <30% mobile bounce rate
- Measurement: Mobile-specific metrics
- Tracking: Google Analytics (device segmentation)
```

**Engagement Metrics**:
```
Time on Site:
- Baseline: <1 minute (current)
- Target: 3-5 minutes (post-transformation)
- Measurement: Session duration
- Tracking: Google Analytics

Pages Per Session:
- Baseline: 4-5 pages (with duplication confusion)
- Target: 2-3 pages (efficient, focused)
- Measurement: Average pages per session
- Tracking: Google Analytics

Scroll Depth:
- Target: >70% reach footer (complete journey)
- Measurement: Scroll depth events
- Tracking: Custom scroll tracking

Bounce Rate:
- Baseline: 40-50% (current, with confusion)
- Target: <30% (post-transformation)
- Measurement: Bounce rate
- Tracking: Google Analytics
```

**Social Metrics**:
```
Social Sharing:
- Target: 30%+ of guests share site
- Measurement: Share button clicks + referrals
- Tracking: UTM parameters + share events

WhatsApp Sharing:
- Target: 20%+ use WhatsApp share for group RSVPs
- Measurement: WhatsApp link clicks
- Tracking: Custom event tracking

Organic Mentions:
- Target: Guests mention website when RSVPing
- Measurement: Qualitative feedback
- Tracking: Manual notes from conversations
```

### Qualitative Success Metrics

**Guest Feedback Signals**:
```
Emotional Connection:
✓ "I felt like I got to know you through the website"
✓ "The video of you two at home was so sweet"
✓ "I love that you included the dogs - I feel like I know them!"
✓ "The story of your 1000 days is beautiful"
✓ "I could really see your personalities in the site"

Story Engagement:
✓ Guests mention specific timeline moments when RSVPing
✓ Questions about specific events ("Tell me more about Linda!")
✓ References to pet personalities ("Oliver is so energetic!")
✓ Understanding of apartment significance ("I saw you dreamed about it")
✓ Awareness of proposal moment ("Icaraí proposal was beautiful")

Brand Perception:
✓ Guests describe couple accurately ("authentic," "low-key," "genuine")
✓ Understand intimate 60-person celebration reasoning
✓ Appreciate tech/design quality ("best wedding site I've seen")
✓ No surprise at wedding style (expectations aligned)
✓ Guests arrive already emotionally invested
```

**Wedding Day Indicators**:
```
Pre-Wedding:
✓ RSVP rate: 85%+ (vs typical 70-75%)
✓ Minimal confused questions about logistics
✓ Gift registry well-utilized (70%+ value)
✓ Guests prepared (right attire, know schedule)

During Wedding:
✓ Guests reference website stories in conversations
✓ Pets treated like celebrities ("Where's Linda?")
✓ Recognition of timeline moments ("This is the venue you chose!")
✓ Emotional investment visible (tears during ceremony)
✓ Comments: "Feels like I was part of your journey"

Post-Wedding:
✓ Website shared by guests on social media
✓ "Best wedding website" comments
✓ Requests from other couples: "How did you build that?"
✓ Lasting impression: "I'll always remember your 1000-day story"
```

### Analytics Implementation

**Google Analytics 4 Setup**:
```javascript
// Track custom events
gtag('event', 'video_play', {
  'video_name': 'homepage_hero',
  'video_location': 'homepage'
});

gtag('event', 'cta_click', {
  'cta_text': 'RSVP',
  'cta_location': 'homepage_hero',
  'destination': '/rsvp'
});

gtag('event', 'timeline_moment_view', {
  'moment': 'proposal_icarai',
  'scroll_depth': '80%'
});

gtag('event', 'pet_gallery_interaction', {
  'pet_name': 'Linda',
  'interaction_type': 'swipe'
});

gtag('event', 'gallery_lightbox_open', {
  'image_year': '2024',
  'image_index': 15
});
```

**Weekly Analytics Review**:
- Monday: Check previous week's metrics
- Focus areas:
  - Which pages getting most traffic?
  - Where are drop-offs happening?
  - Are videos playing?
  - Are CTAs being clicked?
  - Mobile vs desktop performance
- Adjust priorities based on data

**Pre-Launch Baseline**:
- Week 0 (before transformation): Capture current metrics
- Metrics to baseline:
  - RSVP rate to date
  - Average time on site
  - Pages per session
  - Bounce rate
  - Mobile traffic percentage
- Use for before/after comparison

---

## 7. Go/No-Go Decision Points

### Week 1 Checkpoint (Friday, End of Day)

**GO Criteria** ✅:
- [ ] ✅ AboutUsSection removed from /historia
- [ ] ✅ StoryTimeline removed from /galeria
- [ ] ✅ /local + /informacoes merged into /detalhes
- [ ] ✅ Navigation updated to 6 pages
- [ ] ✅ Post-RSVP guidance implemented
- [ ] ✅ VideoHero component built and tested
- [ ] ✅ ImageHero component built and tested
- [ ] ✅ Photos organized into folders
- [ ] ✅ **CRITICAL**: Homepage hero content selected

**Decision Matrix**:
```
ALL GREEN → PROCEED to Week 2 homepage transformation
MISSING 1-2 → EXTEND weekend to complete critical items
MISSING 3+ → RE-EVALUATE scope, consider MVP approach
MISSING HERO CONTENT → ABSOLUTE BLOCKER, cannot proceed
```

**NO-GO Actions**:
- If hero content not selected:
  - Emergency weekend shoot session
  - OR pivot to static ImageHero approach
  - Delay Week 2 start by 2-3 days
- If components not built:
  - Developer extends weekend to complete
  - Simplify component features if needed
- If IA not fixed:
  - STOP and complete (blocks everything)

**Stakeholder Communication**:
- Friday EOD: Developer sends progress report to couple
- Format: Checklist with ✅/❌ status
- If NO-GO: Immediate call to discuss contingency

---

### Week 2 Checkpoint (Friday, End of Day)

**GO Criteria** ✅:
- [ ] ✅ Homepage VideoHero fully functional
- [ ] ✅ Event Details section redesigned
- [ ] ✅ Story Preview section implemented
- [ ] ✅ Pet portrait session complete (4 photos)
- [ ] ✅ Pet horizontal scroll gallery live
- [ ] ✅ Cross-browser testing passed
- [ ] ✅ Mobile responsive (perfect on iPhone/Android)
- [ ] ✅ Performance: <3s homepage load time

**Decision Matrix**:
```
ALL GREEN → PROCEED to Week 3 timeline transformation
MISSING PETS → NOT BLOCKER, can use existing photos + upgrade later
MISSING PERFORMANCE → OPTIMIZE weekend, delay Week 3 start
VIDEO HERO NOT WORKING → CRITICAL, must fix before proceeding
```

**Quality Gates**:
```
Homepage Video:
✓ Autoplays on >80% of browsers
✓ Falls back to static image gracefully
✓ Doesn't slow page load (<3s LCP)

Mobile Experience:
✓ Works perfectly on iPhone Safari
✓ Works perfectly on Chrome Android
✓ Touch targets: 44px minimum
✓ Video shows static image on mobile (or plays if data OK)

User Testing:
✓ Couple approves homepage look & feel
✓ Test with 2-3 friends/family (get feedback)
✓ No major UX confusion
```

**NO-GO Actions**:
- If homepage not functional:
  - Extend weekend to complete
  - Simplify features if needed
  - Launch with static hero (upgrade later)
- If pets not captured:
  - Use best existing photos
  - Plan professional shoot post-launch
- If performance poor:
  - Aggressive optimization weekend
  - Reduce video quality
  - Remove animations if needed

**Soft Launch Consideration**:
- Week 2 END could be a SOFT LAUNCH opportunity
- Homepage + existing pages = functional site
- Show to family first (5-10 people)
- Gather feedback while building Week 3-4
- Allows early RSVP start

---

### Week 3 Checkpoint (Friday, End of Day)

**GO Criteria** ✅:
- [ ] ✅ Timeline transformed with 6+ full-bleed moments
- [ ] ✅ TimelineMomentCard component working
- [ ] ✅ Timeline photos selected and optimized
- [ ] ✅ Gallery organized with 150+ photos (minimum)
- [ ] ✅ Year transitions implemented
- [ ] ✅ Lightbox functional
- [ ] ✅ Timeline UX tested and smooth
- [ ] ✅ Content proofread and accurate

**Decision Matrix**:
```
ALL GREEN → PROCEED to Week 4 polish
6+ TIMELINE MOMENTS → ACCEPTABLE, 10 is ideal but 6+ is good
150+ GALLERY PHOTOS → MINIMUM, more is better
TIMELINE NOT TRANSFORMED → CRITICAL, must complete before Week 4
```

**Quality Gates**:
```
Timeline Experience:
✓ Full-bleed moments feel cinematic
✓ Scroll performance smooth (no lag)
✓ Text readable on all backgrounds
✓ Animations not excessive
✓ Mobile: Moments stack vertically, still impactful

Gallery:
✓ At least 150 photos (minimum viable)
✓ Organized by year
✓ Lightbox opens correctly
✓ Lazy loading working
✓ Performance: <4s page load

Story Depth:
✓ Couple approves timeline narrative
✓ Key moments captured (especially proposal)
✓ Emotional arc flows logically
✓ No embarrassing typos/errors
```

**NO-GO Actions**:
- If timeline not transformed:
  - EXTEND to complete (top priority)
  - Simplify: Use 6 moments instead of 10
  - Skip some animation polish
- If gallery photos insufficient:
  - Launch with fewer (100 minimum)
  - Add more post-launch
  - Quality > quantity
- If performance issues:
  - Optimize images aggressively
  - Implement pagination
  - Reduce initial gallery load

**Launch Decision**:
- Week 3 END: Could launch with homepage + story + gallery
- Week 4 becomes enhancement week (not blocker)
- Supporting page heroes are nice-to-have
- If deadline pressure: LAUNCH now, polish live

---

### Week 4 Checkpoint (Thursday, Before Launch)

**GO Criteria** ✅:
- [ ] ✅ All supporting page heroes implemented
- [ ] ✅ Global animations polished
- [ ] ✅ End-to-end testing passed
- [ ] ✅ Accessibility audit: WCAG AA compliant
- [ ] ✅ Performance: All pages <3s load
- [ ] ✅ Cross-browser: Works on Chrome, Safari, Firefox, Edge
- [ ] ✅ Mobile: Perfect on iOS and Android
- [ ] ✅ Content: Final proofread, no errors
- [ ] ✅ Analytics: Tracking in place
- [ ] ✅ **CRITICAL**: Couple approval (final sign-off)

**Decision Matrix**:
```
ALL GREEN + COUPLE APPROVAL → LAUNCH Friday
MISSING SUPPORTING HEROES → NOT BLOCKER, can launch without
CRITICAL BUGS FOUND → NO LAUNCH, fix first
PERFORMANCE ISSUES → NO LAUNCH, optimize first
COUPLE NOT SATISFIED → DELAY, address feedback
```

**Launch Readiness Checklist**:
```
Technical:
✓ All pages load correctly
✓ All links functional
✓ Forms submit successfully
✓ Videos autoplay (or fallback)
✓ Images optimized and loading
✓ No console errors
✓ HTTPS working
✓ Domain configured

Content:
✓ All text proofread
✓ All dates/names correct
✓ All photos approved by couple
✓ No placeholder content
✓ Meta descriptions set
✓ Favicon updated
✓ Social preview images set

User Experience:
✓ Navigation clear
✓ Mobile perfect
✓ Load times fast
✓ Animations smooth
✓ Accessible (keyboard, screen reader)
✓ No major bugs

Business:
✓ RSVP system working
✓ Gift registry functional
✓ PIX payments working (test transaction)
✓ Email notifications sending
✓ Analytics tracking
✓ Couple final approval ✅
```

**LAUNCH or NO-LAUNCH**:

**LAUNCH Friday** if:
- All critical functionality works
- Couple approves
- No critical bugs
- Performance acceptable
- Content accurate

**DELAY LAUNCH** if:
- Critical bugs found
- Couple not satisfied
- RSVP system broken
- Major performance issues
- Content errors

**Soft Launch Option**:
- Launch to family only (5-10 people)
- Friday-Sunday: Monitor and fix issues
- Monday: Full launch to all 60 guests
- Reduces risk of public launch issues

---

### Final Pre-Launch Gate (Day Before Full Launch)

**Final Checks (1-2 hours)**:
```
Technical Smoke Test:
- [ ] Visit every page from fresh browser
- [ ] Submit test RSVP
- [ ] Test gift PIX flow
- [ ] Watch videos on mobile
- [ ] Test forms
- [ ] Check email notifications
- [ ] Verify analytics tracking

Content Final Scan:
- [ ] Read every page for typos
- [ ] Verify all dates (Nov 20, 2025)
- [ ] Check all names spelled correctly
- [ ] Confirm venue details accurate
- [ ] Review pet descriptions (couple approval)

User Acceptance:
- [ ] Couple does full site walkthrough
- [ ] Test with 1-2 friends (fresh eyes)
- [ ] Confirm mobile experience perfect
- [ ] Get final approval from couple
```

**GO/NO-GO Call**:
- Thursday evening: Developer + couple call
- Duration: 15 minutes
- Decision: Launch tomorrow or delay?
- If GO: Send WhatsApp to all guests Friday morning
- If NO-GO: Fix critical issues, re-assess Saturday

**Launch Communication Plan**:
```
Day 0 (Friday): Soft launch
- Share with immediate family (5-10 people)
- Monitor for issues
- Gather initial feedback

Day 1-2 (Weekend):
- Fix any reported issues
- Monitor analytics
- Prepare full launch message

Day 3 (Monday):
- Full WhatsApp blast to all 60 guests
- Message template:
  "Oi pessoal! 💕
   Criamos um site especial pra contar nossa história
   e os detalhes do casamento (20 de novembro!).
   Dá uma olhada: https://thousanddaysoflove.com
   Não esquece de confirmar presença! 🎉"

Week 2:
- Monitor RSVP rate
- Answer questions
- Update content if needed
```

---

## 8. Launch Checklist

### Pre-Launch Requirements (All Must Be ✅)

#### Technical Checklist

**Core Functionality**:
- [ ] ✅ All pages load without errors
- [ ] ✅ Navigation links work correctly
- [ ] ✅ VideoHero autoplays (with fallback)
- [ ] ✅ All images load and display
- [ ] ✅ Timeline moments render correctly
- [ ] ✅ Pet gallery scrolls smoothly
- [ ] ✅ Gallery lightbox opens and closes
- [ ] ✅ RSVP form submits successfully
- [ ] ✅ Post-RSVP guidance displays
- [ ] ✅ Gift registry displays items
- [ ] ✅ PIX payment flow works (test transaction)
- [ ] ✅ Email notifications sending (RSVP confirmations)

**Performance**:
- [ ] ✅ Homepage LCP: <2.5s (Lighthouse)
- [ ] ✅ All pages LCP: <3s
- [ ] ✅ CLS: <0.1 (no layout shifts)
- [ ] ✅ FID: <100ms (interactive quickly)
- [ ] ✅ Mobile load time: <3s on 4G
- [ ] ✅ Video files compressed (<5MB desktop, <3MB mobile)
- [ ] ✅ Images optimized (WebP format)
- [ ] ✅ Lazy loading working (below-fold content)

**Accessibility**:
- [ ] ✅ All images have alt text
- [ ] ✅ Color contrast: 4.5:1 for text
- [ ] ✅ Keyboard navigation works (Tab order logical)
- [ ] ✅ Focus indicators visible
- [ ] ✅ Form labels present and clear
- [ ] ✅ ARIA labels on interactive elements
- [ ] ✅ Reduced motion respected (prefers-reduced-motion)
- [ ] ✅ Screen reader tested (VoiceOver or NVDA)
- [ ] ✅ Lighthouse accessibility score: 90+

**Cross-Browser Compatibility**:
- [ ] ✅ Chrome (latest): Tested and working
- [ ] ✅ Safari (latest): Tested and working
- [ ] ✅ Firefox (latest): Tested and working
- [ ] ✅ Edge (latest): Tested and working
- [ ] ✅ iOS Safari: Perfect on iPhone
- [ ] ✅ Chrome Android: Perfect on Android
- [ ] ✅ Responsive on all screen sizes (320px+)

**Mobile Experience**:
- [ ] ✅ Touch targets: 44px minimum
- [ ] ✅ Videos: Static images on mobile (or optimized video)
- [ ] ✅ Pet gallery: 85vw cards, smooth swipe
- [ ] ✅ Forms: Mobile-friendly inputs
- [ ] ✅ Text: Readable without zooming
- [ ] ✅ Navigation: Mobile menu works perfectly
- [ ] ✅ Safe area insets: iPhone notch respected

**SEO & Social**:
- [ ] ✅ Meta descriptions: All pages
- [ ] ✅ Open Graph tags: Homepage + key pages
- [ ] ✅ Twitter card tags: Homepage
- [ ] ✅ Favicon: Updated with H ♥ Y
- [ ] ✅ Social preview images: Set for sharing
- [ ] ✅ Sitemap: Generated and submitted
- [ ] ✅ Robots.txt: Configured correctly

**Security & Privacy**:
- [ ] ✅ HTTPS: Site served over SSL
- [ ] ✅ Environment variables: Secure (not in code)
- [ ] ✅ API keys: Protected
- [ ] ✅ CORS: Configured correctly
- [ ] ✅ Content Security Policy: Set
- [ ] ✅ Privacy policy: Linked (if collecting analytics)

#### Content Checklist

**Text Content**:
- [ ] ✅ All pages proofread (no typos)
- [ ] ✅ Names: Hel & Ylana (correct spelling)
- [ ] ✅ Date: November 20, 2025 (consistent everywhere)
- [ ] ✅ Venue: Casa HY, Eng. Luciano Cavalcante (correct)
- [ ] ✅ Pet names: Linda, Cacao, Olivia, Oliver (correct)
- [ ] ✅ Timeline dates: Verified with couple
- [ ] ✅ Timeline captions: Approved by couple
- [ ] ✅ About Us: Reflects their personalities
- [ ] ✅ Gift descriptions: Accurate and up-to-date
- [ ] ✅ RSVP instructions: Clear and complete
- [ ] ✅ No placeholder text (Lorem ipsum, TODO, etc.)

**Visual Content**:
- [ ] ✅ Homepage hero: Video or photo selected and approved
- [ ] ✅ Pet portraits: 4 individual shots (Linda, Cacao, Olivia, Oliver)
- [ ] ✅ Timeline photos: 6-10 key moments selected
- [ ] ✅ Gallery photos: 150+ minimum curated
- [ ] ✅ Proposal photo: Included in timeline (if available)
- [ ] ✅ Apartment photo: For gift registry hero
- [ ] ✅ Venue photo: Casa HY exterior or interior
- [ ] ✅ Celebration photo: For RSVP hero
- [ ] ✅ All photos: Approved by couple (no embarrassing shots)
- [ ] ✅ All photos: Optimized for web (WebP, compressed)

**Legal & Credits**:
- [ ] ✅ Photo credits: If using others' photos
- [ ] ✅ Music licensing: If using music in videos
- [ ] ✅ Venue permissions: Casa HY photos approved
- [ ] ✅ Privacy policy: If required (GDPR/LGPD)
- [ ] ✅ Terms of service: For gift registry (if needed)

#### User Experience Checklist

**User Flows**:
- [ ] ✅ First-time visitor → Homepage → Story → RSVP: Works smoothly
- [ ] ✅ Direct RSVP → Search → Confirm → Post-RSVP guidance: Complete
- [ ] ✅ Story explorer → Timeline → Gallery → RSVP: Engaging
- [ ] ✅ Gift giver → RSVP → Gifts → PIX: Functional
- [ ] ✅ Mobile visitor → Full journey: Seamless on phone
- [ ] ✅ All CTAs → Lead to correct pages
- [ ] ✅ Back button → Works as expected
- [ ] ✅ Error states → Handled gracefully

**Emotional Impact**:
- [ ] ✅ Homepage hero: Creates immediate connection
- [ ] ✅ Pet gallery: Feels like meeting the family
- [ ] ✅ Timeline: Emotional journey visible
- [ ] ✅ Gallery: Authentic moments captured
- [ ] ✅ Overall: Feels personal, not template-like
- [ ] ✅ Couple approval: "This is US"

**Guest Understanding**:
- [ ] ✅ Who Hel & Ylana are (personalities clear)
- [ ] ✅ How they got here (1000-day story clear)
- [ ] ✅ Why this matters (depth, authenticity visible)
- [ ] ✅ What they're celebrating (commitment, family, dream realized)
- [ ] ✅ How to join (Casa HY, Nov 20, RSVP, gifts)
- [ ] ✅ Practical details (location, time, dress code, parking)

#### Analytics & Monitoring Checklist

**Analytics Setup**:
- [ ] ✅ Google Analytics 4: Installed and tracking
- [ ] ✅ Event tracking: Video plays, CTA clicks, form submissions
- [ ] ✅ Custom events: Timeline views, gallery interactions
- [ ] ✅ Goal tracking: RSVP conversions, gift clicks
- [ ] ✅ Error tracking: Sentry or similar (optional)
- [ ] ✅ Performance monitoring: Vercel Analytics or similar
- [ ] ✅ Real user monitoring: Core Web Vitals tracked

**Dashboard Setup**:
- [ ] ✅ Analytics dashboard: Accessible to couple
- [ ] ✅ Key metrics visible: RSVP rate, time on site, traffic sources
- [ ] ✅ Weekly reports: Automated (optional)

#### Stakeholder Approval Checklist

**Couple Final Review**:
- [ ] ✅ Full site walkthrough completed
- [ ] ✅ All content approved (text + photos)
- [ ] ✅ Pet descriptions approved (personalities accurate)
- [ ] ✅ Timeline narrative approved (story feels right)
- [ ] ✅ Design aesthetic approved (matches vision)
- [ ] ✅ Mobile experience approved (tested on their phones)
- [ ] ✅ Overall satisfaction: "We love it!"

**Test User Feedback**:
- [ ] ✅ 2-3 friends/family tested site
- [ ] ✅ No major confusion reported
- [ ] ✅ Positive emotional reactions
- [ ] ✅ RSVP process clear and easy
- [ ] ✅ No technical issues found

**Developer Sign-Off**:
- [ ] ✅ All features implemented as planned
- [ ] ✅ All bugs fixed or documented
- [ ] ✅ Performance targets met
- [ ] ✅ Accessibility standards met
- [ ] ✅ Code deployed to production
- [ ] ✅ Backups configured
- [ ] ✅ Monitoring in place
- [ ] ✅ Ready to support post-launch

---

### Launch Day Procedures

#### T-24 Hours (Day Before)

**Final Checks**:
1. Run full launch checklist (above)
2. Test RSVP system with real submission
3. Test PIX payment with test transaction
4. Verify email notifications sending
5. Check analytics tracking live
6. Backup database
7. Confirm Vercel deployment stable

**Communication**:
1. Developer confirms readiness to couple
2. Couple does final walkthrough
3. Prepare WhatsApp launch message
4. Notify family about soft launch tomorrow

#### T-0 (Launch Day Morning)

**Soft Launch - Family Only (5-10 people)**:
```
Time: 9:00 AM
Action: Send WhatsApp to immediate family
Message:
"Oi família! 💕
Criamos um site especial pro casamento.
Queremos que vocês sejam os primeiros a ver!
https://thousanddaysoflove.com
O que vocês acham? 🎉"

Recipients:
- Parents (both sides)
- Siblings
- Close friends (2-3)
```

**Morning Monitoring (9 AM - 12 PM)**:
- Watch analytics: Are people visiting?
- Monitor error logs: Any crashes?
- Check mobile: Family testing on phones?
- Gather feedback: Text responses, calls
- Fix critical issues: If any reported

**Lunch Break Decision**:
- 12:00 PM: Developer + couple call
- Review: How's soft launch going?
- Decision: Ready for full launch Monday?
- Actions: Fix any reported issues over weekend

#### T+1 Day (Saturday)

**Weekend Monitoring & Fixes**:
- Morning: Review analytics from Friday soft launch
- Actions: Fix any reported bugs
- Testing: Verify fixes work
- Content: Make any needed tweaks (typos, photo swaps)
- Prep: Prepare full launch message for Monday

**Feedback Incorporation**:
- Family feedback: "Load time slow" → Optimize
- Family feedback: "Love the pet gallery!" → Great!
- Family feedback: "Confusing RSVP" → Fix instructions
- Family feedback: "Can't find gift registry" → Make CTA more visible

#### T+3 Days (Monday - FULL LAUNCH)

**Full Launch - All 60 Guests**:
```
Time: 10:00 AM (after weekend fixes)
Action: WhatsApp blast to all guests
Message:
"Oi pessoal! 💕

Hel e Ylana aqui! Criamos um site especial pra contar nossa história de 1000 dias juntos e compartilhar todos os detalhes do casamento.

🌐 https://thousanddaysoflove.com

Lá vocês vão encontrar:
- Nossa história completa (do Tinder ao altar!)
- Nossa família de 4 pets 🐾
- Todas as informações do casamento (20 de novembro na Casa HY)
- Lista de presentes (se quiserem ajudar a construir nosso lar)
- E o mais importante: confirmar presença!

Não esqueçam de confirmar presença pelo site!
Mal podemos esperar pra ver vocês lá! 🎉

Hel ♥ Ylana"

Recipients: All 60 invited guests
```

**Launch Day Monitoring**:
- 10:00-11:00 AM: Watch initial traffic spike
- Check: Are RSVPs coming in?
- Check: Any error messages?
- Check: Mobile traffic working?
- Respond: Answer questions in real-time (WhatsApp)

**First 24 Hours**:
- Monitor analytics constantly
- Track RSVP conversion rate
- Note which pages getting most traffic
- Gather guest feedback (WhatsApp responses)
- Fix any critical issues immediately
- Celebrate: You launched! 🎉

#### Post-Launch Week 1

**Daily Monitoring (Mon-Fri)**:
- Morning: Check analytics (10 min)
- Review: New RSVPs overnight?
- Answer: Guest questions (WhatsApp)
- Track: Conversion rates
- Fix: Any reported issues

**End of Week 1 Review**:
- Total visitors: How many of 60 guests visited?
- RSVP rate: Are we hitting 80-85% target?
- Time on site: Are guests engaging (3-5 min)?
- Feedback: What are guests saying?
- Actions: Any needed tweaks for Week 2?

---

## 9. Quick Reference: One-Page Sprint Summary

```
╔════════════════════════════════════════════════════════════════════════╗
║  THOUSAND DAYS OF LOVE - 4-WEEK TRANSFORMATION ROADMAP                ║
║  Target Launch: Week 4 Friday | Wedding: November 20, 2025            ║
╚════════════════════════════════════════════════════════════════════════╝

┌────────────────────────────────────────────────────────────────────────┐
│ WEEK 1: Critical Fixes + Foundation (20-25 hours)                      │
├────────────────────────────────────────────────────────────────────────┤
│ IA FIXES (Mon-Thu):                                                    │
│  ✓ Remove AboutUsSection from /historia (30 min)                      │
│  ✓ Remove StoryTimeline from /galeria (4-6 hrs)                       │
│  ✓ Merge /local + /informacoes → /detalhes (6-8 hrs)                  │
│  ✓ Update navigation to 6 pages (1 hr)                                │
│  ✓ Investigate /convite purpose (1-3 hrs)                             │
│                                                                         │
│ COMPONENT LIBRARY (Mon-Fri):                                          │
│  ✓ Build VideoHero component (6-8 hrs)                                │
│  ✓ Build ImageHero component (4-6 hrs)                                │
│  ✓ Add post-RSVP guidance (3-4 hrs)                                   │
│                                                                         │
│ CONTENT (Weekend):                                                     │
│  ✓ Organize existing photos (2-3 hrs)                                 │
│  ✓ Select homepage hero content (1-2 hrs) 🔥 CRITICAL                 │
│                                                                         │
│ DELIVERABLES: Zero duplicates, 6-page nav, components ready, hero selected │
│ GO/NO-GO: Friday EOD - Cannot proceed without hero content selected    │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ WEEK 2: Homepage Transformation (25-30 hours)                          │
├────────────────────────────────────────────────────────────────────────┤
│ DEVELOPMENT (Mon-Wed):                                                 │
│  ✓ Implement homepage VideoHero (8-10 hrs)                            │
│  ✓ Redesign Event Details (4-6 hrs)                                   │
│  ✓ Build Story Preview split section (4-6 hrs)                        │
│                                                                         │
│ CONTENT (Tue-Thu):                                                     │
│  ✓ Pet portrait photo session (2-3 hrs) 🔥 CRITICAL                   │
│  ✓ Select timeline preview photos (1-2 hrs)                           │
│  ✓ Apartment dream photo (optional, 30 min)                           │
│                                                                         │
│ PET GALLERY (Thu-Fri):                                                │
│  ✓ Build horizontal scroll gallery (6-8 hrs)                          │
│                                                                         │
│ TESTING (Fri-Weekend):                                                │
│  ✓ Cross-browser testing (2 hrs)                                      │
│  ✓ Mobile responsiveness (2 hrs)                                      │
│  ✓ Performance optimization (2-3 hrs)                                 │
│                                                                         │
│ DELIVERABLES: Homepage fully cinematic, pet portraits captured, mobile-ready │
│ GO/NO-GO: Friday EOD - Could soft launch homepage if desired           │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ WEEK 3: Story + Gallery Pages (30-35 hours)                           │
├────────────────────────────────────────────────────────────────────────┤
│ TIMELINE TRANSFORMATION (Mon-Tue):                                    │
│  ✓ Build TimelineMomentCard component (6-8 hrs)                       │
│  ✓ Select 8-10 timeline photos (3-4 hrs) 🔥 CRITICAL                  │
│  ✓ Write timeline captions (2-3 hrs)                                  │
│  ✓ Implement full-bleed timeline (6-8 hrs)                            │
│                                                                         │
│ GALLERY ORGANIZATION (Wed-Thu):                                       │
│  ✓ Curate 200-250 gallery photos (8-10 hrs)                          │
│  ✓ Add year transitions (4-6 hrs)                                     │
│  ✓ Enhance StoryTimeline component (4-6 hrs)                          │
│                                                                         │
│ TESTING (Fri):                                                        │
│  ✓ Timeline UX testing (2 hrs)                                        │
│  ✓ Gallery navigation testing (2 hrs)                                 │
│  ✓ Content QA pass (1-2 hrs)                                          │
│                                                                         │
│ DELIVERABLES: Timeline with 8-10 full-bleed moments, gallery with 200+ photos │
│ GO/NO-GO: Friday EOD - Could launch site with core pages complete      │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ WEEK 4: Supporting Pages + Polish (20-25 hours)                       │
├────────────────────────────────────────────────────────────────────────┤
│ SUPPORTING HEROES (Mon-Tue):                                          │
│  ✓ Gift registry hero - apartment (4-6 hrs)                           │
│  ✓ RSVP hero - celebration (3-4 hrs)                                  │
│  ✓ Wedding location hero - venue (6-8 hrs)                            │
│                                                                         │
│ ANIMATION POLISH (Wed):                                               │
│  ✓ Global animation refinement (4-6 hrs)                              │
│                                                                         │
│ COMPREHENSIVE TESTING (Thu-Fri):                                      │
│  ✓ End-to-end user journey testing (3-4 hrs)                          │
│  ✓ Accessibility audit (2-3 hrs)                                      │
│  ✓ Performance optimization (2-3 hrs)                                 │
│  ✓ Cross-browser/device testing (2-3 hrs)                             │
│  ✓ Content final review (1-2 hrs)                                     │
│  ✓ Analytics setup (2-3 hrs)                                          │
│                                                                         │
│ DELIVERABLES: Production-ready website, all pages transformed, tests passing │
│ GO/NO-GO: Thursday EOD - Final approval for Friday launch              │
└────────────────────────────────────────────────────────────────────────┘

╔════════════════════════════════════════════════════════════════════════╗
║  LAUNCH FRIDAY WEEK 4                                                  ║
║  9:00 AM: Soft launch to family (5-10 people)                         ║
║  Weekend: Monitor, gather feedback, fix issues                        ║
║  Monday Week 5: FULL LAUNCH to all 60 guests 🎉                       ║
╚════════════════════════════════════════════════════════════════════════╝

┌────────────────────────────────────────────────────────────────────────┐
│ SUCCESS METRICS                                                         │
├────────────────────────────────────────────────────────────────────────┤
│ Conversion:                                                             │
│  • RSVP rate: 80-85% (from 50-60%)                                    │
│  • Gift registry engagement: 70%+ view, 60-70% value completed        │
│  • Story page: 70%+ visit /historia, 4+ min time                      │
│                                                                         │
│ Performance:                                                            │
│  • LCP: <2.5s (homepage), <3s (all pages)                             │
│  • Video autoplay: >80%                                                │
│  • Mobile load: <3s on 4G                                              │
│                                                                         │
│ Engagement:                                                             │
│  • Time on site: 3-5 minutes                                           │
│  • Pages per session: 2-3 (focused journey)                           │
│  • Bounce rate: <30%                                                   │
│  • Social sharing: 30%+ guests share site                             │
│                                                                         │
│ Qualitative:                                                            │
│  • "Best wedding website I've seen"                                   │
│  • Guests mention specific story details                              │
│  • Pets treated like celebrities at wedding                           │
│  • Emotional connection visible                                       │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ CRITICAL PATH DEPENDENCIES                                             │
├────────────────────────────────────────────────────────────────────────┤
│ Week 1 → Week 2:                                                       │
│  BLOCKER: Homepage hero content MUST be selected                      │
│  BLOCKER: VideoHero component MUST be built                           │
│                                                                         │
│ Week 2 → Week 3:                                                       │
│  BLOCKER: Timeline photos MUST be selected                            │
│  NICE-TO-HAVE: Pet portraits (can use existing if session fails)     │
│                                                                         │
│ Week 3 → Week 4:                                                       │
│  BLOCKER: Timeline must be transformed (6+ moments minimum)           │
│  NICE-TO-HAVE: Gallery 150+ photos (can launch with fewer)           │
│                                                                         │
│ Week 4 → Launch:                                                       │
│  BLOCKER: Couple final approval                                       │
│  BLOCKER: No critical bugs                                            │
│  NICE-TO-HAVE: Supporting page heroes (can launch without)           │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ TEAM TIME INVESTMENT                                                    │
├────────────────────────────────────────────────────────────────────────┤
│ Developer:   75-95 hours over 4 weeks (19-24 hrs/week)                │
│ Couple:      28-45 hours over 4 weeks (7-11 hrs/week)                 │
│ Photographer: 4-6 hours total (optional, can DIY)                     │
│                                                                         │
│ Week-by-Week:                                                          │
│  Week 1: 25-30 hrs total (dev + couple)                               │
│  Week 2: 30-40 hrs total (dev + couple + photo session)               │
│  Week 3: 33-42 hrs total (dev + couple)                               │
│  Week 4: 20-33 hrs total (dev + couple)                               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Emergency Contingency Plans

### Scenario: "We're Running Out of Time!"

**If Behind Schedule After Week 2**:

**MVP Launch Approach**:
```
Priority 1: Launch with Homepage + Timeline ONLY
- Homepage: Fully transformed with video hero ✅
- Timeline: Basic version with 6 moments (not full-bleed) ✅
- RSVP: Keep existing form (already works) ✅
- Gifts: Keep existing page (already works) ✅
- Gallery: Skip or basic version ✅
- Details: Merged page from Week 1 ✅

Result: Functional site with core story, defer polish to post-launch

Timeline:
- Stop at end of Week 2
- Polish what exists (2-3 days)
- Launch Friday Week 3 (1 week early)
- Enhance live site Week 3-4
```

**Defer Non-Critical Features**:
```
CAN LAUNCH WITHOUT:
- Supporting page heroes (gifts, RSVP, venue)
- Pet gallery (use existing AboutUs section)
- Full gallery (launch with 50 photos, add more later)
- Animation polish (simple is fine)
- Video compilations

CANNOT LAUNCH WITHOUT:
- IA fixes (duplicates removed) ❌
- Homepage transformation ❌
- Basic timeline ❌
- RSVP functionality ❌
- Mobile responsiveness ❌
```

### Scenario: "Content Gathering Is Failing"

**If Can't Get Pet Portraits**:
```
Plan A: Use best existing photos
- Find 4 good existing pet photos
- Edit consistently (same crop, same filter)
- Use in horizontal gallery with existing layout

Plan B: Mix existing + new
- Capture 1-2 pets successfully
- Use existing for the rest
- Consistency through editing

Plan C: Skip pet gallery
- Keep current AboutUs with emoji circles
- Add "Meet Our Pets" page post-launch
- Defer to after wedding (make it post-wedding update)
```

**If Can't Get Timeline Photos**:
```
Plan A: Use symbolic imagery
- WhatsApp interface (first "oi")
- Calendar graphic (anniversary dates)
- Map pins (travel locations)
- Mix symbols + existing photos

Plan B: Text-only timeline moments
- Beautiful typography on solid backgrounds
- Botanical decorations (match site theme)
- Focus on storytelling through words
- Photos used only where available

Plan C: Hybrid approach (RECOMMENDED)
- 3-4 moments with great photos (full-bleed)
- 3-4 moments with text-only cards
- Result: Still tells complete story
```

**If Can't Get Homepage Hero Video**:
```
Plan A: Static image with Ken Burns
- Use best couple photo at home
- Apply slow zoom/pan animation
- iMovie or Windows Photos (10 min to create)
- Export as video, use in VideoHero

Plan B: Multiple photos slideshow
- 5-7 couple photos in sequence
- 3 seconds each
- Cross-fade transitions
- Background music (optional)

Plan C: Single static image
- Use ImageHero component instead
- Beautiful couple photo with parallax
- Add animated text overlays
- Still cinematic, just not video
```

### Scenario: "Technical Issues Are Blocking Us"

**If Video Autoplay Not Working**:
```
Issue: Videos not autoplaying on mobile/Safari
Solution:
1. Ensure video is muted (required for autoplay)
2. Add playsinline attribute
3. Provide fallback: Static poster image
4. Test on real devices (not just dev tools)
5. Worst case: Show static images on mobile

Timeline: 2-3 hours to debug and fix
Impact: Can launch with static images if needed
```

**If Performance Is Poor**:
```
Issue: Page load times >5 seconds
Solutions (in order of impact):
1. Compress video files more aggressively (50% quality OK)
2. Convert all images to WebP (80% smaller)
3. Lazy load everything below fold
4. Remove videos from mobile (static only)
5. Reduce gallery photos (100 instead of 200)
6. Implement pagination (not infinite scroll)

Timeline: 4-6 hours aggressive optimization
Target: Get to <3s (even if lower quality)
```

**If Browser Compatibility Issues**:
```
Issue: Site broken on Safari/Firefox/Edge
Solutions:
1. Graceful degradation (simpler version for old browsers)
2. Remove problematic animations (static is fine)
3. Use CSS fallbacks (grid → flexbox)
4. Test on actual browsers (not just Chrome)
5. Provide "Best viewed on Chrome" message (last resort)

Timeline: 3-4 hours to add fallbacks
Impact: Most guests use modern browsers, acceptable
```

### Scenario: "Couple Isn't Happy with Design"

**If Couple Doesn't Like Transformation**:
```
Issue: "This doesn't feel like us"
Response Process:
1. Understand specific concerns (too flashy? too minimal?)
2. Show before/after comparison
3. Offer tweaks (reduce animations, change colors)
4. Test with friends (get outside perspective)
5. Compromise: Dial back intensity 20-30%

Common Concerns:
- "Video is too intimate" → Use photo instead
- "Too much motion" → Reduce animations
- "Text hard to read" → Increase contrast
- "Doesn't match invitation" → Adjust colors

Timeline: 2-3 days for revisions
Impact: Better to launch happy than on time
```

**If Couple Keeps Requesting Changes**:
```
Issue: Scope creep, endless revisions
Response:
1. Set revision limit (2 rounds per feature)
2. Focus on critical changes only
3. Explain timeline impact ("This delays launch 1 week")
4. Create "Phase 2" list (post-launch enhancements)
5. Couple final sign-off required (no more changes)

Strategy:
- Lock content after Week 3
- Week 4 is polish only (no new content)
- Launch what exists, iterate live
- Most changes can happen post-launch
```

### Scenario: "Wedding Date Is Approaching Fast"

**If 2 Weeks to Wedding**:
```
Emergency Timeline:
- Week 1: IA fixes + homepage hero ONLY
- Week 2: Polish homepage + launch

Skip:
- Timeline transformation (keep existing cards)
- Gallery organization (keep existing)
- Supporting page heroes
- Animation polish

Launch:
- Homepage: Transformed ✅
- Everything else: Current state ✅
- Post-wedding: Complete transformation

Result: Core experience improved, rest functional
```

**If 1 Week to Wedding**:
```
Panic Mode:
- 2 days: Homepage video hero ONLY
- 1 day: Mobile testing
- 1 day: Content review
- Launch: Homepage upgraded, rest unchanged

Reality:
- Too late for major transformation
- Focus on one hero feature (homepage)
- Launch with that + current pages
- Post-wedding: Full transformation
```

**If Wedding Already Passed**:
```
Post-Wedding Approach:
- Transform into "Our Wedding Story" site
- Add actual wedding photos to gallery
- Update timeline with wedding day
- No rush, can take 6-8 weeks
- Focus on perfect execution over speed
```

---

## 11. Post-Launch Enhancement Roadmap

### Week 5-6: Monitoring & Quick Fixes

**Immediate Post-Launch (Days 1-7)**:
- Monitor analytics daily
- Track RSVP conversion rate
- Answer guest questions
- Fix critical bugs immediately
- Gather qualitative feedback

**Week 5 Actions**:
- Optimize based on analytics (slow pages, high drop-offs)
- Add any missing practical info (parking, hotels)
- Update content based on guest questions
- Fine-tune animations (if too much/too little)
- Add any missing photos (if couple finds more)

**Week 6 Actions**:
- A/B test homepage (video vs static)
- Try different CTA language
- Experiment with pet gallery format
- Test timeline layout variations
- Prepare wedding day content collection plan

### Post-Wedding: "Our Wedding Story" Transformation

**Week After Wedding**:
- Collect all wedding day photos/videos
- Organize by photographer, guests, couple
- Select 50-100 best moments
- Plan final timeline moment (Day 1000)

**Month After Wedding**:
- Add "Wedding Day" section to timeline
- Upload wedding photo gallery
- Create wedding day video compilation
- Update homepage hero (wedding highlight)
- Add "Thank You" page for guests

**Transform Site Purpose**:
```
PRE-WEDDING SITE:
- Goal: Get RSVPs, share story, build anticipation
- Focus: Timeline leading TO the wedding
- CTA: "Confirm Your Presence"

POST-WEDDING SITE:
- Goal: Share memories, thank guests, preserve story
- Focus: Complete 1000-day journey including wedding
- CTA: "See Wedding Photos"

Changes:
- Remove RSVP page (or convert to guestbook)
- Update homepage hero (wedding highlight)
- Add Day 1000 timeline moment (ceremony)
- Expand gallery (wedding photos)
- Add "Thank You" messages
- Preserve as digital memory book
```

### Long-Term Enhancements (Months Later)

**Anniversary Updates**:
- 1-year anniversary: Add "Year 1 of Marriage" section
- 2-year anniversary: Update with new photos
- 5-year anniversary: Full site refresh
- 10-year anniversary: Decade retrospective

**Feature Ideas**:
- Guest comments/messages section
- Wedding video embed (vows, speeches)
- "Where Are They Now" updates
- Pet updates (inevitable 5th, 6th dogs)
- Home renovation journey
- Travel adventures
- Maybe baby announcements (if in future)

**Technical Improvements**:
- Convert to blog/journal
- Add CMS (Sanity, Contentful)
- Implement search
- Add download all photos feature
- Create custom domain (thousand-days.com)

---

## Final Thoughts

This roadmap provides a **phased, pragmatic approach** to transforming the wedding website in 4 weeks. Key principles:

1. **Week 1 is critical** - IA fixes unlock everything else
2. **Content gathering runs parallel** - Don't block development
3. **MVP mindset** - Launch with core, enhance later
4. **Mobile-first** - 70-80% of guests on phones
5. **Couple approval matters** - They must love it
6. **Launch on time** - Better good and on time than perfect and late
7. **Post-launch iteration** - Can improve live site

The website tells a beautiful 1000-day love story. The transformation should honor that story with cinematic visuals while maintaining the authentic, intimate voice that makes Hel & Ylana's relationship special.

**Remember**: Perfect is the enemy of shipped. Launch with the core experience strong, iterate based on real guest feedback, and celebrate the milestone of Nov 20, 2025.

---

**Document Version**: 1.0
**Created**: October 11, 2025
**Purpose**: Master implementation roadmap for wedding website transformation
**Next Steps**: Review with Hel, begin Week 1 Monday

**Questions/Feedback**: Ready to start Week 1? Let's build something beautiful. 🎉
