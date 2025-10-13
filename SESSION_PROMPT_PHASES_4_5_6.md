# Guest Experience Enhancement - Complete Phases 4, 5, 6 Implementation

## Project Context
**Location**: `/Users/helrabelo/code/personal/thousanddaysoflove`
**Wedding Date**: November 20, 2025 (1000 days together!)
**Status**: Phase 3 Complete (Messaging System), Phase 4 Foundation Complete

## Current State Summary

### ✅ Phase 3 Complete (Messaging System)
- Guest posts with moderation (`/mensagens`)
- Admin moderation dashboard (`/admin/posts`)
- Reaction system (heart, clap, laugh, celebrate, love)
- Comment threads with 3-level nesting
- Post composer with emoji picker and file upload
- Service layer: `src/lib/supabase/messages.ts` (625 lines, 26 functions)
- Total: 2,349 lines of production-ready code

### 🚧 Phase 4 Foundation Complete (Admin Invitation Management)
**Service Layer** (`src/lib/supabase/invitations.ts`): ✅ COMPLETE (395 lines)
- `getAllInvitations()` - Fetch with filters, search, sorting
- `createInvitation()` - Create new invitations
- `updateInvitation()` - Update invitations
- `deleteInvitation()` - Delete invitations
- `generateUniqueCode()` - Auto-generate unique codes (FAMILY001, FRIEND042, etc.)
- `bulkCreateInvitations()` - Create multiple at once
- `exportInvitationsToCSV()` - Export to CSV
- `getInvitationAnalytics()` - Comprehensive analytics

**Admin Page** (`src/app/admin/convites/page.tsx`): ✅ FOUNDATION COMPLETE (600+ lines)
- Analytics dashboard with 4 stat cards
- Data table with search/filter/sort
- Progress bars showing completion percentage
- Actions: view, edit, copy link, generate QR code, delete
- CSV export functionality

**What's Missing** (Phase 4 Polish):
- [ ] Create invitation modal form
- [ ] Edit invitation modal form
- [ ] Detail view modal
- [ ] Form validation and error handling
- [ ] Success/error toast notifications
- [ ] Test with existing sample data

### ⏳ Phase 5 Not Started (Live Wedding Day Feed)
Features to build at `/ao-vivo`:
- Real-time post stream with Supabase subscriptions
- Pinned special moments section
- Live photo gallery with slideshow
- Confirmed guests grid with avatars
- Live celebration statistics
- Mobile admin controls for wedding day

### ⏳ Phase 6 Not Started (Guest Dashboard)
Features to build at `/meu-convite`:
- Progress tracker with completion checklist
- Event countdown timer (days/hours/minutes/seconds)
- Quick action buttons (RSVP, gifts, photos, messages)
- Recent activity feed
- Invitation details card with QR code
- Guest authentication with invitation codes

---

## Implementation Plan

### PHASE 4: Complete Admin Invitation Management (2-3 hours)

#### Task 4.1: Create Invitation Modal Form ✨
**File**: Add to `src/app/admin/convites/page.tsx`

**Features**:
- Form fields:
  - Guest name (required)
  - Guest email
  - Guest phone
  - Relationship type dropdown (family/friend/colleague/other)
  - Plus one allowed checkbox
  - Plus one name (if allowed)
  - Custom message textarea
  - Table number
  - Dietary restrictions textarea
- Auto-generate unique code based on relationship type
- Preview invitation link before creating
- Form validation with helpful error messages
- Success toast on creation
- Automatically refresh table after creation

**Implementation**:
```typescript
// Modal structure
<AnimatePresence>
  {showCreateModal && (
    <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Form with all fields */}
        {/* Preview section showing generated code */}
        {/* Save/Cancel buttons */}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
```

#### Task 4.2: Edit Invitation Modal Form ✨
**File**: Add to `src/app/admin/convites/page.tsx`

**Features**:
- Pre-populate form with existing invitation data
- Same fields as create modal
- Allow changing code (with uniqueness check)
- Show last updated timestamp
- Confirmation before saving changes
- Success toast on update

