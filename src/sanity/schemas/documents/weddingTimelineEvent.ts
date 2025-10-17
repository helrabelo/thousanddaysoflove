/**
 * Wedding Timeline Event Schema
 *
 * Captures each milestone of the wedding day so the live timeline
 * can render real-time progress across TV and mobile experiences.
 */

import { defineField, defineType } from 'sanity'
import { Clock } from 'lucide-react'

export default defineType({
  name: 'weddingTimelineEvent',
  title: 'Eventos do Dia do Casamento',
  type: 'document',
  icon: Clock,

  fields: [
    // Basic Event Information
    defineField({
      name: 'title',
      title: 'Nome do Evento',
      type: 'string',
      description: 'Nome curto do momento (ex: "Cerimonia", "Almoco")',
      validation: (Rule) => Rule.required().max(60),
    }),

    defineField({
      name: 'description',
      title: 'Descricao',
      type: 'text',
      description: 'Detalhe o que acontecera neste momento',
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
    }),

    // Timing
    defineField({
      name: 'startTime',
      title: 'Horario de Inicio',
      type: 'datetime',
      description: 'Data e hora de inicio deste evento',
      validation: (Rule) => Rule.required(),
      options: {
        dateFormat: 'DD/MM/YYYY',
        timeFormat: 'HH:mm',
      },
    }),

    defineField({
      name: 'endTime',
      title: 'Horario de Termino',
      type: 'datetime',
      description: 'Data e hora de termino (opcional para eventos abertos)',
      options: {
        dateFormat: 'DD/MM/YYYY',
        timeFormat: 'HH:mm',
      },
    }),

    defineField({
      name: 'estimatedDuration',
      title: 'Duracao Estimada',
      type: 'number',
      description: 'Duracao em minutos',
      validation: (Rule) => Rule.positive().integer(),
      initialValue: 30,
    }),

    // Visual Design
    defineField({
      name: 'icon',
      title: 'Icone',
      type: 'string',
      description: 'Escolha um icone Lucide React',
      options: {
        list: [
          { title: 'Convidados', value: 'Users' },
          { title: 'Cerimonia', value: 'Heart' },
          { title: 'Fotos', value: 'Camera' },
          { title: 'Refeicao', value: 'Utensils' },
          { title: 'Musica', value: 'Music' },
          { title: 'Bolo', value: 'Cake' },
          { title: 'Buque', value: 'Flower' },
          { title: 'Celebracao', value: 'PartyPopper' },
          { title: 'Relogio', value: 'Clock' },
          { title: 'Especial', value: 'Sparkles' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'Clock',
    }),

    defineField({
      name: 'colorGradient',
      title: 'Gradiente de Cor',
      type: 'string',
      description: 'Gradiente Tailwind para o icone',
      options: {
        list: [
          { title: 'Verde (Natureza)', value: 'from-[#4A7C59] to-[#5A8C69]' },
          { title: 'Dourado (Elegancia)', value: 'from-[#D4A574] to-[#C19A6B]' },
          { title: 'Bronze (Classico)', value: 'from-[#8B7355] to-[#A0826D]' },
          { title: 'Azul (Serenidade)', value: 'from-[#4A7C9B] to-[#5A8CAB]' },
          { title: 'Rosa (Romance)', value: 'from-[#D4749B] to-[#C16B8A]' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'from-[#4A7C59] to-[#5A8C69]',
    }),

    // Location
    defineField({
      name: 'location',
      title: 'Localizacao',
      type: 'string',
      description: 'Onde este evento acontece (ex: "Salao Principal", "Jardim")',
      validation: (Rule) => Rule.max(100),
    }),

    // Event Type Classification
    defineField({
      name: 'eventType',
      title: 'Tipo de Evento',
      type: 'string',
      description: 'Categoria do evento para organizacao',
      options: {
        list: [
          { title: 'Pre-Ceremony', value: 'pre_ceremony' },
          { title: 'Ceremony', value: 'ceremony' },
          { title: 'Post-Ceremony', value: 'post_ceremony' },
          { title: 'Reception', value: 'reception' },
          { title: 'Entertainment', value: 'entertainment' },
          { title: 'Special Moment', value: 'special_moment' },
          { title: 'Closing', value: 'closing' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),

    // Guest Interaction Settings
    defineField({
      name: 'allowPhotoUploads',
      title: 'Permitir Upload de Fotos',
      type: 'boolean',
      description: 'Convidados podem enviar fotos durante este evento?',
      initialValue: true,
    }),

    defineField({
      name: 'photoUploadPrompt',
      title: 'Mensagem de Upload',
      type: 'string',
      description: 'Texto incentivando fotos (ex: "Capture este momento!")',
      hidden: ({ document }) => !document?.allowPhotoUploads,
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const doc = context.document as { allowPhotoUploads?: boolean } | undefined
          if (doc?.allowPhotoUploads && !value) {
            return 'Mensagem e necessaria quando uploads estao permitidos'
          }
          return true
        }),
    }),

    // Display Settings
    defineField({
      name: 'isHighlight',
      title: 'Evento de Destaque',
      type: 'boolean',
      description: 'Mostrar com destaque visual extra (ex: cerimonia)',
      initialValue: false,
    }),

    defineField({
      name: 'showOnTVDisplay',
      title: 'Mostrar na TV',
      type: 'boolean',
      description: 'Exibir este evento no display da TV',
      initialValue: true,
    }),

    defineField({
      name: 'displayOrder',
      title: 'Ordem de Exibicao',
      type: 'number',
      description: 'Ordem deste evento (1, 2, 3...)',
      validation: (Rule) => Rule.required().integer().positive(),
      initialValue: 1,
    }),

    // Status & Notifications
    defineField({
      name: 'isActive',
      title: 'Ativo',
      type: 'boolean',
      description: 'Este evento esta ativo no cronograma?',
      initialValue: true,
    }),

    defineField({
      name: 'sendNotifications',
      title: 'Enviar Notificacoes',
      type: 'boolean',
      description: 'Notificar convidados quando este evento comecar?',
      initialValue: false,
    }),

    defineField({
      name: 'notificationLeadTime',
      title: 'Antecedencia da Notificacao',
      type: 'number',
      description: 'Minutos antes do evento para enviar notificacao',
      hidden: ({ document }) => !document?.sendNotifications,
      validation: (Rule) => Rule.integer().positive(),
      initialValue: 10,
    }),

    // Activity Tracking (read-only, populated by system)
    defineField({
      name: 'guestPhotosCount',
      title: 'Fotos de Convidados',
      type: 'number',
      description: 'Total de fotos enviadas para este evento',
      readOnly: true,
      initialValue: 0,
    }),

    defineField({
      name: 'viewCount',
      title: 'Visualizacoes',
      type: 'number',
      description: 'Quantas vezes este evento foi visualizado',
      readOnly: true,
      initialValue: 0,
    }),
  ],

  preview: {
    select: {
      title: 'title',
      startTime: 'startTime',
      eventType: 'eventType',
      isActive: 'isActive',
      isHighlight: 'isHighlight',
      displayOrder: 'displayOrder',
    },
    prepare({ title, startTime, eventType, isActive, isHighlight, displayOrder }) {
      const time = startTime
        ? new Date(startTime).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'Sem horario'

      const badges: string[] = []
      if (isHighlight) badges.push('⭐')
      if (!isActive) badges.push('🔒')

      const typeEmojis: Record<string, string> = {
        pre_ceremony: '📋',
        ceremony: '💍',
        post_ceremony: '📸',
        reception: '🍽️',
        entertainment: '🎵',
        special_moment: '✨',
        closing: '👋',
      }

      const emoji = typeEmojis[eventType as keyof typeof typeEmojis] || '⏰'

      return {
        title: `${displayOrder}. ${time} - ${title}`,
        subtitle: `${emoji} ${eventType}${badges.length > 0 ? ` ${badges.join(' ')}` : ''}`,
      }
    },
  },

  orderings: [
    {
      title: 'Ordem de Exibicao',
      name: 'displayOrder',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
    {
      title: 'Horario de Inicio',
      name: 'startTime',
      by: [{ field: 'startTime', direction: 'asc' }],
    },
    {
      title: 'Tipo de Evento',
      name: 'eventType',
      by: [{ field: 'eventType', direction: 'asc' }],
    },
  ],
})

