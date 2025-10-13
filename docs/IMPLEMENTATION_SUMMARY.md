# Guest Experience Implementation Summary
## Quick Reference Guide

This document provides a high-level overview of the guest experience enhancements planned for the Thousand Days of Love wedding website.

---

## Overview

Transform the wedding website from a static invitation into an interactive celebration platform with:
1. Personalized invitations with unique codes
2. Guest messaging and social feed
3. Real-time wedding day live feed
4. Guest dashboard with progress tracking

---

## The Four New Pages

### 1. `/convite` - Invitation Landing Page
**What**: Beautiful invitation page serving as primary guest entry point
**Features**:
- Generic version (public)
- Personalized version with codes (`/convite/[code]`)
- Event details, venue, dress code
- Interactive website guide
- Progress tracker for personalized invites

**Status**: Not started
**Estimated Time**: 1 week
**Dependencies**: Database (invitations table), Admin (invite management)

---

### 2. `/mensagens` - Guest Messaging Feed
**What**: Social feed where guests share messages, photos, and videos
**Features**:
- Rich post composer with emoji picker
- Multi-file upload (images + videos)
- Like/reaction system
- Comment threads
- Post moderation (admin approval)

**Status**: Not started
**Estimated Time**: 1 week
**Dependencies**: Database (guest_posts tables), Admin (post moderation)

---

### 3. `/ao-vivo` - Wedding Day Live Feed
**What**: Real-time celebration dashboard for wedding day
**Features**:
- Live post stream (Supabase real-time)
- Live photo gallery
- Confirmed guests grid
- Admin-pinned special moments
- Celebration statistics

**Status**: Not started
**Estimated Time**: 1 week
**Dependencies**: Real-time subscriptions, Admin (pin controls)

---

### 4. `/meu-convite` - Guest Dashboard
**What**: Personalized hub showing guest's progress and quick actions
**Features**:
- Completion checklist (RSVP, gifts, photos, messages)
- Event countdown timer
- Quick action buttons
- Recent activity feed
- Invite code QR code

**Status**: Not started
**Estimated Time**: 3-4 days
**Dependencies**: All other features (tracks progress)

---

## Database Changes Required

### New Tables

#### 1. `invitations` Table
Stores personalized invitation codes and guest details
```sql
Key fields:
- code (unique invite code)
- guest_id (link to guests table)
- relationship_type (family/friend/colleague)
- plus_one_allowed
- custom_message
- qr_code_url
```

#### 2. `guest_posts` Table
Stores guest messages with moderation
```sql
Key fields:
- content (max 500 chars)
- media_urls (array of Supabase Storage URLs)
- post_type (text/image/video/mixed)
- status (pending/approved/rejected)
- likes_count, comments_count
```

#### 3. `post_reactions` Table
Stores likes and reactions on posts
```sql
Key fields:
- post_id
- guest_session_id
- reaction_type (heart/clap/laugh/celebrate)
```

#### 4. `post_comments` Table
Stores comments on posts (with nested replies)
```sql
Key fields:
- post_id
- parent_comment_id (for replies)
- content (max 300 chars)
```

#### 5. `pinned_posts` Table
Stores admin-pinned special moments
```sql
Key fields:
- post_id
- moment_category (ceremony/first_dance/cake_cutting/etc)
- display_order
```

---

## Admin Features Required

### 1. Invitation Management (`/admin/convites`)
- Generate invite codes (manual or bulk CSV import)
- View invitation status (sent, opened, RSVP completed)
- Send invitation emails via SendGrid
- Track analytics (open rate, time to RSVP)

### 2. Post Moderation (`/admin/posts`)
- View pending posts with preview
- Approve/reject with keyboard shortcuts (A/R)
- Batch operations
- Pin posts as special moments
- Filter by status, type, date

---

## Implementation Phases

### Phase 1: Foundation (Week 1)
**Focus**: Invitations and onboarding
- Create all database migrations
- Build `/convite` page (generic + personalized)
- Implement invite code system
- Build `/admin/convites` management page
- Add first-visit tutorial/guide

**Deliverables**:
- Working invitation system
- Admin can generate codes
- Guests can view personalized invites
- Progress tracking functional

---

### Phase 2: Social Features (Week 2)
**Focus**: Guest messaging system
- Build post composer (rich text + emoji + file upload)
- Create `/mensagens` feed page
- Implement like/reaction/comment system
- Build `/admin/posts` moderation page
- Integrate with activity feed

