# UX Analysis: Navigation & Homepage Optimization
## Thousand Days of Love Wedding Website

**Date**: October 13, 2025
**Analyst**: UX Research Analysis
**Project Phase**: Post-Guest Experience Enhancement (Phases 4 & 5 Complete)

---

## Executive Summary

The wedding website has evolved from a simple invitation site into a **comprehensive interactive celebration platform** with 12 distinct pages and features. The current navigation and homepage structure no longer match the complexity of the user journey. This analysis provides data-driven recommendations for restructuring navigation and simplifying the homepage to maximize guest engagement while maintaining the elegant wedding invitation aesthetic.

**Key Findings**:
1. Homepage is **overcrowded** with 7 sections after the hero (VideoHeroSection is critical and must stay)
2. Navigation includes all core pages but misses new interactive features
3. No clear information hierarchy for first-time vs. returning guests
4. Guest discovery journey is not optimized for conversion to engagement
5. Mobile navigation needs enhancement for new features

**Critical Success Metrics**:
- **Invitation open rate**: Target 85%+ (personalized invitations drive this)
- **RSVP completion rate**: Target 80%+ within 48 hours of invitation view
- **Feature discovery rate**: Target 60%+ guests interact with at least 2 features beyond RSVP
- **Homepage bounce rate**: Target <20% (current structure likely higher)
- **Mobile engagement**: Target 70%+ of traffic (Brazilian market is mobile-first)

---

## Current State Analysis

### Existing Page Architecture

#### Public-Facing Pages (12 total)
1. **Homepage** (`/`) - 7 sections + hero
2. **Nossa História** (`/historia`) - Love story timeline
3. **Galeria** (`/galeria`) - Photo gallery (Sanity + guest photos)
4. **RSVP** (`/rsvp`) - Guest confirmation system
5. **Lista de Presentes** (`/presentes`) - Gift registry
6. **Detalhes** (`/detalhes`) - Event details
7. **Convite Generic** (`/convite`) - Public invitation landing
8. **Convite Personalizado** (`/convite/[code]`) - Personalized invitations
9. **Mensagens** (`/mensagens`) - Social feed with posts, reactions, comments
10. **Ao Vivo** (`/ao-vivo`) - Live wedding day feed (real-time)
11. **Meu Convite** (`/meu-convite`) - Guest dashboard (planned)
12. **Guest Photo Upload** (`/dia-1000/login` + `/dia-1000/upload`) - Password-protected upload

#### Admin Pages (6 total)
- `/admin/guests` - Guest management
- `/admin/photos` - Photo moderation
- `/admin/posts` - Post moderation with pin/unpin
- `/admin/presentes` - Gift registry management
- `/admin/pagamentos` - Payment tracking
- `/admin/analytics` - Analytics dashboard
- `/admin/convites` - Invitation management (Phase 4)

### Current Homepage Structure

**Problem**: Homepage has **8 sections total** (1 hero + 7 content sections)

1. **VideoHeroSection** ⭐ **SUPER IMPORTANT** - Full-screen video with couple's proposal video
   - Immersive audio toggle
   - CTAs: "Confirmar Presença" + "Nossa História"
   - Beautiful entrance animation with poster → video transition

2. **EventDetailsSection** - Date, time, location summary

3. **StoryPreview** - Preview of couple's timeline

4. **AboutUsSection** - About Hel & Ylana

5. **OurFamilySection** - Pets/family introduction

6. **QuickPreview** - Quick links to features

7. **WeddingLocation** - Google Maps integration

**User Experience Issues**:
- **Information Overload**: First-time visitors face 7 sections worth of content before converting (RSVP)
- **Conversion Friction**: Critical actions (RSVP, explore features) buried below fold
- **No Personalization**: Doesn't differentiate first-time vs. returning guests
- **Discoverability Problem**: New interactive features (/mensagens, /ao-vivo, /meu-convite) not surfaced
- **Mobile Scroll Fatigue**: Excessive scrolling on mobile devices (Brazilian market is 70%+ mobile)

### Current Navigation Structure

**Desktop Navigation** (7 items):
```
Início | Nossa História | Confirmar Presença | Lista de Presentes | Galeria | Detalhes do Evento | Mensagens
```

**Navigation Gaps**:
1. `/meu-convite` (guest dashboard) not included
2. `/ao-vivo` (live feed) not included
3. `/convite/[code]` (personalized invitations) not discoverable
4. No indication of completion progress
5. No differentiation between pre-wedding and wedding-day features

**Mobile Navigation Issues**:
- Simple hamburger menu with same 7 items
- No quick access to high-frequency actions (upload photo, post message)
- No progress indicator
- No context-aware navigation (wedding day vs. pre-wedding)

---

## User Journey Analysis

### Guest Personas & Journeys

#### Persona 1: First-Time Visitor (via Personalized Invitation)
**Archetype**: Maria, 32, close friend, received WhatsApp invitation with code
**Device**: Mobile (iPhone), WhatsApp → Safari
**Goals**: Understand event details, decide if attending, explore what's expected

**Current Journey** (Problematic):
```
1. Clicks WhatsApp link → /convite/FRIEND002
2. Sees personalized greeting "Olá, Maria!" ✅
3. Sees progress tracker (0% complete) 🤔
4. Scrolls through event details (date, time, location) ✅
5. Sees 4 quick action cards (RSVP, Gifts, Photos, Messages)
6. Clicks "Confirmar Presença" → /rsvp
7. Completes RSVP ✅
8. Returns to homepage (?) - sees same 7 sections, doesn't understand what to do next ❌
9. Bounces or explores randomly ❌
```

**Pain Points**:
- After RSVP completion, no clear "what's next" guidance
- Homepage doesn't acknowledge her progress
- Doesn't discover /mensagens or /galeria features
- Feels overwhelmed by content volume

**Optimal Journey** (Recommended):
```
1. Clicks WhatsApp link → /convite/FRIEND002
2. Sees personalized greeting + progress tracker ✅
3. Reviews event details (streamlined) ✅
4. Clicks "Confirmar Presença" → RSVP ✅
5. Redirected to simplified homepage with:
   - Welcome banner: "Obrigada por confirmar, Maria! Explore nosso site" ✨
   - Featured section: "Próximos Passos" (3 cards: Gallery, Messages, Gifts)
   - Testimonial/preview of what other guests are doing
6. Discovers /mensagens organically ✅
7. Returns multiple times to check updates ✅
```

#### Persona 2: Returning Guest (Completed RSVP, Exploring)
**Archetype**: João, 45, family member, confirmed attendance last week
**Device**: Desktop at work, revisiting during lunch break
**Goals**: See photos, leave a message, check gift registry

**Current Journey** (Suboptimal):
```
1. Navigates to thousandaysof.love (no invite code)
2. Lands on homepage with full 7 sections ❌
3. Scrolls looking for "what's new" - doesn't find it ❌
4. Uses navbar → "Galeria" ✅
5. Views photos, doesn't know about guest photo upload feature ❌
6. Notices "Mensagens" in navbar by chance
7. Clicks, discovers social feed ✅
8. Posts a message ✅
```

