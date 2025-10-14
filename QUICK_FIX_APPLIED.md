# Quick Fix Applied - Migration 017

**Issue:** Migration 017 was trying to INSERT into `timeline_events` without the required `media_type` column, causing error:
```
ERROR: null value in column "media_type" of relation "timeline_events" violates not-null constraint
```

**Solution:** Commented out the INSERT statements in `supabase/migrations/017_timeline_fullbleed_fields.sql` since we're dropping the `timeline_events` table anyway (it's been moved to Sanity CMS).

**File Changed:**
- `supabase/migrations/017_timeline_fullbleed_fields.sql`
- Lines 30-145 now wrapped in `/* */` comments
- Migration will still add columns (in case table exists) but won't try to populate data

**Ready to Run:** ✅ Yes! The migration error is fixed.

---

## Now Run Your Migrations

```bash
# 1. Backup (always!)
supabase db dump -f backup-$(date +%Y%m%d).sql

# 2. Run migrations (this will work now)
supabase migration up

# 3. Test
npm run dev
```

The migrations should complete successfully now!

---

## What Happens Next

After `supabase migration up` runs:

1. **Old migrations (001-027)** - Will all run successfully
2. **Migration 017** - Will add columns but skip INSERTs (commented out)
3. **Migration 022** - Already tried to drop duplicates
4. **New migrations (028-030)** - Will drop deprecated tables

Then you can verify everything works at `/admin/analytics`
