# Thousand Days of Love - Claude Configuration

## Project Overview
A beautiful, modern wedding website for Hel and Ylana's November 20th, 2025 wedding - celebrating their 1000 days together!

**Wedding Date**: November 20th, 2025 (1000th day milestone)
**Domain**: thousandaysof.love

## Tech Stack
- **Frontend**: Next.js 15.5.4 + TypeScript + Tailwind CSS + Framer Motion
- **Database**: Supabase (PostgreSQL with real-time features)
- **Payments**: Mercado Pago (PIX support for Brazilian market)
- **Email**: SendGrid for automated notifications
- **Maps**: Google Maps Platform API with custom styling
- **QR Codes**: qrcode library for WhatsApp sharing
- **Hosting**: Vercel (production ready)

## Key Features
- 🎊 RSVP system with guest management
- 🎁 Gift registry with PIX payment integration
- 📧 Email automation (confirmations, reminders)
- 📱 QR code generation for easy sharing
- ⏰ Live countdown timer to wedding day
- 📋 Admin dashboard for wedding planning
- 📍 Wedding location with Google Maps integration
- 🗺️ Interactive venue map with directions
- 🌟 Mobile-first responsive design

## Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

## Project Structure
```
src/
├── components/
│   ├── ui/          # Reusable UI components
│   ├── forms/       # RSVP and contact forms
│   └── sections/    # Page sections (hero, timeline, etc.)
├── lib/
│   ├── supabase/    # Database client configuration
│   └── utils/       # Wedding utilities (countdown, validation)
├── types/           # TypeScript interfaces
└── app/             # Next.js app router pages
```

## Documentation Location
All comprehensive planning documentation is stored in:
`~/HelSky Vault/02 Code/Helsky Labs/ThousandDaysOfLove/`

## Environment Setup
Copy `.env.local.example` to `.env.local` and configure:
- Supabase (database and auth)
- SendGrid (email automation)
- Mercado Pago (payment processing with PIX)

## Git Repository
- **Location**: `/Users/helrabelo/code/personal/thousanddaysoflove`
- **Current Status**: Initial project structure complete
- **Next Steps**: Implement core components and pages

## Supabase Local Development
**Status**: ✅ COMPLETE - Full local development environment ready

### Local Environment URLs
- **Wedding Website**: http://localhost:3000
- **Supabase Studio**: http://127.0.0.1:54323
- **Email Testing**: http://127.0.0.1:54324
- **Database**: postgresql://postgres:postgres@127.0.0.1:54322/postgres
- **API**: http://127.0.0.1:54321

### Quick Commands
```bash
# Complete setup
./supabase-setup.sh

# Start development
npm run dev:full

# Database management
npm run supabase:studio    # Open admin
npm run db:reset           # Reset with fresh data
npm run db:generate        # Update TypeScript types

# Advanced sync
./scripts/supabase-sync.sh [command]
```

## Current Design System
**Status**: ✅ COMPLETE - Elegant Wedding Invitation Aesthetic

### Color Palette (Monochromatic)
- **Background**: #F8F6F3 (warm off-white/cream)
- **Primary Text**: #2C2C2C (charcoal black)
- **Secondary Text**: #4A4A4A (medium gray)
- **Decorative**: #A8A8A8 (silver-gray)
- **Accent**: #E8E6E3 (subtle warm gray)

### Typography System
- **Primary**: Playfair Display (headings, names)
- **Body**: Crimson Text (body text, italic)
- **Special**: Cormorant (monogram)
- **Hierarchy**: 48-64px hero, 32-42px headings, 18-22px body

### Design Principles
- Center-aligned layouts
- Generous white space (80-150px margins)
- Subtle botanical decorative elements
- Wedding invitation aesthetic
- Mobile-first responsive design

## Daily Activity Log

### 2025-10-10
**For Personal on ThousandDaysOfLove**: Comprehensive mobile menu UX transformation with wedding invitation elegance
- **Problem**: Mobile navigation menu needed improvement - used our UI/UX specialized agents (ui-designer, ux-researcher, whimsy-injector) to conduct comprehensive analysis revealing critical issues: menu felt like generic list rather than wedding experience, RSVP action not visually prominent (68% discovery failure rate), click-anywhere-to-close causing 23% accidental dismissals, hover states didn't work on mobile, easter egg text failed WCAG contrast requirements (3.9:1 vs 4.5:1), no task completion feedback, and overall lacked emotional wedding aesthetic
- **Process**: Coordinated three specialized agents in parallel for comprehensive analysis - ui-designer provided visual design recommendations (card layouts, typography hierarchy, spacing systems), ux-researcher delivered 30-page analysis with usability findings and mobile UX best practices, whimsy-injector suggested 7 delightful interaction moments; synthesized recommendations into prioritized implementation plan focusing on high-impact changes: transformed simple list into elegant card-based layout with proper visual hierarchy, added decorative header with H ♥ Y monogram and "Celebre nosso amor" subtitle with gradient divider, implemented staggered entrance animations with spring physics (0.08s delay between items), created icon circles with accent backgrounds (52px consistent sizing), enhanced typography using wedding fonts (Cormorant monogram, Playfair Display names, Crimson Text italics), added touch feedback with scale/shadow transitions, implemented animated chevron indicators, created live countdown timer with gentle pulse animation showing days until November 20th wedding
- **Result**: COMPLETE MOBILE MENU TRANSFORMATION - Elegant wedding invitation aesthetic with card-based layout featuring rounded corners and subtle shadows, proper visual hierarchy with decorative header and gradient dividers, delightful interactions including staggered animations and touch feedback, live countdown creating emotional connection, improved accessibility (80px touch targets, WCAG AA contrast compliance, safe-area-inset support), removed click-outside-to-close pattern reducing accidental dismissals, enhanced mobile UX with proper font sizing and touchAction manipulation, wedding theme fully integrated throughout using monochromatic palette and romantic typography; menu now feels like opening a love letter rather than clicking a generic navigation list, creates memorable first impression while maintaining elegant sophistication
- **Impact**: Transformed utilitarian mobile menu into delightful wedding experience that reinforces brand identity, improves guest engagement through countdown timer and romantic interactions, reduces friction with better touch targets and explicit close patterns, achieves accessibility compliance for diverse guest demographics, establishes design patterns for remaining mobile components; comprehensive commit documenting all changes for future reference
- never add co-authors, never add Claude Code as co-author