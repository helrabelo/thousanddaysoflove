# Quick Comparison: Photo vs Post Reactions/Comments

## At a Glance

```
PHOTO SYSTEM (Gallery)          POST SYSTEM (Social Feed)
─────────────────────────────   ──────────────────────────
Tables:                          Tables:
- photo_reactions                - post_reactions
- photo_comments                 - post_comments
- guest_photos                   - guest_posts

Uses: guest_session_id           Uses: guest_name string
Location: /galeria               Locations: /mensagens, /ao-vivo
Components: PhotoReactions       Components: PostCard + CommentThread
           PhotoComments         
Service: photo-interactions.ts   Service: messages/client.ts
```

## Feature Comparison Matrix

| Feature | Photo | Post | Notes |
|---------|-------|------|-------|
| **Reactions** | ✅ (5 types) | ✅ (5 types) | Same emoji set: heart, clap, laugh, celebrate, love |
| **Nested Comments** | ✅ | ✅ | Both support parent_comment_id |
| **Threading Depth** | Unlimited | 3 levels max | Post system enforces depth limit |
| **One Per User** | ✅ (per session) | ✅ (per name) | Photo: UNIQUE(photo_id, guest_session_id), Post: UNIQUE(post_id, guest_name) |
| **Auto Count** | ✅ | ✅ | DB triggers handle it automatically |
| **Real-time Updates** | Polling | Subscriptions | Post system has WebSocket support |
| **Comment Char Limit** | 1000 | 1000 | Enforced at DB level |
| **Admin Delete** | ✅ | ✅ | No user delete (admin only) |
| **Media Support** | Photos/Videos | Images/Videos/Text/Mixed | Post system tracks post_type |
| **Moderation** | Simple (approved/pending) | Full (pending/approved/rejected) | Post system has moderation_reason |

## Database Field Differences

### Photo Reactions
```sql
CREATE TABLE photo_reactions (
  photo_id UUID,           -- What it's attached to
  guest_session_id UUID,   -- WHO reacted (session-based)
  guest_name TEXT,         -- Display name
  reaction_type TEXT,      -- The emoji
  created_at TIMESTAMPTZ
)
```

### Post Reactions
```sql
CREATE TABLE post_reactions (
  post_id UUID,            -- What it's attached to
  guest_session_id UUID,   -- WHO reacted (session-based)
  guest_name TEXT,         -- Display name (string-based lookup)
  reaction_type TEXT,      -- The emoji
  created_at TIMESTAMPTZ
)
```

**Key Difference**: Photo system uses `guest_session_id` for uniqueness, Post system uses `guest_name`

## Service Layer API Comparison

### Photo Reactions
```typescript
// Add a reaction
addPhotoReaction(
  photoId: string,
  reactionType: ReactionType,
  guestSessionId: string,    // Session-based
  guestName: string
)

// Check user's reaction
getUserPhotoReaction(
  photoId: string,
  guestSessionId: string     // Session-based lookup
)

// Get counts by type
getPhotoReactionCounts(
  photoId: string
): Record<ReactionType, number>
```

### Post Reactions
```typescript
// Add a reaction
addReaction(
  post_id: string,
  guest_name: string,        // Name-based
  reaction_type: ReactionType
)

// Check user's reaction
getGuestReaction(
  postId: string,
  guestName: string          // Name-based lookup
)

// Get all reactions (no aggregation)
getPostReactions(
  postId: string
): PostReaction[]
```

## Component Integration

### Photo System
```
PhotoCard
├── PhotoReactions (standalone component)
├── PhotoComments (standalone component)
└── Uses separate service functions
```

### Post System
```
PostCard (handles everything)
├── Reaction display (inline logic)
├── Reaction picker (inline logic)
├── CommentThread (separate component)
└── Uses service functions
```

## Usage Example: Adding a Reaction

### Photo
```typescript
// In PhotoReactions.tsx
const result = await addPhotoReaction(
  photoId,
  'heart',
  guestSessionId,  // From guest_sessions table
  guestName        // Display name
)

// Unique constraint prevents duplicates
// One reaction per (photoId, guestSessionId) pair
```

### Post
```typescript
// In PostCard.tsx
const result = await addReaction({
  post_id: postId,
  guest_name: guestName,    // String-based
  reaction_type: 'heart'
})

// Unique constraint prevents duplicates
// One reaction per (post_id, guest_name) pair
```

