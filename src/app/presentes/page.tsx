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
    headerContent: `Esse é o cantinho onde a gente deixa claro: o presente que mais importa é te ver dia 20 de novembro, com a gente. Mas, se o coração pede pra transformar o carinho em algo palpável, não vamos te privar desse gesto.

A gente tá finalmente reformando o nosso cantinho, vamos deixá-lo com a nossa cara. Sala nova, cozinha funcionando, quarto sem fio pendurado. Família de seis ( por enquanto ).

Quer ajudar com a TV, o sofá, a lua de mel, a marcenaria ou aquela decoração que faz a casa parecer casa? Escolhe o que combina com você e bora tirar o escorpião do bolso.

E obviamente, se quiser dar um presente fora da lista, a gente recebe com o maior amor também. O que importa é você estar lá com a gente.`,
    footerTitle: 'Como Mimamos Você Enquanto Você Mima a Gente',
    footerContent: `Item grande? A gente quebra em cotas. Exemplo real oficial: TV de R$10.000 vira contribuições de R$100, R$250, R$500 — ou qualquer outro valor (mínimo R$50). Tem opção pra lua de mel, reforma, plantinha, o que fizer sentido aí na sua cabeça.

Cada ajuda vira parede pintada, sofá sem rasgo, cozinha com panela combinando. Os quatro latidos barulhentos agradecem muito. A gente também.

Só não esquece: o presente gigante é você lá com a gente. Dia 20 de novembro. Casa HY. O resto é carinho que dá pra pegar com a mão.`,
    footerBullets: [
      { text: 'PIX brasileiro, rapidinho e sem enrolação' },
      { text: 'Confirmação chega na hora (a gente vibra junto)' },
      { text: '“O que temos entre nós é muito maior” — Hel & Ylana' },
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
