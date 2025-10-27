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
- 🔀 Smart gift sorting (randomized, price, funding progress)
- 📧 Email automation (confirmations, reminders)
- 📱 QR code generation for easy sharing
- ⏰ Live countdown timer to wedding day
- 📋 Admin dashboard for wedding planning
- 📍 Wedding location with Google Maps integration
- 🗺️ Interactive venue map with directions
- 🌟 Mobile-first responsive design
- 📷 Gallery with CDN-powered image optimization
- 📅 Auto-calculated timeline day numbers (Day 1 = Feb 25, 2023)

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
- **Next Steps**: Guest Experience Enhancement (see docs/GUEST_EXPERIENCE_ROADMAP.md)

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

### Gift Registry Sorting System ✅ NEW (2025-10-27)
**Status**: Complete - Smart sorting with session-based randomization

#### Features
The gift registry (`/presentes`) now includes an elegant sorting system that enhances the browsing experience:

**Sorting Options**:
1. **Aleatório (Random)** - Default view, randomized order per session
   - Uses seeded Fisher-Yates shuffle algorithm
   - Order stays consistent during user's session (30 min)
   - Changes on refresh after session expires
   - Prevents bias toward specific gifts

2. **Menor Preço** - Sort by price (low to high)
   - Helps guests find affordable options

3. **Maior Preço** - Sort by price (high to low)
   - For guests looking for premium gifts

4. **Mais Contribuído** - Sort by funding progress
   - Shows most popular/funded gifts first
   - Sorted by percentage funded, then total amount

5. **Menos Contribuído** - Sort by lowest funding
   - Helps identify gifts that need more support

**Technical Implementation**:
- **Utilities**: `src/lib/utils/sorting.ts`
  - `getSessionSeed()`: Session-based random seed (30min TTL)
  - `shuffleArray()`: Seeded Fisher-Yates algorithm
  - `sortGifts()`: Main sorting logic
  - LocalStorage for user preference persistence

- **Component**: `src/components/gifts/SortingControls.tsx`
  - Elegant dropdown with wedding aesthetic
  - Radio selection with descriptions
  - Animated transitions with Framer Motion
  - Mobile-responsive design

- **Integration**: `src/app/presentes/PresentsPageClient.tsx`
  - State management with React hooks
  - Memoized sorting for performance
  - Preference persistence across visits

**User Experience**:
- Default view always randomized (prevents gift bias)
- Smooth animations and transitions
- User preference saved in localStorage
- Session-based randomization ensures freshness
- Item count displayed with sorting controls

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
  - **Auto-Calculated Day Numbers** ✅ NEW (2025-10-19)
    - Day numbers calculate automatically from dates
    - Day 1 = February 25, 2023 (Guaramiranga - official relationship start)
    - Day 1000 = November 20, 2025 (Wedding day)
    - Supports negative days for pre-relationship events (e.g., Tinder match = Day -49)
    - Custom Sanity components show contextual badges and helpful info
    - Phase day ranges auto-calculate from phase moments
    - See `docs/DAY_NUMBER_REFACTORING.md` for full details
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

## Guest Experience Enhancement Roadmap
**Status**: ✅ PHASE 4 & 5 COMPLETE - Admin Management + Live Feed Ready!

### Latest Session Progress (2025-10-13)

#### Session 1: Phase 4 Complete - Admin Invitation Management ✅
**Status**: COMPLETE - Full CRUD functionality with beautiful modals
- ✅ Extended invitations service with 9 admin functions (395 lines)
- ✅ Built admin page foundation at `/admin/convites` (600+ lines)
- ✅ **Create Invitation Modal** (308 lines) - Full form with validation, preview
- ✅ **Edit Invitation Modal** (298 lines) - Pre-populated fields, last updated timestamp
- ✅ **Detail View Modal** (374 lines) - Complete invitation details, QR code, progress tracking
- ✅ **Total**: 1,580+ lines of production-ready admin interface

