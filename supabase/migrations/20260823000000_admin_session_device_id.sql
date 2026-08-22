-- Add device_id to portfolio_admin_sessions
ALTER TABLE public.portfolio_admin_sessions
ADD COLUMN IF NOT EXISTS device_id TEXT;
