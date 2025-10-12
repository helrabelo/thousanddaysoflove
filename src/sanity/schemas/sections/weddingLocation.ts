/**
 * Wedding Location Section Schema
 *
 * Interactive map and directions to the wedding venue.
 * References weddingSettings for venue details and coordinates.
 */

import { defineType, defineField } from 'sanity'
import { MapPin } from 'lucide-react'

export default defineType({
  name: 'weddingLocation',
  title: 'Localização',
  type: 'document',
  icon: MapPin,

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
      initialValue: 'Como Chegar',
    }),

    // Section Description
    defineField({
      name: 'sectionDescription',
      title: 'Descrição',
      type: 'text',
      rows: 3,
      description: 'Instruções adicionais sobre o local (opcional)',
      placeholder:
        'Estacionamento disponível no local. Recomendamos chegar 15 minutos antes da cerimônia.',
    }),

    // Wedding Settings Reference
    defineField({
      name: 'weddingSettings',
      title: 'Configurações do Casamento',
      type: 'reference',
      to: [{ type: 'weddingSettings' }],
      description: 'Referência para as configurações do casamento (local, endereço, etc.)',
      validation: (Rule) => Rule.required(),
    }),

    // Map Style
    defineField({
      name: 'mapStyle',
      title: 'Estilo do Mapa',
      type: 'string',
      description: 'Estilo visual do Google Maps',
      options: {
        list: [
          { title: 'Padrão', value: 'standard' },
          { title: 'Prata (Elegante)', value: 'silver' },
          { title: 'Retrô', value: 'retro' },
          { title: 'Escuro', value: 'dark' },
        ],
      },
      initialValue: 'silver',
    }),

    // Show Directions
    defineField({
      name: 'showDirections',
      title: 'Mostrar Botão de Direções',
      type: 'boolean',
      description: 'Exibir botão para abrir Google Maps/Waze',
      initialValue: true,
    }),

    // Map Zoom Level
    defineField({
      name: 'mapZoom',
      title: 'Nível de Zoom',
      type: 'number',
      description: 'Nível de zoom inicial do mapa (12-18 recomendado)',
      validation: (Rule) => Rule.min(10).max(20),
      initialValue: 15,
    }),

    // Additional Places
    defineField({
      name: 'nearbyPlaces',
      title: 'Locais Próximos',
      type: 'array',
      description: 'Pontos de referência úteis próximos ao local (hotéis, estacionamentos, etc.)',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Nome',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'type',
              title: 'Tipo',
              type: 'string',
              options: {
                list: [
                  { title: 'Hotel', value: 'hotel' },
                  { title: 'Estacionamento', value: 'parking' },
                  { title: 'Restaurante', value: 'restaurant' },
                  { title: 'Ponto de Referência', value: 'landmark' },
                  { title: 'Transporte', value: 'transport' },
                ],
              },
            },
            {
              name: 'address',
              title: 'Endereço',
              type: 'string',
            },
            {
              name: 'distance',
              title: 'Distância',
              type: 'string',
              description: 'Ex: "500m a pé", "5 min de carro"',
            },
            {
              name: 'url',
              title: 'Link',
              type: 'url',
              description: 'Link para Google Maps ou site do local',
            },
          ],
          preview: {
            select: {
              title: 'name',
              type: 'type',
              distance: 'distance',
            },
            prepare({ title, type, distance }) {
              return {
                title,
                subtitle: `${type}${distance ? ` - ${distance}` : ''}`,
              }
            },
          },
        },
      ],
    }),

    // Transportation Info
    defineField({
      name: 'transportationInfo',
      title: 'Informações de Transporte',
      type: 'object',
      description: 'Detalhes sobre transporte e estacionamento',
      fields: [
        {
          name: 'hasParking',
          title: 'Tem Estacionamento',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'parkingDetails',
          title: 'Detalhes do Estacionamento',
          type: 'text',
          rows: 2,
          description: 'Informações sobre estacionamento (gratuito, pago, vagas, etc.)',
          hidden: ({ parent }) => !parent?.hasParking,
        },
        {
          name: 'publicTransport',
          title: 'Transporte Público',
          type: 'text',
          rows: 2,
          description: 'Instruções de transporte público',
        },
        {
          name: 'valetService',
          title: 'Serviço de Valet',
          type: 'boolean',
          description: 'Local oferece serviço de manobrista',
          initialValue: false,
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
      venue: 'weddingSettings.venueName',
      mapStyle: 'mapStyle',
      nearbyPlaces: 'nearbyPlaces',
    },
    prepare({ title, venue, mapStyle, nearbyPlaces }) {
      const placesCount = Array.isArray(nearbyPlaces) ? nearbyPlaces.length : 0
      const features = [mapStyle || 'padrão']
      if (placesCount > 0) features.push(`${placesCount} locais próximos`)

      return {
        title: `Localização: ${title}`,
        subtitle: venue ? `${venue} | ${features.join(' | ')}` : features.join(' | '),
      }
    },
  },
})
