-- Phase 3: Session State Machine Migration

-- Add status to portfolio_sessions
ALTER TABLE public.portfolio_sessions 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'CREATED' 
CHECK (status IN ('CREATED', 'ACTIVE', 'IDLE', 'EXPIRED', 'ARCHIVED'));

-- Add status to portfolio_admin_sessions
ALTER TABLE public.portfolio_admin_sessions 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'CREATED' 
CHECK (status IN ('CREATED', 'ACTIVE', 'IDLE', 'EXPIRED', 'ARCHIVED'));

-- Default all existing valid admin sessions to ACTIVE, expired to EXPIRED
UPDATE public.portfolio_admin_sessions 
SET status = 'ACTIVE' WHERE is_revoked = false AND expires_at > NOW();

UPDATE public.portfolio_admin_sessions 
SET status = 'EXPIRED' WHERE is_revoked = true OR expires_at <= NOW();

-- Default all existing visitor sessions: 
-- ACTIVE if pinged recently, otherwise EXPIRED
UPDATE public.portfolio_sessions 
SET status = 'ACTIVE' WHERE last_ping_at > NOW() - INTERVAL '1 minute';

UPDATE public.portfolio_sessions 
SET status = 'EXPIRED' WHERE last_ping_at <= NOW() - INTERVAL '1 minute' OR last_ping_at IS NULL;
