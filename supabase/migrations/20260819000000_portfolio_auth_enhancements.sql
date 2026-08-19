-- Admin Login History
CREATE TABLE IF NOT EXISTS public.portfolio_admin_logins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID, -- References auth.users(id), can be null for failed attempts with unknown user
    username TEXT, -- Email or username attempted
    status TEXT NOT NULL CHECK (status IN ('SUCCESS', 'FAILED')),
    failure_reason TEXT,
    ip_address TEXT,
    country TEXT,
    browser TEXT,
    device TEXT,
    os TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Active Admin Sessions
CREATE TABLE IF NOT EXISTS public.portfolio_admin_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID NOT NULL, -- References auth.users(id)
    session_token TEXT UNIQUE NOT NULL,
    ip_address TEXT,
    country TEXT,
    browser TEXT,
    device TEXT,
    os TEXT,
    current_page TEXT,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    is_revoked BOOLEAN DEFAULT false
);

-- Rate Limiting
CREATE TABLE IF NOT EXISTS public.portfolio_rate_limits (
    ip_address TEXT PRIMARY KEY,
    attempts INTEGER DEFAULT 0,
    blocked_until TIMESTAMPTZ,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.portfolio_admin_logins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_rate_limits ENABLE ROW LEVEL SECURITY;

-- Allow admin full access
CREATE POLICY "Allow admin full access on portfolio_admin_logins" ON public.portfolio_admin_logins
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin full access on portfolio_admin_sessions" ON public.portfolio_admin_sessions
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin full access on portfolio_rate_limits" ON public.portfolio_rate_limits
    FOR ALL USING (auth.role() = 'authenticated');

-- We also allow unauthenticated inserts to portfolio_admin_logins for failed logins
CREATE POLICY "Allow public insert to portfolio_admin_logins" ON public.portfolio_admin_logins
    FOR INSERT WITH CHECK (true);

-- Allow public read/update to portfolio_rate_limits for enforcing rate limits
CREATE POLICY "Allow public all to portfolio_rate_limits" ON public.portfolio_rate_limits
    FOR ALL USING (true) WITH CHECK (true);