## Usage Example: Getting Comments

### Photo
```typescript
// In PhotoComments.tsx
const comments = await getPhotoComments(photoId)

// Returns flat array, builds tree in component
// Finds parent_comment_id relationships
// Supports unlimited nesting
```

### Post
```typescript
// In CommentThread.tsx
const comments = await getPostComments(postId)

// Returns flat array, builds tree in component
// Enforces max 3 levels of nesting
// Has depth limit safety check
```

## Real-time Capabilities

### Photo System
- No built-in real-time
- Uses polling/refresh on-demand
- PhotoComments loads when user opens panel
- PhotoReactions loads when component mounts

### Post System
- Built-in real-time subscriptions
- Supabase channels for instant updates
- LivePostStream subscribes to guest_posts
- Also subscribes to guest_photos (converted to posts)
- "New posts available" banner when scrolled away

## Migration Paths

### If Unified System Needed
```
1. Rename tables:
   - photo_reactions → photo_interactions
   - photo_comments → interactions_comments
   - Distinguish by polymorphic "object_type" field

2. Consolidate services:
   - Create unified interactions service
   - Handle both photo_id and post_id via polymorphic key

3. Merge components:
   - Create unified ReactionsDisplay component
   - Create unified CommentsDisplay component
   - Use polymorphic queries

4. Update routes:
   - /galeria uses unified components
   - /mensagens uses unified components
   - /ao-vivo uses unified components
```

## Current Strengths

### Photo System
- Session-based identification (more secure)
- Simple and focused
- Works well for gallery use case
- Clear separation from posts

### Post System
- Real-time capabilities
- More complex metadata (moderation, timeline_event_id)
- Better for social feed
- Supports guest photo integration

## Current Weaknesses

### Photo System
- No real-time subscriptions
- Requires polling for live updates
- No moderation metadata

### Post System
- Name-based (less secure than sessions)
- Not integrated with guest_sessions
- Harder to prevent multi-account reactions

## Consistency Notes

Both systems:
- Use same 5 reaction types
- Have 1000 char comment limit
- Support nested comments
- Auto-update counts via triggers
- Use same RLS policies

One reaction per user is enforced differently:
- Photo: `UNIQUE(photo_id, guest_session_id)`
- Post: `UNIQUE(post_id, guest_name)` (but also has guest_session_id)

## Testing Checklist

### Photo System (/galeria)
- [ ] Login at `/dia-1000/login`
- [ ] Upload photo at `/dia-1000/upload`
- [ ] Approve at `/admin/photos`
- [ ] See reactions/comments at `/galeria`
- [ ] Test emoji picker
- [ ] Test comment reply
- [ ] Verify counts update

### Post System (/mensagens, /ao-vivo)
- [ ] Create post at `/mensagens`
- [ ] Approve at `/admin/posts`
- [ ] See in `/mensagens` feed
- [ ] See in `/ao-vivo` live feed
- [ ] Test emoji reactions
- [ ] Test nested comments
- [ ] Verify real-time updates

## Future Improvements

### Photo System
1. Add real-time subscriptions (like Post system)
2. Add moderation metadata (like Post system)
3. Consider session-based access control

### Post System
1. Migrate from guest_name to guest_session_id
2. Add proper session validation
3. Consider polymorphic type handling

### Both Systems
1. Unified interaction analytics
2. Export interaction data
3. Advanced moderation filters
4. User mention/tagging support
5. Rich text comments (markdown/formatting)
6. Comment editing capability
7. Reaction analytics by type

## File Quick Reference

| What | Photo | Post |
|------|-------|------|
| Service | photo-interactions.ts | messages/client.ts |
| Reactions UI | PhotoReactions.tsx | PostCard.tsx (inline) |
| Comments UI | PhotoComments.tsx | CommentThread.tsx |
| Types | Types in service file | Types in wedding.ts |
| Migration | 20251019000000_add_... | 024_invitations_and... |
| Page | galeria/page.tsx | mensagens/page.tsx, ao-vivo/page.tsx |

---

**Last Updated**: 2025-10-28
**Status**: Both systems fully functional and independent
**Next Phase**: Consider unified interaction system for consistency
