-- Mil Dias de Amor - Initial Database Schema
-- Migration 001: Core tables for Brazilian wedding website

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create guests table
CREATE TABLE public.guests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(320) NOT NULL UNIQUE,
    phone VARCHAR(20), -- Brazilian phone format: +55 (11) 99999-9999
    attending BOOLEAN, -- null = pending, true = attending, false = not attending
    dietary_restrictions TEXT,
    plus_one BOOLEAN DEFAULT false,
    plus_one_name VARCHAR(255),
    invitation_code VARCHAR(10) NOT NULL UNIQUE,
    rsvp_date TIMESTAMPTZ,
    special_requests TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create gifts table
CREATE TABLE public.gifts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL, -- Brazilian Real (BRL) with centavos
    image_url TEXT,
    registry_url TEXT,
    quantity_desired INTEGER DEFAULT 1 NOT NULL,
    quantity_purchased INTEGER DEFAULT 0 NOT NULL,
    is_available BOOLEAN DEFAULT true NOT NULL,
    category VARCHAR(100) NOT NULL,
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create payments table
CREATE TABLE public.payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    gift_id UUID NOT NULL REFERENCES public.gifts(id) ON DELETE CASCADE,
    guest_id UUID REFERENCES public.guests(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('pix', 'credit_card', 'bank_transfer')),
    mercado_pago_payment_id VARCHAR(255),
    message TEXT, -- Message from gift giver
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create wedding_config table
CREATE TABLE public.wedding_config (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    wedding_date DATE NOT NULL,
    rsvp_deadline DATE NOT NULL,
    venue_name VARCHAR(255) NOT NULL,
    venue_address TEXT NOT NULL,
    ceremony_time TIME NOT NULL,
    reception_time TIME NOT NULL,
    dress_code VARCHAR(100),
    max_guests INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Insert initial wedding configuration for Hel & Ylana
INSERT INTO public.wedding_config (
    wedding_date,
    rsvp_deadline,
    venue_name,
    venue_address,
    ceremony_time,
    reception_time,
    dress_code,
    max_guests
) VALUES (
    '2025-11-11',
    '2025-11-01',
    'Local da Cerimônia',
    'Endereço do Local da Cerimônia, Cidade, Estado, CEP',
    '16:00',
    '18:00',
    'Traje Social',
    150
);

-- Create indexes for performance
CREATE INDEX idx_guests_email ON public.guests(email);
CREATE INDEX idx_guests_invitation_code ON public.guests(invitation_code);
CREATE INDEX idx_guests_attending ON public.guests(attending);
CREATE INDEX idx_guests_rsvp_date ON public.guests(rsvp_date);

CREATE INDEX idx_gifts_category ON public.gifts(category);
CREATE INDEX idx_gifts_is_available ON public.gifts(is_available);
CREATE INDEX idx_gifts_priority ON public.gifts(priority);
CREATE INDEX idx_gifts_price ON public.gifts(price);

CREATE INDEX idx_payments_gift_id ON public.payments(gift_id);
CREATE INDEX idx_payments_guest_id ON public.payments(guest_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_payment_method ON public.payments(payment_method);
CREATE INDEX idx_payments_mercado_pago_payment_id ON public.payments(mercado_pago_payment_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_guests_updated_at BEFORE UPDATE ON public.guests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gifts_updated_at BEFORE UPDATE ON public.gifts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wedding_config_updated_at BEFORE UPDATE ON public.wedding_config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add constraint to ensure rsvp_date is set when attending is not null
ALTER TABLE public.guests ADD CONSTRAINT check_rsvp_date_when_decided
    CHECK (
        (attending IS NULL) OR
        (attending IS NOT NULL AND rsvp_date IS NOT NULL)
    );

-- Add constraint to ensure plus_one_name is provided when plus_one is true
ALTER TABLE public.guests ADD CONSTRAINT check_plus_one_name
    CHECK (
        (plus_one = false OR plus_one IS NULL) OR
        (plus_one = true AND plus_one_name IS NOT NULL AND trim(plus_one_name) != '')
    );

-- Add constraint to ensure quantity_purchased doesn't exceed quantity_desired
ALTER TABLE public.gifts ADD CONSTRAINT check_quantity_purchased
    CHECK (quantity_purchased <= quantity_desired);

-- Add constraint to ensure payment amount is positive
ALTER TABLE public.payments ADD CONSTRAINT check_positive_amount
    CHECK (amount > 0);

-- Comments for documentation
COMMENT ON TABLE public.guests IS 'Convidados do casamento com informações de RSVP';
COMMENT ON TABLE public.gifts IS 'Lista de presentes do casamento com informações de compra';
COMMENT ON TABLE public.payments IS 'Pagamentos dos presentes via Mercado Pago (PIX, cartão, etc.)';
COMMENT ON TABLE public.wedding_config IS 'Configurações do casamento (data, local, horários, etc.)';

COMMENT ON COLUMN public.guests.invitation_code IS 'Código único de convite de 10 caracteres';
COMMENT ON COLUMN public.guests.phone IS 'Telefone brasileiro no formato +55 (11) 99999-9999';
COMMENT ON COLUMN public.gifts.price IS 'Preço em Real Brasileiro (BRL) com centavos';
COMMENT ON COLUMN public.payments.payment_method IS 'Método de pagamento: PIX, cartão de crédito ou transferência bancária';