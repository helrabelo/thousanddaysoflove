--
-- Migration: Attach guest photos to timeline events
--

BEGIN;

ALTER TABLE public.guest_photos
  ADD COLUMN IF NOT EXISTS timeline_event_id TEXT;

CREATE INDEX IF NOT EXISTS idx_guest_photos_timeline_event
  ON public.guest_photos(timeline_event_id);

COMMIT;

