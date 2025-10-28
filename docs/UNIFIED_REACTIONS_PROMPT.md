# Unified Reactions/Comments System - Implementation Prompt

## Context

I'm working on a wedding website (Thousand Days of Love) that has two separate systems for reactions and comments:

1. **Photo System** (`photo_reactions`, `photo_comments`) - Used for guest-uploaded photos in `/galeria` and `/dia-1000`
2. **Post System** (`post_reactions`, `post_comments`) - Used for social feed posts in `/mensagens` and `/ao-vivo`

**Current Problem**: If a user reacts to a guest photo in `/galeria`, that reaction doesn't show up when viewing the same photo in `/dia-1000/upload`. They're completely separate systems.

**Goal**: Unify these systems so that reactions and comments work across ALL media types (guest photos, Sanity gallery images, and social posts) and display consistently everywhere.

---

## Current Architecture

### Photo System (Guest Photos)
**Location**: `/src/lib/supabase/photo-interactions.ts` (350 lines)

**Database Tables**:
```sql
photo_reactions (
  id, photo_id, reaction_type, guest_session_id, guest_name, created_at
)
photo_comments (
  id, photo_id, comment_text, guest_session_id, guest_name, parent_id, created_at
)
```

**Components**:
- `PhotoReactions.tsx` - Displays 5 emoji reactions (❤️ 👏 😂 🎉 💕)
- `PhotoComments.tsx` - Displays nested comment threads

**Auth**: Session-based (`guest_session_id`)
**Real-time**: Polling-based updates

### Post System (Social Feed)
**Location**: `/src/lib/supabase/messages/` (client.ts, admin.ts)

**Database Tables**:
```sql
post_reactions (
  id, post_id, reaction_type, guest_session_id, guest_name, created_at
)
post_comments (
  id, post_id, comment_text, guest_session_id, guest_name, parent_id, created_at
)
```

**Components**:
- `PostCard.tsx` - Displays posts with reactions and comments
- `CommentThread.tsx` - Nested comment threading (max 3 levels)

**Auth**: Name-based (`guest_name`)
**Real-time**: WebSocket subscriptions via `live.ts`

---

## Proposed Unified System

### New Database Tables

```sql
-- Unified reactions table (replaces photo_reactions + post_reactions)
CREATE TABLE media_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  media_type TEXT NOT NULL, -- 'guest_photo' | 'sanity_image' | 'guest_post'
  media_id TEXT NOT NULL, -- Photo ID, Sanity image ID, or Post ID
  reaction_type TEXT NOT NULL, -- '❤️' | '👏' | '😂' | '🎉' | '💕'
  guest_session_id UUID, -- For session-based auth (preferred)
  guest_name TEXT, -- For name-based auth (fallback)
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT guest_auth_check CHECK (guest_session_id IS NOT NULL OR guest_name IS NOT NULL),
  CONSTRAINT unique_media_reaction UNIQUE (media_type, media_id, guest_session_id, guest_name, reaction_type)
);

-- Unified comments table (replaces photo_comments + post_comments)
CREATE TABLE media_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  media_type TEXT NOT NULL, -- 'guest_photo' | 'sanity_image' | 'guest_post'
  media_id TEXT NOT NULL, -- Photo ID, Sanity image ID, or Post ID
  comment_text TEXT NOT NULL,
  guest_session_id UUID, -- For session-based auth (preferred)
  guest_name TEXT, -- For name-based auth (fallback)
  parent_id UUID REFERENCES media_comments(id) ON DELETE CASCADE, -- For threading
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT guest_auth_check CHECK (guest_session_id IS NOT NULL OR guest_name IS NOT NULL),
  CONSTRAINT comment_length_check CHECK (char_length(comment_text) <= 1000)
);

-- Indexes for performance
CREATE INDEX idx_media_reactions_lookup ON media_reactions(media_type, media_id);
CREATE INDEX idx_media_comments_lookup ON media_comments(media_type, media_id);
CREATE INDEX idx_media_comments_threading ON media_comments(parent_id);
```

### Migration Strategy

**Phase 1**: Create new tables and service layer
**Phase 2**: Migrate existing data from old tables
**Phase 3**: Update all components to use unified system
**Phase 4**: Test thoroughly, then drop old tables

---

## Implementation Tasks

### Task 1: Database Setup (30 min)
**File**: `supabase/migrations/028_unified_media_interactions.sql`

Create:
- `media_reactions` table with proper indexes
- `media_comments` table with proper indexes
- Database functions for counting reactions/comments
- Triggers for automatic count updates
- RLS policies for public read, authenticated write

### Task 2: Data Migration (30 min)
**File**: `supabase/migrations/029_migrate_existing_interactions.sql`

Migrate:
- `photo_reactions` → `media_reactions` (media_type='guest_photo')
- `photo_comments` → `media_comments` (media_type='guest_photo')
- `post_reactions` → `media_reactions` (media_type='guest_post')
- `post_comments` → `media_comments` (media_type='guest_post')

### Task 3: Unified Service Layer (2 hours)
**File**: `src/lib/supabase/media-interactions.ts` (new file, ~600 lines)

Create functions:
```typescript
// Reactions
export async function getMediaReactions(mediaType: MediaType, mediaId: string)
export async function addMediaReaction(mediaType: MediaType, mediaId: string, reactionType: string)
export async function removeMediaReaction(mediaType: MediaType, mediaId: string, reactionType: string)
export async function getUserReaction(mediaType: MediaType, mediaId: string)

// Comments
export async function getMediaComments(mediaType: MediaType, mediaId: string)
export async function addMediaComment(mediaType: MediaType, mediaId: string, text: string, parentId?: string)
export async function deleteMediaComment(commentId: string)
export async function getCommentThread(commentId: string)

// Real-time subscriptions
export function subscribeToMediaReactions(mediaType: MediaType, mediaId: string, callback: Function)
export function subscribeToMediaComments(mediaType: MediaType, mediaId: string, callback: Function)
```

