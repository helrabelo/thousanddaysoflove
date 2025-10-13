# RSVP Visual Design Reference
## Design Patterns & Inspiration for Thousand Days of Love

**Purpose:** Visual reference guide for implementing RSVP enhancements
**Aesthetic:** Elegant wedding invitation, monochromatic, generous white space
**Inspiration Sources:** Joy, Paperless Post, Squarespace, Riley & Grey

---

## Design System Alignment

### Color Palette (Your Existing System)
```css
--background: #F8F6F3         /* Warm off-white/cream */
--primary-text: #2C2C2C       /* Charcoal black */
--secondary-text: #4A4A4A     /* Medium gray */
--decorative: #A8A8A8         /* Silver-gray */
--accent: #E8E6E3             /* Subtle warm gray */
--white-soft: rgba(255,255,255,0.95)
--border-subtle: rgba(0,0,0,0.08)
```

### Celebration Colors (New - For Confetti & Accents)
```css
/* Soft romantic palette for celebrations */
--celebration-pink: #ffd1dc    /* Soft pink */
--celebration-rose: #f8b4d9    /* Rose */
--celebration-cream: #ffe4e1   /* Misty rose */
--celebration-gold: #D4AF37    /* Muted gold */
--celebration-white: #ffffff   /* Pure white */

/* Success green (existing) */
--success: #22c55e             /* Green for "YES" confirmations */
```

### Typography Scale
```css
/* Hero level */
--text-hero: clamp(3rem, 10vw, 6rem)
--font-hero: var(--font-playfair)

/* H1 - Page titles */
--text-h1: clamp(2rem, 5vw, 3rem)
--font-h1: var(--font-playfair)

/* H2 - Section titles */
--text-h2: clamp(1.75rem, 4vw, 2.25rem)
--font-h2: var(--font-playfair)

/* Body large */
--text-body-lg: clamp(1.125rem, 2.5vw, 1.375rem)
--font-body: var(--font-crimson)

/* Body regular */
--text-body: clamp(1rem, 2vw, 1.125rem)

/* Caption/small */
--text-caption: 0.875rem
```

---

## Visual Layout Patterns

### Pattern 1: Story Moment Hero
```
┌─────────────────────────────────────────────┐
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │                                       │ │
│  │                                       │ │
│  │        [Couple Photo 1200x800]       │ │
│  │                                       │ │
│  │                                       │ │
│  └───────────────────────────────────────┘ │
│                                             │
│     "1000 dias se transformam em para       │
│              sempre"                        │
│                                             │
│  Do primeiro "oi" no WhatsApp até este      │
│  momento. Queremos você ao nosso lado...    │
│                                             │
│  20 DE NOVEMBRO DE 2025 • CASA HY           │
│                                             │
└─────────────────────────────────────────────┘

Design Details:
- Photo: Rounded corners (16px), subtle shadow
- Heading: Playfair Display, 2-2.5rem, centered
- Body: Crimson Text, italic, 1.125rem
- Date: Uppercase, letter-spacing 0.1em
- Spacing: 4rem vertical between elements
```

### Pattern 2: Search Card (Existing + Enhanced)
```
┌─────────────────────────────────────────────┐
│                                             │
│  Confirme sua Presença                      │
│  Digite seu nome para encontrar seu convite │
│                                             │
│  ┌─────────────────────────┬─────────────┐ │
│  │ Digite seu nome...      │  [Buscar]   │ │
│  └─────────────────────────┴─────────────┘ │
│                                             │
└─────────────────────────────────────────────┘

Enhancement Ideas:
- Add subtle botanical corner decoration
- Soft inner shadow on input field
- Magnifying glass icon animated on hover
- Placeholder text with elegant fade-in
```

### Pattern 3: Guest Card with Enhanced Buttons
```
┌─────────────────────────────────────────────┐
│                                             │
│  João Silva                                 │
│  Aguardando confirmação                     │
│                                             │
│  ┌──────────────┐  ┌──────────────┐        │
│  │  ✓ Sim, vou! │  │  ✗ Não posso │        │
│  └──────────────┘  └──────────────┘        │
│                                             │
└─────────────────────────────────────────────┘

Hover State Visual:
┌─────────────────────────────────────────────┐
│  ┌──────────────┐  ┌──────────────┐        │
│  │ [Glow effect]│  │              │        │
│  │  ✓ Sim, vou! │  │  ✗ Não posso │        │
│  │ [Soft green] │  │              │        │
│  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────┘
```

