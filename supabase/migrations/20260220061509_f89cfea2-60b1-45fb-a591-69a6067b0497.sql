
-- Fix the overly permissive INSERT policy on license_keys
-- Purchases are anonymous so we restrict to non-null required fields only
DROP POLICY IF EXISTS "Anyone can insert license during purchase" ON public.license_keys;

CREATE POLICY "Anyone can insert license during purchase"
  ON public.license_keys FOR INSERT
  WITH CHECK (
    product_id IS NOT NULL AND
    purchaser_email IS NOT NULL AND
    purchaser_name IS NOT NULL
  );
