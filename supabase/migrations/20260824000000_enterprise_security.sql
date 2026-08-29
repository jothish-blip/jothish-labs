-- 1. Modify portfolio_rate_limits to support manual blocks and whitelisting
ALTER TABLE public.portfolio_rate_limits
ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_whitelisted BOOLEAN DEFAULT false;

-- 2. Create portfolio_admin_devices table for tracking trusted/blocked devices
CREATE TABLE IF NOT EXISTS public.portfolio_admin_devices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID NOT NULL,
    device_id TEXT NOT NULL,
    browser TEXT,
    os TEXT,
    device_type TEXT,
    user_agent TEXT,
    is_trusted BOOLEAN DEFAULT false,
    is_blocked BOOLEAN DEFAULT false,
    last_login_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (admin_id, device_id)
);

ALTER TABLE public.portfolio_admin_devices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow admin full access on portfolio_admin_devices" ON public.portfolio_admin_devices;
CREATE POLICY "Allow admin full access on portfolio_admin_devices" ON public.portfolio_admin_devices
    FOR ALL USING (auth.role() = 'authenticated');

-- 3. Create portfolio_security_alerts table for suspicious activities
CREATE TABLE IF NOT EXISTS public.portfolio_security_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID,
    type TEXT NOT NULL, -- e.g. 'NEW_DEVICE', 'NEW_COUNTRY', 'IMPOSSIBLE_TRAVEL', 'FAILED_LOGINS', 'MULTIPLE_SESSIONS', 'VPN_PROXY', 'SESSION_HIJACKING'
    severity TEXT NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    message TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    is_resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    resolved_by UUID
);

ALTER TABLE public.portfolio_security_alerts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow admin full access on portfolio_security_alerts" ON public.portfolio_security_alerts;
CREATE POLICY "Allow admin full access on portfolio_security_alerts" ON public.portfolio_security_alerts
    FOR ALL USING (auth.role() = 'authenticated');

-- 4. Create portfolio_admin_status table for locking/unlocking accounts and password reset flags
CREATE TABLE IF NOT EXISTS public.portfolio_admin_status (
    admin_id UUID PRIMARY KEY,
    is_locked BOOLEAN DEFAULT false,
    locked_reason TEXT,
    locked_at TIMESTAMPTZ,
    force_password_reset BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.portfolio_admin_status ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow admin full access on portfolio_admin_status" ON public.portfolio_admin_status;
CREATE POLICY "Allow admin full access on portfolio_admin_status" ON public.portfolio_admin_status
    FOR ALL USING (auth.role() = 'authenticated');

-- 5. Add extra columns to portfolio_admin_sessions for IP details
ALTER TABLE public.portfolio_admin_sessions
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS region TEXT,
ADD COLUMN IF NOT EXISTS isp TEXT,
ADD COLUMN IF NOT EXISTS user_agent TEXT,
ADD COLUMN IF NOT EXISTS device_id TEXT;

-- 6. Add extra columns to portfolio_admin_logins for IP details
ALTER TABLE public.portfolio_admin_logins
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS region TEXT,
ADD COLUMN IF NOT EXISTS isp TEXT,
ADD COLUMN IF NOT EXISTS user_agent TEXT,
ADD COLUMN IF NOT EXISTS device_id TEXT;
