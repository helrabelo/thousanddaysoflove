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
      name: 'description',
      title: 'Descrição',
      type: 'text',
      rows: 4,
      description: 'História deste momento (200-300 caracteres)',
      validation: (Rule) => Rule.required().max(500),
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
    },
    prepare({ title, day, order }) {
      return {
        title: `${order}. ${title}`,
        subtitle: day ? `Dia ${day}` : 'Sem dia específico',
      }
    },
  },
})
