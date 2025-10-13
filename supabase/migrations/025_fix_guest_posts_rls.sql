-- FIX: Guest Posts RLS Policy - Allow Anonymous Inserts
--
-- Problem: The "Service role can manage all posts" policy was blocking
-- anonymous guest post creation because FOR ALL includes INSERT operations.
--
-- Solution: Drop and recreate policies with proper role targeting
-- to eliminate conflicts between service_role and anonymous users.

-- Drop ALL existing policies on guest_posts
DROP POLICY IF EXISTS "Service role can manage all posts" ON guest_posts;
DROP POLICY IF EXISTS "Guests can create posts" ON guest_posts;
DROP POLICY IF EXISTS "Anyone can view approved posts" ON guest_posts;

-- Recreate service role policy with TO clause (only affects service_role)
-- This policy does NOT affect anonymous users
CREATE POLICY "Service role can manage all posts"
  ON guest_posts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Recreate guest INSERT policy targeting anonymous and authenticated users
-- This is the KEY fix - allows guests to create posts
CREATE POLICY "Guests can create posts"
  ON guest_posts
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Recreate SELECT policy allowing everyone to read approved posts
-- Service role can see ALL posts (pending, approved, rejected)
CREATE POLICY "Anyone can view approved posts"
  ON guest_posts
  FOR SELECT
  TO anon, authenticated, service_role
  USING (status = 'approved' OR auth.role() = 'service_role');

-- Summary:
-- ✅ Anonymous users (TO anon) can INSERT posts
-- ✅ Service role can do everything (TO service_role)
-- ✅ Everyone can SELECT approved posts
-- ✅ No conflicting policies blocking guest inserts
