-- Drop NOT NULL constraint on admin_id for portfolio_audit_logs
-- This allows us to log failed login attempts where the admin_id is not known.

ALTER TABLE public.portfolio_audit_logs ALTER COLUMN admin_id DROP NOT NULL;