**Deliverables**:
- Guests can post messages with photos/videos
- Admin can moderate posts
- Social interactions working (likes, comments)

---

### Phase 3: Live Experience (Week 3)
**Focus**: Real-time wedding day feed
- Set up Supabase real-time subscriptions
- Build `/ao-vivo` live feed page
- Implement special moments pinning
- Create celebration stats dashboard
- Mobile optimization for venue use

**Deliverables**:
- Real-time post and photo updates
- Admin can pin special moments
- Mobile-optimized for guests at venue

---

### Phase 4: Polish & Launch (Week 4)
**Focus**: Guest dashboard and navigation
- Build `/meu-convite` dashboard
- Enhanced navigation with progress indicators
- Mobile bottom nav bar
- Onboarding tooltips
- Comprehensive testing

**Deliverables**:
- Complete guest journey functional
- Mobile UX polished
- All features tested
- Ready for production launch

---

## Technical Stack

### Frontend
- **Framework**: Next.js 15.5.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **CMS**: Sanity (marketing content)
- **Database**: Supabase (transactional data)
- **Auth**: Custom guest sessions (Supabase)
- **Storage**: Supabase Storage (photos/videos)
- **Real-time**: Supabase Realtime subscriptions

### Integrations
- **Payments**: Mercado Pago (PIX)
- **Email**: SendGrid
- **Maps**: Google Maps Platform API
- **QR Codes**: qrcode library

---

## Design System

### Colors
- Background: #F8F6F3 (warm off-white)
- Text: #2C2C2C (charcoal)
- Accent: #E8E6E3 (subtle gray)
- Blush: #D97E8B (interactive elements)
- Burgundy: #5C2E2E (CTAs)

### Typography
- Headings: Playfair Display
- Body: Crimson Text
- Special: Cormorant

### Component Patterns
- Cards: White background, rounded-lg, shadow-md
- Buttons: Rounded-full, burgundy-800, hover effects
- Mobile-first responsive
- Framer Motion animations throughout

---

## Success Metrics

### Guest Engagement
- Invitation open rate: Target 85%+
- Message posting rate: Target 40%+ of guests
- Photo upload rate: Target 60%+ of guests
- Dashboard completion: Target 50%+ complete all 4 actions

### Wedding Day Performance
- Concurrent users during ceremony: Target 70%+ of guests
- Posts per hour during reception: Target 20+
- Real-time subscription success rate: 99%+

### Technical Performance
- Page load time: < 2 seconds
- Lighthouse score: 90+ for all pages
- Mobile usage: Track mobile vs desktop ratio

---

## Rollout Strategy

### Phase 1 Launch: Close Family (10-15 guests)
- Test invitation system
- Gather initial feedback
- Refine UX

### Phase 2 Launch: Extended Family & Friends (50-75 guests)
- Test social features
- Evaluate moderation workload
- Test engagement features

### Phase 3 Launch: All Guests (100+ total)
- Full feature set available
- Prepare for wedding day
- Train admin on live moderation

### Wedding Day Launch: Live at Venue
- Real-time feed active
- Admin moderating during event
- Capture moments as they happen

---

## Quick Start

Ready to implement? Use this command:

```bash
# Create feature branch
git checkout -b feature/guest-experience-phase-1

# Start with database migrations
npm run db:generate
```

Then use the prompt in the full roadmap document (`docs/GUEST_EXPERIENCE_ROADMAP.md`) to begin Phase 1 implementation.

---

## Resources

- **Full Roadmap**: `/docs/GUEST_EXPERIENCE_ROADMAP.md` (comprehensive 200+ line guide)
- **Database Schema**: All SQL migrations included in roadmap
- **Component Examples**: TypeScript code snippets provided
- **Testing Strategy**: E2E test examples included

---

## Next Steps

1. Review the full roadmap document
2. Prioritize features (all 4 phases or subset?)
3. Create database migrations (Phase 1)
4. Build invitation page (Phase 1)
5. Iterate based on guest feedback

---

**Ready to transform your wedding website into an interactive celebration platform?**

Start with Phase 1 and ship incrementally. The modular design allows you to launch features independently as they're completed.

---

**Document Version**: 1.0
**Last Updated**: October 13, 2025
**Project**: Thousand Days of Love
