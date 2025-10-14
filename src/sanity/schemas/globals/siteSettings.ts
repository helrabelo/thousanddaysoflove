/**
 * Site Settings Schema
 *
 * Global singleton for site-wide configuration.
 * Only one document of this type can exist.
 */

import { defineType, defineField, SchemaTypeDefinition } from 'sanity'
import { Cog } from 'lucide-react'

export default defineType({
  name: 'siteSettings',
  title: 'Configurações do Site',
  type: 'document',
  icon: Cog,

  // Singleton pattern - only one document allowed
  __experimental_actions: ['update', 'publish' /* 'create', 'delete' */],

  fields: [
    defineField({
      name: 'title',
      title: 'Nome do Site',
      type: 'string',
      description: 'Nome principal do site (Thousand Days of Love)',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Descrição',
      type: 'text',
      rows: 3,
      description: 'Descrição curta do site para SEO',
    }),

    defineField({
      name: 'url',
      title: 'URL do Site',
      type: 'url',
      description: 'URL completa (https://thousanddaysof.love)',
      validation: (Rule) => Rule.required().uri({ scheme: ['https'] }),
    }),

    defineField({
      name: 'ogImage',
      title: 'Imagem de Compartilhamento (Open Graph)',
      type: 'image',
      description: 'Imagem padrão para redes sociais (1200x630px)',
      options: {
        hotspot: true,
      },
    }),

    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      description: 'Ícone do site (32x32px ou maior)',
    }),

    // Design Tokens
    defineField({
      name: 'designTokens',
      title: 'Design Tokens',
      type: 'object',
      description: 'Configurações visuais globais',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        {
          name: 'primaryColor',
          title: 'Cor Principal',
          type: 'string',
          description: 'Cor decorativa (#A8A8A8)',
        },
        {
          name: 'accentColor',
          title: 'Cor de Destaque',
          type: 'string',
          description: 'Cor de fundo (#E8E6E3)',
        },
        {
          name: 'backgroundColor',
          title: 'Cor de Fundo',
          type: 'string',
          description: 'Cor de fundo principal (#F8F6F3)',
        },
      ],
    }),

    // Analytics
    defineField({
      name: 'gtmId',
      title: 'Google Tag Manager ID',
      type: 'string',
      description: 'GTM-XXXXXXX (opcional)',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'url',
    },
  },
}) satisfies SchemaTypeDefinition