#### Session 2: Phase 5 Complete - Live Wedding Day Feed ✅
**Status**: COMPLETE - Real-time celebration platform with Supabase subscriptions
- ✅ **Live Service Layer** (`src/lib/supabase/live.ts` - 520 lines)
  - Real-time Supabase subscriptions for posts, reactions, comments
  - Pinned posts management (pin/unpin/reorder)
  - Live celebration statistics
  - Recent activity tracking
  - Confirmed guests fetching
  - Recent photos slideshow
- ✅ **LivePostStream Component** (190 lines) - Real-time post feed with "new posts" banner
- ✅ **LiveStats Component** (180 lines) - 4 stat cards + recent activity feed
- ✅ **PinnedMomentsSection Component** (140 lines) - Special moments with shimmer effects
- ✅ **GuestsGrid Component** (150 lines) - Confirmed guests with relationship filters
- ✅ **LivePhotoGallery Component** (200 lines) - Auto-playing slideshow with fullscreen
- ✅ **Live Feed Page** (`/ao-vivo` - 130 lines) - Complete celebration dashboard

**Total Phase 4 & 5 Progress**: 3,000+ lines of production-ready code

**Overall Progress**: Phase 3 (100%) + Phase 4 (100%) + Phase 5 (100%) = ~85% of Guest Experience Enhancement

### Overview
Comprehensive plan to transform the wedding website from a static invitation into an interactive celebration platform with personalized invitations, guest messaging, real-time wedding day feed, and progress tracking.

### Documentation
Complete implementation roadmap available at:
- **Full Roadmap**: `/docs/GUEST_EXPERIENCE_ROADMAP.md` (200+ lines with detailed implementation guide)
- **Quick Summary**: `/docs/IMPLEMENTATION_SUMMARY.md` (High-level overview and quick reference)

### Implemented Features (4 New Pages)

#### 1. `/convite` - Personalized Invitation Landing Page ✅ COMPLETE
**Purpose**: Primary guest entry point with personalized experiences

**Status**: ✅ PHASE 2 IMPLEMENTATION COMPLETE (2025-10-13)

**Implemented Features**:
- ✅ Generic invitation page (`/convite`) - Public access with event details
- ✅ Personalized invitation route (`/convite/[code]`) - Dynamic guest experiences
- ✅ Service layer utilities (`src/lib/supabase/invitations.ts`) - Complete invitation management
- ✅ TypeScript types (`src/types/wedding.ts`) - Full type safety
- ✅ Progress tracker component (`src/components/invitations/GuestProgressTracker.tsx`) - Animated circular progress
- ✅ Automatic open tracking - First open timestamp + view counts
- ✅ QR code generation - Easy invitation sharing
- ✅ Guest progress calculation - Completion percentage for RSVP, gifts, photos, messages
- ✅ Custom message display - Personalized greetings per guest
- ✅ Plus one indicator - Shows acompanhante status
- ✅ Quick action buttons - Navigate to RSVP, gifts, photos, messages
- ✅ Loading & error states - Professional UX with friendly messages
- ✅ Mobile-first responsive design - Perfect on all devices
- ✅ Elegant wedding aesthetic - Maintained throughout

**Database**: `invitations` table with invite codes, guest details, tracking (already created in migration 024)

**Test URLs** (with sample data):
- http://localhost:3000/convite/FAMILY001 - João Silva (family, plus one allowed)
- http://localhost:3000/convite/FRIEND002 - Maria Santos (friend, plus one allowed)
- http://localhost:3000/convite/FRIEND003 - Pedro Costa (friend, no plus one)
- http://localhost:3000/convite/WORK004 - Ana Oliveira (colleague, no plus one)

**Implementation Stats**:
- Service layer: 225 lines (8 functions with full JSDoc)
- Progress tracker: 258 lines (circular progress, 4 action items, animations)
- Personalized route: 585 lines (complete UX with loading/error states)
- TypeScript types: 115 lines (7 interfaces with full documentation)
- **Total**: 1,183 lines of production-ready code

**Next**: `/admin/convites` for invitation management (Phase 4)

#### 2. `/mensagens` - Guest Messaging & Social Feed ✅ COMPLETE
**Purpose**: Social feed where guests share messages, photos, and videos

**Status**: ✅ PHASE 3 IMPLEMENTATION COMPLETE (2025-10-13)

