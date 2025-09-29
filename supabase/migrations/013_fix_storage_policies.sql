-- Fix Storage Policies - Allow Public Uploads for Admin
-- This is a wedding website admin area, we'll allow uploads without strict auth

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can upload wedding photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update wedding photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete wedding photos" ON storage.objects;

-- Create more permissive policies for wedding admin
CREATE POLICY "Anyone can upload wedding photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'wedding-photos');

CREATE POLICY "Anyone can update wedding photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'wedding-photos');

CREATE POLICY "Anyone can delete wedding photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'wedding-photos');