#### Task 4.3: Detail View Modal 📋
**File**: Add to `src/app/admin/convites/page.tsx`

**Features**:
- Display all invitation details in organized sections:
  - Guest Information (name, email, phone, relationship)
  - Invitation Details (code, custom message, table number)
  - Plus One Information (if applicable)
  - Dietary Restrictions
  - Tracking Stats (opened_at, open_count, created_at, updated_at)
  - Progress Indicators (RSVP, Gift, Photos with checkmarks)
- QR Code preview (generate on-demand)
- Copy invitation link button
- Quick actions: Edit, Send Reminder Email, Delete
- Open invitation in new tab button
- Recent activity timeline (when opened, when RSVP completed, etc.)

#### Task 4.4: Testing and Polish ✅
- Test create invitation with all relationship types
- Test edit invitation with various scenarios
- Test delete with confirmation
- Test search with partial matches
- Test filters (opened, RSVP, gifts, photos)
- Test CSV export with filtered data
- Test QR code generation
- Test copy invitation link
- Verify analytics calculations
- Test on mobile devices
- Add loading states for all async operations
- Add error boundaries for graceful error handling

**Success Criteria**:
- ✅ Create/edit/delete invitations working smoothly
- ✅ All modals have proper animations and UX
- ✅ Form validation prevents invalid data
- ✅ Analytics update in real-time
- ✅ Mobile-optimized interface
- ✅ No console errors or warnings

---

### PHASE 5: Live Wedding Day Feed (3-4 hours)

#### Task 5.1: Real-Time Service Layer 🔴
**File**: Create `src/lib/supabase/live.ts`

**Functions to implement**:
```typescript
// Real-time subscriptions
export function subscribeToNewPosts(callback: (post: GuestPost) => void)
export function subscribeToReactions(callback: (reaction: PostReaction) => void)
export function subscribeToComments(callback: (comment: PostComment) => void)

// Pinned posts management
export async function getPinnedPostsWithDetails()
export async function updatePinnedPostOrder(postId: string, newOrder: number)

// Live statistics
export async function getLiveCelebrationStats()
export async function getRecentActivity(limit: number)

// Confirmed guests
export async function getConfirmedGuests()

// Recent photos for gallery
export async function getRecentApprovedPhotos(limit: number)
```

**Supabase Real-Time Setup**:
```typescript
const supabase = createClient()
const channel = supabase
  .channel('live-wedding-feed')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'guest_posts', filter: 'status=eq.approved' },
    (payload) => {
      // Handle new approved post
      callback(payload.new as GuestPost)
    }
  )
  .subscribe()

// Return cleanup function
return () => {
  channel.unsubscribe()
}
```

#### Task 5.2: Live Post Stream Component 📺
**File**: Create `src/components/live/LivePostStream.tsx`

**Features**:
- Subscribe to real-time post insertions
- Smooth animations for new posts appearing
- Display posts in reverse chronological order
- Auto-scroll to top when new post arrives (with option to disable)
- Fallback to polling every 30 seconds if WebSocket fails
- Show "New post available" banner if user scrolled away
- Display post content, author, media, reactions count
- Click to expand post details

#### Task 5.3: Pinned Moments Section 📌
**File**: Create `src/components/live/PinnedMomentsSection.tsx`

**Features**:
- Display admin-pinned special moments at the top
- Larger cards with special styling (gradient borders, shimmer effect)
- Show pinned badge with icon
- Reorder functionality (drag & drop or up/down arrows)
- Admin-only controls to pin/unpin posts
- Maximum 5 pinned posts at a time
- Smooth reordering animations

#### Task 5.4: Live Photo Gallery 📸
**File**: Create `src/components/live/LivePhotoGallery.tsx`

**Features**:
- Display recently approved guest photos
- Slideshow mode with auto-advance (5 seconds per photo)
- Manual navigation (prev/next arrows)
- Full-screen photo viewer on click
- Guest attribution (name and timestamp)
- Smooth transitions between photos
- Pause slideshow on hover

#### Task 5.5: Confirmed Guests Grid 👥
**File**: Create `src/components/live/GuestsGrid.tsx`

