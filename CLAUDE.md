# Thousand Days of Love - Claude Configuration

## Project Overview
A beautiful, modern wedding website for Hel and Ylana's November 20th, 2025 wedding - celebrating their 1000 days together!

**Wedding Date**: November 20th, 2025 (1000th day milestone)
**Domain**: thousandaysof.love

## Tech Stack
- **Frontend**: Next.js 15.5.4 + TypeScript + Tailwind CSS + Framer Motion
- **CMS**: Sanity CMS (marketing content, pages, sections, GALLERY)
- **Database**: Supabase (transactional data: RSVP, payments, config)
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
- 📷 Gallery with CDN-powered image optimization

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
│   ├── sections/    # Page sections (hero, timeline, etc.)
│   └── gallery/     # Gallery components
├── lib/
│   ├── supabase/    # Database client configuration
│   └── utils/       # Wedding utilities (countdown, validation)
├── sanity/
│   ├── schemas/     # Sanity CMS schemas
│   ├── queries/     # GROQ queries
│   └── lib/         # Sanity client
├── types/           # TypeScript interfaces
└── app/             # Next.js app router pages
```

## Documentation Location
All comprehensive planning documentation is stored in:
`~/HelSky Vault/02 Code/Helsky Labs/ThousandDaysOfLove/`

## Environment Setup
Copy `.env.local.example` to `.env.local` and configure:
- Sanity (CMS)
- Supabase (database and auth)
- SendGrid (email automation)
- Mercado Pago (payment processing with PIX)

## Git Repository
- **Location**: `/Users/helrabelo/code/personal/thousanddaysoflove`
- **Current Status**: Phase 2 (Gallery Migration) implementation complete
- **Next Steps**: Execute gallery migration to Sanity

## Supabase Local Development
**Status**: ✅ COMPLETE - Full local development environment ready

### Local Environment URLs
- **Wedding Website**: http://localhost:3000
- **Sanity Studio**: http://localhost:3000/studio
- **Supabase Studio**: http://127.0.0.1:54323
- **Email Testing**: http://127.0.0.1:54324
- **Database**: postgresql://postgres:postgres@127.0.0.1:54322/postgres
- **API**: http://127.0.0.1:54321

### Quick Commands
```bash
# Complete setup
./supabase-setup.sh

# Start development
npm run dev

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

## Admin Area Structure
**Status**: ✅ CLEANED UP - Minimal admin focused on Supabase features

### Overview
The admin area has been streamlined to avoid duplication with Sanity CMS. Content management (gallery, timeline, pets, about us, hero images) is handled in Sanity Studio, while transactional features remain in the custom admin.

### Admin Dashboard (`/admin`)
**Authentication**: Simple password-based (cookie: `admin_session`)
- Password: `ADMIN_PASSWORD` env var
- Login page: `/admin/login`
- Uses `createAdminClient()` to bypass RLS

### Active Admin Sections (Supabase-managed)

#### 1. Guest Management (`/admin/guests`)
- View and manage guest list
- Confirm RSVPs
- Track attendance

#### 2. Photo Moderation (`/admin/photos`) ✅ NEW
- Moderate guest-uploaded photos
- Approve/reject with reasons
- Batch operations
- Keyboard shortcuts (A=approve, R=reject, Space=select)
- Filters: status, phase, guest search
- Updates `activity_feed` on moderation actions

#### 3. Gift Registry (`/admin/presentes`)
- Manage wedding gift registry
- Track gift selections

#### 4. Payment Tracking (`/admin/pagamentos`)
- Track PIX payments
- Monitor gift contributions

#### 5. Analytics (`/admin/analytics`)
- Wedding statistics and insights
- Guest engagement metrics

### Content Management (Sanity Studio)

#### Sanity Studio (`/studio`)
All content editing happens in Sanity Studio:
- **Gallery**: Photo albums and images (`galleryImage`)
- **Timeline/Historia**: Story moments and phases (`storyMoment`, `storyPhase`, `storyCard`)
- **Pets**: Family pets section (`pet`, `ourFamily`)
- **About Us**: Couple information (`aboutUs`)
- **Hero Images**: Homepage hero section (`videoHero`)
- **Pages**: All marketing pages and sections

### Guest Photo Upload System
**Status**: ✅ PHASE 1 & 2 COMPLETE

### Phase 1: Admin Photo Moderation ✅
#### Guest Flow
1. **Authentication**: `/dia-1000/login`
   - Password: `1000dias` (from `GUEST_SHARED_PASSWORD` env var)
   - Creates session in `guest_sessions` table
   - Optional guest name collection

2. **Upload**: `/dia-1000/upload`
   - Select upload phase: before/during/after
   - Multi-file upload (photos + videos)
   - Storage: Supabase Storage bucket `wedding-photos`
   - Database: `guest_photos` table

3. **Database Tables**:
   - `guest_photos`: Photo metadata and moderation status
   - `guest_sessions`: Guest authentication sessions
   - `simple_guests`: Guest information
   - `activity_feed`: Updates on photo approvals

#### Admin Moderation Flow
1. Login at `/admin/login` (password: `HelYlana1000Dias!`)
2. Navigate to `/admin/photos`
3. View all uploaded photos with filters
4. Approve/reject individual or batch photos
5. Activity feed automatically updated on approval

