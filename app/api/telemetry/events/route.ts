import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type } = body;
    
    const cookieStore = await cookies();
    const visitorId = cookieStore.get('pf_vid')?.value;
    const sessionId = cookieStore.get('pf_sid')?.value;
    
    if (!visitorId || !sessionId) {
      return NextResponse.json({ success: false, error: 'No session' }, { status: 400 });
    }

    const supabase = await createAdminClient();

    const safeDbOperation = async (operation: PromiseLike<unknown>) => {
      try {
        const result = (await operation) as { data: unknown, error: { code?: string, message?: string } | null };
        if (result.error && result.error.code === '42P01') {
          return { data: null, error: result.error, isMissingTable: true };
        }
        return { ...result, isMissingTable: false };
      } catch (err: unknown) {
        const error = err as { code?: string, message?: string };
        if (error.code === '42P01' || error.message?.includes('42P01')) {
          return { data: null, error: err, isMissingTable: true };
        }
        throw err;
      }
    };

    if (type === 'page_exit') {
      const { time_spent, scroll_depth, path } = body;
      
      const { data: pageView, isMissingTable } = await safeDbOperation(supabase
        .from('portfolio_page_views')
        .select('id')
        .eq('session_id', sessionId)
        .eq('path', path)
        .order('created_at', { ascending: false })
        .limit(1)
        .single());
        
      if (isMissingTable) return NextResponse.json({ success: false, error: 'Database not initialized' });

      if (pageView) {
        const view = pageView as { id: string };
        await supabase.from('portfolio_page_views').update({
          time_spent: time_spent,
          scroll_depth: scroll_depth
        }).eq('id', view.id);
      }

      // Update session duration
      const { data: firstView } = await safeDbOperation(supabase
        .from('portfolio_page_views')
        .select('created_at')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })
        .limit(1)
        .single());

      if (firstView) {
        const view = firstView as { created_at: string };
        const duration = Math.round((Date.now() - new Date(view.created_at).getTime()) / 1000);
        await supabase.from('portfolio_sessions').update({
          duration: duration,
          exit_page: path,
          bounced: duration < 10
        }).eq('session_id', sessionId);
      }
    } else if (type === 'custom_event') {
      const { event_type, event_name, event_data } = body;
      
      // Check if table exists by doing a dummy select
      const res = await safeDbOperation(supabase.from('portfolio_events').select('id').limit(1));
      if (res.isMissingTable) return NextResponse.json({ success: false, error: 'Database not initialized' });

      await supabase.from('portfolio_events').insert({
        session_id: sessionId,
        visitor_id: visitorId,
        event_type: event_type,
        event_name: event_name,
        event_data: event_data || {}
      });

      // Update session event count
      const sessionRes = await safeDbOperation(supabase
        .from('portfolio_sessions')
        .select('event_count')
        .eq('session_id', sessionId)
        .single());

      if (sessionRes.data) {
        const sessionData = sessionRes.data as { event_count?: number };
        await supabase.from('portfolio_sessions').update({
          event_count: (sessionData.event_count || 0) + 1,
          updated_at: new Date().toISOString()
        }).eq('session_id', sessionId);
      }
    }

    return NextResponse.json({ success: true });

  } catch (error: unknown) {
    console.error('[Telemetry Event Error]', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
