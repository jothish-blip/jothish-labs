import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/server';
import { blockVisitor, unblockVisitor } from '@/lib/session-service';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ visitorId: string }> }
) {
  try {
    const { visitorId } = await params;
    const body = await request.json();
    const { action } = body; // 'block' or 'unblock'
    
    const supabase = await createAdminClient();
    
    if (action === 'unblock') {
      await unblockVisitor(visitorId);
      return NextResponse.json({ success: true, action: 'unblocked' });
    }
    
    // If block, get visitor IP
    const { data: visitor } = await supabase
      .from('portfolio_visitors')
      .select('ip_address, public_ip, cookie_id, device_fingerprint')
      .eq('visitor_id', visitorId)
      .single();
      
    if (visitor) {
      await blockVisitor(
         visitorId, 
         visitor.ip_address || visitor.public_ip || '', 
         'Blocked via admin panel',
         '00000000-0000-0000-0000-000000000000', // System or get from session
         visitor.cookie_id,
         visitor.device_fingerprint
      );
    }
    
    return NextResponse.json({ success: true, action: 'blocked' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
