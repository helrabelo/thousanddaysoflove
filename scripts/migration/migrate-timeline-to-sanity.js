/**
 * Timeline Migration Script - Supabase to Sanity
 *
 * Transforms Supabase timeline_events data into Sanity timelinePage format.
 * Run: node scripts/migration/migrate-timeline-to-sanity.js
 */

// Supabase data (from timeline_events table)
const supabaseTimelineEvents = [
  {"idx":0,"id":"048fe3fb-eb31-4f3d-b651-775d546015da","date":"2024-12-25","title":"Natal em Casa Própria","description":"Primeiro Natal recebendo a família em NOSSA casa. Não mais em apartamento alugado - era nosso lar, nosso espaço, nossas memórias sendo construídas.","media_type":"photo","media_url":"/images/timeline/natal.jpg","thumbnail_url":"/images/timeline/thumbs/natal.jpg","location":"Nossa Casa Própria","milestone_type":"other","is_major_milestone":false,"order_index":11,"created_at":"2025-09-29 21:41:34.306297+00","display_order":11,"image_url":null,"is_visible":true},
  {"idx":1,"id":"1c15334f-ea56-4449-9042-6e76666e28c3","date":"2025-11-20","title":"Mil Dias Viram Para Sempre","description":"Constable Galerie, 10h30. Exatamente 1000 dias após aquele primeiro 'oi' no WhatsApp. Caseiros e introvertidos, mas hoje celebramos nosso amor com quem mais amamos. O dia em que mil dias se tornam toda uma vida.","media_type":"photo","media_url":"/images/timeline/casamento.jpg","thumbnail_url":"/images/timeline/thumbs/casamento.jpg","location":"Constable Galerie, Fortaleza","milestone_type":"other","is_major_milestone":false,"order_index":15,"created_at":"2025-09-29 21:41:34.306297+00","display_order":15,"image_url":null,"is_visible":true},
  {"idx":2,"id":"23df88cb-d0f6-4d0f-97b4-234129d92bfe","date":"2024-03-10","title":"Linda Nos Deu Olivia e Oliver","description":"A matriarca Linda trouxe 4 filhotes! Olivia e Oliver ficaram conosco. De 2 pets para 4 - nossa família peluda estava completa e nossos corações transbordando.","media_type":"photo","media_url":"/images/timeline/filhotes.jpg","thumbnail_url":"/images/timeline/thumbs/filhotes.jpg","location":"Nossa Casa","milestone_type":"family","is_major_milestone":false,"order_index":8,"created_at":"2025-09-29 21:41:34.306297+00","display_order":8,"image_url":null,"is_visible":true},
  {"idx":3,"id":"2a2f8a52-2dfe-4c11-9d9a-c56226b578ff","date":"2024-12-31","title":"Segundo Réveillon em Casa PRÓPRIA","description":"Brindando 2025 em casa própria (não alugada!), com nossos 4 pets, planejando nosso futuro. Que diferença faz celebrar no que é verdadeiramente nosso.","media_type":"photo","media_url":"/images/timeline/reveillon2.jpg","thumbnail_url":"/images/timeline/thumbs/reveillon2.jpg","location":"Nossa Casa Própria","milestone_type":"other","is_major_milestone":false,"order_index":12,"created_at":"2025-09-29 21:41:34.306297+00","display_order":12,"image_url":null,"is_visible":true},
  {"idx":4,"id":"5d9b65bf-0302-4c4d-a36d-9a8f484f6175","date":"2024-02-25","title":"1º Aniversário Surpresa","description":"Balões, rosas vermelhas, café da manhã na cama e presentes caros. Celebrando um ano daquele pedido espontâneo que mudou nossas vidas para sempre.","media_type":"photo","media_url":"/images/timeline/aniversario1.jpg","thumbnail_url":"/images/timeline/thumbs/aniversario1.jpg","location":"Nossa Casa","milestone_type":"anniversary","is_major_milestone":false,"order_index":7,"created_at":"2025-09-29 21:41:34.306297+00","display_order":7,"image_url":null,"is_visible":true},
  {"idx":5,"id":"6fc9f7ba-82c4-4f69-85b6-468bf4754c5a","date":"2023-12-31","title":"Primeiro Réveillon Juntos","description":"Nosso primeiro réveillon morando juntos! Brindando 2024 em casa, com Linda e Cacao aos nossos pés. Alguns momentos merecem intimidade.","media_type":"photo","media_url":"/images/timeline/reveillon.jpg","thumbnail_url":"/images/timeline/thumbs/reveillon.jpg","location":"Nossa Casa","milestone_type":"anniversary","is_major_milestone":false,"order_index":6,"created_at":"2025-09-29 21:41:34.306297+00","display_order":6,"image_url":null,"is_visible":true},
  {"idx":6,"id":"7ccc1d06-be06-420f-b896-9ea531b3b851","date":"2025-04-15","title":"Pensando no Futuro Juntos","description":"Ylana congelou óvulos aos 34 anos - cuidando do nosso futuro, planejando nossa família. Algumas decisões são sobre amor que ainda está por vir.","media_type":"photo","media_url":"/images/timeline/futuro.jpg","thumbnail_url":"/images/timeline/thumbs/futuro.jpg","location":"Fortaleza","milestone_type":"family","is_major_milestone":false,"order_index":13,"created_at":"2025-09-29 21:41:34.306297+00","display_order":13,"image_url":null,"is_visible":true},
  {"idx":7,"id":"9533f4ad-afcc-4353-aaf6-9468795dee92","date":"2023-03-01","title":"Cacao Se Junta à Linda","description":"Nossa família peluda cresceu! Cacao chegou para fazer companhia à Linda. Dois pets, dois corações humanos - nossa casa ficou ainda mais cheia de amor.","media_type":"photo","media_url":"/images/timeline/cacao.jpg","thumbnail_url":"/images/timeline/thumbs/cacao.jpg","location":"Nossa Casa","milestone_type":"family","is_major_milestone":false,"order_index":5,"created_at":"2025-09-29 21:41:34.306297+00","display_order":5,"image_url":null,"is_visible":true},
  {"idx":8,"id":"a0a914be-5d8b-479b-8a8f-de4192a75ec9","date":"2023-02-15","title":"O Gesto que Mudou Tudo","description":"Ylana levando remédio e chá quando Hel ficou doente. Na hora eu já sabia: 'é ela'. Às vezes o amor se revela nos cuidados mais simples e sinceros.","media_type":"photo","media_url":"/images/timeline/gesto-carinho.jpg","thumbnail_url":"/images/timeline/thumbs/gesto-carinho.jpg","location":"Casa do Hel","milestone_type":"other","is_major_milestone":false,"order_index":3,"created_at":"2025-09-29 21:41:34.306297+00","display_order":3,"image_url":null,"is_visible":true},
  {"idx":9,"id":"b01555c3-d295-4724-97b1-b398e2e3bf25","date":"2025-08-30","title":"O Pedido Perfeito","description":"Icaraí de Amontada: \"Vamos jantar no restaurante do hotel\" virou surpresa na suíte com câmeras ligadas. Ajoelhado, anel na mão, coração transbordando. O 'SIM' mais lindo do mundo.","media_type":"photo","media_url":"/images/timeline/pedido.jpg","thumbnail_url":"/images/timeline/thumbs/pedido.jpg","location":"Icaraí de Amontada, Ceará","milestone_type":"engagement","is_major_milestone":false,"order_index":14,"created_at":"2025-09-29 21:41:34.306297+00","display_order":14,"image_url":null,"is_visible":true},
  {"idx":10,"id":"b6514d59-c9b2-45f0-b18e-0a94aee91348","date":"2024-10-25","title":"Mangue Azul & Rio de Janeiro","description":"2º aniversário no nosso restaurante favorito Mangue Azul, seguido de viagem dos sonhos: Rio de Janeiro e Búzios em hotel 5 estrelas. Se o Mangue não tivesse fechado, o casamento seria lá.","media_type":"photo","media_url":"/images/timeline/aniversario2.jpg","thumbnail_url":"/images/timeline/thumbs/aniversario2.jpg","location":"Mangue Azul, Fortaleza / Rio & Búzios","milestone_type":"anniversary","is_major_milestone":false,"order_index":10,"created_at":"2025-09-29 21:41:34.306297+00","display_order":10,"image_url":null,"is_visible":true},
  {"idx":11,"id":"be85bc04-f7e4-472c-970d-f9ad0db67858","date":"2023-01-14","title":"Casa Fontana & Avatar VIP","description":"Jantar no Casa Fontana seguido de Avatar: O Caminho da Água nas poltronas VIP F11/F12. A química foi instantânea - conversamos, rimos e já sabíamos que isso era especial.","media_type":"photo","media_url":"/images/timeline/primeiro-encontro.jpg","thumbnail_url":"/images/timeline/thumbs/primeiro-encontro.jpg","location":"Casa Fontana, Fortaleza","milestone_type":"first_date","is_major_milestone":false,"order_index":2,"created_at":"2025-09-29 21:41:34.306297+00","display_order":2,"image_url":"https://uottcbjzpiudgmqzhuii.supabase.co/storage/v1/object/public/wedding-photos/timeline/1759183128856-am0ltk.png","is_visible":true},
  {"idx":12,"id":"c0e4b19c-4927-41a1-901b-d319521016ac","date":"2024-03-15","title":"O Apartamento dos Sonhos","description":"Mudança para o apartamento que Hel passava de bicicleta na faculdade sonhando em morar. Anos de trabalho duro para realizar o sonho de uma casa própria para nossa família de 6.","media_type":"photo","media_url":"/images/timeline/apartamento.jpg","thumbnail_url":"/images/timeline/thumbs/apartamento.jpg","location":"Nosso Apartamento dos Sonhos","milestone_type":"other","is_major_milestone":false,"order_index":9,"created_at":"2025-09-29 21:41:34.306297+00","display_order":9,"image_url":null,"is_visible":true},
  {"idx":13,"id":"cabf29bc-fb6a-42e7-ad9a-4e2ee8239fc0","date":"2023-02-25","title":"Guaramiranga Espontâneo","description":"Planejei jantar especial, mas não consegui esperar! Pedi para namorar na manhã, em meio às montanhas. O coração não sabe de planos - só de amor.","media_type":"photo","media_url":"/images/timeline/guaramiranga.jpg","thumbnail_url":"/images/timeline/thumbs/guaramiranga.jpg","location":"Guaramiranga, Ceará","milestone_type":"anniversary","is_major_milestone":false,"order_index":4,"created_at":"2025-09-29 21:41:34.306297+00","display_order":4,"image_url":null,"is_visible":true},
  {"idx":14,"id":"fde6201e-ef5c-4db6-8252-fb2381112c88","date":"2023-01-06","title":"Do Tinder ao WhatsApp","description":"Primeiro 'oi' que mudou tudo. Quem diria que um match se tornaria a mais linda história de amor? O início de mil dias mágicos.","media_type":"photo","media_url":"/images/timeline/primeiro-oi.jpg","thumbnail_url":"/images/timeline/thumbs/primeiro-oi.jpg","location":"WhatsApp","milestone_type":"first_date","is_major_milestone":false,"order_index":1,"created_at":"2025-09-29 21:41:34.306297+00","display_order":1,"image_url":"https://uottcbjzpiudgmqzhuii.supabase.co/storage/v1/object/public/wedding-photos/timeline/1759183099968-n9ag4q.png","is_visible":true}
];

