# Database Migration Guide - Production Deployment

## Critical Issues Fixed in This Deployment

### 1. React Hook Error ✅ FIXED
**Error**: `ReferenceError: Cannot access 'm' before initialization`
**Location**: `InvitationCard.tsx:27-29`
**Fix**: Changed `useState(() => { generateQRCode(); })` to `useEffect(() => { generateQRCode(); }, [])`

### 2. Admin Authentication ✅ FIXED
**Error**: Admin login not working in production
**Root Cause**: Cookie name mismatch
  - Login API sets: `admin_session`
  - Middleware checks: `admin-auth`
**Fix**: Updated middleware to check for `admin_session` cookie

### 3. Database Migration ⚠️ NEEDS MANUAL APPLICATION

### 4. **RLS Policy Issue - Guest Posts** 🔥 CRITICAL
**Error**: `new row violates row-level security policy for table "guest_posts"`
**Root Cause**: The "Service role can manage all posts" policy (FOR ALL) conflicts with guest INSERT policy
**Impact**: Guests cannot submit messages, photos, or videos
**Fix**: Apply migration `025_fix_guest_posts_rls.sql` to update RLS policies

## Step-by-Step Migration Instructions

### Prerequisites
- Access to Supabase Dashboard: https://supabase.com/dashboard/project/uottcbjzpiudgmqzhuii
- Project: `uottcbjzpiudgmqzhuii`

### Migration File Location
**Local Path**: `/Users/helrabelo/code/personal/thousanddaysoflove/supabase/migrations/024_fixed_guest_posts.sql`

### Tables to be Created
1. ✅ **invitations** - Personalized guest invitation codes
2. ✅ **guest_posts** - Guest messages and social feed
3. ✅ **post_reactions** - Likes/reactions on posts
4. ✅ **post_comments** - Comments with nested replies
5. ✅ **pinned_posts** - Admin-pinned special moments

### Application Steps

#### Step 1: Apply RLS Policy Fix (PRIORITY - DO THIS FIRST!)

**This is the MOST CRITICAL fix** - without it, guests cannot post messages.

1. Go to: https://supabase.com/dashboard/project/uottcbjzpiudgmqzhuii/sql/new
2. Copy the RLS fix:
```bash
cat supabase/migrations/025_fix_guest_posts_rls.sql | pbcopy
```
3. Paste into SQL Editor and click **"Run"**
4. Verify success - you should see "Success. No rows returned"

#### Step 2: Access Supabase SQL Editor
1. Go to: https://supabase.com/dashboard/project/uottcbjzpiudgmqzhuii/sql/new
2. Login with your Supabase credentials

#### Step 3: Copy Migration SQL
```bash
# Copy the entire migration file contents
cat supabase/migrations/024_fixed_guest_posts.sql | pbcopy
```

Or manually open the file and copy all ~600 lines.

#### Step 4: Execute in SQL Editor
1. Paste the entire migration SQL into the editor
2. Click **"Run"** button (bottom right)
3. Wait for execution to complete (~5-10 seconds)
4. Verify success message

#### Step 5: Verify Tables Created
Check tables exist at: https://supabase.com/dashboard/project/uottcbjzpiudgmqzhuii/database/tables

Expected new tables:
- ✅ `invitations` (14 columns)
- ✅ `guest_posts` (13 columns)
- ✅ `post_reactions` (6 columns)
- ✅ `post_comments` (8 columns)
- ✅ `pinned_posts` (6 columns)

#### Step 6: Verify RLS Policies
Go to: https://supabase.com/dashboard/project/uottcbjzpiudgmqzhuii/auth/policies

Each table should have 3-5 RLS policies:
- `invitations`: 2 policies (public read, admin full access)
- `guest_posts`: 5 policies (public read approved, guest insert, admin full access)
- `post_reactions`: 3 policies (public read, authenticated insert/update)
- `post_comments`: 3 policies (public read, authenticated insert/update)
- `pinned_posts`: 2 policies (public read, admin full access)

### Post-Migration Verification

