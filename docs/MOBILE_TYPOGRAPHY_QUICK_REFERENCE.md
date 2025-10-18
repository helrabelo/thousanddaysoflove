# Mobile Typography Quick Reference Guide
**Thousand Days of Love - Developer Cheat Sheet**

## The Golden Rules

```
✅ NEVER use text smaller than 14px (0.875rem)
✅ Body text MUST be minimum 16px (1rem)
✅ Form inputs MUST be 16px (prevents iOS zoom)
✅ Interactive elements MUST be 16px+ for touch
✅ Use clamp() for fluid responsive sizing
❌ NEVER use text-xs (12px) on mobile
❌ NEVER reduce opacity on small text
❌ NEVER use fixed px below 14px
```

---

## Typography Scale (Mobile-First)

| Use Case | Size | Tailwind Class | CSS Value | Notes |
|----------|------|----------------|-----------|-------|
| **Hero Headlines** | 40-64px | N/A | `clamp(2.5rem, 8vw, 4rem)` | Large, attention-grabbing |
| **Page Titles** | 32-48px | `text-4xl` | `clamp(2rem, 6vw, 3rem)` | H1 elements |
| **Section Headers** | 28-40px | `text-3xl` | `clamp(1.75rem, 5vw, 2.5rem)` | H2 elements |
| **Card Titles** | 20-28px | `text-xl` | `clamp(1.25rem, 4vw, 1.75rem)` | H3 elements |
| **Body Text** | 16-18px | `text-base` | `clamp(1rem, 2.5vw, 1.125rem)` | Primary reading |
| **Secondary Text** | 14-16px | `text-sm` | `clamp(0.875rem, 2vw, 1rem)` | Labels, captions |
| **Minimum Size** | 14px | `text-sm` | `0.875rem` | Absolute minimum |
| **NEVER** | <14px | ❌ | ❌ | Do not use |

---

## Component-Specific Sizing

### Navigation
```tsx
// Desktop nav links
fontSize: 'clamp(1rem, 2vw, 1.125rem)'        // 16-18px

// Mobile menu item titles
fontSize: 'clamp(1.125rem, 3vw, 1.25rem)'     // 18-20px

// Mobile menu descriptions
fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'      // 14-16px ✅ NOT 13px

// Tooltips
className="text-sm"                            // 14px minimum ✅ NOT text-xs
```

### Buttons
```tsx
// Small buttons
sm: "text-sm"                                  // 14px minimum

// Medium buttons (default)
md: "text-base"                                // 16px

// Large buttons (primary CTAs)
lg: "text-lg"                                  // 18px

// Extra large (hero CTAs)
xl: "text-xl"                                  // 20px
```

### Forms
```tsx
// All text inputs (critical!)
fontSize: '16px !important'                    // Prevents iOS auto-zoom

// Labels
className="text-sm"                            // 14px minimum

// Helper text
fontSize: 'clamp(0.875rem, 2vw, 1rem)'        // 14-16px

// Placeholders
fontSize: '16px'                               // Match input size
```

### Cards
```tsx
// Card titles
fontSize: 'clamp(1.125rem, 3vw, 1.375rem)'    // 18-22px

// Card descriptions
fontSize: 'clamp(1rem, 2.5vw, 1.125rem)'      // 16-18px

// Card metadata
fontSize: 'clamp(0.875rem, 2vw, 1rem)'        // 14-16px
```

---

## CSS Custom Properties

### Font Families
```css
--font-playfair   /* Headings, names */
--font-crimson    /* Body text, italic */
--font-cormorant  /* Monogram, special */
```

### Color Variables
```css
--primary-text: #2C2C2C       /* Main text color */
--secondary-text: #4A4A4A     /* Secondary text */
--text-muted: #6B6B6B         /* Subtle text */
```

---

## Code Patterns

### ✅ GOOD - Fluid Responsive
```tsx
<p
  style={{
    fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',    // Fluid 16-18px
    lineHeight: '1.7',                            // Comfortable reading
    color: 'var(--primary-text)',
  }}
>
  Beautiful readable text
</p>
```

### ❌ BAD - Fixed Small Size
```tsx
<p
  style={{
    fontSize: '0.8125rem',    // ❌ 13px - too small!
    opacity: 0.85,            // ❌ Makes it worse!
  }}
>
  Hard to read text
</p>
```

