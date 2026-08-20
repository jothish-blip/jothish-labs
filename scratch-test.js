const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkDB() {
  const { data: v } = await supabase.from('portfolio_sessions').select('*');
  console.log("Sessions:", v.length);
}
checkDB();