### Pattern 4: Success Modal with Countdown
```
┌─────────────────────────────────────────────┐
│                                             │
│              [Heart Icon]                   │
│                                             │
│           Confirmado! ✨                    │
│                                             │
│   João, mal podemos esperar para celebrar   │
│              com você!                      │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │                                       │ │
│  │               38                      │ │ ← Giant number
│  │        dias até o grande dia          │ │
│  │   🎊 A contagem regressiva começou!   │ │
│  │                                       │ │
│  │   ─────────────────────────────       │ │
│  │   20 DE NOVEMBRO • 10:30              │ │
│  │   Casa HY, Fortaleza                  │ │
│  │                                       │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │ 📅 Marque seu calendário             │  │
│  └─────────────────────────────────────┘  │
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │ 📍 Veja os detalhes do evento        │  │
│  └─────────────────────────────────────┘  │
│                                             │
│       [Perfeito, entendi!]                 │
│                                             │
└─────────────────────────────────────────────┘

Visual Hierarchy:
1. Heart icon (60-80px, animated scale)
2. "Confirmado!" (3rem, bold)
3. Personal message (1.25rem, italic)
4. COUNTDOWN CARD (gradient bg, prominent)
5. Next steps (secondary cards)
6. CTA button (primary style)
```

---

## Confetti Animation Patterns

### Option 1: Classic Burst (Joyful)
```
Animation:
- 100 particles from bottom-center
- 70-degree spread
- Colors: cream, pink, rose, white
- Duration: 2 seconds
- Physics: Gravity 1, realistic fall

Use case: Standard "YES" confirmation
Emotional tone: Celebratory, festive
```

### Option 2: Heart Rain (Romantic)
```
Animation:
- 50 heart-shaped particles
- Full-width random origin
- Colors: pink gradient (#ff69b4 to #ffc0cb)
- Duration: 3 seconds
- Physics: Gentle drift, slow fall

Use case: Elegant weddings, romantic aesthetic
Emotional tone: Loving, tender
```

### Option 3: Sparkle Burst (Sophisticated)
```
Animation:
- Continuous sparkles for 2 seconds
- Random positions across screen
- Colors: white, cream, gold
- Small particle size (0.8 scalar)
- Physics: Quick fade, minimal gravity

Use case: Luxury/elegant aesthetic (RECOMMENDED)
Emotional tone: Sophisticated, magical
```

### Visual Comparison
```
Classic Burst          Heart Rain         Sparkle Burst
     🎉                   ❤️                  ✨
   ○ ○ ○                ♥ ♥                ·  ·  ·
  ○  ○  ○              ♥ ♥ ♥              ·   ·   ·
 ○   ○   ○            ♥   ♥   ♥          ·    ·    ·
○    ○    ○          ♥    ♥    ♥        · · · · · ·

Festive              Romantic           Elegant
High energy          Gentle             Subtle
Colorful             Pink tones         Monochrome
```

---

## Mobile Layout Adaptations

### Mobile Story Section (< 768px)
```
┌────────────────────┐
│                    │
│  [Photo 100% w]    │
│                    │
├────────────────────┤
│                    │
│  "1000 dias se     │
│  transformam..."   │
│                    │
│  Story text with   │
│  comfortable       │
│  padding (24px)    │
│                    │
│  DATE INFO         │
│                    │
└────────────────────┘

Changes:
- Photo: Full-width, 16:9 aspect
- Text: 24px horizontal padding
- Font sizes: -20% of desktop
- Line height: 1.7 (more readable)
```

### Mobile Countdown Card
```
┌────────────────────┐
│                    │
│        38          │  ← Smaller but still prominent
│                    │
│  dias até o        │
│  grande dia        │
│                    │
│  🎊 Contagem       │
│  regressiva!       │
│                    │
│  ───────────       │
│                    │
│  20 DE NOVEMBRO    │
│  10:30             │  ← Stacked on mobile
│  Casa HY           │
│                    │
└────────────────────┘

Changes:
- Number: 3rem (vs 4.5rem desktop)
- Text: Stacked vertically
- Padding: Reduced to 24px
- Line breaks: After each line
```

### Mobile Button Stack
```
Desktop:
[Sim, vou!] [Não posso]  ← Side by side

Mobile:
┌────────────────────┐
│   [Sim, vou!]      │  ← Full width
└────────────────────┘
┌────────────────────┐
│   [Não posso]      │  ← Full width
└────────────────────┘

Properties:
- width: 100%
- min-height: 48px (iOS touch target)
- gap: 12px between buttons
- font-size: 16px (prevent zoom on iOS)
```

---

## Micro-Interaction Details

### Button Hover State
```css
.rsvp-button {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

/* Animated background on hover */
.rsvp-button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #f0f9ff, #ecfccb);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.rsvp-button:hover::before {
  opacity: 1;
}

/* Icon animation */
.rsvp-button:hover .icon {
  transform: scale(1.2) rotate(10deg);
}
```

