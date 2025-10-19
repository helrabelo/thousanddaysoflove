/**
 * Gallery Album Document Schema
 *
 * Gallery albums with multiple media support (images/videos).
 * Updated to follow storyMoment.ts pattern for multi-media arrays.
 *
 * MIGRATION NOTE: This schema now supports multiple media items per album.
 * Legacy single image field has been moved to hidden for backwards compatibility.
 * New albums should use the media array field.
 *
 * Benefits:
 * - Sanity's global CDN for fast image delivery
 * - Automatic image optimization (WebP, responsive sizes)
 * - Built-in image editor
 * - Version history
 * - Better content management interface
 */

import { defineField, defineType, defineArrayMember } from 'sanity'

export default defineType({
  name: 'galleryImage',
  title: 'Álbuns da Galeria',
  type: 'document',
  icon: () => '📷',
  fields: [
    // Basic Information
    defineField({
      name: 'title',
      title: 'Título do Álbum',
      type: 'string',
      description: 'Nome do álbum (ex: "Viagem para Gramado")',
      validation: (Rule) => Rule.required().max(255),
    }),

    defineField({
      name: 'description',
      title: 'Descrição',
      type: 'text',
      description: 'Conte a história deste momento',
      rows: 3,
    }),

    // Media Array (New Multi-Media Support)
    defineField({
      name: 'media',
      title: 'Mídia',
      type: 'array',
      description: 'Fotos e vídeos deste álbum (pelo menos 1 item necessário)',
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
                metadata: ['blurhash', 'lqip', 'palette'],
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
        metadata: ['blurhash', 'lqip', 'palette'],
      },
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
      name: 'mediaType',
      title: 'Tipo de Mídia (OBSOLETO)',
      type: 'string',
      description: '⚠️ OBSOLETO: Use o campo "Mídia" acima.',
      hidden: true,
      options: {
        list: [
          { title: 'Photo', value: 'photo' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio',
      },
      initialValue: 'photo',
    }),

    // Categorization
    defineField({
      name: 'category',
      title: 'Categoria',
      type: 'string',
      description: 'Que momento este álbum representa?',
      options: {
        list: [
          { title: '💍 Engagement', value: 'engagement' },
          { title: '✈️ Travel', value: 'travel' },
          { title: '💕 Dates', value: 'dates' },
          { title: '👨‍👩‍👧‍👦 Family', value: 'family' },
          { title: '👯 Friends', value: 'friends' },
          { title: '✨ Special Moments', value: 'special_moments' },
          { title: '💎 Proposal', value: 'proposal' },
          { title: '👰 Wedding Prep', value: 'wedding_prep' },
          { title: '🎬 Behind Scenes', value: 'behind_scenes' },
          { title: '📸 Professional', value: 'professional' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      description: 'Adicione tags para melhor organização',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),

    // Location & Date
    defineField({
      name: 'dateTaken',
      title: 'Data',
      type: 'date',
      description: 'Quando foi este momento?',
      options: {
        dateFormat: 'DD/MM/YYYY',
      },
    }),

    defineField({
      name: 'location',
      title: 'Localização',
      type: 'string',
      description: 'Onde foi tirada?',
      placeholder: 'ex: Fortaleza, Ceará',
    }),

    // Display Options
    defineField({
      name: 'isFeatured',
      title: 'Destaque',
      type: 'boolean',
      description: 'Mostrar nas galerias em destaque',
      initialValue: false,
    }),

    defineField({
      name: 'isPublic',
      title: 'Público',
      type: 'boolean',
      description: 'Tornar este álbum visível no site',
      initialValue: true,
    }),

    // Technical Metadata (optional)
    defineField({
      name: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'number',
      description: 'Largura / Altura (calculado automaticamente)',
      readOnly: true,
    }),
  ],

  // Preview Configuration
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'media',
      legacyImage: 'image',
      isFeatured: 'isFeatured',
      isPublic: 'isPublic',
      dateTaken: 'dateTaken',
    },
    prepare({ title, subtitle, media, legacyImage, isFeatured, isPublic, dateTaken }) {
      const categoryLabels: Record<string, string> = {
        engagement: '💍 Engagement',
        travel: '✈️ Travel',
        dates: '💕 Dates',
        family: '👨‍👩‍👧‍👦 Family',
        friends: '👯 Friends',
        special_moments: '✨ Special Moments',
        proposal: '💎 Proposal',
        wedding_prep: '👰 Wedding Prep',
        behind_scenes: '🎬 Behind Scenes',
        professional: '📸 Professional',
      }

      const badges = []
      if (isFeatured) badges.push('⭐ Featured')
      if (!isPublic) badges.push('🔒 Private')

      const categoryLabel = categoryLabels[subtitle] || subtitle
      const dateStr = dateTaken ? new Date(dateTaken).toLocaleDateString('pt-BR') : ''

      // Count media items
      const mediaCount = media?.length || 0
      const mediaText = mediaCount > 1 ? ` (${mediaCount} mídias)` : ''

      // Use first media item or legacy image for preview
      const previewMedia = media?.[0]?.image || media?.[0]?.video || legacyImage

      return {
        title: `${title}${mediaText}`,
        subtitle: `${categoryLabel}${dateStr ? ` • ${dateStr}` : ''}${badges.length > 0 ? ` • ${badges.join(' ')}` : ''}`,
        media: previewMedia,
      }
    },
  },

  // Initial Value
  initialValue: {
    isPublic: true,
    isFeatured: false,
    category: 'special_moments',
  },

  // Ordering
  orderings: [
    {
      title: 'Data (Mais Recente)',
      name: 'dateTakenDesc',
      by: [{ field: 'dateTaken', direction: 'desc' }],
    },
    {
      title: 'Data (Mais Antigo)',
      name: 'dateTakenAsc',
      by: [{ field: 'dateTaken', direction: 'asc' }],
    },
    {
      title: 'Título (A-Z)',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
    {
      title: 'Categoria',
      name: 'categoryAsc',
      by: [{ field: 'category', direction: 'asc' }],
    },
  ],
})
