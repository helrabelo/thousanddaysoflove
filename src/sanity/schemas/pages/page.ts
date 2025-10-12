/**
 * Page Schema
 *
 * Generic page type for all other pages (Historia, Detalhes, etc.).
 * Allows flexible composition of sections.
 */

import { defineType, defineField } from 'sanity'
import { FileText } from 'lucide-react'

export default defineType({
  name: 'page',
  title: 'Páginas',
  type: 'document',
  icon: FileText,

  fields: [
    defineField({
      name: 'title',
      title: 'Título da Página',
      type: 'string',
      description: 'Título exibido no navegador e SEO',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      description: 'URL da página (ex: historia, detalhes)',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) =>
        Rule.required().custom((slug) => {
          if (slug?.current === 'index' || slug?.current === 'home') {
            return 'Use "homePage" para a homepage'
          }
          return true
        }),
    }),

    // Hero Section
    defineField({
      name: 'hero',
      title: 'Hero da Página',
      type: 'object',
      description: 'Cabeçalho da página',
      options: {
        collapsible: true,
      },
      fields: [
        {
          name: 'showHero',
          title: 'Mostrar Hero',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'title',
          title: 'Título',
          type: 'string',
        },
        {
          name: 'subtitle',
          title: 'Subtítulo',
          type: 'text',
          rows: 2,
        },
        {
          name: 'backgroundImage',
          title: 'Imagem de Fundo',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    }),

    // SEO
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      description: 'Configurações de SEO (sobrescreve configurações globais)',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        {
          name: 'title',
          title: 'Título SEO',
          type: 'string',
          description: 'Deixe vazio para usar o título da página',
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
        {
          name: 'noIndex',
          title: 'Não Indexar',
          type: 'boolean',
          description: 'Impedir que Google indexe esta página',
          initialValue: false,
        },
      ],
    }),

    // Page Sections
    defineField({
      name: 'sections',
      title: 'Seções da Página',
      type: 'array',
      description: 'Componha a página arrastando seções',
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
    }),

    // Publishing
    defineField({
      name: 'isPublished',
      title: 'Publicada',
      type: 'boolean',
      description: 'Tornar esta página visível no site',
      initialValue: false,
    }),
  ],

  orderings: [
    {
      title: 'Título',
      name: 'title',
      by: [{ field: 'title', direction: 'asc' }],
    },
    {
      title: 'Atualização',
      name: 'updatedAt',
      by: [{ field: '_updatedAt', direction: 'desc' }],
    },
  ],

  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      sections: 'sections',
      published: 'isPublished',
    },
    prepare({ title, slug, sections, published }) {
      return {
        title: published ? title : `[RASCUNHO] ${title}`,
        subtitle: `/${slug} • ${sections?.length || 0} seções`,
      }
    },
  },
})
