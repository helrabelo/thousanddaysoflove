# Apply Phase 1 Migrations to Production Supabase

## What Was Fixed

✅ **Server-Side Storage Utilities**: Created `storage-server.ts` with proper Node.js-compatible upload functions (no browser APIs)
✅ **Upload Route Fixed**: Now uses server-side storage utilities that work with Supabase service role key
✅ **Code Clean**: Separated client-side (browser) and server-side storage code

## Migrations to Apply

Your **cloud Supabase production database** needs these 3 migrations applied:

### 1. Guest Authentication System (`023_guest_authentication_system.sql`)
- Adds invitation codes to guests
- Creates wedding_auth_config table with shared password
- Creates guest_sessions table for authentication
- Sets up RLS policies

### 2. Unified Guest Photos with Supabase Storage (`20251013062000_unified_guest_photos_supabase_storage.sql`)
- Switches from Sanity to Supabase Storage
- Adds storage_path, storage_bucket, is_video columns
- Creates helper functions

### 3. Create Guest With Invitation Function (`20251013100000_create_guest_with_invitation_function.sql`)
- Fixes shared password authentication
- Adds helper function for creating guests

## How to Apply Migrations

### Option 1: Supabase Dashboard (Recommended)

1. Go to: https://supabase.com/dashboard/project/uottcbjzpiudgmqzhuii/editor/sql

2. For each migration file, copy the SQL contents and run:

```bash
# Migration 1
cat supabase/migrations/023_guest_authentication_system.sql
# Copy output and paste into SQL editor, then run

# Migration 2
cat supabase/migrations/20251013062000_unified_guest_photos_supabase_storage.sql
# Copy output and paste into SQL editor, then run

# Migration 3
cat supabase/migrations/20251013100000_create_guest_with_invitation_function.sql
# Copy output and paste into SQL editor, then run
```

### Option 2: Supabase CLI (if Docker is running)

```bash
# Link to production
supabase link --project-ref uottcbjzpiudgmqzhuii

# Push migrations
supabase db push
```

## Verification

After applying migrations, test the upload flow:

1. Go to http://localhost:3000/dia-1000/upload
2. Login with invitation code or shared password (`1000dias`)
3. Upload a photo
4. Check that it appears in Supabase Storage bucket `wedding-photos`
5. Verify database record created in `guest_photos` table

## What This Fixes

- ✅ `create_guest_with_invitation` function not found → Migration adds it
- ✅ `create_guest_session` parameter mismatch → Migration fixes signature
- ✅ `Image is not defined` server error → Fixed by using storage-server.ts
- ✅ RLS policy violation → Admin client now properly bypasses RLS

## Next Steps

Once migrations are applied:
- Phase 1 errors will be resolved
- Upload system will work end-to-end
- Ready to build Phase 2: Admin Moderation Dashboard
