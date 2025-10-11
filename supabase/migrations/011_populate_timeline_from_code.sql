-- Populate Timeline Events from realTimeline.ts data
-- This migration imports the existing timeline data from the code into the database

-- Insert all 15 timeline events from realTimeline.ts
INSERT INTO public.timeline_events (date, title, description, location, media_type, media_url, thumbnail_url, milestone_type, order_index, display_order, is_visible)
VALUES
  -- Event 1: Do Tinder ao WhatsApp
  ('2023-01-06', 'Do Tinder ao WhatsApp',
   'Primeiro ''oi'' que mudou tudo. Quem diria que um match se tornaria a mais linda história de amor? O início de mil dias mágicos.',
   'WhatsApp', 'photo', '/images/timeline/primeiro-oi.jpg', '/images/timeline/thumbs/primeiro-oi.jpg',
   'first_date', 1, 1, true),

  -- Event 2: Casa Fontana & Avatar VIP
  ('2023-01-14', 'Casa Fontana & Avatar VIP',
   'Jantar no Casa Fontana seguido de Avatar: O Caminho da Água nas poltronas VIP F11/F12. A química foi instantânea - conversamos, rimos e já sabíamos que isso era especial.',
   'Casa Fontana, Fortaleza', 'photo', '/images/timeline/primeiro-encontro.jpg', '/images/timeline/thumbs/primeiro-encontro.jpg',
   'first_date', 2, 2, true),

  -- Event 3: O Gesto que Mudou Tudo
  ('2023-02-15', 'O Gesto que Mudou Tudo',
   'Ylana levando remédio e chá quando Hel ficou doente. Na hora eu já sabia: ''é ela''. Às vezes o amor se revela nos cuidados mais simples e sinceros.',
   'Casa do Hel', 'photo', '/images/timeline/gesto-carinho.jpg', '/images/timeline/thumbs/gesto-carinho.jpg',
   'other', 3, 3, true),

  -- Event 4: Guaramiranga Espontâneo
  ('2023-02-25', 'Guaramiranga Espontâneo',
   'Planejei jantar especial, mas não consegui esperar! Pedi para namorar na manhã, em meio às montanhas. O coração não sabe de planos - só de amor.',
   'Guaramiranga, Ceará', 'photo', '/images/timeline/guaramiranga.jpg', '/images/timeline/thumbs/guaramiranga.jpg',
   'anniversary', 4, 4, true),

  -- Event 5: Cacao Se Junta à Linda
  ('2023-03-01', 'Cacao Se Junta à Linda',
   'Nossa família peluda cresceu! Cacao chegou para fazer companhia à Linda. Dois pets, dois corações humanos - nossa casa ficou ainda mais cheia de amor.',
   'Nossa Casa', 'photo', '/images/timeline/cacao.jpg', '/images/timeline/thumbs/cacao.jpg',
   'family', 5, 5, true),

  -- Event 6: Primeiro Réveillon Juntos
  ('2023-12-31', 'Primeiro Réveillon Juntos',
   'Nosso primeiro réveillon morando juntos! Brindando 2024 em casa, com Linda e Cacao aos nossos pés. Alguns momentos merecem intimidade.',
   'Nossa Casa', 'photo', '/images/timeline/reveillon.jpg', '/images/timeline/thumbs/reveillon.jpg',
   'anniversary', 6, 6, true),

  -- Event 7: 1º Aniversário Surpresa
  ('2024-02-25', '1º Aniversário Surpresa',
   'Balões, rosas vermelhas, café da manhã na cama e presentes caros. Celebrando um ano daquele pedido espontâneo que mudou nossas vidas para sempre.',
   'Nossa Casa', 'photo', '/images/timeline/aniversario1.jpg', '/images/timeline/thumbs/aniversario1.jpg',
   'anniversary', 7, 7, true),

  -- Event 8: Linda Nos Deu Olivia e Oliver
  ('2024-03-10', 'Linda Nos Deu Olivia e Oliver',
   'A matriarca Linda trouxe 4 filhotes! Olivia e Oliver ficaram conosco. De 2 pets para 4 - nossa família peluda estava completa e nossos corações transbordando.',
   'Nossa Casa', 'photo', '/images/timeline/filhotes.jpg', '/images/timeline/thumbs/filhotes.jpg',
   'family', 8, 8, true),

  -- Event 9: O Apartamento dos Sonhos
  ('2024-03-15', 'O Apartamento dos Sonhos',
   'Mudança para o apartamento que Hel passava de bicicleta na faculdade sonhando em morar. Anos de trabalho duro para realizar o sonho de uma casa própria para nossa família de 6.',
   'Nosso Apartamento dos Sonhos', 'photo', '/images/timeline/apartamento.jpg', '/images/timeline/thumbs/apartamento.jpg',
   'other', 9, 9, true),

  -- Event 10: Mangue Azul & Rio de Janeiro
  ('2024-10-25', 'Mangue Azul & Rio de Janeiro',
   '2º aniversário no nosso restaurante favorito Mangue Azul, seguido de viagem dos sonhos: Rio de Janeiro e Búzios em hotel 5 estrelas. Se o Mangue não tivesse fechado, o casamento seria lá.',
   'Mangue Azul, Fortaleza / Rio & Búzios', 'photo', '/images/timeline/aniversario2.jpg', '/images/timeline/thumbs/aniversario2.jpg',
   'anniversary', 10, 10, true),

  -- Event 11: Natal em Casa Própria
  ('2024-12-25', 'Natal em Casa Própria',
   'Primeiro Natal recebendo a família em NOSSA casa. Não mais em apartamento alugado - era nosso lar, nosso espaço, nossas memórias sendo construídas.',
   'Nossa Casa Própria', 'photo', '/images/timeline/natal.jpg', '/images/timeline/thumbs/natal.jpg',
   'other', 11, 11, true),

  -- Event 12: Segundo Réveillon em Casa PRÓPRIA
  ('2024-12-31', 'Segundo Réveillon em Casa PRÓPRIA',
   'Brindando 2025 em casa própria (não alugada!), com nossos 4 pets, planejando nosso futuro. Que diferença faz celebrar no que é verdadeiramente nosso.',
   'Nossa Casa Própria', 'photo', '/images/timeline/reveillon2.jpg', '/images/timeline/thumbs/reveillon2.jpg',
   'other', 12, 12, true),

  -- Event 13: Pensando no Futuro Juntos
  ('2025-04-15', 'Pensando no Futuro Juntos',
   'Ylana congelou óvulos aos 34 anos - cuidando do nosso futuro, planejando nossa família. Algumas decisões são sobre amor que ainda está por vir.',
   'Fortaleza', 'photo', '/images/timeline/futuro.jpg', '/images/timeline/thumbs/futuro.jpg',
   'family', 13, 13, true),

  -- Event 14: O Pedido Perfeito
  ('2025-08-30', 'O Pedido Perfeito',
   'Icaraí de Amontada: "Vamos jantar no restaurante do hotel" virou surpresa na suíte com câmeras ligadas. Ajoelhado, anel na mão, coração transbordando. O ''SIM'' mais lindo do mundo.',
   'Icaraí de Amontada, Ceará', 'photo', '/images/timeline/pedido.jpg', '/images/timeline/thumbs/pedido.jpg',
   'engagement', 14, 14, true),

  -- Event 15: Mil Dias Viram Para Sempre
  ('2025-11-20', 'Mil Dias Viram Para Sempre',
   'Casa HY, 10h30. Exatamente 1000 dias após aquele primeiro ''oi'' no WhatsApp. Caseiros e introvertidos, mas hoje celebramos nosso amor com quem mais amamos. O dia em que mil dias se tornam toda uma vida.',
   'Casa HY, Fortaleza', 'photo', '/images/timeline/casamento.jpg', '/images/timeline/thumbs/casamento.jpg',
   'other', 15, 15, true)
ON CONFLICT DO NOTHING;