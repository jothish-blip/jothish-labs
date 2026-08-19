import { NextResponse } from 'next/server';
import { createAdminClient, createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';

export async function POST(request: Request, { params }: { params: Promise<{ visitorId: string }> }) {
  try {
    const { visitorId } = await params;
    const body = await request.json();
    const action = body.action; // 'block' or 'unblock'
    const reason = body.reason || 'Manual admin block';

    const supabaseClient = await createClient();
    const { data: { session } } = await supabaseClient.auth.getSession();

    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseAdmin = await createAdminClient();

    // 1. Get visitor's IP address from portfolio_visitors
    const { data: visitor } = await supabaseAdmin
      .from('portfolio_visitors')
      .select('public_ip')
      .eq('visitor_id', visitorId)
      .single();

    if (!visitor || !visitor.public_ip) {
      return NextResponse.json({ success: false, error: 'Visitor IP not found' }, { status: 404 });
    }

    const ip = visitor.public_ip;

    if (action === 'block') {
      // Upsert into portfolio_blocked_ips
      await supabaseAdmin
        .from('portfolio_blocked_ips')
        .upsert({
          ip_address: ip,
          reason,
          blocked_by: session.user.id
        }, { onConflict: 'ip_address' });

      // Audit Log
      await supabaseAdmin.from('portfolio_audit_logs').insert({
        actor: session.user.email,
        action: 'BLOCK_IP',
        target: visitorId,
        resource_type: 'visitor',
        details: { ip, reason },
        ip_address: (await headers()).get('x-forwarded-for')?.split(',')[0] || 'unknown'
      });
    } else if (action === 'unblock') {
      await supabaseAdmin
        .from('portfolio_blocked_ips')
        .delete()
        .eq('ip_address', ip);

      // Audit Log
      await supabaseAdmin.from('portfolio_audit_logs').insert({
        actor: session.user.email,
        action: 'UNBLOCK_IP',
        target: visitorId,
        resource_type: 'visitor',
        details: { ip },
        ip_address: (await headers()).get('x-forwarded-for')?.split(',')[0] || 'unknown'
      });
    }

    return NextResponse.json({ success: true, ip });
  } catch (error: any) {
    console.error('Block visitor error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
