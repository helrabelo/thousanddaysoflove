-- Migration: Add contributor_name to payments table
-- Description: Store the name of the person contributing to gifts
-- Date: 2025-10-25

-- Add contributor_name field to payments table
ALTER TABLE public.payments
ADD COLUMN IF NOT EXISTS contributor_name TEXT;

-- Add index for searching by contributor name
CREATE INDEX IF NOT EXISTS idx_payments_contributor_name
ON public.payments(contributor_name);

-- Add comment for documentation
COMMENT ON COLUMN public.payments.contributor_name IS 'Name of the person contributing to the gift (for display on gift cards)';

-- Update gift_contributions view to include contributor names
CREATE OR REPLACE VIEW gift_contributions AS
SELECT
    sanity_gift_id,
    SUM(amount) as total_contributed,
    COUNT(*) as contribution_count,
    JSON_AGG(
        JSON_BUILD_OBJECT(
            'payment_id', id::text,
            'guest_id', guest_id::text,
            'contributor_name', contributor_name,
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

-- Update view comment
COMMENT ON VIEW gift_contributions IS 'Aggregates completed payment contributions per Sanity gift item with contributor names';
