# Guest Experience Enhancement Roadmap
## Thousand Days of Love Wedding Website

**Project**: thousandaysof.love
**Wedding Date**: November 20th, 2025
**Current Status**: Core features complete (RSVP, Gallery, Gift Registry)
**Goal**: Transform guest experience with comprehensive engagement features

---

## Current State Analysis

### Existing Architecture
- **Frontend**: Next.js 15.5.4 + TypeScript + Tailwind CSS + Framer Motion
- **CMS**: Sanity (marketing content, gallery, timeline/historia)
- **Database**: Supabase (transactional: RSVP, payments, guest photos)
- **Payments**: Mercado Pago (PIX support)
- **Email**: SendGrid
- **Maps**: Google Maps Platform API

### Current Guest-Facing Pages
1. **Homepage** (`/`) - Video hero, event details, story preview, about us, family, location
2. **RSVP** (`/rsvp`) - Guest confirmation system
3. **Gallery** (`/galeria`) - Sanity albums + approved guest photos with phase filtering
4. **Story/Timeline** (`/historia`) - Couple's journey timeline
5. **Event Details** (`/detalhes`) - Ceremony and reception information
6. **Gift Registry** (`/presentes`) - Gift selection with PIX payment
7. **Guest Photo Upload** (`/dia-1000/login` + `/dia-1000/upload`) - Password-protected upload

### Existing Admin Features
- Guest management (`/admin/guests`)
- Photo moderation (`/admin/photos`) - Approve/reject guest uploads
- Gift registry management (`/admin/presentes`)
- Payment tracking (`/admin/pagamentos`)
- Analytics dashboard (`/admin/analytics`)

### Current Database Tables (Supabase)
```
✓ guests - RSVP and guest information
✓ guest_photos - User-uploaded photos with moderation
✓ guest_sessions - Authentication for photo uploads
✓ simple_guests - Basic guest tracking
✓ activity_feed - Activity logging system
✓ gifts - Gift registry items
✓ payments - Payment transactions
✓ family_groups - Family grouping for RSVPs
✓ invitation_codes - Invitation code tracking
```

---

## Proposed Enhancement: Complete Guest Journey System

### Vision
Transform the wedding website from a static invitation into an interactive celebration platform where guests can:
1. Receive personalized invitations with unique codes
2. Explore the website with guided onboarding
3. Share messages, photos, and videos with other guests
4. Participate in real-time wedding day celebrations
5. Track their engagement progress with gamification

---

## Phase 1: Invitation & Onboarding System

### 1.1 Personalized Invitation Page (`/convite`)

#### Generic Version (`/convite`)
**Purpose**: Public landing page for guests without invite codes

**Features**:
- Beautiful hero section with wedding date, couple names, venue
- Event timeline (ceremony time, cocktail hour, reception)
- Venue details with embedded Google Maps
- Dress code and special instructions
- Interactive website guide showing all available features:
  - How to confirm RSVP
  - How to upload photos
  - How to view and buy gifts
  - How to post messages (new feature)
- Prominent CTAs for each action
- WhatsApp share button (Brazilian market)
- Elegant wedding aesthetic matching current design system