**Features**:
- Avatar grid of confirmed guests (from invitations where rsvp_completed = true)
- Show first letter of name in colored circle if no avatar
- Tooltip on hover showing full name
- "Who's here" counter at the top
- Filter by relationship type (family/friends/colleagues)
- Animated entrance for each avatar
- Responsive grid (adjusts to screen size)

#### Task 5.6: Live Statistics Dashboard 📊
**File**: Create `src/components/live/LiveStats.tsx`

**Features**:
- Real-time counters (animated number transitions):
  - Total posts today
  - Photos uploaded today
  - Guests checked in (RSVP confirmed)
  - Total reactions given
  - Comments posted today
- Live activity feed showing last 10 actions:
  - "João posted a message"
  - "Maria reacted with ❤️"
  - "Pedro uploaded 3 photos"
  - "Ana commented on a post"
- Refresh every 30 seconds automatically
- Beautiful gradient cards with icons

#### Task 5.7: Live Feed Page 🎉
**File**: Create `src/app/ao-vivo/page.tsx`

**Layout**:
```
┌─────────────────────────────────────────────┐
│  🎊 Celebração Ao Vivo - Casamento Hel & Ylana  │
├─────────────────────────────────────────────┤
│  📊 Live Statistics (4 stat cards)          │
├─────────────────────────────────────────────┤
│  📌 Pinned Special Moments (if any)         │
├─────────────────────────────────────────────┤
│ ┌────────────────┬─────────────────────────┐│
│ │ 📺 Live Posts  │ 👥 Guests Grid          ││
│ │ Stream         │ 📸 Photo Gallery        ││
│ │ (real-time)    │ (slideshow)             ││
│ │                │                         ││
│ └────────────────┴─────────────────────────┘│
└─────────────────────────────────────────────┘
```

**Features**:
- Auto-refresh every 30 seconds (fallback if WebSocket fails)
- Connection status indicator (green dot = live, yellow = polling)
- Mobile-optimized layout (stacks vertically on small screens)
- Floating admin controls for quick moderation (if admin logged in)
- Beautiful wedding aesthetic maintained

#### Task 5.8: Mobile Admin Controls (Wedding Day) 📱
**File**: Create `src/components/live/MobileAdminControls.tsx`

**Features**:
- Floating action button (FAB) in bottom-right corner
- Opens quick moderation panel
- Quick actions:
  - Pin/unpin post (star icon)
  - Approve pending post (checkmark icon)
  - Reject post (X icon)
  - View all pending (badge showing count)
- Keyboard shortcuts work globally (A = approve, R = reject)
- Haptic feedback on mobile devices
- Optimized for one-handed use

**Success Criteria**:
- ✅ Real-time posts appear within 2 seconds of approval
- ✅ WebSocket connection is stable for 100+ concurrent users
- ✅ Fallback polling works if WebSocket fails
- ✅ Pinned posts can be reordered smoothly
- ✅ Photo slideshow advances automatically
- ✅ Guest grid shows all confirmed RSVPs
- ✅ Statistics update every 30 seconds
- ✅ Mobile admin controls are easy to use one-handed
- ✅ No performance issues with 200+ posts displayed

---

### PHASE 6: Guest Dashboard (2-3 hours)

#### Task 6.1: Guest Authentication Service 🔐
**File**: Extend `src/lib/supabase/invitations.ts`

**Functions to add**:
```typescript
// Guest login with invitation code
export async function loginWithInvitationCode(code: string): Promise<Invitation | null>

// Get guest session
export async function getGuestSession(): Promise<Invitation | null>

// Logout guest
export async function logoutGuest(): Promise<void>

// Store session in localStorage or cookies
```

#### Task 6.2: Dashboard Data Service 📊
**File**: Create `src/lib/supabase/dashboard.ts`

