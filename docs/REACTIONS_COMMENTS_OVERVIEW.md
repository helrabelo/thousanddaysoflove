# Comprehensive Overview: Reactions and Comments Implementation

## Executive Summary
Your website has **TWO SEPARATE but SIMILAR systems** for reactions and comments:

1. **Photo Comments System** - For guest-uploaded photos in the gallery (`/galeria`)
2. **Post Comments System** - For guest posts/messages on the live feed (`/ao-vivo`)

Both systems are architecturally similar but use different database tables and service layers.

---

## System 1: PHOTO REACTIONS & COMMENTS (Guest Photos)

### 1.1 Database Schema

**Tables**:
- `photo_reactions` - Individual reactions on photos
- `photo_comments` - Comments with threading support
- `guest_photos` - Main photo storage (has `reactions_count` and `comment_count` fields)

**File**: `/supabase/migrations/20251019000000_add_photo_reactions_and_comments.sql`

#### photo_reactions Table
```sql
CREATE TABLE photo_reactions (
  id UUID PRIMARY KEY
  photo_id UUID (references guest_photos)
  guest_session_id UUID (references guest_sessions)
  guest_name TEXT
  reaction_type TEXT ('heart' | 'clap' | 'laugh' | 'celebrate' | 'love')
  created_at TIMESTAMPTZ
  
  -- Constraint: One reaction per guest per photo
  UNIQUE(photo_id, guest_session_id)
)

Indexes:
- idx_photo_reactions_photo_id
- idx_photo_reactions_guest_session
- idx_photo_reactions_reaction_type
```

#### photo_comments Table
```sql
CREATE TABLE photo_comments (
  id UUID PRIMARY KEY
  photo_id UUID (references guest_photos)
  parent_comment_id UUID (references photo_comments) -- Threading
  guest_session_id UUID (references guest_sessions)
  guest_name TEXT
  content TEXT (max 1000 chars)
  created_at TIMESTAMPTZ
  updated_at TIMESTAMPTZ
)

Indexes:
- idx_photo_comments_photo_id
- idx_photo_comments_parent_id
- idx_photo_comments_created_at
```

#### Automatic Counts (via Triggers)
- `update_photo_reactions_count()` - Updates `guest_photos.reactions_count` on INSERT/DELETE
- `update_photo_comments_count()` - Updates `guest_photos.comment_count` on INSERT/DELETE

### 1.2 TypeScript Types

**File**: `src/lib/supabase/photo-interactions.ts`

```typescript
export type ReactionType = 'heart' | 'clap' | 'laugh' | 'celebrate' | 'love'

export interface PhotoReaction {
  id: string
  photo_id: string
  guest_session_id: string | null
  guest_name: string | null
  reaction_type: ReactionType
  created_at: string
}

export interface PhotoComment {
  id: string
  photo_id: string
  parent_comment_id: string | null
  guest_session_id: string | null
  guest_name: string
  content: string
  created_at: string
  updated_at: string
  replies?: PhotoComment[]
}

export interface PhotoWithInteractions {
  id: string
  title: string | null
  caption: string | null
  storage_path: string
  guest_name: string
  upload_phase: 'before' | 'during' | 'after'
  reactions_count: number
  comment_count: number
  created_at: string
}
```

### 1.3 Service Layer

**File**: `src/lib/supabase/photo-interactions.ts` (350+ lines)

**Key Functions**:

#### Reactions Management
```typescript
// Add or update a reaction
addPhotoReaction(
  photoId: string,
  reactionType: ReactionType,
  guestSessionId: string,
  guestName: string
): Promise<{ success: boolean; error?: string }>

// Remove a reaction
removePhotoReaction(
  photoId: string,
  guestSessionId: string
): Promise<{ success: boolean; error?: string }>

// Get all reactions for a photo
getPhotoReactions(photoId: string): Promise<PhotoReaction[]>

// Get reaction counts by type
getPhotoReactionCounts(photoId: string): Promise<Record<ReactionType, number>>

// Check user's reaction (guest_session_id based)
getUserPhotoReaction(
  photoId: string,
  guestSessionId: string
): Promise<ReactionType | null>
```

