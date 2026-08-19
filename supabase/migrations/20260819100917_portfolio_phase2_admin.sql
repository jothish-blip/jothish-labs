-- Phase 2 Admin Roles, Settings, and Notifications

-- Notifications
CREATE TABLE IF NOT EXISTS portfolio_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(50) NOT NULL, -- e.g. CONTACT, SECURITY, TRAFFIC, SYSTEM
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    priority VARCHAR(20) DEFAULT 'LOW', -- LOW, MEDIUM, HIGH, CRITICAL
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings (Key-Value)
CREATE TABLE IF NOT EXISTS portfolio_settings (
    key VARCHAR(255) PRIMARY KEY,
    value JSONB NOT NULL,
    category VARCHAR(100) DEFAULT 'general',
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Access Control: Roles
CREATE TABLE IF NOT EXISTS portfolio_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Default Roles
INSERT INTO portfolio_roles (name, description) VALUES 
('superadmin', 'Full access to all systems'),
('editor', 'Can edit content, no access to security or settings'),
('viewer', 'Read-only access to dashboard and reports')
ON CONFLICT (name) DO NOTHING;

-- User Roles
CREATE TABLE IF NOT EXISTS portfolio_user_roles (
    admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES portfolio_roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (admin_id, role_id)
);

-- Add column for duration tracking on sessions
-- Usually sessions track created_at. We will add `duration` and `last_ping`
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portfolio_sessions' AND column_name='last_ping_at') THEN
        ALTER TABLE portfolio_sessions ADD COLUMN last_ping_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portfolio_sessions' AND column_name='total_duration') THEN
        ALTER TABLE portfolio_sessions ADD COLUMN total_duration INTEGER DEFAULT 0; -- in seconds
    END IF;
END $$;

-- RLS
ALTER TABLE portfolio_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read notifications" ON portfolio_notifications FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can insert notifications" ON portfolio_notifications FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update notifications" ON portfolio_notifications FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete notifications" ON portfolio_notifications FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can read settings" ON portfolio_settings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage settings" ON portfolio_settings FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can read roles" ON portfolio_roles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage roles" ON portfolio_roles FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can read user roles" ON portfolio_user_roles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage user roles" ON portfolio_user_roles FOR ALL USING (auth.role() = 'authenticated');

-- Subscriptions / Replication
ALTER PUBLICATION supabase_realtime ADD TABLE portfolio_notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE portfolio_settings;
