# Next Session: Phase 6 - Guest Dashboard

## Session Goal
Complete the Guest Experience Enhancement roadmap by implementing **Phase 6: Guest Dashboard** at `/meu-convite` - a personalized hub showing each guest's wedding participation progress.

---

## Current Status

✅ **Phase 1**: Personalized Invitations (100%)
✅ **Phase 2**: Invitation System Foundation (100%)
✅ **Phase 3**: Guest Messaging System (100%)
✅ **Phase 4**: Admin Invitation Management (100%)
✅ **Phase 5**: Live Wedding Day Feed (100%)
⏳ **Phase 6**: Guest Dashboard (0%) ← **YOU ARE HERE**

**Overall Progress**: ~85% complete, ~2-3 hours remaining

---

## Phase 6 Overview

### Pages to Build
1. `/meu-convite` - Guest Dashboard (main page)
2. `/meu-convite/login` - Guest login with invitation code

### Key Features
1. **Guest Authentication** - Login with invitation codes
2. **Progress Tracker** - Circular progress with 4 completion items
3. **Countdown Timer** - Live wedding countdown (days/hours/mins/secs)
4. **Quick Actions** - 4 action cards (RSVP, gifts, photos, messages)
5. **Activity Feed** - Recent guest actions timeline
6. **Invitation Card** - Display invitation details with QR code

---

## Implementation Tasks

### Task 1: Guest Authentication Service (30 mins)
**File**: Extend `src/lib/supabase/invitations.ts`

Add these functions:
```typescript
/**
 * Authenticate guest with invitation code
 * Creates session in localStorage/cookies
 */
export async function loginWithInvitationCode(code: string): Promise<Invitation | null>

/**
 * Get current guest session
 * Returns invitation if logged in, null otherwise
 */
export async function getGuestSession(): Promise<Invitation | null>

/**
 * Logout current guest
 * Clears session from storage
 */
export async function logoutGuest(): Promise<void>
```

**Storage Strategy**:
- Use `localStorage` for persistent session
- Key: `guest_session_code`
- No expiration (wedding-specific app)

---

### Task 2: Dashboard Data Service (30 mins)
**File**: Create `src/lib/supabase/dashboard.ts`

Functions needed:
```typescript
/**
 * Fetch all data for guest dashboard in one call
 */
export async function getGuestDashboardData(code: string): Promise<{
  invitation: Invitation
  progress: GuestProgress
  recentActivity: ActivityItem[]
  stats: GuestStats
}>

/**
 * Get guest's recent activity across all features
 */
export async function getGuestActivity(
  code: string,
  limit: number = 10
): Promise<ActivityItem[]>

/**
 * Get guest's personal statistics
 */
export async function getGuestStats(code: string): Promise<{
  posts_count: number
  comments_count: number
  reactions_count: number
  photos_count: number
}>
```

**Activity Types to Track**:
- Posts created
- Comments made
- Reactions given
- Photos uploaded
- Gift selected
- RSVP submitted

---

### Task 3: Progress Tracker Component (20 mins)
**File**: `src/components/dashboard/ProgressTracker.tsx`

**Reuse from existing**: Can copy from `src/components/invitations/GuestProgressTracker.tsx` and adapt!

Features:
- Circular progress indicator (0-100%)
- 4 completion checkmarks:
  - ✅ RSVP Confirmado
  - ✅ Presente Selecionado
  - ✅ Fotos Enviadas
  - ✅ Mensagem Compartilhada
- Motivational messages based on progress:
  - 0-25%: "Vamos começar! Complete seu RSVP"
  - 25-50%: "Ótimo progresso! Continue assim"
  - 50-75%: "Quase lá! Só faltam alguns passos"
  - 75-99%: "Incrível! Falta só um detalhe"
  - 100%: "🎉 Tudo pronto para o grande dia!"

---

### Task 4: Countdown Timer Component (20 mins)
**File**: `src/components/dashboard/CountdownTimer.tsx`

Features:
- Display days, hours, minutes, seconds until Nov 20, 2025
- Update every second with `setInterval`
- Animated number flip effect on change
- Show "Faltam X dias!" message
- Special message when wedding day arrives: "É HOJE! 🎉"
- Responsive design (stack vertically on mobile)
- Gradient background animation

