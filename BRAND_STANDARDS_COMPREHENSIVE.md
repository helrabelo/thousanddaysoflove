# THOUSAND DAYS OF LOVE - COMPREHENSIVE BRAND STANDARDS
## Wedding Invitation Design System Excellence

> **Mission**: Ensure every pixel, word, and interaction reinforces the sophisticated, timeless wedding invitation aesthetic for Hel & Ylana's celebration of 1000 days of love.

---

## 🎨 **DESIGN FOUNDATION**

### **Brand Personality**
- **Sophisticated**: Elegant wedding invitation aesthetic
- **Timeless**: Classic design that won't date
- **Intimate**: Personal celebration of 1000-day love story
- **Brazilian**: Portuguese localization and cultural context
- **Romantic**: Celebrating love without being overly sentimental

### **Design Principles**
1. **Elegance over complexity** - Remove unnecessary elements
2. **Monochromatic sophistication** - Strict color palette adherence
3. **Generous white space** - Wedding invitation breathing room
4. **Serif typography throughout** - No sans-serif except utility text
5. **Subtle botanical accents** - Decorative but not dominant
6. **Center-aligned layouts** - Classic wedding invitation alignment
7. **Timeless aesthetic** - Avoid trendy elements

---

## 🎯 **COLOR SYSTEM - MONOCHROMATIC WEDDING INVITATION**

### **Primary Palette (STRICT ADHERENCE REQUIRED)**
```css
--background: #F8F6F3;        /* Warm cream - primary background */
--primary-text: #2C2C2C;      /* Charcoal black - main text */
--secondary-text: #4A4A4A;    /* Medium gray - secondary text */
--decorative: #A8A8A8;        /* Silver-gray - accents */
--accent: #E8E6E3;            /* Subtle warm gray - hover states */
```

### **Supporting Colors**
```css
--decorative-light: #C5C5C5;   /* Light silver-gray */
--text-muted: #6B6B6B;         /* Muted text */
--border-subtle: #E0DDD8;      /* Subtle borders */
--white-soft: #FEFEFE;         /* Pure white with warmth */
--shadow-subtle: rgba(44, 44, 44, 0.08);   /* Soft shadows */
--shadow-medium: rgba(44, 44, 44, 0.12);   /* Medium shadows */
```

### **❌ FORBIDDEN COLORS**
- **Rose/Pink**: #F43F5E, #FC7C9B, #FDA4AF (old romantic palette)
- **Purple/Violet**: #8B5CF6, #A855F7, #C084FC (old romantic palette)
- **Bright Colors**: Any vivid or saturated colors
- **Neon/Fluorescent**: Any bright, attention-grabbing colors
- **Primary Blue/Red/Green**: Standard web colors

---

## ✍️ **TYPOGRAPHY SYSTEM**

### **Font Hierarchy**
```css
/* Primary Fonts (Wedding Invitation) */
--font-cormorant: Cormorant;      /* Monogram, special emphasis */
--font-playfair: Playfair Display; /* Headings, names, titles */
--font-crimson: Crimson Text;      /* Body text, descriptions */

/* Font Sizes - Wedding Invitation Scale */
--hero-size: clamp(4rem, 10vw, 7rem);      /* H ♥ Y monogram */
--names-size: clamp(3rem, 8vw, 5rem);      /* Hel & Ylana */
--heading-size: clamp(2rem, 5vw, 3rem);    /* Section headers */
--body-size: clamp(1.125rem, 2.5vw, 1.375rem); /* Body text */
--details-size: clamp(0.875rem, 2vw, 1rem);     /* Small details */
```

### **Typography Classes**
```css
.wedding-monogram {
  font-family: var(--font-cormorant);
  font-size: var(--hero-size);
  font-weight: 300;
  color: var(--primary-text);
  letter-spacing: 0.15em;
  text-align: center;
  line-height: 1.1;
}

.wedding-names {
  font-family: var(--font-playfair);
  font-size: var(--names-size);
  font-weight: 400;
  color: var(--primary-text);
  letter-spacing: 0.15em;
  text-align: center;
  line-height: 1.2;
  text-transform: uppercase;
}

.wedding-body {
  font-family: var(--font-crimson);
  font-size: var(--body-size);
  font-weight: 400;
  line-height: 1.8;
  color: var(--secondary-text);
  font-style: italic;
}
```

---

## 🔲 **COMPONENT STANDARDS**