#### Comments Management
```typescript
// Add comment or reply
addPhotoComment(
  photoId: string,
  content: string,
  guestSessionId: string,
  guestName: string,
  parentCommentId?: string
): Promise<{ success: boolean; comment?: PhotoComment; error?: string }>

// Get all comments with nested replies
getPhotoComments(photoId: string): Promise<PhotoComment[]>

// Delete comment (admin only)
deletePhotoComment(commentId: string): Promise<{ success: boolean; error?: string }>
```

#### Statistics
```typescript
// Get photos with reaction/comment counts
getPhotosWithInteractions(phase?: 'before' | 'during' | 'after'): Promise<PhotoWithInteractions[]>
```

### 1.4 UI Components

#### PhotoReactions Component
**File**: `src/components/gallery/PhotoReactions.tsx` (225 lines)

**Features**:
- Reaction picker button with 5 emoji options
- One reaction per guest per photo (toggle to remove)
- Real-time count display per reaction type
- Tooltip labels
- Hover animations
- Guest session requirement

**Props**:
```typescript
interface PhotoReactionsProps {
  photoId: string
  guestSessionId: string | null
  guestName: string
  initialCount?: number
}
```

#### PhotoComments Component
**File**: `src/components/gallery/PhotoComments.tsx` (289 lines)

**Features**:
- Comment thread panel (modal on mobile, dropdown on desktop)
- Nested replies with indentation
- Comment input with 1000 char limit
- Load on-demand (only loads when panel opened)
- Guest session requirement
- Time ago display using `formatTimeAgo()`

**Props**:
```typescript
interface PhotoCommentsProps {
  photoId: string
  guestSessionId: string | null
  guestName: string
  initialCount?: number
}
```

#### PhotoCard Component
**File**: `src/components/gallery/PhotoCard.tsx` (142 lines)

**Where Reactions/Comments Display**:
- Bottom of card with flex layout
- Side-by-side positioning
- Integrated with photo metadata

```typescript
<div className="flex items-center gap-2 pt-2">
  <PhotoReactions ... />
  <PhotoComments ... />
</div>
```

### 1.5 Current Usage Location

**Page**: `/galeria` (Gallery page)

**File**: `src/app/galeria/page.tsx`
- Server component that fetches approved guest photos by phase
- Passes `guestPhotosByPhase` to `GuestPhotosSection`

**Component**: `src/components/gallery/GuestPhotosSection.tsx` (217 lines)
- Client component that loads guest session
- Displays photos in grid
- Renders `PhotoCard` for each photo
- Each `PhotoCard` includes `PhotoReactions` and `PhotoComments`

---

## System 2: POST REACTIONS & COMMENTS (Guest Posts)

### 2.1 Database Schema

**Tables**:
- `post_reactions` - Reactions on posts
- `post_comments` - Nested comments on posts
- `guest_posts` - Main post storage (has `likes_count` and `comments_count`)

**File**: `/supabase/migrations/024_invitations_and_guest_posts.sql`

#### post_reactions Table
```sql
CREATE TABLE post_reactions (
  id UUID PRIMARY KEY
  post_id UUID (references guest_posts)
  guest_session_id UUID (references guest_sessions)
  guest_name TEXT
  reaction_type TEXT ('heart' | 'clap' | 'laugh' | 'celebrate' | 'love')
  created_at TIMESTAMPTZ
  
  -- Constraint: One reaction per guest per post
  UNIQUE(post_id, guest_session_id)
)

Indexes: Identical to photo_reactions
```

#### post_comments Table
```sql
CREATE TABLE post_comments (
  id UUID PRIMARY KEY
  post_id UUID (references guest_posts)
  parent_comment_id UUID (references post_comments) -- Threading
  guest_session_id UUID (references guest_sessions)
  guest_name TEXT
  content TEXT (max 1000 chars)
  created_at TIMESTAMPTZ
  updated_at TIMESTAMPTZ
)

Indexes: Similar to photo_comments
```

#### Automatic Counts
- Triggers update `guest_posts.likes_count` and `comments_count`

### 2.2 TypeScript Types

**File**: `src/types/wedding.ts` (lines 531-594)

