-- Portfolio Admin Console Schema
-- Completely isolated from existing NexSpace tables

-- Create an explicit schema for the portfolio (optional, but good for isolation)
-- We will just use public schema with "portfolio_" prefix as requested by standard practices, ensuring no clash.

-- 1. Contact Management
CREATE TABLE IF NOT EXISTS public.portfolio_contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    intent TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    context_info TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
    tags TEXT[] DEFAULT '{}',
    notes TEXT,
    source TEXT DEFAULT 'portfolio_contact_form',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ -- Soft delete
);

-- 2. Visitor Analytics (Anonymous)
CREATE TABLE IF NOT EXISTS public.portfolio_visitors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    visitor_id TEXT UNIQUE NOT NULL, -- Anonymized hash or fingerprint
    first_visit TIMESTAMPTZ DEFAULT NOW(),
    last_visit TIMESTAMPTZ DEFAULT NOW(),
    total_visits INTEGER DEFAULT 1,
    total_time_spent INTEGER DEFAULT 0, -- In seconds
    country TEXT,
    region TEXT,
    city TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Sessions
CREATE TABLE IF NOT EXISTS public.portfolio_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT UNIQUE NOT NULL,
    visitor_id TEXT NOT NULL REFERENCES public.portfolio_visitors(visitor_id) ON DELETE CASCADE,
    entry_page TEXT,
    exit_page TEXT,
    landing_page TEXT,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    duration INTEGER DEFAULT 0, -- In seconds
    bounced BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Page Views
CREATE TABLE IF NOT EXISTS public.portfolio_page_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES public.portfolio_sessions(session_id) ON DELETE CASCADE,
    visitor_id TEXT NOT NULL REFERENCES public.portfolio_visitors(visitor_id) ON DELETE CASCADE,
    path TEXT NOT NULL,
    title TEXT,
    time_spent INTEGER DEFAULT 0,
    scroll_depth INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Events (Terminal, Clicks, Downloads)
CREATE TABLE IF NOT EXISTS public.portfolio_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES public.portfolio_sessions(session_id) ON DELETE CASCADE,
    visitor_id TEXT NOT NULL REFERENCES public.portfolio_visitors(visitor_id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- e.g., 'terminal_command', 'resume_download', 'project_open'
    event_name TEXT NOT NULL, -- e.g., 'ls', 'Botium Toys'
    event_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Audit Logs (Admin Actions)
CREATE TABLE IF NOT EXISTS public.portfolio_audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID NOT NULL, -- References auth.users(id)
    action TEXT NOT NULL, -- e.g., 'login', 'update_contact', 'archive_contact'
    resource_type TEXT NOT NULL, -- e.g., 'contact', 'settings'
    resource_id TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Admin Configuration
CREATE TABLE IF NOT EXISTS public.portfolio_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID -- References auth.users(id)
);

-- RLS POLICIES

-- Enable RLS on all tables
ALTER TABLE public.portfolio_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_settings ENABLE ROW LEVEL SECURITY;

-- Allow public to INSERT contacts
CREATE POLICY "Allow public insert to portfolio_contacts" ON public.portfolio_contacts
    FOR INSERT WITH CHECK (true);

-- Allow public to INSERT analytics
CREATE POLICY "Allow public insert to portfolio_visitors" ON public.portfolio_visitors
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update to portfolio_visitors" ON public.portfolio_visitors
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public insert to portfolio_sessions" ON public.portfolio_sessions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update to portfolio_sessions" ON public.portfolio_sessions
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public insert to portfolio_page_views" ON public.portfolio_page_views
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update to portfolio_page_views" ON public.portfolio_page_views
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public insert to portfolio_events" ON public.portfolio_events
    FOR INSERT WITH CHECK (true);

-- Admin Access Policies (Requires authenticated user)
-- For the portfolio, we will allow the authenticated user with a specific email to read/write all.
-- We will enforce the email check in the Next.js backend, but in the DB we can just allow authenticated users, 
-- or restrict to a specific admin email if preferred. Let's just allow authenticated users for now, 
-- and the Next.js app will only allow the specific admin email to log in / exist.

CREATE POLICY "Allow admin full access on portfolio_contacts" ON public.portfolio_contacts
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin full access on portfolio_visitors" ON public.portfolio_visitors
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin full access on portfolio_sessions" ON public.portfolio_sessions
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin full access on portfolio_page_views" ON public.portfolio_page_views
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin full access on portfolio_events" ON public.portfolio_events
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin full access on portfolio_audit_logs" ON public.portfolio_audit_logs
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin full access on portfolio_settings" ON public.portfolio_settings
    FOR ALL USING (auth.role() = 'authenticated');

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_portfolio_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_portfolio_contacts_updated_at
    BEFORE UPDATE ON public.portfolio_contacts
    FOR EACH ROW EXECUTE FUNCTION update_portfolio_updated_at_column();

CREATE TRIGGER update_portfolio_visitors_updated_at
    BEFORE UPDATE ON public.portfolio_visitors
    FOR EACH ROW EXECUTE FUNCTION update_portfolio_updated_at_column();

CREATE TRIGGER update_portfolio_sessions_updated_at
    BEFORE UPDATE ON public.portfolio_sessions
    FOR EACH ROW EXECUTE FUNCTION update_portfolio_updated_at_column();
