# Personalized Invitation Page Redesign Plan
**Route:** `/convite/[CODE]`

## Vision
Transform the invitation page into a beautiful, personalized digital wedding invitation that guides guests through confirming attendance and exploring the website's features.

---

## Page Structure (Top to Bottom)

### 1. **Personalized Elegant Invitation** (Hero Section)
**Purpose:** Make the guest feel special with a beautiful, personalized invitation

**Components:**
- `PersonalizedInvitationHero.tsx`

**Features:**
- Guest's name prominently displayed ("João Silva, você está convidado!")
- Relationship badge (Família, Amigo, Colega)
- Plus-one indicator if applicable ("você e acompanhante")
- Couple's monogram (H & Y)
- Wedding date countdown
- Elegant botanical decorations
- Animation on scroll reveal

**Design Elements:**
- Cream background with elegant border
- Playfair Display for names
- Crimson Text for body
- Subtle gradient overlay
- Botanical corner decorations

**Data Required:**
- `guest_name` from invitation
- `relationship_type`
- `allows_plus_one`
- Days until wedding

---

### 2. **RSVP Prompt Section**
**Purpose:** Immediately capture guest's attendance confirmation

**Components:**
- `RSVPPromptCard.tsx`
- `RSVPQuickForm.tsx`

**Features:**
- **States:**
  - Not confirmed: Show prominent RSVP form
  - Dismissed: Show collapsed reminder (tracked via cookie)
  - Confirmed: Show confirmation message with edit option

- **Cookie Tracking:**
  - `rsvp_dismissed_[CODE]` - tracks if user dismissed prompt
  - `rsvp_status_[CODE]` - tracks confirmation status
  - Expires in 7 days

- **Form Fields:**
  - Attending: Yes/No toggle (beautiful switch)
  - Plus one: Yes/No (only if `allows_plus_one`)
  - Dietary restrictions: Optional textarea
  - Submit button

- **Behavior:**
  - Sticky position when scrolling (mobile)
  - Dismissible with X button
  - Re-appears after 24h if dismissed but not confirmed
  - Success animation on submit
  - Auto-collapse after confirmation

**Design:**
- Card with soft shadow
- Green gradient for "Sim, vou!" button
- Gray for "Não poderei ir"
- Smooth transitions
- Confetti animation on confirmation

---

### 3. **Event Details Section**
**Purpose:** Provide all essential wedding information

**Components:**
- `WeddingEventDetails.tsx`
- `VenueMapCard.tsx`
- `GeneralOrientations.tsx`

**Sub-sections:**

#### A. **Data e Horário**
- Date: 20 de Novembro de 2025
- Time: 11h00 (chegada dos convidados)
- Cerimônia: 11h30
- Recepção: 13h00
- Visual timeline with icons

#### B. **Local**
- Venue name: Casa HY
- Full address with map integration
- Google Maps embed or link
- Parking information
- Accessibility notes

#### C. **Dress Code**
- Dress code recommendation
- Color palette suggestions
- What to avoid (if applicable)
- Visual examples (optional)

#### D. **Orientações Gerais**
- Arrival time recommendations
- Photo/video policies
- Kids policy (if applicable)
- Gift registry mention
- Contact for questions

**Design:**
- 3-column grid (desktop) / stacked (mobile)
- Icon + title + description cards
- Map with custom marker
- Elegant dividers between sections

---

### 4. **Website Guide Section**
**Purpose:** Orient guests on how to use the wedding website

**Components:**
- `GuestWebsiteGuide.tsx`
- `FeatureCard.tsx`

**Features Overview:**
Display as interactive cards with icons:

1. **Nossa História** 📖
   - "Conheça nossa jornada até aqui"
   - Link to `/historia`

2. **Galeria** 📸
   - "Veja fotos dos nossos 1000 dias juntos"
   - Link to `/galeria`

3. **Confirmação** ✅
   - "Confirme sua presença (você já fez!)"
   - Link to `/rsvp` (or show checkmark if confirmed)

4. **Presentes** 🎁
   - "Escolha um presente da nossa lista"
   - Link to `/presentes`
   - Badge: "Em breve" if not ready

