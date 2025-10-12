-- Migration 022: Drop duplicate marketing content tables
-- These tables were created in migrations 018-021 but duplicate functionality already in Sanity CMS
-- All marketing content is now managed in Sanity Studio at /studio

-- Drop duplicate marketing content tables
DROP TABLE IF EXISTS public.hero_text CASCADE;
DROP TABLE IF EXISTS public.wedding_settings CASCADE;
DROP TABLE IF EXISTS public.story_cards CASCADE;
DROP TABLE IF EXISTS public.story_preview_settings CASCADE;
DROP TABLE IF EXISTS public.homepage_features CASCADE;
DROP TABLE IF EXISTS public.homepage_section_settings CASCADE;
DROP TABLE IF EXISTS public.about_us_content CASCADE;

-- Keep only transactional tables:
-- ✅ public.guests (RSVPs)
-- ✅ public.payments (transactions)
-- ✅ public.wedding_config (app config)

-- Future migrations (Phase 2-4) will move these to Sanity:
-- 🔄 public.gifts → Sanity (Phase 3)
-- 🔄 public.media_items → Sanity (Phase 2)
-- 🔄 public.timeline_events → Sanity (Phase 4)
-- 🔄 public.timeline_event_media → Sanity (Phase 4)
-- 🔄 public.hero_and_pets → Sanity (Phase 3)

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Migration 022 complete: Dropped 7 duplicate marketing content tables';
    RAISE NOTICE '   Marketing content now managed exclusively in Sanity CMS (/studio)';
    RAISE NOTICE '   Transactional data remains in Supabase (guests, payments, wedding_config)';
    RAISE NOTICE '   Admin routes reduced from 14 → 7 (future: 4 core routes)';
END $$;

-- Add database comment documenting architecture
COMMENT ON DATABASE postgres IS
'Thousand Days of Love Wedding Website - Clean Architecture
- Marketing Content: Sanity CMS (pages, sections, media assets)
- Transactional Data: Supabase (RSVPs, payments, app config)
- Admin Routes: /studio (Sanity) + /admin (Supabase dashboard)
Last cleanup: October 12, 2025 - Removed duplicate content systems';
