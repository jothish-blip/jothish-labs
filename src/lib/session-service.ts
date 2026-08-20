import { createAdminClient } from '@/utils/supabase/server';

export async function getActiveVisitors() {
  const supabase = await createAdminClient();
  const { data, count, error } = await supabase
    .from('portfolio_sessions')
    .select('*', { count: 'exact' })
    .in('status', ['ACTIVE', 'IDLE']);
  
  if (error) console.error('[session-service] getActiveVisitors:', error);
  return { data: data || [], count: count || 0 };
}

export async function getActiveAdmins() {
  const supabase = await createAdminClient();
  const { data, count, error } = await supabase
    .from('portfolio_admin_sessions')
    .select('*', { count: 'exact' })
    .in('status', ['ACTIVE', 'IDLE']);
    
  if (error) console.error('[session-service] getActiveAdmins:', error);
  return { data: data || [], count: count || 0 };
}

export async function expireVisitor(sessionId: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from('portfolio_sessions')
    .update({ status: 'EXPIRED' })
    .eq('session_id', sessionId);
    
  if (error) console.error('[session-service] expireVisitor:', error);
}

export async function expireAdmin(sessionId: string, adminId: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from('portfolio_admin_sessions')
    .update({ status: 'EXPIRED', is_revoked: true, expires_at: new Date().toISOString() })
    .eq('session_token', sessionId)
    .eq('admin_id', adminId);
    
  if (error) console.error('[session-service] expireAdmin:', error);
}

export async function sweepExpiredSessions() {
  const supabase = await createAdminClient();
  const now = Date.now();
  
  // 1. Visitor Sessions: ACTIVE -> IDLE (No ping for >30s)
  const thirtySecAgoStr = new Date(now - 30000).toISOString();
  await supabase
    .from('portfolio_sessions')
    .update({ status: 'IDLE' })
    .eq('status', 'ACTIVE')
    .lt('last_ping_at', thirtySecAgoStr);

  // 2. Visitor Sessions: IDLE/ACTIVE -> EXPIRED (No ping for >60s)
  const sixtySecAgoStr = new Date(now - 60000).toISOString();
  await supabase
    .from('portfolio_sessions')
    .update({ status: 'EXPIRED' })
    .in('status', ['ACTIVE', 'IDLE'])
    .lt('last_ping_at', sixtySecAgoStr);

  // 3. Admin Sessions: ACTIVE -> IDLE (No activity for >15m)
  const fifteenMinAgoStr = new Date(now - 15 * 60000).toISOString();
  await supabase
    .from('portfolio_admin_sessions')
    .update({ status: 'IDLE' })
    .eq('status', 'ACTIVE')
    .lt('last_activity_at', fifteenMinAgoStr);

  // 4. Admin Sessions: IDLE/ACTIVE -> EXPIRED (expires_at < NOW())
  await supabase
    .from('portfolio_admin_sessions')
    .update({ status: 'EXPIRED' })
    .in('status', ['ACTIVE', 'IDLE'])
    .lt('expires_at', new Date(now).toISOString());
}

export async function findActiveVisitorSession(visitorId: string) {
  const supabase = await createAdminClient();
  await sweepExpiredSessions();
  
  const { data } = await supabase
    .from('portfolio_sessions')
    .select('*')
    .eq('visitor_id', visitorId)
    .in('status', ['ACTIVE', 'IDLE'])
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
    
  return data;
}

export async function createVisitorSession(payload: any) {
  const supabase = await createAdminClient();
  
  // Atomic-like UPSERT to prevent race condition
  // Set status to CREATED first.
  payload.status = 'CREATED';
  const { error } = await supabase.from('portfolio_sessions').insert(payload);
  
  if (error) {
     if (error.code === '23505') {
       // Unique violation, ignore because the other thread succeeded
       console.log('[session-service] duplicate visitor session insert prevented.');
       return;
     }
     console.error('[session-service] createVisitorSession error:', error);
  }
  
  if (!error && payload.session_id) {
     await supabase.from('portfolio_sessions').update({ status: 'ACTIVE' }).eq('session_id', payload.session_id);
  }
}

