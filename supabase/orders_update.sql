-- ── Run this in Supabase SQL Editor ──────────────────────────
-- Adds 'declined' status, partner update policy, and profile read policy

-- 1. Add 'declined' to orders status
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pending', 'active', 'completed', 'cancelled', 'declined'));

-- 2. Allow partner to update orders (accept / decline)
DROP POLICY IF EXISTS "orders_partner_update" ON public.orders;
CREATE POLICY "orders_partner_update" ON public.orders FOR UPDATE
  USING (auth.uid() = partner_id)
  WITH CHECK (auth.uid() = partner_id);

-- 3. Allow authenticated users to read all profiles (needed for name/avatar joins)
DROP POLICY IF EXISTS "profiles_authenticated_read" ON public.profiles;
CREATE POLICY "profiles_authenticated_read" ON public.profiles FOR SELECT
  TO authenticated USING (true);