**Functions to implement**:
```typescript
// Fetch all data for guest dashboard
export async function getGuestDashboardData(code: string): Promise<{
  invitation: Invitation
  progress: GuestProgress
  recentActivity: ActivityItem[]
  stats: GuestStats
}>

// Get guest's recent activity
export async function getGuestActivity(code: string, limit: number): Promise<ActivityItem[]>

// Activity items include:
// - Posts created
// - Comments made
// - Reactions given
// - Photos uploaded
// - Gift selected
// - RSVP submitted

// Get guest's personal statistics
export async function getGuestStats(code: string): Promise<{
  posts_count: number
  comments_count: number
  reactions_count: number
  photos_count: number
}>
```

#### Task 6.3: Progress Tracker Component ✅
**File**: Create `src/components/dashboard/ProgressTracker.tsx`

**Features** (reuse from `/convite/[code]` progress tracker):
- Circular progress indicator showing completion percentage
- Completion checklist with checkmarks:
  - ✅ RSVP Confirmado
  - ✅ Presente Selecionado
  - ✅ Fotos Enviadas
  - ✅ Mensagem Compartilhada
- Animated progress bar
- Motivational messages based on progress:
  - 0-25%: "Vamos começar! Complete seu RSVP"
  - 25-50%: "Ótimo progresso! Continue assim"
  - 50-75%: "Quase lá! Só faltam alguns passos"
  - 75-99%: "Incrível! Falta só um detalhe"
  - 100%: "🎉 Tudo pronto para o grande dia!"

#### Task 6.4: Countdown Timer Component ⏰
**File**: Create `src/components/dashboard/CountdownTimer.tsx`

**Features**:
- Display days, hours, minutes, seconds until November 20, 2025
- Update every second
- Beautiful animated numbers (flip effect on change)
- Show "Faltam X dias!" message
- Special message when wedding day arrives: "É HOJE! 🎉"
- Responsive design (stacks vertically on mobile)
- Animated background gradient

**Implementation**:
```typescript
const calculateTimeLeft = () => {
  const weddingDate = new Date('2025-11-20T18:00:00')
  const now = new Date()
  const difference = weddingDate.getTime() - now.getTime()

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60)
  }
}
```

#### Task 6.5: Quick Actions Component 🚀
**File**: Create `src/components/dashboard/QuickActions.tsx`

**Features**:
- 4 action cards with icons and descriptions:
  1. **RSVP** (if not completed)
     - Icon: ✓ CheckCircle
     - Navigate to: RSVP page
     - Status badge: "Pendente" or "Completo"
  2. **Presentes** (if not selected)
     - Icon: 🎁 Gift
     - Navigate to: `/presentes` (gifts page)
     - Status badge: "Pendente" or "Selecionado"
  3. **Fotos** (if not uploaded)
     - Icon: 📸 Camera
     - Navigate to: `/dia-1000/upload` (photo upload)
     - Status badge: "Pendente" or "Enviadas"
  4. **Mensagens**
     - Icon: 💬 MessageSquare
     - Navigate to: `/mensagens` (messages feed)
     - Status badge: Always available
- Hover effects with lift animation
- Disabled state for completed actions (with checkmark)
- Mobile-optimized (2 columns on small screens)

#### Task 6.6: Activity Feed Component 📜
**File**: Create `src/components/dashboard/ActivityFeed.tsx`

**Features**:
- Timeline view showing recent actions
- Each item shows:
  - Icon based on activity type
  - Activity description
  - Timestamp (relative time: "2 hours ago")
- Activity types:
  - 📝 "Você postou uma mensagem"
  - 💬 "Você comentou em um post"
  - ❤️ "Você reagiu a um post"
  - 📸 "Você enviou 3 fotos"
  - 🎁 "Você selecionou um presente"
  - ✓ "Você confirmou presença"
- Load more button if > 10 activities
- Empty state: "Nenhuma atividade ainda. Comece explorando!"

#### Task 6.7: Invitation Card Component 💌
**File**: Create `src/components/dashboard/InvitationCard.tsx`

**Features**:
- Display invitation details in elegant card:
  - Your invitation code (large, prominent)
  - QR code (generated on-demand with qrcode library)
  - Plus one status and name (if applicable)
  - Table number (if assigned)
  - Custom message from couple
  - Dietary restrictions noted
