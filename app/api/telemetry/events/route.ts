import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { findActiveVisitorSession } from '@/lib/session-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type } = body;
    
    const cookieStore = await import('next/headers').then(m => m.cookies());
    const visitorId = body.visitor_id || cookieStore.get('pf_vid')?.value;
    
    if (!visitorId) {
      return NextResponse.json({ success: false, error: 'No visitor ID' }, { status: 400 });
    }

    const activeSession = await findActiveVisitorSession(visitorId);
    
    if (!activeSession) {
      return NextResponse.json({ success: false, error: 'No active session' }, { status: 400 });
    }
    
    const sessionId = (activeSession as any).session_id;

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
        // Just update visitor total time spent from accurate session data
        const allSessions = await safeDbOperation(supabase
          .from('portfolio_sessions')
          .select('total_duration')
          .eq('visitor_id', visitorId));
        
        if (allSessions.data) {
          const sessionsList = allSessions.data as { total_duration: number }[];
          const totalDuration = sessionsList.reduce((sum, s) => sum + (s.total_duration || 0), 0);
          await supabase.from('portfolio_visitors').update({
            total_time_spent: totalDuration,
            last_visit: new Date().toISOString()
          }).eq('visitor_id', visitorId);
        }
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

      // Update session metrics
      await import('@/lib/session-service').then(m => m.incrementSessionEventCount(sessionId));

      // Update visitor total time spent
      const allSessions = await safeDbOperation(supabase
        .from('portfolio_sessions')
        .select('total_duration')
        .eq('visitor_id', visitorId));
      
      if (allSessions.data) {
        const sessionsList = allSessions.data as { total_duration: number }[];
        const totalDuration = sessionsList.reduce((sum, s) => sum + (s.total_duration || 0), 0);
        await supabase.from('portfolio_visitors').update({
          total_time_spent: totalDuration,
          last_visit: new Date().toISOString()
        }).eq('visitor_id', visitorId);
      }
    }

    return NextResponse.json({ success: true });

  } catch (error: unknown) {
    console.error('[Telemetry Event Error]', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
