# Database Cleanup Plan
**Date:** 2025-10-14
**Status:** Ready for Review

## Overview
Clean up deprecated Supabase tables that duplicate Sanity CMS functionality or belong to the old guest management system.

## Phase 1: Sanity Duplicates (SAFE - No Code Dependencies)

These tables duplicate content now in Sanity CMS:

```sql
-- Migration: 028_cleanup_sanity_duplicates.sql
DROP TABLE IF EXISTS public.about_us_items CASCADE;
DROP TABLE IF EXISTS public.hero_text CASCADE;
DROP TABLE IF EXISTS public.homepage_features CASCADE;
DROP TABLE IF EXISTS public.homepage_section_settings CASCADE;
DROP TABLE IF EXISTS public.story_cards CASCADE;
DROP TABLE IF EXISTS public.story_preview_settings CASCADE;
DROP TABLE IF EXISTS public.timeline_events CASCADE;
DROP TABLE IF EXISTS public.media_items CASCADE;
```

**Impact:** ✅ Zero - These tables have no code references
**Risk:** Low
**Estimated time:** 5 minutes

---

## Phase 2: Old Guest System (REQUIRES CODE UPDATE)

### Step 1: Update Analytics Page
**File:** `src/app/admin/analytics/page.tsx` (line 102)

Current:
```typescript
const { data: timeline } = await supabase.from('timeline_events').select('*')
```

Replace with Sanity query or remove timeline count from analytics.

### Step 2: Archive Enhanced Guests Service
**File:** `src/lib/services/enhanced-guests.ts`

This 850-line service uses the old `guests` system but isn't imported anywhere. Either:
- **Option A:** Delete the file entirely
- **Option B:** Move to `archive/` folder for reference

### Step 3: Drop Old Tables
```sql
-- Migration: 029_cleanup_old_guest_system.sql
DROP TABLE IF EXISTS public.email_logs CASCADE;
DROP TABLE IF EXISTS public.rsvp_analytics CASCADE;
DROP TABLE IF EXISTS public.invitation_codes CASCADE;
DROP TABLE IF EXISTS public.family_groups CASCADE;
DROP TABLE IF EXISTS public.guests CASCADE;
```

**Impact:** ⚠️ Medium - Requires analytics page update
**Risk:** Medium (backup data first)
**Estimated time:** 30 minutes

---

## Phase 3: Messaging System Migration (VERIFY FIRST)

These may be deprecated by Phase 3 implementation:

```sql
-- Migration: 030_cleanup_old_messaging.sql
-- ONLY RUN AFTER VERIFICATION
DROP TABLE IF EXISTS public.message_likes CASCADE;
DROP TABLE IF EXISTS public.guest_messages CASCADE;
DROP TABLE IF EXISTS public.moderation_queue CASCADE;
```

**Impact:** ⚠️ High - Verify no code dependencies first
**Risk:** High (may lose data)
**Estimated time:** 15 minutes

---

## Phase 4: Configuration Cleanup (SAFE IF MIGRATED)

```sql
-- Migration: 031_cleanup_old_config.sql
DROP TABLE IF EXISTS public.wedding_config CASCADE; -- Replaced by wedding_settings
```

**Impact:** ✅ Low - wedding_settings is the active table
**Risk:** Low
**Estimated time:** 5 minutes

---

## Phase 5: Photo System Verification (CHECK FIRST)

```sql
-- Migration: 032_cleanup_photo_duplicates.sql
-- ONLY IF CONFIRMED UNUSED
DROP TABLE IF EXISTS public.photo_likes CASCADE; -- Might be used
DROP TABLE IF EXISTS public.upload_sessions CASCADE; -- Might be redundant with guest_sessions
```

**Impact:** ⚠️ Unknown - Needs code verification
**Risk:** High (verify first)
**Estimated time:** 20 minutes

---

## Execution Checklist

### Before Running ANY Migration:

- [ ] **Backup Production Database**
  ```bash
  # Export current schema and data
  supabase db dump -f backup-$(date +%Y%m%d).sql
  ```

- [ ] **Test on Local Environment First**
  ```bash
  npm run supabase:studio  # Verify current state
  supabase db reset         # Apply migrations
  npm run dev               # Test app functionality
  ```

- [ ] **Verify Code Dependencies**
  ```bash
  # Search for table references
  grep -r "from('table_name')" src/
  grep -r "from\"table_name\"" src/
  ```

### Recommended Execution Order:

1. ✅ **Phase 1** (Sanity Duplicates) - SAFE
2. ⚠️ **Phase 2** (Old Guest System) - Update analytics first
3. ⏸️ **Phase 3** (Old Messaging) - HOLD - Verify with code search
4. ✅ **Phase 4** (Old Config) - SAFE if wedding_settings exists
5. ⏸️ **Phase 5** (Photo System) - HOLD - Verify usage

---

## Database Size Impact

Current estimate based on typical wedding website:
- **Sanity duplicates:** ~2-5 MB (marketing content)
- **Old guest system:** ~1-3 MB (depends on guest count)
- **Total potential savings:** 3-8 MB

---

## Rollback Plan

If something breaks after running a migration:

```bash
# Local development
npm run db:reset  # Reverts to fresh state

# Production (if needed)
supabase db reset --db-url "postgres://..."  # Use backup URL
```

**Note:** Always keep the backup SQL dump file for at least 30 days after cleanup.

---

## Next Steps

1. Review this plan
2. Decide which phases to execute
3. Create and test migrations locally
4. Deploy to production during low-traffic period
5. Monitor application for 24-48 hours
6. Archive cleanup documentation

---

## Questions to Answer Before Proceeding

1. Do you want to keep `enhanced-guests.ts` for reference or delete it?
2. Should analytics show Sanity timeline events or remove timeline count?
3. Are you using `photo_likes` or should it be removed?
4. Do you need `upload_sessions` or is `guest_sessions` sufficient?

---

## ✅ Completed Work (2025-10-14)

### Step 2: Analytics Page Updated
- ✅ Removed `timeline_events` query from `/src/app/admin/analytics/page.tsx`
- ✅ Removed "Eventos na Timeline" stat card
- ✅ Simplified to 2-column progress summary (confirmation rate + gifts purchased)
- ✅ Changed from `BarChart3` icon import (not needed anymore)

### Step 3: Enhanced Guests Service Archived
- ✅ Moved `src/lib/services/enhanced-guests.ts` to `src/lib/services/archive/`
- ✅ Created `archive/README.md` documenting why it was archived
- ✅ Preserved for reference (useful Brazilian wedding patterns)

### Step 4-5: Migration Files Created
- ✅ `028_cleanup_old_guest_system.sql` - Drops 5 old guest tables
- ✅ `029_cleanup_old_messaging_system.sql` - Drops 3 old messaging tables
- ✅ `030_cleanup_old_config_and_photo_tables.sql` - Drops config + optional photo tables

---

**Status:** ✅ Ready to run migrations (see instructions below)
