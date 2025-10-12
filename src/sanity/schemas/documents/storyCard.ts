/**
 * Story Card Schema
 *
 * Timeline moments for the "Nossa História" preview section.
 * Represents key moments in the couple's journey together.
 */

import { defineType, defineField } from 'sanity'
import { Heart } from 'lucide-react'

export default defineType({
  name: 'storyCard',
  title: 'Story Cards',
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
      type: 'string',
      description: 'Data formatada (ex: "6 de janeiro de 2023")',
      placeholder: '6 de janeiro de 2023',
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
      name: 'dayNumber',
      title: 'Dia (Opcional)',
      type: 'number',
      description: 'Número do dia para referência (ex: Dia 1, Dia 434)',
    }),

    defineField({
      name: 'displayOrder',
      title: 'Ordem de Exibição',
      type: 'number',
      description: 'Ordem cronológica no timeline (1, 2, 3)',
      validation: (Rule) => Rule.required().min(1),
    }),

    defineField({
      name: 'isVisible',
      title: 'Visível',
      type: 'boolean',
      description: 'Exibir esta história no site',
      initialValue: true,
    }),
  ],

  orderings: [
    {
      title: 'Ordem de Exibição',
      name: 'displayOrder',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      title: 'title',
      day: 'dayNumber',
      order: 'displayOrder',
      icon: 'icon',
    },
    prepare({ title, day, order, icon }) {
      return {
        title: `${icon || '❤️'} ${order}. ${title}`,
        subtitle: day ? `Dia ${day}` : 'Sem dia específico',
      }
    },
  },
})
