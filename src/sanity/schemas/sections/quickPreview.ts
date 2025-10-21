/**
 * Quick Preview Section Schema
 *
 * Feature cards showcasing key wedding site sections.
 * Navigation hub for RSVP, gifts, timeline, location, etc.
 */

import { defineType, defineField } from 'sanity'
import { Layout } from 'lucide-react'

export default defineType({
  name: 'quickPreview',
  title: 'Recursos Rápidos',
  type: 'document',
  icon: Layout,

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
      initialValue: 'Tudo Que Você Precisa',
    }),

    // Section Description
    defineField({
      name: 'sectionDescription',
      title: 'Descrição',
      type: 'text',
      rows: 3,
      description: 'Introdução da seção (opcional)',
      placeholder: 'Explore todos os detalhes do nosso grande dia',
    }),

    // Feature Cards
    defineField({
      name: 'featureCards',
      title: 'Cards de Recursos',
      type: 'array',
      description: 'Cards de navegação para as principais seções do site',
      of: [
        {
          type: 'reference',
          to: [{ type: 'featureCard' }],
        },
      ],
      validation: (Rule) => Rule.required().min(2).max(6),
    }),

    // Show Highlights
    defineField({
      name: 'showHighlights',
      title: 'Mostrar Destaques',
      type: 'boolean',
      description: 'Exibir seção de destaques adicionais abaixo dos cards',
      initialValue: true,
    }),

    // Highlights Title
    defineField({
      name: 'highlightsTitle',
      title: 'Título dos Destaques',
      type: 'string',
      description: 'Título da seção de destaques (se habilitada)',
      placeholder: 'Por que você não pode perder',
      initialValue: 'Por que você não pode perder',
      hidden: ({ parent }) => !parent?.showHighlights,
    }),

    // Highlights List
    defineField({
      name: 'highlights',
      title: 'Lista de Destaques',
      type: 'array',
      description: 'Lista de destaques do casamento',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Texto',
              type: 'string',
              validation: (Rule) => Rule.required().max(100),
            },
            {
              name: 'icon',
              title: 'Ícone',
              type: 'string',
              description: 'Nome do ícone do Lucide React',
              options: {
                list: [
                  { title: '✓ Check', value: 'Check' },
                  { title: '★ Star', value: 'Star' },
                  { title: '❤️ Heart', value: 'Heart' },
                  { title: '🎵 Music', value: 'Music' },
                  { title: '🍽️ Utensils', value: 'Utensils' },
                  { title: '🎉 Sparkles', value: 'Sparkles' },
                ],
              },
              initialValue: 'Check',
            },
          ],
          preview: {
            select: {
              text: 'text',
              icon: 'icon',
            },
            prepare({ text, icon }) {
              return {
                title: text,
                subtitle: `Ícone: ${icon}`,
              }
            },
          },
        },
      ],
      validation: (Rule) =>
        Rule.custom((highlights, context) => {
          const parent = context.parent as { showHighlights?: boolean }
          if (parent?.showHighlights && (!highlights || highlights.length === 0)) {
            return 'Adicione pelo menos um destaque quando a seção estiver habilitada'
          }
          return true
        }),
      hidden: ({ parent }) => !parent?.showHighlights,
    }),

    // Layout Option
    defineField({
      name: 'layout',
      title: 'Layout dos Cards',
      type: 'string',
      description: 'Como dispor os feature cards',
      options: {
        list: [
          { title: 'Grid 2x2', value: 'grid-2x2' },
          { title: 'Grid 3 Colunas', value: 'grid-3col' },
          { title: 'Grid 4 Colunas', value: 'grid-4col' },
        ],
      },
      initialValue: 'grid-2x2',
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
      cards: 'featureCards',
      showHighlights: 'showHighlights',
    },
    prepare({ title, cards, showHighlights }) {
      const cardCount = Array.isArray(cards) ? cards.length : 0
      const features = [`${cardCount} cards`]
      if (showHighlights) features.push('Com destaques')

      return {
        title: `Recursos: ${title}`,
        subtitle: features.join(' | '),
      }
    },
  },
})
