/**
 * Story Phase Schema
 *
 * Organizes story moments into chronological phases (e.g., "Os Primeiros Dias", "Construindo Juntos").
 * Each phase groups related story moments together in the timeline.
 */

import { defineType, defineField } from 'sanity'
import { Layers } from 'lucide-react'

export default defineType({
  name: 'storyPhase',
  title: 'Capítulo da História',
  type: 'document',
  icon: Layers,

  fields: [
    defineField({
      name: 'id',
      title: 'ID',
      type: 'slug',
      description: 'Identificador único da fase (ex: primeiros-dias)',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
        maxLength: 50,
      },
    }),

    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      description: 'Nome da fase (ex: "Os Primeiros Dias")',
      validation: (Rule) => Rule.required().max(100),
    }),

    defineField({
      name: 'dayRange',
      title: 'Intervalo de Dias',
      type: 'string',
      description: 'Período em dias (ex: "Dia 1 - 100")',
      validation: (Rule) => Rule.required(),
      placeholder: 'Dia 1 - 100',
    }),

    defineField({
      name: 'subtitle',
      title: 'Legenda',
      type: 'text',
      rows: 3,
      description: 'Descrição curta da fase (opcional)',
      placeholder: 'Do Tinder ao primeiro encontro. Aquele nervosismo que a gente não admitia.',
    }),

    defineField({
      name: 'displayOrder',
      title: 'Ordem de Exibição',
      type: 'number',
      description: 'Ordem cronológica no timeline (1, 2, 3...)',
      validation: (Rule) => Rule.required().min(1),
      initialValue: 1,
    }),

    defineField({
      name: 'isVisible',
      title: 'Visível',
      type: 'boolean',
      description: 'Exibir esta fase no site',
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
      title: 'Título',
      name: 'title',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      title: 'title',
      dayRange: 'dayRange',
      order: 'displayOrder',
      visible: 'isVisible',
    },
    prepare({ title, dayRange, order, visible }) {
      const visibilityIcon = visible ? '👁️' : '🔒'
      return {
        title: `${order}. ${title}`,
        subtitle: `${dayRange} ${visibilityIcon}`,
      }
    },
  },
})
