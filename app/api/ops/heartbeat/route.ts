import { NextResponse } from 'next/server';
import { createAdminClient, createClient } from '@/utils/supabase/server';
import { updateAdminHeartbeat, expireAdmin, verifyAdminSession } from '@/lib/session-service';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseAdmin = await createAdminClient();
    
    // Refresh admin session expiration logic below
    const cookieStore = await import('next/headers').then(m => m.cookies());
    const adminSid = cookieStore.get('admin_sid')?.value;
    
    if (adminSid) {
      const sessionData = await verifyAdminSession(adminSid, user.id);

      if (!sessionData || sessionData.is_revoked || sessionData.status !== 'ACTIVE' || new Date(sessionData.expires_at) < new Date()) {
        if (sessionData && sessionData.status === 'ACTIVE') {
           await expireAdmin(sessionData.session_token, user.id);
        }
        return NextResponse.json({ error: 'Session expired' }, { status: 401 });
      }

      await updateAdminHeartbeat(adminSid, user.id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
