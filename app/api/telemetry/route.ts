import { type NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/server';
import { v4 as uuidv4 } from 'uuid';
import { cookies, headers } from 'next/headers';
import { findActiveVisitorSession, createVisitorSession, updateVisitorSession } from '@/lib/session-service';

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
    const ip = headersList.get('cf-connecting-ip') || headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || headersList.get('x-real-ip') || '127.0.0.1';
    const isLocal = ip === '127.0.0.1' || ip === '::1' || ip.includes('localhost') || process.env.NODE_ENV === 'development';
    const environment = isLocal ? 'Local Development' : 'Production';
    
    const country = isLocal ? null : (headersList.get('cf-ipcountry') || headersList.get('x-vercel-ip-country'));
    const region = isLocal ? null : (headersList.get('cf-ipregion') || headersList.get('x-vercel-ip-country-region'));
    const city = isLocal ? null : (headersList.get('cf-ipcity') || headersList.get('x-vercel-ip-city'));
    const latitude = isLocal ? null : (headersList.get('cf-iplatitude') || headersList.get('x-vercel-ip-latitude'));
    const longitude = isLocal ? null : (headersList.get('cf-iplongitude') || headersList.get('x-vercel-ip-longitude'));
    
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
      newCookies.push({ name: 'pf_vid', value: visitorId, options: { maxAge: 60 * 60 * 24 * 365 * 2, path: '/', secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, httpOnly: false } }); // 2 years
    }
    
    if (!sessionId) {
      sessionId = uuidv4();
      // Session cookie (no maxAge), it expires when browser closes, but backend tracks actual 30 min idle time
      newCookies.push({ name: 'pf_sid', value: sessionId, options: { path: '/', secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, httpOnly: false } }); 
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
      .from('portfolio_blocked_visitors')
      .select('id')
      .or(`ip_address.eq.${ip},visitor_id.eq.${visitorId}`)
      .limit(1)
    );
    
    if (blockedRes.data && (blockedRes.data as any[]).length > 0) {
      return NextResponse.json({ success: false, error: 'Access Denied' }, { status: 403 });
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

    const publicIp = isLocal ? '127.0.0.1' : ip;
    const screen_res = screen_width ? `${screen_width}x${screen_height}` : 'unknown';
    
    // Hash for fingerprint
    const crypto = require('crypto');
    const fingerprintString = `${publicIp}-${browser}-${os}-${screen_res}-${timezone}-${language}`;
    const deviceFingerprint = crypto.createHash('sha256').update(fingerprintString).digest('hex');
    
    const visitorPayload = {
      browser: browser || 'unknown',
      browser_version: browser_version,
      device_type: device_type,
      os: os || 'unknown',
      os_version: os_version,
      public_ip: publicIp,
      ip_address: publicIp,
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
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      utm_source: utm_source || null,
      utm_medium: utm_medium || null,
      utm_campaign: utm_campaign || null,
      last_visit: new Date().toISOString(),
      cookie_id: visitorId,
      screen_resolution: screen_res,
      device_fingerprint: deviceFingerprint,
      platform: body.platform || null,
      color_depth: body.color_depth || null,
      asn: asn || null,
      manufacturer: (browser === 'Safari' || os === 'iOS' || os === 'macOS') ? 'Apple' : (browser === 'Chrome' && os === 'Android' ? 'Google/Android' : (os === 'Windows' ? 'PC' : null))
    };

    if (!visitorRes.data) {
      const generatedName = `VIS-${visitorId.substring(0, 6).toUpperCase()}`;
      const { error } = await supabase.from('portfolio_visitors').insert({
        visitor_id: visitorId,
        visitor_name: generatedName,
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
          if (dt <= 30 * 60 && dt > 0) {
             updates.total_time_spent = (visitorData.total_time_spent || 0) + dt;
          }
        }
      }

      const { error } = await supabase.from('portfolio_visitors').update(updates).eq('visitor_id', visitorId);
      if (error) console.error('[Telemetry] Visitor Update Error:', error);
    }

    const activeSession = await findActiveVisitorSession(visitorId);

    if (activeSession) {
      // YES -> UPDATE
      const sessionData = activeSession as any;
      await import('@/lib/session-service').then(m => m.processVisitorPing(sessionData.session_id, path || '/', type));
      sessionId = sessionData.session_id;

    } else {
      // NO -> INSERT
      if (type === 'page_view') {
        await createVisitorSession({
          session_id: sessionId,
          visitor_id: visitorId,
          cookie_id: visitorId,
          browser,
          browser_version,
          os,
          device_type,
          screen_resolution: `${screen_width}x${screen_height}`,
          timezone,
          language,
          ip_address: publicIp,
          country,
          region,
          city,
          isp,
          user_agent: userAgent,
          entry_page: path || '/',
          exit_page: path || '/',
          landing_page: path || '/',
          referrer: referrer,
          page_view_count: 1,
          utm_source: utm_source,
          utm_medium: utm_medium,
          utm_campaign: utm_campaign,
          last_ping_at: new Date().toISOString()
        });
      } else {
        return NextResponse.json({ success: true, warning: 'Session not initialized yet' });
      }
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