// Reference date: "Do Tinder ao WhatsApp" = Day 1
const START_DATE = new Date('2023-01-06');

/**
 * Calculate day number from start date
 */
function calculateDayNumber(dateString) {
  const eventDate = new Date(dateString);
  const diffTime = Math.abs(eventDate - START_DATE);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // +1 because first day is Day 1, not Day 0
}

/**
 * Transform Supabase event to Sanity timelineEvent format
 */
function transformEvent(supabaseEvent) {
  return {
    dayNumber: calculateDayNumber(supabaseEvent.date),
    date: supabaseEvent.date,
    title: supabaseEvent.title,
    description: supabaseEvent.description,
    // Note: Images will be added manually in Sanity Studio
    contentAlign: supabaseEvent.order_index % 2 === 0 ? 'left' : 'right', // Alternate left/right
  };
}

/**
 * Group events into phases
 */
function groupIntoPhases(events) {
  // Sort by date
  const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

  const phases = [
    {
      id: 'primeiros_dias',
      title: 'Os Primeiros Dias',
      dayRange: 'Dia 1 - 100',
      subtitle: 'Do match no Tinder ao início de uma história de amor única',
      events: [],
    },
    {
      id: 'construindo_juntos',
      title: 'Construindo Juntos',
      dayRange: 'Dia 101 - 500',
      subtitle: 'Família, casa própria e conquistas lado a lado',
      events: [],
    },
    {
      id: 'rumo_ao_para_sempre',
      title: 'Rumo ao Para Sempre',
      dayRange: 'Dia 501 - 1000',
      subtitle: 'Do pedido de casamento aos mil dias de amor',
      events: [],
    },
  ];

  // Distribute events into phases based on day number
  sortedEvents.forEach(event => {
    const transformedEvent = transformEvent(event);
    const dayNum = transformedEvent.dayNumber;

    if (dayNum <= 100) {
      phases[0].events.push(transformedEvent);
    } else if (dayNum <= 500) {
      phases[1].events.push(transformedEvent);
    } else {
      phases[2].events.push(transformedEvent);
    }
  });

  return phases;
}

