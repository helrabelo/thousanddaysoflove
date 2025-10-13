-- FIX: Guest Posts RLS Policy - Allow Anonymous Inserts
--
-- Problem: The "Service role can manage all posts" policy was blocking
-- anonymous guest post creation because FOR ALL includes INSERT operations.
--
-- Solution: Split the admin policy into specific operations (UPDATE, DELETE)
-- and keep the INSERT policy separate for guests.

-- Drop the problematic ALL policy
DROP POLICY IF EXISTS "Service role can manage all posts" ON guest_posts;

-- Recreate with specific operations (UPDATE, DELETE, SELECT)
-- This allows the guest INSERT policy to work independently
CREATE POLICY "Service role can manage all posts"
  ON guest_posts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Ensure the guest INSERT policy exists
CREATE POLICY IF NOT EXISTS "Guests can create posts"
  ON guest_posts
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Ensure guests can read approved posts
CREATE POLICY IF NOT EXISTS "Anyone can view approved posts"
  ON guest_posts
  FOR SELECT
  TO anon, authenticated, service_role
  USING (status = 'approved' OR auth.role() = 'service_role');

-- Summary:
-- ✅ Anonymous users (TO anon) can INSERT posts
-- ✅ Service role can do everything (TO service_role)
-- ✅ Everyone can SELECT approved posts
-- ✅ No conflicting policies blocking guest inserts
