/**
 * Story Preview Section Schema
 *
 * Timeline preview of the couple's story with key moments.
 * Displays proposal photo and story cards in chronological order.
 */

import { defineType, defineField } from 'sanity'
import { Heart } from 'lucide-react'

export default defineType({
  name: 'storyPreview',
  title: 'Nossa História (Preview)',
  type: 'document',
  icon: Heart,

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
      initialValue: 'Nossa História',
    }),

    // Section Description
    defineField({
      name: 'sectionDescription',
      title: 'Descrição',
      type: 'text',
      rows: 3,
      description: 'Introdução da seção (opcional)',
      placeholder: 'Dos mil dias do nosso amor...',
    }),

    // Proposal Photo
    defineField({
      name: 'proposalPhoto',
      title: 'Foto do Pedido',
      type: 'image',
      description: 'Foto destacada do pedido de casamento',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Texto Alternativo',
          type: 'string',
          description: 'Descrição da imagem para acessibilidade',
        },
        {
          name: 'caption',
          title: 'Legenda',
          type: 'string',
          description: 'Legenda da foto (opcional)',
          placeholder: 'O momento mais especial das nossas vidas',
        },
      ],
    }),

    // Story Cards
    defineField({
      name: 'storyCards',
      title: 'Cards da História',
      type: 'array',
      description: 'Momentos-chave da jornada do casal',
      of: [
        {
          type: 'reference',
          to: [{ type: 'storyCard' }],
        },
      ],
      validation: (Rule) => Rule.required().min(1).max(6),
    }),

    // CTA Button
    defineField({
      name: 'ctaButton',
      title: 'Botão de Ação',
      type: 'object',
      description: 'Botão para página completa da história (opcional)',
      fields: [
        {
          name: 'label',
          title: 'Texto do Botão',
          type: 'string',
          placeholder: 'Ver História Completa',
          initialValue: 'Ver História Completa',
        },
        {
          name: 'href',
          title: 'Link',
          type: 'string',
          description: 'URL relativa (ex: /nossa-historia)',
          placeholder: '/nossa-historia',
          initialValue: '/nossa-historia',
        },
      ],
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
      media: 'proposalPhoto',
      cardsCount: 'storyCards',
    },
    prepare({ title, description, media, cardsCount }) {
      const count = Array.isArray(cardsCount) ? cardsCount.length : 0
      return {
        title: `História: ${title}`,
        subtitle: count ? `${count} momentos` : 'Adicionar momentos',
        media,
      }
    },
  },
})