```typescript
export interface GuestPost {
  id: string
  guest_session_id?: string
  guest_name: string
  content: string
  post_type: 'text' | 'image' | 'video' | 'mixed'
  media_urls?: string[]
  timeline_event_id?: string | null
  
  // Moderation
  status: 'pending' | 'approved' | 'rejected'
  moderation_reason?: string
  moderated_at?: string
  moderated_by?: string
  
  // Engagement
  likes_count: number
  comments_count: number
  
  // Metadata
  created_at: string
  updated_at: string
}

export interface PostReaction {
  id: string
  post_id: string
  guest_session_id?: string
  guest_name?: string
  reaction_type: 'heart' | 'clap' | 'laugh' | 'celebrate' | 'love'
  created_at: string
}

export interface PostComment {
  id: string
  post_id: string
  parent_comment_id?: string
  guest_session_id?: string
  guest_name: string
  content: string
  created_at: string
  updated_at: string
}
```

### 2.3 Service Layers

**Files**:
- `src/lib/supabase/messages/client.ts` - Guest-facing operations
- `src/lib/supabase/messages/admin.ts` - Admin operations

**Key Functions** (client.ts):

```typescript
// Posts
getApprovedPosts(options?: { 
  limit?: number
  offset?: number
  post_type?: string
}): Promise<GuestPost[]>

// Reactions (guest-name based, NOT session-based)
addReaction(reaction: {
  post_id: string
  guest_name: string
  reaction_type: 'heart' | 'clap' | 'laugh' | 'celebrate' | 'love'
}): Promise<PostReaction | null>

removeReaction(postId: string, guestName: string): Promise<boolean>

// Comments
createComment(comment: {
  post_id: string
  guest_name: string
  content: string
  parent_comment_id?: string
}): Promise<PostComment | null>

getPostComments(postId: string): Promise<PostComment[]>
getCommentReplies(commentId: string): Promise<PostComment[]>
getPostReactions(postId: string): Promise<PostReaction[]>
getGuestReaction(postId: string, guestName: string): Promise<PostReaction | null>
```

### 2.4 UI Components

#### PostCard Component
**File**: `src/components/messages/PostCard.tsx` (250+ lines)

**Features**:
- Display post with media carousel (if image/video)
- Guest attribution with timestamp
- 5-type reaction system
- Nested comment thread
- Reaction toggle (add/remove/change)
- Comment input with nested reply support
- Has special handling: skips reactions/comments for "guest photos" (posts with id starting with "photo-")

**Note**: PostCard has intelligent guest photo detection:
```typescript
const isGuestPhoto = post.id.startsWith('photo-');
// Skip reaction/comment features for guest photos
```

#### CommentThread Component
**File**: `src/components/messages/CommentThread.tsx` (240+ lines)

**Features**:
- Comment display with nesting (up to 3 levels deep)
- Reply functionality
- Character limit (1000 chars) with counter
- Time ago display
- Loading states
- User avatars

**Props**:
```typescript
interface CommentThreadProps {
  postId: string
  comments: PostComment[]
  currentGuestName?: string
  showInput?: boolean
  onCommentAdded?: () => void
}
```

### 2.5 Current Usage Locations

#### `/mensagens` (Messages/Feed Page)
**Components**: `PostComposer` + `PostCard` + `CommentThread`

#### `/ao-vivo` (Live Wedding Day Feed)
**File**: `src/components/live/LivePostStream.tsx` (190 lines)

**Features**:
- Real-time post subscriptions via Supabase
- "New posts available" banner when user scrolls away
- Auto-scrolls to top when new posts arrive
- Integrates with all post reactions and comments

---

## Key Differences Between Systems

| Feature | Photo System | Post System |
|---------|--------------|------------|
| **Table Names** | `photo_reactions`, `photo_comments` | `post_reactions`, `post_comments` |
| **ID Format** | Standard UUID | `photo-{uuid}` prefix for guest photos |
| **Identification** | Uses `guest_session_id` | Uses `guest_name` string |
| **One Reaction Per** | guest_session_id + photo_id | guest_name + post_id |
| **Trigger Updates** | guest_photos.reactions_count | guest_posts.likes_count |
| **Main Pages** | /galeria | /mensagens, /ao-vivo |
| **Components** | PhotoReactions, PhotoComments | PostCard, CommentThread |
| **Service File** | photo-interactions.ts | messages/client.ts, messages/admin.ts |
| **Guest Photo Support** | Native (main use case) | Converted via `transformGuestPhotoToPost()` |