5. **Detalhes** 📍
   - "Tudo sobre o grande dia"
   - Link to `/detalhes`

6. **Dia 1000** 📡
   - "Acompanhe a festa ao vivo"
   - Link to `/dia-1000`
   - Time-gated badge: "Disponível em 20 Nov"

**Design:**
- 2x3 grid (desktop) / 1 column (mobile)
- Hover lift effect
- Icon + title + short description
- "Explorar" button
- Progress indicator (features completed)

---

### 5. **Interactive Feature Wizards**
**Purpose:** Guide guests through key actions with step-by-step tutorials

**Components:**
- `FeatureWizardModal.tsx`
- `WizardStep.tsx`
- `WizardNavigation.tsx`

**Wizards to Create:**

#### A. **Compartilhar Momentos** (Posts/Images)
**Steps:**
1. Navigate to "Dia 1000"
2. Click "Adicionar Momento"
3. Upload photo/video
4. Add caption with emoji
5. Submit for approval
6. Wait for admin moderation

**Trigger:** "Como compartilhar momentos" button

#### B. **Escolher Presente**
**Steps:**
1. Browse gift registry
2. Select a gift
3. Choose contribution amount (PIX)
4. Complete payment
5. Receive confirmation

**Trigger:** "Como dar um presente" button

#### C. **Acompanhar Ao Vivo**
**Steps:**
1. Access on wedding day (Nov 20)
2. See live posts from guests
3. React to moments
4. Add your own photos
5. Engage with celebration

**Trigger:** "Como acompanhar ao vivo" button

**Wizard Design:**
- Modal overlay with backdrop
- Progress dots at bottom
- Previous/Next navigation
- Skip/Close options
- Screenshots or illustrations for each step
- Animated transitions between steps

---

## Technical Implementation

### 1. **Server Component** (`/convite/[code]/page.tsx`)
```typescript
- Fetch invitation by code
- Get guest session
- Verify access permissions
- Fetch RSVP status from database
- Pass all data to client components
```

### 2. **Cookie Management**
```typescript
// lib/utils/rsvp-cookies.ts
- setRSVPDismissed(code: string)
- getRSVPDismissed(code: string)
- clearRSVPDismissed(code: string)
- setRSVPStatus(code: string, status: 'confirmed' | 'declined')
- getRSVPStatus(code: string)
```

### 3. **State Management**
```typescript
// Client component state
- rsvpDismissed: boolean (from cookie)
- rsvpConfirmed: boolean (from DB + cookie)
- activeWizard: string | null
- wizardStep: number
```

### 4. **Data Flow**
```
Server (page.tsx)
  ↓
Fetch invitation + RSVP data
  ↓
Pass to Client Components
  ↓
Components check cookies
  ↓
Render appropriate UI state
  ↓
User interactions update cookies + DB
```

---

## Components Breakdown

### New Components to Create:

1. **PersonalizedInvitationHero.tsx** (200 lines)
   - Personalized hero with guest details
   - Countdown timer
   - Elegant decorations

2. **RSVPPromptCard.tsx** (250 lines)
   - Collapsible RSVP prompt
   - Cookie-based dismissal
   - Confirmation states

3. **RSVPQuickForm.tsx** (180 lines)
   - Inline RSVP form
   - Yes/No toggle
   - Plus-one handling
   - Submit with validation

4. **WeddingEventDetails.tsx** (220 lines)
   - Date/time/location cards
   - Dress code
   - General orientations

5. **VenueMapCard.tsx** (120 lines)
   - Google Maps integration
   - Address details
   - Directions link

6. **GuestWebsiteGuide.tsx** (200 lines)
   - Feature cards grid
   - Progress tracking
   - Navigation links

7. **FeatureWizardModal.tsx** (300 lines)
   - Modal wrapper
   - Step navigation
   - Content renderer

8. **WizardStep.tsx** (80 lines)
   - Individual step component
   - Illustration + text
   - Action buttons

### Utilities to Create:

1. **lib/utils/rsvp-cookies.ts** (100 lines)
   - Cookie management functions
   - Expiration handling
   - Type-safe getters/setters

2. **lib/utils/invitation-helpers.ts** (80 lines)
   - Format guest name
   - Get relationship label
   - Calculate days until wedding
   - Progress calculation