- Copy invitation link button
- Download QR code button
- Share via WhatsApp button (pre-filled message)
- Beautiful gradient background
- Wedding invitation aesthetic

#### Task 6.8: Guest Dashboard Page 🏠
**File**: Create `src/app/meu-convite/page.tsx`

**Layout**:
```
┌─────────────────────────────────────────────┐
│  👤 Meu Convite - Dashboard                  │
├─────────────────────────────────────────────┤
│  ⏰ Countdown Timer (prominent)              │
├─────────────────────────────────────────────┤
│ ┌────────────────┬─────────────────────────┐│
│ │ ✅ Progress    │ 💌 Invitation Card      ││
│ │ Tracker        │ (code, QR, details)     ││
│ └────────────────┴─────────────────────────┘│
├─────────────────────────────────────────────┤
│  🚀 Quick Actions (4 action cards)           │
├─────────────────────────────────────────────┤
│  📜 Recent Activity Feed                     │
└─────────────────────────────────────────────┘
```

**Authentication Flow**:
1. Check if guest is logged in (localStorage/cookies)
2. If not logged in, redirect to `/convite` with message
3. If logged in, load dashboard data
4. Provide logout button in header

**Features**:
- Auto-refresh progress every 60 seconds
- Real-time countdown timer
- Pull-to-refresh on mobile
- Loading states for all data
- Error handling with retry button
- Mobile-first responsive design
- Beautiful wedding aesthetic maintained

#### Task 6.9: Guest Login Page 🔐
**File**: Create `src/app/meu-convite/login/page.tsx`

**Features**:
- Simple form asking for invitation code
- "Don't have a code? Contact the couple" message
- Validate code exists in database
- Create session on successful login
- Redirect to `/meu-convite` dashboard
- Remember me checkbox (stores session longer)
- Beautiful wedding aesthetic

**Success Criteria**:
- ✅ Guest can login with invitation code
- ✅ Dashboard loads all data within 2 seconds
- ✅ Progress tracker shows accurate completion percentage
- ✅ Countdown timer updates every second
- ✅ Quick actions navigate to correct pages
- ✅ Activity feed shows recent actions
- ✅ Invitation card displays all details
- ✅ QR code generates and downloads correctly
- ✅ Mobile experience is perfect
- ✅ Logout works and clears session

---

## Testing Strategy

### After Phase 4 Complete:
1. Test create invitation with all relationship types
2. Test edit invitation (change details, verify saves)
3. Test delete invitation (verify confirmation dialog)
4. Test search functionality (partial matches, email, code)
5. Test filters (opened, RSVP, gifts, photos)
6. Test CSV export with filtered data
7. Generate QR code and verify it scans correctly
8. Copy invitation link and verify it works
9. Verify analytics calculations are accurate
10. Test on mobile devices (iOS/Android)

### After Phase 5 Complete:
1. Open `/ao-vivo` in multiple browser windows
2. Approve a post in admin panel, verify it appears in all windows within 2s
3. Pin a post, verify it appears in pinned section
4. Test photo slideshow (auto-advance, manual navigation)
5. Verify guest grid shows all confirmed RSVPs
6. Check statistics update automatically
7. Test mobile admin controls (pin/approve/reject)
8. Simulate 100+ concurrent users (load testing)
9. Test fallback polling if WebSocket disconnects
10. Verify no memory leaks with long sessions

### After Phase 6 Complete:
1. Login with sample invitation code (FAMILY001)
2. Verify dashboard loads all data correctly
3. Complete RSVP, verify progress updates
4. Select gift, verify progress updates
5. Upload photo, verify progress updates
6. Post message, verify appears in activity feed
7. Verify countdown timer updates every second
8. Test quick actions navigate to correct pages
9. Download QR code, verify it scans correctly
10. Test logout and re-login flow
11. Test on mobile devices (full guest journey)

---

## Database Tables Reference

All tables already created in migrations:

