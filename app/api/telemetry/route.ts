import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/server';
import { v4 as uuidv4 } from 'uuid';
import { cookies, headers } from 'next/headers';

function parseUserAgentDetailed(ua: string) {
  let browser = 'Unknown';
  let browser_version = 'Unknown';
  let os = 'Unknown';
  let os_version = 'Unknown';

  if (ua.includes('Firefox')) {
    browser = 'Firefox';
    browser_version = ua.match(/Firefox\/([\d.]+)/)?.[1] || 'Unknown';
  } else if (ua.includes('Edg')) {
    browser = 'Edge';
    browser_version = ua.match(/Edg\/([\d.]+)/)?.[1] || 'Unknown';
  } else if (ua.includes('Chrome')) {
    browser = 'Chrome';
    browser_version = ua.match(/Chrome\/([\d.]+)/)?.[1] || 'Unknown';
  } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
    browser = 'Safari';
    browser_version = ua.match(/Version\/([\d.]+)/)?.[1] || 'Unknown';
  }

  if (ua.includes('Windows NT 10.0')) { os = 'Windows'; os_version = '10/11'; }
  else if (ua.includes('Windows NT 6.3')) { os = 'Windows'; os_version = '8.1'; }
  else if (ua.includes('Windows NT 6.2')) { os = 'Windows'; os_version = '8'; }
  else if (ua.includes('Windows NT 6.1')) { os = 'Windows'; os_version = '7'; }
  else if (ua.includes('Mac OS X')) { 
    os = 'macOS'; 
    os_version = ua.match(/Mac OS X ([\d_]+)/)?.[1]?.replace(/_/g, '.') || 'Unknown'; 
  }
  else if (ua.includes('Android')) {
    os = 'Android';
    os_version = ua.match(/Android ([\d.]+)/)?.[1] || 'Unknown';
  }
  else if (ua.includes('iPhone OS') || ua.includes('iPad; CPU OS')) {
    os = 'iOS';
    os_version = ua.match(/OS ([\d_]+)/)?.[1]?.replace(/_/g, '.') || 'Unknown';
  }
  else if (ua.includes('Linux')) { os = 'Linux'; }

  return { browser, browser_version, os, os_version };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      path, title, referrer, userAgent, type, eventName, eventData,
      screen_width, screen_height, dpr, orientation,
      language, timezone, theme, color_scheme,
      utm_source, utm_medium, utm_campaign
    } = body;
    
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || headersList.get('x-real-ip') || headersList.get('cf-connecting-ip') || '127.0.0.1';
    const isLocal = ip === '127.0.0.1' || ip === '::1' || ip.includes('localhost') || process.env.NODE_ENV === 'development';
    const environment = isLocal ? 'Local Development' : 'Production';
    
    const country = isLocal ? null : headersList.get('x-vercel-ip-country');
    const region = isLocal ? null : headersList.get('x-vercel-ip-country-region');
    const city = isLocal ? null : headersList.get('x-vercel-ip-city');
    const latitude = isLocal ? null : headersList.get('x-vercel-ip-latitude');
    const longitude = isLocal ? null : headersList.get('x-vercel-ip-longitude');
    
    // Extracted Advanced Headers
    const isp = isLocal ? null : headersList.get('x-vercel-ip-city') ? 'Vercel Edge' : null;
    const asn = isLocal ? null : headersList.get('x-vercel-ip-asn');
    const postal_code = isLocal ? null : headersList.get('x-vercel-ip-postal-code') || headersList.get('x-vercel-ip-postal');
    const network_type = isLocal ? null : headersList.get('x-vercel-ip-network-type') || 'Unknown';
    const bot_detection = isLocal ? null : headersList.get('x-vercel-bot') || headersList.get('cf-bot-management') || 'None';
    
    const { browser, browser_version, os, os_version } = parseUserAgentDetailed(userAgent || '');
    
    const cookieStore = await cookies();
    let visitorId = cookieStore.get('pf_vid')?.value;
    let sessionId = cookieStore.get('pf_sid')?.value;
    
    const newCookies: { name: string, value: string, options: Record<string, unknown> }[] = [];

    if (!visitorId) {
      visitorId = uuidv4();
      newCookies.push({ name: 'pf_vid', value: visitorId, options: { maxAge: 60 * 60 * 24 * 365 * 2, path: '/' } }); // 2 years
    }
    
    if (!sessionId) {
      sessionId = uuidv4();
      newCookies.push({ name: 'pf_sid', value: sessionId, options: { maxAge: 60 * 30, path: '/' } }); // 30 mins
    }

    const supabase = await createAdminClient();

    const safeDbOperation = async (operation: PromiseLike<unknown>) => {
      try {
        const result = (await operation) as { data: unknown, error: { code?: string, message?: string } | null };
        if (result.error && result.error.code === '42P01') {
          console.warn('[Telemetry] Missing table in database. Ensure migrations are pushed.');
          return { data: null, error: result.error, isMissingTable: true };
        }
        return { ...result, isMissingTable: false };
      } catch (err: unknown) {
        const error = err as { code?: string, message?: string };
        if (error.code === '42P01' || error.message?.includes('42P01')) {
          console.warn('[Telemetry] Missing table in database. Ensure migrations are pushed.');
          return { data: null, error: err, isMissingTable: true };
        }
        throw err;
      }
    };

    // 1. Check if visitor is blocked
    const blockedRes = await safeDbOperation(supabase
      .from('portfolio_blocked_ips')
      .select('id, expires_at')
      .eq('ip_address', ip)
      .single()
    );
    
    if (blockedRes.data) {
      const blockedData = blockedRes.data as { expires_at?: string };
      if (!blockedData.expires_at || new Date(blockedData.expires_at) > new Date()) {
        return NextResponse.json({ success: false, error: 'Access Denied' }, { status: 403 });
      }
    }

    // 2. Upsert Visitor
    const visitorRes = await safeDbOperation(supabase
      .from('portfolio_visitors')
      .select('id, total_visits, total_time_spent')
      .eq('visitor_id', visitorId)
      .single());

    if (visitorRes.isMissingTable) {
      const response = NextResponse.json({ success: false, error: 'Database not initialized' });
      newCookies.forEach(c => response.cookies.set(c.name, c.value, c.options));
      return response;
    }

    let device_type = 'Desktop';
    if (screen_width) {
      if (screen_width < 768) device_type = 'Mobile';
      else if (screen_width < 1024) device_type = 'Tablet';
    } else if (os === 'iOS' || os === 'Android') {
      device_type = 'Mobile';
    }

    const visitorPayload = {
      browser: browser || 'unknown',
      browser_version: browser_version,
      device_type: device_type,
      os: os || 'unknown',
      os_version: os_version,
      public_ip: isLocal ? '127.0.0.1' : ip,
      environment,
      referrer,
      screen_width,
      screen_height,
      screen_dpr: dpr,
      screen_orientation: orientation,
      timezone,
      language,
      theme,
      color_scheme,
      country,
      region,
      city,
      isp,
      asn,
      postal_code,
      network_type,
      bot_detection,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      utm_source: utm_source || null,
      utm_medium: utm_medium || null,
      utm_campaign: utm_campaign || null,
      last_visit: new Date().toISOString(),
    };

    if (!visitorRes.data) {
      const { error } = await supabase.from('portfolio_visitors').insert({
        visitor_id: visitorId,
        ...visitorPayload,
        total_visits: 1,
        returning_visitor: false
      });
      if (error) console.error('[Telemetry] Visitor Insert Error:', error);
    } else {
      const visitorData = visitorRes.data as { total_visits?: number, total_time_spent?: number };
      const updates: Record<string, unknown> = { ...visitorPayload };
      
      if (newCookies.some(c => c.name === 'pf_sid')) {
        updates.total_visits = (visitorData.total_visits || 0) + 1;
        updates.returning_visitor = true;
      }

      // Add time to total_time_spent if this is a ping
      if (type === 'ping') {
        const p_res = await supabase.from('portfolio_sessions').select('last_ping_at').eq('session_id', sessionId).single();
        if (p_res.data?.last_ping_at) {
          const dt = Math.floor((new Date().getTime() - new Date(p_res.data.last_ping_at).getTime()) / 1000);
          if (dt <= 30 && dt > 0) {
             updates.total_time_spent = (visitorData.total_time_spent || 0) + dt;
          }
        }
      }

      const { error } = await supabase.from('portfolio_visitors').update(updates).eq('visitor_id', visitorId);
      if (error) console.error('[Telemetry] Visitor Update Error:', error);
    }

    // 3. Upsert Session
    const sessionRes = await safeDbOperation(supabase
      .from('portfolio_sessions')
      .select('id, page_view_count, navigation_path, active_duration, idle_duration, created_at, last_ping_at')
      .eq('session_id', sessionId)
      .single());

    const deviceSnapshot = {
      browser,
      browser_version,
      os,
      os_version,
      device_type,
      screen: `${screen_width}x${screen_height}`,
      language,
      timezone,
      location: [city, region, country].filter(Boolean).join(', ') || 'Unknown'
    };

    if (!sessionRes.data) {
      const { error } = await supabase.from('portfolio_sessions').insert({
        session_id: sessionId,
        visitor_id: visitorId,
        entry_page: path,
        exit_page: path,
        referrer: referrer,
        device_snapshot: deviceSnapshot,
        page_view_count: type === 'page_view' ? 1 : 0,
        navigation_path: type === 'page_view' ? [path] : [],
        utm_source: utm_source,
        utm_medium: utm_medium,
        utm_campaign: utm_campaign
      });
      if (error) console.error('[Telemetry] Session Insert Error:', error);
    } else {
      const sessionData = sessionRes.data as any;
      const updates: any = { updated_at: new Date().toISOString() };
      
      if (type === 'page_view') {
        updates.page_view_count = (sessionData.page_view_count || 0) + 1;
        updates.exit_page = path;
        
        let navPath = Array.isArray(sessionData.navigation_path) ? sessionData.navigation_path : [];
        if (navPath[navPath.length - 1] !== path) {
           navPath = [...navPath, path];
        }
        updates.navigation_path = navPath;
      }
      
      if (type === 'ping' || type === 'page_view') {
        updates.exit_page = path; // Realtime current page
        
        const now = new Date();
        const lastPing = sessionData.last_ping_at ? new Date(sessionData.last_ping_at) : new Date(sessionData.created_at);
        const dt = Math.floor((now.getTime() - lastPing.getTime()) / 1000);
        
        let active = sessionData.active_duration || 0;
        let idle = sessionData.idle_duration || 0;
        
        if (dt > 0 && dt <= 30) {
           active += dt;
        } else if (dt > 30) {
           idle += dt;
        }
        
        updates.active_duration = active;
        updates.idle_duration = idle;
        updates.total_duration = active + idle;
        updates.last_ping_at = now.toISOString();
      }
      
      const { error } = await supabase.from('portfolio_sessions').update(updates).eq('session_id', sessionId);
      if (error) console.error('[Telemetry] Session Update Error:', error);
    }

    if (type === 'event' && eventName) {
      await supabase.from('portfolio_events').insert({
        session_id: sessionId,
        visitor_id: visitorId,
        event_type: eventName,
        event_name: eventName,
        event_data: eventData || {}
      });
    } else if (type === 'page_view') {
      await supabase.from('portfolio_page_views').insert({
        session_id: sessionId,
        visitor_id: visitorId,
        path: path,
        title: title
      });
    }

    const response = NextResponse.json({ success: true, vid: visitorId, sid: sessionId });
    newCookies.forEach(c => response.cookies.set(c.name, c.value, c.options));
    return response;

  } catch (error: unknown) {
    console.error('[Telemetry Error]', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
