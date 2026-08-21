import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/server';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ visitorId: string }> }
) {
  try {
    const { visitorId } = await params;
    const supabase = await createAdminClient();
    
    // Deleting the visitor cascades and deletes sessions, logs, page_views, etc.
    const { error } = await supabase
      .from('portfolio_visitors')
      .delete()
      .eq('visitor_id', visitorId);
      
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