**Pain Points**:
- No personalized welcome ("Welcome back, João!")
- Homepage doesn't surface new content or activity
- Guest photo upload feature hidden in `/dia-1000/upload` (bad URL, not discoverable)
- No incentive to return frequently

**Optimal Journey** (Recommended):
```
1. Navigates to homepage
2. Sees lightweight login prompt: "Tem um código de convite? Entre aqui" (optional)
3. OR: Browses streamlined homepage (hero + 2-3 sections max)
4. Navbar includes "Meu Convite" (if logged in) with progress badge "75%" ✨
5. Clicks "Mensagens" from navbar → sees active feed ✅
6. Notices "Galeria" has badge "12 novas fotos" ✨
7. Explores features with clear discovery ✅
```

#### Persona 3: Wedding Day Guest (Live at Venue)
**Archetype**: Ana, 28, friend, attending ceremony in real-time
**Device**: Mobile (Android), venue WiFi
**Goals**: Share photos immediately, see what others are posting, follow live updates

**Current Journey** (Problematic):
```
1. Opens website on phone during cocktail hour
2. Homepage loads 7 sections (slow on venue WiFi) ❌
3. Looking for "live feed" but doesn't see it in navbar ❌
4. Tries /mensagens → sees historical posts, not real-time feel ❌
5. Doesn't discover /ao-vivo page ❌
6. Manually navigates to /dia-1000/upload (if she remembers the URL) ❌
7. Uploads photo but frustrated by discoverability ❌
```

**Pain Points**:
- `/ao-vivo` not in navigation (should be prominent on wedding day)
- Photo upload flow requires separate login at `/dia-1000/login`
- Homepage not optimized for wedding day context
- No "quick action" floating button for mobile uploads

**Optimal Journey** (Recommended):
```
1. Opens website → Homepage detects wedding day (Nov 20, 2025)
2. Hero section shows: "🎉 Estamos casando agora! Acompanhe ao vivo"
3. Single CTA: "Ver Feed Ao Vivo" → /ao-vivo ✨
4. Navbar highlights "Ao Vivo" with live dot indicator 🔴
5. Mobile bottom nav shows FAB (Floating Action Button): Camera icon
6. Clicks FAB → Quick actions: "Fazer Upload" | "Postar Mensagem"
7. Uploads photo inline, no separate login needed ✅
8. Returns to live feed, sees her photo appear in real-time ✅
```

### Conversion Funnel Analysis

**Goal**: Maximize guest engagement beyond basic RSVP

**Current Funnel** (Estimated):
```
100% Land on homepage
 ↓
60% Explore beyond hero section (40% bounce - too much content)
 ↓
80% Complete RSVP (via invitation link)
 ↓
30% Discover gallery (not prominent enough)
 ↓
15% Discover messages feature (buried in navbar)
 ↓
10% Upload photos (hidden URL)
 ↓
5% Return multiple times (no incentive)
```

**Optimized Funnel** (Target):
```
100% Land on homepage (personalized or streamlined)
 ↓
85% Engage with hero + 1-2 key sections (reduced bounce)
 ↓
85% Complete RSVP (clear primary CTA)
 ↓
65% Discover 2+ features (guided post-RSVP journey)
 ↓
40% Post message or upload photo (prominent discovery)
 ↓
60% Return 3+ times (personalized dashboard + updates)
 ↓
70% Participate on wedding day (optimized live feed)
```

**Key Improvements**:
- Reduce homepage sections (hero + 2-3 max)
- Add personalized post-RSVP journey
- Surface interactive features prominently
- Create wedding-day specific experience
- Add guest dashboard with progress gamification

---

## Strategic Recommendations

### Recommendation 1: Restructure Navigation Architecture

#### Desktop Navigation (Primary - 6 Items Max)

**Proposed Structure**:
```
[Logo: Hel & Ylana 11.11.2025]  |  Início | Nossa História | Galeria | Mensagens | Presentes | [CTA: Confirmar Presença]
```

**Rationale**:
1. **Remove "Detalhes do Evento"** from navbar → Move to homepage section or /convite page
2. **Add "Mensagens"** prominently (currently buried at end)
3. **Keep "Galeria"** (high-value content)
4. **Keep "Nossa História"** (emotional connection, low-friction page)
5. **Keep "Presentes"** (revenue/gift selection important)
6. **Prominent RSVP CTA** as button (not just nav item)

**Conditional Items** (Context-Aware):
- **Wedding Day (Nov 20, 2025)**: Add "🔴 Ao Vivo" before "Mensagens"
- **Logged In Guest**: Add "Meu Convite" (with progress badge) after "Início"

#### Mobile Navigation (Bottom Nav Bar - 5 Items)

**Proposed Structure**:
```
┌─────────┬─────────┬─────────┬─────────┬─────────┐
│  Início │História │ Galeria │Mensagens│  Perfil │
│    🏠   │   💕    │   📷    │   💬    │   👤    │
└─────────┴─────────┴─────────┴─────────┴─────────┘

+ Floating Action Button (bottom-right): Camera icon with menu
  → Upload Foto
  → Postar Mensagem
  → Compartilhar
```

**Rationale**:
1. **5 tabs** is mobile UX best practice (thumb-reachable)
2. **"Perfil" tab** → `/meu-convite` (guest dashboard with progress)
3. **FAB** handles high-frequency actions without cluttering nav
4. **Icons + labels** for clarity (Brazilian market, mixed tech literacy)
5. **No "Presentes" in mobile nav** (lower priority, accessible via Perfil)

#### Navigation Implementation Priority

**Phase 1: Immediate (Week 1)**
- Update desktop navbar to 6 items
- Add conditional "Ao Vivo" for wedding day
- Add "Meu Convite" for logged-in guests

**Phase 2: Mobile Optimization (Week 2)**
- Build bottom navigation component
- Implement FAB with quick actions
- Test on iOS Safari and Android Chrome

**Phase 3: Context-Aware (Week 3)**
- Add progress badges
- Implement "new content" indicators
- Add guest name display when logged in

---

### Recommendation 2: Simplify Homepage (Hero + 2-3 Sections Max)

#### Proposed Homepage Structure

**Version A: First-Time Visitor (No Login)**
```
1. VideoHeroSection (KEEP - Super Important) ⭐
   - Full-screen video with audio toggle
   - Primary CTA: "Confirmar Presença"
   - Secondary CTA: "Nossa História"

2. Event Summary Section (NEW - Simplified)
   - 3 cards: Date | Time | Location
   - Single CTA: "Ver Todos os Detalhes" → /detalhes

3. Feature Discovery Section (NEW)
   - 3 cards with previews:
     - "Nossa História" (timeline preview)
     - "Galeria" (photo grid preview)
     - "Mensagens dos Convidados" (recent post preview)
   - Each card links to full page

[Optional Footer: Quick links to all pages]
```

