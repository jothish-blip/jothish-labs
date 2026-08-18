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
  const contactToVisitorMap: Record<string, { visitor_id: string, session_id: string }> = {};

  if (submitEvents) {
    contacts.forEach(contact => {
      const contactTime = new Date(contact.created_at).getTime();
      // Find an event within 10 seconds of the contact creation
      const matchingEvent = submitEvents.find(event => {
        const eventTime = new Date(event.created_at).getTime();
        return Math.abs(eventTime - contactTime) <= 10000; 
      });

      if (matchingEvent) {
        visitorIdsToFetch.add(matchingEvent.visitor_id);
        contactToVisitorMap[contact.id] = {
          visitor_id: matchingEvent.visitor_id,
          session_id: matchingEvent.session_id
        };
      }
    });
  }

  // 4. Fetch Visitor data
  let visitorDataMap: Record<string, {
    visitor_id: string;
    country: string;
    city: string;
    browser: string;
    os: string;
    device_type: string;
    first_visit: string;
    last_visit: string;
    total_visits: number;
  }> = {};

  if (visitorIdsToFetch.size > 0) {
    const { data: visitors } = await supabase
      .from('portfolio_visitors')
      .select('*')
      .in('visitor_id', Array.from(visitorIdsToFetch));

    if (visitors) {
      visitorDataMap = visitors.reduce((acc, v) => {
        acc[v.visitor_id] = v;
        return acc;
      }, {} as Record<string, typeof visitorDataMap[string]>);
    }
  }

  // 5. Merge Data
  const contactsWithVisitor: ContactWithVisitor[] = contacts.map(contact => {
    const mapEntry = contactToVisitorMap[contact.id];
    let visitorContext = undefined;

    if (mapEntry && visitorDataMap[mapEntry.visitor_id]) {
      const v = visitorDataMap[mapEntry.visitor_id];
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
        session_id: mapEntry.session_id
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