### **Button Variants (Wedding Invitation Style)**
```typescript
// REQUIRED Button Variants
variant: "wedding" | "wedding-outline" | "elegant" | "ghost" | "secondary"

// Wedding Primary: Dark button with white text
"wedding": charcoal background, white text, hover inverts

// Wedding Outline: Transparent with charcoal border
"wedding-outline": transparent bg, charcoal border/text, hover fills

// Elegant: Subtle card-style button
"elegant": card background, subtle border, gentle hover lift

// Ghost: Minimal text-only button
"ghost": transparent, gray text, subtle hover background

// Secondary: Silver-gray accent button
"secondary": decorative color background, white text
```

### **Card Variants (Wedding Invitation Style)**
```typescript
// REQUIRED Card Variants
variant: "wedding" | "elegant" | "subtle" | "invitation" | "bordered"

// Wedding: Primary card style
"wedding": white background, subtle shadow, generous padding (2rem)

// Elegant: Secondary card style
"elegant": white background, border, moderate padding (1.5rem)

// Invitation: Special ceremony-style card
"invitation": soft white, decorative border, center-aligned content

// Subtle: Minimal accent card
"subtle": accent background, no border, clean look

// Bordered: Emphasized card with decorative border
"bordered": decorative border, hover effect on border color
```

---

## 📱 **LAYOUT STANDARDS**

### **Spacing System**
```css
/* Wedding Invitation Generous Spacing */
--spacing-xs: 0.5rem;     /* 8px */
--spacing-sm: 1.5rem;     /* 24px */
--spacing-md: 2rem;       /* 32px */
--spacing-lg: 3rem;       /* 48px */
--spacing-xl: 4rem;       /* 64px */
--spacing-2xl: 6rem;      /* 96px */
--spacing-3xl: 8rem;      /* 128px */
```

### **Section Layout Rules**
```css
/* All sections must follow wedding invitation principles */
section {
  padding: var(--spacing-3xl) var(--spacing-xl); /* Generous padding */
  text-align: center; /* Center-aligned content */
  background: var(--background); /* Consistent cream background */
}

/* Card spacing within sections */
.card-grid {
  gap: var(--spacing-lg); /* 3rem minimum gap */
  max-width: 1200px; /* Reasonable max width */
  margin: 0 auto; /* Center alignment */
}
```

---

## 🎭 **INTERACTION DESIGN**

### **Hover Effects (Subtle & Elegant)**
```css
/* All interactive elements follow wedding invitation principles */
.hover-wedding {
  transition: all 0.3s ease;
}

.hover-wedding:hover {
  transform: translateY(-2px); /* Gentle lift */
  box-shadow: 0 4px 16px var(--shadow-medium); /* Soft shadow */
  color: var(--primary-text); /* Text darkens slightly */
}

/* Button hover effects */
.wedding-button:hover {
  background: var(--background);
  color: var(--primary-text);
  border-color: var(--primary-text);
}
```

### **Focus States (Accessibility)**
```css
/* Wedding invitation accessible focus */
button:focus-visible,
input:focus-visible,
a:focus-visible {
  outline: 2px solid var(--decorative);
  outline-offset: 2px;
  border-radius: 4px;
}
```

---

## 🌿 **BOTANICAL DECORATIONS**

### **Subtle Botanical Elements**
- **Opacity**: 0.6 maximum for decorative elements
- **Color**: var(--decorative) silver-gray only
- **Stroke Width**: 1px maximum for line elements
- **Size**: 80px maximum for corner flourishes
- **Placement**: Corner positions only, never center

### **SVG Style Standards**
```svg
<!-- Approved botanical SVG pattern -->
<svg viewBox="0 0 80 80">
  <g fill="none" stroke="#A8A8A8" stroke-width="1" opacity="0.4">
    <path d="M20,40 Q30,20 40,40 Q50,20 60,40"/>
    <path d="M25,55 Q40,65 55,55"/>
    <circle cx="40" cy="40" r="2" fill="#A8A8A8" opacity="0.3"/>
  </g>
</svg>
```

---

## 📄 **PAGE-SPECIFIC STANDARDS**

### **Homepage (✅ COMPLIANT)**
- Monochromatic color palette: ✅
- Serif typography throughout: ✅
- Center-aligned layout: ✅
- Botanical decorations: ✅
- Wedding invitation buttons: ✅

### **RSVP Page (❌ MAJOR VIOLATIONS)**
**Current Issues:**
- Using old romantic rose/purple gradient: `bg-gradient-to-br from-rose-50 via-white to-purple-50`
- Glass-morphism effects with bright colors
- Button variants not using wedding system

**Required Fixes:**
- Replace all rose/purple with monochromatic palette
- Update all backgrounds to use `var(--background)`
- Convert all buttons to wedding variants
- Remove bright accent colors