**Version B: Returning Guest (Logged In with Invite Code)**
```
1. VideoHeroSection (KEEP - Collapsed on repeat visits)
   - Shorter version (50vh instead of 100vh)
   - "Welcome back, [Name]!" overlay
   - Progress badge: "75% completo"

2. Personal Progress Section (NEW)
   - Circular progress tracker
   - Next action suggestion: "Que tal enviar uma mensagem?"
   - Quick actions: Gallery | Messages | Gifts

3. What's New Section (Dynamic)
   - "12 novos posts" | "24 novas fotos" | "3 presentes selecionados"
   - Incentivizes return visits
   - Links to relevant pages

[Guest Dashboard CTA: "Ver Meu Painel Completo" → /meu-convite]
```

**Version C: Wedding Day (November 20, 2025)**
```
1. Live Feed Hero (REPLACES VideoHeroSection)
   - "🎉 Estamos Casando Agora!"
   - Live countdown: "Começou há 2 horas 34 minutos"
   - Single CTA: "Acompanhar Ao Vivo" → /ao-vivo

2. Live Stats Section
   - Real-time numbers: Posts today | Photos today | Guests present
   - Pinned special moments carousel
   - Recent activity stream

3. Quick Upload Section
   - Inline photo/video upload widget
   - "Compartilhe este momento" CTA
   - Recent uploads grid (last 12)

[Mobile: FAB prominent for uploads]
```

#### Sections to Remove from Homepage

**Recommended Moves**:

1. **AboutUsSection** → Move to `/historia` page (belongs with love story)
2. **OurFamilySection** → Move to `/historia` page (part of their story)
3. **QuickPreview** → Remove entirely (redundant with navbar + new Feature Discovery section)
4. **WeddingLocation** → Move to `/detalhes` page (better context)
5. **StoryPreview** → Replace with "Feature Discovery" section (broader appeal)

**Keep on Homepage**:
1. **VideoHeroSection** - Non-negotiable, critical emotional hook ⭐
2. **Event Summary** (new simplified version)
3. **Feature Discovery** (new section replacing multiple previews)

---

### Recommendation 3: Implement Guest Dashboard (`/meu-convite`)

**Purpose**: Central hub for personalized guest experience

**Key Features**:
1. **Welcome Header**: "Olá, [Guest Name]! Faltam X dias para o casamento"
2. **Progress Tracker**: Circular chart showing 4 actions (RSVP, Gifts, Photos, Messages)
3. **Quick Actions Grid**:
   - Confirmar/Editar Presença
   - Escolher Presente
   - Enviar Fotos
   - Postar Mensagem
4. **Recent Activity Feed**: Your posts, photos, gift selections
5. **Invitation Details**: Your invite code, QR code, plus-one info
6. **Event Countdown**: Days/hours/minutes until wedding

**Discovery Strategy**:
- Add "Meu Convite" to navbar (only when logged in)
- Redirect here after first RSVP completion
- Show in mobile nav as "Perfil" tab
- Include link in post-action confirmations ("RSVP confirmed! Check your dashboard")

**Implementation Priority**: High (Week 4 of original roadmap)

---

### Recommendation 4: Optimize Feature Discoverability

#### Problem: Hidden Features
- `/mensagens` - Only in navbar, no preview or call-to-action
- `/ao-vivo` - Not in navigation at all
- `/dia-1000/upload` - Terrible URL, password-protected, no discovery path
- `/convite/[code]` - Only accessible via direct invitation link

#### Solutions

**1. Feature Discovery Section (Homepage)**
```
┌─────────────────────────────────────────────────────────┐
│         Explore Nosso Site de Casamento                 │
├───────────────┬───────────────┬───────────────┐
│ Nossa História│    Galeria    │   Mensagens   │
│               │               │               │
│ [Timeline img]│ [Photo grid]  │ [Post preview]│
│ Conheça nossa │ Veja momentos │ Deixe sua     │
│ jornada de    │ especiais da  │ mensagem para │
│ 1000 dias     │ nossa vida    │ o casal       │
│               │               │               │
│ [Ver Mais →]  │ [Ver Mais →]  │ [Ver Mais →]  │
└───────────────┴───────────────┴───────────────┘
```

**2. Post-RSVP Onboarding Flow**
```
After RSVP completion → Show modal:

"✓ Presença Confirmada, [Name]!"

"Ainda há muito para explorar:"
☐ Veja nossa história de amor
☐ Escolha um presente (opcional)
☐ Envie fotos suas
☐ Deixe uma mensagem para nós

[Começar Tour] [Fechar]
```

**3. Floating Action Button (Mobile)**
```
FAB (bottom-right corner): 📷 icon

On tap → Menu expands:
┌──────────────────┐
│ 📸 Enviar Foto   │
│ 💬 Postar        │
│ 🎁 Ver Presentes │
│ 📊 Meu Progresso │
└──────────────────┘
```

**4. Activity Badges**
```
Navbar items with update indicators:

Galeria (12 novas) ← Red badge
Mensagens (5 novas) ← Red badge
Ao Vivo 🔴 ← Live indicator (wedding day only)
```

**5. Guest Photo Upload Simplification**
```
OLD: /dia-1000/login → /dia-1000/upload (confusing, multi-step)
NEW: Inline upload everywhere
  - FAB → Upload Foto (direct to upload modal)
  - Galeria page → "Enviar Suas Fotos" button
  - Dashboard → Quick action card

Remove password entirely, use simple guest name input (already have guest_sessions)
```

---

### Recommendation 5: Context-Aware Navigation (Wedding Day)

#### Problem
Current site doesn't change behavior on wedding day (November 20, 2025). Guests at venue will have different needs than pre-wedding visitors.

#### Solution: Wedding Day Mode

**Automatic Detection**:
```typescript
const isWeddingDay = () => {
  const today = new Date()
  const weddingDate = new Date('2025-11-20')
  return today.toDateString() === weddingDate.toDateString()
}
```

**Changes When Wedding Day = True**:

1. **Homepage Hero**:
   - Replace VideoHeroSection with LiveFeedHero
   - "🎉 Estamos Casando Agora! Acompanhe ao vivo"
   - Live countdown: "Cerimônia começou há 1h 23min"
   - Single CTA: "Ver Feed Ao Vivo"

2. **Navigation**:
   - Add "🔴 Ao Vivo" as first item in navbar (desktop)
   - Replace "Início" with "🔴 Ao Vivo" in mobile bottom nav
   - Remove "Nossa História" temporarily (low priority on wedding day)

3. **Mobile FAB**:
   - More prominent (larger size, pulsing animation)
   - Default action: "Upload Foto" (one-tap, no menu)
   - Secondary actions in menu

4. **Page Redirects**:
   - `/` (homepage) → Suggest visiting `/ao-vivo`
   - `/mensagens` → Show banner: "Veja posts ao vivo na página Ao Vivo"

5. **Live Features**:
   - Real-time Supabase subscriptions active
   - Auto-refresh every 30 seconds (fallback)
   - Connection status indicator: "🟢 Conectado" | "🟡 Atualizando..."

