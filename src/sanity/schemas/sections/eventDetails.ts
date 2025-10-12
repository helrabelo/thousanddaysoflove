/**
 * Event Details Section Schema
 *
 * Displays wedding countdown timer, event details, and dress code.
 * References weddingSettings singleton for all event data.
 */

import { defineType, defineField } from 'sanity'
import { Calendar } from 'lucide-react'

export default defineType({
  name: 'eventDetails',
  title: 'Detalhes do Evento',
  type: 'document',
  icon: Calendar,

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
      initialValue: 'Faltam Apenas',
    }),

    // Wedding Settings Reference
    defineField({
      name: 'weddingSettings',
      title: 'Configurações do Casamento',
      type: 'reference',
      to: [{ type: 'weddingSettings' }],
      description: 'Referência para as configurações do casamento (data, local, etc.)',
      validation: (Rule) => Rule.required(),
    }),

    // Show Countdown
    defineField({
      name: 'showCountdown',
      title: 'Mostrar Contador',
      type: 'boolean',
      description: 'Exibir contador regressivo até o casamento',
      initialValue: true,
    }),

    // Show Event Details
    defineField({
      name: 'showEventDetails',
      title: 'Mostrar Detalhes do Evento',
      type: 'boolean',
      description: 'Exibir data, horário e local',
      initialValue: true,
    }),

    // Show Dress Code
    defineField({
      name: 'showDressCode',
      title: 'Mostrar Dress Code',
      type: 'boolean',
      description: 'Exibir informações sobre o traje',
      initialValue: true,
    }),

    // Custom Content (Optional)
    defineField({
      name: 'additionalContent',
      title: 'Conteúdo Adicional',
      type: 'text',
      rows: 3,
      description: 'Texto adicional a ser exibido nesta seção (opcional)',
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
      weddingSettings: 'weddingSettings.brideName',
      showCountdown: 'showCountdown',
      showDressCode: 'showDressCode',
    },
    prepare({ title, weddingSettings, showCountdown, showDressCode }) {
      const features = []
      if (showCountdown) features.push('Contador')
      if (showDressCode) features.push('Dress Code')

      return {
        title: `Detalhes: ${title}`,
        subtitle: features.length ? features.join(' + ') : 'Configurar opções',
      }
    },
  },
})