### Invitations Table
```sql
CREATE TABLE invitations (
  id UUID PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  guest_phone TEXT,
  relationship_type TEXT CHECK (relationship_type IN ('family', 'friend', 'colleague', 'other')),
  plus_one_allowed BOOLEAN DEFAULT false,
  plus_one_name TEXT,
  custom_message TEXT,
  table_number INTEGER,
  dietary_restrictions TEXT,
  opened_at TIMESTAMPTZ,
  open_count INTEGER DEFAULT 0,
  rsvp_completed BOOLEAN DEFAULT false,
  gift_selected BOOLEAN DEFAULT false,
  photos_uploaded BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT
);
```

### Guest Posts Table
```sql
CREATE TABLE guest_posts (
  id UUID PRIMARY KEY,
  guest_session_id UUID REFERENCES guest_sessions(id),
  guest_name TEXT NOT NULL,
  content TEXT NOT NULL,
  post_type TEXT CHECK (post_type IN ('text', 'image', 'video', 'mixed')),
  media_urls TEXT[],
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  moderation_reason TEXT,
  moderated_at TIMESTAMPTZ,
  moderated_by TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Pinned Posts Table
```sql
CREATE TABLE pinned_posts (
  id UUID PRIMARY KEY,
  post_id UUID REFERENCES guest_posts(id) UNIQUE,
  pinned_by TEXT NOT NULL,
  pinned_at TIMESTAMPTZ DEFAULT NOW(),
  display_order INTEGER DEFAULT 0
);
```

---

## Success Metrics

### Phase 4 (Admin Invitations):
- [ ] Create/edit/delete operations: < 1s response time
- [ ] CSV export: < 2s for 100+ guests
- [ ] Analytics dashboard loads: < 1s
- [ ] QR code generation: < 500ms
- [ ] Zero console errors/warnings

### Phase 5 (Live Feed):
- [ ] Real-time post latency: < 2s
- [ ] Handle 100+ concurrent users
- [ ] WebSocket connection success: 95%+
- [ ] Fallback polling: 30s intervals
- [ ] Photo slideshow smooth: 60fps
- [ ] Statistics refresh: every 30s

### Phase 6 (Guest Dashboard):
- [ ] Dashboard loads: < 2s
- [ ] Progress calculation: < 500ms
- [ ] Countdown updates: 1s intervals
- [ ] QR code generation: < 500ms
- [ ] Mobile UX: perfect on all devices

---

## Quick Start Commands

```bash
# Navigate to project
cd /Users/helrabelo/code/personal/thousanddaysoflove

# Start development server
npm run dev

# Open Supabase Studio (database admin)
npm run supabase:studio

# View sample invitations
# Navigate to: http://localhost:3000/admin/convites (after implementing Phase 4 modals)

