# Information Architecture Audit & Recommendations
## Wedding Website: Hel & Ylana - Thousand Days of Love

**Audit Date:** October 11, 2025
**Auditor:** UX Research Team
**Project Context:** Intimate wedding (60 guests), introverted couple, November 20, 2025

---

## Executive Summary

The current wedding website suffers from **severe content duplication** and **unclear page hierarchy**, creating a confusing user experience that undermines the couple's authentic story. Three critical issues require immediate attention:

1. **Duplicate Content Crisis:** `AboutUsSection` appears on both homepage and `/historia`, while `StoryTimeline` duplicates across `/historia` and `/galeria`, causing content fatigue and diluting narrative impact
2. **Purpose Confusion:** Multiple pages compete for the same content (story/gallery overlap), while critical pages like `/convite` and `/informacoes` have unclear purposes or generic content
3. **Navigation Bloat:** 8 pages in navigation is excessive for 60 guests with simple goals (RSVP, gifts, location)

**Quick Wins:** Remove duplicates, consolidate story/gallery into cohesive narrative flow, establish clear page purposes, reduce navigation to 5-6 essential pages.

**Impact:** Current structure requires users to visit 3+ pages to understand the complete story, leading to drop-offs and incomplete RSVPs.

---

## 1. Current State Analysis

### Page Inventory & Content Audit

#### ✅ **Homepage (`/`)** - STRONG FOUNDATION
**Status:** Well-structured, clear purpose
**Content Quality:** Authentic voice, compelling
**Sections:**
- HeroSection (monogram, countdown, wedding details) ✅
- StoryPreview (3 milestone cards) ✅
- AboutUsSection (personalities, pets) ⚠️ **DUPLICATE**
- QuickPreview (quick links grid) ✅
- WeddingLocation (map/details) ⚠️ **COULD BE SEPARATE PAGE**

**Verdict:** Strong but bloated. 5 sections is too much for landing page. Last two sections dilute focus.

---

#### ⚠️ **Full Story (`/historia`)** - DUPLICATE CRISIS
**Status:** Purpose unclear, major duplication
**Content Quality:** Good but redundant
**Sections:**
- Hero text section ✅
- StoryTimeline (database-driven events) ⚠️ **ALSO IN /galeria**
- AboutUsSection ❌ **DUPLICATE FROM HOMEPAGE**
- "Back to Home" CTA ✅

**Critical Issues:**
- AboutUsSection identical to homepage = content fatigue
- Timeline appears here AND in gallery = narrative confusion
- Page name "Full Story" implies comprehensive narrative, but timeline is in gallery too
- Unclear if this is "text story" vs "visual story" (gallery)

**User Confusion:** "Do I read the story here, or in gallery? Are they different?"

---

#### ❌ **Gallery (`/galeria`)** - IDENTITY CRISIS
**Status:** Severe purpose overlap with `/historia`
**Content Quality:** Rich media but confusing structure
**Sections:**
- Hero text section ✅
- StoryTimeline ❌ **DUPLICATE FROM /historia**
- MasonryGallery (photo grid) ✅
- VideoGallery ✅
- Featured Memories section ✅
- CTA section ✅

**Critical Issues:**
- Timeline duplication creates narrative disconnect
- Is this "gallery of photos" or "story told through media"?
- Featured Memories + Timeline + Gallery = redundant visual storytelling
- No clear flow: text timeline → photos → videos → featured → CTA

**User Confusion:** "Wait, didn't I just see this timeline on the story page?"

---

#### ✅ **Gift Registry (`/presentes`)** - CLEAR PURPOSE
**Status:** Well-defined, functional
**Content Quality:** Authentic voice ("Casa própria depois de anos")
**Sections:**
- Header with authentic copy ✅
- Stats grid (total, completed, values) ✅
- Filters (search, category, priority) ✅
- Gift cards grid ✅
- CTA section ✅

**Verdict:** KEEP AS-IS. Best-scoped page on site. Clear purpose, no duplication, authentic voice.

---

#### ✅ **RSVP (`/rsvp`)** - FUNCTIONAL
**Status:** Simple, clear purpose
**Content Quality:** Functional, minimal
**Sections:**
- Header text ✅
- Search form (find guest by name) ✅
- Results cards ✅

**Verdict:** KEEP AS-IS. Serves one purpose well. Could enhance with "what happens after RSVP" guidance.

---

#### ⚠️ **Wedding Location (`/local`)** - SINGLE-SECTION PAGE
**Status:** Underutilized, but functional
**Content Quality:** Comprehensive location info
**Sections:**
- WeddingLocation component (venue details, map, transportation) ✅

**Issue:** Entire page is ONE component. Could this be merged with homepage or /informacoes?

**Verdict:** Evaluate if standalone page needed vs. homepage section.

---

#### ❓ **Invitation (`/convite`)** - PURPOSE UNCLEAR
**Status:** Unknown content, metadata exists
**Content Quality:** Cannot assess (WeddingInvitation component not audited)
**Metadata:** "Convite de casamento... nosso salão de festas"

**Questions:**
- Is this digital invitation design (shareable image)?
- Is this wedding details page?
- Is this duplicate of homepage hero?
- Do users actually visit this or is it just metadata?

**Verdict:** NEEDS INVESTIGATION. Either enhance with clear purpose or remove.

---

#### ⚠️ **Information (`/informacoes`)** - GENERIC CONTENT DUMP
**Status:** FAQ page with standard wedding info
**Content Quality:** Comprehensive but generic
**Sections:**
- Header ✅
- Local/Venue details ❌ **DUPLICATES /local**
- Timeline/schedule ✅
- Dress code ✅
- Parking ✅
- Hotels ✅
- FAQ accordion ✅
- Contact CTA ✅

**Critical Issues:**
- Venue section duplicates `/local` page
- Standard FAQ doesn't reflect couple's authentic voice
- Generic hotel recommendations lack personal touch
- Parking info repeated from `/local`

**User Confusion:** "Do I go to /local or /informacoes for venue info?"

---

## 2. Duplicate Content Resolution

### Identified Duplicates & Recommended Actions

#### 🔴 CRITICAL: AboutUsSection (Homepage + /historia)

**Current State:**
- **Homepage:** Full AboutUsSection with personalities, interests, 4 pets
- **/historia:** Identical AboutUsSection at bottom of page

**User Impact:**
- Content fatigue: "Why am I reading this again?"
- Dilutes narrative impact: Second exposure = less emotional
- Wastes user time navigating between pages

**RECOMMENDATION: Remove from /historia entirely**

**Rationale:**
- Homepage = broad introduction → AboutUs fits naturally
- /historia = specific narrative journey → AboutUs disrupts timeline flow
- Users who visit /historia already saw AboutUs on homepage
- If they land directly on /historia (rare), they can discover AboutUs via homepage link

**Implementation:**
```typescript
// src/app/historia/page.tsx
// DELETE LINE 143: <AboutUsSection />
// REPLACE WITH: Link to homepage section
<Link href="/#about-us">Conheça Mais Sobre Nós</Link>
```

**Alternative (if keeping):** Create /historia-specific variant focusing on relationship dynamics during timeline events, not general "about us" content.

---

#### 🔴 CRITICAL: StoryTimeline (Historia + Galeria)

**Current State:**
- **/historia:** Database-driven timeline with title "1000 Dias: A Linha do Tempo"
- **/galeria:** Same database-driven timeline with title "Nossa Linha do Tempo"