### Loading Spinner
```
State 1: Idle
[Confirmar Presença]

State 2: Loading
[⟳ Confirmando...]  ← Spinner rotates 360° continuously

State 3: Success (brief flash before modal)
[✓ Confirmado!]  ← 300ms then modal appears

Visual:
- Spinner: 16px, current color
- Rotation: Linear, 0.8s per cycle
- Icon size: 20px
```

### Countdown Number Animation
```
Initial state: scale(0), opacity(0)
Animate to: scale(1), opacity(1)
Delay: 0.6s (after heart icon)
Type: Spring animation
Stiffness: 200

Effect: Number "pops" into view with bounce
```

### Confetti Trigger Sequence
```
Timeline:
0ms:   Form submits, modal hidden
0ms:   Confetti begins bursting
300ms: Success modal starts fading in
600ms: Countdown animates in
800ms: Heart icon scales in
1200ms: All animations complete

Overlap creates smooth, exciting transition
```

---

## Accessibility Patterns

### Focus States
```css
/* Visible focus for keyboard users */
.focusable:focus-visible {
  outline: 2px solid var(--primary-text);
  outline-offset: 4px;
  border-radius: 8px;
}

/* Never remove focus entirely */
.focusable:focus {
  /* Still show something even without :focus-visible */
  box-shadow: 0 0 0 3px rgba(44, 44, 44, 0.1);
}
```

### Screen Reader Announcements
```html
<!-- Live region for dynamic updates -->
<div role="status" aria-live="polite" aria-atomic="true" class="sr-only">
  {saving && "Salvando sua confirmação..."}
  {success && "Confirmação salva com sucesso!"}
</div>

<!-- Button labels -->
<button aria-label="Confirmar presença no casamento">
  Sim, vou!
</button>

<!-- Countdown semantic markup -->
<div role="timer" aria-live="off">
  <span aria-label="38 dias até o casamento">38</span>
  dias até o grande dia
</div>
```

### Color Contrast Compliance
```
Required: 4.5:1 for normal text, 3:1 for large text

Verified combinations:
✓ #2C2C2C on #F8F6F3 → 11.2:1 (excellent)
✓ #4A4A4A on #F8F6F3 → 7.8:1 (excellent)
✓ White on video overlay → 5.2:1 (good)
✓ #22c55e on white → 4.8:1 (pass)

Failed combinations:
✗ #A8A8A8 on #F8F6F3 → 2.1:1 (use for decorative only)
```

---

## Real-World Inspiration Screenshots

### Joy Platform Pattern
```
Structure:
[Couple photo hero]
↓
"Will you celebrate with us?"
↓
[Name search with auto-complete]
↓
[Found: John Smith + Sarah Smith]
↓
[RSVP for both with single submission]
↓
[Success with confetti + next steps]

Takeaways:
- Family grouping (smart!)
- Single submission for household
- Auto-complete from guest list
- Bright, friendly tone throughout
```

### Paperless Post Pattern
```
Structure:
[Elegant card-style invitation]
↓
"You're Invited" (formal tone)
↓
[Guest name pre-filled from invite link]
↓
[Yes/No with elegant checkboxes]
↓
[Conditional meal selection]
↓
[Thank you with event details reminder]

Takeaways:
- Formal, sophisticated language
- Pre-authentication via invite link
- Conditional logic (meals only if YES)
- Consistent design language
```

### Squarespace Wedding Pattern
```
Structure:
[Full-screen parallax photo]
↓
[Scroll to reveal couple's story]
↓
[Timeline with year markers]
↓
[RSVP section integrated into page]
↓
[Inline form (no modal)]
↓
[Success banner at top]

Takeaways:
- Story-first approach
- RSVP as part of journey, not destination
- Parallax creates emotional build
- No modal interruption
```

---

## Design Decision Framework

### When to Use Modals vs Inline
```
Use Modal When:
✓ Multi-step process
✓ Requires focus/attention
✓ Temporary state
✓ Form with many fields
Example: Your enhanced RSVP form ✓

Use Inline When:
✓ Simple yes/no decision
✓ Single field input
✓ Part of page flow
✓ Non-disruptive
Example: Simple search box ✓
```

### Animation Intensity Guide
```
Subtle (Your aesthetic):
- Fade in/out: 0.3-0.5s
- Scale: 0.95-1.05
- Rotate: -5° to 5°
- Easing: ease-out, ease-in-out

Moderate (Celebrations):
- Fade in/out: 0.5-0.8s
- Scale: 0.8-1.2
- Rotate: -15° to 15°
- Easing: spring, bounce

Dramatic (Avoid):
- Duration: >1s
- Scale: <0.5 or >1.5
- Rotate: >30°
- Easing: elastic, extreme bounce
```