### Phase 2: Gallery Integration ✅
#### Gallery Display
- **Location**: `/galeria` page
- **Main Gallery**: Displays Sanity CMS albums (with multi-media) + all approved guest photos merged
- **Guest Photos Section**: Dedicated section with phase filtering tabs

#### Features
- **Phase Tabs**: Filter by before/during/after wedding phases
- **Guest Attribution**: Avatar, name, and upload date displayed
- **Photo Counts**: Real-time counts per phase
- **Responsive Design**: Mobile-first with elegant wedding aesthetic
- **Animations**: Framer Motion hover and reveal effects
- **Multi-Media Albums**: Sanity albums support 1-10 images/videos with carousel lightbox

### Phase 3: Multi-Media Album Support ✅
**Status**: COMPLETE - Gallery albums now support multiple images/videos

#### Architecture
We maintain **TWO SEPARATE gallery systems** that work together seamlessly:

1. **Sanity CMS Albums** (Admin-managed)
   - Multiple images/videos per album (1-10 items)
   - Managed via Sanity Studio
   - Carousel lightbox for viewing all media
   - Professional curated content

2. **Guest Photo Uploads** (User-generated)
   - Single image/video per upload (simpler UX)
   - Supabase storage and database
   - Phase filtering and guest attribution
   - Community-contributed content

#### Sanity Schema Updates
**File**: `src/sanity/schemas/documents/galleryImage.ts`

- Added `media[]` array field (1-10 items)
- Each media item includes:
  - `mediaType`: 'image' | 'video'
  - Conditional `image` or `video` assets
  - `alt`, `caption`, `displayOrder` fields
- Legacy `image` field hidden for backwards compatibility
- Preview shows media count: "Beach Trip (5 mídias)"
- Portuguese labels throughout

#### Gallery Utilities
**File**: `src/lib/utils/sanity-gallery.ts`

- `getGalleryAlbumMedia()`: Transforms media arrays with legacy fallback
- `getPrimaryGalleryMedia()`: Gets first media for thumbnails
- `hasMultipleMedia()`: Checks for multi-media albums
- `getGalleryMediaByType()`: Filters by image/video
- Sanity CDN optimization helpers (srcset, hotspot, etc.)

#### Frontend Components

**GalleryLightbox** (`src/components/gallery/GalleryLightbox.tsx`):
- Full-screen modal with MediaCarousel integration
- Album title and description display
- Loading state with playful "Preparando álbum..." animation
- Close button with delightful rotation animation
- ESC key support
- Keyboard hints with pulse effect

**MasonryGallery** (`src/components/gallery/MasonryGallery.tsx`):
- Multi-media badge with shimmer effect on albums
- Badge shows count: "5 📸" when album has multiple items
- Click on album badge opens GalleryLightbox with carousel
- Single media uses existing MediaLightbox
- "Ver álbum completo" hover hint for multi-media albums

**GuestPhotosSection** (Enhanced with whimsy):
- Phase tabs with hover lift and count badge bounce
- Guest cards with lift, avatar bounce, and badge pulse
- Shimmer effect on "Convidado" badge
- Empty states with playful camera emoji animations

#### Delightful Micro-interactions
All components feature elegant animations:
- Shimmer/pulse effects on badges
- Staggered entrance animations
- Hover lift and scale effects
- Playful empty states
- Loading states with camera emoji animations
- Full `useReducedMotion` support for accessibility

#### Type Safety
**File**: `src/types/wedding.ts` (lines 460-522)

- `SanityGalleryAlbumMediaItem`: Single media item in album
- `SanityGalleryAlbum`: Complete album with media array
- `RenderedGalleryMediaItem`: Frontend rendering helper
- Full TypeScript coverage with proper interfaces

#### Key Benefits
✅ Backwards compatible with legacy single-image galleries
✅ No conflicts with guest photo upload system
✅ Reuses MediaCarousel component from Story Moments
✅ Elegant wedding aesthetic maintained
✅ GPU-accelerated animations for smooth performance
✅ Mobile-first responsive design
✅ Accessibility: keyboard nav, reduced motion, ARIA labels

#### Technical Implementation
- **Service Layer**: `src/lib/supabase/gallery.ts` (SupabaseGalleryService)
- **Component**: `src/components/gallery/GuestPhotosSection.tsx`
- **Data Merging**: Sanity photos + guest photos in compatible MediaItem format
- **Filters**: Phase filtering (all/before/during/after)
- **Type Safety**: Type assertions for guest_photos table (not in generated types yet)

#### Key Files
- `src/lib/supabase/gallery.ts`: Guest photo fetching service
- `src/app/galeria/page.tsx`: Gallery page with merged data sources
- `src/components/gallery/GuestPhotosSection.tsx`: Phase-filtered guest photo display
- `src/lib/supabase/server.ts`: Supabase client creation

#### Technical Details
- **Cloud Supabase**: `uottcbjzpiudgmqzhuii.supabase.co`
- **Storage Bucket**: `wedding-photos` (public)
- **Image Configuration**: Added Supabase hostname to `next.config.ts`
- **Auth Separation**:
  - `guestAuth.ts`: Client-safe utilities
  - `guestAuth.server.ts`: Server-only functions
- **Utilities**: Shared formatters in `lib/utils/format.ts`

---
