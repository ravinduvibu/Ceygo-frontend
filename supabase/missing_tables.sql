-- ── Run this in Supabase SQL Editor ──────────────────────────
-- Only creates the tables that don't exist yet.
-- Safe to run even if profiles already exists.

-- ── partner_profiles ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.partner_profiles (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id       UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  business_name    TEXT NOT NULL,
  category         TEXT NOT NULL,
  phone            TEXT,
  location         TEXT,
  description      TEXT,
  approval_status  TEXT NOT NULL DEFAULT 'pending'
                     CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  documents        JSONB DEFAULT '[]'::jsonb,
  submitted_at     TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at      TIMESTAMPTZ,
  reviewed_by      UUID REFERENCES public.profiles(id),
  admin_notes      TEXT
);

-- ── gigs ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.gigs (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title          TEXT NOT NULL,
  description    TEXT,
  price          NUMERIC(10,2) NOT NULL DEFAULT 0,
  category       TEXT,
  location       TEXT,
  image_url      TEXT,
  is_active      BOOLEAN DEFAULT true,
  impressions    INT DEFAULT 0,
  clicks         INT DEFAULT 0,
  rating         NUMERIC(3,2) DEFAULT 0,
  reviews_count  INT DEFAULT 0,
  orders_count   INT DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── orders ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  traveler_id  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  gig_id       UUID REFERENCES public.gigs(id) ON DELETE SET NULL,
  partner_id   UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status       TEXT NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  amount       NUMERIC(10,2) NOT NULL,
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── reviews ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reviews (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  traveler_id  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  gig_id       UUID REFERENCES public.gigs(id) ON DELETE SET NULL,
  partner_id   UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  order_id     UUID REFERENCES public.orders(id) ON DELETE SET NULL UNIQUE,
  rating       INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text         TEXT,
  is_verified  BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── Enable RLS ───────────────────────────────────────────────
ALTER TABLE public.partner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gigs             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews          ENABLE ROW LEVEL SECURITY;

-- ── RLS Policies (drop first so re-runs never error) ─────────

DROP POLICY IF EXISTS "pp_own_all"      ON public.partner_profiles;
DROP POLICY IF EXISTS "pp_admin_select" ON public.partner_profiles;
DROP POLICY IF EXISTS "pp_admin_update" ON public.partner_profiles;

DROP POLICY IF EXISTS "gigs_public_read"    ON public.gigs;
DROP POLICY IF EXISTS "gigs_partner_manage" ON public.gigs;
DROP POLICY IF EXISTS "gigs_admin_all"      ON public.gigs;

DROP POLICY IF EXISTS "orders_traveler_read"   ON public.orders;
DROP POLICY IF EXISTS "orders_partner_read"    ON public.orders;
DROP POLICY IF EXISTS "orders_traveler_create" ON public.orders;

DROP POLICY IF EXISTS "reviews_public_read"     ON public.reviews;
DROP POLICY IF EXISTS "reviews_traveler_insert" ON public.reviews;

-- partner_profiles: partner sees/edits own; admin sees/edits all
CREATE POLICY "pp_own_all" ON public.partner_profiles
  FOR ALL USING (auth.uid() = partner_id);

CREATE POLICY "pp_admin_select" ON public.partner_profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "pp_admin_update" ON public.partner_profiles FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- gigs: anyone can read active gigs; approved partners manage own; admins all
CREATE POLICY "gigs_public_read" ON public.gigs FOR SELECT USING (is_active = true);

CREATE POLICY "gigs_partner_manage" ON public.gigs FOR ALL
  USING (
    auth.uid() = partner_id AND
    EXISTS (
      SELECT 1 FROM public.partner_profiles pp
      WHERE pp.partner_id = auth.uid() AND pp.approval_status = 'approved'
    )
  );

CREATE POLICY "gigs_admin_all" ON public.gigs FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- orders
CREATE POLICY "orders_traveler_read" ON public.orders FOR SELECT
  USING (auth.uid() = traveler_id);

CREATE POLICY "orders_partner_read" ON public.orders FOR SELECT
  USING (auth.uid() = partner_id);

CREATE POLICY "orders_traveler_create" ON public.orders FOR INSERT
  WITH CHECK (
    auth.uid() = traveler_id AND
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'traveler')
  );

-- reviews: public read; traveler inserts only after a completed order
CREATE POLICY "reviews_public_read" ON public.reviews FOR SELECT USING (true);

CREATE POLICY "reviews_traveler_insert" ON public.reviews FOR INSERT
  WITH CHECK (
    auth.uid() = traveler_id AND
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.traveler_id = auth.uid() AND o.status = 'completed'
    )
  );
