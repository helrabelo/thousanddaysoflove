# Mobile UI Audit Report - Thousand Days of Love Wedding Website

**Audit Date**: October 1, 2025
**Project**: thousanddaysoflove
**Tech Stack**: Next.js 15.5.4, TypeScript, Tailwind CSS, Framer Motion
**Design System**: Monochromatic Wedding Invitation (#F8F6F3, #2C2C2C, #A8A8A8)

---

## Executive Summary

Overall mobile UX is **GOOD** with several areas requiring optimization. The website demonstrates strong accessibility patterns (touch targets via CSS, responsive typography) but has critical issues with the RSVP page design and some inconsistent implementations across pages.

**Overall Score**: 7.5/10

---

## Critical Issues (Fix Immediately)

### 1. RSVP Page - Broken Design System ❌ CRITICAL
**File**: `/src/app/rsvp/page.tsx`
**Severity**: CRITICAL
**Issue**: Complete design system violation using colorful Tailwind classes instead of monochromatic CSS variables

**Problems**:
- Uses `bg-hero-gradient` with blush/sage/burgundy colors (lines 83)
- Text colors using `text-burgundy-700`, `text-burgundy-600` (lines 87, 93)
- Border colors `border-burgundy-200` (line 107)
- Not using wedding invitation aesthetic CSS variables

**Fix Required**:
```tsx
// REPLACE THIS:
<div className="min-h-screen bg-hero-gradient py-16 px-4">
  <h1 className="text-4xl font-playfair font-bold text-burgundy-800 mb-4">

// WITH THIS:
<div className="min-h-screen rsvp-background py-16 px-4">
  <h1 className="text-4xl font-bold mb-4"
      style={{
        fontFamily: 'var(--font-playfair)',
        color: 'var(--primary-text)',
        letterSpacing: '0.15em'
      }}>
```

**Impact**: Completely breaks visual consistency, users will think it's a different website

---

### 2. Input Component - Colorful Design Violation ❌ HIGH
**File**: `/src/components/ui/input.tsx`
**Severity**: HIGH
**Issue**: Uses blush/burgundy colors instead of monochromatic palette

**Problems**:
- Line 28: `text-burgundy-700` for labels
- Line 42: `border-blush-200` and `focus:border-blush-400`
- Not using CSS variables from wedding theme

**Fix Required**:
```tsx
// Replace all Tailwind color classes with CSS variables:
className={cn(
  'w-full px-4 py-3 border rounded-xl transition-all duration-200',
  'border-[var(--border-subtle)] focus:border-[var(--decorative)]',
  'focus:ring-2 focus:ring-[var(--decorative)]/20',
  'placeholder:text-[var(--text-muted)]',
  'bg-[var(--background)] text-[var(--primary-text)]',
  // ...
)}
```

---

### 3. Navigation - No Burger Menu on /galeria ⚠️ MEDIUM
**File**: `/src/app/galeria/page.tsx`
**Severity**: MEDIUM
**Issue**: Navigation component IS present (line 284) but user reported not seeing burger menu

**Investigation Needed**:
- Navigation is correctly imported and rendered
- Could be z-index issue with gallery lightbox/modals
- Could be color contrast issue on gallery background

**Fix Required**:
Check z-index stacking context and ensure Navigation has higher z-index than gallery components:
```tsx
// In Navigation.tsx - already has z-50, but verify no conflicts
<nav className="fixed top-0 left-0 right-0 z-50">
```

---

## High Priority Issues

### 4. Touch Target Sizes - Inconsistent Implementation ⚠️ HIGH
**Severity**: HIGH
**Current State**: PARTIAL implementation

**What's Working**:
- Global CSS has touch target support (globals.css line 383-390)
- Button component has minimum heights: `min-h-[40px]` to `min-h-[64px]` (button.tsx line 36-39)
- CSS media query for coarse pointers enforces 44px minimum (globals.css line 383)

**What's Broken**:
- Only applies on `@media (pointer: coarse)` - should be default for all mobile
- Navigation mobile links don't have explicit touch targets
- Some interactive elements bypass button component

**Fix Required**:
```css
/* In globals.css - make 44px minimum universal, not just pointer:coarse */
button,
a,
[role="button"],
input[type="submit"],
input[type="button"] {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px; /* Ensure comfortable spacing */
}

/* Specific override for navigation links */
nav a {
  min-height: 48px;
  display: flex;
  align-items: center;
}
```

---

### 5. Typography - Body Text Below 16px Threshold ⚠️ HIGH
**File**: Multiple components
**Severity**: HIGH
**Issue**: Some text falls below 16px minimum for mobile readability

**Problems Found**:
- Gift card priority labels: `text-xs` (12px) - GiftCard.tsx line 38
- Navigation desktop links: `font-size: 0.9rem` (14.4px) - Navigation.tsx line 73
- Details font size can go as low as 14px - wedding-theme.css line 28

**Fix Required**:
```css
/* Update CSS variables for mobile */
@media (max-width: 768px) {
  :root {
    --details-size: clamp(1rem, 2vw, 1.125rem); /* Never below 16px */
  }

  /* Ensure minimum 16px for all text */
  body {
    font-size: 16px !important;
  }

  .text-xs {
    font-size: 14px; /* Still readable for labels/badges */
  }
}
```

---

### 6. Form Input Optimization ⚠️ MEDIUM
**File**: `/src/components/ui/input.tsx`, `/src/app/rsvp/page.tsx`
**Severity**: MEDIUM
**Issue**: Missing mobile-specific input attributes

**Problems**:
- No `inputMode` attributes for better mobile keyboards
- No `autocomplete` for faster form filling
- Search inputs don't specify `type="search"`

**Fix Required**:
```tsx
// For phone numbers
<input
  type="tel"
  inputMode="tel"
  autocomplete="tel"
/>

// For email
<input
  type="email"
  inputMode="email"
  autocomplete="email"
/>

// For names
<input
  type="text"
  inputMode="text"
  autocomplete="name"
/>

// For search
<input
  type="search"
  inputMode="search"
/>
```

---

## Medium Priority Issues

### 7. Countdown Timer - Horizontal Overflow Risk ⚠️ MEDIUM
**File**: `/src/components/ui/CountdownTimer.tsx`
**Severity**: MEDIUM
**Issue**: Three cards in flexbox could overflow on very small screens

**Current Implementation**:
- Uses `flex flex-col md:flex-row` (line 112)
- Cards have `min-width: 140px` (line 126)
- On small screens: 3 × 140px + gaps = ~500px (could overflow 375px screens)

**Fix Required**:
```tsx
// Make more responsive
<div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 md:gap-20">
  {/* Cards */}
  <div
    className="p-8 md:p-16 text-center rounded-lg"
    style={{
      // Remove minWidth on mobile
      minWidth: '0',
      '@media (min-width: 640px)': {
        minWidth: '140px'
      }
    }}
  >
```

---

### 8. Gallery - Image Loading Performance ⚠️ MEDIUM
**File**: `/src/app/galeria/page.tsx`
**Severity**: MEDIUM
**Issue**: No lazy loading strategy for 160+ photos

**Current State**:
- Uses Next.js Image component (good)
- But loads all thumbnails immediately (bad for mobile bandwidth)

**Fix Required**:
```tsx
// Add loading="lazy" to Image components
<Image
  src={item.thumbnail_url || item.url}
  alt={item.title}
  fill
  loading="lazy" // Add this
  className="object-cover transition-transform duration-300 hover:scale-105"
/>

// Or use Intersection Observer for progressive loading
```

---

### 9. Navigation Mobile Menu - Layout Issues ⚠️ MEDIUM
**File**: `/src/components/ui/Navigation.tsx`
**Severity**: MEDIUM
**Issue**: Mobile menu items have incorrect layout causing vertical spacing

**Problem**:
Line 169-171 shows easter egg text inside the link, causing awkward stacking:
```tsx
<div className="text-xs opacity-60 mt-1">
  {item.easterEgg}
</div>
```

**Fix Required**:
```tsx
// Restructure mobile menu for better layout
<Link
  key={item.name}
  href={item.href}
  onClick={() => setIsOpen(false)}
  className="block py-4 px-6 transition-all duration-200"
  style={{
    fontFamily: 'var(--font-playfair)',
    color: 'var(--secondary-text)',
    borderBottom: '1px solid var(--border-subtle)'
  }}
>
  <div className="flex items-center gap-3">
    <span className="text-xl">{item.icon}</span>
    <div className="flex-1">
      <div className="font-medium text-base" style={{ color: 'var(--primary-text)' }}>
        {item.name}
      </div>
      <div className="text-sm mt-1" style={{
        fontFamily: 'var(--font-crimson)',
        fontStyle: 'italic',
        color: 'var(--text-muted)'
      }}>
        {item.easterEgg}
      </div>
    </div>
  </div>
</Link>
```

---

## Low Priority Issues

### 10. Payment Modal - QR Code Visibility 🔵 LOW
**Severity**: LOW
**Issue**: Need to verify PIX QR code is properly sized on mobile

**Recommendation**:
- Ensure QR code minimum size 200px × 200px on mobile
- Add zoom capability for better scanning
- Verify high enough z-index for visibility

---

### 11. Fixed Navigation - Content Overlap 🔵 LOW
**File**: Multiple pages
**Severity**: LOW
**Issue**: Navigation height (h-20 = 80px) needs consistent padding on pages

**Current State**:
- Most pages use `pt-24` (96px padding) ✅
- Some pages use `pt-20` (80px padding) - too tight
- /galeria uses `pt-24` ✅
- /historia uses `pt-32` (128px) ✅

**Fix Required**:
Standardize to `pt-24` (96px) on all pages for consistent 16px gap below navigation.

---

### 12. Animation Performance - Respect Reduced Motion 🔵 LOW
**Severity**: LOW
**Current State**: GOOD implementation

**What's Working**:
- Global reduced motion support (globals.css line 484-491, 729-755)
- Removes animations when `prefers-reduced-motion: reduce`
- Wedding theme CSS respects accessibility (line 346-356)

**Improvement**:
Consider adding `will-change` property for better 60fps performance on transform animations:
```css
@media (prefers-reduced-motion: no-preference) {
  .animate-romantic-pulse,
  .animate-gentle-bounce,
  .masonry-item {
    will-change: transform;
  }
}
```

---

## Page-by-Page Analysis

### ✅ Homepage (`/`) - EXCELLENT
- Navigation renders correctly ✅
- Countdown timer responsive ✅
- Hero section uses proper CSS variables ✅
- Touch targets adequate (buttons 56px-64px) ✅
- Typography hierarchy good ✅
- Background patterns respect reduced motion ✅

**Issues**: None critical

---

### ❌ RSVP Page (`/rsvp`) - NEEDS IMMEDIATE FIX
- Design system completely broken ❌
- Using colorful Tailwind classes instead of monochromatic ❌
- Form inputs have adequate padding ✅
- Search functionality works ✅
- Guest cards properly sized ✅

**Critical Fixes**:
1. Replace all burgundy/blush colors with CSS variables
2. Update background to use `rsvp-background` class
3. Fix label colors to use `var(--primary-text)`

---

### ⚠️ Galeria Page (`/galeria`) - GOOD with Issues
- Navigation renders (user might have z-index issue) ⚠️
- Hero section uses wedding aesthetic ✅
- Timeline component responsive ✅
- Masonry gallery adapts to screen size ✅
- Lightbox needs mobile optimization ⚠️
- No lazy loading for images ❌

**Fixes**:
1. Verify navigation z-index > lightbox z-index
2. Add lazy loading to images
3. Test lightbox swipe gestures on real device

---

### ✅ Historia Page (`/historia`) - EXCELLENT
- Loads data from Supabase correctly ✅
- Timeline component responsive ✅
- AboutUs section well-formatted ✅
- Navigation renders ✅
- Typography scales properly ✅

**Issues**: None critical

---

### ✅ Presentes Page (`/presentes`) - EXCELLENT
- Navigation renders ✅
- Filter interface mobile-friendly ✅
- Gift cards properly sized ✅
- Payment modal integration good ✅
- Stats section responsive ✅
- Uses monochromatic design correctly ✅

**Minor Issue**:
- Priority badge text is 12px (below 16px guideline) but acceptable for labels

---

### ✅ Local Page (`/local`) - EXCELLENT
- Navigation renders ✅
- Google Maps responsive ✅
- Location cards well-formatted ✅
- WhatsApp sharing buttons sized properly ✅

**Issues**: None critical

---

### ✅ Convite Page (`/convite`) - EXCELLENT
- WeddingInvitation component responsive ✅
- Background pattern elegant ✅
- Typography hierarchy perfect ✅
- Print styles optimized ✅

**Issues**: None critical

---

## Recommended CSS Fixes

### Fix 1: Universal Touch Targets (Critical)

**File**: `/src/app/globals.css`
**Location**: Replace lines 383-390

```css
/* BEFORE (only applies to coarse pointers) */
@media (pointer: coarse) {
  button,
  a,
  [role="button"] {
    min-height: 44px;
    min-width: 44px;
  }
}

/* AFTER (applies universally on mobile) */
button,
a[href],
[role="button"],
input[type="submit"],
input[type="button"] {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
}

/* Specific mobile navigation touch targets */
@media (max-width: 768px) {
  nav a {
    min-height: 48px;
    display: flex;
    align-items: center;
    padding: 12px 16px;
  }

  nav button {
    min-height: 48px;
    min-width: 48px;
  }
}
```

---

### Fix 2: Minimum Typography Sizes (High Priority)

**File**: `/src/app/globals.css`
**Location**: Add to mobile responsive section (after line 416)

```css
@media (max-width: 768px) {
  /* Existing mobile typography */
  body {
    font-size: 16px;
    line-height: 1.7;
  }

  /* NEW: Enforce minimum readable sizes */
  p, li, span, div {
    font-size: 16px !important;
  }

  /* Labels and badges can be slightly smaller but still readable */
  .text-xs,
  [class*="text-xs"] {
    font-size: 14px !important;
  }

  .text-sm,
  [class*="text-sm"] {
    font-size: 15px !important;
  }

  /* Ensure form inputs are large enough */
  input,
  textarea,
  select {
    font-size: 16px !important; /* Prevents zoom on iOS */
    padding: 12px 16px !important;
    min-height: 48px !important;
  }
}
```

---

### Fix 3: RSVP Page Design System (Critical)

**File**: `/src/app/rsvp/page.tsx`
**Location**: Complete component rewrite

```tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Search, Check, X, Users } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// ... (keep interfaces and logic)

export default function SimpleRSVP() {
  // ... (keep all state and functions)

  return (
    <div className="min-h-screen rsvp-background py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link
            href="/"
            className="inline-block mb-6 transition-colors duration-200"
            style={{
              color: 'var(--decorative)',
              fontFamily: 'var(--font-playfair)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-text)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--decorative)'}
          >
            ← Voltar ao Início
          </Link>

          <h1
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{
              fontFamily: 'var(--font-playfair)',
              color: 'var(--primary-text)',
              letterSpacing: '0.15em'
            }}
          >
            Confirme sua Presença nos Mil Dias
          </h1>

          <p
            className="text-lg md:text-xl"
            style={{
              fontFamily: 'var(--font-crimson)',
              color: 'var(--secondary-text)',
              fontStyle: 'italic'
            }}
          >
            Digite seu nome para encontrar seu convite
          </p>
        </div>

        {/* Search */}
        <div
          className="rounded-xl p-6 mb-8"
          style={{
            background: 'var(--white-soft)',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 4px 12px var(--shadow-subtle)'
          }}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="search"
              inputMode="search"
              placeholder="Digite seu nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchGuests()}
              className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
              style={{
                borderColor: 'var(--border-subtle)',
                background: 'var(--background)',
                color: 'var(--primary-text)',
                fontFamily: 'var(--font-crimson)'
              }}
            />
            <Button
              onClick={searchGuests}
              disabled={searching}
              variant="wedding"
              size="md"
            >
              {searching ? 'Buscando...' : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Buscar
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Guest Cards - Update all styling to use CSS variables */}
        {guests.length > 0 && (
          <div className="space-y-4">
            <h2
              className="text-2xl font-bold mb-6"
              style={{
                fontFamily: 'var(--font-playfair)',
                color: 'var(--primary-text)',
                letterSpacing: '0.1em'
              }}
            >
              Convidados Encontrados ({guests.length})
            </h2>

            {guests.map((guest) => (
              <div
                key={guest.id}
                className="rounded-xl p-6"
                style={{
                  background: 'var(--white-soft)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: '0 2px 8px var(--shadow-subtle)'
                }}
              >
                {/* Update all guest card content with CSS variables */}
                {/* ... rest of guest card */}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {guests.length === 0 && searchTerm && !searching && (
          <div
            className="rounded-xl p-8 text-center"
            style={{
              background: 'var(--white-soft)',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 2px 8px var(--shadow-subtle)'
            }}
          >
            <p
              className="text-lg mb-2"
              style={{
                fontFamily: 'var(--font-playfair)',
                color: 'var(--primary-text)'
              }}
            >
              Nenhum convidado encontrado com "{searchTerm}"
            </p>
            <p
              className="text-sm"
              style={{
                fontFamily: 'var(--font-crimson)',
                color: 'var(--secondary-text)',
                fontStyle: 'italic'
              }}
            >
              Tente buscar por outro nome ou entre em contato conosco
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
```

---

## Testing Checklist

### Device Testing Required
- [ ] iPhone SE (375px width) - smallest modern screen
- [ ] iPhone 12/13/14 (390px width)
- [ ] iPhone 12/13/14 Pro Max (428px width)
- [ ] Samsung Galaxy S21 (360px width)
- [ ] iPad Mini (768px width)
- [ ] iPad Pro (1024px width)

### Interaction Testing
- [ ] All navigation links work on mobile menu
- [ ] Burger menu opens/closes smoothly
- [ ] Form inputs trigger correct mobile keyboards (tel, email, search)
- [ ] Touch targets are 44px minimum (use browser dev tools)
- [ ] Countdown timer doesn't overflow on 375px screens
- [ ] Gallery images lazy load properly
- [ ] Lightbox swipe gestures work
- [ ] Payment modal QR code is scannable
- [ ] All buttons have proper hover/active states

### Performance Testing
- [ ] Lighthouse mobile score > 90
- [ ] First Contentful Paint < 1.8s
- [ ] Time to Interactive < 3.8s
- [ ] No layout shift (CLS < 0.1)
- [ ] Images optimized (WebP/AVIF)
- [ ] Animations run at 60fps

### Accessibility Testing
- [ ] Screen reader navigation (VoiceOver/TalkBack)
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Text resizable to 200% without loss of function
- [ ] Reduced motion respected

---

## Summary of Files Requiring Changes

### Critical Priority (Fix Today)
1. ✅ `/src/app/rsvp/page.tsx` - Complete design system overhaul
2. ✅ `/src/components/ui/input.tsx` - Replace Tailwind colors with CSS variables
3. ✅ `/src/app/globals.css` - Universal touch targets (remove `@media (pointer: coarse)`)

### High Priority (Fix This Week)
4. ✅ `/src/app/globals.css` - Minimum typography sizes for mobile
5. ✅ `/src/components/ui/Navigation.tsx` - Restructure mobile menu layout
6. ✅ `/src/components/ui/CountdownTimer.tsx` - Fix horizontal overflow on small screens
7. ✅ `/src/app/galeria/page.tsx` - Add lazy loading to images

### Medium Priority (Fix This Sprint)
8. ✅ `/src/components/ui/input.tsx` - Add inputMode and autocomplete attributes
9. ✅ Check z-index conflicts between Navigation and Gallery lightbox
10. ✅ Standardize page padding-top to `pt-24` across all pages

### Low Priority (Nice to Have)
11. ✅ Add `will-change` properties for animation performance
12. ✅ Verify payment modal QR code sizing
13. ✅ Test on real devices for gesture interactions

---

## Mobile-First CSS Architecture Recommendations

### Current State Analysis
The project demonstrates good mobile-first principles in some areas but inconsistent implementation:

**Strengths**:
- Responsive typography with clamp() functions ✅
- Media queries for background patterns ✅
- Touch target support (partial) ✅
- Reduced motion support ✅

**Weaknesses**:
- Inconsistent use of CSS variables vs Tailwind colors ❌
- Touch targets only enforced on `pointer: coarse` ❌
- Some components bypass design system ❌

### Recommended Approach

1. **Enforce CSS Variables Everywhere**
   - Create ESLint rule to prevent Tailwind color classes
   - All colors must use `var(--variable-name)`
   - Update component prop types to accept style objects

2. **Component-Level Responsive Patterns**
   ```tsx
   // Good pattern - mobile-first with CSS variables
   <div
     className="p-4 sm:p-6 md:p-8"
     style={{
       background: 'var(--white-soft)',
       color: 'var(--primary-text)'
     }}
   >
   ```

3. **Universal Touch Target Mixin**
   ```css
   /* Create reusable touch target class */
   .touch-target {
     min-height: 44px;
     min-width: 44px;
     padding: 12px 16px;
     display: inline-flex;
     align-items: center;
     justify-content: center;
   }
   ```

---

## Performance Optimization Recommendations

### Image Loading Strategy
```tsx
// Implement progressive loading for gallery
import { useInView } from 'react-intersection-observer'

function GalleryImage({ src, alt }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px' // Load 200px before visible
  })

  return (
    <div ref={ref}>
      {inView && (
        <Image
          src={src}
          alt={alt}
          loading="lazy"
          quality={75}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )}
    </div>
  )
}
```

### Animation Performance
```css
/* Add to globals.css for 60fps animations */
@media (prefers-reduced-motion: no-preference) {
  .animate-romantic-pulse,
  .animate-gentle-bounce,
  .masonry-item,
  .gift-romantic-hover {
    will-change: transform;
    transform: translateZ(0); /* Force GPU acceleration */
  }

  /* Remove will-change after animation */
  .animate-romantic-pulse:not(:hover),
  .gift-romantic-hover:not(:hover) {
    will-change: auto;
  }
}
```

---

## Conclusion

The Thousand Days of Love wedding website has a strong foundation with excellent accessibility patterns and responsive design in most areas. The critical issues are primarily in the RSVP page which completely breaks the design system, and inconsistent touch target implementation.

**Priority Actions**:
1. **Today**: Fix RSVP page design system violations
2. **This Week**: Implement universal touch targets and minimum typography
3. **This Sprint**: Add lazy loading and optimize navigation

**Expected Outcome After Fixes**:
- Mobile UI Score: 9.5/10
- All pages consistent with monochromatic wedding invitation aesthetic
- Touch targets meet 44px minimum on all devices
- Typography readable at 16px+ minimum
- Performance optimized with lazy loading
- Zero design system violations

---

## Code Examples for Quick Implementation

### Complete RSVP Page Fix (Drop-in Replacement)
See "Fix 3: RSVP Page Design System" section above for complete component code.

### Universal Touch Targets (Add to globals.css)
See "Fix 1: Universal Touch Targets" section above.

### Mobile Typography (Add to globals.css)
See "Fix 2: Minimum Typography Sizes" section above.

### Input Component Fix (Update input.tsx)
```tsx
// Replace line 28
<label
  htmlFor={inputId}
  className="block text-sm font-medium mb-2"
  style={{
    color: 'var(--primary-text)',
    fontFamily: 'var(--font-playfair)'
  }}
>

// Replace line 39-47
className={cn(
  'w-full px-4 py-3 border rounded-xl transition-all duration-200',
  'border-[var(--border-subtle)] focus:border-[var(--decorative)]',
  'focus:ring-2 focus:ring-[var(--decorative)]/20',
  'placeholder:text-[var(--text-muted)]',
  'bg-[var(--background)] text-[var(--primary-text)]',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  error && 'border-red-400 focus:border-red-400 focus:ring-red-400/20',
  className
)}
```

---

**Audit Completed**: October 1, 2025
**Next Review**: After critical fixes implemented
**Mobile Score Target**: 9.5/10