**Design Requirements**:
- Playfair Display headings
- Warm off-white (#F8F6F3) background
- Charcoal (#2C2C2C) text
- Generous white space (80-150px margins)
- Mobile-first responsive
- Framer Motion animations for delightful micro-interactions

**Technical Requirements**:
```typescript
// Route: /convite/page.tsx
export default async function InvitationPage() {
  const weddingDetails = await sanityFetch({ query: weddingDetailsQuery })

  return (
    <main>
      <InvitationHero />
      <EventTimeline />
      <VenueDetails />
      <DressCode />
      <WebsiteGuide /> {/* Interactive guide */}
      <QuickActions /> {/* CTAs for RSVP, Gallery, Gifts, Messages */}
    </main>
  )
}
```

#### Personalized Version (`/convite/[code]`)
**Purpose**: Unique invitation for each guest/family group

**Additional Features**:
- Personalized greeting: "Olá, [Guest Name]!"
- Custom message based on relationship type (family/friend/colleague)
- Pre-filled RSVP form (if not completed)
- Guest-specific details:
  - Plus one status (allowed or not)
  - Table assignment (post-seating arrangements)
  - Special accommodations
- Progress tracker showing completed actions:
  - ✓ RSVP confirmed
  - ✓ Gift selected
  - ✓ Photos uploaded
  - ✓ Messages posted
- Days until wedding countdown
- QR code for easy sharing with family members

**Technical Requirements**:
```typescript
// Route: /convite/[code]/page.tsx
export default async function PersonalizedInvitation({
  params,
}: {
  params: { code: string }
}) {
  // Validate invite code
  const invitation = await getInvitationByCode(params.code)

  if (!invitation) {
    redirect('/convite') // Fallback to generic
  }

  // Fetch guest progress
  const guestProgress = await getGuestProgress(invitation.guest_id)

  return (
    <main>
      <PersonalizedHero invitation={invitation} />
      <ProgressTracker progress={guestProgress} />
      <EventTimeline />
      <PersonalizedCTA invitation={invitation} />
    </main>
  )
}
```

### 1.2 Database Schema: Invitations Table

```sql
-- Create invitations table
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL, -- Unique invite code (e.g., "ABC123XYZ")
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  guest_phone TEXT,
  guest_whatsapp TEXT,

  -- Invitation details
  relationship_type TEXT CHECK (relationship_type IN ('family', 'friend', 'colleague', 'other')),
  plus_one_allowed BOOLEAN DEFAULT false,
  max_guests INT DEFAULT 1, -- For family groups
  custom_message TEXT, -- Personalized message for this guest

  -- Tracking
  invitation_sent_at TIMESTAMPTZ,
  invitation_opened_at TIMESTAMPTZ,
  times_opened INT DEFAULT 0,

  -- RSVP pre-fill
  pre_filled_data JSONB, -- Store any pre-filled form data

  -- QR code
  qr_code_url TEXT, -- Generated QR code image URL

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for fast code lookups
CREATE INDEX idx_invitations_code ON invitations(code);
CREATE INDEX idx_invitations_guest_id ON invitations(guest_id);

-- RLS Policies
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Public can read invitations by code (for viewing)
CREATE POLICY "Invitations are viewable by anyone with code"
  ON invitations FOR SELECT
  USING (true);

-- Only admins can insert/update/delete
CREATE POLICY "Only admins can manage invitations"
  ON invitations FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Function to track invitation opens
CREATE OR REPLACE FUNCTION track_invitation_open(invitation_code TEXT)
RETURNS void AS $$
BEGIN
  UPDATE invitations
  SET
    invitation_opened_at = COALESCE(invitation_opened_at, NOW()),
    times_opened = times_opened + 1,
    updated_at = NOW()
  WHERE code = invitation_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 1.3 Admin Integration: Invitation Management

**New Admin Page**: `/admin/convites`

**Features**:
1. **Invitation List**:
   - View all invitations with status (sent, opened, RSVP completed)
   - Filter by relationship type, status
   - Search by guest name, email, code
   - Sort by date created, last opened

2. **Generate Invite Codes**:
   - Bulk generate codes for multiple guests
   - Manual code generation with custom message
   - CSV import: `name,email,phone,relationship,plus_one`
   - Automatic QR code generation

3. **Analytics**:
   - Invitation open rate
   - Average time to RSVP after opening
   - Most opened invitations
   - Invitations not yet opened

4. **Email Campaign**:
   - Send invitations via SendGrid (with invite code link)
   - Schedule reminder emails for unopened invitations
   - Track email delivery status

**Component Structure**:
```typescript
// /admin/convites/page.tsx
export default async function InvitationManagementPage() {
  const invitations = await getAllInvitations()
  const stats = await getInvitationStats()

  return (
    <AdminLayout>
      <InvitationStats stats={stats} />
      <InvitationFilters />
      <InvitationTable invitations={invitations} />
      <GenerateInvitationModal />
      <BulkImportModal />
    </AdminLayout>
  )
}
```

### 1.4 Guest Onboarding Flow

**First Visit Tutorial** (Stored in local storage)

**Steps**:
1. Welcome modal: "Bem-vindo ao nosso casamento!"
2. Interactive guide highlighting 4 key sections:
   - RSVP (with arrow pointing to nav)
   - Gallery (with preview)
   - Gifts (with example item)
   - Messages (new feature teaser)
3. Guest dashboard tour showing progress tracker
4. Final step: "Ready to explore? Let's get started!"

**Technical Implementation**:
```typescript
// components/onboarding/FirstVisitGuide.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FirstVisitGuide() {
  const [isFirstVisit, setIsFirstVisit] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const hasVisited = localStorage.getItem('thousanddays_visited')
    if (!hasVisited) {
      setIsFirstVisit(true)
    }
  }, [])

  const completeGuide = () => {
    localStorage.setItem('thousanddays_visited', 'true')
    setIsFirstVisit(false)
  }

  if (!isFirstVisit) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50"
      >
        <GuideStep step={currentStep} onNext={() => setCurrentStep(c => c + 1)} />
      </motion.div>
    </AnimatePresence>
  )
}
```

---

## Phase 2: Guest Messaging & Social Feed

### 2.1 Guest Messaging System (`/mensagens` or `/mural`)

**Purpose**: Social feed where guests share messages, photos, and videos

**Features**:

1. **Post Composer**:
   - Rich text editor (bold, italic, line breaks)
   - Emoji picker integration
   - Multi-file upload (images + videos)
   - Preview before posting
   - Character limit: 500 characters
   - Photo/video limit: 5 files per post

2. **Post Feed**:
   - Infinite scroll pagination
   - Filter tabs:
     - All posts
     - Text only
     - Photos
     - Videos
   - Sort by:
     - Recent (default)
     - Most liked
     - Most commented

3. **Post Interactions**:
   - Like/reaction system (❤️ Heart, 👏 Clap, 😂 Laugh, 🎉 Celebrate)
   - Comment threads (nested replies)
   - Share post to WhatsApp

4. **Moderation**:
   - All posts start as "pending"
   - Admin approval required before visibility
   - Rejected posts show reason to guest

**Design**:
- Card-based layout with guest avatar
- Guest name + upload timestamp
- Media carousel for multiple images/videos
- Reaction bar at bottom
- Comment section expandable

**Technical Requirements**:
```typescript
// Route: /mensagens/page.tsx
export default async function MessagesPage() {
  const [filter, setFilter] = useState<'all' | 'text' | 'photos' | 'videos'>('all')
  const posts = await getApprovedPosts(filter)

  return (
    <main>
      <MessagesHero />
      <PostComposer />
      <PostFilters filter={filter} onFilterChange={setFilter} />
      <PostFeed posts={posts} />
    </main>
  )
}
```

### 2.2 Database Schema: Guest Posts System

```sql
-- Guest posts table
CREATE TABLE guest_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_session_id UUID REFERENCES guest_sessions(id),
  guest_name TEXT NOT NULL,
  guest_email TEXT,

  -- Content
  content TEXT NOT NULL CHECK (length(content) <= 500),
  post_type TEXT NOT NULL CHECK (post_type IN ('text', 'image', 'video', 'mixed')),

  -- Media
  media_urls TEXT[], -- Array of Supabase storage URLs
  media_metadata JSONB, -- File sizes, dimensions, etc.

  -- Moderation
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  moderation_reason TEXT,
  moderated_at TIMESTAMPTZ,
  moderated_by TEXT,

  -- Engagement
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Soft delete
  is_deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMPTZ
);

