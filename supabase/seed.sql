-- Mil Dias de Amor - Development Seed Data
-- Seed file for local development environment

-- Set timezone for Brazilian locale
SET timezone = 'America/Sao_Paulo';

-- Note: wedding_config table was removed in migration 030 (replaced by wedding_settings)
-- wedding_settings already has default data from migration 018

-- Seed additional sample guests for development using simple_guests table
-- Note: old 'guests' table was removed in migration 028
-- simple_guests has: name, email, phone, attending, plus_ones, invitation_code
INSERT INTO public.simple_guests (name, email, phone, attending, plus_ones, invitation_code) VALUES
('Ana Silva Dev', 'ana.silva.dev@example.com', '+55 (11) 99999-1111', true, 0, 'DEV001'),
('Carlos Oliveira Dev', 'carlos.oliveira.dev@example.com', '+55 (11) 99999-2222', true, 1, 'DEV002'),
('Beatriz Santos Dev', 'beatriz.santos.dev@example.com', '+55 (11) 99999-3333', false, 0, 'DEV003'),
('Diego Costa Dev', 'diego.costa.dev@example.com', '+55 (21) 99999-4444', null, 0, 'DEV004'),
('Elena Rodrigues Dev', 'elena.rodrigues.dev@example.com', '+55 (11) 99999-5555', true, 1, 'DEV005'),
('Fabio Lima Dev', 'fabio.lima.dev@example.com', '+55 (85) 99999-6666', null, 0, 'DEV006'),
('Gabriela Ferreira Dev', 'gabriela.ferreira.dev@example.com', '+55 (11) 99999-7777', true, 0, 'DEV007'),
('Hugo Barbosa Dev', 'hugo.barbosa.dev@example.com', '+55 (31) 99999-8888', null, 0, 'DEV008'),
('Isabela Martins Dev', 'isabela.martins.dev@example.com', '+55 (11) 99999-9999', true, 0, 'DEV009'),
('João Almeida Dev', 'joao.almeida.dev@example.com', '+55 (11) 99999-0000', null, 0, 'DEV010');

-- Seed gift categories
INSERT INTO public.gifts (name, description, price, category, image_url, is_available, priority) VALUES
-- Casa e Decoração
('Jogo de Panelas Tramontina', 'Conjunto completo de panelas antiaderentes', 459.00, 'casa_decoracao', '/images/gifts/panelas-tramontina.jpg', true, 'high'),
('Conjunto de Taças de Cristal', 'Taças para vinho e champagne', 289.00, 'casa_decoracao', '/images/gifts/tacas-cristal.jpg', true, 'medium'),
('Kit Jogo de Cama Casal', 'Lençóis 100% algodão percale 300 fios', 325.00, 'casa_decoracao', '/images/gifts/jogo-cama.jpg', true, 'medium'),
('Conjunto de Pratos de Porcelana', '12 peças para jantar elegante', 387.00, 'casa_decoracao', '/images/gifts/pratos-porcelana.jpg', true, 'high'),
('Luminária Pendente Moderna', 'Iluminação decorativa para sala de jantar', 423.00, 'casa_decoracao', '/images/gifts/luminaria-pendente.jpg', true, 'medium'),

-- Eletrodomésticos
('Cafeteira Espresso Nespresso', 'Máquina de café automática', 899.00, 'eletrodomesticos', '/images/gifts/cafeteira-nespresso.jpg', true, 'high'),
('Liquidificador Vitamix', 'Liquidificador profissional de alta potência', 1569.00, 'eletrodomesticos', '/images/gifts/liquidificador-vitamix.jpg', true, 'high'),
('Air Fryer Philco 7L', 'Fritadeira elétrica sem óleo', 349.00, 'eletrodomesticos', '/images/gifts/air-fryer.jpg', true, 'medium'),
('Micro-ondas Panasonic 32L', 'Forno micro-ondas com grill', 678.00, 'eletrodomesticos', '/images/gifts/microondas.jpg', true, 'medium'),
('Batedeira Planetária KitchenAid', 'Batedeira profissional stand mixer', 1899.00, 'eletrodomesticos', '/images/gifts/batedeira-kitchenaid.jpg', true, 'high'),

-- Eletrônicos
('Smart TV 55" Samsung 4K', 'Televisão inteligente QLED', 2899.00, 'eletronicos', '/images/gifts/smart-tv-samsung.jpg', true, 'high'),
('Echo Dot 5ª Geração', 'Assistente virtual Amazon Alexa', 349.00, 'eletronicos', '/images/gifts/echo-dot.jpg', true, 'low'),
('Soundbar JBL Cinema', 'Sistema de som para TV', 789.00, 'eletronicos', '/images/gifts/soundbar-jbl.jpg', true, 'medium'),
('Tablet iPad 10ª Geração', 'Tablet Apple 64GB WiFi', 2459.00, 'eletronicos', '/images/gifts/ipad.jpg', true, 'high'),

-- Experiências
('Jantar Romântico para Dois', 'Experiência gastronômica em restaurante premiado', 450.00, 'experiencias', '/images/gifts/jantar-romantico.jpg', true, 'medium'),
('Weekend em Campos do Jordão', 'Fim de semana romântico na serra', 1250.00, 'experiencias', '/images/gifts/campos-jordao.jpg', true, 'high'),
('Aula de Culinária Italiana', 'Curso de gastronomia para casais', 280.00, 'experiencias', '/images/gifts/aula-culinaria.jpg', true, 'low'),
('Spa Day para Casal', 'Dia de relaxamento e bem-estar', 680.00, 'experiencias', '/images/gifts/spa-day.jpg', true, 'medium'),
('Sessão de Fotos Profissional', 'Ensaio fotográfico pós-casamento', 850.00, 'experiencias', '/images/gifts/sessao-fotos.jpg', true, 'medium'),

-- PIX
('Contribuição Livre PIX', 'Valor livre para presente dos noivos', 50.00, 'pix', '/images/gifts/pix-livre.jpg', true, 'low'),
('PIX R$ 100', 'Contribuição de R$ 100 via PIX', 100.00, 'pix', '/images/gifts/pix-100.jpg', true, 'low'),
('PIX R$ 250', 'Contribuição de R$ 250 via PIX', 250.00, 'pix', '/images/gifts/pix-250.jpg', true, 'low'),
('PIX R$ 500', 'Contribuição de R$ 500 via PIX', 500.00, 'pix', '/images/gifts/pix-500.jpg', true, 'medium');

-- Seed some sample payments for development (using our new gifts and simple_guests)
INSERT INTO public.payments (gift_id, guest_id, amount, status, mercado_pago_payment_id, payment_method, message)
SELECT
    g.id,
    guest.id,
    g.price,
    'completed',
    'MP-DEV-' || abs(random()::int),
    'pix',
    'Presente de desenvolvimento - ' || guest.name
FROM public.gifts g
CROSS JOIN (SELECT id, name FROM public.simple_guests WHERE email LIKE '%dev@example.com' AND attending = true LIMIT 3) guest
WHERE g.name IN ('Echo Dot 5ª Geração', 'PIX R$ 100', 'Jogo de Panelas Tramontina')
LIMIT 3;