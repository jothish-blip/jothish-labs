-- Telemetry Expansion: Add visitor and session tracking fields

-- Add columns to portfolio_visitors
ALTER TABLE public.portfolio_visitors
ADD COLUMN IF NOT EXISTS public_ip TEXT,
ADD COLUMN IF NOT EXISTS proxy_vpn BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS environment TEXT,
ADD COLUMN IF NOT EXISTS referrer TEXT,
ADD COLUMN IF NOT EXISTS entry_url TEXT,
ADD COLUMN IF NOT EXISTS exit_url TEXT,
ADD COLUMN IF NOT EXISTS screen_width INTEGER,
ADD COLUMN IF NOT EXISTS screen_height INTEGER,
ADD COLUMN IF NOT EXISTS screen_dpr NUMERIC,
ADD COLUMN IF NOT EXISTS screen_orientation TEXT,
ADD COLUMN IF NOT EXISTS timezone TEXT,
ADD COLUMN IF NOT EXISTS language TEXT,
ADD COLUMN IF NOT EXISTS theme TEXT,
ADD COLUMN IF NOT EXISTS color_scheme TEXT,
ADD COLUMN IF NOT EXISTS isp TEXT,
ADD COLUMN IF NOT EXISTS latitude NUMERIC,
ADD COLUMN IF NOT EXISTS longitude NUMERIC;

-- Add columns to portfolio_sessions
ALTER TABLE public.portfolio_sessions
ADD COLUMN IF NOT EXISTS device_snapshot JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS page_view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS event_count INTEGER DEFAULT 0;