**Post-Wedding Mode** (Day After):
```
- Remove "Ao Vivo" from navigation
- Archive live feed → Read-only at /ao-vivo
- Show "Obrigado!" message on homepage
- Encourage guests to view final gallery
```

---

## Implementation Roadmap

### Week 1: Navigation & Homepage Cleanup

**Day 1-2: Desktop Navigation Update**
- [ ] Update Header.tsx navigationItems array (6 items max)
- [ ] Add conditional rendering for "Ao Vivo" (wedding day only)
- [ ] Add conditional rendering for "Meu Convite" (logged-in guests)
- [ ] Remove "Detalhes do Evento" from navbar
- [ ] Test navbar responsiveness

**Day 3-4: Homepage Simplification**
- [ ] Keep VideoHeroSection (no changes)
- [ ] Create new EventSummarySection component (3 cards)
- [ ] Create new FeatureDiscoverySection component (3 preview cards)
- [ ] Remove AboutUsSection, OurFamilySection, QuickPreview from homepage
- [ ] Update page.tsx to render only 3 sections

**Day 5-6: Section Migration**
- [ ] Move AboutUsSection to `/historia` page
- [ ] Move OurFamilySection to `/historia` page
- [ ] Move WeddingLocation to `/detalhes` page
- [ ] Test all affected pages

**Day 7: Testing & Analytics**
- [ ] Full regression testing (desktop + mobile)
- [ ] Set up analytics for new homepage structure
- [ ] Monitor bounce rate and time-on-page metrics

### Week 2: Mobile Navigation & Quick Actions

**Day 1-3: Mobile Bottom Navigation**
- [ ] Create MobileBottomNav component (5 tabs)
- [ ] Icons: Home, History, Gallery, Messages, Profile
- [ ] Active state highlighting
- [ ] Integration with existing Header component

**Day 4-5: Floating Action Button**
- [ ] Create FAB component with expandable menu
- [ ] Actions: Upload Photo, Post Message, Share, Progress
- [ ] Position: bottom-right, above MobileBottomNav
- [ ] Animation: pulse on first visit

**Day 6-7: Mobile Optimization**
- [ ] Test on iOS Safari (iPhone 12, 13, 14, 15)
- [ ] Test on Android Chrome (Samsung, Xiaomi devices)
- [ ] Fix any viewport or tap target issues
- [ ] Accessibility audit (WCAG 2.1 Level AA)

### Week 3: Guest Dashboard & Discovery

**Day 1-3: Build `/meu-convite` Page**
- [ ] Welcome header with guest name
- [ ] Progress tracker component (circular chart)
- [ ] Quick actions grid (4 cards)
- [ ] Recent activity feed
- [ ] Invitation details card (QR code)
- [ ] Event countdown widget

**Day 4-5: Feature Discovery Enhancements**
- [ ] FeatureDiscoverySection on homepage
- [ ] Post-RSVP onboarding modal
- [ ] Activity badges on navbar items
- [ ] "What's New" banner for returning guests

**Day 6-7: Guest Photo Upload Simplification**
- [ ] Remove password requirement (use guest sessions only)
- [ ] Add upload button in navbar/FAB
- [ ] Inline upload modal (no page navigation)
- [ ] Update `/dia-1000/upload` to redirect to new flow

### Week 4: Wedding Day Mode & Polish

**Day 1-2: Wedding Day Detection**
- [ ] Create wedding day detection utility
- [ ] Conditional homepage rendering
- [ ] Conditional navigation rendering
- [ ] LiveFeedHero component (replaces VideoHeroSection on wedding day)

**Day 3-4: Context-Aware Features**
- [ ] "Ao Vivo" navbar item (wedding day only)
- [ ] Mobile FAB behavior change (wedding day)
- [ ] Page redirect suggestions
- [ ] Connection status indicator

**Day 5-6: Final Testing**
- [ ] Simulate wedding day mode (change system date)
- [ ] Test real-time subscriptions under load
- [ ] Mobile device testing (venue WiFi conditions)
- [ ] Admin mobile panel testing

**Day 7: Pre-Launch Preparation**
- [ ] Deploy to production
- [ ] Monitor analytics dashboard
- [ ] Brief admin team on wedding day procedures
- [ ] Final accessibility audit

---

## Success Metrics & KPIs

### Primary Metrics (Track Weekly)

**1. Homepage Engagement**
- **Bounce Rate**: Target <20% (down from estimated 40%)
- **Time on Page**: Target >2 minutes (up from estimated 1 minute)
- **Scroll Depth**: Target 80% reach fold 2 (simplified to 3 sections)
- **CTA Click Rate**: Target 60% click hero CTA (RSVP or História)

**2. Feature Discovery**
- **Multi-Feature Usage**: Target 65% of guests interact with 2+ features
- **Messages Engagement**: Target 40% of guests post or react
- **Gallery Views**: Target 75% of guests view gallery
- **Dashboard Returns**: Target 60% of guests return to dashboard 3+ times

**3. Navigation Efficiency**
- **Mobile Nav Usage**: Track which tabs get most engagement
- **FAB Click Rate**: Target 30% of mobile users interact with FAB
- **Navbar Click Distribution**: Ensure no single item dominates (balance)
- **"Ao Vivo" Discovery**: Target 80% of guests access live feed on wedding day

**4. Conversion Funnel**
- **Invitation → RSVP**: Target 85% completion rate
- **RSVP → Second Feature**: Target 70% engage with another feature
- **First Visit → Return**: Target 65% return within 7 days
- **Pre-Wedding → Wedding Day**: Target 75% participate on wedding day

### Secondary Metrics (Track Daily During Wedding Week)

**Wedding Day Performance**:
- **Concurrent Users**: Peak during ceremony (target 70% of confirmed guests)
- **Posts Per Hour**: Target 20+ during reception
- **Photo Uploads**: Target 100+ during wedding day
- **Real-Time Uptime**: Target 99.5% subscription success rate

**Mobile Performance**:
- **Mobile Load Time**: Target <2 seconds on 4G
- **Mobile Conversion**: Target 80% parity with desktop
- **FAB Engagement**: Target 30% of mobile users use FAB
- **Bottom Nav Usage**: Track which tabs drive most engagement

### Analytics Implementation

**Google Analytics 4 Events to Track**:
```javascript
// Homepage engagement
gtag('event', 'homepage_section_view', {
  section_name: 'VideoHero' | 'EventSummary' | 'FeatureDiscovery'
})

// Navigation clicks
gtag('event', 'navbar_click', {
  item: 'História' | 'Galeria' | 'Mensagens' | 'Presentes' | 'MeuConvite' | 'AoVivo'
})

// Mobile interactions
gtag('event', 'mobile_nav_click', {
  tab: 'Início' | 'História' | 'Galeria' | 'Mensagens' | 'Perfil'
})

gtag('event', 'fab_click', {
  action: 'Upload' | 'Post' | 'Share' | 'Progress'
})

// Guest dashboard
gtag('event', 'dashboard_action', {
  action: 'RSVP' | 'Gift' | 'Photo' | 'Message',
  completed: true | false
})

// Wedding day specific
gtag('event', 'wedding_day_engagement', {
  feature: 'Live Feed' | 'Upload' | 'Post' | 'View'
})
```

