# Apply Guest Posts Migration

## Problem
The `/mensagens` page shows error: `"Could not find the table 'public.guest_posts' in the schema cache"`

## Solution
You need to create the database tables in your **Cloud Supabase** database.

---

## Quick Fix (2 minutes)

### Step 1: Open Supabase SQL Editor
Go to: https://supabase.com/dashboard/project/uottcbjzpiudgmqzhuii/sql/new

### Step 2: Copy the Migration SQL
Open the file: `supabase/migrations/024_fixed_guest_posts.sql`

Copy **ALL** the contents (it's ~250 lines)

### Step 3: Paste and Run
1. Paste the SQL into the Supabase SQL Editor
2. Click **"Run"** button (bottom right)
3. Wait for success message (~5-10 seconds)

### Step 4: Verify
You should see in the output:
```
Success. No rows returned
```

---

## What This Creates

The migration creates 5 tables:
1. **invitations** - Personalized guest invitations
2. **guest_posts** - Social feed posts (for `/mensagens`)
3. **post_reactions** - Likes and reactions
4. **post_comments** - Comments and replies
5. **pinned_posts** - Admin-pinned special moments

Plus:
- Indexes for performance
- Triggers for auto-updating counts
- Row Level Security policies
- Sample data (4 test invitations)

---

## After Running

### Test the Fix
1. Go to: http://localhost:3000/mensagens
2. Enter your guest name
3. Try creating a post
4. Should work now! ✅

### Admin Features
1. Go to: http://localhost:3000/admin/posts
2. Approve the test post
3. It will appear in the public feed

### Dashboard
1. Go to: http://localhost:3000/meu-convite/login
2. Use code: `FAMILY001`
3. See your personalized dashboard

---

## Troubleshooting

### If you get "relation already exists" errors
This is OK! It means some tables were already created. The migration uses `CREATE TABLE IF NOT EXISTS` so it won't break anything.

### If you still see 404 errors after running
1. Refresh your browser (hard refresh: Cmd+Shift+R)
2. Check Supabase dashboard → Table Editor
3. Verify `guest_posts` table exists

### If RLS policies fail
You might need to run the policy drops first. Go to:
https://supabase.com/dashboard/project/uottcbjzpiudgmqzhuii/auth/policies

And manually delete any conflicting policies for these tables.

---

## Alternative: Supabase CLI (if you have it installed)

```bash
# Push migration to cloud
supabase db push

# Or apply specific migration
supabase migration up --db-url "your-connection-string"
```

---

## Need Help?

**Check Migration Status:**
- Go to: https://supabase.com/dashboard/project/uottcbjzpiudgmqzhuii/database/tables
- Look for: `guest_posts`, `post_reactions`, `post_comments`, `invitations`, `pinned_posts`
- If they exist → migration successful ✅

**Check Data:**
- Click on `invitations` table
- Should see 4 sample rows (FAMILY001, FRIEND002, etc.)

---

## Sample Invitation Codes (for testing)

After migration, these codes will work:
- `FAMILY001` - João Silva (family, plus one)
- `FRIEND002` - Maria Santos (friend, plus one)
- `FRIEND003` - Pedro Costa (friend, no plus one)
- `WORK004` - Ana Oliveira (colleague, dietary restrictions)

Test URLs:
- http://localhost:3000/convite/FAMILY001
- http://localhost:3000/meu-convite/login (use FAMILY001)
- http://localhost:3000/mensagens

---

That's it! The migration should take less than 2 minutes to apply. 🚀