---

## Touch Target Sizing

### Minimum Sizes
```css
/* All interactive elements */
button, a, [role="button"] {
  min-height: 44px;        /* iOS Human Interface Guidelines */
  min-width: 44px;
  padding: 12px 20px;
  font-size: max(16px, 1rem);
}

/* Navigation links */
nav a, nav button {
  min-height: 48px;        /* Slightly larger for easy tapping */
  padding: 14px 20px;
  font-size: 16px;
}

/* Form inputs */
input, select, textarea {
  min-height: 48px;        /* Comfortable input area */
  padding: 12px 16px;
  font-size: 16px;         /* Prevents iOS zoom */
}
```

---

## Breakpoint Strategy

### Mobile-First Approach
```css
/* Base styles (mobile) */
.text-element {
  font-size: 16px;         /* Mobile default */
  line-height: 1.7;
}

/* Small tablets (640px+) */
@media (min-width: 640px) {
  .text-element {
    font-size: 17px;
  }
}

/* Tablets (768px+) */
@media (min-width: 768px) {
  .text-element {
    font-size: 18px;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .text-element {
    font-size: 18px;
  }
}
```

### Using clamp() (Preferred)
```css
/* Single declaration for all breakpoints */
.text-element {
  font-size: clamp(1rem, 2.5vw, 1.125rem);  /* 16-18px fluid */
  line-height: 1.7;
}
```

---

## Common Components Reference

### Navigation.tsx
```tsx
// ✅ Desktop nav items
fontSize: 'clamp(1rem, 2vw, 1.125rem)'

// ✅ Mobile menu titles
fontSize: 'clamp(1.125rem, 3vw, 1.25rem)'

// ✅ Mobile menu descriptions
fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'   // NOT 0.8125rem!

// ✅ Tooltips
className="text-sm"                         // NOT text-xs!
```

### BottomNav.tsx
```tsx
// ✅ Label text
fontSize: 'clamp(0.875rem, 2vw, 1rem)'     // NOT 0.6875rem!
className="text-sm"                         // NOT text-xs!
```

### VideoHeroSection.tsx
```tsx
// ✅ Hero title
fontSize: 'clamp(3rem, 10vw, 6rem)'

// ✅ Tagline
fontSize: 'clamp(1.25rem, 3vw, 1.75rem)'

// ✅ Tooltip text
fontSize: '0.875rem'                        // NOT 0.7rem!
className="text-sm"                         // NOT text-xs!
```

### FeatureHubSection.tsx
```tsx
// ✅ Section title
fontSize: 'clamp(2rem, 5vw, 3rem)'

// ✅ Card title
fontSize: 'clamp(1.5rem, 4vw, 2rem)'

// ✅ Card description
fontSize: 'clamp(1rem, 2.5vw, 1.125rem)'   // NOT 1rem fixed!

// ✅ Link text
fontSize: 'clamp(1rem, 2vw, 1.125rem)'     // NOT 0.875rem!
```

---

## Testing Checklist

### Device Testing
```
✅ iPhone SE (375px) - Smallest modern iPhone
✅ iPhone 14 Pro (393px) - Current standard
✅ Samsung Galaxy S22 (360px) - Android reference
✅ iPad Mini (768px) - Tablet view
```

### Browser Testing
```
✅ Safari iOS - Test iOS auto-zoom behavior
✅ Chrome Android - Test Android rendering
✅ Safari Desktop - Desktop experience
✅ Chrome Desktop - Cross-browser check
```

### Manual Checks
```
✅ Can you read text without zooming?
✅ Are buttons easy to tap?
✅ Do form inputs not trigger zoom?
✅ Is contrast sufficient?
✅ Does text scale to 200%?
```

---

## Emergency Fix Priority

### Priority 1: Critical (< 14px)
```
1. BottomNav labels: 11px → 14px
2. Navigation mobile descriptions: 13px → 14px
3. Navigation countdown footer: 12px → 14px
4. Video tooltips: 11.2px → 14px
```

### Priority 2: Enhancement (14px → 16px)
```
5. Feature descriptions: 16px → 16-18px
6. Navigation tooltips: upgrade to text-sm
7. Card content: optimize for mobile
```