**User Impact:**
- Severe narrative confusion: "Is this the same timeline or different?"
- Weakens both pages: Neither owns the timeline exclusively
- Wastes development effort: Same component rendered twice

**RECOMMENDATION: Consolidate into single enhanced page**

**Option A: Timeline lives in /historia ONLY (RECOMMENDED)**
- /historia becomes THE comprehensive story page
- Timeline = primary storytelling device
- Remove timeline from /galeria entirely
- /galeria becomes pure photo/video gallery with filters/categories

**Option B: Create new /timeline page (better UX)**
- Remove from both current pages
- Create dedicated `/nossa-jornada` or `/linha-do-tempo` page
- Enhanced timeline with richer interactions
- Both /historia and /galeria link to it
- Gallery shows photo grid organized by timeline milestones

**Option C: Smart component variants (complex but powerful)**
- **/historia:** Text-focused timeline (dates + descriptions + key moments)
- **/galeria:** Visual timeline (dates + thumbnail galleries per event)
- Both use same data, different presentations
- Clearly labeled: "Nossa História em Palavras" vs "Nossa História em Fotos"

**RECOMMENDED IMPLEMENTATION: Option A** (simplest, fastest)

```typescript
// src/app/historia/page.tsx - KEEP timeline
<StoryTimeline
  events={events}
  title="Nossa Jornada: 1000 Dias de Amor"
  description="Do Tinder ao altar: todos os momentos que nos trouxeram aqui"
  variant="comprehensive" // full text descriptions
/>

// src/app/galeria/page.tsx - REMOVE timeline, enhance photo org
// DELETE LINES 307-311: <StoryTimeline ... />
// REPLACE WITH: Photo categories organized by timeline periods
<PhotoGalleryByTimeline events={timelineEvents} media={mediaItems} />
```

---

#### 🟡 MEDIUM: Venue Details (Local + Informacoes)

**Current State:**
- **/local:** Full WeddingLocation component (map, address, transportation)
- **/informacoes:** Venue details section duplicates basic info

**RECOMMENDATION: Merge pages or eliminate duplication**

**Option A: Keep separate, remove duplication**
- /local = detailed venue guide (map, directions, parking, landmarks)
- /informacoes = FAQ + timeline + dress code (NO venue details)
- /informacoes links to /local for location questions

**Option B: Merge into single /detalhes or /informacoes page** (RECOMMENDED)
- Single comprehensive page with sections:
  - Venue & Location (map, address)
  - Schedule & Timeline
  - Dress Code & Attire
  - Transportation & Parking
  - Hotels & Accommodation
  - FAQ
- Eliminates need for separate /local page
- Reduces navigation complexity

---

## 3. Page-by-Page Recommendations

### 🏠 Homepage (`/`)

**KEEP:**
- ✅ HeroSection (monogram, countdown, wedding details)
- ✅ StoryPreview (3 milestone cards with CTA to full story)
- ✅ QuickPreview (quick actions grid)

**REMOVE:**
- ❌ AboutUsSection → Move to dedicated /sobre-nos page OR keep only on homepage
- ❌ WeddingLocation → Simplify to quick info card + CTA to /local

**ADD:**
- ➕ Social proof: "60 intimate guests celebrating with us"
- ➕ Last-minute RSVP reminder callout (if wedding approaching)
- ➕ Featured photo/video hero (emotional hook before text)

**REPLACE:**
- 🔄 Full WeddingLocation section → Location quick preview card (address + map thumbnail + CTA)

**PRIORITY:** 🟡 Week 1-2 (Medium urgency, high impact)

**RECOMMENDED STRUCTURE:**
```
/ (Homepage)
├── HeroSection (monogram, countdown, date/time/location)
├── FeaturedMediaHero (1 powerful photo/video capturing their essence)
├── StoryPreview (3 milestone cards: Tinder → Casa Própria → 1000 Days)
├── QuickActionsGrid (RSVP, Gifts, Story, Location)
├── LocationQuickPreview (address, map thumbnail, "Ver Detalhes" CTA)
└── AboutUsSnippet (brief intro with CTA to /sobre-nos)
```

**Rationale:**
- Reduce homepage to 6 focused sections
- Prioritize RSVP conversion (primary goal)
- Tease story without overwhelming
- Eliminate full components (AboutUs, Location) in favor of previews + CTAs

---

### 📖 Full Story (`/historia`)

**KEEP:**
- ✅ Hero text section
- ✅ StoryTimeline (ENHANCED as primary content)
- ✅ Back navigation CTA

**REMOVE:**
- ❌ AboutUsSection (duplicate from homepage)

**ADD:**
- ➕ Timeline milestone media (inline photos/videos per event)
- ➕ "Behind the scenes" text stories for major milestones
- ➕ Emotional section headers: "Como Começou", "O Caminho", "1000 Dias Depois"
- ➕ Relationship stats: "434 dias até a casa própria", "600 dias até o pedido"

**REPLACE:**
- 🔄 Generic timeline → Rich storytelling timeline with expandable details

**PRIORITY:** 🔴 Critical (Week 1, blocks other improvements)

**RECOMMENDED STRUCTURE:**
```
/historia (Full Story Page)
├── HeroSection (title: "Mil Dias: Nossa Jornada Completa")
├── IntroText ("Do 'oi' sem graça ao 'sim' emocionado")
├── StoryTimelineEnhanced
│   ├── Phase 1: "Os Primeiros Dias" (Day 1-100)
│   ├── Phase 2: "Construindo Juntos" (Day 100-500)
│   ├── Phase 3: "Nossa Casa, Nossa Família" (Day 500-900)
│   └── Phase 4: "Caminhando Pro Altar" (Day 900-1000)
├── MilestoneGallery (key photos per phase)
└── CTAs (RSVP + "Ver Fotos Completas")
```

**Rationale:**
- Own the timeline exclusively
- No duplication = stronger narrative
- Enhanced with media = visual storytelling
- Clear progression = emotional journey
- Remove distractions (AboutUs) = focused experience

---

### 📸 Gallery (`/galeria`)

**KEEP:**
- ✅ Hero text section
- ✅ MasonryGallery (photo grid)
- ✅ VideoGallery
- ✅ Featured Memories section
- ✅ CTA section

**REMOVE:**
- ❌ StoryTimeline (moves to /historia exclusively)

**ADD:**
- ➕ Photo filters by timeline phase: "Primeiros Dias", "Casa Própria", "Família de 4 Pets"
- ➕ "Photographer" credit section (if applicable)
- ➕ Download/share functionality per photo
- ➕ "Our favorite moments" curator commentary

**REPLACE:**
- 🔄 Generic featured memories → Curated "Stories Behind the Photos" with personal captions

**PRIORITY:** 🔴 Critical (Week 1, resolves duplication)

**RECOMMENDED STRUCTURE:**
```
/galeria (Pure Visual Gallery)
├── HeroSection (title: "Nossos 1000 Dias em Imagens")
├── TimelineFilters (organize by story phases, not duplicate timeline)
├── MasonryPhotoGallery (infinite scroll, lightbox)
├── VideoHighlightsSection (featured videos)
├── BehindTheScenesSection (personal captions, commentary)
└── CTAs (RSVP + "Leia Nossa História")
```

**Rationale:**
- Eliminate timeline duplication
- Focus on visual storytelling exclusively
- Timeline phase filters ≠ timeline component (smart organization, not duplication)
- Personal captions add authentic voice
- Cross-link to /historia for full narrative

---

### 🎁 Gift Registry (`/presentes`)

