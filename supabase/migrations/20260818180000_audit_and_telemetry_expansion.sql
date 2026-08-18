-- 1. Expand portfolio_audit_logs
ALTER TABLE public.portfolio_audit_logs
ADD COLUMN IF NOT EXISTS actor TEXT,
ADD COLUMN IF NOT EXISTS target TEXT,
ADD COLUMN IF NOT EXISTS ip_address TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS browser TEXT,
ADD COLUMN IF NOT EXISTS os TEXT,
ADD COLUMN IF NOT EXISTS session_id TEXT;

-- Backfill actor if null
UPDATE public.portfolio_audit_logs
SET actor = COALESCE(
  details->>'email', 
  (SELECT email FROM auth.users WHERE auth.users.id = portfolio_audit_logs.admin_id LIMIT 1),
  'system'
)
WHERE actor IS NULL;

-- 2. Expand portfolio_visitors
ALTER TABLE public.portfolio_visitors
ADD COLUMN IF NOT EXISTS browser_version TEXT,
ADD COLUMN IF NOT EXISTS os_version TEXT;

-- We already added public_ip, country, region, city, isp, timezone, screen_width, screen_height, language, referrer to portfolio_visitors in previous migration.
-- Let's ensure 'landing_page' and 'current_page' are part of the session snapshot if not handled directly via events/page_views.
