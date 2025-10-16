'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';
import Navigation from '@/components/ui/Navigation';
import ElegantInvitation from '@/components/sections/ElegantInvitation';
import RSVPPromptCard from '@/components/invitations/RSVPPromptCard';
import WebsiteGuide from '@/components/invitations/WebsiteGuide';
import EventTimeline from '@/components/invitations/EventTimeline';
import VenueMap from '@/components/invitations/VenueMap';
import DressCodeGuide from '@/components/invitations/DressCodeGuide';
import GeneralOrientations from '@/components/invitations/GeneralOrientations';
import type { Invitation } from '@/types/wedding';
import {
  getInvitationByCode,
  trackInvitationOpen,
} from '@/lib/supabase/invitations';

export default function PersonalizedInvitationPage() {
  const params = useParams();
  const router = useRouter();
  const code = params?.code as string;

  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!code) {
      setError('Código de convite não fornecido');
      setLoading(false);
      return;
    }

    loadInvitation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  async function loadInvitation() {
    try {
      // Fetch invitation data
      const data = await getInvitationByCode(code.toUpperCase());

      if (!data) {
        setError('Convite não encontrado. Verifique o código e tente novamente.');
        setLoading(false);
        return;
      }

      setInvitation(data);

      // Track invitation open (first time + view count)
      await trackInvitationOpen(code);
    } catch (err) {
      console.error('Error loading invitation:', err);
      setError('Erro ao carregar convite. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }

  // Loading state
  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-4"
          >
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-[#A8A8A8]" />
            <p className="font-crimson text-lg text-[#4A4A4A] italic">
              Carregando seu convite personalizado...
            </p>
          </motion.div>
        </div>
      </>
    );
  }

  // Error state
  if (error || !invitation) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md text-center space-y-6"
          >
            <AlertCircle className="w-16 h-16 mx-auto text-[#A8A8A8]" />
            <h1 className="font-playfair text-3xl text-[#2C2C2C]">
              Ops! Algo deu errado
            </h1>
            <p className="font-crimson text-lg text-[#4A4A4A]">{error}</p>
            <button
              onClick={() => router.push('/convite')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#4A7C59] text-white rounded-xl font-playfair text-lg hover:bg-[#5A8C69] transition-colors"
            >
              Voltar ao Convite
            </button>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen">
        {/* 1. Elegant Invitation Hero */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <ElegantInvitation guestName={invitation.guest_name} />
          </div>
        </section>

        {/* 2. RSVP Prompt Section */}
        <section className="py-16">
          <RSVPPromptCard invitation={invitation} />
        </section>

        {/* 3. Event Timeline */}
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

        {/* 4. Venue Map */}
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

        {/* 5. Dress Code Guide */}
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

        {/* 6. Website Guide Section */}
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

            <WebsiteGuide rsvpCompleted={invitation.rsvp_completed} />
          </div>
        </section>

        {/* 7. General Orientations */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <GeneralOrientations />
          </div>
        </section>

        {/* 8. Footer CTA */}
        <section className="py-16 px-4 bg-gradient-to-b from-[#F8F6F3] to-[#E8E6E3]">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="font-playfair text-4xl md:text-5xl text-[#2C2C2C]">
                Mal podemos esperar!
              </h2>
              <p className="font-crimson text-xl text-[#4A4A4A] italic">
                Sua presença tornará nosso dia ainda mais especial ✨
              </p>

              {!invitation.rsvp_completed && (
                <button
                  onClick={() => {
                    const rsvpSection = document.querySelector('[data-rsvp-section]');
                    rsvpSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-block px-8 py-4 bg-gradient-to-r from-[#4A7C59] to-[#5A8C69] text-white rounded-xl font-playfair text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  Confirmar Presença Agora
                </button>
              )}
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
