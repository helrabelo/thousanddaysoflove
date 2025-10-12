/**
 * Our Family Section Schema
 *
 * Showcase the couple's beloved pets.
 * References pet documents for profiles and photos.
 */

import { defineType, defineField } from 'sanity'
import { Dog } from 'lucide-react'

export default defineType({
  name: 'ourFamily',
  title: 'Nossa Família',
  type: 'document',
  icon: Dog,

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
      initialValue: 'Nossa Família',
    }),

    // Section Description
    defineField({
      name: 'sectionDescription',
      title: 'Descrição',
      type: 'text',
      rows: 3,
      description: 'Introdução sobre a família de pets',
      placeholder:
        'Conheça os quatro amores de quatro patas que completam nossa família...',
    }),

    // Pets
    defineField({
      name: 'pets',
      title: 'Pets',
      type: 'array',
      description: 'Perfis dos pets da família',
      of: [
        {
          type: 'reference',
          to: [{ type: 'pet' }],
        },
      ],
      validation: (Rule) => Rule.required().min(1).max(6),
    }),

    // Layout Option
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      description: 'Como exibir os cards dos pets',
      options: {
        list: [
          { title: 'Grid 2x2', value: 'grid-2x2' },
          { title: 'Grid 3 Colunas', value: 'grid-3col' },
          { title: 'Grid 4 Colunas', value: 'grid-4col' },
          { title: 'Carrossel', value: 'carousel' },
        ],
      },
      initialValue: 'grid-2x2',
    }),

    // Show Adoption Dates
    defineField({
      name: 'showAdoptionDates',
      title: 'Mostrar Datas de Adoção',
      type: 'boolean',
      description: 'Exibir quando cada pet foi adotado',
      initialValue: true,
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
      pets: 'pets',
    },
    prepare({ title, description, pets }) {
      const petCount = Array.isArray(pets) ? pets.length : 0

      return {
        title: `Família: ${title}`,
        subtitle: petCount
          ? `${petCount} pet${petCount !== 1 ? 's' : ''}`
          : 'Adicionar pets',
      }
    },
  },
})
