import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const supabase = await createAdminClient();
    
    const { error } = await supabase
      .from('portfolio_sessions')
      .update({ status: 'EXPIRED', session_end_time: new Date().toISOString() })
      .eq('session_id', sessionId);
      
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
