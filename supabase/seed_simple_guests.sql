-- Simple test guests - separate inserts to handle NULLs properly
INSERT INTO public.simple_guests (name, phone, email, attending, plus_ones, confirmed_by)
VALUES ('Maria Silva', '+5585999999999', 'maria@email.com', true, 2, 'self');

INSERT INTO public.simple_guests (name, phone, email, attending, plus_ones, confirmed_by)
VALUES ('João Santos', '+5585988888888', 'joao@email.com', false, 0, 'self');

INSERT INTO public.simple_guests (name, phone, email)
VALUES ('Ana Costa', '+5585977777777', 'ana@email.com');

INSERT INTO public.simple_guests (name, phone, email)
VALUES ('Pedro Oliveira', '+5585966666666', 'pedro@email.com');

INSERT INTO public.simple_guests (name, phone, email, attending, plus_ones, confirmed_by)
VALUES ('Carla Souza', '+5585955555555', 'carla@email.com', true, 1, 'self');

INSERT INTO public.simple_guests (name, attending, plus_ones, confirmed_by)
VALUES ('Dona Rosa (Avó)', true, 1, 'admin');

INSERT INTO public.simple_guests (name, attending, plus_ones, confirmed_by)
VALUES ('Seu José (Avô)', true, 0, 'admin');