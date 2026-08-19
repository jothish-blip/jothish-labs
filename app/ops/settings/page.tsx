import { createClient } from '@/utils/supabase/server';
import SettingsClient from './SettingsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function OpsSettingsPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from('portfolio_settings').select('*');

  // Default values mapping
  const initialConfig = (settings || []).reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  return <SettingsClient initialConfig={initialConfig} />;
}