### **Presents Page (❌ CRITICAL VIOLATIONS)**
**Current Issues:**
- Rose/purple gradients throughout
- Bright accent colors for stats cards
- Non-wedding button variants
- Glass-morphism with color violations

**Required Fixes:**
- Convert to monochromatic design system
- Update all gradients to use cream/charcoal
- Standardize all interactive elements
- Replace colored icons with decorative gray

---

## 🔍 **ACCESSIBILITY STANDARDS**

### **Contrast Ratios (WCAG AA Compliant)**
```css
/* Text on cream background */
--primary-text: #2C2C2C;    /* 6.2:1 contrast ratio */
--secondary-text: #4A4A4A;   /* 4.7:1 contrast ratio */
--decorative: #A8A8A8;      /* 3.1:1 contrast ratio (large text only) */
```

### **Touch Targets**
```css
/* Mobile touch targets */
@media (pointer: coarse) {
  button, a, [role="button"] {
    min-height: 44px;
    min-width: 44px;
  }
}
```

### **Reduced Motion Support**
```css
@media (prefers-reduced-motion: reduce) {
  .animate-float,
  .animate-heartbeat {
    animation: none !important;
  }

  * {
    transition-duration: 0.01ms !important;
  }
}
```

---

## 📋 **BRAND IMPLEMENTATION CHECKLIST**

### **Component Compliance**
- [ ] Button component has all wedding variants
- [ ] Card component default variant fixed
- [ ] All components use CSS custom properties
- [ ] Typography classes applied consistently
- [ ] Hover effects follow wedding standards

### **Page Compliance**
- [ ] Homepage: ✅ Already compliant
- [ ] RSVP Page: ❌ Requires major fixes
- [ ] Presents Page: ❌ Requires critical fixes
- [ ] Gallery Page: Audit required
- [ ] Location Page: Audit required
- [ ] Admin Pages: Audit required

### **Color System Migration**
- [ ] Remove all rose/pink color references
- [ ] Remove all purple/violet color references
- [ ] Replace with monochromatic variables
- [ ] Update all gradient backgrounds
- [ ] Fix glass-morphism color schemes

### **Typography Consistency**
- [ ] All headings use Playfair Display
- [ ] All body text uses Crimson Text (italic)
- [ ] All special elements use Cormorant
- [ ] Font sizes follow wedding scale
- [ ] Letter spacing applied consistently

---

## 🚨 **CRITICAL ACTION ITEMS**

### **Immediate Priority (P0)**
1. **Fix RSVP Page**: Complete color system migration
2. **Fix Presents Page**: Critical brand violations
3. **Update Button Component**: Add missing wedding variants
4. **Fix Card Component**: Default variant issue

### **High Priority (P1)**
1. Audit remaining pages (Gallery, Location, Admin)
2. Create component testing for brand compliance
3. Implement automated brand validation
4. Update mobile responsive design consistency

### **Medium Priority (P2)**
1. Create brand style guide for development team
2. Implement design tokens system
3. Create component library documentation
4. Set up brand compliance monitoring

---

## 📖 **USAGE GUIDELINES**

### **Do's**
✅ Use monochromatic color palette exclusively
✅ Apply serif typography throughout
✅ Center-align all wedding content
✅ Use generous white space (2rem+ padding)
✅ Apply subtle botanical decorations
✅ Follow wedding invitation interaction patterns
✅ Maintain 4.5:1 contrast ratios minimum

### **Don'ts**
❌ Use bright or saturated colors
❌ Mix sans-serif fonts in prominent places
❌ Create cramped layouts
❌ Use heavy or dominant decorative elements
❌ Apply trendy design patterns
❌ Ignore accessibility requirements
❌ Break the monochromatic color system

---

## 📊 **BRAND METRICS**

### **Success Criteria**
- **Visual Consistency**: 100% compliance across all pages
- **Color Adherence**: 0 violations of monochromatic palette
- **Typography Uniformity**: Serif fonts 100% coverage
- **Accessibility**: WCAG AA compliance maintained
- **Performance**: No impact from brand standards
- **Mobile Experience**: Wedding invitation feel on all devices

### **Measurement Tools**
- Component audit checklist
- Color compliance scanner
- Typography analysis tool
- Accessibility testing suite
- Cross-page consistency validator

---

**Document Status**: Brand Audit Complete - Critical Violations Identified
**Last Updated**: September 29, 2025
**Next Review**: After critical fixes implementation
**Approval**: Pending implementation of P0 fixes

> *"In a world of infinite choices, consistent brand experience is what makes users choose you again and again."*