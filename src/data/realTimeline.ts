import { TimelineEvent } from '@/types/wedding'

export const realTimelineEvents: TimelineEvent[] = [
  {
    id: 'primeiro-oi',
    date: '2023-01-06',
    title: "Do Tinder ao WhatsApp",
    description: "Primeiro 'oi' que mudou tudo. Quem diria que um match se tornaria a mais linda história de amor? O início de mil dias mágicos.",
    media_type: 'photo',
    media_url: '/images/timeline/primeiro-oi.jpg',
    thumbnail_url: '/images/timeline/primeiro-oi.jpg',
    location: 'WhatsApp',
    milestone_type: 'first_date',
    is_major_milestone: true,
    order_index: 1,
    created_at: '2025-09-29T00:00:00Z'
  },
  {
    id: 'primeiro-encontro',
    date: '2023-01-14',
    title: "Casa Fontana & Avatar VIP",
    description: "Jantar no Casa Fontana seguido de Avatar: O Caminho da Água nas poltronas VIP F11/F12. A química foi instantânea - conversamos, rimos e já sabíamos que isso era especial.",
    media_type: 'photo',
    media_url: '/images/timeline/primeiro-encontro.jpg',
    thumbnail_url: '/images/timeline/primeiro-encontro.jpg',
    location: 'Casa Fontana, Fortaleza',
    milestone_type: 'first_date',
    is_major_milestone: true,
    order_index: 2,
    created_at: '2025-09-29T00:00:00Z',
    media: [
      {
        media_type: 'image',
        media_url: '/images/timeline/primeiro-encontro.jpg',
        caption: 'Jantar no Casa Fontana',
        display_order: 0,
        is_primary: true
      },
      {
        media_type: 'image',
        media_url: '/images/timeline/primeiro-encontro.jpg',
        caption: 'Avatar nas poltronas VIP F11/F12',
        display_order: 1,
        is_primary: false
      }
    ]
  },
  {
    id: 'o-gesto-decisivo',
    date: '2023-02-15',
    title: "O Gesto que Mudou Tudo",
    description: "Ylana levando remédio e chá quando Hel ficou doente. Na hora eu já sabia: 'é ela'. Às vezes o amor se revela nos cuidados mais simples e sinceros.",
    media_type: 'photo',
    media_url: '/images/timeline/o-gesto-decisivo.jpg',
    thumbnail_url: '/images/timeline/o-gesto-decisivo.jpg',
    location: 'Casa do Hel',
    milestone_type: 'special',
    is_major_milestone: true,
    order_index: 3,
    created_at: '2025-09-29T00:00:00Z'
  },
  {
    id: 'guaramiranga-pedido',
    date: '2023-02-25',
    title: "Guaramiranga Espontâneo",
    description: "Planejei jantar especial, mas não consegui esperar! Pedi para namorar na manhã, em meio às montanhas. O coração não sabe de planos - só de amor.",
    media_type: 'photo',
    media_url: '/images/timeline/guaramiranga-pedido.jpg',
    thumbnail_url: '/images/timeline/guaramiranga-pedido.jpg',
    location: 'Guaramiranga, Ceará',
    milestone_type: 'anniversary',
    is_major_milestone: true,
    order_index: 4,
    created_at: '2025-09-29T00:00:00Z'
  },
  {
    id: 'chegada-cacao',
    date: '2023-03-01',
    title: "Cacao Se Junta à Linda",
    description: "Nossa família peluda cresceu! Cacao chegou para fazer companhia à Linda. Dois pets, dois corações humanos - nossa casa ficou ainda mais cheia de amor.",
    media_type: 'photo',
    media_url: '/images/timeline/chegada-cacao.jpg',
    thumbnail_url: '/images/timeline/chegada-cacao.jpg',
    location: 'Nossa Casa',
    milestone_type: 'family',
    is_major_milestone: false,
    order_index: 5,
    created_at: '2025-09-29T00:00:00Z'
  },
  {
    id: 'reveillon-juntos',
    date: '2023-12-31',
    title: "Primeiro Réveillon Juntos",
    description: "Nosso primeiro réveillon morando juntos! Brindando 2024 em casa, com Linda e Cacao aos nossos pés. Alguns momentos merecem intimidade.",
    media_type: 'photo',
    media_url: '/images/timeline/reveillon-juntos.jpg',
    thumbnail_url: '/images/timeline/reveillon-juntos.jpg',
    location: 'Nossa Casa',
    milestone_type: 'special',
    is_major_milestone: false,
    order_index: 6,
    created_at: '2025-09-29T00:00:00Z'
  },
  {
    id: 'primeiro-aniversario',
    date: '2024-02-25',
    title: "1º Aniversário Surpresa",
    description: "Balões, rosas vermelhas, café da manhã na cama e presentes caros. Celebrando um ano daquele pedido espontâneo que mudou nossas vidas para sempre.",
    media_type: 'photo',
    media_url: '/images/timeline/primeiro-aniversario.jpg',
    thumbnail_url: '/images/timeline/primeiro-aniversario.jpg',
    location: 'Nossa Casa',
    milestone_type: 'anniversary',
    is_major_milestone: true,
    order_index: 7,
    created_at: '2025-09-29T00:00:00Z'
  },
  {
    id: 'linda-filhotes',
    date: '2024-03-10',
    title: "Linda Nos Deu Olivia e Oliver",
    description: "A matriarca Linda trouxe 4 filhotes! Olivia e Oliver ficaram conosco. De 2 pets para 4 - nossa família peluda estava completa e nossos corações transbordando.",
    media_type: 'photo',
    media_url: '/images/timeline/linda-filhotes.jpg',
    thumbnail_url: '/images/timeline/linda-filhotes.jpg',
    location: 'Nossa Casa',
    milestone_type: 'family',
    is_major_milestone: true,
    order_index: 8,
    created_at: '2025-09-29T00:00:00Z'
  },
  {
    id: 'apartamento-proprio',
    date: '2024-03-15',
    title: "O Apartamento dos Sonhos",
    description: "Mudança para o apartamento que Hel passava de bicicleta na faculdade sonhando em morar. Anos de trabalho duro para realizar o sonho de uma casa própria para nossa família de 6.",
    media_type: 'photo',
    media_url: '/images/timeline/apartamento-proprio.jpg',
    thumbnail_url: '/images/timeline/apartamento-proprio.jpg',
    location: 'Nosso Apartamento dos Sonhos',
    milestone_type: 'achievement',
    is_major_milestone: true,
    order_index: 9,
    created_at: '2025-09-29T00:00:00Z'
  },
  {
    id: 'segundo-aniversario',
    date: '2024-10-25',
    title: "Mangue Azul & Rio de Janeiro",
    description: "2º aniversário no nosso restaurante favorito Mangue Azul, seguido de viagem dos sonhos: Rio de Janeiro e Búzios em hotel 5 estrelas. Se o Mangue não tivesse fechado, o casamento seria lá.",
    media_type: 'photo',
    media_url: '/images/timeline/segundo-aniversario.jpg',
    thumbnail_url: '/images/timeline/segundo-aniversario.jpg',
    location: 'Mangue Azul, Fortaleza / Rio & Búzios',
    milestone_type: 'anniversary',
    is_major_milestone: true,
    order_index: 10,
    created_at: '2025-09-29T00:00:00Z'
  },
  {
    id: 'primeiro-natal',
    date: '2024-12-25',
    title: "Natal em Casa Própria",
    description: "Primeiro Natal recebendo a família em NOSSA casa. Não mais em apartamento alugado - era nosso lar, nosso espaço, nossas memórias sendo construídas.",
    media_type: 'photo',
    media_url: '/images/timeline/primeiro-natal.jpg',
    thumbnail_url: '/images/timeline/primeiro-natal.jpg',
    location: 'Nossa Casa Própria',
    milestone_type: 'family',
    is_major_milestone: false,
    order_index: 11,
    created_at: '2025-09-29T00:00:00Z'
  },
  {
    id: 'segundo-reveillon',
    date: '2024-12-31',
    title: "Segundo Réveillon em Casa PRÓPRIA",
    description: "Brindando 2025 em casa própria (não alugada!), com nossos 4 pets, planejando nosso futuro. Que diferença faz celebrar no que é verdadeiramente nosso.",
    media_type: 'photo',
    media_url: '/images/timeline/segundo-reveillon.jpg',
    thumbnail_url: '/images/timeline/segundo-reveillon.jpg',
    location: 'Nossa Casa Própria',
    milestone_type: 'special',
    is_major_milestone: false,
    order_index: 12,
    created_at: '2025-09-29T00:00:00Z'
  },
  {
    id: 'ovulos-congelados',
    date: '2025-04-15',
    title: "Pensando no Futuro Juntos",
    description: "Ylana congelou óvulos aos 34 anos - cuidando do nosso futuro, planejando nossa família. Algumas decisões são sobre amor que ainda está por vir.",
    media_type: 'photo',
    media_url: '/images/timeline/ovulos-congelados.jpg',
    thumbnail_url: '/images/timeline/ovulos-congelados.jpg',
    location: 'Fortaleza',
    milestone_type: 'family',
    is_major_milestone: false,
    order_index: 13,
    created_at: '2025-09-29T00:00:00Z'
  },
  {
    id: 'pedido-casamento',
    date: '2025-08-30',
    title: "O Pedido Perfeito",
    description: "Icaraí de Amontada: \"Vamos jantar no restaurante do hotel\" virou surpresa na suíte com câmeras ligadas. Ajoelhado, anel na mão, coração transbordando. O 'SIM' mais lindo do mundo.",
    media_type: 'photo',
    media_url: '/images/timeline/pedido-casamento.jpg',
    thumbnail_url: '/images/timeline/pedido-casamento.jpg',
    location: 'Icaraí de Amontada, Ceará',
    milestone_type: 'engagement',
    is_major_milestone: true,
    order_index: 14,
    created_at: '2025-09-29T00:00:00Z'
  },
  {
    id: 'mil-dias',
    date: '2025-11-20',
    title: "Mil Dias Viram Para Sempre",
    description: "Casa HY, 10h30. Exatamente 1000 dias após aquele primeiro 'oi' no WhatsApp. Caseiros e introvertidos, mas hoje celebramos nosso amor com quem mais amamos. O dia em que mil dias se tornam toda uma vida.",
    media_type: 'photo',
    media_url: '/images/timeline/mil-dias.jpg',
    thumbnail_url: '/images/timeline/mil-dias.jpg',
    location: 'Casa HY, Fortaleza',
    milestone_type: 'special',
    is_major_milestone: true,
    order_index: 15,
    created_at: '2025-09-29T00:00:00Z'
  }
]

