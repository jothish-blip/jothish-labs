import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseAdmin = await createAdminClient();
    const ilikeQuery = `%${query}%`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results: any[] = [];

    // Parallel Queries
    const [
      { data: contacts },
      { data: visitors },
      { data: events },
      { data: logs }
    ] = await Promise.all([
      // 1. Contacts
      supabaseAdmin
        .from('portfolio_contacts')
        .select('id, name, email, message, created_at')
        .or(`name.ilike.${ilikeQuery},email.ilike.${ilikeQuery},message.ilike.${ilikeQuery}`)
        .limit(5),

      // 2. Visitors
      supabaseAdmin
        .from('portfolio_visitors')
        .select('visitor_id, city, country, browser, os, last_visit')
        .or(`visitor_id.ilike.${ilikeQuery},city.ilike.${ilikeQuery},country.ilike.${ilikeQuery},browser.ilike.${ilikeQuery}`)
        .limit(5),

      // 3. Events
      supabaseAdmin
        .from('portfolio_events')
        .select('id, event_type, event_name, created_at')
        .or(`event_name.ilike.${ilikeQuery},event_type.ilike.${ilikeQuery}`)
        .limit(5),

      // 4. Audit Logs
      supabaseAdmin
        .from('portfolio_audit_logs')
        .select('id, action, actor, resource_type, created_at')
        .or(`actor.ilike.${ilikeQuery},action.ilike.${ilikeQuery},resource_type.ilike.${ilikeQuery}`)
        .limit(5)
    ]);

    // Normalize Results
    if (contacts) {
      contacts.forEach(c => {
        results.push({
          id: c.id,
          type: 'contact',
          title: c.name,
          subtitle: c.email,
          metadata: c.message.substring(0, 50) + '...',
          href: '/ops/contacts',
          timestamp: c.created_at
        });
      });
    }

    if (visitors) {
      visitors.forEach(v => {
        results.push({
          id: v.visitor_id,
          type: 'visitor',
          title: v.visitor_id.substring(0, 8),
          subtitle: `${v.city}, ${v.country}`,
          metadata: `${v.browser} on ${v.os}`,
          href: '/ops/visitors',
          timestamp: v.last_visit
        });
      });
    }

    if (events) {
      events.forEach(e => {
        results.push({
          id: e.id,
          type: 'event',
          title: e.event_name,
          subtitle: e.event_type,
          metadata: 'Telemetry Event',
          href: '/ops',
          timestamp: e.created_at
        });
      });
    }

    if (logs) {
      logs.forEach(l => {
        results.push({
          id: l.id,
          type: 'audit',
          title: l.action,
          subtitle: l.actor,
          metadata: `Resource: ${l.resource_type}`,
          href: '/ops/audit',
          timestamp: l.created_at
        });
      });
    }

    // Sort by most recent
    results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({ results });
  } catch (error: unknown) {
    console.error('[Search API Error]', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
