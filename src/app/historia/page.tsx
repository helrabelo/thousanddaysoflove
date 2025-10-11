'use client'

import { motion } from 'framer-motion'
import Navigation from '@/components/ui/Navigation'
import TimelineMomentCard from '@/components/timeline/TimelineMomentCard'
import TimelinePhaseHeader from '@/components/timeline/TimelinePhaseHeader'
import { ArrowLeft, Heart } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HistoriaPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20" style={{ background: 'var(--background)' }}>
        <div className="max-w-4xl mx-auto text-center px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-12"
              style={{
                background: 'var(--decorative)',
                opacity: 0.9,
              }}
            >
              <Heart className="w-8 h-8" style={{ color: 'var(--white-soft)' }} />
            </div>

            <h1
              className="mb-8"
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 'clamp(3rem, 8vw, 5rem)',
                fontWeight: '600',
                color: 'var(--primary-text)',
                letterSpacing: '0.1em',
                lineHeight: '1.2',
              }}
            >
              Nossa História Completa
            </h1>

            <p
              className="mb-12 max-w-3xl mx-auto"
              style={{
                fontFamily: 'var(--font-crimson)',
                fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                lineHeight: '1.8',
                color: 'var(--secondary-text)',
                fontStyle: 'italic',
              }}
            >
              Daquele "oi" no WhatsApp até o casamento. 1000 dias, muitas histórias, e a gente aqui.
            </p>

            <div className="w-32 h-px mx-auto mb-16" style={{ background: 'var(--decorative)' }} />
          </motion.div>
        </div>
      </section>

      {/* PHASE 1: Os Primeiros Dias (Day 1-100) */}
      <TimelinePhaseHeader
        title="Os Primeiros Dias"
        dayRange="Dia 1 - 100"
        subtitle="Do Tinder ao primeiro encontro. Aquele nervosismo que a gente não admitia."
      />

      <TimelineMomentCard
        day={1}
        date="06 de Janeiro de 2023"
        title="Primeiro 'Oi'"
        description="6 de janeiro de 2023. Aquele primeiro 'oi' meio sem graça no WhatsApp. A gente quase nem respondeu. Três anos depois, casamento. Vai entender."
        imageUrl="/images/mock/timeline-day1.jpg"
        imageAlt="Primeiro encontro"
        contentAlign="left"
      />

      <TimelineMomentCard
        day={8}
        date="13 de Janeiro de 2023"
        title="Primeiro Encontro"
        description="Casa Fontana. Aquele jantar que podia ter dado muito errado mas deu muito certo. Conversamos por horas. No final, nenhum dos dois queria ir embora."
        imageUrl="/images/mock/timeline-day8.jpg"
        imageAlt="Primeiro jantar juntos"
        contentAlign="right"
      />

      {/* PHASE 2: Construindo Juntos (Day 100-500) */}
      <TimelinePhaseHeader
        title="Construindo Juntos"
        dayRange="Dia 100 - 500"
        subtitle="Quando a gente percebeu que isso aqui era pra valer. Casa própria, primeira dog, e muitas cervejas no Mangue Azul."
      />

      <TimelineMomentCard
        day={200}
        date="25 de Julho de 2023"
        title="Linda Chega"
        description="A primeira filha. Linda. Nome certeiro. Matriarca autista que manda em todo mundo até hoje. Mudou tudo. De repente a gente era uma família."
        imageUrl="/images/mock/timeline-day200.jpg"
        imageAlt="Linda, nossa primeira cachorra"
        contentAlign="left"
      />

      <TimelineMomentCard
        day={434}
        date="14 de Março de 2024"
        title="Casa Própria"
        description="Esse apartamento? Hel passava de bicicleta aqui indo pra faculdade. Sonhava morar aqui um dia. Anos de trabalho. Literalmente anos. Agora é nosso. Casa própria. Família de 6. Primeira vez na vida que ele não quer chegar no próximo nível."
        imageUrl="/images/mock/timeline-day434.jpg"
        imageAlt="Nosso apartamento"
        contentAlign="right"
      />

      {/* PHASE 3: Nossa Família (Day 500-900) */}
      <TimelinePhaseHeader
        title="Nossa Família"
        dayRange="Dia 500 - 900"
        subtitle="De 1 pra 4 cachorros. Caos total. A gente ama cada segundo."
      />

      <TimelineMomentCard
        day={600}
        date="22 de Agosto de 2024"
        title="Cacao Se Junta à Família"
        description="Ylana viu, Ylana quis, Ylana trouxe. Cacao chegou e virou o companheiro oficial. Menos autista que a Linda, mais carinhoso, e completa a vibe da casa."
        imageUrl="/images/mock/timeline-day600.jpg"
        imageAlt="Cacao"
        contentAlign="left"
      />

      <TimelineMomentCard
        day={700}
        date="10 de Novembro de 2024"
        title="Olivia & Oliver Nascem"
        description="Linda teve filhotes. Olivia, a doce. Oliver, o energético. A gente ia dar os filhotes. Óbvio que não deu certo. Ficamos com os dois. Família de 6 completa."
        imageUrl="/images/mock/timeline-day700.jpg"
        imageAlt="Olivia e Oliver"
        contentAlign="right"
      />

      {/* PHASE 4: Caminhando Pro Altar (Day 900-1000) */}
      <TimelinePhaseHeader
        title="Caminhando Pro Altar"
        dayRange="Dia 900 - 1000"
        subtitle="O pedido em Icaraí. Planejamento do casamento. E a gente aqui, prestes a celebrar 1000 dias juntos."
      />

      <TimelineMomentCard
        day={900}
        date="09 de Setembro de 2025"
        title="O Pedido em Icaraí"
        description="Praia de Icaraí. Hel estava nervoso. Ylana desconfiada. Ele ajoelhou. Ela disse sim. 900 dias juntos. Mais 1000 pela frente."
        imageUrl="/images/mock/timeline-day900.jpg"
        imageAlt="Pedido de casamento"
        contentAlign="left"
      />

      <TimelineMomentCard
        day={1000}
        date="20 de Novembro de 2025"
        title="Mil Dias de Amor"
        description="E aqui estamos. 1000 dias depois daquele primeiro 'oi' sem graça. Casa própria. 4 cachorros. E a gente casando. Porque às vezes o clichê é bom demais."
        imageUrl="/images/mock/timeline-day1000.jpg"
        imageAlt="Nosso casamento"
        contentAlign="right"
      />

      {/* Spacer before back button */}
      <div className="py-16" style={{ background: 'var(--background)' }} />

      {/* Navigation Back */}
      <section className="py-20" style={{ background: 'var(--background)' }}>
        <div className="max-w-4xl mx-auto text-center px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Button variant="wedding-outline" size="lg" asChild>
              <Link href="/" className="flex items-center">
                <ArrowLeft className="w-5 h-5 mr-3" />
                Voltar ao Início
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}