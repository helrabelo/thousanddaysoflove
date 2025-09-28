-- Mil Dias de Amor - Row Level Security Policies
-- Migration 002: RLS policies for Brazilian wedding website security

-- Enable Row Level Security on all tables
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_config ENABLE ROW LEVEL SECURITY;

-- Guests table policies
-- Allow guests to read their own data by email or invitation code
CREATE POLICY "Guests can read own data" ON public.guests
    FOR SELECT USING (
        auth.jwt() ->> 'email' = email OR
        auth.jwt() ->> 'invitation_code' = invitation_code
    );

-- Allow guests to update their own RSVP
CREATE POLICY "Guests can update own RSVP" ON public.guests
    FOR UPDATE USING (
        auth.jwt() ->> 'email' = email OR
        auth.jwt() ->> 'invitation_code' = invitation_code
    );

-- Allow anonymous users to create new RSVPs (for invitation code flow)
CREATE POLICY "Allow RSVP creation" ON public.guests
    FOR INSERT WITH CHECK (true);

-- Allow anonymous users to read guest data for RSVP lookup
CREATE POLICY "Allow RSVP lookup" ON public.guests
    FOR SELECT USING (true);

-- Gifts table policies
-- Allow everyone to read gifts (public gift registry)
CREATE POLICY "Everyone can read gifts" ON public.gifts
    FOR SELECT USING (true);

-- Only authenticated admin can modify gifts
CREATE POLICY "Only admin can modify gifts" ON public.gifts
    FOR ALL USING (
        auth.jwt() ->> 'email' = 'hel@thousanddaysoflove.com' OR
        auth.jwt() ->> 'role' = 'admin'
    );

-- Payments table policies
-- Allow users to read payments for gifts they're viewing
CREATE POLICY "Users can read payment status" ON public.payments
    FOR SELECT USING (true);

-- Allow users to create payments
CREATE POLICY "Users can create payments" ON public.payments
    FOR INSERT WITH CHECK (true);

-- Allow payment updates only for payment processing
CREATE POLICY "Allow payment status updates" ON public.payments
    FOR UPDATE USING (true);

-- Only admin can delete payments
CREATE POLICY "Only admin can delete payments" ON public.payments
    FOR DELETE USING (
        auth.jwt() ->> 'email' = 'hel@thousanddaysoflove.com' OR
        auth.jwt() ->> 'role' = 'admin'
    );

-- Wedding config table policies
-- Allow everyone to read wedding configuration
CREATE POLICY "Everyone can read wedding config" ON public.wedding_config
    FOR SELECT USING (true);

-- Only admin can modify wedding configuration
CREATE POLICY "Only admin can modify wedding config" ON public.wedding_config
    FOR ALL USING (
        auth.jwt() ->> 'email' = 'hel@thousanddaysoflove.com' OR
        auth.jwt() ->> 'role' = 'admin'
    );

