-- Create Storage Bucket for Wedding Photos
-- This bucket will store timeline photos, gallery images, and other wedding media

-- Create the bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('wedding-photos', 'wedding-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for the bucket
CREATE POLICY "Anyone can view wedding photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'wedding-photos');

CREATE POLICY "Authenticated users can upload wedding photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'wedding-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update wedding photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'wedding-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete wedding photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'wedding-photos' AND auth.role() = 'authenticated');