**Implemented Features**:
- ✅ Rich post composer with emoji picker (36 wedding emojis)
- ✅ Multi-file upload (images + videos, up to 10 files)
- ✅ Post type detection (text/image/video/mixed)
- ✅ Character limit (5000 chars) with live counter
- ✅ Media preview with remove functionality
- ✅ Reaction system (heart ❤️, clap 👏, laugh 😂, celebrate 🎉, love 💕)
- ✅ Comment threads with nested replies (max 3 levels deep)
- ✅ Filter by post type (all/text/photos/videos)
- ✅ Guest name session management
- ✅ Real-time engagement stats (likes, comments)
- ✅ Mobile-first responsive design
- ✅ Elegant wedding aesthetic maintained

**Admin Features** (`/admin/posts`):
- ✅ Comprehensive moderation dashboard
- ✅ View all posts (pending/approved/rejected)
- ✅ Approve/reject with keyboard shortcuts (A/R)
- ✅ Batch operations for multiple posts
- ✅ Real-time statistics dashboard
- ✅ Search and filter functionality
- ✅ Pin/unpin special moments
- ✅ Rejection reason tracking
- ✅ Mobile-optimized admin interface

**Database**: Tables created in migration 024 - `guest_posts`, `post_reactions`, `post_comments`, `pinned_posts`

**Service Layer** (`src/lib/supabase/messages.ts`):
- 26 functions with full JSDoc documentation
- Complete CRUD operations for posts, reactions, comments
- Batch moderation support
- Statistics and analytics
- Pin/unpin functionality

**Components**:
- `PostComposer.tsx` (434 lines): Rich editor with emoji picker and file upload
- `PostCard.tsx` (340 lines): Post display with reactions and comments
- `CommentThread.tsx` (290 lines): Nested comment system with replies
- `MessagesFeed.tsx` (280 lines): Interactive feed with filtering
- **Total**: 1,344 lines of production-ready component code

**Implementation Stats**:
- Service layer: 625 lines (26 functions)
- Components: 1,344 lines (4 major components)
- Pages: 380 lines (public feed + admin dashboard)
- **Total**: 2,349 lines of production-ready code

**Test URLs**:
- http://localhost:3000/mensagens - Public feed
- http://localhost:3000/admin/posts - Moderation dashboard

**Next**: `/ao-vivo` live feed with real-time subscriptions (Phase 5)

#### 3. `/ao-vivo` - Wedding Day Live Feed ✅ COMPLETE
**Purpose**: Real-time celebration dashboard for wedding day

**Status**: ✅ PHASE 5 IMPLEMENTATION COMPLETE (2025-10-13)

**Implemented Features**:
- ✅ **Live Post Stream** - Real-time approved posts with Supabase subscriptions
- ✅ **Live Statistics Dashboard** - 4 beautiful stat cards (posts, photos, guests, reactions)
- ✅ **Recent Activity Feed** - Last 10 actions across all features
- ✅ **Pinned Special Moments** - Admin-curated posts with shimmer effects
- ✅ **Live Photo Gallery** - Auto-playing slideshow with fullscreen mode
- ✅ **Confirmed Guests Grid** - Avatar display with relationship filters
- ✅ **Real-time Subscriptions** - WebSocket connections for instant updates
- ✅ **Connection Status Indicator** - Live/polling status with animated dot
- ✅ **"New Posts Available" Banner** - Smart notification when scrolled away
- ✅ **Mobile-first responsive** - Perfect layout on all devices
- ✅ **Elegant wedding aesthetic** - Gradient hero, beautiful animations

**Real-time Infrastructure**:
- Supabase channels for posts, reactions, comments, pinned posts
- Auto-refresh fallback every 30 seconds
- Smooth animations with Framer Motion
- GPU-accelerated performance

**Service Layer** (`src/lib/supabase/live.ts` - 520 lines):
- 4 subscription functions (posts, reactions, comments, pinned)
- 7 pinned posts management functions
- Live statistics aggregation
- Recent activity tracking
- Confirmed guests fetching
- Recent photos slideshow

