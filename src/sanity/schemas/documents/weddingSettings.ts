/**
 * Wedding Settings Schema
 *
 * Core wedding event configuration (date, time, venue, etc.).
 * Singleton document referenced by multiple sections.
 */

import { defineType, defineField, SchemaTypeDefinition } from 'sanity'
import { Church } from 'lucide-react'

export default defineType({
  name: 'weddingSettings',
  title: 'Configurações do Casamento',
  type: 'document',
  icon: Church,

  // Singleton pattern
  __experimental_actions: ['update', 'publish'],

  fields: [
    // Couple Names
    defineField({
      name: 'brideName',
      title: 'Nome da Noiva',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'groomName',
      title: 'Nome do Noivo',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    // Wedding Date & Time
    defineField({
      name: 'weddingDate',
      title: 'Data do Casamento',
      type: 'date',
      description: 'Data da cerimônia',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'weddingTime',
      title: 'Horário da Cerimônia',
      type: 'string',
      description: 'Ex: 10:30',
      placeholder: '10:30',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'receptionTime',
      title: 'Horário da Recepção',
      type: 'string',
      description: 'Ex: 12:00 (opcional)',
      placeholder: '12:00',
    }),

    defineField({
      name: 'timezone',
      title: 'Fuso Horário',
      type: 'string',
      description: 'Ex: America/Sao_Paulo',
      initialValue: 'America/Sao_Paulo',
    }),

    // Venue Information
    defineField({
      name: 'venueName',
      title: 'Nome do Local',
      type: 'string',
      description: 'Nome da igreja/espaço (ex: "Constable Galerie")',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'venueAddress',
      title: 'Endereço Completo',
      type: 'text',
      rows: 2,
      description: 'Endereço completo do local',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'venueCity',
      title: 'Cidade/Bairro',
      type: 'string',
      description: 'Ex: "Rio de Janeiro" ou "Jardim Botânico"',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'venueState',
      title: 'Estado',
      type: 'string',
      description: 'Ex: "RJ"',
    }),

    defineField({
      name: 'venueZip',
      title: 'CEP',
      type: 'string',
      description: 'CEP do local',
    }),

    // Google Maps
    defineField({
      name: 'venueLocation',
      title: 'Localização (Google Maps)',
      type: 'object',
      description: 'Coordenadas para mapa',
      fields: [
        {
          name: 'lat',
          title: 'Latitude',
          type: 'number',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'lng',
          title: 'Longitude',
          type: 'number',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'placeId',
          title: 'Google Maps Place ID',
          type: 'string',
          description: 'ID do lugar no Google Maps (opcional)',
        },
      ],
    }),

    // Dress Code
    defineField({
      name: 'dressCode',
      title: 'Dress Code',
      type: 'string',
      description: 'Ex: "Traje Esporte Fino"',
    }),

    defineField({
      name: 'dressCodeDescription',
      title: 'Descrição do Dress Code',
      type: 'text',
      rows: 2,
      description: 'Orientações detalhadas sobre o traje',
    }),

    // RSVP
    defineField({
      name: 'rsvpDeadline',
      title: 'Prazo para Confirmação',
      type: 'date',
      description: 'Data limite para RSVP',
    }),

    defineField({
      name: 'guestLimit',
      title: 'Limite de Convidados',
      type: 'number',
      description: 'Número máximo de convidados (opcional)',
    }),
  ],

  preview: {
    select: {
      bride: 'brideName',
      groom: 'groomName',
      date: 'weddingDate',
      venue: 'venueName',
    },
    prepare({ bride, groom, date, venue }) {
      return {
        title: `${bride} & ${groom}`,
        subtitle: `${new Date(date).toLocaleDateString('pt-BR')} - ${venue}`,
      }
    },
  },
}) satisfies SchemaTypeDefinition
