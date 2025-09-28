# Thousand Days of Love - Claude Configuration

## Project Overview
A beautiful, modern wedding website for Hel and Ylana's November 11th, 2025 wedding - celebrating their 1000 days together!

**Wedding Date**: November 11th, 2025 (1000th day milestone)
**Domain**: thousandaysof.love

## Tech Stack
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS + Framer Motion
- **Database**: Supabase (PostgreSQL with real-time features)
- **Payments**: Mercado Pago (PIX support for Brazilian market)
- **Email**: SendGrid for automated notifications
- **QR Codes**: qrcode library for WhatsApp sharing
- **Hosting**: Vercel (planned)

## Key Features
- 🎊 RSVP system with guest management
- 🎁 Gift registry with PIX payment integration
- 📧 Email automation (confirmations, reminders)
- 📱 QR code generation for easy sharing
- ⏰ Live countdown timer to wedding day
- 📋 Admin dashboard for wedding planning
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

## Daily Activity Log

### 2025-09-28
**For Personal on Hel&Ylana Wedding**: Complete project initialization and comprehensive documentation organization
- **Problem**: Needed to organize wedding website planning documentation in Obsidian vault and initialize the actual Next.js project with proper structure, dependencies, and configuration for rapid development
- **Process**: Created organized documentation structure in HelSky Vault under "02 Code > Helsky Labs > Hel&Ylana" directory, moved all 5 comprehensive planning documents (technical architecture, design system, domain research, backend architecture, project roadmap) from root directory to proper Obsidian vault location, initialized Next.js 14 project in `/code/personal/hel-ylana-wedding` with TypeScript and Tailwind CSS, installed essential dependencies (Supabase, SendGrid, qrcode, Framer Motion, date-fns, Lucide React), created project structure with components/ui/forms/sections directories, implemented TypeScript interfaces for Guest/Gift/Payment/WeddingConfig models, set up Supabase client configuration, created wedding utility functions (countdown timer, phone formatting, validation, invitation code generation), established environment variables template, wrote comprehensive README with features and setup instructions
- **Result**: Complete wedding website project foundation established with proper documentation organization in Obsidian vault, fully configured Next.js development environment with all required dependencies, TypeScript interfaces for all wedding data models, utility functions ready for countdown and validation features, environment template configured for Supabase/SendGrid/Mercado Pago integration, comprehensive README documenting features and development process, git repository initialized with proper commit history; project ready for immediate component development and feature implementation with 6-week timeline to November 11th wedding date