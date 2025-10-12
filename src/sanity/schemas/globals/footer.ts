/**
 * Footer Schema
 *
 * Global singleton for site footer configuration.
 */

import { defineType, defineField } from 'sanity'
import { PanelBottom } from 'lucide-react'

export default defineType({
  name: 'footer',
  title: 'Rodapé',
  type: 'document',
  icon: PanelBottom,

  // Singleton pattern
  __experimental_actions: ['update', 'publish'],

  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      description: 'Nome interno (não visível no site)',
      initialValue: 'Rodapé',
    }),

    defineField({
      name: 'copyrightText',
      title: 'Texto de Copyright',
      type: 'string',
      description: 'Ex: "© 2025 Hel & Ylana. Todos os direitos reservados."',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'footerLinks',
      title: 'Links do Rodapé',
      type: 'array',
      description: 'Links rápidos exibidos no rodapé',
      of: [
        {
          type: 'object',
          name: 'footerLink',
          fields: [
            {
              name: 'label',
              title: 'Texto',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'href',
              title: 'URL',
              type: 'string',
              validation: (Rule) => Rule.required(),
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
      name: 'socialLinks',
      title: 'Redes Sociais',
      type: 'object',
      description: 'Links para redes sociais do casal',
      fields: [
        {
          name: 'instagram',
          title: 'Instagram',
          type: 'url',
          description: 'URL completa (https://instagram.com/...)',
        },
        {
          name: 'whatsapp',
          title: 'WhatsApp',
          type: 'string',
          description: 'Número com código do país (ex: 5521999999999)',
        },
      ],
    }),

    defineField({
      name: 'showPoweredBy',
      title: 'Mostrar "Desenvolvido com ♥"',
      type: 'boolean',
      description: 'Exibir crédito de desenvolvimento',
      initialValue: true,
    }),
  ],

  preview: {
    select: {
      title: 'title',
      copyright: 'copyrightText',
    },
    prepare({ title, copyright }) {
      return {
        title,
        subtitle: copyright,
      }
    },
  },
})
