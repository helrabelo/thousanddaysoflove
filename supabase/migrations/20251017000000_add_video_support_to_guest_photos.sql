-- Migration: Add Video Support to guest_photos Table
-- Description: Add video-related columns and update mime_type constraint
-- Date: 2025-10-17

-- =====================================================
-- 1. ADD VIDEO SUPPORT COLUMNS
-- =====================================================

-- Add is_video column (default FALSE for existing photos)
ALTER TABLE public.guest_photos
ADD COLUMN IF NOT EXISTS is_video BOOLEAN DEFAULT false NOT NULL;

-- Add video_duration_seconds column (nullable, only for videos)
ALTER TABLE public.guest_photos
ADD COLUMN IF NOT EXISTS video_duration_seconds INTEGER;

-- Add storage_bucket column (default 'wedding-photos' for existing records)
ALTER TABLE public.guest_photos
ADD COLUMN IF NOT EXISTS storage_bucket TEXT DEFAULT 'wedding-photos' NOT NULL;

-- =====================================================
-- 2. UPDATE MIME_TYPE CONSTRAINT
-- =====================================================

-- Drop existing mime_type constraint
ALTER TABLE public.guest_photos
DROP CONSTRAINT IF EXISTS guest_photos_mime_type_check;

-- Add new mime_type constraint that includes video types
ALTER TABLE public.guest_photos
ADD CONSTRAINT guest_photos_mime_type_check
CHECK (mime_type IN (
  -- Image types
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  -- Video types
  'video/mp4',
  'video/quicktime',
  'video/webm'
));

-- =====================================================
-- 3. ADD COLUMN COMMENTS
-- =====================================================

COMMENT ON COLUMN public.guest_photos.is_video IS 'Whether this upload is a video (true) or image (false)';
COMMENT ON COLUMN public.guest_photos.video_duration_seconds IS 'Duration of video in seconds (null for images)';
COMMENT ON COLUMN public.guest_photos.storage_bucket IS 'Supabase storage bucket name (default: wedding-photos)';

-- Update table comment
COMMENT ON TABLE public.guest_photos IS 'Guest-uploaded photos and videos with moderation and engagement metrics';

-- =====================================================
-- 4. ADD INDEXES FOR VIDEO QUERIES
-- =====================================================

-- Index for filtering by media type
CREATE INDEX IF NOT EXISTS idx_guest_photos_is_video ON public.guest_photos(is_video);

-- Index for video-specific queries
CREATE INDEX IF NOT EXISTS idx_guest_photos_videos ON public.guest_photos(upload_phase)
  WHERE is_video = true;
