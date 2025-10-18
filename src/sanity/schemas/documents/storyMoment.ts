/**
 * Story Moment Schema
 *
 * Timeline moments for the "Nossa História" section.
 * Represents key moments in the couple's journey together.
 *
 * MIGRATION NOTE: This schema has been updated to support multiple media items.
 * Legacy fields (image, video) have been replaced with a media array.
 * Existing content will need to be migrated to the new media array structure.
 */

import { defineType, defineField, defineArrayMember } from 'sanity'
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
      name: 'dayNumber',
      title: '📅 Dia do Relacionamento',
      type: 'number',
      description: 'Número do dia contado desde o início (ex: Dia 1, Dia 434, Dia 1000)',
      placeholder: 'Ex: 1, 100, 434',
      validation: (Rule) => Rule.integer().positive(),
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
      name: 'media',
      title: 'Mídia',
      type: 'array',
      description: 'Fotos e vídeos deste momento (pelo menos 1 item necessário)',
      validation: (Rule) => Rule.required().min(1).max(10),
      of: [
        defineArrayMember({
          name: 'mediaItem',
          title: 'Item de Mídia',
          type: 'object',
          fields: [
            defineField({
              name: 'mediaType',
              title: 'Tipo de Mídia',
              type: 'string',
              description: 'Tipo de arquivo: imagem ou vídeo',
              options: {
                list: [
                  { title: 'Imagem', value: 'image' },
                  { title: 'Vídeo', value: 'video' },
                ],
                layout: 'radio',
              },
              validation: (Rule) => Rule.required(),
              initialValue: 'image',
            }),
            defineField({
              name: 'image',
              title: 'Imagem',
              type: 'image',
              description: 'Arquivo de imagem',
              options: {
                hotspot: true,
              },
              hidden: ({ parent }) => parent?.mediaType !== 'image',
              validation: (Rule) =>
                Rule.custom((image, context) => {
                  const parent = context.parent as { mediaType?: string }
                  if (parent?.mediaType === 'image' && !image) {
                    return 'Imagem é obrigatória quando o tipo é "Imagem"'
                  }
                  return true
                }),
            }),
            defineField({
              name: 'video',
              title: 'Vídeo',
              type: 'file',
              description: 'Arquivo de vídeo',
              options: {
                accept: 'video/*',
              },
              hidden: ({ parent }) => parent?.mediaType !== 'video',
              validation: (Rule) =>
                Rule.custom((video, context) => {
                  const parent = context.parent as { mediaType?: string }
                  if (parent?.mediaType === 'video' && !video) {
                    return 'Vídeo é obrigatório quando o tipo é "Vídeo"'
                  }
                  return true
                }),
            }),
            defineField({
              name: 'alt',
              title: 'Texto Alternativo',
              type: 'string',
              description: 'Descrição da mídia para acessibilidade',
              validation: (Rule) => Rule.max(200),
            }),
            defineField({
              name: 'caption',
              title: 'Legenda (Opcional)',
              type: 'string',
              description: 'Legenda descritiva para a mídia',
              validation: (Rule) => Rule.max(200),
            }),
            defineField({
              name: 'displayOrder',
              title: 'Ordem de Exibição',
              type: 'number',
              description: 'Ordem deste item na galeria (1, 2, 3...)',
              validation: (Rule) => Rule.required().min(1),
              initialValue: 1,
            }),
          ],
          preview: {
            select: {
              mediaType: 'mediaType',
              image: 'image',
              video: 'video',
              alt: 'alt',
              caption: 'caption',
              order: 'displayOrder',
            },
            prepare({ mediaType, image, video, alt, caption, order }) {
              const mediaAsset = mediaType === 'image' ? image : video
              const title = caption || alt || `${mediaType === 'image' ? 'Imagem' : 'Vídeo'} #${order}`

              return {
                title: `${order}. ${title}`,
                subtitle: mediaType === 'image' ? '📷 Imagem' : '🎥 Vídeo',
                media: mediaAsset,
              }
            },
          },
        }),
      ],
    }),

    // DEPRECATED FIELDS - kept for backwards compatibility during migration
    // These will be hidden in the UI but preserved in the database
    defineField({
      name: 'image',
      title: 'Imagem (OBSOLETO)',
      type: 'image',
      description: '⚠️ OBSOLETO: Use o campo "Mídia" acima. Este campo será removido.',
      hidden: true,
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
      title: 'Vídeo (OBSOLETO)',
      type: 'file',
      description: '⚠️ OBSOLETO: Use o campo "Mídia" acima. Este campo será removido.',
      hidden: true,
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
      media: 'media',
      legacyImage: 'image',
    },
    prepare({ title, day, order, icon, showPreview, showTimeline, visible, media, legacyImage }) {
      // Build badge indicators
      const badges = []
      if (!visible) badges.push('🔒')
      if (showPreview) badges.push('🏠')
      if (showTimeline) badges.push('📍')

      const badgeText = badges.length > 0 ? ` ${badges.join(' ')}` : ''
      const dayText = day ? `Dia ${day}` : 'Sem dia específico'

      // Count media items
      const mediaCount = media?.length || 0
      const mediaText = mediaCount > 0 ? ` (${mediaCount} ${mediaCount === 1 ? 'mídia' : 'mídias'})` : ''

      // Use first media item or legacy image for preview
      const previewMedia = media?.[0]?.image || media?.[0]?.video || legacyImage

      return {
        title: `${icon || '❤️'} ${order}. ${title}${mediaText}${badgeText}`,
        subtitle: dayText,
        media: previewMedia,
      }
    },
  },
})
