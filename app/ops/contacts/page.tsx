import { createClient } from '@/utils/supabase/server';
import ContactsClient from './ContactsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export type ContactWithVisitor = {
  id: string;
  intent: string;
  name: string;
  email: string;
  context_info: string;
  message: string;
  status: string;
  priority: string;
  tags: string[];
  notes: string;
  created_at: string;
  deleted_at?: string;
  visitor?: {
    visitor_id: string;
    country: string;
    city: string;
    browser: string;
    os: string;
    device_type: string;
    first_visit: string;
    last_visit: string;
    total_visits: number;
    session_id: string;
    public_ip?: string;
    referrer?: string;
    time_on_site?: number;
    source?: string;
    projects_viewed?: string[];
    certs_viewed?: string[];
  };
};

export default async function OpsContacts() {
  const supabase = await createClient();
  
  // 1. Fetch contacts
  const { data: contacts, error } = await supabase
    .from('portfolio_contacts')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error || !contacts) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-mono rounded-sm">
        Failed to fetch contacts: {error?.message}
      </div>
    );
  }

  // 2. Fetch contact submit events to correlate visitor session
  const { data: submitEvents } = await supabase
    .from('portfolio_events')
    .select('created_at, visitor_id, session_id')
    .eq('event_type', 'CONTACT_SUBMIT');

  // 3. Extract unique visitors to fetch
  const visitorIdsToFetch = new Set<string>();
  const sessionIdsToFetch = new Set<string>();
  const contactToVisitorMap: Record<string, { visitor_id: string, session_id: string }> = {};

  if (submitEvents) {
    contacts.forEach(contact => {
      const contactTime = new Date(contact.created_at).getTime();
      const matchingEvent = submitEvents.find(event => {
        const eventTime = new Date(event.created_at).getTime();
        return Math.abs(eventTime - contactTime) <= 10000; 
      });

      if (matchingEvent) {
        visitorIdsToFetch.add(matchingEvent.visitor_id);
        sessionIdsToFetch.add(matchingEvent.session_id);
        contactToVisitorMap[contact.id] = {
          visitor_id: matchingEvent.visitor_id,
          session_id: matchingEvent.session_id
        };
      }
    });
  }

  // 4. Fetch Visitor data
  let visitorDataMap: Record<string, any> = {};
  if (visitorIdsToFetch.size > 0) {
    const { data: visitors } = await supabase
      .from('portfolio_visitors')
      .select('*')
      .in('visitor_id', Array.from(visitorIdsToFetch));

    if (visitors) {
      visitorDataMap = visitors.reduce((acc, v) => {
        acc[v.visitor_id] = v;
        return acc;
      }, {} as Record<string, any>);
    }
  }

  // 4b. Fetch Session data & Events for deeper context
  let sessionDataMap: Record<string, any> = {};
  let projectsViewedMap: Record<string, Set<string>> = {};
  let certsViewedMap: Record<string, Set<string>> = {};

  if (sessionIdsToFetch.size > 0) {
    const { data: sessions } = await supabase
      .from('portfolio_sessions')
      .select('*')
      .in('session_id', Array.from(sessionIdsToFetch));
    
    if (sessions) {
      sessionDataMap = sessions.reduce((acc, s) => {
        acc[s.session_id] = s;
        return acc;
      }, {} as Record<string, any>);
    }

    const { data: events } = await supabase
      .from('portfolio_events')
      .select('session_id, event_type, metadata, event_data')
      .in('session_id', Array.from(sessionIdsToFetch));
      
    if (events) {
      events.forEach(e => {
        if (e.event_type === 'PROJECT_OPEN') {
          if (!projectsViewedMap[e.session_id]) projectsViewedMap[e.session_id] = new Set();
          const p = e.metadata?.project || e.event_data?.project || e.metadata?.name || e.event_data?.name;
          if (p) projectsViewedMap[e.session_id].add(p);
        }
        if (e.event_type === 'CERTIFICATE_OPEN' || e.event_type.includes('VERIFY_CLICK')) {
          if (!certsViewedMap[e.session_id]) certsViewedMap[e.session_id] = new Set();
          const c = e.metadata?.certificate || e.event_data?.certificate || e.metadata?.name || e.event_data?.name;
          if (c) certsViewedMap[e.session_id].add(c);
        }
      });
    }
  }

  // 5. Merge Data
  const contactsWithVisitor: ContactWithVisitor[] = contacts.map(contact => {
    const mapEntry = contactToVisitorMap[contact.id];
    let visitorContext = undefined;

    if (mapEntry && visitorDataMap[mapEntry.visitor_id]) {
      const v = visitorDataMap[mapEntry.visitor_id];
      const s = sessionDataMap[mapEntry.session_id];
      
      visitorContext = {
        visitor_id: v.visitor_id,
        country: v.country || 'Unknown',
        city: v.city || 'Unknown',
        browser: v.browser || 'Unknown',
        os: v.os || 'Unknown',
        device_type: v.device_type || 'Unknown',
        first_visit: v.first_visit,
        last_visit: v.last_visit,
        total_visits: v.total_visits,
        session_id: mapEntry.session_id,
        public_ip: v.public_ip,
        referrer: s?.referrer || v.referrer || 'Direct',
        time_on_site: s?.total_duration || 0,
        source: v.utm_source || v.utm_medium || 'Organic',
        projects_viewed: Array.from(projectsViewedMap[mapEntry.session_id] || []),
        certs_viewed: Array.from(certsViewedMap[mapEntry.session_id] || [])
      };
    }

    return {
      ...contact,
      visitor: visitorContext
    };
  });

  return (
    <div className="space-y-8 h-[calc(100vh-6rem)] flex flex-col">
      <header className="mb-6 flex justify-between items-end border-b border-surface pb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight uppercase text-foreground">
            Contact Intelligence
          </h1>
          <p className="text-muted text-sm font-mono mt-2 tracking-widest uppercase">
            Forensic Inbox & Session Telemetry
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <ContactsClient initialContacts={contactsWithVisitor} />
      </div>
    </div>
  );
}
