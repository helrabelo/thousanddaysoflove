# Unification and Deprecation Plan

## Overview
This document outlines the strategy for:
1. **Unifying reactions/comments** - Make /galeria and /dia-1000 share the same reactions/comments
2. **Deprecating +1 functionality** - Remove all plus one/acompanhante features

**Date**: 2025-10-28
**Status**: Implementation Ready

---

## Part 1: Unified Reactions/Comments System

### Current State Analysis

**Problem**: Two independent systems exist:
- **Photo System** (`photo_reactions`, `photo_comments`) - Used in /galeria
- **Post System** (`post_reactions`, `post_comments`) - Used in /mensagens, /ao-vivo

When users react/comment on guest photos, the interactions are isolated to that specific view.

### Proposed Solution

**Unified Media Interaction System** - Single set of tables for all media interactions:

```sql
-- New unified tables
media_reactions (id, media_type, media_id, reaction_type, guest_session_id, guest_name)
media_comments (id, media_type, media_id, comment_text, guest_session_id, guest_name, parent_id)

-- Where media_type can be:
-- 'guest_photo' - Guest uploaded photos
-- 'sanity_image' - Sanity CMS gallery images
-- 'guest_post' - Social feed posts
```

### Key Design Decisions

1. **Polymorphic References**: Use `media_type` + `media_id` instead of foreign keys
   - Allows multiple content types to share reactions/comments
   - More flexible than creating separate tables per content type

2. **Dual Authentication**: Support both session-based and name-based auth
   - `guest_session_id` (preferred, more secure)
   - `guest_name` (fallback for social features)
   - Constraint: At least one must be present

3. **Backwards Compatibility**: Keep old tables for migration period
   - Migrate existing data to new unified tables
   - Update all components to use new system
   - Remove old tables after verification

### Migration Strategy

**Phase 1: Create New Infrastructure**
- Create new unified tables (`media_reactions`, `media_comments`)
- Create unified service layer (`media-interactions.ts`)
- Add database functions/triggers for counts

**Phase 2: Data Migration**
- Migrate `photo_reactions` → `media_reactions` (media_type='guest_photo')
- Migrate `photo_comments` → `media_comments` (media_type='guest_photo')
- Migrate `post_reactions` → `media_reactions` (media_type='guest_post')
- Migrate `post_comments` → `media_comments` (media_type='guest_post')

**Phase 3: Component Updates**
- Update `PhotoReactions.tsx` to use unified service
- Update `PhotoComments.tsx` to use unified service
- Update `PostCard.tsx` to use unified service
- Update `CommentThread.tsx` to use unified service

**Phase 4: Cleanup**
- Verify all interactions working correctly
- Drop old tables (`photo_reactions`, `photo_comments`, `post_reactions`, `post_comments`)
- Update documentation

### Implementation Files

**New Files to Create**:
1. `/supabase/migrations/025_unified_media_interactions.sql` - New tables
2. `/supabase/migrations/026_migrate_existing_interactions.sql` - Data migration
3. `/src/lib/supabase/media-interactions.ts` - Unified service layer (600+ lines)
4. `/src/types/media-interactions.ts` - TypeScript types

**Files to Update**:
1. `/src/components/gallery/PhotoReactions.tsx` - Use unified service
2. `/src/components/gallery/PhotoComments.tsx` - Use unified service
3. `/src/components/messages/PostCard.tsx` - Use unified service
4. `/src/components/messages/CommentThread.tsx` - Use unified service

### Benefits

✅ **Unified Experience**: React to photos anywhere, see reactions everywhere
✅ **Simplified Maintenance**: One service layer, one set of components
✅ **Better Performance**: Single query across all media types
✅ **Consistent UX**: Same interaction patterns across all pages
✅ **Future Proof**: Easy to add new media types (videos, albums, etc.)

---

## Part 2: Plus One Deprecation

### Current State Analysis

**Affected Systems**: Plus one functionality spans 42 files across all layers:
- 6 database migrations
- 2 TypeScript type files
- 4 service layer files
- 4 form components
- 4 admin pages
- 6 display components
- 1 API route
- 4 page routes
- 11+ documentation files

**Database Fields to Remove**:
- `guests.plus_one` (BOOLEAN)
- `guests.plus_one_name` (VARCHAR)
- `simple_guests.plus_ones` (INTEGER)
- `simple_guests.plus_one_allowed` (BOOLEAN)
- `simple_guests.plus_one_name` (TEXT)
- `invitations.plus_one_allowed` (BOOLEAN)
- `invitations.plus_one_name` (TEXT)

### Deprecation Strategy

**Phase 1: Database Cleanup**
- Create migration to remove all plus_one columns
- Update all database functions to remove plus_one logic
- Clean up constraints and validation rules

**Phase 2: TypeScript Types**
- Remove plus_one fields from all interfaces
- Update generated database types
- Fix type errors across codebase

**Phase 3: Service Layer**
- Remove plus_one logic from all service functions
- Update API routes to remove plus_one handling
- Remove plus_one from email templates

**Phase 4: UI Components**
- Remove plus_one inputs from forms
- Remove plus_one display from all components
- Update admin interfaces to remove plus_one management

**Phase 5: Documentation**
- Update all docs to remove plus_one references
- Update CLAUDE.md activity logs
- Create deprecation notice document

### Guest Management Approach

**New Workflow**: Manage all guests individually
- Each person gets their own invitation
- No "bring a guest" option
- Cleaner guest list management
- Better seating arrangement control
- Simplified RSVP process

