import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

// Basic in-memory rate limiting (Works per-isolate in Edge, sufficient for basic abuse prevention without Redis)
type RateLimitStore = {
  count: number;
  resetTime: number;
};

const rateLimitCache = new Map<string, RateLimitStore>();

function checkRateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitCache.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitCache.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count += 1;
  return true;
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const requestIp = (request as any).ip;
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || requestIp || '127.0.0.1';

  // Rate limit /api/contact (5 requests per minute)
  if (request.nextUrl.pathname.startsWith('/api/contact')) {
    if (!checkRateLimit(`contact_${ip}`, 5, 60 * 1000)) {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
    }
  }

  // Rate limit /api/events (100 requests per minute)
  if (request.nextUrl.pathname.startsWith('/api/events')) {
    if (!checkRateLimit(`events_${ip}`, 100, 60 * 1000)) {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
    }
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          const cookieOptions = {
            ...options,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
          };
          request.cookies.set({
            name,
            value,
            ...cookieOptions,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...cookieOptions,
          });
        },
        remove(name: string, options: CookieOptions) {
          const cookieOptions = {
            ...options,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
          };
          request.cookies.set({
            name,
            value: '',
            ...cookieOptions,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...cookieOptions,
          });
        },
      },
    }
  );

  // IP Block check
  const { data: ipLimit } = await supabase
    .from('portfolio_rate_limits')
    .select('is_blocked, blocked_until')
    .eq('ip_address', ip)
    .maybeSingle();

  if (ipLimit) {
    if (ipLimit.is_blocked || (ipLimit.blocked_until && new Date(ipLimit.blocked_until) > new Date())) {
      return new NextResponse('Access Denied: Your IP address has been blocked.', { status: 403 });
    }
  }

  const { data: { user } } = await supabase.auth.getUser();

  const isOpsRoute = request.nextUrl.pathname.startsWith('/ops');
  const isAuthRoute = request.nextUrl.pathname === '/ops/login';
  const isMfaRoute = request.nextUrl.pathname === '/ops/login/mfa';

  if (isOpsRoute) {
    if (!user) {
      if (!isAuthRoute) {
        const redirectUrl = new URL('/ops/login', request.url);
        const redirectResponse = NextResponse.redirect(redirectUrl);
        response.cookies.getAll().forEach((c) => {
          redirectResponse.cookies.set(c.name, c.value, {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            path: '/',
          });
        });
        return redirectResponse;
      }
    } else {
      // User has a session.
      // Enforce AAL2 (MFA) here if factors are configured for admin.
      const { data: mfaData, error: mfaError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      
      let requiresMfa = false;

      // Default to strict if we can't read settings
      const { data: settings } = await supabase.from('portfolio_settings').select('value').eq('key', 'enforce_mfa').maybeSingle();
      const enforceMfa = settings?.value?.replace(/"/g, '') || 'strict';

      if (!mfaError && mfaData) {
        const { currentLevel, nextLevel } = mfaData;
        
        if (nextLevel === 'aal2' && currentLevel !== 'aal2') {
          requiresMfa = true;
        } else if (nextLevel === 'aal1' && enforceMfa === 'strict') {
          requiresMfa = true;
        }
      } else {
        if (enforceMfa === 'strict') requiresMfa = true;
      }

      if (requiresMfa) {
        if (isMfaRoute || isAuthRoute) {
          // Allow them to be on the login or MFA page to complete authentication
        } else {
          // If they try to access the dashboard directly without finishing MFA, send them back to the login page to start over
          const redirectResponse = NextResponse.redirect(new URL('/ops/login', request.url));
          response.cookies.getAll().forEach((c) => {
          redirectResponse.cookies.set(c.name, c.value, {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            path: '/',
          });
        });
          return redirectResponse;
        }
      } else {
        // MFA is fulfilled (or not strictly enforced and no AAL2 set)
        if (isAuthRoute || isMfaRoute) {
          const redirectResponse = NextResponse.redirect(new URL('/ops', request.url));
          response.cookies.getAll().forEach((c) => {
          redirectResponse.cookies.set(c.name, c.value, {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            path: '/',
          });
        });
          return redirectResponse;
        }
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
