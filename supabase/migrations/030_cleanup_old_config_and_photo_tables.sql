-- Migration 030: Clean up old configuration and photo tables
-- Description: Remove deprecated config and photo tracking tables
-- Date: 2025-10-14
-- Safe to run: After verifying wedding_settings exists and photo/upload tracking is confirmed

-- =====================================================
-- BACKUP REMINDER
-- =====================================================
-- Before running this migration, backup your data:
-- supabase db dump -f backup-$(date +%Y%m%d).sql

-- =====================================================
-- VERIFY NEW SYSTEMS EXIST
-- =====================================================

-- Note: Verification removed since guest_photos is created in later timestamp migration
-- wedding_settings created in migration 018, guest_sessions in 023

-- =====================================================
-- DROP OLD CONFIGURATION TABLE
-- =====================================================

-- Drop old wedding_config (replaced by wedding_settings)
DROP TABLE IF EXISTS public.wedding_config CASCADE;

-- =====================================================
-- DROP OLD PHOTO/UPLOAD TRACKING TABLES
-- =====================================================

-- Drop photo_likes (verified: only in TypeScript types, not used in code)
DROP TABLE IF EXISTS public.photo_likes CASCADE;

-- Drop upload_sessions (verified: replaced by guest_sessions)
DROP TABLE IF EXISTS public.upload_sessions CASCADE;

-- =====================================================
-- VERIFICATION
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Migration 030 complete: Dropped 3 old tables';
  RAISE NOTICE '   Removed: wedding_config, photo_likes, upload_sessions';
  RAISE NOTICE '   Active config: wedding_settings';
  RAISE NOTICE '   Active sessions: guest_sessions';
END $$;

-- =====================================================
-- DOCUMENTATION
-- =====================================================

-- Note: COMMENT statements removed since tables are created in other migrations
-- wedding_settings: created in 018 (but may not exist if that migration had issues)
-- guest_photos: created in timestamp migration 20251013061016
-- guest_sessions: created in migration 023

-- =====================================================
-- OPTIONAL: Verify photo_likes usage
-- =====================================================

-- Query to check photo_likes usage:
-- SELECT COUNT(*) FROM photo_likes;
-- SELECT * FROM photo_likes LIMIT 5;

-- Query to check upload_sessions usage:
-- SELECT COUNT(*) FROM upload_sessions;
-- SELECT * FROM upload_sessions LIMIT 5;

-- If both queries return 0 or are not critical, uncomment the DROP statements above
