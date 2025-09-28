-- Mil Dias de Amor - Sample Data
-- Migration 003: Sample data for Brazilian wedding website testing

-- Insert sample gifts for the wedding registry
INSERT INTO public.gifts (name, description, price, category, priority, quantity_desired, registry_url) VALUES
-- Cozinha
('Jogo de Panelas Tramontina', 'Conjunto completo de panelas antiaderentes com 5 peças', 299.90, 'Cozinha', 'high', 1, 'https://www.tramontina.com.br'),
('Liquidificador Philips Walita', 'Liquidificador de alta potência 1000W com 5 velocidades', 189.90, 'Cozinha', 'medium', 1, 'https://www.philips.com.br'),
('Cafeteira Nespresso', 'Máquina de café expresso automática com sistema de cápsulas', 599.00, 'Cozinha', 'high', 1, 'https://www.nespresso.com/br'),
('Jogo de Pratos Porcelana', 'Conjunto de pratos de porcelana para 12 pessoas - 36 peças', 450.00, 'Cozinha', 'medium', 1, 'https://www.oxford.com.br'),
('Tábua de Corte Bamboo', 'Tábua de corte ecológica em bamboo com compartimentos', 89.90, 'Cozinha', 'low', 2, NULL),
('Conjunto de Facas', 'Kit profissional com 6 facas e suporte magnético', 199.90, 'Cozinha', 'medium', 1, NULL),

-- Casa
('Aspirador de Pó Electrolux', 'Aspirador vertical sem fio com bateria de longa duração', 399.90, 'Casa', 'high', 1, 'https://www.electrolux.com.br'),
('Jogo de Cama Casal King', 'Jogo de lençol 100% algodão percal 200 fios', 299.90, 'Casa', 'medium', 2, 'https://www.trussardi.com.br'),
('Toalhas de Banho Felpuda', 'Conjunto 4 toalhas felpudas premium 100% algodão', 189.90, 'Casa', 'medium', 2, NULL),
('Ferro de Passar Philips', 'Ferro a vapor com base cerâmica e sistema anti-gotejo', 149.90, 'Casa', 'low', 1, 'https://www.philips.com.br'),
('Espelho Decorativo', 'Espelho redondo com moldura dourada 80cm diâmetro', 259.90, 'Casa', 'low', 1, NULL),

-- Eletrônicos
('Smart TV 55" Samsung', 'Smart TV 4K UHD 55 polegadas com Tizen OS', 2299.00, 'Eletrônicos', 'high', 1, 'https://www.samsung.com/br'),
('Soundbar JBL', 'Sistema de som 2.1 canais com subwoofer wireless', 899.90, 'Eletrônicos', 'medium', 1, 'https://br.jbl.com'),
('Micro-ondas Panasonic', 'Forno micro-ondas 32 litros com grill e painel digital', 699.90, 'Eletrônicos', 'medium', 1, 'https://www.panasonic.com/br'),
('Alexa Echo Dot', 'Assistente virtual inteligente com controle de casa', 299.90, 'Eletrônicos', 'low', 2, 'https://www.amazon.com.br'),

-- Experiências
('Jantar Romântico para Dois', 'Vale para jantar especial em restaurante premium', 500.00, 'Experiências', 'high', 1, NULL),
('Spa Day Casal', 'Dia de relaxamento completo para o casal em spa de luxo', 800.00, 'Experiências', 'high', 1, NULL),
('Viagem de Fim de Semana', 'Contribuição para viagem romântica de fim de semana', 1000.00, 'Experiências', 'high', 5, NULL),
('Aula de Dança', 'Pacote de 8 aulas de dança de salão para iniciantes', 320.00, 'Experiências', 'medium', 1, NULL),

-- Decoração
('Quadro Personalizado', 'Quadro canvas personalizado com foto do casal', 159.90, 'Decoração', 'medium', 1, NULL),
('Vaso Decorativo Cerâmica', 'Vaso grande de cerâmica artesanal para plantas', 129.90, 'Decoração', 'low', 3, NULL),
('Luminárias LED Ambientes', 'Kit 3 luminárias LED com controle remoto', 249.90, 'Decoração', 'low', 1, NULL),
('Cortina Blackout Sala', 'Cortina blackout térmica para sala 3,00m x 2,50m', 199.90, 'Decoração', 'medium', 2, NULL);

-- Insert sample guests for testing
INSERT INTO public.guests (name, email, phone, attending, plus_one, plus_one_name, invitation_code, rsvp_date) VALUES
('Maria Silva Santos', 'maria.silva@email.com', '+55 (11) 99999-1234', true, true, 'João Santos Silva', 'HY2025A1', '2025-09-15T10:30:00Z'),
('Carlos Eduardo Lima', 'carlos.lima@email.com', '+55 (21) 98888-5678', true, false, NULL, 'HY2025A2', '2025-09-16T14:20:00Z'),
('Ana Paula Costa', 'ana.costa@email.com', '+55 (11) 97777-9012', false, false, NULL, 'HY2025A3', '2025-09-17T09:15:00Z'),
('Roberto Almeida', 'roberto.almeida@email.com', '+55 (31) 96666-3456', true, true, 'Fernanda Almeida', 'HY2025A4', '2025-09-18T16:45:00Z'),
('Juliana Ferreira', 'juliana.ferreira@email.com', '+55 (85) 95555-7890', NULL, NULL, NULL, 'HY2025A5', NULL),
('Pedro Henrique Souza', 'pedro.souza@email.com', '+55 (11) 94444-2345', true, false, NULL, 'HY2025A6', '2025-09-20T11:30:00Z'),
('Camila Rodrigues', 'camila.rodrigues@email.com', '+55 (47) 93333-6789', NULL, NULL, NULL, 'HY2025A7', NULL),
('Lucas Pereira', 'lucas.pereira@email.com', '+55 (62) 92222-0123', true, true, 'Beatriz Pereira', 'HY2025A8', '2025-09-22T13:10:00Z'),
('Rafaela Martins', 'rafaela.martins@email.com', '+55 (11) 91111-4567', true, false, NULL, 'HY2025A9', '2025-09-23T15:25:00Z'),
('Thiago Oliveira', 'thiago.oliveira@email.com', '+55 (19) 90000-8901', false, false, NULL, 'HY2025B1', '2025-09-24T08:40:00Z');