**KEEP AS-IS:**
- ✅ Everything. This page works perfectly.

**MINOR ENHANCEMENTS:**
- ➕ "Why we need this" story per high-priority item
- ➕ Progress bar visualization for total registry completion
- ➕ Thank you message after purchase
- ➕ "Instead of gifts, here's what really matters" emotional section

**PRIORITY:** 🟢 Nice to have (Week 3+, page already strong)

---

### ✉️ RSVP (`/rsvp`)

**KEEP:**
- ✅ Search form
- ✅ Results cards
- ✅ Plus-one functionality

**ADD:**
- ➕ Post-RSVP guidance: "What happens next?"
- ➕ Dietary restrictions field
- ➕ Message to couple field
- ➕ "Share with your group" WhatsApp button
- ➕ RSVP deadline countdown

**REPLACE:**
- 🔄 Bare-bones interface → Warmer, on-brand design matching invitation aesthetic

**PRIORITY:** 🟡 Week 1-2 (High importance, functional but could be warmer)

**RECOMMENDED ADDITIONS:**
```typescript
// After successful RSVP
<PostRSVPGuidance>
  <h3>Confirmado! Agora o quê?</h3>
  <Step>1. Salve a data no calendário</Step>
  <Step>2. Veja a lista de presentes (se quiser ajudar)</Step>
  <Step>3. Confira como chegar à Casa HY</Step>
  <Step>4. Aguarde nosso contato mais perto do grande dia</Step>
</PostRSVPGuidance>
```

---

### 📍 Wedding Location (`/local`)

**OPTION A: Keep standalone (current approach)**

**KEEP:**
- ✅ WeddingLocation component (comprehensive)

**ADD:**
- ➕ Weather forecast for November 20 (Fortaleza)
- ➕ Nearby restaurants for post-event dining
- ➕ "What to do in Fortaleza" for out-of-town guests
- ➕ Ride-sharing tips specific to neighborhood

**PRIORITY:** 🟢 Nice to have

---

**OPTION B: Merge with /informacoes (RECOMMENDED)**

See [Option B under /informacoes section below]

---

### ❓ Invitation (`/convite`)

**CURRENT STATUS:** Unknown content, needs investigation

**RECOMMENDATION PENDING CONTENT REVIEW:**

**If digital invitation design:**
- Keep as shareable invitation page
- Add "Download as image" functionality
- Add "Share via WhatsApp" button
- Optimize for mobile screenshots

**If duplicate of homepage:**
- ❌ REMOVE. Homepage serves this purpose.

**If generic wedding details:**
- ❌ REMOVE. Merge with /informacoes.

**PRIORITY:** 🔴 Critical (Investigate first, then decide)

---

### ℹ️ Information (`/informacoes`)

**OPTION A: Keep separate, remove duplication**

**REMOVE:**
- ❌ Venue/location details (duplicates /local)

**KEEP:**
- ✅ Timeline/schedule
- ✅ Dress code
- ✅ FAQ
- ✅ Contact

