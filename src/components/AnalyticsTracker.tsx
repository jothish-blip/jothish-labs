'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
}

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${value}; max-age=${maxAge}; path=/`;
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const viewStartTime = useRef<number>(0);
  const maxScroll = useRef<number>(0);
  const trackTimer = useRef<NodeJS.Timeout | null>(null);
  const pingInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Exclude ops console
    if (pathname.startsWith('/ops')) return;

    // Ensure cookies exist on client side before making requests
    let vid = getCookie('pf_vid');
    let sid = getCookie('pf_sid');
    
    if (!vid) {
      vid = generateUUID();
      setCookie('pf_vid', vid, 60 * 60 * 24 * 365 * 2);
    }
    
    if (!sid) {
      sid = generateUUID();
      setCookie('pf_sid', sid, 60 * 30);
    }

    viewStartTime.current = Date.now();
    maxScroll.current = 0;

    const trackView = async () => {
      try {
        const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const viewport = `${window.innerWidth}x${window.innerHeight}`;
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const dpr = window.devicePixelRatio || 1;
        const orientation = window.screen.orientation?.type || (window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');

        await fetch('/api/telemetry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({
            path: pathname,
            title: document.title,
            referrer: document.referrer || document.URL,
            userAgent: navigator.userAgent,
            screen: `${window.screen.width}x${window.screen.height}`,
            screen_width: window.screen.width,
            screen_height: window.screen.height,
            color_depth: window.screen.colorDepth,
            dpr,
            orientation,
            language: navigator.language,
            timezone: timezone,
            viewport: viewport,
            theme: theme,
            platform: navigator.platform,
            color_scheme: theme,
            utm_source: searchParams.get('utm_source'),
            utm_medium: searchParams.get('utm_medium'),
            utm_campaign: searchParams.get('utm_campaign'),
            type: 'page_view'
          })
        });
      } catch (e) {
        // Silently fail in production
      }
    };

    // Section Observer
    const sectionTimers = new Map<string, number>();
    const sectionScrolls = new Map<string, number>();
    let activeSection: string | null = null;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id;
        if (!id) return;
        
        if (entry.isIntersecting) {
          sectionTimers.set(id, Date.now());
          sectionScrolls.set(id, 0); // reset scroll for this section
          activeSection = id;
          import('@/lib/telemetry/events').then(({ trackEvent, TELEMETRY_EVENTS }) => {
            trackEvent({
              type: TELEMETRY_EVENTS.SECTION_ENTER,
              metadata: { section: id }
            });
          });
        } else {
          const entryTime = sectionTimers.get(id);
          if (entryTime) {
            const duration = Math.round((Date.now() - entryTime) / 1000);
            const scrollDepth = sectionScrolls.get(id) || 0;
            sectionTimers.delete(id);
            if (duration >= 0) {
              import('@/lib/telemetry/events').then(({ trackEvent, TELEMETRY_EVENTS }) => {
                trackEvent({
                  type: TELEMETRY_EVENTS.SECTION_EXIT,
                  metadata: { section: id, duration_seconds: duration, scroll_depth: scrollDepth }
                });
              });
            }
          }
        }
      });
    }, { threshold: 0.3 }); // Lower threshold for taller sections

    // Delay observer start slightly to ensure page load
    setTimeout(() => {
      const sections = document.querySelectorAll('section[id]');
      sections.forEach(section => observer.observe(section));
    }, 1500);

    const handleScroll = () => {
      const scrollHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const scrolled = (window.scrollY / scrollHeight) * 100;
      if (scrolled > maxScroll.current) {
        maxScroll.current = Math.min(Math.round(scrolled), 100);
      }
      
      // Update active section scroll depth
      if (activeSection) {
        const sectionEl = document.getElementById(activeSection);
        if (sectionEl) {
          const rect = sectionEl.getBoundingClientRect();
          const sectionHeight = rect.height;
          const scrolledPast = Math.max(0, -rect.top);
          const percentage = Math.min(100, Math.round(((scrolledPast + window.innerHeight) / sectionHeight) * 100));
          const currentMax = sectionScrolls.get(activeSection) || 0;
          if (percentage > currentMax) {
            sectionScrolls.set(activeSection, percentage);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const trackExit = () => {
      const timeSpent = Math.round((Date.now() - viewStartTime.current) / 1000);
      
      if (activeSection && sectionTimers.has(activeSection)) {
        const duration = Math.round((Date.now() - sectionTimers.get(activeSection)!) / 1000);
        const scrollDepth = sectionScrolls.get(activeSection) || 0;
        if (duration >= 0) {
          import('@/lib/telemetry/events').then(({ trackEvent, TELEMETRY_EVENTS }) => {
            trackEvent({
              type: TELEMETRY_EVENTS.SECTION_EXIT,
              metadata: { section: activeSection, duration_seconds: duration, scroll_depth: scrollDepth }
            });
          });
        }
      }

      const data = JSON.stringify({
        path: pathname,
        time_spent: timeSpent,
        scroll_depth: maxScroll.current,
        type: 'page_exit'
      });
      fetch('/api/telemetry/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: data,
        keepalive: true
      }).catch(() => {});
    };

    window.addEventListener('beforeunload', trackExit);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
         trackExit();
      } else {
         viewStartTime.current = Date.now();
      }
    });

    // Initial view tracking
    trackTimer.current = setTimeout(trackView, 500);
    
    // Heartbeat ping (only when visible)
    pingInterval.current = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetch('/api/telemetry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({
            path: pathname,
            type: 'ping'
          }),
          keepalive: true
        }).catch(() => {});
      }
    }, 15000);

    return () => {
      if (trackTimer.current) clearTimeout(trackTimer.current);
      if (pingInterval.current) clearInterval(pingInterval.current);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', trackExit);
      observer.disconnect();
      trackExit();
    };

  }, [pathname, searchParams]);

  // Expose a global method for custom events (e.g. terminal commands)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('@/lib/telemetry/events').then(({ trackEvent, TELEMETRY_EVENTS }) => {
        (window as unknown as { trackEvent: (eventType: string, eventName: string, eventData?: Record<string, unknown>) => void }).trackEvent = (eventType: string, eventName: string, eventData: Record<string, unknown> = {}) => {
          let type = eventType;
          if (eventType === 'terminal_command') type = TELEMETRY_EVENTS.TERMINAL_COMMAND;
          
          trackEvent({
            type: type as keyof typeof TELEMETRY_EVENTS,
            metadata: eventData
          });
        };
      });
    }
  }, [pathname]);

  return null;
}
