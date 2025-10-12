/**
 * Home Page Schema
 *
 * Special singleton page for the homepage (/).
 * Composes sections in a specific order.
 */

import { defineType, defineField } from 'sanity'
import { Home } from 'lucide-react'

export default defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  icon: Home,

  // Singleton pattern
  __experimental_actions: ['update', 'publish'],

  fields: [
    defineField({
      name: 'title',
      title: 'Título Interno',
      type: 'string',
      description: 'Nome da página (apenas para organização)',
      initialValue: 'Homepage',
    }),

    // SEO
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      description: 'Meta tags específicas da homepage (sobrescreve SEO global)',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        {
          name: 'title',
          title: 'Título SEO',
          type: 'string',
          description: 'Deixe vazio para usar título padrão',
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
          description: 'Imagem para compartilhamento (1200x630px)',
        },
      ],
    }),

    // Page Sections
    defineField({
      name: 'sections',
      title: 'Seções da Página',
      type: 'array',
      description: 'Arraste para reordenar as seções',
      of: [
        {
          type: 'reference',
          to: [
            { type: 'videoHero' },
            { type: 'eventDetails' },
            { type: 'storyPreview' },
            { type: 'aboutUs' },
            { type: 'ourFamily' },
            { type: 'quickPreview' },
            { type: 'weddingLocation' },
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],

  preview: {
    select: {
      sections: 'sections',
    },
    prepare({ sections }) {
      return {
        title: 'Homepage',
        subtitle: `${sections?.length || 0} seções`,
      }
    },
  },
})
