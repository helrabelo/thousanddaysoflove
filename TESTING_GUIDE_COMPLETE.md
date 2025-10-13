# Complete Testing Guide - Guest Experience Enhancement
## All 6 Phases

**Project**: Thousand Days of Love Wedding Website
**Testing Date**: October 2025
**Tested By**: _______________

---

## Table of Contents
1. [Pre-Testing Setup](#pre-testing-setup)
2. [Phase 1 & 2: Personalized Invitations](#phase-1--2-personalized-invitations)
3. [Phase 3: Guest Messaging System](#phase-3-guest-messaging-system)
4. [Phase 4: Admin Invitation Management](#phase-4-admin-invitation-management)
5. [Phase 5: Live Wedding Day Feed](#phase-5-live-wedding-day-feed)
6. [Phase 6: Guest Dashboard](#phase-6-guest-dashboard)
7. [End-to-End Guest Journey](#end-to-end-guest-journey)
8. [Performance Testing](#performance-testing)
9. [Mobile Testing](#mobile-testing)
10. [Known Issues & Notes](#known-issues--notes)

---

## Pre-Testing Setup

### Environment Setup
```bash
# Ensure dev server is running
npm run dev

# Open in browser
http://localhost:3000
```

### Test Data Required
Create at least 3 test invitations with different characteristics:

1. **FAMILY001** - Family guest with plus one
   - Guest Name: João Silva
   - Email: joao@example.com
   - Relationship: family
   - Plus One: Yes (Maria Silva)
   - Custom Message: "Querido João, mal podemos esperar para celebrar com você!"

2. **FRIEND002** - Friend without plus one
   - Guest Name: Pedro Costa
   - Email: pedro@example.com
   - Relationship: friend
   - Plus One: No

3. **WORK003** - Colleague with dietary restrictions
   - Guest Name: Ana Oliveira
   - Email: ana@example.com
   - Relationship: colleague
   - Dietary Restrictions: "Vegetariana"

**How to create**: Navigate to `/admin/convites` and use the "Criar Convite" button.

---

## Phase 1 & 2: Personalized Invitations

### Test: Generic Invitation Page
**URL**: http://localhost:3000/convite

**Expected**:
- [ ] Page loads without errors
- [ ] Shows event details (date, time, location)
- [ ] "Acessar com código" button present
- [ ] Mobile-responsive layout
- [ ] Beautiful wedding aesthetic maintained

**Pass/Fail**: _____ | **Notes**: _____________________

---

### Test: Personalized Invitation
**URL**: http://localhost:3000/convite/FAMILY001

**Expected**:
- [ ] Page loads with guest name "João Silva"
- [ ] Shows custom message
- [ ] Plus one indicator displays "Maria Silva"
- [ ] Progress tracker shows 0% initially
- [ ] 4 action cards present (RSVP, Presentes, Fotos, Mensagens)
- [ ] QR code generates successfully
- [ ] Open tracking increments (check database)
- [ ] First visit records `opened_at` timestamp
- [ ] Subsequent visits only increment `open_count`

**Pass/Fail**: _____ | **Notes**: _____________________

---

### Test: Invalid Invitation Code
**URL**: http://localhost:3000/convite/INVALID999

**Expected**:
- [ ] Shows friendly error message
- [ ] No crash or 500 error
- [ ] Suggests contacting couple
- [ ] Maintains design aesthetic

**Pass/Fail**: _____ | **Notes**: _____________________

---

## Phase 3: Guest Messaging System

### Test: Post Composer
**URL**: http://localhost:3000/mensagens

**Step 1: Guest Name Prompt**
- [ ] Modal appears asking for guest name
- [ ] Can enter name and save to session
- [ ] Session persists across page refreshes

**Step 2: Create Text Post**
- [ ] Click "Criar Post" button
- [ ] Composer modal opens
- [ ] Emoji picker available (36 wedding emojis)
- [ ] Character counter shows (5000 max)
- [ ] Can submit text-only post
- [ ] Post goes to "pending" status
- [ ] Success feedback shown

**Pass/Fail**: _____ | **Notes**: _____________________

---

### Test: Create Image Post
**Step 1: Upload Images**
- [ ] Click file upload area
- [ ] Select 1-3 images (JPG, PNG)
- [ ] Thumbnails appear with remove buttons
- [ ] File size validation (max 10MB per file)
- [ ] Can add caption text
- [ ] Submit successfully

**Expected**:
- [ ] Post created with type "image" or "mixed"
- [ ] Images stored in Supabase storage
- [ ] Post pending moderation

**Pass/Fail**: _____ | **Notes**: _____________________

---

### Test: Reactions System
**Step 1: View Approved Posts**
- Navigate to admin `/admin/posts` and approve a test post first

**Step 2: Add Reactions**
- [ ] 5 reaction types available (❤️ 👏 😂 🎉 💕)
- [ ] Click reaction adds it
- [ ] Click again removes it (toggle)
- [ ] Reaction count updates in real-time
- [ ] Guest can only react once per type

**Pass/Fail**: _____ | **Notes**: _____________________

---

### Test: Comment Thread
**Step 1: Add Top-Level Comment**
- [ ] Comment box appears under post
- [ ] Can type and submit comment
- [ ] Comment appears immediately
- [ ] Shows guest name and timestamp

**Step 2: Reply to Comment**
- [ ] "Responder" button on comments
- [ ] Reply form indented
- [ ] Reply links to parent
- [ ] Max 3 nesting levels enforced

**Pass/Fail**: _____ | **Notes**: _____________________

---

## Phase 4: Admin Invitation Management

### Test: Invitations Dashboard
**URL**: http://localhost:3000/admin/convites

**Login**: Use `ADMIN_PASSWORD` from `.env.local`

**Expected**:
- [ ] Admin login required
- [ ] All invitations displayed in table
- [ ] Sortable columns (name, date, opened, progress)
- [ ] Search functionality works
- [ ] Filter by relationship type
- [ ] Statistics cards show correct counts

**Pass/Fail**: _____ | **Notes**: _____________________

---

### Test: Create Invitation
**Step 1: Open Modal**
- [ ] Click "Criar Convite" button
- [ ] Modal opens with form

**Step 2: Fill Form**
- [ ] Auto-generate code based on relationship
- [ ] Fill guest details
- [ ] Enable plus one toggle
- [ ] Add custom message
- [ ] Live preview updates

**Step 3: Submit**
- [ ] Validation works (required fields)
- [ ] Success message shown
- [ ] New invitation appears in table
- [ ] Database record created

**Pass/Fail**: _____ | **Notes**: _____________________

---

### Test: Edit Invitation
**Step 1: Open Edit Modal**
- [ ] Click edit icon on invitation row
- [ ] Modal opens with pre-filled data
- [ ] Shows last updated timestamp

**Step 2: Modify Data**
- [ ] Change guest name
- [ ] Update custom message
- [ ] Toggle plus one status
- [ ] Preview updates

**Step 3: Save**
- [ ] Changes saved to database
- [ ] Table updates immediately
- [ ] Success feedback shown

**Pass/Fail**: _____ | **Notes**: _____________________

---

### Test: View Invitation Details
**Step 1: Open Detail Modal**
- [ ] Click eye icon on invitation
- [ ] Modal shows complete details

**Expected**:
- [ ] Large invitation code displayed
- [ ] QR code generated and visible
- [ ] Progress tracker with current status
- [ ] All guest details present
- [ ] Can copy invitation URL
- [ ] Can download QR code

**Pass/Fail**: _____ | **Notes**: _____________________

---

### Test: Delete Invitation
**Step 1: Click Delete**
- [ ] Confirmation dialog appears
- [ ] Warning message clear

**Step 2: Confirm**
- [ ] Invitation removed from table
- [ ] Database record deleted
- [ ] Cannot be recovered

**Pass/Fail**: _____ | **Notes**: _____________________

---

## Phase 5: Live Wedding Day Feed

### Test: Live Feed Page
**URL**: http://localhost:3000/ao-vivo

**Expected Components**:
- [ ] Hero section with gradient background
- [ ] Connection status indicator ("Ao vivo" or "Atualizando...")
- [ ] Live statistics (4 cards)
- [ ] Recent activity feed (last 10 actions)
- [ ] Confirmed guests grid
- [ ] Live photo gallery slideshow
- [ ] Pinned special moments section
- [ ] Live post stream

**Pass/Fail**: _____ | **Notes**: _____________________

---

### Test: Real-Time Subscriptions
**Setup**: Open feed in two browser windows

**Step 1: Create New Post**
- In window 1: Create and approve a post in admin
- In window 2: Watch live feed

**Expected**:
- [ ] "Novos posts disponíveis" banner appears
- [ ] Click banner loads new post
- [ ] No page refresh needed
- [ ] Smooth animation when post appears

**Pass/Fail**: _____ | **Notes**: _____________________

---

### Test: Live Statistics
**Expected**:
- [ ] Total posts count accurate
- [ ] Total photos count accurate
- [ ] Confirmed guests count accurate
- [ ] Total reactions count accurate
- [ ] Updates in real-time with new activity

**Pass/Fail**: _____ | **Notes**: _____________________

---

### Test: Pinned Moments
**Setup**: Pin 2-3 posts in admin `/admin/posts`

**Expected**:
- [ ] Pinned section appears at top
- [ ] Shows pinned posts with shimmer effect
- [ ] Badge indicates "Momento Especial"
- [ ] Can click to view full post
- [ ] Order matches admin display order

**Pass/Fail**: _____ | **Notes**: _____________________

---

### Test: Live Photo Gallery
**Expected**:
- [ ] Slideshow auto-plays every 5 seconds
- [ ] Shows recent approved photos
- [ ] Smooth transitions
- [ ] Navigation arrows work
- [ ] Can click for fullscreen
- [ ] Mobile swipe gestures work

**Pass/Fail**: _____ | **Notes**: _____________________

---

## Phase 6: Guest Dashboard

### Test: Guest Login
**URL**: http://localhost:3000/meu-convite/login

**Step 1: Invalid Code**
- Enter: `INVALID999`
- [ ] Error message appears
- [ ] No crash
- [ ] Can try again

**Step 2: Valid Code**
- Enter: `FAMILY001`
- [ ] Success! Redirects to dashboard
- [ ] Session saved in localStorage
- [ ] Invitation open tracked

**Pass/Fail**: _____ | **Notes**: _____________________

---

### Test: Dashboard Loading
**URL**: http://localhost:3000/meu-convite

**Expected**:
- [ ] Redirects to login if no session
- [ ] Loads within 2 seconds
- [ ] Shows greeting with guest name
- [ ] All sections present
- [ ] No console errors

**Pass/Fail**: _____ | **Notes**: _____________________

---

### Test: Countdown Timer
**Expected**:
- [ ] Shows days, hours, minutes, seconds
- [ ] Updates every second
- [ ] Smooth number transitions
- [ ] Shows "Faltam X dias!" message
- [ ] No memory leaks (check DevTools)

**Pass/Fail**: _____ | **Notes**: _____________________

---

### Test: Progress Tracker
**Expected**:
- [ ] Circular progress indicator animates
- [ ] Shows correct percentage
- [ ] 4 checkmarks with completion status
- [ ] Motivational message appropriate for progress
- [ ] Smooth entrance animations

**Pass/Fail**: _____ | **Notes**: _____________________

---

### Test: Invitation Card
**Expected**:
- [ ] Large invitation code displayed
- [ ] QR code generates successfully
- [ ] Plus one details shown (if applicable)
- [ ] Custom message displayed
- [ ] Copy link button works
- [ ] Shows "Link copiado!" feedback
- [ ] Download QR code works
- [ ] WhatsApp share opens with pre-filled message

**Pass/Fail**: _____ | **Notes**: _____________________

---

### Test: Quick Actions
**Expected**:
- [ ] 4 action cards displayed
- [ ] Status badges correct (Pendente/Completo)
- [ ] Completed items show green badge
- [ ] Hover animations smooth
- [ ] Links navigate correctly
- [ ] Mobile: 2-column layout

**Pass/Fail**: _____ | **Notes**: _____________________

---

### Test: Activity Feed
**Setup**: Perform various actions as guest (post, comment, react)

**Expected**:
- [ ] Recent activities appear
- [ ] Correct icons for activity types
- [ ] Relative timestamps ("2 horas atrás")
- [ ] Activity type badges
- [ ] Smooth entrance animations
- [ ] Empty state if no activities

**Pass/Fail**: _____ | **Notes**: _____________________

---

### Test: Statistics Cards
**Expected**:
- [ ] Posts count accurate
- [ ] Comments count accurate
- [ ] Reactions count accurate
- [ ] Photos count accurate
- [ ] Updates after new activity

**Pass/Fail**: _____ | **Notes**: _____________________

---

### Test: Auto-Refresh
**Expected**:
- [ ] Dashboard refreshes every 60 seconds
- [ ] Silent refresh (no loading spinner)
- [ ] Data updates without flash
- [ ] Manual refresh button works

**Pass/Fail**: _____ | **Notes**: _____________________

---

### Test: Logout
**Expected**:
- [ ] Logout button visible in header
- [ ] Click clears localStorage
- [ ] Redirects to login page
- [ ] Cannot access dashboard without login

**Pass/Fail**: _____ | **Notes**: _____________________

---

## End-to-End Guest Journey

### Complete Flow Test
**Estimated Time**: 15 minutes

**Step 1: Receive Invitation**
- [ ] Visit `/convite/FAMILY001`
- [ ] View personalized invitation
- [ ] See custom message
- [ ] Check progress: 0%

**Step 2: Complete RSVP**
- [ ] Click "Confirmar Presença" action
- [ ] Fill RSVP form
- [ ] Submit successfully
- [ ] Return to invitation
- [ ] Progress updates to 25%

**Step 3: Select Gift**
- [ ] Navigate to `/presentes`
- [ ] Browse gift registry
- [ ] Select a gift
- [ ] Complete PIX payment
- [ ] Progress updates to 50%

**Step 4: Upload Photos**
- [ ] Go to `/dia-1000/upload`
- [ ] Login with guest password
- [ ] Upload 2-3 photos
- [ ] Select phase (before/during/after)
- [ ] Submit successfully
- [ ] Photos pending moderation

**Step 5: Approve Photos (Admin)**
- [ ] Admin: Navigate to `/admin/photos`
- [ ] Approve uploaded photos
- [ ] Photos appear in gallery

**Step 6: Check Progress Update**
- [ ] Return to `/convite/FAMILY001`
- [ ] Progress now at 75%

**Step 7: Post Message**
- [ ] Go to `/mensagens`
- [ ] Create post with text and emoji
- [ ] Submit post
- [ ] Post pending approval

**Step 8: Approve Post (Admin)**
- [ ] Admin: Navigate to `/admin/posts`
- [ ] Approve message
- [ ] Post appears in feed

**Step 9: Access Dashboard**
- [ ] Go to `/meu-convite/login`
- [ ] Login with `FAMILY001`
- [ ] Dashboard loads
- [ ] Progress shows 100%
- [ ] All activities in timeline
- [ ] Stats show correct counts

**Step 10: Live Feed**
- [ ] Navigate to `/ao-vivo`
- [ ] See approved post
- [ ] See uploaded photos
- [ ] Stats update in real-time

**Pass/Fail**: _____ | **Notes**: _____________________

---

## Performance Testing

### Page Load Times
Test with throttled network (Fast 3G):

- [ ] Homepage: < 3 seconds
- [ ] Invitation page: < 2 seconds
- [ ] Messages feed: < 3 seconds
- [ ] Admin dashboard: < 4 seconds
- [ ] Guest dashboard: < 2 seconds
- [ ] Live feed: < 3 seconds

**Pass/Fail**: _____ | **Notes**: _____________________

---

### Memory Leaks
**Test**: Leave countdown timer running for 5 minutes

- [ ] Memory usage stable (check DevTools Performance)
- [ ] No continuous memory growth
- [ ] setInterval properly cleaned up
- [ ] No console warnings

**Pass/Fail**: _____ | **Notes**: _____________________

---

### Concurrent Users
**Test**: Open 5-10 browser tabs simultaneously

- [ ] Live feed subscriptions work
- [ ] Real-time updates in all tabs
- [ ] No rate limiting errors
- [ ] Supabase connection stable

**Pass/Fail**: _____ | **Notes**: _____________________

---

## Mobile Testing

### Devices to Test
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] Tablet (iPad)

### Mobile-Specific Features

**Touch Interactions**:
- [ ] All buttons 44px+ (easy to tap)
- [ ] Swipe gestures work (gallery)
- [ ] Touch targets not too close
- [ ] No hover-only interactions

**Responsive Layout**:
- [ ] Dashboard: stacks vertically
- [ ] Quick actions: 2 columns
- [ ] Countdown: readable on small screen
- [ ] QR code: appropriate size
- [ ] Forms: full-width inputs

**Mobile Navigation**:
- [ ] Header responsive
- [ ] Menu accessible
- [ ] No horizontal scroll
- [ ] Safe area padding (notches)

**Pass/Fail**: _____ | **Notes**: _____________________

---

## Known Issues & Notes

### Expected Behaviors
1. **First Load**: QR code generation may take 1-2 seconds
2. **Live Feed**: Connection may show "Atualizando..." briefly on load
3. **Photos**: Moderation required before appearing in gallery
4. **Posts**: Must be approved by admin before public display

### Browser Compatibility
- **Tested**: Chrome 120+, Safari 17+, Firefox 120+
- **Mobile**: iOS 16+, Android 12+
- **Known Issues**: None at this time

### Database Notes
- **Supabase RLS**: Enabled for all tables
- **Admin Access**: Bypasses RLS with service role
- **Guest Access**: Read-only for approved content
- **Real-time**: Supabase subscriptions for live feed

---

## Testing Checklist Summary

**Phase 1 & 2**: ___/10 tests passed
**Phase 3**: ___/6 tests passed
**Phase 4**: ___/5 tests passed
**Phase 5**: ___/5 tests passed
**Phase 6**: ___/10 tests passed
**End-to-End**: ___/1 test passed
**Performance**: ___/3 tests passed
**Mobile**: ___/3 tests passed

**Total**: ___/43 tests passed

**Overall Status**: [ ] PASS [ ] FAIL

---

## Sign-Off

**Tested By**: _______________
**Date**: _______________
**Environment**: [ ] Development [ ] Staging [ ] Production
**Build Version**: _______________

**Notes**:
_____________________________________________
_____________________________________________
_____________________________________________
_____________________________________________

**Approval**:
- [ ] Ready for deployment
- [ ] Needs fixes (see notes)
- [ ] Re-test required

---

## Appendix: Test Data Reset

To reset test data between test runs:

```sql
-- Clear guest activities
DELETE FROM post_reactions;
DELETE FROM post_comments;
DELETE FROM guest_posts;
DELETE FROM guest_photos WHERE status = 'pending';

-- Reset invitation progress
UPDATE invitations SET
  rsvp_completed = false,
  gift_selected = false,
  photos_uploaded = false,
  opened_at = NULL,
  open_count = 0;
```

**WARNING**: Only run in development environment!

---

**End of Testing Guide**
