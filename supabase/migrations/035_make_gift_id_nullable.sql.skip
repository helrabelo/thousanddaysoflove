-- Migration 035: Make gift_id nullable for Sanity CMS transition
-- Now that we're using sanity_gift_id, the old gift_id should be optional

-- Make gift_id nullable (allow NULL during transition)
ALTER TABLE public.payments
ALTER COLUMN gift_id DROP NOT NULL;

-- Add a check constraint to ensure at least one gift reference exists
ALTER TABLE public.payments
ADD CONSTRAINT check_gift_reference
CHECK (
  gift_id IS NOT NULL OR sanity_gift_id IS NOT NULL
);

-- Comment for documentation
COMMENT ON CONSTRAINT check_gift_reference ON public.payments IS
  'Ensures either gift_id (legacy Supabase) or sanity_gift_id (new Sanity CMS) is provided';