**Supabase Analytics Queries**:
```sql
-- Feature discovery rate
SELECT
  COUNT(DISTINCT guest_id) as total_guests,
  COUNT(DISTINCT CASE WHEN rsvp_completed THEN guest_id END) as rsvp_guests,
  COUNT(DISTINCT CASE WHEN gift_selected THEN guest_id END) as gift_guests,
  COUNT(DISTINCT CASE WHEN photos_uploaded THEN guest_id END) as photo_guests,
  COUNT(DISTINCT CASE WHEN posts_count > 0 THEN guest_id END) as message_guests
FROM invitations
WHERE created_at >= '2025-10-01';

-- Homepage vs. personalized invitation conversion
SELECT
  invitation_source,
  COUNT(*) as visits,
  COUNT(CASE WHEN rsvp_completed THEN 1 END) as rsvp_completed,
  COUNT(CASE WHEN rsvp_completed THEN 1 END)::float / COUNT(*) as conversion_rate
FROM guest_sessions
GROUP BY invitation_source;

-- Wedding day engagement
SELECT
  DATE_TRUNC('hour', created_at) as hour,
  COUNT(*) as posts_count,
  COUNT(DISTINCT guest_session_id) as unique_guests
FROM guest_posts
WHERE created_at::date = '2025-11-20'
GROUP BY hour
ORDER BY hour;
```

---

## Behavioral Psychology Insights

### Cognitive Load Reduction

**Problem**: Current homepage has 7 sections = High cognitive load
**Solution**: Simplify to 3 sections = Reduced decision fatigue

**Psychological Principle**: **Hick's Law** - Decision time increases logarithmically with number of choices.

**Application**:
- Homepage: 3 sections instead of 7 (57% reduction in choices)
- Navigation: 6 items instead of 7 (prioritization clear)
- Mobile nav: 5 tabs (optimal for thumb reach + working memory)

### Progressive Disclosure

**Problem**: All features exposed immediately = Overwhelming
**Solution**: Guided discovery path = Manageable exploration

**Psychological Principle**: **Information Foraging Theory** - Users follow "scent" of information like animals foraging.

**Application**:
- Hero: Single primary CTA (RSVP) - clear scent
- Feature Discovery Section: Preview 3 features - breadcrumbs
- Post-RSVP: Suggest next action - continued scent
- Dashboard: All features organized - information hub

### Loss Aversion & FOMO

**Problem**: No incentive to return after RSVP
**Solution**: Progress tracker + "What's New" badges

**Psychological Principle**: **Loss Aversion** - People are motivated by not missing out more than by gaining something.

**Application**:
- Progress tracker: "75% complete" (fear of incomplete)
- Activity badges: "12 novas fotos" (FOMO - missing updates)
- Countdown timer: "Faltam 45 dias" (urgency)
- Wedding day: "Acontecendo agora!" (peak FOMO)

### Social Proof

**Problem**: Guests don't know what actions are expected
**Solution**: Show what other guests are doing

**Psychological Principle**: **Social Proof** - People follow the behavior of others, especially in uncertain situations.

**Application**:
- "45 convidados já confirmaram" (RSVP page)
- "124 mensagens postadas" (Messages section)
- "87 fotos compartilhadas" (Gallery)
- Post previews showing active participation

### Peak-End Rule

**Problem**: Generic experience, no memorable moments
**Solution**: Personalization + wedding day climax

**Psychological Principle**: **Peak-End Rule** - People judge an experience by its peak (most intense point) and end.

**Application**:
- **Peak**: Personalized invitation ("Olá, Maria!") - emotional high
- **Peak**: VideoHeroSection with proposal video - emotional impact
- **Peak**: Wedding day live feed - climactic moment
- **End**: "Obrigado!" page post-wedding - positive closure
- Dashboard progress completion: "Você explorou tudo!" - achievement

### Zeigarnik Effect

**Problem**: Guests complete RSVP and forget about site
**Solution**: Open loops via progress tracker

**Psychological Principle**: **Zeigarnik Effect** - People remember uncompleted tasks better than completed ones.

**Application**:
- Progress tracker: "2/4 ações completas" (open loop)
- Dashboard checklist: ☑️ RSVP, ☐ Message, ☐ Photo, ☐ Gift
- Navbar badge: "Ver Galeria (5 novas)" (unresolved curiosity)
- Return prompts: "Que tal enviar uma mensagem?" (incomplete task)

---

## Design Principles: Elegant Wedding Aesthetic

### Maintaining Design Integrity