-- Post reactions table
CREATE TABLE post_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES guest_posts(id) ON DELETE CASCADE,
  guest_session_id UUID REFERENCES guest_sessions(id),
  guest_name TEXT NOT NULL,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('heart', 'clap', 'laugh', 'celebrate')),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate reactions
  UNIQUE(post_id, guest_session_id)
);

-- Post comments table
CREATE TABLE post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES guest_posts(id) ON DELETE CASCADE,
  guest_session_id UUID REFERENCES guest_sessions(id),
  guest_name TEXT NOT NULL,
  content TEXT NOT NULL CHECK (length(content) <= 300),

  -- Nested replies support
  parent_comment_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Soft delete
  is_deleted BOOLEAN DEFAULT false
);

-- Indexes for performance
CREATE INDEX idx_guest_posts_status ON guest_posts(status, created_at DESC);
CREATE INDEX idx_guest_posts_guest_session ON guest_posts(guest_session_id);
CREATE INDEX idx_post_reactions_post_id ON post_reactions(post_id);
CREATE INDEX idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX idx_post_comments_parent ON post_comments(parent_comment_id);

-- RLS Policies
ALTER TABLE guest_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved posts
CREATE POLICY "Approved posts are publicly visible"
  ON guest_posts FOR SELECT
  USING (status = 'approved' AND is_deleted = false);

-- Guests can create posts
CREATE POLICY "Guests can create posts"
  ON guest_posts FOR INSERT
  WITH CHECK (guest_session_id IS NOT NULL);

-- Guests can view their own pending posts
CREATE POLICY "Guests can view their own posts"
  ON guest_posts FOR SELECT
  USING (guest_session_id = (SELECT id FROM guest_sessions WHERE id = auth.jwt() ->> 'session_id'));