# Test sample invitation codes:
# http://localhost:3000/convite/FAMILY001 - João Silva
# http://localhost:3000/convite/FRIEND002 - Maria Santos
# http://localhost:3000/convite/FRIEND003 - Pedro Costa
# http://localhost:3000/convite/WORK004 - Ana Oliveira
```

---

## Files Created So Far

### Phase 3 (Complete):
- `src/lib/supabase/messages.ts` - Messages service layer (625 lines)
- `src/components/messages/PostComposer.tsx` - Rich post editor (434 lines)
- `src/components/messages/PostCard.tsx` - Post display (340 lines)
- `src/components/messages/CommentThread.tsx` - Comment system (290 lines)
- `src/components/messages/MessagesFeed.tsx` - Feed display (280 lines)
- `src/app/mensagens/page.tsx` - Public feed page (280 lines)
- `src/app/admin/posts/page.tsx` - Admin moderation (380 lines)

### Phase 4 (Foundation Complete):
- `src/lib/supabase/invitations.ts` - Invitations service (615 lines total)
- `src/app/admin/convites/page.tsx` - Admin page foundation (600+ lines)

### Phase 4 (To Complete):
- Add modals to `src/app/admin/convites/page.tsx`:
  - CreateInvitationModal
  - EditInvitationModal
  - DetailViewModal

### Phase 5 (To Create):
- `src/lib/supabase/live.ts` - Real-time service layer
- `src/components/live/LivePostStream.tsx`
- `src/components/live/PinnedMomentsSection.tsx`
- `src/components/live/LivePhotoGallery.tsx`
- `src/components/live/GuestsGrid.tsx`
- `src/components/live/LiveStats.tsx`
- `src/components/live/MobileAdminControls.tsx`
- `src/app/ao-vivo/page.tsx`

### Phase 6 (To Create):
- `src/lib/supabase/dashboard.ts` - Dashboard service layer
- `src/components/dashboard/ProgressTracker.tsx` (can reuse from invitations)
- `src/components/dashboard/CountdownTimer.tsx`
- `src/components/dashboard/QuickActions.tsx`
- `src/components/dashboard/ActivityFeed.tsx`
- `src/components/dashboard/InvitationCard.tsx`
- `src/app/meu-convite/page.tsx`
- `src/app/meu-convite/login/page.tsx`

---

## Implementation Order

Execute in this exact sequence:

1. **Phase 4 Polish** (2-3 hours)
   - Add create invitation modal
   - Add edit invitation modal
   - Add detail view modal
   - Test all CRUD operations
   - Test with sample data
   - Fix any bugs

2. **Phase 5 Implementation** (3-4 hours)
   - Create live service layer with Supabase real-time
   - Build all live components (post stream, pinned moments, gallery, guests, stats)
   - Create live feed page
   - Add mobile admin controls
   - Test real-time functionality
   - Load test with multiple connections

3. **Phase 6 Implementation** (2-3 hours)
   - Extend invitations service with guest auth
   - Create dashboard service layer
   - Build all dashboard components (progress, countdown, actions, feed, card)
   - Create dashboard page
   - Create login page
   - Test full guest journey
   - Mobile optimization

4. **Final Testing** (1 hour)
   - Test complete flow: invitation → open → RSVP → gifts → photos → messages → dashboard
   - Test admin flow: create invitation → send → monitor progress → moderate content
   - Test live feed: approve posts → pin moments → view statistics
   - Performance testing
   - Mobile testing
   - Bug fixes

---

## Estimated Total Time: 8-11 hours

**Phase 4**: 2-3 hours (complete admin with modals)
**Phase 5**: 3-4 hours (live feed with real-time)
**Phase 6**: 2-3 hours (guest dashboard)
**Testing**: 1 hour (comprehensive testing)

---

## Design System Reminder

Maintain elegant wedding aesthetic throughout:

### Colors (Monochromatic)
- Background: `#F8F6F3` (warm cream)
- Primary Text: `#2C2C2C` (charcoal)
- Secondary Text: `#4A4A4A` (medium gray)
- Decorative: `#A8A8A8` (silver-gray)
- Accent: `#E8E6E3` (subtle warm gray)

### Typography
- Primary: `font-playfair` (headings)
- Body: `font-crimson` (body text)
- Code: `font-mono` (invitation codes)

### Animations
- Use Framer Motion for all animations
- Entrance animations: `initial={{ opacity: 0, y: 10 }}` `animate={{ opacity: 1, y: 0 }}`
- Hover effects: `whileHover={{ scale: 1.02 }}`
- Stagger children with `transition={{ delay: index * 0.05 }}`
- Support `useReducedMotion` for accessibility

### Components
- Use existing UI components from `src/components/ui/`
- Maintain consistent spacing (Tailwind scale: 4, 6, 8, 12, 16, 24)
- Mobile-first responsive design
- Touch-friendly targets (min 44px)

---

## Next Steps for New Session

1. **Read this prompt completely** to understand the full scope
2. **Start with Phase 4 Polish**: Complete the three modals (create, edit, detail)
3. **Test Phase 4**: Verify all CRUD operations work with sample data
4. **Move to Phase 5**: Implement real-time live feed system
5. **Test Phase 5**: Verify real-time subscriptions work
6. **Move to Phase 6**: Implement guest dashboard
7. **Test Phase 6**: Verify complete guest journey
8. **Final Polish**: Fix bugs, optimize performance, mobile testing

Use the TodoWrite tool to track progress through each phase!

Good luck! 🎉 This will be the completion of the comprehensive guest experience system! 🎊
