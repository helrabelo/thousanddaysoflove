'use client'

/**
 * Presents Page Client Component
 *
 * Client-side interactive features for the gifts page:
 * - Gift filtering and search
 * - Payment interactions
 * - Stats display
 * - Project render gallery
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import Navigation from '@/components/ui/Navigation'
import GiftCard from '@/components/gifts/GiftCard'
import { GiftService, GiftWithProgress } from '@/lib/services/gifts'
import HYBadge from '@/components/ui/HYBadge'
import ProjectRenderGallery from '@/components/gifts/ProjectRenderGallery'
import GratitudeAndMessages from '@/components/gifts/GratitudeAndMessages'
import type { GiftsPageSections } from '@/types/wedding'

interface PresentsPageClientProps {
  sections?: GiftsPageSections
}

const defaultSections: GiftsPageSections = {
  _id: 'default-gifts-page',
  isActive: true,
  headerTitle: 'Bora coçar os bolsos? 🎁',
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
  lastUpdated: new Date().toISOString(),
}

export default function PresentsPageClient({ sections = defaultSections }: PresentsPageClientProps) {
  const [gifts, setGifts] = useState<GiftWithProgress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGifts()
  }, [])

  const loadGifts = async () => {
    try {
      setLoading(true)
      // Now fetching from Sanity CMS with Supabase contribution progress
      const data = await GiftService.getAllGiftsWithProgress()
      setGifts(data)
    } catch (error) {
      console.error('Error loading gifts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = () => {
    // Reload gifts to update contribution progress
    loadGifts()
  }

  // Format content with line breaks
  const formatContent = (content: string) => {
    return content.split('\n').map((line, index, array) => (
      <span key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </span>
    ))
  }

  if (loading) {
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

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header - Sanity Managed */}
        <section className="relative pt-12 md:pt-24 pb-12 px-6 overflow-hidden">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* HY Monogram Logo */}
              <HYBadge />

              <h1
                className="text-5xl md:text-7xl font-bold mb-8"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  color: 'var(--primary-text)',
                  letterSpacing: '0.15em',
                  lineHeight: '1.1',
                }}
              >
                {sections.headerTitle}
              </h1>
              <div className="w-24 h-px mx-auto mb-8" style={{ background: 'var(--decorative)' }} />
              <div
                className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed"
                style={{
                  fontFamily: 'var(--font-crimson)',
                  color: 'var(--secondary-text)',
                  fontStyle: 'italic',
                }}
              >
                {formatContent(sections.headerContent)}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Project Render Gallery - Sanity Managed */}
        {sections.showProjectGallery &&
          sections.projectRenders &&
          sections.projectRenders.length > 0 && (
            <ProjectRenderGallery
              title={sections.projectGalleryTitle || 'O Projeto do Nosso Lar'}
              description={
                sections.projectGalleryDescription ||
                'Veja como vai ficar nosso lar depois da reforma.'
              }
              renders={sections.projectRenders}
            />
          )}

        {/* Gifts Grid */}
        {gifts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
          >
            {gifts.map((gift, index) => (
              <motion.div
                key={gift._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <GiftCard gift={gift} allGifts={gifts} onPaymentSuccess={handlePaymentSuccess} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <h3
              className="text-lg font-semibold mb-2"
              style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary-text)' }}
            >
              Em breve, ideias para nosso novo lar
            </h3>
            <p
              className="mb-4"
              style={{
                fontFamily: 'var(--font-crimson)',
                color: 'var(--secondary-text)',
                fontStyle: 'italic',
              }}
            >
              A lista tá sendo atualizada. Volta daqui a pouco que tem presente novo pintando.
            </p>
          </motion.div>
        )}

        {/* Gratitude and Messages Section */}
        <GratitudeAndMessages gifts={gifts} />

        {/* Call to Action - Sanity Managed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center rounded-2xl p-8"
          style={{ background: 'var(--decorative)', color: 'var(--white-soft)' }}
        >
          <Heart className="w-10 h-10 mx-auto mb-4" style={{ color: 'var(--white-soft)' }} />
          <h3
            className="text-2xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-playfair)', letterSpacing: '0.15em' }}
          >
            {sections.footerTitle}
          </h3>
          <div
            className="max-w-3xl mx-auto mb-6"
            style={{
              fontFamily: 'var(--font-crimson)',
              fontStyle: 'italic',
              lineHeight: '1.6',
              color: 'var(--white-soft)',
              opacity: '0.9',
            }}
          >
            {formatContent(sections.footerContent)}
          </div>
          {sections.footerBullets && sections.footerBullets.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {sections.footerBullets.map((bullet, index) => (
                <div key={index} className="flex flex-row items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--white-soft)' }} />
                  <span style={{ fontFamily: 'var(--font-crimson)', fontSize: '0.9375rem' }}>
                    {bullet.text}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
