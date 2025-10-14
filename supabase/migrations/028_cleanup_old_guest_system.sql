-- Migration 028: Clean up old guest management system
-- Description: Remove deprecated guest tables replaced by simple_guests + invitations
-- Date: 2025-10-14
-- Safe to run: After enhanced-guests.ts is archived and analytics page is updated

-- =====================================================
-- BACKUP REMINDER
-- =====================================================
-- Before running this migration, backup your data:
-- supabase db dump -f backup-$(date +%Y%m%d).sql

-- =====================================================
-- DROP OLD GUEST SYSTEM TABLES
-- =====================================================

-- Drop analytics table (not actively used)
DROP TABLE IF EXISTS public.rsvp_analytics CASCADE;

-- Drop email tracking (not actively used)
DROP TABLE IF EXISTS public.email_logs CASCADE;

-- Drop old invitation codes system (replaced by invitations table)
DROP TABLE IF EXISTS public.invitation_codes CASCADE;

-- Drop family groups (not actively used in current system)
DROP TABLE IF EXISTS public.family_groups CASCADE;

-- Drop old complex guests table (replaced by simple_guests)
DROP TABLE IF EXISTS public.guests CASCADE;

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Verify current active tables still exist
DO $$
DECLARE
  missing_tables TEXT[];
BEGIN
  -- Check for required tables (guest_photos created in later timestamp migration 20251013061016)
  SELECT ARRAY_AGG(table_name)
  INTO missing_tables
  FROM (
    SELECT 'simple_guests' AS table_name
    UNION ALL SELECT 'invitations'
    UNION ALL SELECT 'guest_sessions'
    UNION ALL SELECT 'guest_posts'
  ) expected
  WHERE NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = expected.table_name
  );

  IF missing_tables IS NOT NULL THEN
    RAISE EXCEPTION 'Missing required tables: %', array_to_string(missing_tables, ', ');
  END IF;

  RAISE NOTICE '✅ Migration 028 complete: Dropped 5 old guest system tables';
  RAISE NOTICE '   Removed: guests, family_groups, invitation_codes, email_logs, rsvp_analytics';
  RAISE NOTICE '   Active system: simple_guests, invitations, guest_sessions';
END $$;

-- =====================================================
-- DOCUMENTATION
-- =====================================================

COMMENT ON TABLE simple_guests IS 'Active guest management system - replaces old "guests" table';
COMMENT ON TABLE invitations IS 'Personalized invitations with progress tracking - Phase 1-4 implementation';
COMMENT ON TABLE guest_sessions IS 'Guest authentication sessions for uploads and posts';
