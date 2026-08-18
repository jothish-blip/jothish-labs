export const TELEMETRY_EVENTS = {
  PROJECT_OPEN: 'PROJECT_OPEN',
  PROJECT_CLOSE: 'PROJECT_CLOSE',
  CERTIFICATE_OPEN: 'CERTIFICATE_OPEN',
  CERTIFICATE_VERIFY: 'CERTIFICATE_VERIFY',
  RESUME_VIEW: 'RESUME_VIEW',
  RESUME_DOWNLOAD: 'RESUME_DOWNLOAD',
  CONTACT_SUBMIT: 'CONTACT_SUBMIT',
  TERMINAL_COMMAND: 'TERMINAL_COMMAND',
  THEME_CHANGED: 'THEME_CHANGED',
  PAGE_VIEW: 'PAGE_VIEW',
  SECTION_VIEW: 'SECTION_VIEW',
  SECTION_EXIT: 'SECTION_EXIT',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  FAILED_LOGIN: 'FAILED_LOGIN',
  ERROR: 'ERROR',
} as const;

export type TelemetryEventType = typeof TELEMETRY_EVENTS[keyof typeof TELEMETRY_EVENTS];

export interface TrackEventParams {
  type: TelemetryEventType;
  visitorId?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
}

export const trackEvent = async ({
  type,
  metadata = {},
}: TrackEventParams): Promise<void> => {
  try {
    // Prevent tracking in ops console or if we are rendering server-side
    if (typeof window === 'undefined') return;
    if (window.location.pathname.startsWith('/ops')) return;

    // Send the custom event
    await fetch('/api/telemetry/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'custom_event',
        event_type: type,
        event_name: type,
        event_data: metadata,
      }),
      // Use keepalive for reliability during unloads
      keepalive: true,
    });
  } catch (error) {
    // Silently fail telemetry in production to avoid affecting user experience
    console.error('Telemetry event failed:', error);
  }
};
