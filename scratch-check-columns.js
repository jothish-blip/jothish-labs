const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function get() {
  const { data: adminData } = await supabase.from('portfolio_admin_sessions').select('*').limit(1);
  if (adminData && adminData.length > 0) {
    console.log('portfolio_admin_sessions keys:', Object.keys(adminData[0]));
  } else {
    console.log('portfolio_admin_sessions has no rows to inspect keys.');
  }
  const { data: visitorData } = await supabase.from('portfolio_sessions').select('*').limit(1);
  if (visitorData && visitorData.length > 0) {
    console.log('portfolio_sessions keys:', Object.keys(visitorData[0]));
  }
}
get();