export async function updateVisitorSession(sessionId: string, updates: any) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from('portfolio_sessions')
    .update(updates)
    .eq('session_id', sessionId);
  if (error) console.error('[session-service] updateVisitorSession:', error);
}

export async function incrementSessionEventCount(sessionId: string) {
  const supabase = await createAdminClient();
  const { data } = await supabase.from('portfolio_sessions').select('event_count').eq('session_id', sessionId).single();
  if (data) {
    await supabase.from('portfolio_sessions').update({
      event_count: (data.event_count || 0) + 1,
      updated_at: new Date().toISOString()
    }).eq('session_id', sessionId);
  }
}

export async function processVisitorPing(sessionId: string, path: string, type: string) {
  const supabase = await createAdminClient();
  const { data: sessionData } = await supabase.from('portfolio_sessions').select('*').eq('session_id', sessionId).single();
  
  if (!sessionData) return;
  
  const updates: any = { updated_at: new Date().toISOString() };
  
  if (type === 'page_view') {
    updates.page_view_count = (sessionData.page_view_count || 0) + 1;
    updates.exit_page = path;
    updates.status = 'ACTIVE';
  }
  
  if (type === 'ping' || type === 'page_view') {
    updates.exit_page = path || '/';
    updates.status = 'ACTIVE';
    
    const now = new Date();
    const lastPing = sessionData.last_ping_at ? new Date(sessionData.last_ping_at) : new Date(sessionData.created_at);
    const dt = Math.floor((now.getTime() - lastPing.getTime()) / 1000);
    
    let active = sessionData.active_duration || 0;
    let idle = sessionData.idle_duration || 0;
    
    if (dt > 0 && dt <= 30) {
       active += dt;
    } else if (dt > 30 && dt <= 60) {
       idle += dt;
    }
    
    updates.active_duration = active;
    updates.idle_duration = idle;
    updates.total_duration = active + idle;
    updates.last_ping_at = now.toISOString();
  }

  if (type === 'page_exit' || type === 'visibility_hidden') {
    updates.status = 'EXPIRED';
  }
  
  await updateVisitorSession(sessionId, updates);
}

export async function createAdminSession(payload: any) {
  const supabase = await createAdminClient();
  payload.status = 'CREATED';
  const { error } = await supabase.from('portfolio_admin_sessions').insert(payload);
  if (error) console.error('[session-service] createAdminSession:', error);
  
  if (!error && payload.session_token) {
    await supabase.from('portfolio_admin_sessions').update({ status: 'ACTIVE' }).eq('session_token', payload.session_token);
  }
}

export async function updateAdminHeartbeat(sessionId: string, userId: string) {
  const supabase = await createAdminClient();
  const newExpiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
  
  const { error } = await supabase
    .from('portfolio_admin_sessions')
    .update({ 
      last_activity_at: new Date().toISOString(),
      expires_at: newExpiresAt,
      status: 'ACTIVE'
    })
    .eq('session_token', sessionId)
    .eq('admin_id', userId);
    
  if (error) console.error('[session-service] updateAdminHeartbeat:', error);
}

export async function getCount(table: string, match: any = {}, gte: any = null) {
  const supabase = await createAdminClient();
  let query = supabase.from(table).select('*', { count: 'exact', head: true });
  for (const [key, value] of Object.entries(match)) {
    if (value === null) {
      query = query.is(key, null);
    } else {
      query = query.eq(key, value);
    }
  }
  if (gte) {
    for (const [key, value] of Object.entries(gte)) {
      query = query.gte(key, value);
    }
  }
  const { count, error } = await query;
  if (error) console.error(`[session-service] getCount for ${table}:`, error);
  return count || 0;
}

export async function verifyAdminSession(sessionId: string, userId: string) {
  const supabase = await createAdminClient();
  const { data } = await supabase.from('portfolio_admin_sessions')
    .select('id, expires_at, is_revoked, status, session_token')
    .eq('session_token', sessionId)
    .eq('admin_id', userId)
    .single();
  return data;
}
