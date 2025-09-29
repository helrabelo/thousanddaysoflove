-- Mil Dias de Amor - Enhanced Guest System
-- Migration 004: Advanced features for world-class RSVP system

-- Add enhanced fields to guests table
ALTER TABLE public.guests ADD COLUMN family_group_id UUID;
ALTER TABLE public.guests ADD COLUMN invited_by VARCHAR(255);
ALTER TABLE public.guests ADD COLUMN invitation_sent_date TIMESTAMPTZ;
ALTER TABLE public.guests ADD COLUMN invitation_opened_date TIMESTAMPTZ;
ALTER TABLE public.guests ADD COLUMN rsvp_reminder_count INTEGER DEFAULT 0;
ALTER TABLE public.guests ADD COLUMN communication_preferences JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.guests ADD COLUMN guest_type VARCHAR(20) DEFAULT 'individual' CHECK (guest_type IN ('individual', 'family_head', 'family_member'));
ALTER TABLE public.guests ADD COLUMN qr_code_url TEXT;
ALTER TABLE public.guests ADD COLUMN last_email_sent_date TIMESTAMPTZ;
ALTER TABLE public.guests ADD COLUMN email_delivery_status VARCHAR(20) DEFAULT 'pending' CHECK (email_delivery_status IN ('pending', 'sent', 'delivered', 'bounced', 'failed'));

-- Create family_groups table for managing family invitations
CREATE TABLE public.family_groups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    family_name VARCHAR(255) NOT NULL,
    family_head_guest_id UUID REFERENCES public.guests(id) ON DELETE SET NULL,
    invitation_code VARCHAR(10) NOT NULL UNIQUE, -- Shared invitation code for family
    max_family_size INTEGER DEFAULT 4,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create invitation_codes table for advanced code management
CREATE TABLE public.invitation_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    code_type VARCHAR(20) DEFAULT 'individual' CHECK (code_type IN ('individual', 'family', 'plus_one')),
    guest_id UUID REFERENCES public.guests(id) ON DELETE CASCADE,
    family_group_id UUID REFERENCES public.family_groups(id) ON DELETE CASCADE,
    is_used BOOLEAN DEFAULT false,
    usage_count INTEGER DEFAULT 0,
    max_usage INTEGER DEFAULT 1,
    generated_date TIMESTAMPTZ DEFAULT now() NOT NULL,
    expiry_date TIMESTAMPTZ,
    qr_code_data TEXT, -- QR code content
    qr_code_image_url TEXT, -- URL to QR code image
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,

    -- Ensure either guest_id or family_group_id is set, but not both
    CONSTRAINT check_code_assignment CHECK (
        (guest_id IS NOT NULL AND family_group_id IS NULL) OR
        (guest_id IS NULL AND family_group_id IS NOT NULL)
    )
);

-- Create email_logs table for tracking email communications
CREATE TABLE public.email_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
    email_type VARCHAR(50) NOT NULL, -- 'invitation', 'reminder', 'confirmation', 'thank_you'
    subject VARCHAR(255) NOT NULL,
    template_name VARCHAR(100),
    sent_date TIMESTAMPTZ DEFAULT now() NOT NULL,
    delivery_status VARCHAR(20) DEFAULT 'sent' CHECK (delivery_status IN ('sent', 'delivered', 'bounced', 'failed', 'opened', 'clicked')),
    sendgrid_message_id VARCHAR(255),
    error_message TEXT,
    opened_date TIMESTAMPTZ,
    clicked_date TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create rsvp_analytics table for tracking engagement
