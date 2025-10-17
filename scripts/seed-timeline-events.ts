import 'dotenv/config'
import { writeClient } from '@/sanity/lib/client'

if (!process.env.SANITY_API_WRITE_TOKEN) {
  throw new Error('Missing SANITY_API_WRITE_TOKEN in environment')
}

const weddingDate = '2025-11-20'

interface EventInput {
  timelineEventId?: string
  id: string
  title: string
  description: string
  start: string
  end?: string
  estimatedDuration: number
  icon: string
  colorGradient: string
  location: string
  eventType:
    | 'pre_ceremony'
    | 'ceremony'
    | 'post_ceremony'
    | 'reception'
    | 'entertainment'
    | 'special_moment'
    | 'closing'
  allowPhotoUploads: boolean
  photoUploadPrompt?: string
  isHighlight?: boolean
  showOnTVDisplay?: boolean
  displayOrder: number
  sendNotifications?: boolean
  notificationLeadTime?: number
}

const makeDateTime = (time: string) => {
  // Times are provided in local (America/Sao_Paulo) timezone (-03:00)
  return new Date(`${weddingDate}T${time}-03:00`).toISOString()
}

const events: EventInput[] = [
  {
    id: 'weddingTimelineEvent-1',
    title: 'Chegada dos Convidados',
    description:
      'Portao aberto, welcome drink na mao e aquela musiquinha gostosa pra ja entrar no clima. Chega cedo, escolhe um bom lugar e aproveita que ainda da tempo de fofocar sem microfone ligado.',
    start: makeDateTime('11:15:00'),
    end: makeDateTime('11:45:00'),
    estimatedDuration: 30,
    icon: 'Users',
    colorGradient: 'from-[#4A7C59] to-[#5A8C69]',
    location: 'Casa HY · Jardim de Entrada',
    eventType: 'pre_ceremony',
    allowPhotoUploads: true,
    photoUploadPrompt:
      'Mostra seu look, registra a galera chegando, manda foto da mesinha de drinks. A gente quer ver tudo.',
    displayOrder: 1,
  },
  {
    id: 'weddingTimelineEvent-2',
    title: 'Cerimonia',
    description:
      'O momento do sim. Curto, direto, zero enrolacao. Hel ainda vai tentar fazer piada, Ylana provavelmente chora (ou manda ele focar).',
    start: makeDateTime('11:45:00'),
    end: makeDateTime('12:15:00'),
    estimatedDuration: 30,
    icon: 'Heart',
    colorGradient: 'from-[#D4A574] to-[#C19A6B]',
    location: 'Casa HY · Salão Principal',
    eventType: 'ceremony',
    allowPhotoUploads: true,
    photoUploadPrompt:
      'Vale tudo: voto engraçado, ring bearer improvisado, o beijo final. Se acontecer, registra.',
    isHighlight: true,
    showOnTVDisplay: true,
    displayOrder: 2,
    sendNotifications: true,
    notificationLeadTime: 10,
  },
  {
    id: 'weddingTimelineEvent-3',
    title: 'Sessao de Fotos',
    description:
      'Pausa rapida pra fotos com familia e amigos. Se ouvir “so mais uma”, paciencia. A gente quer lembrar de cada cara.',
    start: makeDateTime('12:15:00'),
    end: makeDateTime('12:45:00'),
    estimatedDuration: 30,
    icon: 'Camera',
    colorGradient: 'from-[#8B7355] to-[#A0826D]',
    location: 'Casa HY · Jardim Principal',
    eventType: 'post_ceremony',
    allowPhotoUploads: true,
    photoUploadPrompt:
      'Selfie com os noivos, foto com a avo, clique do casal que chegou com o pet. Manda tudo.',
    displayOrder: 3,
  },
  {
    id: 'weddingTimelineEvent-4',
    title: 'Almoco',
    description:
      'Buffet honesto, comida de verdade, sobremesa que vale repetir. Conversa fiada garantida na mesa.',
    start: makeDateTime('12:45:00'),
    end: makeDateTime('13:30:00'),
    estimatedDuration: 45,
    icon: 'Utensils',
    colorGradient: 'from-[#D4749B] to-[#C16B8A]',
    location: 'Casa HY · Terraço Gourmet',
    eventType: 'reception',
    allowPhotoUploads: true,
    photoUploadPrompt:
      'Prato favorito, brinde inesperado, aquele tio que fala alto. Se for memoravel, registra.',
    displayOrder: 4,
  },
  {
    id: 'weddingTimelineEvent-5',
    title: 'Celebracao',
    description:
      'Musica, risada e dancinha improvisada (mesmo pros introvertidos). Sem coreografia ensaiada, so alegria real.',
    start: makeDateTime('13:30:00'),
    end: makeDateTime('15:30:00'),
    estimatedDuration: 120,
    icon: 'PartyPopper',
    colorGradient: 'from-[#4A7C9B] to-[#5A8CAB]',
    location: 'Casa HY · Salao Principal',
    eventType: 'entertainment',
    allowPhotoUploads: true,
    photoUploadPrompt:
      'Filmou uma rodinha animada? Pegou o Hel cantando alto? Manda pra gente rir junto depois.',
    isHighlight: true,
    showOnTVDisplay: true,
    displayOrder: 5,
  },
  {
    id: 'weddingTimelineEvent-6',
    title: 'Cafe da Tarde',
    description:
      'Mesa de cafe reforcada pra recarregar. Tem bolo, tem mini quitute, tem pausa pra respirar.',
    start: makeDateTime('15:30:00'),
    end: makeDateTime('16:30:00'),
    estimatedDuration: 60,
    icon: 'Cake',
    colorGradient: 'from-[#C19A6B] to-[#D4A574]',
    location: 'Casa HY · Varanda',
    eventType: 'reception',
    allowPhotoUploads: true,
    photoUploadPrompt:
      'Foto do bolo, da xicara bonita, da crianca dormindo no colo. Tudo vale.',
    displayOrder: 6,
  },
  {
    id: 'weddingTimelineEvent-7',
    title: 'Encerramento',
    description:
      'Aquele abraco final, ultimato pra pegar lembrancinha e promessa de reencontro. Obrigado por ficar ate o fim.',
    start: makeDateTime('17:00:00'),
    end: makeDateTime('17:30:00'),
    estimatedDuration: 30,
    icon: 'Clock',
    colorGradient: 'from-[#5A8C69] to-[#4A7C59]',
    location: 'Casa HY · Saida Principal',
    eventType: 'closing',
    allowPhotoUploads: true,
    photoUploadPrompt:
      'Selfie de despedida, mala no carro, ultima foto com os noivos. Fecha esse dia com estilo.',
    displayOrder: 7,
  },
]

async function seedTimeline() {
  console.log('Seeding wedding timeline events...')

  const transaction = writeClient.transaction()

  for (const event of events) {
    transaction.createOrReplace({
      _id: event.id,
      _type: 'weddingTimelineEvent',
      title: event.title,
      description: event.description,
      startTime: event.start,
      endTime: event.end ?? null,
      estimatedDuration: event.estimatedDuration,
      icon: event.icon,
      colorGradient: event.colorGradient,
      location: event.location,
      eventType: event.eventType,
      allowPhotoUploads: event.allowPhotoUploads,
      photoUploadPrompt: event.photoUploadPrompt ?? null,
      isHighlight: event.isHighlight ?? false,
      showOnTVDisplay: event.showOnTVDisplay ?? true,
      displayOrder: event.displayOrder,
      isActive: true,
      sendNotifications: event.sendNotifications ?? false,
      notificationLeadTime: event.sendNotifications ? event.notificationLeadTime ?? 10 : null,
      guestPhotosCount: 0,
      viewCount: 0,
      viewCount: 0,
    })
  }

  await transaction.commit()
  console.log('Timeline events seeded successfully.')
}

seedTimeline().catch((error) => {
  console.error('Failed to seed timeline events:', error)
  process.exit(1)
})
