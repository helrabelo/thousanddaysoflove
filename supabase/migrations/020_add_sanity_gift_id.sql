-- Migration 020: Add Sanity CMS gift reference to payments table
-- Purpose: Migrate gift registry from Supabase to Sanity CMS while preserving payment transactions

-- Add new column for Sanity CMS gift reference
-- This will reference the _id from Sanity's giftItem documents
ALTER TABLE public.payments
ADD COLUMN sanity_gift_id VARCHAR(50);

-- Add comment for documentation
COMMENT ON COLUMN public.payments.sanity_gift_id IS 'References _id from Sanity CMS giftItem documents (e.g., "giftItem-abc123")';

-- Add index for performance (gifts will be queried frequently)
CREATE INDEX idx_payments_sanity_gift_id ON public.payments(sanity_gift_id);

-- Create view for gift contribution summaries
-- This aggregates all completed payments for each Sanity gift
CREATE OR REPLACE VIEW gift_contributions AS
SELECT
    sanity_gift_id,
    SUM(amount) as total_contributed,
    COUNT(*) as contribution_count,
    JSON_AGG(
        JSON_BUILD_OBJECT(
            'payment_id', id::text,
            'guest_id', guest_id::text,
            'amount', amount,
            'payment_date', created_at,
            'payment_method', payment_method,
            'message', message,
            'status', status
        ) ORDER BY created_at DESC
    ) as contributors
FROM public.payments
WHERE status = 'completed' AND sanity_gift_id IS NOT NULL
GROUP BY sanity_gift_id;

-- Add comment for the view
COMMENT ON VIEW gift_contributions IS 'Aggregates completed payment contributions per Sanity gift item';

-- Note: We're NOT making sanity_gift_id required yet to allow gradual migration
-- Once all gifts are in Sanity and code is updated, run:
-- ALTER TABLE public.payments ALTER COLUMN sanity_gift_id SET NOT NULL;
-- ALTER TABLE public.payments DROP COLUMN gift_id; -- Only after migration is complete!

-- For now, both gift_id and sanity_gift_id can coexist during transition period
