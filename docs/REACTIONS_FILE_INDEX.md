# File Index: Reactions & Comments Implementation

## Absolute File Paths

### Core Service Files

#### Photo Interactions Service
**Path**: `/Users/helrabelo/code/personal/thousanddaysoflove/src/lib/supabase/photo-interactions.ts`
**Size**: ~350 lines
**Purpose**: Complete service layer for photo reactions and comments
**Key Exports**:
- `addPhotoReaction()`
- `removePhotoReaction()`
- `getPhotoReactions()`
- `getPhotoReactionCounts()`
- `getUserPhotoReaction()`
- `addPhotoComment()`
- `getPhotoComments()`
- `deletePhotoComment()`
- `getPhotosWithInteractions()`
- Types: `ReactionType`, `PhotoReaction`, `PhotoComment`, `PhotoWithInteractions`

#### Post Messages Service (Client)
**Path**: `/Users/helrabelo/code/personal/thousanddaysoflove/src/lib/supabase/messages/client.ts`
**Size**: ~200+ lines
**Purpose**: Guest-facing operations for post reactions and comments
**Key Exports**:
- `getApprovedPosts()`
- `addReaction()`
- `removeReaction()`
- `createComment()`
- `getPostComments()`
- `getCommentReplies()`
- `getPostReactions()`
- `getGuestReaction()`

#### Post Messages Service (Admin)
**Path**: `/Users/helrabelo/code/personal/thousanddaysoflove/src/lib/supabase/messages/admin.ts`
**Size**: ~200+ lines
**Purpose**: Admin operations for post moderation
**Key Exports**:
- Post moderation functions
- Batch operations
- Moderation reason tracking

#### Live Feed Service
**Path**: `/Users/helrabelo/code/personal/thousanddaysoflove/src/lib/supabase/live.ts`
**Size**: ~520 lines
**Purpose**: Real-time subscriptions for wedding day live feed
**Key Exports**:
- `subscribeToNewPosts()`
- `subscribeToReactions()`
- `subscribeToComments()`
- `subscribeToPinnedPosts()`
- Functions for real-time data management

---

### UI Components

#### Photo System Components

**PhotoReactions Component**
- **Path**: `/Users/helrabelo/code/personal/thousanddaysoflove/src/components/gallery/PhotoReactions.tsx`
- **Size**: 225 lines
- **Type**: Client component ('use client')
- **Props**: `photoId`, `guestSessionId`, `guestName`, `initialCount`
- **State**: `showPicker`, `userReaction`, `reactionCounts`, `totalCount`, `isLoading`
- **Features**: Emoji picker, count display, tooltip labels

**PhotoComments Component**
- **Path**: `/Users/helrabelo/code/personal/thousanddaysoflove/src/components/gallery/PhotoComments.tsx`
- **Size**: 289 lines
- **Type**: Client component ('use client')
- **Props**: `photoId`, `guestSessionId`, `guestName`, `initialCount`
- **Sub-components**: `CommentItem` (for nested display)
- **Features**: Comment thread modal, nested replies, character counter

**PhotoCard Component**
- **Path**: `/Users/helrabelo/code/personal/thousanddaysoflove/src/components/gallery/PhotoCard.tsx`
- **Size**: 142 lines
- **Type**: Client component ('use client')
- **Contains**: PhotoReactions + PhotoComments integration
- **Renders**: Photo image, title, caption, guest info, interactions

**GuestPhotosSection Component**
- **Path**: `/Users/helrabelo/code/personal/thousanddaysoflove/src/components/gallery/GuestPhotosSection.tsx`
- **Size**: 217 lines
- **Type**: Client component ('use client')
- **Purpose**: Photo grid with phase filtering
- **Contains**: Phase tabs, photo grid, PhotoCard mapping
- **Features**: Guest session loading, session verification

#### Post System Components

**PostCard Component**
- **Path**: `/Users/helrabelo/code/personal/thousanddaysoflove/src/components/messages/PostCard.tsx`
- **Size**: 250+ lines
- **Type**: Client component ('use client')
- **Props**: `post`, `currentGuestName`, `showComments`, `onCommentAdded`, `timelineEventTitle`
- **State**: `reactions`, `comments`, `userReaction`, `showCommentInput`, `isReacting`
- **Special**: Has guest photo detection (`post.id.startsWith('photo-')`)
- **Features**: Reaction picker, comment thread, media carousel

**CommentThread Component**
- **Path**: `/Users/helrabelo/code/personal/thousanddaysoflove/src/components/messages/CommentThread.tsx`
- **Size**: 240+ lines
- **Type**: Client component ('use client')
- **Props**: `postId`, `comments`, `currentGuestName`, `showInput`, `onCommentAdded`
- **Sub-components**: `CommentItem` (for nested display)
- **Constants**: `MAX_COMMENT_LENGTH = 1000`, `MAX_DEPTH = 3`
- **Features**: Nested replies (max 3 levels), character counter, loading states

