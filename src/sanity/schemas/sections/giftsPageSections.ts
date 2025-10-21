/**
 * Gifts Page Sections Schema
 *
 * Manages the header and footer sections of the gifts/presentes page.
 * Includes hero message, footer CTA, and project render gallery.
 */

import { defineType, defineField } from 'sanity'
import { Gift } from 'lucide-react'

export default defineType({
  name: 'giftsPageSections',
  title: 'Página de Presentes - Seções',
  type: 'document',
  icon: Gift,

  fields: [
    // ========================================
    // HEADER SECTION
    // ========================================
    defineField({
      name: 'headerTitle',
      title: 'Título Principal',
      type: 'string',
      description: 'Título do cabeçalho da página de presentes',
      validation: (Rule) => Rule.required(),
      initialValue: 'Presentes? A Gente Só Quer Você Lá',
    }),

    defineField({
      name: 'headerContent',
      title: 'Mensagem Principal',
      type: 'text',
      description: 'Texto principal explicando a filosofia de presentes (voz casual e autêntica)',
      rows: 10,
      validation: (Rule) => Rule.required(),
      initialValue: `Deus nos deu muita coisa. Saúde. Família. Trabalho. Esse apartamento que o Hel passava de bicicleta sonhando. Sinceramente? A gente não precisa de nada. Só de você lá dia 20 de novembro.

Mas a gente sabe. Tem gente que faz questão. Que quer materializar o carinho de algum jeito.

Então... a gente tá finalmente (finalmente!) reformando esse apê. Tava meio inacabado desde que a gente se mudou. Agora vai virar nosso lar de verdade. Pra sempre. Família de 6 (contando Linda 👑, Cacao 🍫, Olivia 🌸 e Oliver ⚡).

Se quiser contribuir pro nosso cantinho - uma TV, um sofá, lua de mel, decoração - a gente abraça e agradece o gesto. De coração.`,
    }),

    // ========================================
    // PROJECT RENDER GALLERY
    // ========================================
    defineField({
      name: 'showProjectGallery',
      title: 'Exibir Galeria do Projeto',
      type: 'boolean',
      description: 'Mostrar seção com renders do projeto de reforma',
      initialValue: true,
    }),

    defineField({
      name: 'projectGalleryTitle',
      title: 'Título da Galeria de Renders',
      type: 'string',
      description: 'Título da seção de renders do projeto',
      initialValue: 'O Projeto do Nosso Lar',
      hidden: ({ document }) => !document?.showProjectGallery,
    }),

    defineField({
      name: 'projectGalleryDescription',
      title: 'Descrição da Galeria',
      type: 'text',
      description: 'Texto explicativo sobre o projeto de reforma',
      rows: 3,
      initialValue: 'Esse apartamento que tava meio largado? Agora vira nosso lar de verdade. Veja como vai ficar depois da reforma.',
      hidden: ({ document }) => !document?.showProjectGallery,
    }),

    defineField({
      name: 'projectRenders',
      title: 'Renders do Projeto',
      type: 'array',
      description: 'Imagens do projeto de reforma (antes/depois, renders 3D, etc.)',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'title',
              title: 'Título',
              type: 'string',
              description: 'Ex: "Sala de Estar - Render 3D"',
            },
            {
              name: 'alt',
              title: 'Texto Alternativo',
              type: 'string',
              description: 'Descrição da imagem para acessibilidade',
            },
            {
              name: 'caption',
              title: 'Legenda',
              type: 'text',
              description: 'Descrição do que mudou ou detalhes do projeto',
              rows: 2,
            },
            {
              name: 'renderType',
              title: 'Tipo de Render',
              type: 'string',
              options: {
                list: [
                  { title: 'Antes da Reforma', value: 'before' },
                  { title: 'Depois da Reforma (Render)', value: 'after' },
                  { title: 'Render 3D', value: '3d-render' },
                  { title: 'Planta Baixa', value: 'floor-plan' },
                  { title: 'Detalhe', value: 'detail' },
                ],
              },
              initialValue: '3d-render',
            },
            {
              name: 'displayOrder',
              title: 'Ordem de Exibição',
              type: 'number',
              description: 'Ordem de aparição (menor número aparece primeiro)',
              initialValue: 0,
            },
          ],
        },
      ],
      validation: (Rule) => Rule.max(20),
      hidden: ({ document }) => !document?.showProjectGallery,
    }),

    // ========================================
    // FOOTER CTA SECTION
    // ========================================
    defineField({
      name: 'footerTitle',
      title: 'Título do Footer',
      type: 'string',
      description: 'Título da seção final de agradecimento',
      validation: (Rule) => Rule.required(),
      initialValue: 'Obrigado Por Se Importar (Mas Principalmente Por Estar Lá!)',
    }),

    defineField({
      name: 'footerContent',
      title: 'Mensagem de Agradecimento',
      type: 'text',
      description: 'Texto final explicando shares, opções de presente e agradecimento',
      rows: 8,
      validation: (Rule) => Rule.required(),
      initialValue: `Tem item grande? A gente divide em pedacinhos (aquela TV de R$10.000 vira cotas de R$100, R$250, R$500 - ou o valor que você quiser, mínimo R$50). Tem também contribuição pra lua de mel, decoração, aquelas coisinhas que transformam casa em lar.

Cada gesto ajuda a fazer desse apartamento (que tava meio largado) nosso cantinho de verdade. Os 4 cachorros barulhentos também agradecem.

Mas pra gente, o presente maior é você lá. Casa HY. 20 de novembro. O resto é só carinho materializado.`,
    }),

    defineField({
      name: 'footerBullets',
      title: 'Pontos de Destaque',
      type: 'array',
      description: 'Bullets informativos abaixo do texto (PIX, segurança, etc.)',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Texto',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: 'text',
            },
          },
        },
      ],
      initialValue: [
        { text: 'PIX brasileiro, rápido e seguro' },
        { text: 'Confirmação na hora do carinho' },
        { text: '"O que temos entre nós é muito maior" - Hel & Ylana' },
      ],
    }),

    // ========================================
    // META
    // ========================================
    defineField({
      name: 'lastUpdated',
      title: 'Última Atualização',
      type: 'datetime',
      description: 'Data da última modificação',
      readOnly: true,
    }),

    defineField({
      name: 'isActive',
      title: 'Ativo',
      type: 'boolean',
      description: 'Usar este conteúdo na página de presentes',
      initialValue: true,
    }),
  ],

  preview: {
    select: {
      isActive: 'isActive',
      renderCount: 'projectRenders',
    },
    prepare({ isActive, renderCount }) {
      const renderCountNum = Array.isArray(renderCount) ? renderCount.length : 0

      return {
        title: 'Seções da Página de Presentes',
        subtitle: isActive
          ? `${renderCountNum} render${renderCountNum !== 1 ? 's' : ''} • Ativo`
          : 'Inativo',
      }
    },
  },
})
