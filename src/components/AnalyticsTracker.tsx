'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const viewStartTime = useRef<number>(0);
  const maxScroll = useRef<number>(0);

  useEffect(() => {
    // Exclude ops console
    if (pathname.startsWith('/ops')) return;

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
          body: JSON.stringify({
            path: pathname,
            title: document.title,
            referrer: document.referrer || document.URL,
            userAgent: navigator.userAgent,
            screen: `${window.screen.width}x${window.screen.height}`,
            screen_width: window.screen.width,
            screen_height: window.screen.height,
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

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / scrollHeight) * 100;
      if (scrolled > maxScroll.current) {
        maxScroll.current = Math.min(Math.round(scrolled), 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Section Observer
    const sectionTimers = new Map<string, number>();
    let activeSection: string | null = null;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id;
        if (!id) return;
        
        if (entry.isIntersecting) {
          sectionTimers.set(id, Date.now());
          activeSection = id;
        } else {
          const entryTime = sectionTimers.get(id);
          if (entryTime) {
            const duration = Math.round((Date.now() - entryTime) / 1000);
            sectionTimers.delete(id);
            if (duration > 1) { // Only track if they stayed for more than 1 second
              import('@/lib/telemetry/events').then(({ trackEvent, TELEMETRY_EVENTS }) => {
                trackEvent({
                  type: TELEMETRY_EVENTS.SECTION_VIEW,
                  metadata: { section: id, duration_seconds: duration }
                });
              });
            }
          }
        }
      });
    }, { threshold: 0.5 }); // Fire when 50% visible

    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => observer.observe(section));

    const trackExit = () => {
      const timeSpent = Math.round((Date.now() - viewStartTime.current) / 1000);
      
      // Flush active section
      if (activeSection && sectionTimers.has(activeSection)) {
        const duration = Math.round((Date.now() - sectionTimers.get(activeSection)!) / 1000);
        if (duration > 1) {
          import('@/lib/telemetry/events').then(({ trackEvent, TELEMETRY_EVENTS }) => {
            trackEvent({
              type: TELEMETRY_EVENTS.SECTION_VIEW,
              metadata: { section: activeSection, duration_seconds: duration }
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
      // Use keepalive to ensure it fires when unloading
      fetch('/api/telemetry/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data,
        keepalive: true
      }).catch(() => {});
    };

    window.addEventListener('beforeunload', trackExit);

    // Initial view
    const timer = setTimeout(trackView, 1000);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', trackExit);
      observer.disconnect();
      trackExit(); // also track on route change
    };

  }, [pathname, searchParams]);

  // Expose a global method for custom events (e.g. terminal commands)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('@/lib/telemetry/events').then(({ trackEvent, TELEMETRY_EVENTS }) => {
        (window as unknown as { trackEvent: (eventType: string, eventName: string, eventData?: Record<string, unknown>) => void }).trackEvent = (eventType: string, eventName: string, eventData: Record<string, unknown> = {}) => {
          // Backward compatibility for terminal using trackEvent directly via window
          // We map it to the new engine
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
