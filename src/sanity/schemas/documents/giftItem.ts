import { defineField, defineType } from 'sanity'
import { GiftIcon } from '@sanity/icons'

export const giftItem = defineType({
  name: 'giftItem',
  title: 'Presente',
  type: 'document',
  icon: GiftIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Nome do Presente',
      type: 'string',
      validation: (Rule) => Rule.required().min(3).max(100),
      description: 'Nome do presente (ex: "Jogo de Panelas Tramontina")',
    }),
    defineField({
      name: 'description',
      title: 'Descrição',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().min(10).max(500),
      description: 'Descrição detalhada do presente e por que vocês querem ele',
    }),
    defineField({
      name: 'fullPrice',
      title: 'Preço Total (R$)',
      type: 'number',
      validation: (Rule) =>
        Rule.required().positive().min(50).custom((value) => {
          if (value && value % 1 !== 0) {
            return 'Use valores inteiros (sem centavos)'
          }
          return true
        }),
      description: 'Valor total do presente em reais (mínimo R$50)',
    }),
    defineField({
      name: 'image',
      title: 'Foto do Presente',
      type: 'image',
      options: {
        hotspot: true,
        metadata: ['lqip', 'palette'],
      },
      validation: (Rule) => Rule.required(),
      description: 'Foto do presente (será otimizada automaticamente)',
    }),
    defineField({
      name: 'category',
      title: 'Categoria',
      type: 'string',
      options: {
        list: [
          { title: 'Cozinha', value: 'kitchen' },
          { title: 'Sala de Estar', value: 'living-room' },
          { title: 'Quarto', value: 'bedroom' },
          { title: 'Banheiro', value: 'bathroom' },
          { title: 'Eletrônicos', value: 'electronics' },
          { title: 'Decoração', value: 'decor' },
          { title: 'Lua de Mel', value: 'honeymoon' },
          { title: 'Outros', value: 'other' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
      description: 'Categoria do presente para organização',
    }),
    defineField({
      name: 'allowPartialPayment',
      title: 'Permitir Pagamento Parcial',
      type: 'boolean',
      initialValue: true,
      description:
        'Se ativado, várias pessoas podem contribuir com valores diferentes para o mesmo presente',
    }),
    defineField({
      name: 'suggestedContributions',
      title: 'Contribuições Sugeridas (R$)',
      type: 'array',
      of: [{ type: 'number' }],
      initialValue: [100, 250, 500, 1000],
      validation: (Rule) =>
        Rule.custom((values) => {
          if (!values || values.length === 0) return true
          const hasNegative = values.some((v) => (v as number) <= 0)
          if (hasNegative) {
            return 'Todos os valores devem ser positivos'
          }
          const hasDecimals = values.some((v) => (v as number) % 1 !== 0)
          if (hasDecimals) {
            return 'Use apenas valores inteiros (sem centavos)'
          }
          return true
        }),
      description:
        'Valores sugeridos para contribuição (mínimo recomendado: R$50). Deixe vazio para usar padrão [100, 250, 500, 1000]',
      hidden: ({ parent }) => !parent?.allowPartialPayment,
    }),
    defineField({
      name: 'allowCustomAmount',
      title: 'Permitir Valor Personalizado',
      type: 'boolean',
      initialValue: true,
      description:
        'Se ativado, o convidado pode escolher um valor diferente dos sugeridos',
      hidden: ({ parent }) => !parent?.allowPartialPayment,
    }),
    defineField({
      name: 'priority',
      title: 'Prioridade',
      type: 'string',
      options: {
        list: [
          { title: '⭐⭐⭐ Alta (muito importante)', value: 'high' },
          { title: '⭐⭐ Média (gostaríamos de ter)', value: 'medium' },
          { title: '⭐ Baixa (seria legal)', value: 'low' },
        ],
        layout: 'radio',
      },
      initialValue: 'medium',
      validation: (Rule) => Rule.required(),
      description: 'Prioridade do presente para ajudar convidados a escolherem',
    }),
    defineField({
      name: 'isActive',
      title: 'Ativo na Lista de Presentes',
      type: 'boolean',
      initialValue: true,
      description:
        'Se desativado, o presente não aparecerá na lista pública (útil para ocultar presentes já comprados)',
    }),
    defineField({
      name: 'storeUrl',
      title: 'Link da Loja (opcional)',
      type: 'url',
      description:
        'Link para o produto na loja online (apenas para referência, não será exibido publicamente)',
    }),
    defineField({
      name: 'notes',
      title: 'Notas Internas (opcional)',
      type: 'text',
      rows: 3,
      description:
        'Notas privadas sobre o presente (não visível para convidados)',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      price: 'fullPrice',
      media: 'image',
      category: 'category',
      isActive: 'isActive',
      allowPartial: 'allowPartialPayment',
    },
    prepare(selection) {
      const { title, price, media, category, isActive, allowPartial } =
        selection

      // Category labels
      const categoryLabels: Record<string, string> = {
        kitchen: 'Cozinha',
        'living-room': 'Sala',
        bedroom: 'Quarto',
        bathroom: 'Banheiro',
        electronics: 'Eletrônicos',
        decor: 'Decoração',
        honeymoon: 'Lua de Mel',
        other: 'Outros',
      }

      const categoryLabel = categoryLabels[category] || category
      const partialLabel = allowPartial ? '(Parcial OK)' : '(Valor Total)'
      const activeLabel = isActive ? '' : '🚫 '

      return {
        title: `${activeLabel}${title}`,
        subtitle: `R$ ${price?.toLocaleString('pt-BR') || 0} • ${categoryLabel} ${partialLabel}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Preço (maior → menor)',
      name: 'priceDesc',
      by: [{ field: 'fullPrice', direction: 'desc' }],
    },
    {
      title: 'Preço (menor → maior)',
      name: 'priceAsc',
      by: [{ field: 'fullPrice', direction: 'asc' }],
    },
    {
      title: 'Prioridade (alta → baixa)',
      name: 'priorityDesc',
      by: [{ field: 'priority', direction: 'asc' }], // 'high' < 'low' alphabetically
    },
    {
      title: 'Nome (A → Z)',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
    {
      title: 'Categoria',
      name: 'category',
      by: [{ field: 'category', direction: 'asc' }],
    },
  ],
})