/**
 * Generate complete Sanity timelinePage document
 */
function generateSanityDocument() {
  const phases = groupIntoPhases(supabaseTimelineEvents);

  return {
    _type: 'timelinePage',
    title: 'Nossa História Completa',
    hero: {
      title: 'Mil Dias de Amor',
      subtitle: 'Do primeiro "oi" no WhatsApp ao altar. Nossa jornada de 1000 dias juntos, contada em momentos especiais que construíram o amor da nossa vida.',
    },
    phases: phases,
    seo: {
      title: 'Nossa História | Hel & Ylana',
      description: 'A história completa de Hel e Ylana, desde o primeiro encontro até o casamento. 1000 dias de amor, companheirismo e sonhos realizados juntos.',
    },
  };
}

// Generate and output the document
const sanityDocument = generateSanityDocument();

console.log('\n=== TIMELINE MIGRATION - SUPABASE TO SANITY ===\n');
console.log('Total events:', supabaseTimelineEvents.length);
console.log('Phases created:', sanityDocument.phases.length);
console.log('\nPhase breakdown:');
sanityDocument.phases.forEach(phase => {
  console.log(`  ${phase.title}: ${phase.events.length} events (${phase.dayRange})`);
});

console.log('\n=== SANITY DOCUMENT (Copy this to Sanity Studio) ===\n');
console.log(JSON.stringify(sanityDocument, null, 2));

console.log('\n=== NEXT STEPS ===');
console.log('1. Copy the JSON output above');
console.log('2. Go to Sanity Studio: http://localhost:3002/studio');
console.log('3. Navigate to: Páginas → Nossa História');
console.log('4. Paste the JSON data (use the "Import" feature if available)');
console.log('5. Manually add images to each event');
console.log('6. Publish the document\n');

// Also save to file
const fs = require('fs');
const outputPath = __dirname + '/sanity-timeline-import.json';
fs.writeFileSync(outputPath, JSON.stringify(sanityDocument, null, 2));
console.log(`✅ Document also saved to: ${outputPath}\n`);