-- Insert sample payments for testing
INSERT INTO public.payments (gift_id, guest_id, amount, status, payment_method, message) VALUES
-- Completed payments
((SELECT id FROM public.gifts WHERE name = 'Cafeteira Nespresso'),
 (SELECT id FROM public.guests WHERE email = 'maria.silva@email.com'),
 599.00, 'completed', 'pix', 'Parabéns aos noivos! Com muito carinho, Maria e João'),

((SELECT id FROM public.gifts WHERE name = 'Smart TV 55" Samsung'),
 (SELECT id FROM public.guests WHERE email = 'carlos.lima@email.com'),
 2299.00, 'completed', 'credit_card', 'Felicidades para o casal! Que sejam muito felizes!'),

((SELECT id FROM public.gifts WHERE name = 'Jogo de Panelas Tramontina'),
 (SELECT id FROM public.guests WHERE email = 'roberto.almeida@email.com'),
 299.90, 'completed', 'pix', 'Desejamos muito amor e felicidade! Roberto e Fernanda'),

-- Pending payments
((SELECT id FROM public.gifts WHERE name = 'Aspirador de Pó Electrolux'),
 (SELECT id FROM public.guests WHERE email = 'pedro.souza@email.com'),
 399.90, 'pending', 'pix', 'Aguardando confirmação do PIX'),

((SELECT id FROM public.gifts WHERE name = 'Spa Day Casal'),
 (SELECT id FROM public.guests WHERE email = 'lucas.pereira@email.com'),
 800.00, 'pending', 'credit_card', 'Um presente especial para vocês!');

-- Update gift quantities based on completed payments
UPDATE public.gifts SET quantity_purchased = 1
WHERE name IN ('Cafeteira Nespresso', 'Smart TV 55" Samsung', 'Jogo de Panelas Tramontina');

-- Insert comprehensive wedding configuration
UPDATE public.wedding_config SET
    venue_name = 'Espaço Villa Bisutti',
    venue_address = 'Rua Funchal, 65 - Vila Olímpia, São Paulo - SP, 04551-060',
    ceremony_time = '16:00',
    reception_time = '18:00',
    dress_code = 'Traje Social (evitar branco)',
    max_guests = 120
WHERE id = (SELECT id FROM public.wedding_config LIMIT 1);

-- Create sample invitation codes for testing
-- These codes can be used to test the RSVP lookup functionality
INSERT INTO public.guests (name, email, invitation_code, attending) VALUES
('Convidado Teste 1', 'teste1@example.com', 'TEST001A', NULL),
('Convidado Teste 2', 'teste2@example.com', 'TEST002B', NULL),
('Convidado Teste 3', 'teste3@example.com', 'TEST003C', NULL);

-- Add some dietary restrictions examples
UPDATE public.guests SET dietary_restrictions = 'Vegetariano' WHERE email = 'ana.costa@email.com';
UPDATE public.guests SET dietary_restrictions = 'Intolerância à lactose' WHERE email = 'juliana.ferreira@email.com';
UPDATE public.guests SET dietary_restrictions = 'Celíaco (sem glúten)' WHERE email = 'camila.rodrigues@email.com';

-- Add some special requests examples
UPDATE public.guests SET special_requests = 'Preciso de cadeira especial para idoso' WHERE email = 'maria.silva@email.com';
UPDATE public.guests SET special_requests = 'Gostaria de sentar próximo à família da noiva' WHERE email = 'carlos.lima@email.com';

-- Create some additional experience gifts
INSERT INTO public.gifts (name, description, price, category, priority, quantity_desired) VALUES
('Contribuição Lua de Mel', 'Ajuda para a viagem dos sonhos dos noivos', 200.00, 'Experiências', 'high', 10),
('Sessão de Fotos Profissional', 'Ensaio fotográfico profissional pós-casamento', 800.00, 'Experiências', 'medium', 1),
('Curso de Culinária', 'Aulas de culinária italiana para o casal', 450.00, 'Experiências', 'medium', 1);

-- Comments for sample data
COMMENT ON TABLE public.gifts IS 'Lista de presentes contém itens típicos de casamento brasileiro com preços em BRL';
COMMENT ON TABLE public.guests IS 'Dados de exemplo incluem formatos de telefone brasileiros e nomes brasileiros';
COMMENT ON TABLE public.payments IS 'Pagamentos de exemplo mostram diferentes métodos (PIX, cartão) populares no Brasil';