### Task 4: Update Components (2 hours)

**Update these components to use unified service**:
1. `src/components/gallery/PhotoReactions.tsx` - Use media-interactions.ts
2. `src/components/gallery/PhotoComments.tsx` - Use media-interactions.ts
3. `src/components/messages/PostCard.tsx` - Use media-interactions.ts
4. `src/components/messages/CommentThread.tsx` - Use media-interactions.ts

**Changes needed**:
- Replace old service imports with unified service
- Pass `mediaType` parameter to all functions
- Update component props if needed
- Test that everything still works

### Task 5: TypeScript Types (30 min)
**File**: `src/types/media-interactions.ts` (new file)

Define:
```typescript
export type MediaType = 'guest_photo' | 'sanity_image' | 'guest_post';

export interface MediaReaction {
  id: string;
  media_type: MediaType;
  media_id: string;
  reaction_type: string;
  guest_session_id?: string;
  guest_name?: string;
  created_at: string;
}

export interface MediaComment {
  id: string;
  media_type: MediaType;
  media_id: string;
  comment_text: string;
  guest_session_id?: string;
  guest_name?: string;
  parent_id?: string;
  created_at: string;
  replies?: MediaComment[]; // For nested threading
}
```

### Task 6: Testing & Cleanup (1 hour)
- Test reactions on guest photos in both `/galeria` and `/dia-1000`
- Test comments on social posts
- Verify real-time updates work
- Drop old tables once verified:
  - `photo_reactions`
  - `photo_comments`
  - `post_reactions`
  - `post_comments`

---

## Key Design Decisions

### 1. Polymorphic References
✅ **Use `media_type` + `media_id` instead of foreign keys**
- More flexible than separate tables per content type
- Easy to add new media types later (videos, albums, etc.)
- Single query to get all interactions for any media

### 2. Dual Authentication Support
✅ **Support both `guest_session_id` AND `guest_name`**
- `guest_session_id` (preferred) - More secure, session-based
- `guest_name` (fallback) - For social features without sessions
- Constraint: At least one must be present

### 3. Backwards Compatibility
✅ **Keep old tables during migration period**
- Migrate data to new tables
- Update all components to use new system
- Test thoroughly before dropping old tables
- Can rollback if issues arise

### 4. Real-time Updates
✅ **Support both polling and WebSocket subscriptions**
- WebSocket for live feed (already exists)
- Polling for gallery (already exists)
- Unified service supports both patterns

---

## Documentation Reference

**Existing Analysis**: `/docs/REACTIONS_COMMENTS_OVERVIEW.md` (731 lines)
- Complete technical breakdown of both systems
- Database schemas and relationships
- Component architecture
- Data flow diagrams

**Comparison**: `/docs/REACTIONS_COMPARISON.md`
- Side-by-side feature comparison
- Similarities and differences
- Migration considerations

---

## Success Criteria

✅ React to a guest photo in `/galeria` → see same reaction in `/dia-1000`
✅ Comment on a guest photo → comment appears in both views
✅ Existing reactions/comments preserved after migration
✅ No duplicate interactions
✅ Performance maintained or improved
✅ Real-time updates work correctly
✅ All old tables successfully dropped

---

## Project Structure

```
/Users/helrabelo/code/personal/thousanddaysoflove/
├── supabase/
│   └── migrations/
│       ├── 028_unified_media_interactions.sql (create new tables)
│       └── 029_migrate_existing_interactions.sql (migrate data)
├── src/
│   ├── lib/
│   │   └── supabase/
│   │       ├── media-interactions.ts (NEW - unified service)
│   │       ├── photo-interactions.ts (existing - update to use unified)
│   │       └── messages/ (existing - update to use unified)
│   ├── components/
│   │   ├── gallery/
│   │   │   ├── PhotoReactions.tsx (update)
│   │   │   └── PhotoComments.tsx (update)
│   │   └── messages/
│   │       ├── PostCard.tsx (update)
│   │       └── CommentThread.tsx (update)
│   └── types/
│       └── media-interactions.ts (NEW - unified types)
└── docs/
    ├── REACTIONS_COMMENTS_OVERVIEW.md (existing reference)
    └── UNIFIED_REACTIONS_IMPLEMENTATION.md (create progress doc)
```

---

## Estimated Timeline

- **Phase 1** (Database): 30 minutes
- **Phase 2** (Migration): 30 minutes
- **Phase 3** (Service Layer): 2 hours
- **Phase 4** (Components): 2 hours
- **Phase 5** (Types): 30 minutes
- **Phase 6** (Testing): 1 hour

**Total**: ~6-7 hours

---

## Starting Point

Use this exact prompt to start:

> I need to implement a unified reactions/comments system for my wedding website. Currently, guest photos and social posts have separate reaction/comment tables, and reactions don't sync across views. I want to create a unified `media_reactions` and `media_comments` system that works for all media types. See `/docs/UNIFIED_REACTIONS_PROMPT.md` for complete context and implementation plan.

---

**Current Status**: Plus one removal complete (commit 065fc3b)
**Next Task**: Unified reactions/comments system
**Ready to implement**: Yes ✅