**Current Design System** (Preserve):
- Playfair Display: Headings, names, important text
- Crimson Text: Body text, italic emphasis
- Warm off-white (#F8F6F3): Background
- Charcoal (#2C2C2C): Primary text
- Silver-gray (#A8A8A8): Decorative elements
- Generous white space (80-150px margins)
- Center-aligned layouts
- Subtle botanical ornaments
- Mobile-first responsive design

**Changes That Support Simplification**:

1. **White Space Enhancement**
   - Fewer sections = More breathing room
   - 150-200px margins between sections (was 80-150px)
   - Hero can stay full-screen without feeling cramped

2. **Typography Hierarchy**
   - Clear H1 → H2 → H3 progression
   - Hero: 48-64px (Playfair Display)
   - Section headings: 36-42px (Playfair Display)
   - Body: 18-22px (Crimson Text)
   - No competing visual weights

3. **Color Blocking**
   - Background alternation: #F8F6F3 → White → #F8F6F3
   - 3 sections = Clean visual rhythm
   - Avoid color fatigue from 7 sections

4. **Animation Consistency**
   - Framer Motion entrance: `initial={{ opacity: 0, y: 20 }}`
   - Stagger delay: 0.1s per section
   - 3 sections = 0.3s total (feels snappy)
   - 7 sections = 0.7s total (feels sluggish)

**Mobile Design Considerations**:

1. **Bottom Navigation**
   - Glass morphism effect: `backdrop-blur-md`
   - Border top: 1px solid #E8E6E3
   - Icons: 24px, Lucide React
   - Labels: 10px, Crimson Text
   - Active state: Charcoal text, subtle background

2. **FAB (Floating Action Button)**
   - Size: 56px × 56px (Material Design standard)
   - Position: bottom-right, 16px margin
   - Above bottom nav z-index
   - Pulsing animation on first visit
   - Menu expansion: upward (4 items max)

3. **Touch Targets**
   - Minimum 44px × 44px (WCAG 2.1)
   - Navbar items: 48px height
   - Bottom nav tabs: 56px height
   - FAB: 56px diameter
   - Card CTAs: Padding 12px 24px minimum

---

## Mobile-First Considerations (Brazilian Market)

### Market Research

**Brazil Mobile Usage Statistics**:
- 70-75% of web traffic is mobile (higher than global average)
- WhatsApp is primary communication channel (99% penetration)
- Instagram is primary social media (95% of users)
- Average mobile data speed: 4G (50-100 Mbps in cities)
- Common devices: Samsung Galaxy A-series, Motorola Moto G, iPhones (SE, 11, 12)

**Implications for Wedding Site**:
1. **WhatsApp sharing is critical** - Every page needs WhatsApp share button
2. **Instagram-style UI familiar** - Stories, cards, bottom nav feel natural
3. **4G performance acceptable** - Video autoplay works, but optimize images
4. **Mixed device capabilities** - Support Android 9+ and iOS 13+
5. **Data consciousness** - Users monitor data usage, prefer efficient sites

### Mobile Optimization Strategy

**1. Performance Budget**
```
Homepage (3 sections):
- Initial load: <2s on 4G (currently achieves this)
- VideoHeroSection poster: WebP, <500KB
- Video: Lazy load, autoplay on WiFi only
- Feature previews: Thumbnail images <100KB each
- Total page weight: <3MB (down from estimated 5MB with 7 sections)
```

**2. Touch-Optimized Interactions**
```
- All CTAs: Minimum 44×44px
- Navbar items: 48px height, 16px horizontal padding
- Bottom nav tabs: 56px height, full-width tap target
- FAB: 56×56px, 16px margin from edges
- Cards: 16px padding, rounded corners 12px
- Form inputs: 48px height, 16px font size
```

**3. Mobile Navigation Hierarchy**
```
Priority 1 (Bottom Nav): Início, História, Galeria, Mensagens, Perfil
Priority 2 (FAB): Upload Foto, Postar Mensagem
Priority 3 (Hamburger): Presentes, Detalhes, Contato, Admin
```

**4. WhatsApp Integration**
```javascript
// Share invitation
const shareOnWhatsApp = (inviteCode) => {
  const url = `https://thousandaysof.love/convite/${inviteCode}`
  const text = `Você está convidado para o casamento de Hel & Ylana! 💍\n1000 dias de amor. 20 de novembro de 2025.`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`
  window.open(whatsappUrl, '_blank')
}

// Share photo from gallery
const sharePhotoOnWhatsApp = (photoUrl, caption) => {
  const text = `Veja esta foto do casamento de Hel & Ylana!\n${caption}\n${photoUrl}`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
  window.open(whatsappUrl, '_blank')
}
```

**5. Offline Support (Service Worker)**
```javascript
// Cache homepage + key pages for offline viewing
const CACHE_URLS = [
  '/',
  '/historia',
  '/galeria',
  '/mensagens',
  '/meu-convite',
  // Plus static assets
]

// Wedding day: Ensure offline access to /ao-vivo page structure
// (Data fetched when reconnected)
```

**6. Data Efficiency**
```
- Use Next.js Image component for automatic WebP conversion
- Lazy load images below fold
- Video: poster image + play button (user chooses to load video)
- Implement infinite scroll pagination (20 items per page)
- Compress JSON responses with gzip
- Use Supabase real-time only on /ao-vivo page (not everywhere)
```

---

## Accessibility Considerations (WCAG 2.1 AA)

### Current Issues

**Keyboard Navigation**:
- ✓ All navbar items keyboard accessible
- ✓ Skip to content link present
- ⚠️ Modal close buttons need focus trap
- ⚠️ FAB menu needs keyboard support

**Screen Reader Support**:
- ✓ Semantic HTML (header, nav, main, section)
- ⚠️ Progress tracker needs ARIA labels
- ⚠️ Live feed needs ARIA-live regions
- ⚠️ Mobile bottom nav needs role="navigation"

**Color Contrast**:
- ✓ Primary text (#2C2C2C) on background (#F8F6F3): 13.5:1 (AAA)
- ✓ Decorative text (#A8A8A8) on background: 4.7:1 (AA)
- ⚠️ Navbar active state needs higher contrast

**Touch Targets**:
- ✓ Desktop navbar items: 48px height (meets 44px minimum)
- ⚠️ Mobile nav tabs: Currently ~40px (needs increase to 48px+)
- ⚠️ FAB menu items: Need 44px minimum height

### Accessibility Improvements

**1. Focus Management**
```jsx
// FAB Menu focus trap
const FABMenu = () => {
  const menuRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeMenu()
      fabButtonRef.current?.focus()
    }
    // Arrow key navigation between menu items
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      // Navigate menu items
    }
  }

  return (
    <div ref={menuRef} onKeyDown={handleKeyDown} role="menu">
      {/* Menu items */}
    </div>
  )
}
```

**2. ARIA Labels**
```jsx
// Progress tracker
<div
  role="progressbar"
  aria-valuenow={progress.completion_percentage}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label={`Progresso do convite: ${progress.completion_percentage}% completo`}
>
  {/* Circular progress chart */}
</div>

// Live feed
<section
  aria-live="polite"
  aria-atomic="false"
  aria-relevant="additions"
>
  {/* Real-time posts */}
</section>

// Mobile bottom nav
<nav role="navigation" aria-label="Navegação principal">
  <a href="/" aria-label="Início" aria-current={isActive ? 'page' : undefined}>
    <Home aria-hidden="true" />
    <span>Início</span>
  </a>
</nav>
```

**3. Reduced Motion Support**
```jsx
// Respect prefers-reduced-motion
const shouldReduceMotion = useReducedMotion()

const sectionVariants = shouldReduceMotion
  ? { initial: {}, animate: {} }
  : {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 }
    }

<motion.section variants={sectionVariants}>
  {/* Content */}
</motion.section>
```

**4. Color Contrast Fixes**
```css
/* Navbar active state */
.nav-item-active {
  background: #E8E6E3; /* Increase contrast */
  color: #2C2C2C;
  border-left: 3px solid #5C2E2E; /* Visual indicator */
}

/* Bottom nav active state */
.bottom-nav-active {
  color: #5C2E2E; /* Burgundy - higher contrast */
  font-weight: 600; /* Visual emphasis */
}
```

**5. Touch Target Sizing**
```css
/* Mobile bottom nav */
.mobile-nav-tab {
  min-height: 56px;
  min-width: 56px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* FAB menu items */
.fab-menu-item {
  min-height: 48px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}
```

---

## A/B Testing Strategy

### Hypothesis-Driven Testing

**Test 1: Homepage Section Count**
- **Hypothesis**: Reducing homepage to 3 sections will decrease bounce rate by 20%
- **Variants**:
  - A (Control): Current 7 sections
  - B (Test): Proposed 3 sections (Hero + Event Summary + Feature Discovery)
- **Metrics**: Bounce rate, time on page, scroll depth, CTA click rate
- **Duration**: 2 weeks (50/50 traffic split)
- **Success Criteria**: B variant achieves <25% bounce rate (vs. A's estimated 40%)

**Test 2: Feature Discovery Approach**
- **Hypothesis**: Preview cards drive more engagement than "Quick Preview" links
- **Variants**:
  - A: Current "Quick Preview" section with text links
  - B: New "Feature Discovery" with image previews + descriptions
- **Metrics**: Click-through rate to featured pages, multi-feature usage rate
- **Duration**: 1 week
- **Success Criteria**: B variant achieves >15% CTR increase

**Test 3: Post-RSVP Journey**
- **Hypothesis**: Guided post-RSVP onboarding increases multi-feature usage by 30%
- **Variants**:
  - A: Standard "RSVP confirmed" message → redirect to homepage
  - B: Post-RSVP modal with feature suggestions → redirect to dashboard
- **Metrics**: % of users who engage with 2+ features after RSVP
- **Duration**: 2 weeks
- **Success Criteria**: B variant achieves >65% multi-feature usage

**Test 4: Mobile Navigation Style**
- **Hypothesis**: Bottom nav bar increases mobile engagement vs. hamburger menu
- **Variants**:
  - A: Current hamburger menu (mobile header)
  - B: Proposed bottom nav bar (5 tabs + FAB)
- **Metrics**: Mobile navigation clicks, feature discovery rate, session duration
- **Duration**: 2 weeks
- **Success Criteria**: B variant achieves >40% increase in mobile nav usage

**Test 5: Wedding Day Hero**
- **Hypothesis**: Live feed hero on wedding day drives 50% higher live feed participation
- **Variants**:
  - A: Standard VideoHeroSection (unchanged)
  - B: LiveFeedHero with "Acompanhe Ao Vivo" CTA
- **Metrics**: % of wedding day visitors who access /ao-vivo
- **Duration**: Wedding day only (Nov 20, 2025)
- **Success Criteria**: B variant achieves >75% live feed access rate

### Implementation with Vercel Edge Config

```typescript
import { get } from '@vercel/edge-config'

export async function getHomepageVariant(userId: string) {
  const experiments = await get('experiments')
  const homepageTest = experiments.homepage_sections

  // Deterministic variant assignment based on user ID
  const variant = hashCode(userId) % 2 === 0 ? 'A' : 'B'

  return {
    variant,
    sections: variant === 'A'
      ? ['hero', 'eventDetails', 'storyPreview', 'aboutUs', 'family', 'quickPreview', 'location']
      : ['hero', 'eventSummary', 'featureDiscovery']
  }
}
```

---

## Risk Assessment & Mitigation

### Risk 1: User Confusion from Drastic Changes

**Probability**: Medium
**Impact**: High (could frustrate existing guests who've explored the site)

**Mitigation Strategies**:
1. **Phased Rollout**: Test with new guests first (invitations not yet sent)
2. **Change Notification**: Banner on first visit: "Atualizamos nosso site! Veja o que mudou →"
3. **Guided Tour**: Optional 30-second tour highlighting new navigation and features
4. **Preserve URLs**: Don't break existing bookmarks or shared links
5. **Fallback Links**: Footer includes "Mapa do Site" with all page links

**Monitoring**:
- Track "404 errors" and "broken link" support tickets
- Monitor bounce rate closely first week post-launch
- Survey close family/friends for feedback

### Risk 2: Mobile Performance Degradation

**Probability**: Low
**Impact**: High (mobile is 70% of traffic in Brazil)

**Mitigation Strategies**:
1. **Performance Budget**: Enforce <2s load time on 4G
2. **Lighthouse CI**: Automated performance testing on every deployment
3. **Real User Monitoring**: Track Core Web Vitals (LCP, FID, CLS)
4. **Progressive Enhancement**: Ensure site works without JavaScript
5. **Offline Testing**: Test on slow 3G networks

**Monitoring**:
- Google Analytics: Track page load times by device type
- Vercel Analytics: Monitor Core Web Vitals
- User feedback: Add "Site lento?" feedback button

### Risk 3: Feature Discovery Drops (Opposite of Goal)

**Probability**: Low-Medium
**Impact**: High (defeats purpose of simplification)

**Mitigation Strategies**:
1. **A/B Testing**: Run tests before full rollout (see A/B Testing Strategy)
2. **Analytics Benchmarks**: Measure current feature discovery rates first
3. **Feature Discovery Section**: Prominently showcase all key features
4. **Post-RSVP Guidance**: Direct users to next actions
5. **Email Reminders**: SendGrid campaigns highlighting features

**Monitoring**:
- Track multi-feature usage rate (target: 65%+)
- Monitor click-through rates on Feature Discovery cards
- Survey guests: "Did you know about [feature]?"

### Risk 4: Wedding Day Technical Failures

**Probability**: Low
**Impact**: Critical (can't redo wedding day)

**Mitigation Strategies**:
1. **Load Testing**: Simulate 100+ concurrent users before wedding day
2. **Vercel Pro Plan**: Ensure sufficient bandwidth and Supabase connections
3. **Fallback Mechanisms**: Auto-refresh if real-time subscriptions fail
4. **Admin Mobile Panel**: Tested and ready for on-site moderation
5. **Backup Internet**: Venue WiFi + mobile hotspot for admins
6. **Emergency Contacts**: Vercel support, Supabase support on speed dial

**Monitoring**:
- Real-time dashboard showing server health
- Connection status indicator on /ao-vivo page
- Admin mobile alerts for any errors

### Risk 5: Accessibility Regressions

**Probability**: Medium
**Impact**: Medium (legal/ethical concern, bad UX for some users)

**Mitigation Strategies**:
1. **Accessibility Audit**: Pre-launch audit with WCAG 2.1 AA checklist
2. **Automated Testing**: axe DevTools, Lighthouse accessibility score
3. **Manual Testing**: Screen reader testing (NVDA, VoiceOver)
4. **Keyboard Testing**: Navigate entire site without mouse
5. **User Testing**: Test with guests of varying abilities

**Monitoring**:
- Lighthouse accessibility score: Target 95+
- WAVE errors: Target 0
- User feedback: Add "Acessibilidade" feedback form

---

## Conclusion & Next Steps

### Summary of Recommendations

**Navigation Architecture**:
1. Desktop navbar: 6 items (Início, Nossa História, Galeria, Mensagens, Presentes, [CTA: RSVP])
2. Mobile bottom nav: 5 tabs (Início, História, Galeria, Mensagens, Perfil)
3. Floating Action Button: Quick upload/post actions
4. Context-aware: "Ao Vivo" appears on wedding day, "Meu Convite" for logged-in guests

**Homepage Simplification**:
1. Keep: VideoHeroSection (non-negotiable)
2. Add: EventSummarySection (3 cards: Date, Time, Location)
3. Add: FeatureDiscoverySection (3 previews: História, Galeria, Mensagens)
4. Remove: AboutUs, OurFamily, QuickPreview, WeddingLocation (move to other pages)
5. Result: Hero + 2-3 sections maximum

**Guest Dashboard** (`/meu-convite`):
1. Personalized welcome with countdown
2. Progress tracker (circular chart, 4 actions)
3. Quick actions grid
4. Recent activity feed
5. Invitation details + QR code

**Feature Discoverability**:
1. Feature Discovery Section on homepage
2. Post-RSVP onboarding modal
3. Activity badges on navbar items
4. Simplified photo upload flow (remove password, add inline modal)
5. Wedding day context-aware features

**Wedding Day Mode**:
1. Automatic detection (Nov 20, 2025)
2. LiveFeedHero replaces VideoHeroSection
3. "🔴 Ao Vivo" prominent in navigation
4. Enhanced mobile FAB for quick uploads
5. Real-time subscriptions active

### Implementation Priority

**Phase 1 (Week 1): Critical Path - Navigation & Homepage**
- Desktop navbar update
- Homepage simplification (keep hero + 2 sections)
- Section migration (move AboutUs, OurFamily, etc.)

**Phase 2 (Week 2): Mobile Experience**
- Bottom navigation component
- Floating Action Button
- Mobile optimization testing

**Phase 3 (Week 3): Discovery & Engagement**
- Guest dashboard (`/meu-convite`)
- Feature Discovery Section
- Post-RSVP onboarding
- Activity badges

**Phase 4 (Week 4): Wedding Day Readiness**
- Wedding day detection
- Context-aware navigation
- LiveFeedHero component
- Load testing

### Decision Framework: What to Prioritize

Use this framework to make trade-off decisions:

**Question 1**: Does this feature directly increase RSVP conversion?
- **Yes** → Priority 1 (Hero CTAs, Event Summary, Personalized invitations)
- **No** → Evaluate next question

**Question 2**: Does this feature increase multi-feature engagement?
- **Yes** → Priority 2 (Feature Discovery, Guest Dashboard, Post-RSVP guidance)
- **No** → Evaluate next question

**Question 3**: Is this feature critical for wedding day?
- **Yes** → Priority 3 (Live feed, Mobile FAB, Real-time subscriptions)
- **No** → Priority 4 (Nice-to-have)

**Question 4**: Does this feature maintain elegant wedding aesthetic?
- **No** → Reject or redesign
- **Yes** → Implement based on above priorities

### Success Criteria (3-Month View)

**Immediate (Week 1 Post-Launch)**:
- [ ] Bounce rate <25% (down from estimated 40%)
- [ ] Homepage load time <2s on 4G
- [ ] Zero accessibility regressions (Lighthouse 95+)
- [ ] Mobile navigation functional on iOS and Android

**Short-Term (1 Month Pre-Wedding)**:
- [ ] 85%+ invitation open rate
- [ ] 80%+ RSVP completion rate (within 48 hours of invitation)
- [ ] 65%+ multi-feature usage rate
- [ ] 40%+ guests post message or upload photo

**Wedding Day (November 20, 2025)**:
- [ ] 75%+ guests access live feed
- [ ] 20+ posts per hour during reception
- [ ] 100+ photos uploaded during event
- [ ] 99%+ uptime and real-time subscription success

**Post-Wedding (1 Week After)**:
- [ ] 200+ total guest posts
- [ ] 500+ total photos uploaded
- [ ] 90%+ guest satisfaction (post-wedding survey)
- [ ] Complete data archive for couple's memories

---

## Appendix: Technical Implementation Notes

### Component Architecture

**New Components to Build**:
```
/components/sections/
  ├── EventSummarySection.tsx       (Homepage - replaces EventDetailsSection)
  ├── FeatureDiscoverySection.tsx   (Homepage - new)
  ├── LiveFeedHero.tsx              (Homepage - wedding day variant)
  └── PostRsvpOnboarding.tsx        (Modal - after RSVP completion)

/components/navigation/
  ├── MobileBottomNav.tsx           (Mobile - 5 tabs)
  ├── FloatingActionButton.tsx      (Mobile - FAB with menu)
  └── EnhancedHeader.tsx            (Updated - context-aware)

/components/dashboard/
  ├── GuestDashboard.tsx            (Page - /meu-convite)
  ├── ProgressTracker.tsx           (Already exists - enhance)
  ├── QuickActionsGrid.tsx          (4 action cards)
  ├── RecentActivityFeed.tsx        (Guest's recent actions)
  └── InvitationDetailsCard.tsx     (QR code, invite code)

/components/discovery/
  ├── FeaturePreviewCard.tsx        (Reusable preview component)
  ├── OnboardingTour.tsx            (First-visit guide)
  └── ActivityBadge.tsx             (Navbar notification badges)

/lib/utils/
  ├── weddingDay.ts                 (Date detection utilities)
  ├── analytics.ts                  (GA4 event tracking)
  └── experiments.ts                (A/B testing logic)
```

### Database Schema Changes (None Required)

All proposed features work with existing Supabase schema:
- `invitations` table: Already created (Phase 2)
- `guest_posts` table: Already created (Phase 3)
- `guest_photos` table: Already exists
- `guest_sessions` table: Already exists
- `pinned_posts` table: Already created (Phase 5)

**No migrations needed** - This is purely a frontend UX optimization.

### Environment Variables

```bash
# Existing (no changes)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
ADMIN_PASSWORD=
GUEST_SHARED_PASSWORD=

# New (optional for A/B testing)
VERCEL_EDGE_CONFIG=
NEXT_PUBLIC_WEDDING_DATE=2025-11-20
NEXT_PUBLIC_ENABLE_EXPERIMENTS=true
```

### Deployment Strategy

**1. Feature Flags**:
```typescript
// lib/featureFlags.ts
export const FEATURE_FLAGS = {
  simplifiedHomepage: process.env.NEXT_PUBLIC_SIMPLIFIED_HOMEPAGE === 'true',
  mobileBottomNav: process.env.NEXT_PUBLIC_MOBILE_BOTTOM_NAV === 'true',
  guestDashboard: process.env.NEXT_PUBLIC_GUEST_DASHBOARD === 'true',
  weddingDayMode: process.env.NEXT_PUBLIC_WEDDING_DAY_MODE === 'true',
}
```

**2. Progressive Rollout**:
```
Week 1: Deploy to staging → Test with team
Week 2: Deploy to production with feature flags OFF → Smoke test
Week 3: Enable simplified homepage (50% traffic) → Monitor metrics
Week 4: Enable all features (100% traffic) → Full launch
```

**3. Rollback Plan**:
```
If bounce rate increases by >10%:
→ Roll back to full 7-section homepage
→ Investigate analytics for cause
→ Iterate on design based on data

If mobile navigation breaks:
→ Fallback to hamburger menu
→ Fix iOS/Android compatibility issues
→ Redeploy mobile nav when stable
```

---

**Document Version**: 1.0
**Last Updated**: October 13, 2025
**Next Review**: Post-implementation (Week 5)
**Owner**: Hel Rabelo (Frontend Lead) + UX Research Team
**Stakeholders**: Hel & Ylana (Couple), Wedding Planning Team, Guest Experience Team
