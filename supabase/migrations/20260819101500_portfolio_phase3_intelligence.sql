-- Phase 3 Intelligence and Blocking

-- 1. Expanded Visitor Tracking
ALTER TABLE public.portfolio_visitors
ADD COLUMN IF NOT EXISTS asn TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT,
ADD COLUMN IF NOT EXISTS currency TEXT,
ADD COLUMN IF NOT EXISTS network_type TEXT,
ADD COLUMN IF NOT EXISTS bot_detection TEXT,
ADD COLUMN IF NOT EXISTS returning_visitor BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS block_reason TEXT,
ADD COLUMN IF NOT EXISTS block_expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS utm_source TEXT,
ADD COLUMN IF NOT EXISTS utm_medium TEXT,
ADD COLUMN IF NOT EXISTS utm_campaign TEXT;

-- 2. Expanded Session Tracking
ALTER TABLE public.portfolio_sessions
ADD COLUMN IF NOT EXISTS active_duration INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS idle_duration INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS navigation_path JSONB DEFAULT '[]'::jsonb;

-- 3. Blocked IPs Table
CREATE TABLE IF NOT EXISTS public.portfolio_blocked_ips (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ip_address TEXT UNIQUE NOT NULL,
    reason TEXT,
    notes TEXT,
    blocked_by UUID, -- References auth.users(id) conceptually
    expires_at TIMESTAMPTZ, -- null means permanent
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.portfolio_blocked_ips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow admin full access on portfolio_blocked_ips" ON public.portfolio_blocked_ips
    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow public read on portfolio_blocked_ips" ON public.portfolio_blocked_ips
    FOR SELECT USING (true); -- so backend can query quickly without admin token, though backend uses service role anyway.
