/**
 * Pet Schema
 *
 * Individual pet profiles for the "Nossa Família" section.
 * Reusable documents that can be referenced by multiple sections.
 */

import { defineType, defineField } from 'sanity'
import { Dog } from 'lucide-react'

export default defineType({
  name: 'pet',
  title: 'Pets',
  type: 'document',
  icon: Dog,

  fields: [
    defineField({
      name: 'name',
      title: 'Nome',
      type: 'string',
      description: 'Nome do pet',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL amigável (gerado automaticamente)',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'photo',
      title: 'Foto',
      type: 'image',
      description: 'Foto principal do pet',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
      fields: [
        {
          name: 'alt',
          title: 'Texto Alternativo',
          type: 'string',
          description: 'Descrição da imagem para acessibilidade',
        },
      ],
    }),

    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 3,
      description: 'Descrição curta do pet (personalidade, curiosidades)',
      validation: (Rule) => Rule.required().max(200),
    }),

    defineField({
      name: 'role',
      title: 'Função',
      type: 'string',
      description: 'Ex: "A Matriarca", "O Caçula", "O Dramático"',
    }),

    defineField({
      name: 'breed',
      title: 'Raça',
      type: 'string',
      description: 'Raça do pet (opcional)',
    }),

    defineField({
      name: 'adoptionDate',
      title: 'Data de Adoção',
      type: 'date',
      description: 'Quando o pet entrou para a família',
    }),

    defineField({
      name: 'displayOrder',
      title: 'Ordem de Exibição',
      type: 'number',
      description: 'Ordem em que aparece na seção (1, 2, 3, 4)',
      validation: (Rule) => Rule.required().min(1),
    }),

    defineField({
      name: 'isVisible',
      title: 'Visível',
      type: 'boolean',
      description: 'Exibir este pet no site',
      initialValue: true,
    }),
  ],

  orderings: [
    {
      title: 'Ordem de Exibição',
      name: 'displayOrder',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
    {
      title: 'Nome',
      name: 'name',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'photo',
      order: 'displayOrder',
    },
    prepare({ title, subtitle, media, order }) {
      return {
        title: `${order}. ${title}`,
        subtitle,
        media,
      }
    },
  },
})
