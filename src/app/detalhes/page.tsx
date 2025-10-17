'use client';

import { motion } from 'framer-motion';
import Navigation from '@/components/ui/Navigation';
import HYBadge from '@/components/ui/HYBadge';
import EventTimeline from '@/components/invitations/EventTimeline';
import VenueMap from '@/components/invitations/VenueMap';
import DressCodeGuide from '@/components/invitations/DressCodeGuide';
import WebsiteGuide from '@/components/invitations/WebsiteGuide';
import GeneralOrientations from '@/components/invitations/GeneralOrientations';

export default function DetalhesPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen">
        {/* Header - Matching Gallery Style */}
        <section className="relative pt-12 md:pt-24 pb-20 px-6 overflow-hidden">
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
                Detalhes do Dia 1000
              </h1>
              <div className="w-24 h-px mx-auto mb-8" style={{ background: 'var(--decorative)' }} />
              <p
                className="text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed"
                style={{
                  fontFamily: 'var(--font-crimson)',
                  color: 'var(--secondary-text)',
                  fontStyle: 'italic',
                }}
              >
                Tudo que você precisa saber sobre o grande dia
              </p>
            </motion.div>
          </div>
        </section>

        {/* 1. Event Timeline - Programação do Dia */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="font-playfair text-4xl md:text-5xl text-[#2C2C2C] mb-4">
                Programação do Dia
              </h2>
              <p className="font-crimson text-xl text-[#4A4A4A] italic">
                Saiba o que acontecerá em cada momento especial
              </p>
            </motion.div>

            <EventTimeline />
          </div>
        </section>

        {/* 2. Venue Map - Como Chegar */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="font-playfair text-4xl md:text-5xl text-[#2C2C2C] mb-4">
                Como Chegar
              </h2>
              <p className="font-crimson text-xl text-[#4A4A4A] italic">
                Encontre facilmente o local da celebração
              </p>
            </motion.div>

            <VenueMap />
          </div>
        </section>

        {/* 3. Dress Code Guide */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="font-playfair text-4xl md:text-5xl text-[#2C2C2C] mb-4">
                Dress Code
              </h2>
              <p className="font-crimson text-xl text-[#4A4A4A] italic">
                Guia completo para você se vestir com elegância
              </p>
            </motion.div>

            <DressCodeGuide />
          </div>
        </section>

        {/* 4. Website Guide - Explore o Site */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="font-playfair text-4xl md:text-5xl text-[#2C2C2C] mb-4">
                Explore o Site
              </h2>
              <p className="font-crimson text-xl text-[#4A4A4A] italic">
                Descubra tudo sobre nossa celebração
              </p>
            </motion.div>

            <WebsiteGuide rsvpCompleted={false} />
          </div>
        </section>

        {/* 5. General Orientations - Informações Úteis + Ainda tem dúvidas? */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <GeneralOrientations />
          </div>
        </section>
      </div>
    </>
  );
}
