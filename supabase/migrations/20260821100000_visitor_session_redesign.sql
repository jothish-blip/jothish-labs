-- Visitor Session Redesign Migration

-- 1. Create a more robust Blocked Visitors table
CREATE TABLE IF NOT EXISTS public.portfolio_blocked_visitors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    visitor_id TEXT NOT NULL,
    cookie_id TEXT,
    device_fingerprint TEXT,
    ip_address TEXT,
    reason TEXT,
    blocked_by UUID, -- References auth.users(id) conceptually
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.portfolio_blocked_visitors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow admin full access on portfolio_blocked_visitors" ON public.portfolio_blocked_visitors
    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow public read on portfolio_blocked_visitors" ON public.portfolio_blocked_visitors
    FOR SELECT USING (true);

-- Migrate existing IPs from portfolio_blocked_ips (if any)
INSERT INTO public.portfolio_blocked_visitors (visitor_id, ip_address, reason, blocked_by, created_at, updated_at)
SELECT 
    'LEGACY_IP_BLOCK_' || id::text, 
    ip_address, 
    reason, 
    blocked_by, 
    created_at, 
    updated_at
FROM public.portfolio_blocked_ips
ON CONFLICT DO NOTHING;

-- Drop the old table since we don't need it anymore
DROP TABLE IF EXISTS public.portfolio_blocked_ips CASCADE;

-- 2. Add columns to portfolio_visitors
ALTER TABLE public.portfolio_visitors
ADD COLUMN IF NOT EXISTS cookie_id TEXT,
ADD COLUMN IF NOT EXISTS device_fingerprint TEXT,
ADD COLUMN IF NOT EXISTS timezone TEXT,
ADD COLUMN IF NOT EXISTS language TEXT,
ADD COLUMN IF NOT EXISTS screen_resolution TEXT,
ADD COLUMN IF NOT EXISTS ip_address TEXT,
ADD COLUMN IF NOT EXISTS isp TEXT,
ADD COLUMN IF NOT EXISTS browser_version TEXT,
ADD COLUMN IF NOT EXISTS os_version TEXT;

-- 3. Add columns to portfolio_sessions
ALTER TABLE public.portfolio_sessions
ADD COLUMN IF NOT EXISTS cookie_id TEXT,
ADD COLUMN IF NOT EXISTS device_fingerprint TEXT,
ADD COLUMN IF NOT EXISTS browser TEXT,
ADD COLUMN IF NOT EXISTS browser_version TEXT,
ADD COLUMN IF NOT EXISTS os TEXT,
ADD COLUMN IF NOT EXISTS device_type TEXT,
ADD COLUMN IF NOT EXISTS screen_resolution TEXT,
ADD COLUMN IF NOT EXISTS timezone TEXT,
ADD COLUMN IF NOT EXISTS language TEXT,
ADD COLUMN IF NOT EXISTS ip_address TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS region TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS isp TEXT,
ADD COLUMN IF NOT EXISTS user_agent TEXT,
ADD COLUMN IF NOT EXISTS session_start_time TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS session_end_time TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS current_page TEXT,
ADD COLUMN IF NOT EXISTS reconnects INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS visits_count INTEGER DEFAULT 1;

-- Update existing foreign keys to ON DELETE CASCADE
-- We need to drop and re-create them for page_views and events to ensure they cascade properly.
ALTER TABLE public.portfolio_page_views
DROP CONSTRAINT IF EXISTS portfolio_page_views_visitor_id_fkey,
ADD CONSTRAINT portfolio_page_views_visitor_id_fkey
FOREIGN KEY (visitor_id) REFERENCES public.portfolio_visitors(visitor_id) ON DELETE CASCADE;

ALTER TABLE public.portfolio_page_views
DROP CONSTRAINT IF EXISTS portfolio_page_views_session_id_fkey,
ADD CONSTRAINT portfolio_page_views_session_id_fkey
FOREIGN KEY (session_id) REFERENCES public.portfolio_sessions(session_id) ON DELETE CASCADE;

ALTER TABLE public.portfolio_events
DROP CONSTRAINT IF EXISTS portfolio_events_visitor_id_fkey,
ADD CONSTRAINT portfolio_events_visitor_id_fkey
FOREIGN KEY (visitor_id) REFERENCES public.portfolio_visitors(visitor_id) ON DELETE CASCADE;

ALTER TABLE public.portfolio_events
DROP CONSTRAINT IF EXISTS portfolio_events_session_id_fkey,
ADD CONSTRAINT portfolio_events_session_id_fkey
FOREIGN KEY (session_id) REFERENCES public.portfolio_sessions(session_id) ON DELETE CASCADE;

-- Also update the status constraint in sessions
-- Let's drop the constraint if it exists and let the application manage it, or add a wider check.
ALTER TABLE public.portfolio_sessions DROP CONSTRAINT IF EXISTS portfolio_sessions_status_check;
ALTER TABLE public.portfolio_sessions ADD CONSTRAINT portfolio_sessions_status_check CHECK (status IN ('CREATED', 'ACTIVE', 'IDLE', 'EXPIRED', 'ARCHIVED'));

-- Create an index on last_ping_at for fast sweeping
CREATE INDEX IF NOT EXISTS idx_portfolio_sessions_last_ping_at ON public.portfolio_sessions(last_ping_at);
CREATE INDEX IF NOT EXISTS idx_portfolio_sessions_status ON public.portfolio_sessions(status);
CREATE INDEX IF NOT EXISTS idx_portfolio_visitors_visitor_id ON public.portfolio_visitors(visitor_id);
