# Migration Naming Convention

## Standard Format (Use This for All New Migrations)

```
YYYYMMDDHHMMSS_descriptive_name.sql
```

### Examples:
- ✅ `20251017000000_add_video_support_to_guest_photos.sql`
- ✅ `20251018120000_add_timeline_events_table.sql`
- ❌ `037_some_migration.sql` (old format, don't use)

## Why Timestamp Format?

1. **Supabase Standard**: Official Supabase naming convention
2. **Chronological Order**: Automatically sorted by creation time
3. **Prevents Conflicts**: Multiple developers can create migrations without number conflicts
4. **Better Tracking**: Easy to see when a migration was created

## Current Migration Status

### Applied Migrations (Don't Rename!)
All migrations 001-036 and timestamped migrations are applied to production.
**Never rename already-applied migrations** - it breaks migration tracking.

### Legacy Migrations
- `001_*.sql` through `036_*.sql` - **Keep as-is** (already applied)
- These were created before adopting timestamp format

### New Migrations
- **Always use timestamp format** for new migrations
- Generate timestamp: `date +%Y%m%d%H%M%S`

## Creating New Migrations

### Manual Creation
```bash
# Get current timestamp
TIMESTAMP=$(date +%Y%m%d%H%M%S)

# Create migration file
touch supabase/migrations/${TIMESTAMP}_your_migration_name.sql
```

### Using Supabase CLI
```bash
# CLI automatically creates with timestamp
npx supabase migration new your_migration_name
```

## Applying Migrations

### Local Development
```bash
# Reset local database (applies all migrations)
npx supabase db reset
```

### Production/Cloud
```bash
# Push only new migrations to remote
npx supabase db push

# Push all migrations (including older ones)
npx supabase db push --include-all
```

## Troubleshooting

### Migration Out of Order
If you create a migration with an older timestamp than the last applied migration:
```bash
# Supabase will warn you and require --include-all flag
npx supabase db push --include-all
```

### Skipped Migrations
Files that don't match the pattern will be skipped:
- `COMBINED_NEW_MIGRATIONS.sql` - Wrong format
- `035_migration.sql.skip` - `.skip` extension

**Solution**: Archive or delete these files.

## Best Practices

1. ✅ **One migration per feature/change**
2. ✅ **Use descriptive names**: `add_video_support` not `update_table`
3. ✅ **Include rollback**: Comment how to undo the migration
4. ✅ **Test locally first**: Run `supabase db reset` before pushing
5. ✅ **Use transactions**: Wrap in `BEGIN;` and `COMMIT;` for safety
6. ✅ **Add comments**: Explain what and why

## Example Migration Template

```sql
-- Migration: [Feature Name]
-- Description: [What this migration does]
-- Date: YYYY-MM-DD
-- Author: [Your Name]

BEGIN;

-- =====================================================
-- 1. [SECTION NAME]
-- =====================================================

-- Your SQL here
ALTER TABLE table_name ADD COLUMN new_column TEXT;

-- Add comments
COMMENT ON COLUMN table_name.new_column IS 'Description of column';

-- =====================================================
-- 2. ROLLBACK INSTRUCTIONS (for reference)
-- =====================================================
-- To rollback this migration manually:
-- ALTER TABLE table_name DROP COLUMN new_column;

COMMIT;
```

## Migration Cleanup

### Archive Old Files
```bash
# Move skipped files to archive
mkdir -p supabase/migrations/archive
mv supabase/migrations/*.skip supabase/migrations/archive/
mv supabase/migrations/COMBINED_*.sql supabase/migrations/archive/
```

---

**Last Updated**: 2025-10-17
**Status**: All production migrations 001-036 + timestamped migrations applied ✅