// Função para calcular o dia do relacionamento baseado na data inicial
export function getDayOfRelationship(date: string): number {
  const startDate = new Date('2023-01-06') // Data do primeiro "oi" - 6 de janeiro de 2023
  const eventDate = new Date(date)
  const diffTime = Math.abs(eventDate.getTime() - startDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// Função para obter eventos por categoria
export function getEventsByMilestone(type: TimelineEvent['milestone_type']): TimelineEvent[] {
  return realTimelineEvents.filter(event => event.milestone_type === type)
}

// Função para obter apenas marcos importantes
export function getMajorMilestones(): TimelineEvent[] {
  return realTimelineEvents.filter(event => event.is_major_milestone)
}

// Função para obter marcos emocionais por intensidade
export function getEmotionalMilestones(): TimelineEvent[] {
  // Marcos ordenados por impacto emocional crescente para criar journey map perfeito
  const emotionalOrder = [
    'primeiro-oi', 'primeiro-encontro', 'o-gesto-decisivo', 'guaramiranga-pedido',
    'apartamento-proprio', 'linda-filhotes', 'segundo-aniversario',
    'pedido-casamento', 'mil-dias'
  ]
  return emotionalOrder.map(id => realTimelineEvents.find(event => event.id === id)!).filter(Boolean)
}

// Função para obter timeline resumida para preview - momentos que criam mais conexão emocional
export function getTimelinePreview(): TimelineEvent[] {
  // Selecionados pela capacidade de gerar "aha moments" e conexão emocional
  return realTimelineEvents.filter(event =>
    ['primeiro-oi', 'o-gesto-decisivo', 'apartamento-proprio', 'mil-dias'].includes(event.id)
  )
}

// Função para obter marcos definidores - momentos que visitantes vão se identificar
export function getDefiningMoments(): TimelineEvent[] {
  return realTimelineEvents.filter(event =>
    ['o-gesto-decisivo', 'apartamento-proprio', 'linda-filhotes', 'pedido-casamento'].includes(event.id)
  )
}