Implementation:
```typescript
const calculateTimeLeft = () => {
  const weddingDate = new Date('2025-11-20T18:00:00')
  const now = new Date()
  const diff = weddingDate.getTime() - now.getTime()

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true }
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    isPast: false
  }
}
```

---

### Task 5: Quick Actions Component (20 mins)
**File**: `src/components/dashboard/QuickActions.tsx`

4 action cards:
```typescript
const actions = [
  {
    title: 'RSVP',
    icon: CheckCircle,
    href: '/rsvp',
    completed: invitation.rsvp_completed,
    description: 'Confirme sua presença'
  },
  {
    title: 'Presentes',
    icon: Gift,
    href: '/presentes',
    completed: invitation.gift_selected,
    description: 'Escolha um presente'
  },
  {
    title: 'Fotos',
    icon: Camera,
    href: '/dia-1000/upload',
    completed: invitation.photos_uploaded,
    description: 'Envie suas fotos'
  },
  {
    title: 'Mensagens',
    icon: MessageSquare,
    href: '/mensagens',
    completed: false, // Always available
    description: 'Deixe uma mensagem'
  }
]
```

Features:
- Status badge: "Pendente" or "Completo"
- Disabled state for completed actions
- Hover lift animation
- Mobile-optimized (2 columns on small screens)

---

### Task 6: Activity Feed Component (20 mins)
**File**: `src/components/dashboard/ActivityFeed.tsx`

Timeline view with:
- Icon based on activity type
- Activity description
- Relative timestamp ("2 hours ago")

Activity types:
- 📝 "Você postou uma mensagem"
- 💬 "Você comentou em um post"
- ❤️ "Você reagiu a um post"
- 📸 "Você enviou 3 fotos"
- 🎁 "Você selecionou um presente"
- ✓ "Você confirmou presença"

Load more button if > 10 activities
Empty state: "Nenhuma atividade ainda. Comece explorando!"

---

### Task 7: Invitation Card Component (20 mins)
**File**: `src/components/dashboard/InvitationCard.tsx`

Display:
- Large invitation code (prominent)
- QR code (generated with `qrcode` library)
- Plus one status and name (if applicable)
- Table number (if assigned)
- Custom message from couple
- Dietary restrictions noted

Actions:
- Copy invitation link button
- Download QR code button
- Share via WhatsApp button (pre-filled message)

Styling:
- Beautiful gradient background
- Wedding invitation aesthetic

---

### Task 8: Guest Dashboard Page (30 mins)
**File**: `src/app/meu-convite/page.tsx`

Layout:
```
┌─────────────────────────────────────┐
│  👤 Meu Convite - Dashboard          │
├─────────────────────────────────────┤
│  ⏰ Countdown Timer (prominent)      │
├─────────────────────────────────────┤
│ ┌──────────┬────────────────────────┐│
│ │ Progress │ Invitation Card        ││
│ │ Tracker  │ (code, QR, details)    ││
│ └──────────┴────────────────────────┘│
├─────────────────────────────────────┤
│  🚀 Quick Actions (4 cards)          │
├─────────────────────────────────────┤
│  📜 Recent Activity Feed             │
└─────────────────────────────────────┘
```

Features:
- Check guest session on load
- Redirect to login if not authenticated
- Auto-refresh progress every 60 seconds
- Pull-to-refresh on mobile
- Loading states for all data
- Error handling with retry button
- Logout button in header

---

### Task 9: Guest Login Page (20 mins)
**File**: `src/app/meu-convite/login/page.tsx`

Simple form:
- Input for invitation code
- "Don't have a code? Contact the couple" message
- Validate code exists in database
- Create session on successful login
- Redirect to `/meu-convite` dashboard
- Remember me checkbox (optional)
- Beautiful wedding aesthetic
- Error states for invalid codes

---

## Implementation Order

