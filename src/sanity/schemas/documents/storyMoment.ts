/**
 * Story Moment Schema
 *
 * Timeline moments for the "Nossa História" section.
 * Represents key moments in the couple's journey together.
 */

import { defineType, defineField } from 'sanity'
import { Heart } from 'lucide-react'

export default defineType({
  name: 'storyMoment',
  title: 'Momento Especial',
  type: 'document',
  icon: Heart,

  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      description: 'Título do momento (ex: "Do Tinder ao WhatsApp")',
      validation: (Rule) => Rule.required().max(100),
    }),

    defineField({
      name: 'date',
      title: 'Data',
      type: 'date',
      description: 'Data do acontecimento',
      validation: (Rule) => Rule.required(),
      options: {
        dateFormat: 'DD/MM/YYYY',
      },
    }),

    defineField({
      name: 'icon',
      title: 'Ícone/Emoji',
      type: 'string',
      description: 'Emoji ou ícone representativo (ex: 💑, 💍, ❤️)',
      validation: (Rule) => Rule.max(10),
      placeholder: '❤️',
    }),

    defineField({
      name: 'description',
      title: 'Descrição',
      type: 'text',
      rows: 4,
      description: 'História deste momento (200-300 caracteres)',
      validation: (Rule) => Rule.required().max(500),
    }),

    defineField({
      name: 'image',
      title: 'Imagem',
      type: 'image',
      description: 'Foto deste momento',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Texto Alternativo',
          type: 'string',
          description: 'Descrição da imagem para acessibilidade',
        },
      ],
    }),

    defineField({
      name: 'video',
      title: 'Vídeo (Opcional)',
      type: 'file',
      description: 'Vídeo alternativo/adicional ao invés de imagem',
      options: {
        accept: 'video/*',
      },
    }),

    defineField({
      name: 'phase',
      title: 'Capítulo',
      type: 'reference',
      to: [{ type: 'storyPhase' }],
      description: '📚 Este momento pertence a qual capítulo da história?',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'dayNumber',
      title: 'Dia (Opcional)',
      type: 'number',
      description: 'Número do dia para referência (ex: Dia 1, Dia 434)',
    }),

    defineField({
      name: 'contentAlign',
      title: 'Alinhamento',
      type: 'string',
      description: 'Posição do conteúdo na timeline (desktop)',
      options: {
        list: [
          { title: 'Esquerda', value: 'left' },
          { title: 'Direita', value: 'right' },
        ],
        layout: 'radio',
      },
      initialValue: 'left',
    }),

    defineField({
      name: 'displayOrder',
      title: 'Ordem de Exibição',
      type: 'number',
      description: 'Ordem cronológica (1, 2, 3...)',
      validation: (Rule) => Rule.required().min(1),
    }),

    defineField({
      name: 'showInPreview',
      title: 'Mostrar na Homepage',
      type: 'boolean',
      description: '🏠 Aparece na prévia da homepage (recomendado: 3-6 momentos)',
      initialValue: true,
    }),

    defineField({
      name: 'showInTimeline',
      title: 'Mostrar na Página Completa',
      type: 'boolean',
      description: '🕰️ Aparece na linha do tempo completa (/nossa-historia)',
      initialValue: true,
    }),

    defineField({
      name: 'isVisible',
      title: 'Visível',
      type: 'boolean',
      description: 'Exibir este momento no site',
      initialValue: true,
    }),
  ],

  orderings: [
    {
      title: 'Ordem de Exibição',
      name: 'displayOrder',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
    {
      title: 'Data',
      name: 'date',
      by: [{ field: 'date', direction: 'asc' }],
    },
    {
      title: 'Dia',
      name: 'dayNumber',
      by: [{ field: 'dayNumber', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      title: 'title',
      day: 'dayNumber',
      order: 'displayOrder',
      icon: 'icon',
      showPreview: 'showInPreview',
      showTimeline: 'showInTimeline',
      visible: 'isVisible',
      media: 'image',
    },
    prepare({ title, day, order, icon, showPreview, showTimeline, visible, media }) {
      // Build badge indicators
      const badges = []
      if (!visible) badges.push('🔒')
      if (showPreview) badges.push('🏠')
      if (showTimeline) badges.push('📍')

      const badgeText = badges.length > 0 ? ` ${badges.join(' ')}` : ''
      const dayText = day ? `Dia ${day}` : 'Sem dia específico'

      return {
        title: `${icon || '❤️'} ${order}. ${title}${badgeText}`,
        subtitle: dayText,
        media,
      }
    },
  },
})