---

## Authentication Model

### Guest Session vs Guest Name

**Photo System** (uses `guest_session_id`):
- More secure - session-based
- Stored in `guest_sessions` table
- Created during `/dia-1000/login`
- One reaction per session per photo
- Better for preventing duplicate reactions

**Post System** (uses `guest_name` string):
- Name-based identification
- No session requirement (though sessions exist)
- One reaction per name per post
- Lighter weight

```typescript
// Photo reactions
addPhotoReaction(photoId, reactionType, guestSessionId, guestName)

// Post reactions
addReaction({ post_id, guest_name, reaction_type })
```

---

## RLS (Row Level Security) Policies

### Photo Reactions & Comments
```sql
-- Public read access for approved photos
CREATE POLICY "Anyone can view reactions on approved photos"
  ON photo_reactions FOR SELECT
  USING (photo is approved)

CREATE POLICY "Guests can manage their own reactions"
  ON photo_reactions FOR ALL USING (true)
```

### Post Reactions & Comments
- Similar policies: public read for approved posts
- Guests can create/manage their reactions and comments

---

## Current Integration Points

### Gallery Page Flow
```
/galeria/page.tsx (Server)
  ↓ (fetches approved photos by phase)
GuestPhotosSection.tsx (Client)
  ↓ (loads guest session, renders grid)
PhotoCard.tsx (for each photo)
  ├─ PhotoReactions.tsx (reactions system)
  └─ PhotoComments.tsx (comments system)
```

### Messages/Live Feed Flow
```
/mensagens/page.tsx OR /ao-vivo/page.tsx
  ↓ (fetches approved posts)
PostCard.tsx (for each post)
  ├─ Reactions display/management (inline in PostCard)
  └─ CommentThread.tsx (nested comment system)
```

---

## Data Flow Diagrams

### Adding a Reaction (Photo)
```
PhotoReactions.tsx (onClick)
  ↓
addPhotoReaction(photoId, reactionType, guestSessionId, guestName)
  ↓ (photo-interactions.ts)
Supabase client.from('photo_reactions').insert()
  ↓
Database triggers update guest_photos.reactions_count
  ↓
Component state updated locally
  ↓
getPhotoReactionCounts() refreshes UI counts
```

### Adding a Comment (Photo)
```
PhotoComments.tsx (submit button)
  ↓
addPhotoComment(photoId, content, guestSessionId, guestName, parentCommentId?)
  ↓ (photo-interactions.ts)
Supabase client.from('photo_comments').insert()
  ↓
Database triggers update guest_photos.comment_count
  ↓
getPhotoComments() fetches nested structure
  ↓
Component renders updated comment tree
```

### Adding a Reaction (Post)
```
PostCard.tsx (reaction picker)
  ↓
addReaction({ post_id, guest_name, reaction_type })
  ↓ (messages/client.ts)
Supabase client.from('post_reactions').insert()
  ↓
Database triggers update guest_posts.likes_count
  ↓
Component refreshes reaction list via getPostReactions()
```

### Real-time Post Feed
```
LivePostStream.tsx mounts
  ↓
subscribeToNewPosts() creates Supabase channel
  ↓
Listens for INSERT/UPDATE on guest_posts (approved status)
  ↓
Also listens for INSERT on guest_photos (converts to posts)
  ↓
New posts appear in feed instantly
  ↓
User can add reactions/comments immediately
```

---

## Edge Cases & Notes

### 1. Guest Photo Handling in Post System
Posts that originate from guest photos are transformed:
```typescript
// Converts guest_photos row to GuestPost-like object
transformGuestPhotoToPost(photo: GuestPhotoRow): GuestPost
// Gives it id "photo-{uuid}"
```

PostCard component detects these and skips reactions/comments:
```typescript
const isGuestPhoto = post.id.startsWith('photo-');
if (!isGuestPhoto) {
  loadReactions();
  loadComments();
}
```

This prevents duplicate interaction systems.

### 2. Comment Threading
Both systems support nested replies (parent_comment_id):
- Photo comments: Full recursive tree building
- Post comments: Full recursive tree building
- Max depth: 3 levels (enforced in PostComment component)

