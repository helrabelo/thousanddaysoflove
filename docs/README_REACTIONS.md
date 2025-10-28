# Reactions & Comments System - Complete Documentation

This directory contains comprehensive documentation of your wedding website's reactions and comments systems.

## Documentation Files

### 1. REACTIONS_COMMENTS_OVERVIEW.md (Main Reference)
**Start here** - Complete technical overview of both systems
- Executive summary
- Database schemas (tables, indexes, triggers)
- TypeScript types
- Service layer APIs
- UI component details
- Current implementation
- Data flow diagrams
- Performance considerations
- Edge cases and notes

**Best for**: Understanding how everything fits together

### 2. REACTIONS_COMPARISON.md (Quick Reference)
Quick side-by-side comparison
- At a glance comparison
- Feature matrix
- API differences
- Component integration patterns
- Real-time capabilities
- Migration paths
- Current strengths/weaknesses
- Testing checklist

**Best for**: Comparing photo vs post systems, making quick decisions

### 3. REACTIONS_FILE_INDEX.md (Navigation Guide)
Complete file reference with absolute paths
- Core service files
- UI components
- Page files
- Type definitions
- Database migrations
- Dependency tree
- Quick lookups ("I want to...")
- Directory structure
- Line counts

**Best for**: Finding specific files, understanding code organization

## The Two Systems Explained

### System 1: Photo Reactions & Comments (Gallery)
- **Location**: `/galeria` page
- **For**: Guest-uploaded photos
- **Tables**: `photo_reactions`, `photo_comments`
- **Identification**: `guest_session_id` (secure)
- **Services**: `src/lib/supabase/photo-interactions.ts`
- **Components**: `PhotoReactions.tsx`, `PhotoComments.tsx`

### System 2: Post Reactions & Comments (Social Feed)
- **Locations**: `/mensagens`, `/ao-vivo` pages
- **For**: Guest posts/messages
- **Tables**: `post_reactions`, `post_comments`
- **Identification**: `guest_name` (string-based)
- **Services**: `src/lib/supabase/messages/client.ts`, `messages/admin.ts`
- **Components**: `PostCard.tsx`, `CommentThread.tsx`
- **Real-time**: Via Supabase channels (`live.ts`)

## Key Features (Both Systems)

- 5 emoji reaction types: ❤️ 👏 😂 🎉 💕
- Nested comment threading (parent_comment_id)
- 1000 character limit per comment
- Automatic count management (DB triggers)
- Guest session tracking
- Admin moderation capabilities
- One reaction per guest per content
- Timestamps and formatting

## Quick Start Guides

### Understanding the Code

1. **For Photo System**:
   - Start: `REACTIONS_FILE_INDEX.md` → Photo components section
   - Read: `src/lib/supabase/photo-interactions.ts`
   - See it used: `src/components/gallery/PhotoCard.tsx`

2. **For Post System**:
   - Start: `REACTIONS_FILE_INDEX.md` → Post components section
   - Read: `src/lib/supabase/messages/client.ts`
   - See it used: `src/components/messages/PostCard.tsx`

3. **For Real-time**:
   - Read: `src/lib/supabase/live.ts`
   - See it used: `src/components/live/LivePostStream.tsx`

### Adding Features

1. **New Reaction Type**:
   - Update: `photo-interactions.ts` (ReactionType)
   - Update: `messages/client.ts` (if needed)
   - Update: Migration files (CHECK constraint)
   - Update: Component REACTION_EMOJIS objects

2. **Real-time for Photos**:
   - Copy pattern from: `live.ts`
   - Create: `photo-live.ts`
   - Add subscriptions to: `PhotoReactions.tsx`, `PhotoComments.tsx`

3. **Comment Editing**:
   - Add migration to create edit tracking
   - Add service functions to photo-interactions/messages
   - Add UI for edit/save in components

### Testing

**Photo System** (`/galeria`):
1. Login: `/dia-1000/login` (password: `1000dias`)
2. Upload: `/dia-1000/upload`
3. Approve: `/admin/photos`
4. View: `/galeria`
5. Test: Reactions and comments on photos

**Post System** (`/mensagens`, `/ao-vivo`):
1. Create post at `/mensagens`
2. Approve at `/admin/posts`
3. View in `/mensagens` or `/ao-vivo`
4. Test: Reactions, comments, real-time updates

## Database Overview

### Tables Created
- `photo_reactions` - Photo emoji reactions
- `photo_comments` - Photo comments with threading
- `post_reactions` - Post emoji reactions
- `post_comments` - Post comments with threading
- `guest_photos` - (enhanced with reaction/comment counts)
- `guest_posts` - (enhanced with like/comment counts)

### Automatic Triggers
- Count updates happen automatically
- Never manually update counts
- Safe cascading deletes
- Timestamp updates on changes

### Security
- RLS policies control access
- Guests can only read approved content
- Guests can only manage their own reactions
- Admins have full access for moderation

## Performance Tips

1. **Indexing**: Both systems have comprehensive indexes
2. **Pagination**: Consider pagination for high-volume content
3. **Real-time Limits**: 200 concurrent connections per project
4. **Caching**: Consider client-side caching for reaction counts
5. **Batch Operations**: Use admin API for bulk moderation

## Troubleshooting

### Reactions not updating?
- Check guest session is valid
- Verify RLS policies
- Check browser dev tools for API errors

### Comments not appearing?
- Ensure comment is created successfully
- Check parent_comment_id for nested replies
- Verify moderation status

### Real-time not working?
- Check WebSocket connection
- Verify Supabase channel subscription
- Check fallback polling is working

## File Locations Quick Links

All files are under `/Users/helrabelo/code/personal/thousanddaysoflove/`

### Services
- `src/lib/supabase/photo-interactions.ts`
- `src/lib/supabase/messages/client.ts`
- `src/lib/supabase/messages/admin.ts`
- `src/lib/supabase/live.ts`

### Components
- `src/components/gallery/PhotoReactions.tsx`
- `src/components/gallery/PhotoComments.tsx`
- `src/components/messages/PostCard.tsx`
- `src/components/messages/CommentThread.tsx`

### Pages
- `src/app/galeria/page.tsx`
- `src/app/mensagens/page.tsx`
- `src/app/ao-vivo/page.tsx`

### Migrations
- `supabase/migrations/20251019000000_add_photo_reactions_and_comments.sql`
- `supabase/migrations/024_invitations_and_guest_posts.sql`

## Next Steps

### Short Term
- [ ] Monitor real-time performance on wedding day
- [ ] Test with high volume of concurrent guests
- [ ] Verify admin moderation workflow

### Medium Term
- [ ] Add real-time subscriptions to photo system
- [ ] Implement comment editing functionality
- [ ] Add reaction analytics dashboard

### Long Term
- [ ] Unify into single polymorphic system
- [ ] Add advanced moderation features
- [ ] Implement user mention/tagging

## Questions?

Refer to the detailed documentation files:
1. `REACTIONS_COMMENTS_OVERVIEW.md` - Comprehensive technical reference
2. `REACTIONS_COMPARISON.md` - Quick comparisons and feature matrix
3. `REACTIONS_FILE_INDEX.md` - File locations and navigation

---

**Documentation Version**: 1.0
**Last Updated**: 2025-10-28
**Status**: Complete and current
**Project**: Thousand Days of Love - Wedding Website