---

## Design System Consistency

### Colors (from existing palette):
- Background: `#F8F6F3` (cream)
- Primary text: `#2C2C2C` (charcoal)
- Secondary text: `#4A4A4A` (gray)
- Accent: `#E8E6E3` (warm gray)
- Success: `#4A7C59` (forest green)
- Decorative: `#A8A8A8` (silver)

### Typography:
- Headers: Playfair Display
- Body: Crimson Text
- Monogram: Cormorant

### Spacing:
- Section padding: 80-120px (desktop), 40-60px (mobile)
- Card padding: 32px
- Component gaps: 24px

### Animations:
- Scroll reveals: opacity + y transform
- Hover lifts: translateY(-4px)
- Button hover: scale(1.02)
- Transitions: 300ms ease-out

---

## Mobile Considerations

1. **Sticky RSVP:**
   - Fixed to bottom on mobile when not confirmed
   - Collapsible to save space
   - Easy thumb-reach buttons

2. **Simplified Grid:**
   - Single column for most sections
   - Larger touch targets (min 44px)
   - Readable font sizes (18px+ body)

3. **Map Integration:**
   - Tap to open in Google Maps app
   - Simplified view on mobile

4. **Wizard Modal:**
   - Full-screen on mobile
   - Swipe gestures for navigation
   - Easy close button

---

## Success Metrics

**Engagement:**
- 80%+ RSVP confirmation rate
- 60%+ feature guide exploration
- 40%+ wizard completion rate

**User Experience:**
- Average time on page: 3-5 minutes
- Bounce rate: < 20%
- Mobile responsiveness: Perfect on all devices

**Technical:**
- Page load: < 2 seconds
- Lighthouse score: 90+
- Zero console errors

---

## Implementation Phases

### Phase 1: Core Invitation (Week 1)
- [ ] PersonalizedInvitationHero
- [ ] RSVPPromptCard + QuickForm
- [ ] Cookie management utilities
- [ ] Basic page structure

### Phase 2: Event Details (Week 1)
- [ ] WeddingEventDetails component
- [ ] VenueMapCard with Google Maps
- [ ] GeneralOrientations section
- [ ] Mobile responsive layout

### Phase 3: Website Guide (Week 2)
- [ ] GuestWebsiteGuide component
- [ ] FeatureCard components
- [ ] Progress tracking logic
- [ ] Navigation integration

### Phase 4: Interactive Wizards (Week 2)
- [ ] FeatureWizardModal framework
- [ ] Three wizard contents (Posts, Gifts, Live)
- [ ] Step navigation
- [ ] Illustrations/screenshots

### Phase 5: Polish & Testing (Week 3)
- [ ] Animations and transitions
- [ ] Error handling
- [ ] Loading states
- [ ] Cross-browser testing
- [ ] Performance optimization

---

## Open Questions

1. **RSVP Integration:**
   - Should we create new RSVP records or update existing ones?
   - What happens if guest confirms via this page vs. /rsvp page?
   - Do we need to sync with Supabase guests table?

2. **Plus One Handling:**
   - Collect plus-one name on this page or separate flow?
   - How to handle plus-one dietary restrictions?

3. **Map Integration:**
   - Use Google Maps iframe or static image?
   - Do we have a Google Maps API key?
   - Alternative: Mapbox or OpenStreetMap?

4. **Content Management:**
   - Store orientation text in Sanity CMS?
   - Allow admin to customize per-guest messages?
   - Wizard content in CMS or hardcoded?

5. **Analytics:**
   - Track which features guests explore?
   - Monitor wizard completion rates?
   - A/B test RSVP prompt placement?

---

## Next Steps

1. **Review & Approve Plan** ✓
2. **Answer Open Questions**
3. **Create Component Mockups** (optional)
4. **Begin Phase 1 Implementation**
5. **Iterate Based on Feedback**

---

**Estimated Total Work:**
- Components: ~1,500 lines
- Utilities: ~200 lines
- Page logic: ~300 lines
- **Total: ~2,000 lines of production code**

**Timeline:** 2-3 weeks for complete implementation with testing
