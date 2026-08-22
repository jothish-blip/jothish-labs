import { headers } from 'next/headers';

export function parseUserAgentDetailed(ua: string) {
  let browser = 'Unknown';
  let browser_version = 'Unknown';
  let os = 'Unknown';
  let os_version = 'Unknown';
  let device = 'Desktop';

  if (ua.includes('Firefox')) {
    browser = 'Firefox';
    browser_version = ua.match(/Firefox\/([\d.]+)/)?.[1] || 'Unknown';
  } else if (ua.includes('Edg')) {
    browser = 'Edge';
    browser_version = ua.match(/Edg\/([\d.]+)/)?.[1] || 'Unknown';
  } else if (ua.includes('Chrome')) {
    browser = 'Chrome';
    browser_version = ua.match(/Chrome\/([\d.]+)/)?.[1] || 'Unknown';
  } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
    browser = 'Safari';
    browser_version = ua.match(/Version\/([\d.]+)/)?.[1] || 'Unknown';
  }

  if (ua.includes('Windows NT 10.0')) { os = 'Windows'; os_version = '10/11'; }
  else if (ua.includes('Windows NT 6.3')) { os = 'Windows'; os_version = '8.1'; }
  else if (ua.includes('Windows NT 6.2')) { os = 'Windows'; os_version = '8'; }
  else if (ua.includes('Windows NT 6.1')) { os = 'Windows'; os_version = '7'; }
  else if (ua.includes('Mac OS X')) { 
    os = 'macOS'; 
    os_version = ua.match(/Mac OS X ([\d_]+)/)?.[1]?.replace(/_/g, '.') || 'Unknown'; 
  }
  else if (ua.includes('Android')) {
    os = 'Android';
    os_version = ua.match(/Android ([\d.]+)/)?.[1] || 'Unknown';
    device = 'Mobile';
  }
  else if (ua.includes('iPhone OS') || ua.includes('iPad; CPU OS')) {
    os = 'iOS';
    os_version = ua.match(/OS ([\d_]+)/)?.[1]?.replace(/_/g, '.') || 'Unknown';
    device = 'Mobile';
  }
  else if (ua.includes('Linux')) { os = 'Linux'; }

  return { browser, browser_version, os, os_version, device };
}

export async function getClientContext() {
  const headersList = await headers();
  const ua = headersList.get('user-agent') || 'Unknown';
  const { browser, browser_version, os, os_version, device } = parseUserAgentDetailed(ua);
  
  const city = headersList.get('x-vercel-ip-city') || '';
  const region = headersList.get('x-vercel-ip-country-region') || '';
  const country = headersList.get('x-vercel-ip-country') || '';
  const locationParts = [city, region, country].filter(Boolean);
  const location = locationParts.length > 0 ? locationParts.join(', ') : 'Unknown';

  return {
    ip: headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || headersList.get('x-real-ip') || 'Local Development',
    userAgent: ua,
    browser,
    browser_version,
    os,
    os_version,
    device,
    location,
    city: city || 'Unknown',
    region: region || 'Unknown',
    country: country || 'Unknown',
    timezone: headersList.get('x-vercel-timezone') || 'Unknown'
  };
}
