export const TELEMETRY_EVENTS = {
  PAGE_VIEW: 'PAGE_VIEW',
  SESSION_START: 'SESSION_START',
  THEME_CHANGE: 'THEME_CHANGE',
  
  // Section Flow
  SECTION_VIEW: 'SECTION_VIEW', // Legacy
  SECTION_ENTER: 'SECTION_ENTER',
  SECTION_EXIT: 'SECTION_EXIT',
  
  // About Sub-sections (Granular Forensics)
  ABOUT_ENTER: 'ABOUT_ENTER',
  ABOUT_EXIT: 'ABOUT_EXIT',
  IDENTITY_ENTER: 'IDENTITY_ENTER',
  IDENTITY_EXIT: 'IDENTITY_EXIT',
  FOCUS_ENTER: 'FOCUS_ENTER',
  FOCUS_EXIT: 'FOCUS_EXIT',
  
  // Certificates & Specializations
  GOOGLE_SECTION_ENTER: 'GOOGLE_SECTION_ENTER',
  GOOGLE_SECTION_EXIT: 'GOOGLE_SECTION_EXIT',
  GOOGLE_SPECIALIZATION_OPEN: 'GOOGLE_SPECIALIZATION_OPEN',
  GOOGLE_SPECIALIZATION_CLOSE: 'GOOGLE_SPECIALIZATION_CLOSE',
  GOOGLE_COURSE_OPEN: 'GOOGLE_COURSE_OPEN',
  GOOGLE_COURSE_CLOSE: 'GOOGLE_COURSE_CLOSE',
  GOOGLE_VERIFY_CLICK: 'GOOGLE_VERIFY_CLICK',
  COMPTIA_SECTION_ENTER: 'COMPTIA_SECTION_ENTER',
  COMPTIA_SECTION_EXIT: 'COMPTIA_SECTION_EXIT',
  COMPTIA_CERTIFICATE_OPEN: 'COMPTIA_CERTIFICATE_OPEN',
  COMPTIA_CERTIFICATE_CLOSE: 'COMPTIA_CERTIFICATE_CLOSE',
  COMPTIA_VERIFY_CLICK: 'COMPTIA_VERIFY_CLICK',

  // Legacy Certificate Events
  CERTIFICATE_OPEN: 'CERTIFICATE_OPEN',
  CERTIFICATE_CLOSE: 'CERTIFICATE_CLOSE',
  CERTIFICATE_VERIFY: 'CERTIFICATE_VERIFY',

  // Project Events
  PROJECT_OPEN: 'PROJECT_OPEN',
  PROJECT_CLOSE: 'PROJECT_CLOSE',
  GITHUB_CLICK: 'GITHUB_CLICK',
  DEMO_CLICK: 'DEMO_CLICK',

  // Interactions
  CTA_CLICK: 'CTA_CLICK',
  SOCIAL_CLICK: 'SOCIAL_CLICK',
  SKILL_INTERACT: 'SKILL_INTERACT',

  // Terminal & Contact
  RESUME_DOWNLOAD: 'RESUME_DOWNLOAD',
  RESUME_VIEW: 'RESUME_VIEW',
  CONTACT_SUBMIT: 'CONTACT_SUBMIT',
  TERMINAL_COMMAND: 'TERMINAL_COMMAND',
  
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
