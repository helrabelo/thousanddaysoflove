/**
 * Feature Card Schema
 *
 * Navigation feature cards for the homepage "Tudo Que Você Precisa" section.
 * Each card represents a key feature/page of the wedding site.
 */

import { defineType, defineField } from 'sanity'
import { LayoutGrid } from 'lucide-react'

// Lucide icon names for selection
const iconOptions = [
  { title: '👥 Users (Confirmação)', value: 'Users' },
  { title: '🎁 Gift (Presentes)', value: 'Gift' },
  { title: '📅 Calendar (Cronograma)', value: 'Calendar' },
  { title: '📍 MapPin (Local)', value: 'MapPin' },
  { title: '❤️ Heart (Coração)', value: 'Heart' },
  { title: '📸 Camera (Galeria)', value: 'Camera' },
  { title: '📖 Book (História)', value: 'Book' },
  { title: '🏠 Home (Casa)', value: 'Home' },
  { title: '✉️ Mail (Contato)', value: 'Mail' },
]

export default defineType({
  name: 'featureCard',
  title: 'Feature Cards',
  type: 'document',
  icon: LayoutGrid,

  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      description: 'Título do card (ex: "Confirmação")',
      validation: (Rule) => Rule.required().max(100),
    }),

    defineField({
      name: 'description',
      title: 'Descrição',
      type: 'text',
      rows: 3,
      description: 'Descrição curta (100-150 caracteres)',
      validation: (Rule) => Rule.required().max(200),
    }),

    defineField({
      name: 'icon',
      title: 'Ícone',
      type: 'string',
      description: 'Ícone do Lucide React',
      options: {
        list: iconOptions,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'linkUrl',
      title: 'Link (URL)',
      type: 'string',
      description: 'URL relativa (ex: /rsvp) ou âncora (ex: #timeline)',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'linkText',
      title: 'Texto do Link',
      type: 'string',
      description: 'Texto do botão (deixe vazio para "Saiba Mais")',
      placeholder: 'Saiba Mais',
    }),

    defineField({
      name: 'displayOrder',
      title: 'Ordem de Exibição',
      type: 'number',
      description: 'Ordem no grid (1-4)',
      validation: (Rule) => Rule.required().min(1).max(4),
    }),

    defineField({
      name: 'isVisible',
      title: 'Visível',
      type: 'boolean',
      description: 'Exibir este card no site',
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
      subtitle: 'linkUrl',
      order: 'displayOrder',
    },
    prepare({ title, subtitle, order }) {
      return {
        title: `${order}. ${title}`,
        subtitle,
      }
    },
  },
})
