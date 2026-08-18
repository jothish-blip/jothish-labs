import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ visitorId: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Verify admin
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { visitorId } = await params;

    // Fetch Visitor
    const { data: visitor, error: visitorError } = await supabase
      .from('portfolio_visitors')
      .select('*')
      .eq('visitor_id', visitorId)
      .single();

    if (visitorError || !visitor) {
      return NextResponse.json({ error: 'Visitor not found' }, { status: 404 });
    }

    // Fetch Sessions
    const { data: sessions } = await supabase
      .from('portfolio_sessions')
      .select('*')
      .eq('visitor_id', visitorId)
      .order('created_at', { ascending: false });

    // Fetch Page Views
    const { data: pageViews } = await supabase
      .from('portfolio_page_views')
      .select('*')
      .eq('visitor_id', visitorId)
      .order('created_at', { ascending: false });

    // Fetch Events
    const { data: events } = await supabase
      .from('portfolio_events')
      .select('*')
      .eq('visitor_id', visitorId)
      .order('created_at', { ascending: false });

    return NextResponse.json({
      visitor,
      sessions: sessions || [],
      pageViews: pageViews || [],
      events: events || []
    });

  } catch (error) {
    console.error('Visitor API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
