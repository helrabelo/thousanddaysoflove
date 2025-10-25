import { Suspense } from 'react'
import { getGiftsPageSections } from '@/lib/sanity/giftsPageService'
import PresentsPageClient from './PresentsPageClient'
import type { GiftsPageSections } from '@/types/wedding'

/**
 * Gifts Page - Server Component
 * Fetches Sanity CMS content for page sections (header, footer, project gallery)
 * Then delegates to client component for interactive features
 */
export default async function PresentsPage() {
  // Fetch gifts page sections from Sanity
  const sections = await getGiftsPageSections()

  // Fallback content if Sanity data isn't available
  const defaultSections: GiftsPageSections = {
    _id: 'default-gifts-page',
    headerTitle: 'Bora coçar os bolsos? 🎁',
    headerContent: `Deus nos deu muita coisa. Saúde. Família. Trabalho.  Sinceramente? A gente não precisa de nada. Só de você lá dia 20 de novembro.

Mas a gente sabe. Tem gente que faz questão. Que quer materializar o carinho de algum jeito.

Então... a gente tá finalmente (finalmente!) reformando esse apê. Tava meio inacabado desde que a gente se mudou. Agora vai virar nosso lar de verdade. Pra sempre. Família de 6 (contando Linda 👑, Cacao 🍫, Olivia 🌸 e Oliver ⚡).

Se quiser contribuir pro nosso cantinho - uma TV, um sofá, lua de mel, decoração - a gente abraça e agradece o gesto. De coração.`,
    footerTitle: 'Obrigadaço por transformar carinho em casa',
    footerContent: `Se você chegou aqui pensando em mimar a gente, obrigadaço de verdade. Cada contribuição vira história: panela que não deixa o arroz passar, sofá com quatro cachorros em cima, marcenaria que some com os fios.

Dá um quentinho saber que você quer deixar nosso lar ainda mais cheio de nós dois. A gente recebe com todo amor e transforma em detalhe pra vida toda.

E lembra: te ver na Casa HY, dia 20 de novembro, é o que importa. O resto é carinho em forma de PIX.`,
    footerBullets: [
      { text: 'PIX brasileiro, rapidinho e sem enrolação' },
      { text: 'Confirmação na hora — a gente vibra junto' },
      { text: 'Qualquer valor vira história dentro do nosso lar' },
    ],
    showProjectGallery: false,
    projectGalleryTitle: 'O Projeto do Nosso Lar',
    projectGalleryDescription:
      'Esse apartamento que tava meio largado? Agora vira nosso lar de verdade. Veja como vai ficar depois da reforma.',
    projectRenders: [],
    isActive: true,
    lastUpdated: new Date().toISOString(),
  }

  const pageContent: GiftsPageSections = sections ?? defaultSections

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
