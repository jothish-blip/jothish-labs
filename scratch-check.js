const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://lonjxlubmohbryogkxvd.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxvbmp4bHVibW9oYnJ5b2dreHZkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjg1NTI0MywiZXhwIjoyMDY4NDMxMjQzfQ.s8CyryE5PDvl_LQuRFwwzMiqAtiCI0CFsmcCkt00vWk';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function check() {
  const { data, error } = await supabase.from('portfolio_events').select('id').limit(1);
  console.log("Events access:", !!data);
}
check();