**LivePostStream Component**
- **Path**: `/Users/helrabelo/code/personal/thousanddaysoflove/src/components/live/LivePostStream.tsx`
- **Size**: 190 lines
- **Type**: Client component ('use client')
- **Purpose**: Real-time post feed for wedding day
- **Features**: WebSocket subscriptions, "new posts" banner, auto-scroll

---

### Page Files

**Gallery Page**
- **Path**: `/Users/helrabelo/code/personal/thousanddaysoflove/src/app/galeria/page.tsx`
- **Type**: Server component
- **URL**: `/galeria`
- **Renders**: GalleryHero + GuestPhotosSection
- **Data**: Fetches `getApprovedPhotosByPhase()` server-side

**Messages Page**
- **Path**: `/Users/helrabelo/code/personal/thousanddaysoflove/src/app/mensagens/page.tsx`
- **Type**: Client component (assumed)
- **URL**: `/mensagens`
- **Renders**: PostComposer + MessagesFeed
- **Features**: Guest post creation and browsing

**Live Feed Page**
- **Path**: `/Users/helrabelo/code/personal/thousanddaysoflove/src/app/ao-vivo/page.tsx`
- **Type**: Client component (implied)
- **URL**: `/ao-vivo`
- **Renders**: LivePostStream + LiveStats + PinnedMomentsSection
- **Features**: Real-time wedding day celebration feed

---

### Type Definitions

**Wedding Types**
- **Path**: `/Users/helrabelo/code/personal/thousanddaysoflove/src/types/wedding.ts`
- **Lines**: 531-594 (PostReaction, PostComment, GuestPost types)
- **Types Defined**:
  - `GuestPost` (line 531)
  - `PostReaction` (line 559)
  - `PostComment` (line 572)
  - `PinnedPost` (line 587)

**Photo Interaction Types**
- **File**: `photo-interactions.ts` (inline)
- **Types Defined**:
  - `ReactionType` (type alias)
  - `PhotoReaction` (interface)
  - `PhotoComment` (interface)
  - `PhotoWithInteractions` (interface)

---

### Database Migrations

**Photo Reactions & Comments Migration**
- **Path**: `/Users/helrabelo/code/personal/thousanddaysoflove/supabase/migrations/20251019000000_add_photo_reactions_and_comments.sql`
- **Created**: 2025-10-19
- **Tables**: Creates `photo_reactions`, `photo_comments`
- **Columns Added**: `reactions_count`, `comment_count` to `guest_photos`
- **Triggers**: 
  - `update_photo_reactions_count()`
  - `update_photo_comments_count()`
  - `update_photo_comments_updated_at()`

**Invitations & Guest Posts Migration**
- **Path**: `/Users/helrabelo/code/personal/thousanddaysoflove/supabase/migrations/024_invitations_and_guest_posts.sql`
- **Created**: 2025-10-13
- **Tables**: Creates `guest_posts`, `post_reactions`, `post_comments`, `pinned_posts`
- **Columns Added**: `likes_count`, `comments_count` to `guest_posts`
- **Triggers**:
  - `update_likes_count_on_reaction()`
  - `update_post_comments_count()`
  - `update_post_comments_updated_at()`

---

### Configuration Files

**Environment Variables**
- **File**: `.env.local` (local development)
- **Required Variables**:
  - `NEXT_PUBLIC_SUPABASE_URL` - Used for image CDN paths
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Used for client-side Supabase

**Next.js Config**
- **Path**: `/Users/helrabelo/code/personal/thousanddaysoflove/next.config.ts`
- **Relevant**: Supabase CDN hostname configured for image optimization

---

## Dependency Tree

```
src/
├── app/
│   ├── galeria/
│   │   └── page.tsx
│   │       └── imports: GuestPhotosSection
│   ├── mensagens/
│   │   └── page.tsx
│   │       └── imports: PostComposer, MessagesFeed
│   └── ao-vivo/
│       └── page.tsx
│           └── imports: LivePostStream, LiveStats, etc.
│
├── components/
│   ├── gallery/
│   │   ├── PhotoReactions.tsx
│   │   │   └── imports: photo-interactions service
│   │   ├── PhotoComments.tsx
│   │   │   └── imports: photo-interactions service
│   │   ├── PhotoCard.tsx
│   │   │   └── imports: PhotoReactions, PhotoComments
│   │   └── GuestPhotosSection.tsx
│   │       └── imports: PhotoCard, photo-interactions service
│   │
│   ├── messages/
│   │   ├── PostCard.tsx
│   │   │   └── imports: messages/client service
│   │   └── CommentThread.tsx
│   │       └── imports: messages/client service
│   │
│   └── live/
│       └── LivePostStream.tsx
│           └── imports: live.ts service
│
├── lib/supabase/
│   ├── photo-interactions.ts
│   │   └── imports: Supabase client, types
│   ├── messages/
│   │   ├── client.ts
│   │   │   └── imports: Supabase client, types
│   │   └── admin.ts
│   │       └── imports: Supabase admin client
│   └── live.ts
│       └── imports: Supabase client, types
│
├── types/
│   └── wedding.ts
│       └── exports: PostReaction, PostComment, GuestPost
│
└── lib/utils/
    └── format.ts
        └── exports: formatTimeAgo(), etc.

supabase/
└── migrations/
    ├── 024_invitations_and_guest_posts.sql
    └── 20251019000000_add_photo_reactions_and_comments.sql
```