-- Function to increment likes count
CREATE OR REPLACE FUNCTION increment_post_likes(post_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE guest_posts
  SET likes_count = likes_count + 1
  WHERE id = post_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment comments count
CREATE OR REPLACE FUNCTION increment_post_comments(post_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE guest_posts
  SET comments_count = comments_count + 1
  WHERE id = post_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 2.3 Admin Moderation: `/admin/posts`

**Similar to Photo Moderation System**

**Features**:
1. **Post Queue**:
   - View all pending posts
   - Preview post content, media, guest name
   - See post metadata (timestamp, guest session)

2. **Moderation Actions**:
   - Approve (keyboard shortcut: A)
   - Reject with reason (keyboard shortcut: R)
   - Batch approve selected
   - Batch reject selected

3. **Filters**:
   - Status: pending/approved/rejected
   - Post type: text/image/video/mixed
   - Date range
   - Guest search

4. **Activity Feed Integration**:
   - On approval: Add activity "Guest [name] posted a message"
   - On rejection: Log reason for records

**Component Structure**:
```typescript
// /admin/posts/page.tsx
export default async function PostModerationPage() {
  const pendingPosts = await getPendingPosts()

  return (
    <AdminLayout>
      <ModerationStats />
      <PostFilters />
      <PostModerationGrid posts={pendingPosts} />
    </AdminLayout>
  )
}

// components/admin/PostModerationCard.tsx
interface PostModerationCardProps {
  post: GuestPost
  onApprove: (postId: string) => void
  onReject: (postId: string, reason: string) => void
}

export function PostModerationCard({ post, onApprove, onReject }: PostModerationCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <PostPreview post={post} />
      <ModerationActions postId={post.id} onApprove={onApprove} onReject={onReject} />
    </div>
  )
}
```

### 2.4 Post Composer Component

```typescript
// components/messages/PostComposer.tsx
'use client'

import { useState } from 'react'
import { EmojiPicker } from '@/components/ui/EmojiPicker'
import { MediaUpload } from '@/components/ui/MediaUpload'

export function PostComposer() {
  const [content, setContent] = useState('')
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Upload media files to Supabase Storage
    const mediaUrls = await uploadMediaFiles(mediaFiles)

    // Create post
    await createGuestPost({
      content,
      media_urls: mediaUrls,
      post_type: determinePostType(content, mediaUrls),
    })

    // Reset form
    setContent('')
    setMediaFiles([])
    setIsSubmitting(false)

    // Show success message
    toast.success('Mensagem enviada! Aguardando aprovação.')
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Compartilhe suas mensagens, desejos e memórias..."
        maxLength={500}
        className="w-full min-h-32 p-4 border rounded-lg"
      />

      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-2">
          <EmojiPicker onSelect={(emoji) => setContent(c => c + emoji)} />
          <MediaUpload
            maxFiles={5}
            accept="image/*,video/*"
            onChange={setMediaFiles}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!content.trim() || isSubmitting}
          className="btn-primary"
        >
          {isSubmitting ? 'Enviando...' : 'Publicar'}
        </button>
      </div>

      <p className="text-sm text-gray-500 mt-2">
        {content.length}/500 caracteres • {mediaFiles.length}/5 arquivos
      </p>
    </div>
  )
}
```

---

## Phase 3: Wedding Day Live Feed

### 3.1 Live Feed Page (`/ao-vivo` or `/dia-do-casamento`)

**Purpose**: Real-time celebration dashboard for wedding day

**Features**:

1. **Live Post Stream**:
   - Real-time Supabase subscription to new posts
   - Auto-refresh every 30 seconds (fallback)
   - Filter by wedding day date only
   - Show timestamp: "Posted 5 minutes ago"

2. **Live Photo Gallery**:
   - Real-time photo uploads from guests
   - Masonry grid layout
   - Click to view in lightbox

3. **Confirmed Guests Grid**:
   - Display all guests who confirmed RSVP
   - Avatar grid with names
   - "Present at ceremony" badge (manual admin toggle)

4. **Special Moments**:
   - Admin-pinned posts highlighted at top
   - Examples: "First dance", "Cake cutting", "Speeches"
   - Full-width cards with special styling

5. **Celebration Stats**:
   - Total posts today
   - Total photos uploaded today
   - Total guests checked in
   - Live counter animation

**Design**:
- Full-width hero: "Estamos casando! 🎉"
- Live indicator dot (pulsing green)
- Three columns (desktop): Posts | Photos | Guests
- Mobile: Stacked with tabs
- Dark mode option for evening reception

**Technical Requirements**:
```typescript
// Route: /ao-vivo/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { RealtimeChannel } from '@supabase/supabase-js'

export default function LiveFeedPage() {
  const [posts, setPosts] = useState<GuestPost[]>([])
  const [photos, setPhotos] = useState<GuestPhoto[]>([])
  const [stats, setStats] = useState<LiveStats>()
  const supabase = createBrowserClient()

  useEffect(() => {
    // Subscribe to new posts
    const postsChannel: RealtimeChannel = supabase
      .channel('live-posts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'guest_posts',
          filter: `status=eq.approved`,
        },
        (payload) => {
          setPosts((current) => [payload.new as GuestPost, ...current])
        }
      )
      .subscribe()

    // Subscribe to new photos
    const photosChannel: RealtimeChannel = supabase
      .channel('live-photos')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'guest_photos',
          filter: `moderation_status=eq.approved`,
        },
        (payload) => {
          setPhotos((current) => [payload.new as GuestPhoto, ...current])
        }
      )
      .subscribe()

    return () => {
      postsChannel.unsubscribe()
      photosChannel.unsubscribe()
    }
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-blush-50 to-burgundy-50">
      <LiveFeedHero />
      <CelebrationStats stats={stats} />
      <SpecialMoments />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        <LivePostStream posts={posts} />
        <LivePhotoGallery photos={photos} />
        <ConfirmedGuestsGrid />
      </div>
    </main>
  )
}
```

### 3.2 Admin Controls for Live Feed

**New Feature in `/admin/posts`**:

1. **Pin/Unpin Posts**:
   - Mark post as "Special Moment"
   - Add category: first_dance, cake_cutting, speeches, arrival, etc.
   - Pinned posts appear at top of live feed

2. **Quick Moderation**:
   - Mobile-optimized admin panel
   - Quick approve/reject buttons
   - Push notifications for new posts (optional)

**Database Schema Addition**:
```sql
-- Add pinned_posts table for special moments
CREATE TABLE pinned_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES guest_posts(id) ON DELETE CASCADE,
  moment_category TEXT NOT NULL CHECK (moment_category IN (
    'arrival',
    'ceremony',
    'first_dance',
    'cake_cutting',
    'speeches',
    'bouquet_toss',
    'departure',
    'other'
  )),
  pinned_by TEXT NOT NULL,
  pinned_at TIMESTAMPTZ DEFAULT NOW(),
  display_order INT DEFAULT 0,

  UNIQUE(post_id)
);

CREATE INDEX idx_pinned_posts_order ON pinned_posts(display_order);
```

---

## Phase 4: Guest Dashboard & Enhanced Navigation

### 4.1 Guest Dashboard (`/meu-convite` or `/painel-convidado`)

**Purpose**: Personalized hub for each guest

**Features**:

1. **Personalized Welcome**:
   - "Olá, [Guest Name]!"
   - Days until wedding countdown
   - Personalized message (from invitation)

2. **Completion Checklist**:
   - ✓ RSVP confirmed (with edit button)
   - ✓ Gift selected (show selected gift)
   - ✓ Photos uploaded (count)
   - ✓ Messages posted (count)
   - Progress bar: "3/4 completed"

3. **Quick Actions**:
   - Button: "Confirmar Presença" (if not done)
   - Button: "Ver Lista de Presentes"
   - Button: "Fazer Upload de Fotos"
   - Button: "Postar Mensagem"

4. **Event Countdown**:
   - Large timer: Days, Hours, Minutes until wedding
   - "Add to Calendar" button (iCal download)

5. **Recent Activity**:
   - Your recent posts
   - Your recent photo uploads
   - Gifts you've purchased

6. **Invite Code Info**:
   - Display your invite code
   - QR code for sharing
   - WhatsApp share button

**Technical Requirements**:
```typescript
// Route: /meu-convite/page.tsx or /painel-convidado/page.tsx
export default async function GuestDashboardPage() {
  // Get guest from session or invite code
  const session = await getGuestSession()

  if (!session) {
    redirect('/dia-1000/login?redirect=/meu-convite')
  }

  const guest = await getGuestById(session.guest_id)
  const progress = await getGuestProgress(session.guest_id)
  const invitation = await getInvitationByGuestId(session.guest_id)

  return (
    <main>
      <DashboardHero guest={guest} />
      <CompletionChecklist progress={progress} />
      <EventCountdown />
      <QuickActions guest={guest} />
      <RecentActivity guestId={session.guest_id} />
      <InviteCodeCard invitation={invitation} />
    </main>
  )
}
```

### 4.2 Enhanced Navigation

**Current Navigation**: Simple top nav with links

**Enhanced Navigation Features**:

1. **Desktop Navigation**:
   - Add "Meu Convite" link (if logged in)
   - Add "Mensagens" link
   - Add "Ao Vivo" link (visible on wedding day only)
   - Progress indicator icon showing completion status

2. **Mobile Navigation**:
   - Bottom navigation bar (sticky)
   - Icons: Home, RSVP, Gallery, Gifts, Messages, Profile
   - Badge with progress percentage

3. **Floating Quick Actions** (Mobile):
   - FAB (Floating Action Button) in bottom-right
   - Options:
     - Upload photo
     - Post message
     - Share invitation
     - View progress

**Component Structure**:
```typescript
// components/ui/EnhancedNavigation.tsx
'use client'

export function EnhancedNavigation({ guestProgress }: { guestProgress?: GuestProgress }) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <>
        <MobileBottomNav progress={guestProgress} />
        <FloatingActionButton />
      </>
    )
  }

  return <DesktopNav progress={guestProgress} />
}

// components/ui/MobileBottomNav.tsx
export function MobileBottomNav({ progress }: { progress?: GuestProgress }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-50">
      <div className="flex justify-around py-2">
        <NavItem href="/" icon={Home} label="Início" />
        <NavItem href="/rsvp" icon={Calendar} label="RSVP" />
        <NavItem href="/galeria" icon={Image} label="Galeria" />
        <NavItem href="/mensagens" icon={MessageCircle} label="Mensagens" />
        <NavItem href="/meu-convite" icon={User} label="Perfil" badge={progress?.percentage} />
      </div>
    </nav>
  )
}
```

### 4.3 Onboarding Tooltips

**Context-Aware Hints**:
- First time visiting RSVP page: "Fill out this form to confirm your attendance"
- First time uploading photo: "You can upload up to 10 photos at once"
- First time posting message: "Your message will be reviewed before appearing publicly"

**Implementation**:
```typescript
// components/ui/OnboardingTooltip.tsx
'use client'

export function OnboardingTooltip({
  feature,
  children,
}: {
  feature: string
  children: React.ReactNode
}) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem(`tooltip_${feature}`)
    if (!seen) {
      setShow(true)
    }
  }, [feature])

  const dismiss = () => {
    localStorage.setItem(`tooltip_${feature}`, 'true')
    setShow(false)
  }

  if (!show) return <>{children}</>

  return (
    <TooltipProvider>
      <Tooltip open={show}>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent>
          {getTooltipContent(feature)}
          <button onClick={dismiss}>Got it!</button>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
```

---

## Implementation Timeline

### Week 1: Foundation & Invitations (Phase 1)
**Days 1-2**: Database setup
- Create invitations table migration
- Create guest_posts, post_reactions, post_comments tables
- Create pinned_posts table
- Run migrations and test locally

**Days 3-5**: /convite page
- Build generic invitation page
- Build personalized invitation page with code validation
- Create progress tracker component
- Add WhatsApp share functionality

**Days 6-7**: Admin invitation management
- Build /admin/convites page
- Implement invite code generation
- Bulk CSV import
- QR code generation
- Basic analytics

### Week 2: Social Features (Phase 2)
**Days 1-3**: Guest messaging system
- Build PostComposer component with emoji picker
- Implement multi-file upload to Supabase Storage
- Create /mensagens page with post feed
- Add infinite scroll pagination

**Days 4-5**: Post interactions
- Implement like/reaction system
- Add comment threads
- WhatsApp share buttons

**Days 6-7**: Admin moderation
- Build /admin/posts moderation page
- Keyboard shortcuts for approval/rejection
- Batch operations
- Activity feed integration

### Week 3: Live Experience (Phase 3)
**Days 1-3**: Real-time infrastructure
- Set up Supabase real-time subscriptions
- Build /ao-vivo page structure
- Implement LivePostStream component
- Implement LivePhotoGallery component

**Days 4-5**: Special moments & stats
- Build SpecialMoments section
- Create CelebrationStats component
- Implement ConfirmedGuestsGrid
- Add admin pin/unpin functionality

**Days 6-7**: Mobile optimization
- Optimize live feed for mobile devices
- Add dark mode for evening reception
- Test real-time performance
- Add fallback auto-refresh

### Week 4: Polish & Launch (Phase 4)
**Days 1-2**: Guest dashboard
- Build /meu-convite page
- Create CompletionChecklist component
- Implement EventCountdown
- Add recent activity feed

**Days 3-4**: Enhanced navigation
- Build MobileBottomNav component
- Create FloatingActionButton
- Add progress indicators
- Implement onboarding tooltips

**Days 5-6**: Testing & refinement
- Comprehensive testing with real guest scenarios
- Mobile device testing (iOS Safari, Android Chrome)
- Performance optimization (image lazy loading, code splitting)
- Accessibility audit

**Day 7**: Launch preparation
- Final QA testing
- Deploy to production
- Send test invitations
- Monitor analytics

---

## Design System Guidelines

### Color Palette
```css
/* Existing colors */
--background: #F8F6F3; /* Warm off-white */
--text-primary: #2C2C2C; /* Charcoal black */
--text-secondary: #4A4A4A; /* Medium gray */
--decorative: #A8A8A8; /* Silver-gray */
--accent: #E8E6E3; /* Subtle warm gray */

/* New colors for interactive features */
--blush-50: #FFF5F5;
--blush-100: #FFE5E5;
--blush-600: #D97E8B;
--burgundy-50: #FAF5F5;
--burgundy-800: #5C2E2E;
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;
```

### Typography
- **Primary**: Playfair Display (headings, names, important text)
- **Body**: Crimson Text (body text, italic for emphasis)
- **Special**: Cormorant (monogram, decorative elements)

### Component Patterns

**Card Pattern**:
```tsx
<div className="bg-white rounded-lg shadow-md p-6 border border-accent">
  {/* Content */}
</div>
```

**Button Pattern**:
```tsx
<button className="px-6 py-3 bg-burgundy-800 text-white rounded-full hover:bg-burgundy-700 transition-colors font-playfair">
  {/* Label */}
</button>
```

**Input Pattern**:
```tsx
<input className="w-full px-4 py-3 border border-accent rounded-lg focus:ring-2 focus:ring-burgundy-800 focus:border-transparent" />
```

### Animation Guidelines
- Use Framer Motion for all animations
- Entrance animations: `initial={{ opacity: 0, y: 20 }}` → `animate={{ opacity: 1, y: 0 }}`
- Hover animations: `whileHover={{ scale: 1.02, y: -2 }}`
- Stagger children: `staggerChildren: 0.1`
- Always support `useReducedMotion` for accessibility

---

## Success Metrics & KPIs

### Engagement Metrics
1. **Invitation Engagement**:
   - Invitation open rate: Target 85%+
   - Time to RSVP after opening: Target < 48 hours
   - Personalized vs generic view ratio

2. **Social Features**:
   - % of guests who post messages: Target 40%+
   - Average posts per guest: Target 2+
   - Photo upload rate: Target 60%+ of guests
   - Post moderation approval rate: Target 95%+

3. **Wedding Day Live Feed**:
   - Concurrent users during ceremony: Target 70%+ of guests
   - Posts per hour during reception: Target 20+
   - Photos uploaded during wedding day: Target 100+

4. **Guest Dashboard**:
   - % of guests who complete all 4 actions: Target 50%+
   - Average completion time: Track days from invitation to full completion
   - Return visit rate: Track multiple logins

### Technical Metrics
1. **Performance**:
   - Page load time: < 2 seconds
   - Time to Interactive (TTI): < 3 seconds
   - Lighthouse score: 90+ for all pages

2. **Reliability**:
   - Uptime: 99.9%
   - Real-time subscription success rate: 99%+
   - Image upload success rate: 95%+

3. **Mobile Usage**:
   - Mobile vs desktop traffic ratio
   - Mobile conversion rate (RSVP completion)
   - Mobile engagement (posts, photos)

---

## Testing Strategy

### Unit Testing
- Test all database functions
- Test post type determination logic
- Test invite code validation
- Test progress calculation

### Integration Testing
- Test RSVP → progress update flow
- Test photo upload → moderation → gallery flow
- Test post creation → moderation → feed flow
- Test real-time subscription behavior

### End-to-End Testing (Playwright)
```typescript
// e2e/guest-journey.spec.ts
test('Complete guest journey', async ({ page }) => {
  // 1. Visit personalized invitation
  await page.goto('/convite/ABC123XYZ')
  await expect(page.locator('h1')).toContainText('Olá')

  // 2. Complete RSVP
  await page.click('text=Confirmar Presença')
  await page.fill('[name="dietary_restrictions"]', 'None')
  await page.click('button[type="submit"]')
  await expect(page.locator('.success-message')).toBeVisible()

  // 3. Upload photo
  await page.goto('/dia-1000/upload')
  await page.setInputFiles('input[type="file"]', 'test-photo.jpg')
  await page.click('text=Enviar Fotos')
  await expect(page.locator('.upload-success')).toBeVisible()

  // 4. Post message
  await page.goto('/mensagens')
  await page.fill('textarea', 'Congratulations!')
  await page.click('text=Publicar')
  await expect(page.locator('.pending-message')).toBeVisible()

  // 5. Check dashboard progress
  await page.goto('/meu-convite')
  await expect(page.locator('.progress-bar')).toContainText('75%')
})
```

### Accessibility Testing
- Screen reader compatibility (NVDA, VoiceOver)
- Keyboard navigation (tab order, focus states)
- Color contrast (WCAG AA minimum)
- Reduced motion support
- ARIA labels on all interactive elements

### Performance Testing
- Lighthouse CI in GitHub Actions
- Bundle size monitoring
- Image optimization verification
- Real-time subscription load testing

---

## Security Considerations

### Authentication & Authorization
1. **Guest Sessions**:
   - Secure session cookies (httpOnly, secure, sameSite)
   - Session expiration: 30 days
   - Optional: Rate limiting on login attempts

2. **Admin Access**:
   - Strong password requirements
   - Session timeout: 4 hours
   - Admin actions logged in activity_feed

3. **Invite Codes**:
   - Cryptographically random codes (12 characters)
   - Rate limiting on code validation (prevent brute force)
   - Track invalid attempts

### Content Moderation
1. **Post Content**:
   - Character limits enforced server-side
   - Profanity filter (optional, Brazilian Portuguese)
   - Duplicate detection

2. **File Uploads**:
   - MIME type validation
   - File size limits (10MB per file)
   - Malware scanning (optional: ClamAV integration)
   - Storage quotas per guest

### Data Privacy
1. **LGPD Compliance** (Brazilian GDPR):
   - Clear privacy policy
   - Guest data access requests
   - Guest data deletion requests
   - Consent tracking

2. **Sensitive Data**:
   - No storage of CPF/SSN
   - Email encryption in transit (TLS)
   - Secure Supabase RLS policies

---

## Rollout Strategy

### Phase 1 Launch (Invitations)
**Audience**: Close family (10-15 guests)
**Goals**:
- Test personalized invitation flow
- Gather feedback on design and UX
- Identify any technical issues
- Refine onboarding experience

**Launch Checklist**:
- [ ] All database migrations applied
- [ ] /convite page tested on mobile and desktop
- [ ] Invite codes generated for test group
- [ ] SendGrid templates configured
- [ ] Analytics tracking verified
- [ ] Send test invitations via email
- [ ] Monitor open rates and engagement

### Phase 2 Launch (Social Features)
**Audience**: Extended family and close friends (50-75 guests)
**Goals**:
- Test post moderation workflow
- Evaluate admin workload
- Gather content moderation feedback
- Test engagement features

**Launch Checklist**:
- [ ] /mensagens page tested end-to-end
- [ ] Admin moderation page tested
- [ ] Post notification system working
- [ ] Reaction and comment system tested
- [ ] Send second wave of invitations
- [ ] Monitor post volume and quality

### Phase 3 Launch (Live Feed)
**Audience**: All remaining guests (100+ total)
**Goals**:
- Prepare for wedding day
- Test real-time infrastructure
- Train admin on live moderation

**Launch Checklist**:
- [ ] /ao-vivo page tested with mock data
- [ ] Real-time subscriptions tested under load
- [ ] Mobile admin panel tested
- [ ] Dark mode tested
- [ ] Send final invitation wave
- [ ] Schedule dry run test

### Wedding Day Launch
**Audience**: All guests (live at venue)
**Goals**:
- Capture real-time moments
- Moderate content during event
- Ensure smooth performance

**Launch Checklist**:
- [ ] Server performance monitored
- [ ] Admin mobile device charged and ready
- [ ] Backup internet connection available
- [ ] Guest WiFi tested
- [ ] Emergency contacts ready

---

## Post-Launch Maintenance

### Daily Tasks (Wedding Week)
- Monitor post moderation queue (check every 2-3 hours)
- Approve/reject guest posts
- Pin special moments to live feed
- Respond to guest support questions

### Weekly Tasks (Post-Wedding)
- Review analytics and engagement metrics
- Export all guest posts and photos for couple's archive
- Send thank you emails to active participants
- Generate final report with stats

### Data Archival
1. **3 Months Post-Wedding**:
   - Archive all guest posts and photos
   - Generate PDF memory book
   - Export all data for couple's records
   - Optionally: Create video montage of posts/photos

2. **6 Months Post-Wedding**:
   - Sunset live feed page (read-only archive)
   - Keep invitation and gallery pages active
   - Remove real-time subscriptions

3. **1 Year Post-Wedding**:
   - Full site archive as static HTML
   - Download all media files
   - Optionally: Keep domain active with anniversary message

---

## Technical Debt & Future Improvements

### Known Limitations
1. **Real-time Scaling**: Supabase real-time has connection limits (200 concurrent). If expecting 200+ simultaneous users, consider upgrading plan or using polling fallback.

2. **Image Optimization**: Currently using Next.js Image for Sanity CMS, but guest uploads use Supabase Storage without automatic optimization. Consider adding image processing pipeline (Sharp, Cloudinary, or Imgix).

3. **Search Functionality**: No full-text search on posts/photos currently. Consider adding Algolia or Postgres full-text search for better discoverability.

4. **Push Notifications**: No push notification system for new posts. Consider adding web push (OneSignal, Firebase Cloud Messaging) for admin alerts.

### Future Enhancements
1. **AI Content Moderation**: Integrate OpenAI Moderation API for automatic profanity/NSFW detection.

2. **Video Processing**: Add video transcoding for compressed uploads (currently storing full-size videos).

3. **Multilingual Support**: Add English translations for international guests (currently Portuguese only).

4. **Post-Wedding Memory Book**: Automated generation of PDF memory book with all posts and photos.

5. **Anniversary Reminders**: Automated email system for 1-year, 2-year anniversaries with memory recap.

---

## Resources & References

### Documentation
- **Next.js 15**: https://nextjs.org/docs
- **Supabase**: https://supabase.com/docs
- **Sanity CMS**: https://www.sanity.io/docs
- **Framer Motion**: https://www.framer.com/motion/
- **Tailwind CSS**: https://tailwindcss.com/docs

### Code Examples
- **Supabase Real-time**: https://supabase.com/docs/guides/realtime
- **Next.js Server Actions**: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions
- **Framer Motion Animations**: https://www.framer.com/motion/animation/

### Tools
- **QR Code Generation**: https://github.com/soldair/node-qrcode
- **Emoji Picker**: https://github.com/missive/emoji-mart
- **Rich Text Editor**: https://tiptap.dev/
- **Image Upload**: https://github.com/transloadit/uppy

---

## Quick Start Command

When you're ready to start implementation, use this prompt:

```
I want to implement Phase 1 of the Guest Experience Enhancement Roadmap for my wedding website. Please start by:

1. Creating the database migrations for the invitations, guest_posts, post_reactions, and post_comments tables
2. Building the /convite page (generic version) with all sections: hero, timeline, venue details, dress code, website guide, and quick action CTAs
3. Implementing the personalized invitation route /convite/[code] with code validation and progress tracking
4. Setting up the basic admin page at /admin/convites for invitation management

Use the existing design system (Playfair Display headings, warm off-white background #F8F6F3, charcoal text #2C2C2C) and follow the mobile-first responsive design principles. Reuse existing components where possible (Navigation, Supabase client utilities, MediaUpload).

Please start with the database migration file and let me review it before proceeding with the frontend components.
```

---

**Document Version**: 1.0
**Last Updated**: October 13, 2025
**Author**: Claude Code for Hel Rabelo
**Project**: Thousand Days of Love - Wedding Website
