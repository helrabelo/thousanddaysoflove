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
    headerTitle: 'Bem-vindo à Nossa Lista (Quase Anti-Lista) 🎁',
    headerContent: `Esse é o cantinho pra quem insiste em presentear. O presente gigante é ver você dia 20 de novembro, na Casa HY, mas se o coração pede pra materializar carinho, fica à vontade.

A gente tá deixando o apê que o Hel passava de bicicleta sonhando em morar com a nossa cara. Sala nova, cozinha funcionando, quarto sem fio pendurado. Família de seis (Linda 👑, Cacao 🍫, Olivia 🌸 e Oliver ⚡) merece lar decente.

Quer ajudar com TV, sofá, lua de mel, plantinha ou qualquer detalhe? Escolhe o que combina contigo. Até presente fora da lista a gente abraça. Amor nunca sobra.`,
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
