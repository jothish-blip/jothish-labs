import { NextResponse } from 'next/server';
import { createAdminClient, createClient } from '@/utils/supabase/server';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const updates = await request.json();

    const supabaseClient = await createClient();
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseAdmin = await createAdminClient();

    try {
      await supabaseAdmin.from('portfolio_audit_logs').insert({
        actor: user.email ?? 'unknown',
        action: 'UPDATE_CONTACT',
        target: id,
        resource_type: 'contact',
        details: updates,
        ip_address: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? request.headers.get('x-real-ip') ?? 'unknown'
      });
    } catch {
      // Audit logging is best-effort for admin contact actions.
    }

    const { data, error } = await supabaseAdmin
      .from('portfolio_contacts')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    console.error('[Contact Update Error]', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabaseClient = await createClient();
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseAdmin = await createAdminClient();

    try {
      await supabaseAdmin.from('portfolio_audit_logs').insert({
        actor: user.email ?? 'unknown',
        action: 'DELETE_CONTACT',
        target: id,
        resource_type: 'contact',
        details: { status: 'deleted' },
        ip_address: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? request.headers.get('x-real-ip') ?? 'unknown'
      });
    } catch {
      // Best-effort
    }

    const { error } = await supabaseAdmin
      .from('portfolio_contacts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('[Contact Delete Error]', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
