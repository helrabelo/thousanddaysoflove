/**
 * Timeline Page Schema
 *
 * Special page for the full relationship timeline (/historia).
 * Displays chronological story with phases and events.
 */

import { defineType, defineField } from 'sanity'
import { Clock } from 'lucide-react'

export default defineType({
  name: 'timelinePage',
  title: 'Página: História Completa',
  type: 'document',
  icon: Clock,

  // Singleton pattern
  __experimental_actions: ['update', 'publish'],

  fields: [
    defineField({
      name: 'title',
      title: 'Título Interno',
      type: 'string',
      description: 'Nome da página (apenas para organização)',
      initialValue: 'Nossa História Completa',
    }),

    // Hero Section
    defineField({
      name: 'hero',
      title: 'Hero da Página',
      type: 'object',
      description: 'Cabeçalho da timeline',
      fields: [
        {
          name: 'title',
          title: 'Título',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'subtitle',
          title: 'Subtítulo',
          type: 'text',
          rows: 2,
          validation: (Rule) => Rule.required(),
        },
      ],
    }),

    // Timeline Phases
    defineField({
      name: 'phases',
      title: 'Fases da Timeline',
      type: 'array',
      description: 'Organize a história em fases cronológicas',
      of: [
        {
          type: 'object',
          name: 'phase',
          fields: [
            {
              name: 'id',
              title: 'ID da Fase',
              type: 'string',
              description: 'Ex: primeiros_dias, construindo_juntos',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'title',
              title: 'Título',
              type: 'string',
              description: 'Ex: "Os Primeiros Dias"',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'dayRange',
              title: 'Período',
              type: 'string',
              description: 'Ex: "Dia 1 - 100"',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'subtitle',
              title: 'Descrição',
              type: 'text',
              rows: 2,
              description: 'Descrição curta da fase',
            },
            {
              name: 'events',
              title: 'Eventos',
              type: 'array',
              description: 'Momentos desta fase',
              of: [
                {
                  type: 'object',
                  name: 'timelineEvent',
                  fields: [
                    {
                      name: 'dayNumber',
                      title: 'Dia',
                      type: 'number',
                      description: 'Número do dia (ex: 1, 434)',
                      validation: (Rule) => Rule.required().min(1),
                    },
                    {
                      name: 'date',
                      title: 'Data',
                      type: 'date',
                      description: 'Data real do evento',
                      validation: (Rule) => Rule.required(),
                    },
                    {
                      name: 'title',
                      title: 'Título',
                      type: 'string',
                      validation: (Rule) => Rule.required(),
                    },
                    {
                      name: 'description',
                      title: 'Descrição',
                      type: 'text',
                      rows: 4,
                      validation: (Rule) => Rule.required(),
                    },
                    {
                      name: 'image',
                      title: 'Foto',
                      type: 'image',
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
                    },
                    {
                      name: 'video',
                      title: 'Vídeo (Opcional)',
                      type: 'file',
                      description: 'Vídeo MP4 para este momento',
                    },
                    {
                      name: 'contentAlign',
                      title: 'Alinhamento do Conteúdo',
                      type: 'string',
                      options: {
                        list: [
                          { title: 'Esquerda', value: 'left' },
                          { title: 'Direita', value: 'right' },
                        ],
                        layout: 'radio',
                      },
                      initialValue: 'left',
                    },
                  ],
                  preview: {
                    select: {
                      day: 'dayNumber',
                      title: 'title',
                      media: 'image',
                    },
                    prepare({ day, title, media }) {
                      return {
                        title: `Dia ${day}: ${title}`,
                        media,
                      }
                    },
                  },
                },
              ],
            },
          ],
          preview: {
            select: {
              title: 'title',
              range: 'dayRange',
              events: 'events',
            },
            prepare({ title, range, events }) {
              return {
                title,
                subtitle: `${range} • ${events?.length || 0} eventos`,
              }
            },
          },
        },
      ],
    }),

    // SEO
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        {
          name: 'title',
          title: 'Título SEO',
          type: 'string',
          validation: (Rule) => Rule.max(60),
        },
        {
          name: 'description',
          title: 'Meta Description',
          type: 'text',
          rows: 2,
          validation: (Rule) => Rule.max(160),
        },
        {
          name: 'ogImage',
          title: 'Imagem Open Graph',
          type: 'image',
        },
      ],
    }),
  ],

  preview: {
    select: {
      phases: 'phases',
    },
    prepare({ phases }) {
      const totalEvents = phases?.reduce(
        (sum: number, phase: any) => sum + (phase.events?.length || 0),
        0
      )
      return {
        title: 'Nossa História Completa',
        subtitle: `${phases?.length || 0} fases • ${totalEvents} eventos`,
      }
    },
  },
})
