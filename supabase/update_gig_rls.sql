-- Run this in Supabase SQL Editor to allow partners to post gigs directly
-- (removes the requirement for an approved partner_profiles entry)

DROP POLICY IF EXISTS gigs_partner_manage ON public.gigs;

-- Partners can manage their own gigs as long as their profile role is 'partner'
CREATE POLICY gigs_partner_manage ON public.gigs
FOR ALL
TO authenticated
USING (
    partner_id = auth.uid() AND
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'partner'
    )
)
WITH CHECK (
    partner_id = auth.uid() AND
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'partner'
    )
);
