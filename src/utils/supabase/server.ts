import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({
              name,
              value,
              ...options,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax' as const,
              path: '/',
            });
          } catch (error) {
            // Cookie can only be set in a Server Action or Route Handler
            console.warn('[Supabase] Cookie set failed:', name, error instanceof Error ? error.message : 'unknown');
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({
              name,
              value: '',
              ...options,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax' as const,
              path: '/',
              maxAge: 0,
            });
          } catch (error) {
            console.warn('[Supabase] Cookie remove failed:', name, error instanceof Error ? error.message : 'unknown');
          }
        },
      },
    }
  );
}

export async function createAdminClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({
              name,
              value,
              ...options,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax' as const,
              path: '/',
            });
          } catch (error) {
            console.warn('[Supabase] Admin cookie set failed:', name, error instanceof Error ? error.message : 'unknown');
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({
              name,
              value: '',
              ...options,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax' as const,
              path: '/',
              maxAge: 0,
            });
          } catch (error) {
            console.warn('[Supabase] Admin cookie remove failed:', name, error instanceof Error ? error.message : 'unknown');
          }
        },
      },
    }
  );
}
