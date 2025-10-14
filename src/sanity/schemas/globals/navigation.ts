/**
 * Navigation Schema
 *
 * Global singleton for site navigation menu.
 * Manages header navigation links and mobile menu.
 */

import { defineType, defineField, SchemaTypeDefinition } from 'sanity'
import { Menu } from 'lucide-react'

export default defineType({
  name: 'navigation',
  title: 'Navegação',
  type: 'document',
  icon: Menu,

  // Singleton pattern
  __experimental_actions: ['update', 'publish'],

  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      description: 'Nome interno (não visível no site)',
      initialValue: 'Menu Principal',
    }),

    defineField({
      name: 'mainNav',
      title: 'Links do Menu Principal',
      type: 'array',
      description: 'Links exibidos no header',
      of: [
        {
          type: 'object',
          name: 'navItem',
          fields: [
            {
              name: 'label',
              title: 'Texto do Link',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'href',
              title: 'URL',
              type: 'string',
              description: 'URL relativa (ex: /historia) ou âncora (ex: #location)',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'openInNewTab',
              title: 'Abrir em nova aba',
              type: 'boolean',
              initialValue: false,
            },
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'href',
            },
          },
        },
      ],
    }),

    defineField({
      name: 'ctaButton',
      title: 'Botão de Ação (CTA)',
      type: 'object',
      description: 'Botão destacado no menu (ex: "Confirmar Presença")',
      fields: [
        {
          name: 'show',
          title: 'Mostrar Botão',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'label',
          title: 'Texto do Botão',
          type: 'string',
        },
        {
          name: 'href',
          title: 'URL',
          type: 'string',
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: 'title',
      items: 'mainNav',
    },
    prepare({ title, items }) {
      return {
        title,
        subtitle: `${items?.length || 0} links`,
      }
    },
  },
}) satisfies SchemaTypeDefinition
