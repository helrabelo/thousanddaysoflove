import { Suspense } from 'react'
import { getGiftsPageSections } from '@/lib/sanity/giftsPageService'
import PresentsPageClient from './PresentsPageClient'

/**
 * Gifts Page - Server Component
 * Fetches Sanity CMS content for page sections (header, footer, project gallery)
 * Then delegates to client component for interactive features
 */
export default async function PresentsPage() {
  // Fetch gifts page sections from Sanity
  const sections = await getGiftsPageSections()

  // Fallback content if Sanity data isn't available
  const defaultSections = {
    headerTitle: 'Presentes? A Gente Só Quer Você Lá',
    headerContent: `Deus nos deu muita coisa. Saúde. Família. Trabalho. Sinceramente? A gente não precisa de nada. Só de você lá dia 20 de novembro.

Mas a gente sabe. Tem gente que faz questão. Que quer materializar o carinho de algum jeito.

Então... a gente tá finalmente (finalmente!) reformando nosso apê. Tava meio inacabado desde que a gente se mudou. Agora vai virar nosso lar de verdade. Pra sempre. Família de (por enquanto) 6 (contando Linda 👑, Cacao 🍫, Olivia 🌸 e Oliver ⚡).

Se quiser contribuir pro nosso cantinho - uma TV, um sofá, lua de mel, decoração - a gente abraça e agradece o gesto. De coração.`,
    footerTitle: 'Obrigado Por Se Importar (Mas Principalmente Por Estar Lá!)',
    footerContent: `Tem item grande? A gente divide em pedacinhos (aquela TV de R$10.000 vira cotas de R$100, R$250, R$500 - ou o valor que você quiser, mínimo R$50). Tem também contribuição pra lua de mel, decoração, aquelas coisinhas que transformam casa em lar.

Cada gesto ajuda a fazer desse apartamento (que tava meio largado) nosso cantinho de verdade. Os 4 cachorros barulhentos também agradecem.

Mas pra gente, o presente maior é você lá. Casa HY. 20 de novembro. O resto é só carinho materializado.`,
    footerBullets: [
      { text: 'PIX brasileiro, rápido e seguro' },
      { text: 'Confirmação na hora do carinho' },
      { text: '"O que temos entre nós é muito maior" - Hel & Ylana' },
    ],
    showProjectGallery: false,
    projectGalleryTitle: 'O Projeto do Nosso Lar',
    projectGalleryDescription:
      'Esse apartamento que tava meio largado? Agora vira nosso lar de verdade. Veja como vai ficar depois da reforma.',
    projectRenders: [],
  }

  const pageContent = sections || defaultSections

  return (
    <Suspense fallback={<LoadingState />}>
      <PresentsPageClient sections={pageContent} />
    </Suspense>
  )
}

function LoadingState() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div
            className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4"
            style={{
              borderColor: 'var(--decorative)',
              borderTopColor: 'var(--primary-text)',
            }}
          />
          <p
            style={{
              fontFamily: 'var(--font-crimson)',
              color: 'var(--secondary-text)',
              fontStyle: 'italic',
            }}
          >
            Carregando as ideias pro nosso lar...
          </p>
        </div>
      </div>
    </div>
  )
}