-- Create admin role for wedding management
-- NOTE: Create admin user manually through Supabase dashboard instead
-- This avoids dependency on auth functions not available in migrations

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
    RETURN (
        auth.jwt() ->> 'email' = 'hel@thousanddaysoflove.com' OR
        auth.jwt() ->> 'role' = 'admin' OR
        (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to validate Brazilian phone numbers
CREATE OR REPLACE FUNCTION validate_brazilian_phone(phone_number TEXT)
RETURNS boolean AS $$
BEGIN
    -- Brazilian phone validation: +55 (XX) 9XXXX-XXXX or similar formats
    RETURN phone_number IS NULL OR
           phone_number ~ '^\+55\s?\(?\d{2}\)?\s?9?\d{4,5}-?\d{4}$';
END;
$$ LANGUAGE plpgsql;

-- Add phone validation constraint
ALTER TABLE public.guests ADD CONSTRAINT valid_brazilian_phone
    CHECK (validate_brazilian_phone(phone));

-- Create function to generate invitation codes
CREATE OR REPLACE FUNCTION generate_invitation_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- Excluding confusing chars
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;

    -- Ensure uniqueness
    WHILE EXISTS (SELECT 1 FROM public.guests WHERE invitation_code = result) LOOP
        result := '';
        FOR i IN 1..8 LOOP
            result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
        END LOOP;
    END LOOP;

    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate invitation codes
CREATE OR REPLACE FUNCTION set_invitation_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.invitation_code IS NULL OR NEW.invitation_code = '' THEN
        NEW.invitation_code := generate_invitation_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_invitation_code BEFORE INSERT ON public.guests
    FOR EACH ROW EXECUTE FUNCTION set_invitation_code();

-- Create function to get gift availability status
CREATE OR REPLACE FUNCTION get_gift_availability(gift_id UUID)
RETURNS JSON AS $$
DECLARE
    gift_info RECORD;
    availability JSON;
BEGIN
    SELECT
        quantity_desired,
        quantity_purchased,
        is_available,
        price
    INTO gift_info
    FROM public.gifts
    WHERE id = gift_id;

    IF NOT FOUND THEN
        RETURN json_build_object('error', 'Gift not found');
    END IF;

    availability := json_build_object(
        'available', gift_info.is_available AND (gift_info.quantity_purchased < gift_info.quantity_desired),
        'quantity_remaining', GREATEST(0, gift_info.quantity_desired - gift_info.quantity_purchased),
        'quantity_desired', gift_info.quantity_desired,
        'quantity_purchased', gift_info.quantity_purchased,
        'price', gift_info.price,
        'is_active', gift_info.is_available
    );

    RETURN availability;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create view for gift statistics
CREATE OR REPLACE VIEW gift_stats AS
SELECT
    category,
    COUNT(*) as total_gifts,
    SUM(quantity_desired) as total_quantity_desired,
    SUM(quantity_purchased) as total_quantity_purchased,
    SUM(price * quantity_purchased) as total_value_purchased,
    SUM(price * quantity_desired) as total_value_desired,
    ROUND(
        (SUM(quantity_purchased)::decimal / NULLIF(SUM(quantity_desired), 0)) * 100, 2
    ) as completion_percentage
FROM public.gifts
GROUP BY category
ORDER BY completion_percentage DESC;

-- Create view for RSVP statistics
CREATE OR REPLACE VIEW rsvp_stats AS
SELECT
    COUNT(*) as total_guests,
    COUNT(*) FILTER (WHERE attending = true) as confirmed_attending,
    COUNT(*) FILTER (WHERE attending = false) as confirmed_not_attending,
    COUNT(*) FILTER (WHERE attending IS NULL) as pending_responses,
    COUNT(*) FILTER (WHERE attending = true AND plus_one = true) as plus_ones,
    COUNT(*) FILTER (WHERE attending = true) +
    COUNT(*) FILTER (WHERE attending = true AND plus_one = true) as total_attendees,
    ROUND(
        (COUNT(*) FILTER (WHERE attending IS NOT NULL)::decimal / NULLIF(COUNT(*), 0)) * 100, 2
    ) as response_rate
FROM public.guests;

-- Grant access to views
GRANT SELECT ON gift_stats TO anon, authenticated;
GRANT SELECT ON rsvp_stats TO anon, authenticated;

-- Create function for admin dashboard data
CREATE OR REPLACE FUNCTION get_admin_dashboard_data()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    -- Check if user is admin
    IF NOT is_admin() THEN
        RETURN json_build_object('error', 'Unauthorized');
    END IF;

    SELECT json_build_object(
        'rsvp_stats', (SELECT row_to_json(r) FROM rsvp_stats r),
        'gift_stats', (
            SELECT json_agg(row_to_json(g))
            FROM gift_stats g
        ),
        'recent_rsvps', (
            SELECT json_agg(
                json_build_object(
                    'id', id,
                    'name', name,
                    'email', email,
                    'attending', attending,
                    'plus_one', plus_one,
                    'rsvp_date', rsvp_date
                )
            )
            FROM (
                SELECT id, name, email, attending, plus_one, rsvp_date
                FROM public.guests
                WHERE rsvp_date IS NOT NULL
                ORDER BY rsvp_date DESC
                LIMIT 10
            ) recent
        ),
        'recent_payments', (
            SELECT json_agg(
                json_build_object(
                    'id', p.id,
                    'amount', p.amount,
                    'status', p.status,
                    'payment_method', p.payment_method,
                    'gift_name', g.name,
                    'guest_name', gu.name,
                    'created_at', p.created_at
                )
            )
            FROM (
                SELECT p.*, g.name as gift_name, gu.name as guest_name
                FROM public.payments p
                JOIN public.gifts g ON p.gift_id = g.id
                LEFT JOIN public.guests gu ON p.guest_id = gu.id
                ORDER BY p.created_at DESC
                LIMIT 10
            ) p
        )
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments for RLS documentation
COMMENT ON POLICY "Guests can read own data" ON public.guests IS 'Permite que convidados vejam seus próprios dados';
COMMENT ON POLICY "Everyone can read gifts" ON public.gifts IS 'Lista de presentes é pública para todos os visitantes';
COMMENT ON FUNCTION is_admin() IS 'Verifica se o usuário atual é administrador do casamento';
COMMENT ON FUNCTION validate_brazilian_phone(TEXT) IS 'Valida formato de telefone brasileiro';
COMMENT ON FUNCTION generate_invitation_code() IS 'Gera código único de convite de 8 caracteres';