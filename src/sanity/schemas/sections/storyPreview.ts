/**
 * Story Preview Section Schema
 *
 * Timeline preview of the couple's story with key moments.
 * Displays cinematic background with horizontal timeline carousel.
 */

import { defineType, defineField } from 'sanity'
import { Heart } from 'lucide-react'

export default defineType({
  name: 'storyPreview',
  title: 'Seção: História (Homepage)',
  type: 'document',
  icon: Heart,

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
      initialValue: 'Nossa História',
    }),

    // Section Description
    defineField({
      name: 'sectionDescription',
      title: 'Descrição',
      type: 'text',
      rows: 3,
      description: 'Introdução da seção (opcional)',
      placeholder: 'Dos mil dias do nosso amor...',
    }),

    // Background Video
    defineField({
      name: 'backgroundVideo',
      title: 'Vídeo de Fundo',
      type: 'file',
      description: 'Vídeo de fundo cinématico (MP4 recomendado, opcional)',
      options: {
        accept: 'video/*',
      },
    }),

    // Background Image
    defineField({
      name: 'backgroundImage',
      title: 'Imagem de Fundo',
      type: 'image',
      description: 'Imagem de fundo cinématica (fallback se não houver vídeo)',
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

    // Story Moments
    defineField({
      name: 'storyMoments',
      title: 'Momentos da História',
      type: 'array',
      description: 'Momentos-chave para exibir na homepage (filtrado automaticamente por "Exibir na Homepage")',
      of: [
        {
          type: 'reference',
          to: [{ type: 'storyMoment' }],
          options: {
            filter: 'showInPreview == true && isVisible == true',
          },
        },
      ],
      validation: (Rule) => Rule.min(1).max(6),
    }),

    // CTA Button
    defineField({
      name: 'ctaButton',
      title: 'Botão de Ação',
      type: 'object',
      description: 'Botão para página completa da história (opcional)',
      fields: [
        {
          name: 'label',
          title: 'Texto do Botão',
          type: 'string',
          placeholder: 'Ver História Completa',
          initialValue: 'Ver História Completa',
        },
        {
          name: 'href',
          title: 'Link',
          type: 'string',
          description: 'URL relativa (ex: /nossa-historia)',
          placeholder: '/nossa-historia',
          initialValue: '/nossa-historia',
        },
      ],
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
      description: 'sectionDescription',
      media: 'backgroundImage',
      momentsCount: 'storyMoments',
    },
    prepare({ title, description, media, momentsCount }) {
      const count = Array.isArray(momentsCount) ? momentsCount.length : 0
      return {
        title: `História: ${title}`,
        subtitle: count ? `${count} momentos` : 'Adicionar momentos',
        media,
      }
    },
  },
})
