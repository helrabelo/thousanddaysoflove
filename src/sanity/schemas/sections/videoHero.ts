/**
 * Video Hero Section Schema
 *
 * Full-screen hero section with background video or image.
 * Includes monogram, tagline, date badge, and primary/secondary CTAs.
 */

import { defineType, defineField } from 'sanity'
import { Film } from 'lucide-react'

export default defineType({
  name: 'videoHero',
  title: 'Hero com Vídeo',
  type: 'document',
  icon: Film,

  fields: [
    // Section Identifier
    defineField({
      name: 'sectionId',
      title: 'ID da Seção',
      type: 'string',
      description: 'Identificador único para esta seção (usado para navegação)',
      validation: (Rule) => Rule.required(),
    }),

    // Monogram
    defineField({
      name: 'monogram',
      title: 'Monograma',
      type: 'string',
      description: 'Monograma dos noivos (ex: "H ♥ Y")',
      validation: (Rule) => Rule.required().max(20),
      initialValue: 'H ♥ Y',
    }),

    // Tagline
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'text',
      rows: 2,
      description: 'Texto de subtítulo/convite',
      validation: (Rule) => Rule.required().max(150),
      placeholder: 'Venha celebrar nossos mil dias de amor e o começo de nossa jornada eterna',
    }),

    // Date Badge
    defineField({
      name: 'dateBadge',
      title: 'Badge de Data',
      type: 'string',
      description: 'Data formatada para exibição (ex: "20.11.2025")',
      validation: (Rule) => Rule.required(),
      placeholder: '20.11.2025',
    }),

    // Primary CTA
    defineField({
      name: 'primaryCta',
      title: 'CTA Principal',
      type: 'object',
      description: 'Botão de ação principal',
      fields: [
        {
          name: 'label',
          title: 'Texto do Botão',
          type: 'string',
          validation: (Rule) => Rule.required(),
          initialValue: 'Confirmar Presença',
        },
        {
          name: 'href',
          title: 'Link',
          type: 'string',
          description: 'URL relativa (ex: /rsvp) ou âncora (ex: #rsvp)',
          validation: (Rule) => Rule.required(),
          initialValue: '/rsvp',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),

    // Secondary CTA
    defineField({
      name: 'secondaryCta',
      title: 'CTA Secundário',
      type: 'object',
      description: 'Botão de ação secundária (opcional)',
      fields: [
        {
          name: 'label',
          title: 'Texto do Botão',
          type: 'string',
          initialValue: 'Ver Presentes',
        },
        {
          name: 'href',
          title: 'Link',
          type: 'string',
          description: 'URL relativa (ex: /presentes) ou âncora (ex: #presentes)',
          initialValue: '/presentes',
        },
      ],
    }),

    // Scroll Text
    defineField({
      name: 'scrollText',
      title: 'Texto do Scroll',
      type: 'string',
      description: 'Texto que aparece com indicador de scroll',
      placeholder: 'Explorar',
      initialValue: 'Explorar',
    }),

    // Background Video
    defineField({
      name: 'backgroundVideo',
      title: 'Vídeo de Fundo',
      type: 'file',
      description: 'Vídeo de fundo para o hero (MP4 recomendado)',
      options: {
        accept: 'video/*',
      },
    }),

    // Background Image
    defineField({
      name: 'backgroundImage',
      title: 'Imagem de Fundo',
      type: 'image',
      description: 'Imagem de fundo (fallback se não houver vídeo)',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
      fields: [
        {
          name: 'alt',
          title: 'Texto Alternativo',
          type: 'string',
          description: 'Descrição da imagem para acessibilidade',
        },
      ],
    }),

    // Poster Image
    defineField({
      name: 'posterImage',
      title: 'Imagem Poster (Vídeo)',
      type: 'image',
      description: 'Imagem exibida enquanto o vídeo carrega',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Texto Alternativo',
          type: 'string',
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
      monogram: 'monogram',
      tagline: 'tagline',
      dateBadge: 'dateBadge',
      media: 'backgroundImage',
    },
    prepare({ monogram, tagline, dateBadge, media }) {
      return {
        title: `Hero: ${monogram}`,
        subtitle: `${dateBadge} - ${tagline?.substring(0, 50)}...`,
        media,
      }
    },
  },
})