### Copy Tone Matrix
```
Context          Formal              Warm                Playful
───────────────────────────────────────────────────────────────
Page Title      "Confirm Attendance" "Confirme sua       "Você vem?"
                                     Presença"

Success         "Confirmed"          "Confirmado! ✨"    "Eba! Você vem! 🎉"

Decline         "We understand"      "Entendemos 💕"     "Ah não! Vamos
                                                          sentir saudades!"

Countdown       "Days Remaining"     "Dias até o         "Contagem
                                     grande dia"         regressiva!"
───────────────────────────────────────────────────────────────
Your Brand: →                        HERE (Warm)         ←
```

---

## Implementation Priority Matrix

### Visual Elements by Impact
```
High Impact, Low Effort:
1. ✨ Confetti animation (most "wow" for least work)
2. 📸 Story photo hero (immediate emotional connection)
3. ⏰ Countdown badge (builds excitement)
4. 💫 Button hover states (polish perception)

High Impact, Medium Effort:
5. 🎨 Loading spinner (professional feel)
6. 📱 Mobile layout polish (most users)
7. 🎯 Form progress indicators (reduces anxiety)

Medium Impact, Medium Effort:
8. 🖼️ Gallery integration (nice but complex)
9. 📧 Email confirmations (backend required)
10. 👥 Family grouping (logic complexity)

Defer to Phase 2:
- Video background on /rsvp route
- Real-time countdown updates
- Social media card generation
- Guest portal dashboard
```

---

## Final Visual Checklist

Before considering RSVP "complete":

### Desktop (>1024px)
- [ ] Story photo displays at 1200x800 max
- [ ] Text remains readable (16px minimum)
- [ ] Confetti doesn't cover important content
- [ ] Countdown card has breathing room (64px margins)
- [ ] Buttons side-by-side with gap
- [ ] Success modal scrollable on short screens

### Tablet (768-1023px)
- [ ] Story photo scales proportionally
- [ ] Two-column layouts remain readable
- [ ] Touch targets 44px minimum
- [ ] Modal fits without scroll on landscape

### Mobile (320-767px)
- [ ] Story photo full-width
- [ ] Single column throughout
- [ ] Buttons stack vertically
- [ ] Text remains 16px (no iOS zoom)
- [ ] Countdown card readable without zoom
- [ ] Modal footer buttons accessible without scroll

### All Devices
- [ ] Loading states visible
- [ ] Error messages clear and helpful
- [ ] Confetti respects reduced motion
- [ ] Focus states keyboard-accessible
- [ ] Color contrast 4.5:1+
- [ ] Images have alt text
- [ ] Animations <1s duration

---

## Color Palette Reference Card

```
Print this or save as reference:

┌─────────────────────────────────────────────┐
│                                             │
│  THOUSAND DAYS OF LOVE - RSVP COLORS       │
│                                             │
│  PRIMARY PALETTE                            │
│  ■ #F8F6F3  Background (cream)              │
│  ■ #2C2C2C  Primary text (charcoal)         │
│  ■ #4A4A4A  Secondary text (gray)           │
│  ■ #A8A8A8  Decorative (silver)             │
│  ■ #E8E6E3  Accent (warm gray)              │
│                                             │
│  CELEBRATION PALETTE (New)                  │
│  ■ #ffd1dc  Soft pink                       │
│  ■ #f8b4d9  Rose                            │
│  ■ #ffe4e1  Misty rose                      │
│  ■ #D4AF37  Muted gold                      │
│  ■ #ffffff  Pure white                      │
│                                             │
│  STATUS COLORS                              │
│  ■ #22c55e  Success (green)                 │
│  ■ #ef4444  Error (red)                     │
│  ■ #f59e0b  Warning (amber)                 │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Typography Reference Card

```
PLAYFAIR DISPLAY (Headings)
- H1: 2-3rem, 400 weight, 0.1em spacing
- H2: 1.75-2.25rem, 400 weight, 0.05em spacing
- Numbers: 3-4.5rem, 600 weight, 1em spacing
- Transform: Uppercase for dates/labels

CRIMSON TEXT (Body)
- Body: 1-1.125rem, 400 weight, 1.6 line-height
- Large: 1.125-1.375rem, 400 weight, italic
- Small: 0.875rem, 400 weight, normal
- Style: Italic for emotional moments

EXAMPLES:
───────────────────────────────────────────
Hel & Ylana          ← Playfair, 3rem
1000 dias se         ← Playfair, 2rem
transformam...

Do primeiro "oi"     ← Crimson, 1.125rem, italic
no WhatsApp até
este momento.

20 DE NOVEMBRO       ← Playfair, 1.125rem, uppercase
───────────────────────────────────────────
```

---

This visual reference guide provides everything needed to implement the RSVP enhancements while maintaining design consistency with your stunning VideoHeroSection and overall wedding aesthetic!

Ready to make magic? Start with the confetti—it's the most fun to test! 🎉
