# Simplest Table Merge: Zero Code Changes! 🎉

## Problem
We had two confusing tables:
- `invitations` - Admin-created invites with tracking
- `simple_guests` - Auth records for sessions

They duplicate guest data and cause sync issues.

## Solution
**Use a database VIEW** for backwards compatibility - NO code changes required!

## How It Works

1. **Keep `simple_guests`** as the single source of truth
2. **Drop empty `invitations` table**
3. **Create `invitations` VIEW** that aliases columns
4. **Add INSTEAD OF triggers** so INSERT/UPDATE/DELETE work transparently

Result: Existing code continues working with **ZERO changes**!

## Migrations to Run

### Step 1: Enhance simple_guests (20251018000000)
```bash
# Adds missing columns from invitations to simple_guests
supabase db push
```

This adds:
- `relationship_type`
- `plus_one_allowed`, `plus_one_name`
- `custom_message`, `table_number`
- `opened_at`, `open_count`
- `rsvp_completed`, `gift_selected`, `photos_uploaded`, `messages_posted`
- `account_created`, `last_login`, `created_by`

### Step 2: Create invitations view (20251018000001)
```bash
# Creates backwards-compatible view
supabase db push
```

This:
- Drops `invitations` table
- Creates `invitations` VIEW over `simple_guests`
- Maps columns: `code` → `invitation_code`, `guest_name` → `name`, etc.
- Adds triggers so INSERT/UPDATE/DELETE work

## Column Mappings

| invitations (view) | simple_guests (table) |
|-------------------|----------------------|
| `code` | `invitation_code` |
| `guest_name` | `name` |
| `guest_email` | `email` |
| `guest_phone` | `phone` |
| `dietary_restrictions` | `notes` |
| *(everything else)* | *(same name)* |

## Verification

After running migrations, test that queries still work:

```sql
-- Should work exactly as before
SELECT * FROM invitations WHERE code = 'FAMILY001';

-- Should also work
SELECT * FROM simple_guests WHERE invitation_code = 'FAMILY001';

-- Insert should work
INSERT INTO invitations (code, guest_name, email, relationship_type)
VALUES ('TEST001', 'Test Guest', 'test@example.com', 'friend');

-- Verify it went to simple_guests
SELECT * FROM simple_guests WHERE invitation_code = 'TEST001';
```

## Benefits

✅ **Zero code changes** - All .from('invitations') queries continue working
✅ **Single source of truth** - Data only in simple_guests
✅ **No duplication** - No sync issues
✅ **Backwards compatible** - Existing code unaffected
✅ **5 minute migration** - Just run two SQL files

## Future Cleanup (Optional)

Later, when ready, we can:
1. Rename `simple_guests` → `guests`
2. Update code to use `guests` directly
3. Drop the `invitations` view
4. Update column references (invitation_code → code, etc.)

But for now, **everything just works**!

## Run It

```bash
# In your project directory
cd /Users/helrabelo/code/personal/thousanddaysoflove

# Apply migrations
supabase db push

# Verify
psql $DATABASE_URL -c "SELECT * FROM invitations LIMIT 1;"
psql $DATABASE_URL -c "SELECT * FROM simple_guests LIMIT 1;"

# Both should return same data! ✨
```

## Result

Your code continues working exactly as before, but now with:
- Single guest table under the hood
- No confusing duplication
- Clean data model
- Zero effort!

🎊 **Done! That's it!**
