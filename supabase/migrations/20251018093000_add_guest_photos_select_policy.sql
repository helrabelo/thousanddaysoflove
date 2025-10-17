--
-- Migration: Allow public read access to approved guest photos
--

BEGIN;

CREATE POLICY "Anyone can view approved guest photos"
  ON public.guest_photos FOR SELECT
  USING (moderation_status = 'approved' AND is_deleted = false);

COMMIT;

