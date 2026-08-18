import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/server';

const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_name, user_email, context_info, message, intent } = body;

    if (!user_name || !user_email || !message) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user_email)) {
      return NextResponse.json({ success: false, error: 'Invalid email format' }, { status: 400 });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? request.headers.get('x-real-ip') ?? 'unknown';
    const now = Date.now();
    const windowMs = 60 * 60 * 1000;
    const limit = 5;
    const rateData = rateLimitMap.get(ip) ?? { count: 0, timestamp: now };

    if (now - rateData.timestamp > windowMs) {
      rateData.count = 1;
      rateData.timestamp = now;
    } else {
      rateData.count += 1;
    }

    rateLimitMap.set(ip, rateData);

    if (rateData.count > limit) {
      return NextResponse.json({ success: false, error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const supabaseAdmin = await createAdminClient();
    const safeDbOperation = async (operation: PromiseLike<unknown>) => {
      try {
        const result = (await operation) as { data: unknown; error: { code?: string; message?: string } | null };
        if (result.error && result.error.code === '42P01') {
          return { data: null, error: result.error, isMissingTable: true };
        }
        return { ...result, isMissingTable: false };
      } catch (err: unknown) {
        const error = err as { code?: string; message?: string };
        if (error.code === '42P01' || error.message?.includes('42P01')) {
          return { data: null, error: err, isMissingTable: true };
        }
        throw err;
      }
    };

    const insertRes = await safeDbOperation(supabaseAdmin.from('portfolio_contacts').insert({
      intent: intent || 'conversation',
      name: user_name,
      email: user_email,
      context_info: context_info || null,
      message: message,
      status: 'unread',
      source: 'portfolio_contact_form'
    }));

    if (insertRes.isMissingTable) {
      console.error('[Contact API] Missing portfolio_contacts table');
      return NextResponse.json({ success: true, warning: 'Internal database misconfiguration' });
    }

    if (insertRes.error) {
      throw insertRes.error;
    }

    const userAgent = request.headers.get('user-agent') || 'Unknown';
    let browser = 'Unknown';
    let os = 'Unknown';
    
    if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Edg')) browser = 'Edge';
    else if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';

    if (userAgent.includes('Win')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';

    const city = request.headers.get('x-vercel-ip-city') || '';
    const region = request.headers.get('x-vercel-ip-country-region') || '';
    const country = request.headers.get('x-vercel-ip-country') || '';
    const locationParts = [city, region, country].filter(Boolean);
    const location = locationParts.length > 0 ? locationParts.join(', ') : 'Unknown';

    await safeDbOperation(supabaseAdmin.from('portfolio_audit_logs').insert({
      admin_id: null,
      actor: user_email,
      action: 'CONTACT_SUBMISSION',
      resource_type: 'contact',
      target: user_email,
      ip_address: ip,
      location: location,
      browser: browser,
      os: os,
      details: { email: user_email, intent: intent || 'conversation', source: 'portfolio_contact_form' }
    }));

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('[Contact API Error]', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