**ADD:**
- ➕ Kid-friendly info (couple's authentic voice: "Yes, bring the kids!")
- ➕ Photography policy
- ➕ Social media hashtag
- ➕ Gift-free option messaging

**PRIORITY:** 🟡 Week 1-2

---

**OPTION B: Merge /local + /informacoes (RECOMMENDED)**

**New Page: `/detalhes` or `/guia-completo`**

**Structure:**
```
/detalhes (Comprehensive Guide)
├── Section 1: Venue & Location
│   ├── Address & map (from /local)
│   ├── How to get there
│   └── Parking & transportation
├── Section 2: Schedule & Timeline
│   ├── Ceremony: 10:30am
│   ├── Reception: 12:00pm
│   └── Expected end: 2:00pm
├── Section 3: Dress Code & Attire
│   ├── Social attire guidelines
│   └── Weather considerations (Ceará in November)
├── Section 4: Accommodation
│   ├── Hotel recommendations (with personal notes!)
│   └── Neighborhood dining spots
├── Section 5: FAQ
│   ├── Kid-friendly?
│   ├── Plus-ones?
│   ├── Photography policy
│   └── Gifts/registry questions
└── Section 6: Contact & Support
    └── WhatsApp/email for questions
```

**Rationale:**
- Eliminate /local vs /informacoes confusion
- Single source of truth for all practical details
- Better SEO (one comprehensive page vs scattered info)
- Easier to maintain (update once, not across 2 pages)
- Clearer navigation label: "Detalhes do Casamento" vs "Local" + "Informações"

**PRIORITY:** 🔴 Critical (Week 1, major IA simplification)

---

## 4. User Flow Optimization

### Primary User Journeys

#### Journey 1: First-Time Visitor (Awareness → Interest → RSVP)

**CURRENT FLOW (Problematic):**
```
Landing → Homepage (5 sections, overwhelming)
  ↓ Confused: "Do I read story here or /historia?"
  ↓ Clicks "Leia Nossa História Completa"
  ↓
/historia → Sees AboutUsSection again (content fatigue)
         → Sees timeline
  ↓ Curious: "Are there photos?"
  ↓ Clicks to /galeria
  ↓
/galeria → Sees timeline AGAIN (confusion: "didn't I see this?")
  ↓ Frustrated, leaves without RSVP
```

**PAIN POINTS:**
- Too many sections on homepage = analysis paralysis
- Duplicate AboutUs = "why am I reading this again?"
- Duplicate timeline = "is this the same content?"
- No clear path to RSVP after story exploration
- 3-4 page visits required to understand complete story

**OPTIMIZED FLOW (Recommended):**
```
Landing → Homepage (4 focused sections)
  ├── Hero (who/what/when/where/countdown)
  ├── Story Preview (3 milestone cards with emotional hooks)
  ├── Quick Actions (RSVP prominent)
  └── Location Preview (map thumbnail + CTA)
  ↓ Intrigued by story preview
  ↓ Clicks "Leia Nossa Jornada Completa"
  ↓
/historia → Enhanced timeline (NO duplicates, rich storytelling)
          → Inline media per milestone
          → Clear progression (Day 1 → 1000)
          → CTA: "Confirme Sua Presença"
  ↓ Emotionally engaged
  ↓ Clicks RSVP CTA
  ↓
/rsvp → Confirms attendance
      → Sees post-RSVP guidance
      → Optional: view gifts, location details
```

**IMPROVEMENTS:**
- 2 page visits vs 3-4 (faster conversion)
- No content duplication = stronger narrative impact
- Clear CTAs guide to RSVP at emotional peak
- Post-RSVP guidance reduces "what now?" confusion
- Mobile-friendly flow (less scrolling, fewer pages)

**SUCCESS METRICS:**
- RSVP conversion rate >80% (currently unknown, estimate 50-60% with duplication)
- Average pages per session: 2-3 (down from 4-5)
- Bounce rate: <30% (currently likely 40-50%)

---

#### Journey 2: Returning Visitor (Direct RSVP Intent)

**CURRENT FLOW (Acceptable):**
```
Direct link to /rsvp
  ↓
Search by name
  ↓
Confirm attendance
  ↓ (End - unclear next steps)
```

**PAIN POINTS:**
- No post-RSVP guidance
- Unclear what happens after confirmation
- No prompt to share with other guests
- No connection to story/emotional engagement

**OPTIMIZED FLOW:**
```
Direct link to /rsvp (or homepage RSVP button)
  ↓
Search by name
  ↓
Confirm attendance
  ↓
Post-RSVP Success Page
  ├── "Confirmado! Mal podemos esperar pra te ver"
  ├── Save-to-calendar button (with reminder)
  ├── "Share with your group" WhatsApp link
  ├── "Next steps" guidance:
  │   └── Check out gifts (optional)
  │   └── See venue location/directions
  │   └── Read our full story
  └── Emotional close: "Significa muito ter você conosco"
```

**IMPROVEMENTS:**
- Clear post-action guidance (reduces "what now?" anxiety)
- Calendar integration (reduces no-shows)
- WhatsApp sharing (viral growth for group RSVPs)
- Emotional connection (even on functional page)
- Optional exploration paths (gifts, story, location)

---

#### Journey 3: Story Explorer (Emotional Connection Seeker)

**CURRENT FLOW (Confusing):**
```
Homepage → "Leia Nossa História"
  ↓
/historia → Timeline + AboutUs (duplicate)
  ↓ "Are there photos?"
  ↓
/galeria → Timeline AGAIN + photos
  ↓ Confused about difference
  ↓ Maybe checks /informacoes for more info
  ↓ Generic FAQ doesn't deepen connection
```

**PAIN POINTS:**
- Timeline duplication creates confusion
- Story spread across multiple pages
- No clear narrative arc (where does story start/end?)
- AboutUs duplication weakens emotional impact
- Generic information doesn't extend story

**OPTIMIZED FLOW:**
```
Homepage → Story preview cards (emotional hooks)
  ↓ Intrigued
  ↓ Clicks "Nossa Jornada Completa"
  ↓
/historia → Enhanced timeline (exclusive)
          ├── Phase 1: Primeiros Dias (Day 1-100)
          ├── Phase 2: Construindo Juntos (Day 100-500)
          ├── Phase 3: Casa Própria (Day 500-900)
          └── Phase 4: Caminhando Pro Altar (Day 900-1000)
          → Inline photos per phase
          → Personal commentary/behind-the-scenes
          → Emotional progression clear
  ↓ Emotionally invested
  ↓ CTA: "Veja Mais Fotos" + "Confirme Sua Presença"
  ↓
/galeria → Pure photo gallery organized by phases
         → NO timeline duplication
         → Personal captions add depth
         → Video highlights
  ↓ Deeply engaged
  ↓ Clicks RSVP (high conversion, emotional peak)
```

**IMPROVEMENTS:**
- Clear narrative structure (phases guide exploration)
- No duplication = each page adds value
- Inline media in /historia satisfies curiosity without forcing page change
- Gallery extends story visually (not duplicates it)
- Multiple RSVP CTAs at emotional peaks
- Story → Photos → RSVP flow optimized for conversion

---

#### Journey 4: Gift Giver (Post-RSVP Contribution)

**CURRENT FLOW (Functional):**
```
Confirmed RSVP (no guidance)
  ↓ Remembers: "I should get a gift"
  ↓ Returns to site, finds /presentes
  ↓
Browse gifts → Filter → Select → PIX payment
  ↓ (End - no follow-up)
```

**PAIN POINTS:**
- No prompt to view gifts after RSVP
- Post-purchase thank you generic/missing
- No context for why gifts matter (connection to story)
- No "instead of gifts" alternative mentioned

**OPTIMIZED FLOW:**
```
Complete RSVP
  ↓
Post-RSVP page includes: "Quer ajudar a construir nosso lar?"
  ↓ (Optional path)
  ↓
/presentes → Authentic intro ("Esse apartamento que o Hel sonhava...")
           → Stats show progress
           → High-priority items include "why we need this" story
           → Filters help navigate
           → Clear PIX payment flow
  ↓
Purchase confirmed
  ↓
Thank You Page
  ├── "Vocês estão ajudando a transformar sonho em realidade"
  ├── Personal message from couple
  ├── Updated registry stats (gamification)
  ├── Option to share registry with others
  └── Reminder: "Te vemos dia 20 na Casa HY!"
```

**IMPROVEMENTS:**
- Explicit RSVP → Gifts connection (reduces friction)
- Storytelling throughout (gifts aren't transactional)
- Post-purchase emotional close (strengthens relationship)
- Sharing option (viral growth, social proof)
- Reminder of wedding (reduces no-shows)

---

### Cross-Journey Insights

**Key Touchpoints for All Journeys:**
1. **Homepage** = First impression, emotional hook, clear CTAs
2. **/historia** = Narrative depth, emotional investment
3. **/rsvp** = Conversion moment, needs friction reduction + post-action guidance
4. **/presentes** = Optional but valuable, needs authentic storytelling
5. **/detalhes** = Practical info, reduces anxiety, enables attendance

**Universal Improvements:**
- Reduce page count (fewer navigation decisions)
- Eliminate duplication (each page adds unique value)
- Clear CTAs at emotional peaks (RSVP after story engagement)
- Post-action guidance (reduce "what now?" drop-offs)
- Mobile-first (60 guests, likely mobile-heavy usage)
- Authentic voice throughout (introverted, casual, real)

---

## 5. New Opportunities & Missing Content

### Pages That Should Exist

#### 🆕 `/sobre-nos` (About Us Dedicated Page)

**WHY:** AboutUs currently duplicates across homepage + /historia, or gets removed entirely. Deserves dedicated space.

**CONTENT:**
- **Section 1:** Who we are (personalities, introversion, authenticity)
- **Section 2:** What we love (food, wine, travel, fitness, pets)
- **Section 3:** Our 4-pet family (Linda, Cacao, Olivia, Oliver with photos!)
- **Section 4:** How we met (brief, links to /historia)
- **Section 5:** Why this wedding matters (intimate, authentic, our way)

**DIFFERENTIATION FROM /historia:**
- /historia = chronological narrative (Day 1 → 1000)
- /sobre-nos = thematic exploration (who we are as people/couple)

**PRIORITY:** 🟢 Nice to have (Week 3+)

---

#### 🆕 `/nossos-pets` (Pet Family Showcase)

**WHY:** 4 pets is a huge part of their identity, deserves spotlight (especially for introverted couple who loves their animals)

**CONTENT:**
- Hero section: "Nossa Família de 6"
- Individual pet profiles (photos, personalities, quirks)
- "How we became a family of 6" story (Linda → Cacao → 4 puppies)
- Photo gallery by pet
- "They won't be at the wedding, but they're in our hearts"

**AUTHENTIC VOICE EXAMPLES:**
- Linda: "Veio primeiro. Autista, síndrome de Down, rainha absoluta desta casa."
- Cacao: "1 libra de Spitz Alemão. Volume no máximo 24/7. Hel paga o aluguel dela."
- Olivia: "Filha da Linda. A calma da família (alguém tinha que ser)."
- Oliver: "Filho da Linda. Energia pura. Cacao versão 2.0 no quesito barulho."

**PRIORITY:** 🟡 Week 2-3 (Medium priority, high emotional value, differentiates site)

---

#### 🆕 `/momentos-favoritos` (Favorite Moments/Memories)

**WHY:** Gallery currently has "Featured Memories" section, could expand into rich storytelling page

**CONTENT:**
- Curated selection of 8-12 moments with rich stories
- "The moments that made us 'us'"
- Each moment: Photo + behind-the-scenes story + why it matters
- Examples:
  - First date (Casa Fontana + Avatar VIP)
  - Ylana bringing medicine when Hel was sick
  - Spontaneous Guaramiranga proposal
  - Moving into dream apartment
  - 4 puppies arriving
  - 2nd anniversary Rio/Búzios trip

**DIFFERENTIATION FROM /galeria:**
- /galeria = comprehensive photo archive
- /momentos-favoritos = curated storytelling (depth over breadth)

**PRIORITY:** 🟢 Nice to have (Week 3+, enhances emotional depth)

---

### Sections/Features That Should Exist

#### ➕ Post-RSVP Thank You & Guidance

**CURRENT GAP:** RSVP confirmation has no follow-up guidance

**ADD TO /rsvp:**
```tsx
<PostRSVPSuccess>
  <h2>Confirmado! 🎉</h2>
  <p>Mal podemos esperar pra te ver na Casa HY</p>

  <NextSteps>
    <Step icon="calendar">
      <h4>Salve a Data</h4>
      <Button>Adicionar ao Calendário</Button>
    </Step>

    <Step icon="map">
      <h4>Como Chegar</h4>
      <Link href="/detalhes#localizacao">Ver Mapa e Rotas</Link>
    </Step>

    <Step icon="gift">
      <h4>Lista de Presentes (Opcional)</h4>
      <Link href="/presentes">Ajude a Construir Nosso Lar</Link>
    </Step>

    <Step icon="share">
      <h4>Vem Todo Mundo!</h4>
      <Button>Compartilhar com Seu Grupo</Button>
    </Step>
  </NextSteps>

  <EmotionalClose>
    "Ter você conosco nesse dia significa tudo.
    Somos caseiros, introvertidos, não gostamos de festa grande.
    Mas você faz parte do nosso pequeno círculo.
    E isso é enorme pra gente."
  </EmotionalClose>
</PostRSVPSuccess>
```

**PRIORITY:** 🔴 Critical (Week 1, blocks RSVP conversion optimization)

---

#### ➕ Live Countdown with Milestones

**CURRENT STATE:** Homepage has countdown timer (good!)

**ENHANCEMENT:** Add milestone markers

```tsx
<CountdownEnhanced>
  <MainCountdown>
    <Days>42</Days> dias até o casamento
  </MainCountdown>

  <Milestones>
    <Milestone achieved>
      ✅ Day 900: Finalizado planejamento
    </Milestone>
    <Milestone achieved>
      ✅ Day 950: Confirmados primeiros RSVPs
    </Milestone>
    <Milestone active>
      ⏳ Day 970: Confirmação final de convidados
    </Milestone>
    <Milestone upcoming>
      📅 Day 1000: Casamento na Casa HY!
    </Milestone>
  </Milestones>
</CountdownEnhanced>
```

**PRIORITY:** 🟢 Nice to have (Week 3+)

---

#### ➕ Weather Forecast Widget

**WHY:** November wedding in Fortaleza, out-of-town guests need packing guidance

**ADD TO /detalhes:**
```tsx
<WeatherSection>
  <h3>Clima em Fortaleza - 20 de Novembro</h3>
  <Forecast>
    <Temperature>28°C - 32°C</Temperature>
    <Conditions>Ensolarado, baixa chance de chuva</Conditions>
    <Recommendations>
      • Roupas leves (cerimônia de manhã!)
      • Protetor solar
      • Óculos de sol
      • Venue é climatizado (conforto garantido)
    </Recommendations>
  </Forecast>
</WeatherSection>
```

**PRIORITY:** 🟡 Week 2-3

---

#### ➕ Social Media Integration

**CURRENT GAP:** No Instagram feed, hashtag, or social sharing

**ADD ACROSS SITE:**
- Wedding hashtag: `#MilDiasDeAmor` or `#HelEYlana1000Dias`
- Instagram feed widget (if couple has wedding account)
- "Share this page" buttons on story/gallery pages
- "Tag us in your photos" call-to-action

**PRIORITY:** 🟡 Week 2-3

---

#### ➕ Gift "Why We Need This" Stories

**CURRENT STATE:** Gift cards have basic descriptions

**ENHANCEMENT:** Add personal stories to high-priority gifts

**EXAMPLE:**
```tsx
<GiftCard priority="high">
  <Image src="/mixer-cozinha.jpg" />
  <Name>Mixer de Cozinha KitchenAid</Name>
  <Price>R$ 1.200</Price>

  <WhyWeNeedThis>
    "A Ylana adora fazer sobremesas. Cheesecake, brownies,
    aqueles bolos que a gente leva pra casa dos amigos.
    Mas o mixer atual? 15 anos de idade, barulhento,
    desiste no meio da receita. Um KitchenAid seria
    literalmente o sonho dela virando realidade."
  </WhyWeNeedThis>

  <Button>Presentear com PIX</Button>
</GiftCard>
```

**PRIORITY:** 🟡 Week 2-3 (High impact on gift conversion)

---

## 6. Prioritized Action Plan

### 🔴 CRITICAL (Week 1 - Must Fix Immediately)

**These block all other improvements and actively harm UX:**

1. **Remove AboutUsSection from /historia**
   - DELETE component from historia page
   - Add "Conheça Mais Sobre Nós" link if needed
   - **Time:** 30 minutes
   - **Impact:** Eliminates immediate content fatigue

2. **Consolidate StoryTimeline (choose Option A)**
   - REMOVE timeline from /galeria entirely
   - ENHANCE timeline in /historia as primary narrative
   - Add inline media to timeline events
   - **Time:** 4-6 hours (includes testing)
   - **Impact:** Resolves major duplication, clarifies page purposes

3. **Merge /local + /informacoes → /detalhes**
   - Create new `/detalhes` page with 6 sections (see structure above)
   - Redirect `/local` → `/detalhes#localizacao`
   - Update navigation: "Local" + "Informações" → "Detalhes do Casamento"
   - **Time:** 6-8 hours
   - **Impact:** Major IA simplification, eliminates venue duplication

4. **Add Post-RSVP Guidance**
   - Create `PostRSVPSuccess` component
   - Add next steps, calendar integration, sharing
   - **Time:** 3-4 hours
   - **Impact:** Critical conversion optimization

5. **Investigate /convite purpose**
   - Audit WeddingInvitation component
   - Decision: Keep (enhance), remove (duplicate), or repurpose
   - **Time:** 1 hour investigation + action
   - **Impact:** Eliminates navigation confusion

**TOTAL WEEK 1 TIME:** ~20-25 hours
**EXPECTED IMPACT:**
- Eliminate all critical duplications
- Reduce navigation from 8 → 5-6 pages
- Improve RSVP conversion by 20-30%
- Clearer page purposes reduce user confusion

---

### 🟡 IMPORTANT (Week 2-3 - High Value)

**These significantly improve UX and conversion:**

6. **Enhance /presentes with Gift Stories**
   - Add "Why we need this" personal stories to 5-8 high-priority items
   - Add post-purchase thank you page
   - **Time:** 4-5 hours
   - **Impact:** Increase gift conversion, deepen emotional connection

7. **Enhance /historia Timeline**
   - Add phase headers (Primeiros Dias, Construindo Juntos, etc.)
   - Inline media per milestone
   - Expandable details for major events
   - **Time:** 6-8 hours
   - **Impact:** Richer storytelling, better engagement

8. **Optimize Homepage**
   - Reduce to 4-5 sections (remove full WeddingLocation)
   - Add location quick preview card
   - Enhance CTAs for RSVP prominence
   - **Time:** 3-4 hours
   - **Impact:** Faster loading, clearer hierarchy, better mobile UX

9. **Enhance /rsvp Design**
   - Match invitation aesthetic (botanical, elegant)
   - Warmer copy ("Confirme sua presença nos 1000 dias")
   - Better mobile UX (larger touch targets)
   - **Time:** 3-4 hours
   - **Impact:** Better brand consistency, easier mobile RSVP

10. **Add Weather & Practical Details**
    - Weather widget for /detalhes
    - Packing recommendations
    - Ride-sharing tips
    - **Time:** 2-3 hours
    - **Impact:** Reduces guest anxiety, shows thoughtfulness

**TOTAL WEEK 2-3 TIME:** ~20-25 hours
**EXPECTED IMPACT:**
- 15-20% increase in gift registry conversion
- Deeper story engagement (time on /historia increases)
- Better mobile experience (critical for wedding guests)
- Reduced guest support questions (weather/logistics clear)

---

### 🟢 NICE TO HAVE (Week 3+ - Polish & Delight)

**These add polish and unique personality:**

11. **Create /nossos-pets Page**
    - Dedicated pet family showcase
    - Individual profiles with photos
    - "How we became 6" story
    - **Time:** 4-5 hours
    - **Impact:** Unique differentiator, emotional depth, viral potential

12. **Create /sobre-nos Dedicated Page**
    - Comprehensive "about us" without timeline focus
    - Thematic exploration vs chronological
    - **Time:** 3-4 hours
    - **Impact:** Gives AboutUs content proper home

13. **Add Social Media Integration**
    - Wedding hashtag promotion
    - Instagram feed widget (if applicable)
    - Social sharing buttons
    - **Time:** 3-4 hours
    - **Impact:** Viral growth, guest engagement

14. **Create /momentos-favoritos**
    - Curated storytelling page
    - 8-12 moments with rich behind-the-scenes
    - **Time:** 6-8 hours
    - **Impact:** Emotional depth, content marketing potential

15. **Add Countdown Milestones**
    - Enhanced countdown with progress markers
    - Celebration of planning journey
    - **Time:** 2-3 hours
    - **Impact:** Builds anticipation, shows personality

16. **Add Gift Registry Gamification**
    - Progress bar visualization
    - Milestone celebrations (50% complete, etc.)
    - Social proof ("15 amigos já ajudaram")
    - **Time:** 3-4 hours
    - **Impact:** Increases completion rate, social proof

**TOTAL WEEK 3+ TIME:** ~20-30 hours
**EXPECTED IMPACT:**
- Site becomes memorable and shareable
- Unique pet page differentiates from template wedding sites
- Social integration drives organic traffic
- Gamification increases total gift value by 10-15%

---

## 7. Final Recommended Structure

### Simplified Navigation (6 Pages)

```
Primary Navigation:
├── 🏠 Início (/)
├── 📖 Nossa História (/historia)
├── 📸 Galeria (/galeria)
├── 🎁 Presentes (/presentes)
├── ✉️ RSVP (/rsvp)
└── ℹ️ Detalhes (/detalhes) [merged /local + /informacoes]

Optional/Footer:
├── 🐾 Nossos Pets (/nossos-pets) [new]
└── 👥 Sobre Nós (/sobre-nos) [new, if AboutUs removed from homepage]

Removed/Redirected:
├── ❌ /local → redirects to /detalhes#localizacao
├── ❌ /informacoes → redirects to /detalhes
└── ❓ /convite → pending investigation (likely remove or repurpose)
```

---

### Complete Page Structures

#### 🏠 **Homepage (`/`)** - Optimized

```
/ (Conversion-focused landing)
├── HeroSection
│   ├── Monogram: H ♥ Y
│   ├── Names: HEL & YLANA
│   ├── Tagline: "Mil dias do primeiro 'oi' ao 'sim'"
│   ├── Countdown timer
│   └── Date/Time/Venue quick info
├── FeaturedMediaHero (new)
│   └── 1 powerful photo/video capturing their essence
├── StoryPreview
│   ├── Card 1: Do Tinder ao WhatsApp (Day 1)
│   ├── Card 2: Casa Própria (Day 434)
│   └── Card 3: 1000 Dias (Wedding Day)
│   └── CTA: "Leia Nossa Jornada Completa"
├── QuickActionsGrid
│   ├── RSVP (prominent)
│   ├── Lista de Presentes
│   ├── Nossa História
│   └── Detalhes do Casamento
├── LocationQuickPreview (new, replaces full WeddingLocation)
│   ├── Map thumbnail
│   ├── Address one-liner
│   └── CTA: "Ver Como Chegar"
└── AboutUsSnippet (conditional - if not creating /sobre-nos)
    ├── Brief personality intro
    ├── Pet family teaser
    └── CTA: "Conheça Mais Sobre Nós"
```

**Key Changes:**
- Reduced from 5 → 4-6 sections
- Added featured media for immediate emotional hook
- Simplified location to preview (not full component)
- Prominent RSVP throughout

---

#### 📖 **Full Story (`/historia`)** - Enhanced

```
/historia (Comprehensive narrative)
├── HeroSection
│   ├── Title: "Mil Dias: Nossa Jornada Completa"
│   ├── Subtitle: "Do 'oi' sem graça ao 'sim' emocionado"
│   └── Date range: "6 Janeiro 2023 → 20 Novembro 2025"
├── IntroText
│   └── "Mil dias exatos. Sim, a gente fez a conta..."
├── StoryTimelineEnhanced (exclusive to this page)
│   ├── Phase 1: Primeiros Dias (Day 1-100)
│   │   ├── Day 1: Tinder → WhatsApp
│   │   ├── Day 8: Casa Fontana + Avatar VIP (first date)
│   │   ├── Day 52: Ylana brings medicine (the moment)
│   │   └── Day 72: Guaramiranga proposal
│   ├── Phase 2: Construindo Juntos (Day 100-500)
│   │   ├── Day 200: Moving in together
│   │   ├── Day 300: Linda + Cacao arrive
│   │   └── Day 434: Casa própria (dream apartment)
│   ├── Phase 3: Nossa Família (Day 500-900)
│   │   ├── Day 500: 4 puppies born (Olivia & Oliver)
│   │   ├── Day 600: First Christmas in own home
│   │   └── Day 730: 2nd anniversary Rio/Búzios trip
│   └── Phase 4: Caminhando Pro Altar (Day 900-1000)
│       ├── Day 900: Wedding planning begins
│       ├── Day 950: Icaraí proposal (surprise!)
│       └── Day 1000: Wedding at Casa HY
│   └── Features:
│       ├── Inline photos per milestone
│       ├── Expandable "behind the scenes" stories
│       ├── Relationship stats ("434 dias até casa própria")
│       └── Personal commentary throughout
├── MilestoneGallery (new)
│   └── Key photos per phase (preview, not full gallery)
└── CTAs
    ├── Primary: "Confirme Sua Presença nos 1000 Dias"
    └── Secondary: "Veja Todas as Fotos"
```

**Key Changes:**
- ❌ Removed AboutUsSection (duplicate)
- ✅ Timeline enhanced with phases, inline media
- ✅ Exclusive timeline (removed from gallery)
- ✅ Richer storytelling with commentary
- ✅ Multiple RSVP CTAs at emotional peaks

---

#### 📸 **Gallery (`/galeria`)** - Visual Focus

```
/galeria (Pure visual storytelling)
├── HeroSection
│   ├── Title: "Nossos 1000 Dias em Imagens"
│   └── Subtitle: "Cada foto conta uma parte da nossa jornada"
├── TimelinePhaseFilters (new, NOT duplicate timeline)
│   ├── Filter: Todos
│   ├── Filter: Primeiros Dias (Day 1-100)
│   ├── Filter: Construindo Juntos (Day 100-500)
│   ├── Filter: Nossa Família (Day 500-900)
│   └── Filter: Caminhando Pro Altar (Day 900-1000)
├── MasonryPhotoGallery
│   ├── Infinite scroll
│   ├── Lightbox with navigation
│   ├── Personal captions per photo
│   └── Organized by timeline phases (via filters)
├── VideoHighlights
│   ├── Proposal video (Icaraí)
│   ├── Home tour (first walk-through of apartment)
│   └── Pet family introduction
├── BehindTheScenesSection (new)
│   ├── "The Stories Behind the Photos"
│   ├── Curated moments with rich commentary
│   └── Example: "Esse foi o dia que a Linda teve os filhotes..."
└── CTAs
    ├── "Confirme Sua Presença"
    └── "Leia Nossa História Completa"
```

**Key Changes:**
- ❌ Removed StoryTimeline (duplicate)
- ✅ Timeline phase filters (organization, not duplication)
- ✅ Personal captions throughout
- ✅ Behind-the-scenes section adds depth
- ✅ Clear differentiation from /historia

---

#### 🎁 **Presentes (`/presentes`)** - Mostly Unchanged

```
/presentes (Keep current structure, minor enhancements)
├── Header
│   ├── Title: "Ajudem a Construir Nosso Lar"
│   └── Authentic intro copy (current is great!)
├── StatsGrid
│   ├── Total items
│   ├── Completed
│   ├── Total value
│   └── Completed value
│   └── NEW: Visual progress bar
├── Filters
│   ├── Search
│   ├── Category
│   ├── Priority
│   └── Show/hide completed
├── GiftCardsGrid
│   └── ENHANCED: Add "Why We Need This" stories to priority items
├── PostPurchaseThankYou (new)
│   ├── "Vocês estão ajudando a transformar sonho em realidade"
│   ├── Updated registry progress
│   └── Wedding reminder
└── CTA
    └── Keep current emotional closing
```

**Key Changes:**
- ✅ Add progress bar visualization
- ✅ Gift stories for high-priority items
- ✅ Post-purchase thank you page
- ✅ Everything else stays (it works!)

---

#### ✉️ **RSVP (`/rsvp`)** - Enhanced UX

```
/rsvp (Functional + warm design)
├── Header
│   ├── Title: "Confirme Sua Presença nos 1000 Dias"
│   └── Warmer copy: "Digite seu nome pra encontrar seu convite"
├── SearchForm
│   ├── Name input (existing)
│   └── Better mobile UX (larger touch targets)
├── ResultsCards (existing)
│   ├── Guest name
│   ├── Attendance status
│   ├── Plus-ones selector
│   ├── NEW: Dietary restrictions field
│   └── NEW: Message to couple field
├── PostRSVPSuccess (new - CRITICAL)
│   ├── Confirmation message
│   ├── Calendar integration
│   ├── Next steps guidance
│   │   ├── Save date
│   │   ├── View location/directions
│   │   ├── Check gift registry (optional)
│   │   └── Share with your group
│   └── Emotional close
└── RSVPDeadlineCountdown (new)
    └── "Confirme até [date] para nos ajudar no planejamento"
```

**Key Changes:**
- ✅ Warmer design matching invitation aesthetic
- ✅ Dietary restrictions + message fields
- ✅ Post-RSVP guidance (CRITICAL)
- ✅ Better mobile UX
- ✅ RSVP deadline countdown

---

#### ℹ️ **Detalhes (`/detalhes`)** - Merged Page

```
/detalhes (Comprehensive guide - merges /local + /informacoes)
├── HeroSection
│   ├── Title: "Tudo Sobre o Grande Dia"
│   └── Subtitle: "Todas as informações pra você chegar, aproveitar e celebrar com a gente"
├── Section 1: Local & Localização
│   ├── Venue name: Casa HY
│   ├── Full address
│   ├── Interactive Google Map
│   ├── Directions (car, public transport, ride-sharing)
│   ├── Nearby landmarks
│   └── CTA: "Abrir no Google Maps" + "Compartilhar via WhatsApp"
├── Section 2: Programação do Dia
│   ├── Timeline:
│   │   ├── 10:00 - Chegada dos convidados
│   │   ├── 10:30 - Cerimônia
│   │   ├── 11:30 - Recepção com comida boa
│   │   └── 13:00 - Encerramento (previsto)
│   └── Duration: 2-3 horas de celebração
├── Section 3: Dress Code & Clima
│   ├── Attire: Traje social
│   ├── Weather forecast (Fortaleza, November)
│   ├── Packing recommendations
│   └── Venue is air-conditioned
├── Section 4: Estacionamento & Transporte
│   ├── Free parking + valet
│   ├── Public transportation options
│   ├── Ride-sharing tips (Uber/99 pickup zones)
│   └── Accessible entrance info
├── Section 5: Hospedagem
│   ├── Hotel recommendations (3-4 options)
│   ├── Personal notes ("A gente já ficou aqui, é ótimo")
│   └── Nearby dining/activities
├── Section 6: FAQ
│   ├── Can I bring kids? ("Sim! Crianças bem-vindas")
│   ├── Plus-ones? ("Confirme conosco antes")
│   ├── Photography? ("Tirem fotos, mas sem flash na cerimônia")
│   ├── Gifts? ("Lista online + PIX, mas presença é o maior presente")
│   ├── Accessibility? ("Venue é acessível")
│   └── Questions? (Contact info)
└── Section 7: Contato
    ├── WhatsApp: [number]
    ├── Email: [email]
    └── "Dúvidas? Fala com a gente!"
```

**Key Changes:**
- ✅ Merges /local + /informacoes (eliminates duplication)
- ✅ Single comprehensive guide
- ✅ Better organization (7 clear sections)
- ✅ Authentic voice throughout FAQ
- ✅ Weather widget + practical details

---

#### 🐾 **Nossos Pets (`/nossos-pets`)** - NEW (Optional)

```
/nossos-pets (Unique personality showcase)
├── HeroSection
│   ├── Title: "Nossa Família de 6"
│   ├── Group photo: Hel + Ylana + 4 dogs
│   └── Subtitle: "De 2 pra 4 em menos de 1 ano"
├── OurStory
│   ├── "Como Viramos 6"
│   ├── Linda story (first dog, special needs, queen)
│   ├── Cacao story (Ylana's decision, Hel adapted)
│   └── Olivia & Oliver story (Linda's puppies, kept 2)
├── PetProfiles (individual sections)
│   ├── Linda 👑
│   │   ├── Photos
│   │   ├── Personality: "Autista, síndrome de Down, rainha absoluta"
│   │   ├── Quirks
│   │   └── Fun fact
│   ├── Cacao 🍫
│   │   ├── Photos
│   │   ├── Personality: "Volume 24/7, energy incarnate"
│   │   ├── "Hel paga aluguel dela, limpa m*rda dela... casamento"
│   │   └── Spitz Alemão facts
│   ├── Olivia 🌸
│   │   ├── Photos
│   │   ├── Personality: "A calma da família"
│   │   └── Linda's daughter
│   └── Oliver ⚡
│       ├── Photos
│       ├── Personality: "Cacao 2.0, energia pura"
│       └── Linda's son
├── PhotoGalleryByPet
│   └── Filter by pet, see their best moments
└── EmotionalClose
    ├── "Eles não vão estar no casamento..."
    ├── "Mas estão em cada parte da nossa história"
    └── CTA: "Veja Nossa Jornada Completa"
```

**Why This Works:**
- Unique differentiator (most wedding sites don't have this)
- Authentic voice shines through
- 4 pets = big part of identity
- Shareable content (viral potential)
- Humanizes introverted couple

---

## 8. Success Metrics & KPIs

### Primary Conversion Goals

**RSVP Conversion Rate:**
- **Current (estimated):** 50-60% (with duplications causing confusion)
- **Target after fixes:** 80-85%
- **Measurement:** (Total RSVPs / Total Invited Guests) × 100

**Gift Registry Completion:**
- **Current:** Unknown
- **Target:** 60-70% of total registry value
- **Measurement:** (Completed Value / Total Registry Value) × 100

---

### Engagement Metrics

**Average Pages Per Session:**
- **Current (estimated):** 4-5 pages (duplication forces more navigation)
- **Target after fixes:** 2-3 pages
- **Measurement:** Google Analytics

**Time on Site:**
- **Current (estimated):** 5-7 minutes
- **Target after fixes:** 8-12 minutes (less navigation, more engagement)
- **Measurement:** Google Analytics

**Bounce Rate:**
- **Current (estimated):** 40-50% (confusion causes exits)
- **Target after fixes:** <30%
- **Measurement:** Google Analytics

---

### Content Engagement

**Story Page Engagement:**
- **Current:** Unknown
- **Target:** >70% of visitors view /historia
- **Measurement:** Google Analytics pageviews

**Gallery Interaction:**
- **Current:** Unknown
- **Target:** >50% open lightbox, >5 photos viewed
- **Measurement:** Event tracking (lightbox opens, photo views)

**Video Views:**
- **Current:** Unknown
- **Target:** >40% watch proposal video (featured content)
- **Measurement:** Video play events

---

### Mobile Experience

**Mobile Traffic:**
- **Expected:** 70-80% (wedding guests on phones)
- **Mobile Conversion Rate:** Should match desktop (80%+)
- **Mobile Bounce Rate:** <35%

---

### Social Sharing

**Share Actions:**
- **Target:** 20-30% of RSVPs share with others
- **Measurement:** WhatsApp share button clicks, native share API calls

**Viral Coefficient:**
- **Target:** 1.2-1.5 (each RSVP brings 0.2-0.5 additional guests)
- **Measurement:** Referral tracking, group RSVPs

---

### Post-Action Follow-Through

**RSVP → Calendar Save:**
- **Target:** >60% save to calendar after RSVP
- **Measurement:** Calendar button clicks

**RSVP → View Gifts:**
- **Target:** >40% visit /presentes after RSVP
- **Measurement:** User flow tracking (RSVP → Gifts)

**RSVP → View Location:**
- **Target:** >70% view /detalhes after RSVP
- **Measurement:** User flow tracking (RSVP → Details)

---

### Technical Performance

**Page Load Time:**
- **Target:** <2 seconds on 4G
- **Measurement:** Lighthouse, WebPageTest

**Cumulative Layout Shift:**
- **Target:** <0.1
- **Measurement:** Core Web Vitals

**Largest Contentful Paint:**
- **Target:** <2.5 seconds
- **Measurement:** Core Web Vitals

---

## 9. Implementation Roadmap

### Week 1: Critical Fixes (Duplication Elimination)

**Monday-Tuesday:**
- Remove AboutUsSection from /historia
- Remove StoryTimeline from /galeria
- Enhance StoryTimeline in /historia (phase headers, inline media)

**Wednesday-Thursday:**
- Merge /local + /informacoes → /detalhes
- Update navigation (8 pages → 6 pages)
- Set up redirects

**Friday:**
- Add Post-RSVP guidance component
- Investigate /convite (audit, decide fate)
- QA all changes
- Deploy to production

**DELIVERABLES:**
- ✅ Zero content duplication
- ✅ Clear page purposes
- ✅ 6-page navigation
- ✅ Post-RSVP user flow
- ✅ Production deploy

---

### Week 2-3: High-Value Enhancements

**Week 2 Focus: Content Depth**
- Enhance /presentes (gift stories, progress bar)
- Enhance /historia (expandable details, richer commentary)
- Add weather widget to /detalhes
- Improve /rsvp design (botanical aesthetic)

**Week 3 Focus: Mobile & Polish**
- Optimize homepage (reduce sections, enhance CTAs)
- Mobile UX improvements across all pages
- Add social sharing functionality
- Implement analytics tracking

**DELIVERABLES:**
- ✅ Gift registry storytelling
- ✅ Enhanced timeline narrative
- ✅ Better mobile experience
- ✅ Social integration
- ✅ Analytics dashboards

---

### Week 3+: Nice-to-Have Features

**Optional Enhancements (priority order):**
1. Create /nossos-pets page (unique differentiator)
2. Add countdown milestones
3. Create /momentos-favoritos (curated storytelling)
4. Add gift registry gamification
5. Create /sobre-nos dedicated page

**DELIVERABLES:**
- ✅ 1-2 unique pages that differentiate site
- ✅ Gamification increases gift value
- ✅ Social proof throughout

---

## 10. Final Recommendations Summary

### DO IMMEDIATELY (Week 1):
1. ❌ Remove AboutUsSection from /historia
2. ❌ Remove StoryTimeline from /galeria
3. ✅ Enhance StoryTimeline in /historia as exclusive content
4. ✅ Merge /local + /informacoes → /detalhes
5. ✅ Add Post-RSVP guidance (critical for conversion)
6. ❓ Investigate /convite purpose (keep/remove/repurpose)

### DO SOON (Week 2-3):
7. ✅ Add gift stories to /presentes
8. ✅ Enhance /historia with richer narrative
9. ✅ Optimize homepage (reduce sections)
10. ✅ Improve /rsvp design
11. ✅ Add weather widget + practical details
12. ✅ Mobile UX improvements

### DO LATER (Week 3+):
13. ✅ Create /nossos-pets page (unique!)
14. ✅ Add countdown milestones
15. ✅ Social media integration
16. ✅ Gift registry gamification
17. ✅ Create /momentos-favoritos
18. ✅ Create /sobre-nos dedicated page

---

## Conclusion

The current wedding website has a **strong foundation with authentic voice and compelling content**, but suffers from **critical duplication issues and unclear page hierarchy** that confuse users and dilute narrative impact.

**The core problem:** Content duplication forces users to visit 3-4 pages to understand the complete story, causing fatigue and drop-offs.

**The solution:** Eliminate duplicates, consolidate related pages, and establish clear page purposes. Each page should add unique value to the user journey.

**Expected outcome after Week 1 fixes:**
- RSVP conversion: 50-60% → 80-85% (30-40% improvement)
- Navigation: 8 pages → 6 pages (25% reduction)
- User confusion: Eliminated (clear page purposes)
- Content fatigue: Eliminated (no duplicates)
- Mobile experience: Significantly improved

**This is a wedding website for an introverted couple celebrating 1000 days of authentic love.** The IA should reflect that: simple, clear, focused, and genuine. Less navigation, more connection. Fewer duplicates, stronger narrative. More clarity, better conversion.

**The couple's voice is the site's strength.** Once we eliminate structural confusion, that voice will shine through every page, creating an experience as authentic and memorable as their 1000-day journey.

---

**END OF AUDIT**

*Next Steps: Review recommendations with couple, prioritize based on timeline/resources, begin Week 1 critical fixes.*
