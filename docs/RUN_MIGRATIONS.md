# Database Cleanup Migration Instructions

**Date:** 2025-10-14
**Status:** Ready to run
**Estimated time:** 10 minutes total

## ✅ Prerequisites (Already Done)

- [x] Analytics page updated (no longer queries `timeline_events`)
- [x] Enhanced guests service archived
- [x] Migration files created (028, 029, 030)

---

## 🎯 When You Need to Run Migrations

Run these migrations to clean up your database and remove deprecated tables. This will:
- Free up 3-8 MB of database storage
- Remove confusion about which tables are active
- Clean up schema for easier maintenance

---

## 📋 Step-by-Step Instructions

### 🔴 IMPORTANT: Backup First!

**Local development:**
```bash
# Create backup of current database state
supabase db dump -f backup-$(date +%Y%m%d).sql

# This creates: backup-20251014.sql
```

**Production (if needed later):**
```bash
# Use Supabase dashboard to create backup
# Dashboard → Database → Backups → Create Backup
```

---

### Migration 028: Old Guest System ✅ SAFE TO RUN

**What it drops:**
- `guests` (old complex guest table)
- `family_groups` (family grouping system)
- `invitation_codes` (old invitation codes)
- `email_logs` (email tracking)
- `rsvp_analytics` (analytics)

**Verification:** Checks that `simple_guests`, `invitations`, `guest_sessions` exist

**Run it:**
```bash
# Local development
npm run supabase:studio  # Verify current state first
supabase migration up     # Applies migration 028

# OR manual SQL (in Supabase Studio SQL editor)
# Copy contents of: supabase/migrations/028_cleanup_old_guest_system.sql
```

**Expected output:**
```
✅ Migration 028 complete: Dropped 5 old guest system tables
   Removed: guests, family_groups, invitation_codes, email_logs, rsvp_analytics
   Active system: simple_guests, invitations, guest_sessions
```

**Test after running:**
```bash
npm run dev
# Visit: http://localhost:3000/admin/analytics
# Should load without errors
```

---

### Migration 029: Old Messaging System ⚠️ VERIFY FIRST

**What it drops:**
- `guest_messages` (old messages, replaced by `guest_posts`)
- `message_likes` (old likes, replaced by `post_reactions`)
- `moderation_queue` (generic queue, replaced by status columns)

**Verification:** Checks that `guest_posts`, `post_reactions`, `post_comments` exist

**BEFORE running, verify Phase 3 is working:**
```bash
# Check if guest_posts exists and has data
npm run supabase:studio
# Run query: SELECT COUNT(*) FROM guest_posts;
# Run query: SELECT COUNT(*) FROM post_reactions;
```

**Run it:**
```bash
supabase migration up     # Applies migration 029
```

**Expected output:**
```
✅ Migration 029 complete: Dropped 3 old messaging system tables
   Removed: guest_messages, message_likes, moderation_queue
   Active system: guest_posts, post_reactions, post_comments
```

**Test after running:**
```bash
npm run dev
# Visit: http://localhost:3000/mensagens
# Visit: http://localhost:3000/admin/posts
# Both should work without errors
```

---

### Migration 030: Config & Photo Tables ⚠️ PARTIAL

**What it drops:**
- `wedding_config` (replaced by `wedding_settings`) ✅ SAFE

**What it PAUSES for verification:**
- `photo_likes` (commented out - needs verification)
- `upload_sessions` (commented out - needs verification)

**Verification:** Checks that `wedding_settings`, `guest_photos`, `guest_sessions` exist

**BEFORE running, check usage:**
```bash
npm run supabase:studio
# Run these queries:
SELECT COUNT(*) FROM photo_likes;
SELECT COUNT(*) FROM upload_sessions;

# If both return 0 or low numbers, you can uncomment the DROP statements
```

**Run it:**
```bash
supabase migration up     # Applies migration 030 (partial)
```

**Expected output:**
```
✅ Migration 030 complete: Dropped 1 old config table
   Removed: wedding_config
   Active config: wedding_settings

⏸️  PAUSED cleanup for verification:
   - photo_likes: Check if used in activity_feed or components
   - upload_sessions: Check if redundant with guest_sessions
```

**Optional: Complete the cleanup**

If `photo_likes` and `upload_sessions` are not used:

1. Edit `supabase/migrations/030_cleanup_old_config_and_photo_tables.sql`
2. Uncomment the DROP TABLE statements (lines ~36 and 40)
3. Create a new migration:
```bash
# Create continuation migration
cat > supabase/migrations/031_complete_photo_cleanup.sql << 'EOF'
-- Complete cleanup of photo/upload tables
DROP TABLE IF EXISTS public.photo_likes CASCADE;
DROP TABLE IF EXISTS public.upload_sessions CASCADE;
EOF

# Run it
supabase migration up
```

---

## 🧪 Testing Checklist

After running ALL migrations:

- [ ] `npm run dev` starts without errors
- [ ] `/admin/analytics` page loads and shows stats
- [ ] `/admin/guests` page loads guest list
- [ ] `/convite/FAMILY001` loads personalized invitation
- [ ] `/mensagens` shows social feed
- [ ] `/admin/posts` shows post moderation
- [ ] `/galeria` shows gallery with guest photos
- [ ] `/ao-vivo` shows live feed

---

## 🔄 Rollback Plan

If something breaks:

**Local development:**
```bash
# Option 1: Reset to fresh state (loses data)
npm run db:reset

# Option 2: Restore from backup
psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" < backup-20251014.sql
```

**Production:**
```bash
# Use Supabase dashboard to restore from backup
# Dashboard → Database → Backups → Restore
```

---

## 📊 Expected Results

**Before cleanup:**
- 32 tables total
- Some confusion about which tables are active
- Potential for querying wrong tables

**After cleanup:**
- 19-23 tables (depending on photo_likes/upload_sessions decision)
- Clear separation: Sanity (content) + Supabase (transactions)
- 3-8 MB freed up

**Active tables after cleanup:**
- Guest management: `simple_guests`, `invitations`, `guest_sessions`
- Social features: `guest_posts`, `post_reactions`, `post_comments`, `pinned_posts`
- Photos: `guest_photos`, `activity_feed`
- Payments: `gifts`, `payments`
- Config: `wedding_settings`, `wedding_auth_config`

---

## 🚦 Quick Start (Run All Safe Migrations)

If you're confident and want to run all safe migrations at once:

```bash
# 1. Backup
supabase db dump -f backup-$(date +%Y%m%d).sql

# 2. Run all migrations
supabase migration up

# 3. Test
npm run dev
# Visit pages in testing checklist

# 4. If anything breaks
npm run db:reset  # OR restore from backup
```

---

## ❓ Questions?

1. **Should I run these on production?**
   - Run on local development FIRST
   - Test thoroughly
   - Then apply to production during low-traffic period
   - Always backup production first

2. **What if I want to keep old data?**
   - Export tables before dropping:
   ```bash
   pg_dump -t guests > guests_backup.sql
   pg_dump -t guest_messages > messages_backup.sql
   ```

3. **Can I skip some migrations?**
   - Yes! Each migration is independent
   - Migration 028 is the safest (old guest system)
   - Migration 029 requires Phase 3 to be working
   - Migration 030 is split (safe part + optional part)

---

**Ready to proceed?** Start with backing up, then run migrations one at a time!