---

## Copy-Paste Utilities

### Fluid Text Utility
```tsx
// Add to your component
const fluidText = {
  xs: 'clamp(0.875rem, 2vw, 1rem)',      // 14-16px
  sm: 'clamp(1rem, 2.5vw, 1.125rem)',    // 16-18px
  md: 'clamp(1.125rem, 3vw, 1.375rem)',  // 18-22px
  lg: 'clamp(1.25rem, 4vw, 1.75rem)',    // 20-28px
  xl: 'clamp(1.5rem, 5vw, 2.5rem)',      // 24-40px
}

// Usage
<p style={{ fontSize: fluidText.sm }}>Readable text</p>
```

### Touch Target Utility
```tsx
const touchTarget = {
  minHeight: '44px',
  minWidth: '44px',
  padding: '12px 20px',
  fontSize: 'max(16px, 1rem)',
}

// Usage
<button style={touchTarget}>Tap me</button>
```

---

## Font Size Conversion Table

| Pixels | Rem | Use Case | Status |
|--------|-----|----------|--------|
| 11px | 0.6875rem | ❌ Never use | Too small |
| 12px | 0.75rem | ❌ Never use | Too small |
| 13px | 0.8125rem | ❌ Never use | Too small |
| 14px | 0.875rem | ✅ Minimum | Labels, captions |
| 15px | 0.9375rem | ✅ Good | Small text |
| 16px | 1rem | ✅ Standard | Body text |
| 17px | 1.0625rem | ✅ Good | Emphasized body |
| 18px | 1.125rem | ✅ Great | Large body |
| 20px | 1.25rem | ✅ Great | Card titles |
| 24px | 1.5rem | ✅ Excellent | Section headers |

---

## Pro Tips

### 1. Use clamp() for Fluid Sizing
```css
/* ✅ GOOD - Scales with viewport */
font-size: clamp(1rem, 2.5vw, 1.125rem);

/* ❌ BAD - Fixed size */
font-size: 16px;
```

### 2. Avoid Multiple Breakpoints
```css
/* ✅ GOOD - Single declaration */
font-size: clamp(1rem, 2.5vw, 1.125rem);

/* ❌ BAD - Multiple breakpoints */
font-size: 14px;
@media (min-width: 640px) { font-size: 15px; }
@media (min-width: 768px) { font-size: 16px; }
@media (min-width: 1024px) { font-size: 18px; }
```

### 3. Test on Real Devices
```
✅ Physical iPhone/iPad - Real rendering
✅ Physical Android - Actual experience
❌ Browser DevTools - Not accurate enough
❌ Emulators - Missing real-world conditions
```

### 4. Consider Aging Eyes
```
Target Audience: Wedding guests (all ages)
Consider: 40-60 year old guests need larger text
Solution: Use 16px minimum, prefer 18px for comfort
```

---

## Quick Debugging

### Text Too Small?
```tsx
// Add this inline to quickly test
style={{
  fontSize: 'clamp(1rem, 2.5vw, 1.125rem) !important',
  outline: '1px solid red',  // Visual debugging
}}
```

### iOS Auto-Zoom Issue?
```tsx
// Ensure form inputs are 16px
<input
  type="text"
  style={{
    fontSize: '16px !important',  // Prevents zoom
  }}
/>
```

### Touch Target Too Small?
```tsx
// Add this to test touch target size
style={{
  minHeight: '44px',
  minWidth: '44px',
  outline: '1px dashed blue',  // Visual debugging
}}
```

---

## Resources

### Documentation
- Full Audit: `/docs/MOBILE_TYPOGRAPHY_AUDIT.md`
- Implementation Guide: `/docs/TYPOGRAPHY_FIXES.md`
- This Quick Reference: `/docs/MOBILE_TYPOGRAPHY_QUICK_REFERENCE.md`

### External References
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/typography/)
- [Material Design Type Scale](https://material.io/design/typography/the-type-system.html)
- [WCAG 2.1 Text Spacing](https://www.w3.org/WAI/WCAG21/Understanding/text-spacing.html)

---

**Last Updated**: 2025-10-18
**Maintained By**: Development Team
**Project**: Thousand Days of Love Wedding Website
