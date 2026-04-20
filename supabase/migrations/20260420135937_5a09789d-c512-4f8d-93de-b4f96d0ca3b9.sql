-- Add fulfillment mode enum
DO $$ BEGIN
  CREATE TYPE public.fulfillment_mode AS ENUM ('pickup', 'delivery');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS customer_email text,
  ADD COLUMN IF NOT EXISTS fulfillment public.fulfillment_mode NOT NULL DEFAULT 'pickup',
  ADD COLUMN IF NOT EXISTS customer_phone text,
  ADD COLUMN IF NOT EXISTS delivery_address text;