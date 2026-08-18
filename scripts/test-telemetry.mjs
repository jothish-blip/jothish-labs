

async function testTelemetry() {
  const payload = {
    path: '/',
    title: 'Test',
    referrer: '',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
    type: 'page_view',
    screen_width: 1920,
    screen_height: 1080,
    dpr: 1,
    orientation: 'landscape',
    language: 'en-US',
    timezone: 'America/New_York',
    theme: 'dark',
    color_scheme: 'dark',
    platform: 'Win32'
  };

  const res = await fetch('http://localhost:3000/api/telemetry', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': '1.2.3.4', // Fake IP
      'x-vercel-ip-country': 'US',
      'x-vercel-ip-country-region': 'NY',
      'x-vercel-ip-city': 'New York',
      'user-agent': payload.userAgent
    },
    body: JSON.stringify(payload)
  });

  const text = await res.text();
  console.log('Telemetry response:', res.status, text);
}

testTelemetry();
