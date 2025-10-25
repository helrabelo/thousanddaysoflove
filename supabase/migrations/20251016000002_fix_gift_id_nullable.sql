-- Migration 036: Fix gift_id nullable constraint
-- The check_gift_reference constraint already exists from previous partial migration
-- This migration only ensures gift_id is nullable

-- Make gift_id nullable (allow NULL during transition)
ALTER TABLE public.payments
ALTER COLUMN gift_id DROP NOT NULL;