Execute in this sequence:
1. **Guest Auth Service** (Task 1) - Foundation first
2. **Dashboard Data Service** (Task 2) - Data layer
3. **Login Page** (Task 9) - Entry point
4. **Progress Tracker** (Task 3) - Reuse existing
5. **Countdown Timer** (Task 4) - Eye-catching feature
6. **Quick Actions** (Task 5) - Navigation
7. **Activity Feed** (Task 6) - Engagement
8. **Invitation Card** (Task 7) - Details
9. **Dashboard Page** (Task 8) - Bring it all together

---

## Success Criteria

✅ **Authentication**:
- Guest can login with valid invitation code
- Invalid codes show helpful error message
- Session persists across page refreshes
- Logout clears session properly

✅ **Dashboard**:
- Loads all data within 2 seconds
- Progress tracker shows accurate completion %
- Countdown updates every second
- Quick actions navigate to correct pages
- Activity feed shows recent actions
- Invitation card displays all details
- QR code generates and downloads

✅ **Mobile Experience**:
- Perfect on iOS and Android
- Touch-friendly (44px+ tap targets)
- Smooth animations (60fps)
- Responsive layout adjustments

✅ **Performance**:
- Initial load: < 2s
- Real-time updates: < 1s
- No memory leaks with countdown timer
- Smooth animations on all devices

---

## Design System (Maintain Consistency)

**Colors**:
- Background: `#F8F6F3` (warm cream)
- Primary Text: `#2C2C2C` (charcoal)
- Accent gradients for cards

**Typography**:
- Headings: `font-playfair`
- Body: `font-crimson`
- Code: `font-mono` (invitation codes)

**Animations**:
- Use Framer Motion
- Entrance: `opacity 0→1, y: 10→0`
- Hover: `scale: 1→1.02`
- Support `useReducedMotion`

---

## Testing Checklist

After implementation:
- [ ] Login with FAMILY001 code
- [ ] Verify dashboard loads all data
- [ ] Complete RSVP → progress updates
- [ ] Select gift → progress updates
- [ ] Upload photo → progress updates
- [ ] Post message → appears in activity feed
- [ ] Countdown timer updates every second
- [ ] Quick actions navigate correctly
- [ ] Download QR code works
- [ ] Logout and re-login works
- [ ] Test on mobile device

---

## Estimated Time

**Total**: 2-3 hours

- Auth service: 30 mins
- Data service: 30 mins
- Components (6): 2 hours
- Pages (2): 50 mins
- Testing: 20 mins

---

## Quick Start Commands

```bash
# Navigate to project
cd /Users/helrabelo/code/personal/thousanddaysoflove

# Ensure dev server is running
npm run dev

# Open in browser
# http://localhost:3000

# Start with auth service
code src/lib/supabase/invitations.ts

# Then data service
code src/lib/supabase/dashboard.ts
```

---

## Reference Materials

**Existing Code to Reuse**:
- Progress Tracker: `src/components/invitations/GuestProgressTracker.tsx` (258 lines)
- QR Code generation: Already in `src/app/admin/convites/page.tsx` (lines 1284-1297)
- Invitation data fetching: `src/lib/supabase/invitations.ts` (existing functions)

**Similar Patterns**:
- Authentication flow: Similar to guest photo upload (`/dia-1000/login`)
- Activity feed: Similar to live feed (`/ao-vivo`)
- Quick actions: Similar to invitation page actions (`/convite/[code]`)

**Database Tables** (already created):
- `invitations` - Guest details and progress flags
- `guest_posts` - Posts for activity feed
- `post_reactions` - Reactions for activity feed
- `post_comments` - Comments for activity feed
- `guest_photos` - Photos for activity feed

---

## After Completion

When Phase 6 is done:
1. ✅ Test complete guest journey end-to-end
2. ✅ Test on real mobile devices
3. ✅ Load test with multiple concurrent guests
4. ✅ Update CLAUDE.md with Phase 6 completion
5. 🎉 **Guest Experience Enhancement COMPLETE!**

**Final Progress**: 100% of roadmap complete, ~10,500 lines of code written

---

## Notes

- Phase 6 builds on all previous phases
- Reuse components wherever possible
- Maintain elegant wedding aesthetic
- Focus on guest delight and ease of use
- Test on mobile devices, not just browser resize

Good luck! This will be the final phase of the comprehensive guest experience system! 🎊💕
