import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createAdminClient();
    
    // Example: Delete sessions older than 30 days
    const date = new Date();
    date.setDate(date.getDate() - 30);
    
    // Sessions cascade delete their events and page views
    const { error } = await supabase
      .from('portfolio_sessions')
      .delete()
      .lt('created_at', date.toISOString());
      
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