**Components**:
- `LivePostStream.tsx` (190 lines): Real-time feed with scroll detection
- `LiveStats.tsx` (180 lines): Stats dashboard with activity timeline
- `PinnedMomentsSection.tsx` (140 lines): Special moments showcase
- `GuestsGrid.tsx` (150 lines): Confirmed guests with filters
- `LivePhotoGallery.tsx` (200 lines): Slideshow with navigation
- `LiveFeedPage.tsx` (130 lines): Main celebration dashboard
- **Total**: 990 lines of component code

**Implementation Stats**:
- Service layer: 520 lines
- Components: 990 lines
- Page: 130 lines
- **Total**: 1,640 lines of production-ready code

**Test URL**:
- http://localhost:3006/ao-vivo - Live celebration feed

**Database**: `pinned_posts` table for special moments (already created)
**Admin**: Pin/unpin via `/admin/posts` moderation dashboard

#### 4. `/meu-convite` - Guest Dashboard
**Purpose**: Personalized hub showing guest's progress

**Features**:
- Completion checklist (RSVP, gifts, photos, messages)
- Event countdown timer
- Quick action buttons
- Recent activity feed
- Invite code with QR code

**Dependencies**: All other features (tracks overall progress)

### Implementation Timeline (4 Weeks)

**Week 1 - Phase 1: Foundation & Invitations**
- Database migrations (all tables)
- Build `/convite` page (generic + personalized)
- Implement invite code system
- Build `/admin/convites` management
- Add first-visit onboarding tutorial

**Week 2 - Phase 2: Social Features**
- Post composer with emoji picker
- Build `/mensagens` feed page
- Like/reaction/comment system
- Build `/admin/posts` moderation
- Activity feed integration

**Week 3 - Phase 3: Live Experience**
- Real-time Supabase subscriptions
- Build `/ao-vivo` live feed page
- Special moments pinning
- Celebration stats dashboard
- Mobile optimization

**Week 4 - Phase 4: Polish & Launch**
- Build `/meu-convite` dashboard
- Enhanced navigation (mobile bottom nav)
- Onboarding tooltips
- Comprehensive testing
- Production launch

### Database Schema Changes

**New Tables Required**:
1. `invitations` - Personalized invite codes and guest details
2. `guest_posts` - Guest messages with moderation
3. `post_reactions` - Likes and reactions on posts
4. `post_comments` - Comments with nested replies support
5. `pinned_posts` - Admin-pinned special moments

All SQL schemas and RLS policies included in full roadmap document.

### Success Metrics

**Engagement Targets**:
- Invitation open rate: 85%+
- Message posting rate: 40%+ of guests
- Photo upload rate: 60%+ of guests
- Dashboard completion: 50%+ complete all 4 actions

**Wedding Day Performance**:
- Concurrent users during ceremony: 70%+ of guests
- Posts per hour during reception: 20+
- Real-time subscription success rate: 99%+

**Technical Performance**:
- Page load time: < 2 seconds
- Lighthouse score: 90+ for all pages

### Rollout Strategy

1. **Phase 1 Launch**: Close family (10-15 guests) - Test invitation system
2. **Phase 2 Launch**: Extended family & friends (50-75 guests) - Test social features
3. **Phase 3 Launch**: All guests (100+ total) - Full feature set
4. **Wedding Day**: Live at venue - Real-time feed active

### Technical Considerations

**Real-time Infrastructure**:
- Supabase real-time subscriptions for live feed
- Fallback auto-refresh every 30 seconds
- Connection limit: 200 concurrent (consider plan upgrade if needed)

**Content Moderation**:
- All posts/photos require admin approval
- Keyboard shortcuts for quick moderation (A/R)
- Batch operations support
- Activity feed integration

**Mobile Optimization**:
- Bottom navigation bar for mobile
- Floating action button (FAB)
- Dark mode for evening reception
- Mobile admin panel for on-site moderation

### Next Steps to Begin Implementation

Ready to start? Use this command:

```bash
# Create feature branch
git checkout -b feature/guest-experience-phase-1

# Review full roadmap
cat docs/GUEST_EXPERIENCE_ROADMAP.md

# Start with database migrations
npm run db:generate
```

Then follow the detailed Phase 1 implementation guide in the roadmap document.

---
- Never add " 🤖 Generated with [Claude Code](https://claude.com/claude-code)" to commit messages