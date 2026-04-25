import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

const ROLE_HOME: Record<string, string> = {
  traveler: '/dashboard',
  partner: '/partnerdashboard',
  admin: '/admin',
};

export default async function Home() {
  const cookieStore = await cookies();
  const roleCookie = cookieStore.get('ceygo_role')?.value;

  if (roleCookie && ROLE_HOME[roleCookie]) {
    redirect(ROLE_HOME[roleCookie]);
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/signin');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const home = profile?.role ? (ROLE_HOME[profile.role] ?? '/signin') : '/signin';
  redirect(home);
}
