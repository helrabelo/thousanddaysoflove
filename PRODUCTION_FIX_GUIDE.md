# 🚀 Fixing Supabase Cloud (Production) Database

## ⚠️ IMPORTANT: Check Your Production State First

Before making changes, determine what's in your production database:

### Step 1: Check Production Migration History

```bash
# Connect to your production database
supabase db remote --project-ref <your-project-ref>

# Check which migrations have run
supabase db remote sql "SELECT version, name, inserted_at FROM supabase_migrations.schema_migrations ORDER BY inserted_at DESC LIMIT 20"
```

This tells you which migrations are already applied.

---

## Option A: Production Has NO Important Data (Clean Reset) ⭐

**Use if:** Your production is new/testing/no real user data

### Steps:

1. **Backup (just in case)**
```bash
# Via Supabase Dashboard:
# Database → Backups → Create Backup
```

2. **Reset Production Database**
```bash
# Link to your project
supabase link --project-ref <your-project-ref>

# Reset production (⚠️ DESTROYS ALL DATA!)
supabase db reset --db-url "postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"

# OR via Dashboard:
# Settings → Database → Reset Database
```

3. **Verify**
```bash
# Run your app against production
# Check that all pages work
```

**Result:** Clean database with all fixed migrations applied ✅

---

## Option B: Production Has Important Data (Manual Fix) 🔧

**Use if:** You have real guest data, RSVPs, photos, etc.

### Strategy: Fix the Conflicts Manually

Since the problematic migrations have already partially run, you need to:

1. **Drop the broken tables** (they were going to be dropped anyway)
2. **Manually run the cleanup migrations**
3. **Skip the broken old migrations**

### Steps:

#### 1. Backup Production First! 🔴

```bash
# Via Dashboard: Database → Backups → Create Backup
# Download the backup locally
```

#### 2. Connect to Production SQL Editor

Go to: Supabase Dashboard → SQL Editor

#### 3. Run Cleanup SQL Manually

Copy and paste this SQL in the SQL Editor:

```sql
-- ============================================================================
-- MANUAL PRODUCTION CLEANUP
-- Run this in Supabase Cloud SQL Editor
-- ============================================================================

-- Drop deprecated Sanity duplicate tables (if they exist)
DROP TABLE IF EXISTS public.about_us_items CASCADE;
DROP TABLE IF EXISTS public.hero_text CASCADE;
DROP TABLE IF EXISTS public.homepage_features CASCADE;
DROP TABLE IF EXISTS public.homepage_section_settings CASCADE;
DROP TABLE IF EXISTS public.story_cards CASCADE;
DROP TABLE IF EXISTS public.story_preview_settings CASCADE;
DROP TABLE IF EXISTS public.timeline_events CASCADE;
DROP TABLE IF EXISTS public.media_items CASCADE;

-- Drop old guest system tables (if they exist)
DROP TABLE IF EXISTS public.email_logs CASCADE;
DROP TABLE IF EXISTS public.rsvp_analytics CASCADE;
DROP TABLE IF EXISTS public.invitation_codes CASCADE;
DROP TABLE IF EXISTS public.family_groups CASCADE;
DROP TABLE IF EXISTS public.guests CASCADE;

-- Drop old messaging tables (if they exist)
DROP TABLE IF EXISTS public.message_likes CASCADE;
DROP TABLE IF EXISTS public.guest_messages CASCADE;
DROP TABLE IF EXISTS public.moderation_queue CASCADE;

-- Drop old config (if exists)
DROP TABLE IF EXISTS public.wedding_config CASCADE;

-- Optional: Drop photo/upload tables if unused
-- DROP TABLE IF EXISTS public.photo_likes CASCADE;
-- DROP TABLE IF EXISTS public.upload_sessions CASCADE;

-- Verify active tables still exist
SELECT 'simple_guests' as table_name, COUNT(*) as count FROM public.simple_guests
UNION ALL
SELECT 'invitations', COUNT(*) FROM public.invitations
UNION ALL
SELECT 'guest_sessions', COUNT(*) FROM public.guest_sessions
UNION ALL
SELECT 'guest_photos', COUNT(*) FROM public.guest_photos
UNION ALL
SELECT 'guest_posts', COUNT(*) FROM public.guest_posts
UNION ALL
SELECT 'gifts', COUNT(*) FROM public.gifts
UNION ALL
SELECT 'payments', COUNT(*) FROM public.payments;
```

#### 4. Verify Your App Works

Test all critical pages:
- `/admin/analytics` - Should show stats without timeline_events
- `/admin/guests` - Should show guest list
- `/convite/FAMILY001` - Personalized invitations
- `/mensagens` - Social feed
- `/galeria` - Gallery with photos

#### 5. Mark Cleanup Migrations as "Applied"

Since you manually ran the cleanup, tell Supabase these migrations are done:

```sql
-- Mark cleanup migrations as completed (so they don't run again)
INSERT INTO supabase_migrations.schema_migrations (version, name, statements)
VALUES
  ('028', '028_cleanup_old_guest_system.sql', ARRAY[]::text[]),
  ('029', '029_cleanup_old_messaging_system.sql', ARRAY[]::text[]),
  ('030', '030_cleanup_old_config_and_photo_tables.sql', ARRAY[]::text[])
ON CONFLICT (version) DO NOTHING;
```

---

## Option C: Hybrid Approach (Recommended for Most Cases) 🎯

**Use if:** You have some data but can recreate test data if needed

### Steps:

1. **Export Important Data Only**
```sql
-- Export critical tables (RSVPs, invitations, etc.)
COPY (SELECT * FROM simple_guests) TO STDOUT WITH CSV HEADER;
COPY (SELECT * FROM invitations) TO STDOUT WITH CSV HEADER;
-- Save these CSVs
```

2. **Reset Production**
```bash
# Via Dashboard: Settings → Database → Reset Database
```

3. **Re-import Critical Data**
```sql
-- Via SQL Editor: Import your CSVs back
```

---

## How to Apply Going Forward

After fixing production, here's how to apply new migrations:

### Local → Production Flow:

```bash
# 1. Test locally first
npm run db:reset
npm run dev
# Test everything works

# 2. Push to production
git push origin main  # Deploy code

# 3. Run migrations on production
supabase db push --db-url "postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"

# OR manually via Dashboard SQL Editor
```

---

## Production Safety Checklist

Before making ANY changes to production:

- [ ] **Backup created** (Dashboard → Database → Backups)
- [ ] **Downloaded backup** (just in case)
- [ ] **Tested changes locally** (npm run db:reset worked)
- [ ] **Know your rollback plan** (restore from backup)
- [ ] **Low-traffic time** (not during peak usage)
- [ ] **Team notified** (if applicable)

---

## Emergency Rollback

If something goes wrong:

### Quick Rollback:
1. Go to Dashboard → Database → Backups
2. Click "Restore" on your pre-fix backup
3. Wait for restore to complete (usually 5-10 minutes)
4. Your app will be back to the pre-fix state

---

## What I Recommend

Based on typical wedding website usage:

**If production is fresh (< 1 week old, < 10 real guests):**
→ **Option A: Clean Reset** (fastest, cleanest)

**If production has real guest data:**
→ **Option C: Hybrid** (export critical data, reset, re-import)

**If you're risk-averse:**
→ **Option B: Manual Fix** (safest, but more complex)

---

## Need Help?

If you're unsure which option to use, tell me:
1. How old is your production database?
2. Do you have real guest RSVPs/photos?
3. How many guests have used the system?

I'll give you a specific recommendation!

---

**Next Step:** Choose your option and follow the guide. I'm here if you hit any issues! 🚀
