import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

/**
 * Simple server-side HTML sanitization — no external deps required.
 * Strips potential XSS vectors, limits length, trims whitespace.
 */
function sanitizeName(raw: unknown): string {
  if (typeof raw !== 'string') return 'Anonymous';
  const trimmed = raw.trim();
  if (trimmed.length < 2) return 'Anonymous';

  // Strip HTML tags
  const noTags = trimmed.replace(/<[^>]*>/g, '');
  // Escape remaining HTML entities
  const escaped = noTags
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  // Block script-injection attempts (belt-and-suspenders)
  const safe = escaped.replace(/javascript:/gi, '').replace(/on\w+=/gi, '');

  // Enforce max length
  const final = safe.substring(0, 40);
  return final.length >= 2 ? final : 'Anonymous';
}

/** Simple rate-limiting key stored in-memory (resets on cold-start). */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5; // max requests
const RATE_WINDOW_MS = 60_000; // per 1 minute per visitor

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      visitorName,
      cookieConsent,
      policyAccepted,
      policyVersion,
      cookieVersion,
      acceptedAt,
    } = body;

    // Basic field validation
    if (typeof cookieConsent !== 'boolean' || typeof policyAccepted !== 'boolean') {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const visitorId = cookieStore.get('pf_vid')?.value;

    if (!visitorId) {
      return NextResponse.json({ success: false, error: 'Visitor ID not found' }, { status: 400 });
    }

    // Rate limit by visitor ID
    if (isRateLimited(visitorId)) {
      return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
    }

    const sanitizedName = sanitizeName(visitorName);

    // Validate versions
    const safePolicyVersion =
      typeof policyVersion === 'string' && /^\d+\.\d+$/.test(policyVersion)
        ? policyVersion
        : '2.0';
    const safeCookieVersion =
      typeof cookieVersion === 'string' && /^\d+\.\d+$/.test(cookieVersion)
        ? cookieVersion
        : '2.0';

    // Validate timestamp
    let safeAcceptedAt: string;
    try {
      safeAcceptedAt = acceptedAt ? new Date(acceptedAt).toISOString() : new Date().toISOString();
    } catch {
      safeAcceptedAt = new Date().toISOString();
    }

    const supabase = await createAdminClient();

    const { error } = await supabase
      .from('portfolio_visitors')
      .update({
        visitor_name: sanitizedName,
        cookie_consent: cookieConsent,
        policy_accepted: policyAccepted,
        accepted_at: policyAccepted ? safeAcceptedAt : null,
        policy_version: safePolicyVersion,
        cookie_version: safeCookieVersion,
      })
      .eq('visitor_id', visitorId);

    if (error) {
      console.error('[Consent API] Update Error:', error);
      return NextResponse.json({ success: false, error: 'Database update failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('[Consent API Error]', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