---

## Quick File Lookup

### I want to...

**...understand photo reactions**
- Read: `photo-interactions.ts` (full service)
- See it used: `PhotoReactions.tsx`, `PhotoCard.tsx`
- Understand schema: `20251019000000_add_...sql`

**...understand post reactions**
- Read: `messages/client.ts` (full service)
- See it used: `PostCard.tsx`, `LivePostStream.tsx`
- Understand schema: `024_invitations_and...sql`

**...add a new reaction type**
- Edit: `photo-interactions.ts` (add to `ReactionType`)
- Edit: `24_invitations_and...sql` (add to CHECK constraint)
- Update: Components that list emoji options

**...modify comment display**
- Edit: `PhotoComments.tsx` or `CommentThread.tsx`
- May need: `photo-interactions.ts` or `messages/client.ts`

**...change character limits**
- Edit: Database migration (CHECK constraint)
- Update: Component prop/state (if different)
- Sync: migration files

**...add real-time to photo system**
- Copy pattern from: `live.ts`
- Create: `photo-live.ts` service
- Update: `PhotoReactions.tsx`, `PhotoComments.tsx`

**...unify both systems**
- Start: Create `interactions.ts` service
- Consolidate: photo_reactions + post_reactions table
- Merge: PhotoReactions + PostCard components
- Update: All page files

---

## Line Count Summary

| File | Lines | Purpose |
|------|-------|---------|
| photo-interactions.ts | 350 | Photo reactions/comments service |
| PhotoReactions.tsx | 225 | Photo reactions UI |
| PhotoComments.tsx | 289 | Photo comments UI |
| PhotoCard.tsx | 142 | Photo display with interactions |
| GuestPhotosSection.tsx | 217 | Photo grid |
| PostCard.tsx | 250+ | Post display with reactions/comments |
| CommentThread.tsx | 240+ | Nested comment display |
| LivePostStream.tsx | 190 | Real-time post stream |
| messages/client.ts | 200+ | Post service (client) |
| messages/admin.ts | 200+ | Post service (admin) |
| live.ts | 520 | Real-time subscriptions |
| **TOTAL** | **~2,900** | **All interaction systems** |

---

## Database Schema Summary

### Photo Tables
- `guest_photos` - Main table
  - `reactions_count` INTEGER
  - `comment_count` INTEGER
- `photo_reactions` - Reactions table
- `photo_comments` - Comments table

### Post Tables
- `guest_posts` - Main table
  - `likes_count` INTEGER
  - `comments_count` INTEGER
- `post_reactions` - Reactions table
- `post_comments` - Comments table

---

## Navigation Guide

```
Directory Structure:
/Users/helrabelo/code/personal/thousanddaysoflove/

├── src/
│   ├── app/
│   │   ├── galeria/page.tsx ......................... Gallery (photos)
│   │   ├── mensagens/page.tsx ....................... Messages/Feed
│   │   └── ao-vivo/page.tsx ......................... Live feed
│   │
│   ├── components/
│   │   ├── gallery/
│   │   │   ├── PhotoReactions.tsx ................... Photo reaction UI
│   │   │   ├── PhotoComments.tsx ................... Photo comment UI
│   │   │   ├── PhotoCard.tsx ....................... Photo display
│   │   │   └── GuestPhotosSection.tsx .............. Photo grid
│   │   │
│   │   ├── messages/
│   │   │   ├── PostCard.tsx ........................ Post display
│   │   │   └── CommentThread.tsx .................. Comment threads
│   │   │
│   │   └── live/
│   │       └── LivePostStream.tsx ................. Real-time stream
│   │
│   ├── lib/supabase/
│   │   ├── photo-interactions.ts .................. Photo service
│   │   ├── messages/
│   │   │   ├── client.ts ......................... Post client service
│   │   │   └── admin.ts .......................... Post admin service
│   │   └── live.ts .............................. Live service
│   │
│   └── types/
│       └── wedding.ts ........................... Type definitions
│
└── supabase/
    └── migrations/
        ├── 024_invitations_and_guest_posts.sql . Post system
        └── 20251019000000_add_photo_reactions_and_comments.sql . Photo system
```

---

**Generated**: 2025-10-28
**For**: Thousand Days of Love project
**Status**: Current and accurate
