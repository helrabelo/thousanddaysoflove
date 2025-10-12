/**
 * About Us Section Schema
 *
 * Rich text section about the couple with photos.
 * Uses portable text for flexible content formatting.
 */

import { defineType, defineField } from 'sanity'
import { Users } from 'lucide-react'

export default defineType({
  name: 'aboutUs',
  title: 'Sobre Nós',
  type: 'document',
  icon: Users,

  fields: [
    // Section Identifier
    defineField({
      name: 'sectionId',
      title: 'ID da Seção',
      type: 'string',
      description: 'Identificador único para esta seção (usado para navegação)',
      validation: (Rule) => Rule.required(),
    }),

    // Section Title
    defineField({
      name: 'sectionTitle',
      title: 'Título da Seção',
      type: 'string',
      description: 'Título principal da seção',
      validation: (Rule) => Rule.required(),
      initialValue: 'Sobre Nós',
    }),

    // Content (Portable Text)
    defineField({
      name: 'content',
      title: 'Conteúdo',
      type: 'array',
      description: 'Texto sobre o casal com formatação rica',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Negrito', value: 'strong' },
              { title: 'Itálico', value: 'em' },
            ],
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    }),

    // Couple Photos
    defineField({
      name: 'couplePhotos',
      title: 'Fotos do Casal',
      type: 'array',
      description: 'Galeria de fotos do casal para esta seção',
      of: [
        {
          type: 'image',
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
            {
              name: 'caption',
              title: 'Legenda',
              type: 'string',
              description: 'Legenda da foto (opcional)',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.max(4),
    }),

    // Layout Option
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      description: 'Como dispor o conteúdo e as fotos',
      options: {
        list: [
          { title: 'Texto à Esquerda, Fotos à Direita', value: 'text-left' },
          { title: 'Texto à Direita, Fotos à Esquerda', value: 'text-right' },
          { title: 'Texto no Centro, Fotos Abaixo', value: 'centered' },
        ],
      },
      initialValue: 'text-left',
    }),

    // Visibility
    defineField({
      name: 'isVisible',
      title: 'Visível',
      type: 'boolean',
      description: 'Exibir esta seção no site',
      initialValue: true,
    }),
  ],

  preview: {
    select: {
      title: 'sectionTitle',
      content: 'content',
      photos: 'couplePhotos',
      media: 'couplePhotos.0',
    },
    prepare({ title, content, photos, media }) {
      const photoCount = Array.isArray(photos) ? photos.length : 0
      const hasContent = Array.isArray(content) && content.length > 0

      return {
        title: `Sobre: ${title}`,
        subtitle: hasContent
          ? `${photoCount} foto${photoCount !== 1 ? 's' : ''}`
          : 'Adicionar conteúdo',
        media,
      }
    },
  },
})
