-- FIX v2: Guest Posts RLS - Explicitly Grant Anonymous INSERT
--
-- After investigation, the issue is that TO anon might not be working as expected
-- This version uses simpler, more explicit policies without role targeting

-- Drop ALL existing policies
DROP POLICY IF EXISTS "Service role can manage all posts" ON guest_posts;
DROP POLICY IF EXISTS "Guests can create posts" ON guest_posts;
DROP POLICY IF EXISTS "Anyone can view approved posts" ON guest_posts;

-- Policy 1: Allow EVERYONE to INSERT posts (guests don't need auth)
-- This is the KEY fix - no role restrictions, just allow all inserts
CREATE POLICY "Allow anonymous post creation"
  ON guest_posts
  FOR INSERT
  WITH CHECK (true);

-- Policy 2: Allow EVERYONE to SELECT approved posts
-- Non-admin users see only approved, admins see all via service_role
CREATE POLICY "Public can view approved posts"
  ON guest_posts
  FOR SELECT
  USING (
    status = 'approved'
    OR
    auth.role() = 'service_role'
  );

-- Policy 3: Allow service_role to UPDATE posts (for moderation)
CREATE POLICY "Service role can update posts"
  ON guest_posts
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy 4: Allow service_role to DELETE posts
CREATE POLICY "Service role can delete posts"
  ON guest_posts
  FOR DELETE
  TO service_role
  USING (true);

-- Verify policies are created
SELECT policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'guest_posts'
ORDER BY policyname;
