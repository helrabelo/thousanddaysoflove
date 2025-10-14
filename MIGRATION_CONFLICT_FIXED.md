# Migration Conflict Fixed

## Problem
Two migrations numbered `020` causing duplicate key error:
```
ERROR: duplicate key value violates unique constraint "schema_migrations_pkey"
Key (version)=(020) already exists.
```

## Conflicting Files
1. ✅ `020_add_sanity_gift_id.sql` - KEPT (important: adds sanity_gift_id to payments)
2. ❌ `020_homepage_features.sql` - DELETED (deprecated: creates tables that are dropped anyway)

## Why Delete 020_homepage_features.sql?
- Creates `homepage_features` and `homepage_section_settings` tables
- Migration 022 (`drop_duplicate_tables.sql`) immediately drops these tables
- Content is managed in Sanity CMS instead
- No point creating tables just to drop them

## Solution
✅ **Deleted** `supabase/migrations/020_homepage_features.sql`

Now `020_add_sanity_gift_id.sql` is the only migration 020, fixing the conflict.

---

## Ready to Run!

```bash
# 1. Backup
supabase db dump -f backup-$(date +%Y%m%d).sql

# 2. Run migrations (will work now)
supabase migration up

# 3. Test
npm run dev
```

All conflicts resolved! 🎉
