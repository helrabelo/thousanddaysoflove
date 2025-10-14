-- Migration 029: Clean up old messaging system
-- Description: Remove deprecated messaging tables replaced by guest_posts system
-- Date: 2025-10-14
-- Safe to run: After Phase 3 implementation is confirmed working

-- =====================================================
-- BACKUP REMINDER
-- =====================================================
-- Before running this migration, backup your data:
-- supabase db dump -f backup-$(date +%Y%m%d).sql

-- =====================================================
-- VERIFY NEW SYSTEM EXISTS
-- =====================================================

DO $$
BEGIN
  -- Check that new guest_posts system exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'guest_posts'
  ) THEN
    RAISE EXCEPTION 'Cannot proceed: guest_posts table does not exist. Run Phase 3 migrations first.';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'post_reactions'
  ) THEN
    RAISE EXCEPTION 'Cannot proceed: post_reactions table does not exist. Run Phase 3 migrations first.';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'post_comments'
  ) THEN
    RAISE EXCEPTION 'Cannot proceed: post_comments table does not exist. Run Phase 3 migrations first.';
  END IF;
END $$;

-- =====================================================
-- DROP OLD MESSAGING SYSTEM TABLES
-- =====================================================

-- Drop old message likes (replaced by post_reactions)
DROP TABLE IF EXISTS public.message_likes CASCADE;

-- Drop old guest messages (replaced by guest_posts)
DROP TABLE IF EXISTS public.guest_messages CASCADE;

-- Drop old moderation queue (functionality moved to guest_photos.moderation_status and guest_posts.status)
DROP TABLE IF EXISTS public.moderation_queue CASCADE;

-- =====================================================
-- VERIFICATION
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Migration 029 complete: Dropped 3 old messaging system tables';
  RAISE NOTICE '   Removed: guest_messages, message_likes, moderation_queue';
  RAISE NOTICE '   Active system: guest_posts, post_reactions, post_comments';
  RAISE NOTICE '   Moderation: Handled by status columns on guest_photos and guest_posts';
END $$;

-- =====================================================
-- DOCUMENTATION
-- =====================================================

COMMENT ON TABLE guest_posts IS 'Active social feed posts - replaces old "guest_messages" table (Phase 3)';
COMMENT ON TABLE post_reactions IS 'Post reactions (heart, clap, etc) - replaces old "message_likes" table';
COMMENT ON TABLE post_comments IS 'Nested comments on posts with up to 3 levels of replies';
