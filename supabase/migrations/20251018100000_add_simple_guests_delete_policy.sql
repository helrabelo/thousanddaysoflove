-- Add DELETE policy for simple_guests table
-- This was missing, preventing admin from deleting guests

CREATE POLICY "Anyone can delete guests" ON public.simple_guests
  FOR DELETE
  USING (true);