### 3. Character Limits
- Photo comments: 1000 chars max
- Post comments: 1000 chars max
- Enforced at database level with CHECK constraint

### 4. Count Updates
- Automatic via database triggers
- Counts are denormalized for performance
- `guests_photos.reactions_count` and `comment_count`
- `guest_posts.likes_count` and `comments_count`

### 5. No Delete Support
- Photo comments: Admin-only deletion via `deletePhotoComment()`
- Post comments: Currently no UI for deletion (admin only)
- Reactions: Can be removed by user or admin

---

## Performance Considerations

### Indexing Strategy
Both systems have comprehensive indexes:
- `(photo_id, guest_session_id)` - Fast unique constraint checks
- `(photo_id)` - Gallery grid queries
- `(guest_session_id)` - User's personal reactions
- `(reaction_type)` - Filtering by emoji type
- `(created_at)` - Chronological ordering

### Query Performance
- Photo reactions count: Aggregated in memory (not DB query)
- Photo comments: Full tree built in memory from flat query
- Both use client-side state management to avoid re-fetches

### Real-time Performance
- Live feed uses Supabase channels (WebSocket)
- 200 concurrent connection limit
- Fallback polling every 30 seconds

---

## Consistency & Validation

### Unique Constraints
- One reaction per guest per photo: `UNIQUE(photo_id, guest_session_id)`
- One reaction per guest per post: `UNIQUE(post_id, guest_session_id)` (photo system)

### Check Constraints
- Comment content: `length > 0 AND length <= 1000`
- Reaction type: Must be one of 5 emojis
- Photo media: Array max 10 items

### Trigger Functions
All count updates happen automatically via PL/pgSQL triggers:
- Never manually update counts
- Counts are always accurate
- Handles INSERT/DELETE/CASCADE

---

## Testing the Systems

### Photo System
1. Go to `/dia-1000/login` → login with `1000dias`
2. Go to `/dia-1000/upload` → upload a test photo
3. Go to `/admin/photos` → approve the photo
4. Go to `/galeria` → see photo with reaction/comment controls

### Post System
1. Go to `/mensagens` → compose a test post
2. Go to `/admin/posts` → approve the post
3. Go to `/mensagens` or `/ao-vivo` → see post with reactions/comments
4. Try adding reactions and comments

### Real-time
1. Open `/ao-vivo` in two browser windows
2. Post something in one window
3. See it appear instantly in the other

---

## Files Summary

### Core Service Files
- `src/lib/supabase/photo-interactions.ts` (350 lines) - Photo reactions/comments service
- `src/lib/supabase/messages/client.ts` (200+ lines) - Post reactions/comments service
- `src/lib/supabase/live.ts` (520 lines) - Real-time subscriptions

### Component Files
- `src/components/gallery/PhotoReactions.tsx` (225 lines)
- `src/components/gallery/PhotoComments.tsx` (289 lines)
- `src/components/gallery/PhotoCard.tsx` (142 lines)
- `src/components/messages/PostCard.tsx` (250+ lines)
- `src/components/messages/CommentThread.tsx` (240+ lines)

### Page Files
- `src/app/galeria/page.tsx`
- `src/app/mensagens/page.tsx` (implied)
- `src/app/ao-vivo/page.tsx` (implied)

### Migration Files
- `supabase/migrations/20251019000000_add_photo_reactions_and_comments.sql`
- `supabase/migrations/024_invitations_and_guest_posts.sql`

### Type Files
- `src/types/wedding.ts` (GuestPost, PostReaction, PostComment)
- `src/lib/supabase/photo-interactions.ts` (PhotoReaction, PhotoComment, ReactionType)

---

## Summary

You have a **well-architected dual system** for handling reactions and comments:
- **Photo system**: Session-based, for gallery images
- **Post system**: Name-based, for social feed posts
- Both support **nested threaded comments**
- Both have **5-type emoji reactions**
- Both use **automatic count triggers**
- Both feature **real-time capabilities**
- Both maintain **clean separation of concerns**

The systems are designed to be **independent but compatible**, allowing guests to interact with content across multiple surfaces (gallery, messages feed, live wedding day feed) without conflicts.