#### Test Endpoints (Production)
1. **Personalized Invitation**: https://thousanddaysof.love/convite/FAMILY001
   - Should load without 406 error
   - Should show guest details
   - Should generate QR code ✅ (fixed React hook error)

2. **Guest Dashboard**: https://thousanddaysof.love/meu-convite/FAMILY001
   - Should load without 406 error
   - Should show progress tracker
   - Should display activity feed

3. **Messages Feed**: https://thousanddaysof.love/mensagens
   - Should load empty feed (no errors)
   - Should allow post creation

4. **Admin Login**: https://thousanddaysof.love/admin/login ✅ (fixed cookie mismatch)
   - Should accept password: `HelYlana1000Dias!`
   - Should redirect to `/admin/photos`
   - Should set `admin_session` cookie

### Rollback Plan (If Needed)

If migration causes issues, rollback with:

```sql
-- Drop all new tables (cascades to RLS policies)
DROP TABLE IF EXISTS pinned_posts CASCADE;
DROP TABLE IF EXISTS post_comments CASCADE;
DROP TABLE IF EXISTS post_reactions CASCADE;
DROP TABLE IF EXISTS guest_posts CASCADE;
DROP TABLE IF EXISTS invitations CASCADE;
```

### Expected Results After Migration

✅ **Fixed Issues**:
1. React hook error resolved (QR code generation works)
2. Admin login functional (cookie mismatch fixed)
3. Invitations table exists (no more 406 errors)
4. Guest posts system ready (messages feed active)
5. Dashboard fully operational

✅ **New Features Enabled**:
- Personalized invitations at `/convite/[code]`
- Guest dashboard at `/meu-convite/[code]`
- Social feed at `/mensagens`
- Admin invitation management at `/admin/convites`
- Admin post moderation at `/admin/posts`

### Troubleshooting

#### Issue: "relation 'invitations' does not exist"
**Solution**: Migration not applied yet - follow steps above

#### Issue: "Cannot coerce result to single JSON object"
**Solution**: Usually means no matching rows - check invite code exists in database

#### Issue: Guest photos 400 error
**Possible Cause**: `guest_photos` table might have RLS policy issues
**Check**: Verify table exists and has public read policy

### Next Steps After Migration

1. **Seed Test Data** (optional):
   ```sql
   -- Add sample invitation
   INSERT INTO invitations (code, guest_name, relationship_type, plus_one_allowed, custom_message)
   VALUES ('FAMILY001', 'João Silva', 'family', true, 'Que alegria ter você conosco!');
   ```

2. **Test All Features**:
   - ✅ Personalized invitations
   - ✅ QR code generation
   - ✅ Progress tracking
   - ✅ Activity feed
   - ✅ Admin authentication
   - ✅ Messages feed

3. **Monitor Production**:
   - Check Vercel logs for errors
   - Monitor Supabase dashboard for queries
   - Test on mobile devices

## Files Changed in This Deployment

1. `src/components/dashboard/InvitationCard.tsx` - Fixed React hook error
2. `src/middleware.ts` - Fixed admin auth cookie mismatch

## Deployment Checklist

- [x] Fix React hook error in InvitationCard.tsx
- [x] Fix admin authentication cookie mismatch
- [x] Build succeeds locally (no errors)
- [x] Create migration guide
- [ ] Apply migration to Cloud Supabase (MANUAL STEP)
- [ ] Deploy to Vercel (git push)
- [ ] Test production URLs
- [ ] Verify admin login works
- [ ] Verify invitation pages load
- [ ] Verify dashboard functionality

## Support

If you encounter issues after migration:
1. Check Vercel deployment logs: https://vercel.com/helrabelos-projects
2. Check Supabase logs: https://supabase.com/dashboard/project/uottcbjzpiudgmqzhuii/logs
3. Review this guide for troubleshooting steps
4. Contact Claude for assistance

---

**Migration File**: `supabase/migrations/024_fixed_guest_posts.sql`
**Total Lines**: ~600
**Estimated Execution Time**: 5-10 seconds
**Rollback Time**: < 1 second (if needed)
