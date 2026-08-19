import { createClient } from '@/utils/supabase/server';
import RolesClient from './RolesClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function RolesPage() {
  const supabase = await createClient();

  // Fetch Roles
  const { data: roles } = await supabase.from('portfolio_roles').select('*').order('name');
  
  // Fetch Admins (using portfolio_user_roles) - wait, we don't have an auth.users join directly 
  // without admin privileges, but we can query portfolio_user_roles.
  // Wait, portfolio_user_roles joins with auth.users? Yes, user_id uuid references auth.users(id).
  
  // Since we don't have full admin rights to query auth.users, we might just query the roles table for now
  // or use RPC. We'll pass the mapping.
  
  const { data: userRoles } = await supabase.from('portfolio_user_roles').select('*');

  return (
    <RolesClient initialRoles={roles || []} initialUserRoles={userRoles || []} />
  );
}