### Implementation Order

**Priority 1 (Critical)**:
1. Remove from database (migrations)
2. Remove from TypeScript types
3. Remove from service layer

**Priority 2 (High)**:
4. Remove from forms and RSVP
5. Remove from admin interfaces

**Priority 3 (Medium)**:
6. Remove from display components
7. Remove from documentation

**Priority 4 (Low)**:
8. Clean up seed data
9. Update comments/notes

### Affected Components List

**Forms**:
- `/src/components/forms/RsvpForm.tsx` - Remove plusOne fields
- `/src/components/invitations/RSVPQuickForm.tsx` - Remove plus one handling
- `/src/components/invitations/RSVPPromptCard.tsx` - Remove plus one display

**Admin Pages**:
- `/src/app/admin/guests/page.tsx` - Remove plus_ones field
- `/src/app/admin/analytics/page.tsx` - Remove plus one stats
- `/src/app/admin/convites/page.tsx` - Remove plus_one_allowed toggle
- `/src/app/rsvp/page.tsx` - Remove plus ones count

**Display Components**:
- `/src/components/live/GuestsGrid.tsx` - Remove plus one counting
- `/src/components/dashboard/InvitationCard.tsx` - Remove plus one display
- `/src/components/seating/SeatingChart.tsx` - Remove plus one names
- `/src/components/seating/SeatingChartPrintable.tsx` - Remove plus one display

**Services**:
- `/src/lib/services/guests.ts` - Remove plus_one handling
- `/src/lib/supabase/invitations.ts` - Remove plus_one queries
- `/src/lib/supabase/live.ts` - Remove plus_one from confirmed guests
- `/src/lib/services/email-automation.ts` - Remove plus one email logic

**API Routes**:
- `/src/app/api/invitations/submit-rsvp/route.ts` - Remove plus_one parameters

### Migration SQL Preview

```sql
-- Migration 027: Remove Plus One Functionality
BEGIN;

-- Drop plus_one columns from all tables
ALTER TABLE guests
  DROP COLUMN IF EXISTS plus_one,
  DROP COLUMN IF EXISTS plus_one_name;

ALTER TABLE simple_guests
  DROP COLUMN IF EXISTS plus_ones,
  DROP COLUMN IF EXISTS plus_one_allowed,
  DROP COLUMN IF EXISTS plus_one_name;

ALTER TABLE invitations
  DROP COLUMN IF EXISTS plus_one_allowed,
  DROP COLUMN IF EXISTS plus_one_name;

-- Update any functions that reference plus_one
DROP FUNCTION IF EXISTS get_table_guests();
CREATE OR REPLACE FUNCTION get_table_guests(table_id_param UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  relationship TEXT,
  table_id UUID,
  table_number INTEGER,
  table_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    sg.id,
    sg.name,
    sg.relationship,
    sg.table_id,
    t.table_number,
    t.table_name
  FROM simple_guests sg
  LEFT JOIN tables t ON sg.table_id = t.id
  WHERE sg.table_id = table_id_param
  ORDER BY sg.name;
END;
$$ LANGUAGE plpgsql STABLE;

COMMIT;
```

### Testing Checklist

After implementation, verify:
- [ ] All forms work without plus_one fields
- [ ] RSVP process completes successfully
- [ ] Guest list displays correctly
- [ ] Analytics show accurate counts
- [ ] Seating chart works properly
- [ ] Email templates send without errors
- [ ] No TypeScript errors
- [ ] All admin pages functional

### Rollback Plan

If issues arise:
1. Keep old migrations available
2. Backup database before migration
3. Document all removed code
4. Create revert migration if needed

---

## Implementation Timeline

### Week 1: Unified Reactions/Comments
- **Day 1-2**: Create new tables and service layer
- **Day 3-4**: Migrate existing data
- **Day 5**: Update all components
- **Day 6-7**: Testing and verification

### Week 2: Plus One Deprecation
- **Day 1-2**: Database cleanup and migrations
- **Day 3**: Remove from types and services
- **Day 4**: Update forms and admin
- **Day 5**: Update display components
- **Day 6-7**: Testing and documentation

---

## Success Metrics

**Unified Reactions/Comments**:
- ✅ Same reaction on photo appears in both /galeria and /dia-1000
- ✅ Comments sync across all views
- ✅ No duplicate interactions
- ✅ Performance maintained or improved
- ✅ All existing reactions/comments preserved

**Plus One Deprecation**:
- ✅ All database plus_one fields removed
- ✅ Zero TypeScript errors
- ✅ All forms functional without plus_one
- ✅ Guest count accurate across all pages
- ✅ RSVP process works end-to-end
- ✅ Documentation updated

---

## Questions for Review

Before implementation, confirm:
1. **Guest Photos Only?** - Should Sanity gallery images also use unified system?
2. **Migration Timing** - Migrate during low traffic or specific time?
3. **Guest Communication** - Inform guests about plus one removal?
4. **Existing Plus Ones** - What about guests already confirmed with plus ones?
5. **Rollback Window** - How long to keep old data before cleanup?

---

## Next Steps

Ready to begin implementation:

```bash
# Create feature branch
git checkout -b feature/unify-interactions-deprecate-plus-one

# Start with unified reactions/comments
# (Creates new tables, service layer)

# Then proceed with plus one deprecation
# (Database cleanup, type updates)
```

Follow this document section by section for systematic implementation.
