-- Portfolio Security & System Monitoring Schema

-- 8. Security Events (Threat Detection)
CREATE TABLE IF NOT EXISTS public.portfolio_security_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL, -- e.g., 'failed_login', 'rate_limit', 'unauthorized_access', 'suspicious_activity'
    severity TEXT NOT NULL DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    ip_address TEXT,
    user_agent TEXT,
    path TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID -- References auth.users(id)
);

-- 9. System Metrics
CREATE TABLE IF NOT EXISTS public.portfolio_system_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    metric_name TEXT NOT NULL,
    metric_value NUMERIC NOT NULL,
    unit TEXT,
    tags JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES
ALTER TABLE public.portfolio_security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_system_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow admin full access on portfolio_security_events" ON public.portfolio_security_events
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public insert to portfolio_security_events" ON public.portfolio_security_events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin full access on portfolio_system_metrics" ON public.portfolio_system_metrics
    FOR ALL USING (auth.role() = 'authenticated');
