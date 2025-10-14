/**
 * SEO Settings Schema
 *
 * Global singleton for default SEO and metadata configuration.
 * Individual pages can override these defaults.
 */

import { defineType, defineField, SchemaTypeDefinition } from 'sanity'
import { Search } from 'lucide-react'

export default defineType({
  name: 'seoSettings',
  title: 'Configurações de SEO',
  type: 'document',
  icon: Search,

  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      description: 'Nome interno (não visível no site)',
      initialValue: 'SEO Padrão',
    }),

    defineField({
      name: 'defaultTitle',
      title: 'Título Padrão',
      type: 'string',
      description: 'Título padrão para páginas sem título específico',
      validation: (Rule) => Rule.required().max(60),
    }),

    defineField({
      name: 'titleTemplate',
      title: 'Template de Título',
      type: 'string',
      description: 'Ex: "%s | Thousand Days of Love" - %s será substituído pelo título da página',
      initialValue: '%s | Thousand Days of Love',
    }),

    defineField({
      name: 'defaultDescription',
      title: 'Descrição Padrão',
      type: 'text',
      rows: 3,
      description: 'Meta description padrão (150-160 caracteres)',
      validation: (Rule) => Rule.required().max(160),
    }),

    defineField({
      name: 'keywords',
      title: 'Palavras-chave',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Palavras-chave principais do site',
      options: {
        layout: 'tags',
      },
    }),

    defineField({
      name: 'openGraph',
      title: 'Open Graph (Redes Sociais)',
      type: 'object',
      description: 'Configurações para compartilhamento em redes sociais',
      fields: [
        {
          name: 'siteName',
          title: 'Nome do Site',
          type: 'string',
          description: 'Nome exibido em compartilhamentos',
        },
        {
          name: 'locale',
          title: 'Idioma',
          type: 'string',
          initialValue: 'pt_BR',
        },
        {
          name: 'type',
          title: 'Tipo',
          type: 'string',
          options: {
            list: [
              { title: 'Website', value: 'website' },
              { title: 'Article', value: 'article' },
            ],
          },
          initialValue: 'website',
        },
      ],
    }),

    defineField({
      name: 'twitter',
      title: 'Twitter/X',
      type: 'object',
      description: 'Configurações para Twitter Cards',
      fields: [
        {
          name: 'handle',
          title: 'Handle do Twitter',
          type: 'string',
          description: '@username (opcional)',
        },
        {
          name: 'cardType',
          title: 'Tipo de Card',
          type: 'string',
          options: {
            list: [
              { title: 'Summary', value: 'summary' },
              { title: 'Summary Large Image', value: 'summary_large_image' },
            ],
          },
          initialValue: 'summary_large_image',
        },
      ],
    }),

    defineField({
      name: 'robotsIndex',
      title: 'Permitir Indexação',
      type: 'boolean',
      description: 'Permitir que Google e outros buscadores indexem o site',
      initialValue: true,
    }),
  ],

  preview: {
    select: {
      title: 'defaultTitle',
      subtitle: 'defaultDescription',
    },
  },
}) satisfies SchemaTypeDefinition