CREATE TABLE public.rsvp_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    guest_id UUID REFERENCES public.guests(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 'invitation_sent', 'invitation_opened', 'form_started', 'form_completed', 'reminder_sent'
    event_data JSONB DEFAULT '{}'::jsonb,
    user_agent TEXT,
    ip_address INET,
    referrer TEXT,
    session_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Add foreign key relationship for family groups
ALTER TABLE public.guests ADD CONSTRAINT fk_guests_family_group
    FOREIGN KEY (family_group_id) REFERENCES public.family_groups(id) ON DELETE SET NULL;

-- Add updated_at triggers for new tables
CREATE TRIGGER update_family_groups_updated_at BEFORE UPDATE ON public.family_groups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_guests_family_group_id ON public.guests(family_group_id);
CREATE INDEX idx_guests_guest_type ON public.guests(guest_type);
CREATE INDEX idx_guests_invitation_sent_date ON public.guests(invitation_sent_date);
CREATE INDEX idx_guests_email_delivery_status ON public.guests(email_delivery_status);

CREATE INDEX idx_family_groups_family_name ON public.family_groups(family_name);
CREATE INDEX idx_family_groups_invitation_code ON public.family_groups(invitation_code);

CREATE INDEX idx_invitation_codes_code ON public.invitation_codes(code);
CREATE INDEX idx_invitation_codes_guest_id ON public.invitation_codes(guest_id);
CREATE INDEX idx_invitation_codes_family_group_id ON public.invitation_codes(family_group_id);
CREATE INDEX idx_invitation_codes_is_used ON public.invitation_codes(is_used);

CREATE INDEX idx_email_logs_guest_id ON public.email_logs(guest_id);
CREATE INDEX idx_email_logs_email_type ON public.email_logs(email_type);
CREATE INDEX idx_email_logs_sent_date ON public.email_logs(sent_date);
CREATE INDEX idx_email_logs_delivery_status ON public.email_logs(delivery_status);

CREATE INDEX idx_rsvp_analytics_guest_id ON public.rsvp_analytics(guest_id);
CREATE INDEX idx_rsvp_analytics_event_type ON public.rsvp_analytics(event_type);
CREATE INDEX idx_rsvp_analytics_created_at ON public.rsvp_analytics(created_at);

-- Create enhanced functions for invitation code generation
CREATE OR REPLACE FUNCTION generate_brazilian_invitation_code(
    code_prefix TEXT DEFAULT 'HY25'
) RETURNS TEXT AS $$
DECLARE
    new_code TEXT;
    code_exists BOOLEAN;
BEGIN
    LOOP
        -- Generate code with Brazilian wedding format: HY25-XXXX
        new_code := code_prefix || '-' || upper(substring(md5(random()::text), 1, 4));

        -- Check if code exists in guests or family_groups or invitation_codes
        SELECT EXISTS (
            SELECT 1 FROM public.guests WHERE invitation_code = new_code
            UNION ALL
            SELECT 1 FROM public.family_groups WHERE invitation_code = new_code
            UNION ALL
            SELECT 1 FROM public.invitation_codes WHERE code = new_code
        ) INTO code_exists;

        -- Exit loop if code is unique
        EXIT WHEN NOT code_exists;
    END LOOP;

    RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Function to create family group with invitation code
CREATE OR REPLACE FUNCTION create_family_group(
    p_family_name TEXT,
    p_max_family_size INTEGER DEFAULT 4
) RETURNS UUID AS $$
DECLARE
    new_group_id UUID;
    new_invitation_code TEXT;
BEGIN
    -- Generate unique invitation code
    new_invitation_code := generate_brazilian_invitation_code();

    -- Insert family group
    INSERT INTO public.family_groups (
        family_name,
        invitation_code,
        max_family_size
    ) VALUES (
        p_family_name,
        new_invitation_code,
        p_max_family_size
    ) RETURNING id INTO new_group_id;

    RETURN new_group_id;
END;
$$ LANGUAGE plpgsql;

-- Function to track RSVP analytics events
CREATE OR REPLACE FUNCTION track_rsvp_event(
    p_guest_id UUID,
    p_event_type TEXT,
    p_event_data JSONB DEFAULT '{}'::jsonb,
    p_user_agent TEXT DEFAULT NULL,
    p_ip_address TEXT DEFAULT NULL,
    p_referrer TEXT DEFAULT NULL,
    p_session_id TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    new_event_id UUID;
BEGIN
    INSERT INTO public.rsvp_analytics (
        guest_id,
        event_type,
        event_data,
        user_agent,
        ip_address,
        referrer,
        session_id
    ) VALUES (
        p_guest_id,
        p_event_type,
        p_event_data,
        p_user_agent,
        p_ip_address::INET,
        p_referrer,
        p_session_id
    ) RETURNING id INTO new_event_id;

    RETURN new_event_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get guest RSVP statistics
CREATE OR REPLACE FUNCTION get_guest_rsvp_stats()
RETURNS TABLE (
    total_guests INTEGER,
    confirmed_guests INTEGER,
    declined_guests INTEGER,
    pending_guests INTEGER,
    total_with_plus_ones INTEGER,
    confirmation_rate DECIMAL(5,2),
    family_groups_count INTEGER,
    individual_guests_count INTEGER,
    invitations_sent INTEGER,
    invitations_opened INTEGER,
    reminder_emails_sent INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::INTEGER as total_guests,
        COUNT(CASE WHEN g.attending = true THEN 1 END)::INTEGER as confirmed_guests,
        COUNT(CASE WHEN g.attending = false THEN 1 END)::INTEGER as declined_guests,
        COUNT(CASE WHEN g.attending IS NULL THEN 1 END)::INTEGER as pending_guests,
        (COUNT(CASE WHEN g.attending = true THEN 1 END) +
         COUNT(CASE WHEN g.attending = true AND g.plus_one = true THEN 1 END))::INTEGER as total_with_plus_ones,
        CASE
            WHEN COUNT(*) > 0 THEN
                ROUND((COUNT(CASE WHEN g.attending IS NOT NULL THEN 1 END)::DECIMAL / COUNT(*)::DECIMAL) * 100, 2)
            ELSE 0
        END as confirmation_rate,
        COUNT(DISTINCT g.family_group_id)::INTEGER as family_groups_count,
        COUNT(CASE WHEN g.guest_type = 'individual' THEN 1 END)::INTEGER as individual_guests_count,
        COUNT(CASE WHEN g.invitation_sent_date IS NOT NULL THEN 1 END)::INTEGER as invitations_sent,
        COUNT(CASE WHEN g.invitation_opened_date IS NOT NULL THEN 1 END)::INTEGER as invitations_opened,
        SUM(g.rsvp_reminder_count)::INTEGER as reminder_emails_sent
    FROM public.guests g;
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE public.family_groups IS 'Grupos familiares para convites em família';
COMMENT ON TABLE public.invitation_codes IS 'Códigos de convite avançados com QR codes e analytics';
COMMENT ON TABLE public.email_logs IS 'Log de emails enviados para rastreamento de entrega';
COMMENT ON TABLE public.rsvp_analytics IS 'Analytics de engajamento dos convidados';

COMMENT ON COLUMN public.guests.family_group_id IS 'ID do grupo familiar (se aplicável)';
COMMENT ON COLUMN public.guests.guest_type IS 'Tipo: individual, chefe de família, ou membro de família';
COMMENT ON COLUMN public.guests.communication_preferences IS 'Preferências de comunicação em JSON';
COMMENT ON COLUMN public.invitation_codes.qr_code_data IS 'Dados do QR code para acesso rápido via celular';
COMMENT ON COLUMN public.email_logs.email_type IS 'Tipo de email: convite, lembrete, confirmação, agradecimento';