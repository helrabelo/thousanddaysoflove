'use client';

import { motion } from 'framer-motion';
import {
  MapPin,
  Clock,
  Shirt,
  Car,
  Hotel,
  Phone,
  Mail,
  ChevronDown,
  Navigation as NavigationIcon,
  Calendar,
  Users,
  Heart,
} from 'lucide-react';
import { useState } from 'react';
import Navigation from '@/components/ui/Navigation';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Posso levar acompanhante?',
    answer: 'Por favor, confirme conosco antes de trazer acompanhantes adicionais para que possamos organizar os lugares adequadamente.',
  },
  {
    question: 'Haverá estacionamento no local?',
    answer: 'Sim! A Casa HY oferece estacionamento gratuito para todos os convidados.',
  },
  {
    question: 'É permitido tirar fotos durante a cerimônia?',
    answer: 'Adoraríamos que você compartilhasse este momento conosco! Fique à vontade para tirar fotos, mas pedimos que desligue o flash durante a cerimônia.',
  },
  {
    question: 'Crianças são bem-vindas?',
    answer: 'Sim! Amamos crianças e elas são muito bem-vindas ao nosso casamento.',
  },
  {
    question: 'Qual o horário previsto para término?',
    answer: 'A festa está prevista para terminar por volta de 23:00, mas a diversão não tem hora para acabar!',
  },
  {
    question: 'Como posso enviar um presente?',
    answer: 'Você pode escolher presentes da nossa lista de presentes online ou contribuir via PIX. Acesse a página de Presentes para mais informações.',
  },
];

const TIMELINE = [
  { time: '17:30', event: 'Chegada dos Convidados', icon: Users },
  { time: '18:00', event: 'Cerimônia de Casamento', icon: Heart },
  { time: '19:00', event: 'Coquetel de Recepção', icon: Users },
  { time: '20:00', event: 'Jantar', icon: Users },
  { time: '21:30', event: 'Abertura da Pista de Dança', icon: Users },
  { time: '22:00', event: 'Corte do Bolo', icon: Heart },
  { time: '23:00', event: 'Encerramento', icon: Users },
];

const HOTELS = [
  {
    name: 'Hotel Gran Marquise',
    distance: '3.5km do local',
    price: 'A partir de R$ 350/noite',
    phone: '(85) 4006-5000',
    address: 'Av. Beira Mar, 3980',
  },
  {
    name: 'Seara Praia Hotel',
    distance: '4km do local',
    price: 'A partir de R$ 280/noite',
    phone: '(85) 4006-2200',
    address: 'Av. Beira Mar, 3080',
  },
  {
    name: 'Ibis Fortaleza',
    distance: '2km do local',
    price: 'A partir de R$ 180/noite',
    phone: '(85) 3307-7700',
    address: 'Av. Historiador Raimundo Girão, 1001',
  },
];

export default function InformacoesPage() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen pt-20" style={{ background: 'var(--background)' }}>
        {/* Header */}
        <div className="text-center py-16" style={{
          background: 'var(--primary-text)',
          color: 'var(--white-soft)'
        }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-center mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              Informações Importantes
            </h1>
            <p className="text-center opacity-90 text-lg max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-crimson)', fontStyle: 'italic' }}>
              Tudo que você precisa saber sobre o grande dia
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Local Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--decorative)' }}>
              <MapPin className="w-6 h-6" style={{ color: 'var(--white-soft)' }} />
            </div>
            <h2 className="text-3xl font-light" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary-text)' }}>
              Local da Celebração
            </h2>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100">
            <h3 className="text-2xl font-semibold mb-4" style={{ color: 'var(--primary-text)' }}>
              Casa HY
            </h3>
            <p className="mb-6" style={{ color: 'var(--secondary-text)' }}>
              Av. Historiador Raimundo Girão, 564 - Meireles, Fortaleza - CE, 60165-050
            </p>

            {/* Google Maps Embed */}
            <div className="aspect-video rounded-xl overflow-hidden mb-6">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3981.3838!2d-38.5009!3d-3.7262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c748f1cf1a8d0f%3A0x5c4a8b2e6d8f0a9e!2sConstable%20Galerie!5e0!3m2!1spt-BR!2sbr!4v1634567890123!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <a
              href="https://www.google.com/maps/place/Casa+HY/@-3.7262,-38.5009,17z/data=!3m1!4b1!4m6!3m5!1s0x7c748f1cf1a8d0f:0x5c4a8b2e6d8f0a9e!8m2!3d-3.7262!4d-38.5009!16s%2Fg%2F11c1y1y1y1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all"
              style={{
                background: 'var(--primary-text)',
                color: 'var(--white-soft)'
              }}
            >
              <NavigationIcon className="w-5 h-5" />
              Abrir no Google Maps
            </a>
          </div>
        </motion.section>

        {/* Timeline Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--decorative)' }}>
              <Clock className="w-6 h-6" style={{ color: 'var(--white-soft)' }} />
            </div>
            <h2 className="text-3xl font-light" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary-text)' }}>
              Programação do Dia
            </h2>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100">
            <div className="mb-6 p-4 rounded-xl text-center bg-gray-50">
              <p className="text-lg font-semibold" style={{ color: 'var(--primary-text)' }}>
                <Calendar className="inline w-5 h-5 mr-2" />
                20 de Novembro de 2025
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--secondary-text)' }}>
                Início às 17h30
              </p>
            </div>

            <div className="space-y-4">
              {TIMELINE.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl transition-colors hover:bg-opacity-50"
                    style={{
                      background: 'transparent',
                      cursor: 'default'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(249, 250, 251, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div className="flex-shrink-0 w-16 text-right">
                      <span className="font-semibold" style={{ color: 'var(--decorative)' }}>
                        {item.time}
                      </span>
                    </div>
                    <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--accent)' }}>
                      <Icon className="w-5 h-5" style={{ color: 'var(--decorative)' }} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium" style={{ color: 'var(--primary-text)' }}>
                        {item.event}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* Dress Code Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--decorative)' }}>
              <Shirt className="w-6 h-6" style={{ color: 'var(--white-soft)' }} />
            </div>
            <h2 className="text-3xl font-light" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary-text)' }}>
              Traje
            </h2>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100">
            <h3 className="text-2xl font-semibold mb-4" style={{ color: 'var(--primary-text)' }}>
              Social
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-lg mb-3" style={{ color: 'var(--primary-text)' }}>
                  Para Elas
                </h4>
                <ul className="space-y-2" style={{ color: 'var(--secondary-text)' }}>
                  <li>• Vestidos de festa (longos, midi ou curtos)</li>
                  <li>• Cores vibrantes são bem-vindas</li>
                  <li>• Evite branco, off-white e bege claro</li>
                  <li>• Saltos confortáveis (haverá pista de dança!)</li>
                  <li>• Macacões elegantes também são ótimas opções</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-3" style={{ color: 'var(--primary-text)' }}>
                  Para Eles
                </h4>
                <ul className="space-y-2" style={{ color: 'var(--secondary-text)' }}>
                  <li>• Terno completo ou blazer com calça social</li>
                  <li>• Gravata ou gravata-borboleta (opcional)</li>
                  <li>• Cores escuras ou tons pastéis</li>
                  <li>• Sapatos sociais</li>
                  <li>• Camisa social (manga longa ou curta)</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-gray-50">
              <p className="text-sm" style={{ color: 'var(--secondary-text)' }}>
                <strong>Dica:</strong> O evento será em ambiente climatizado. Considere trazer um xale ou blazer leve para maior conforto.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Parking Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--decorative)' }}>
              <Car className="w-6 h-6" style={{ color: 'var(--white-soft)' }} />
            </div>
            <h2 className="text-3xl font-light" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary-text)' }}>
              Estacionamento
            </h2>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100">
            <p className="mb-4" style={{ color: 'var(--secondary-text)' }}>
              A Casa HY oferece estacionamento gratuito e seguro para todos os convidados.
            </p>
            <ul className="space-y-2" style={{ color: 'var(--secondary-text)' }}>
              <li className="flex items-start gap-2">
                <span className="font-bold" style={{ color: 'var(--decorative)' }}>✓</span>
                <span>Estacionamento próprio do local</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold" style={{ color: 'var(--decorative)' }}>✓</span>
                <span>Manobrista disponível</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold" style={{ color: 'var(--decorative)' }}>✓</span>
                <span>Serviço gratuito</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold" style={{ color: 'var(--decorative)' }}>✓</span>
                <span>Acesso facilitado para embarque e desembarque</span>
              </li>
            </ul>

            <div className="mt-6 p-4 rounded-xl bg-gray-50">
              <p className="text-sm" style={{ color: 'var(--secondary-text)' }}>
                <strong>Alternativa:</strong> Para quem preferir, há pontos de táxi e aplicativos de transporte (Uber, 99) próximos ao local.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Hotels Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--decorative)' }}>
              <Hotel className="w-6 h-6" style={{ color: 'var(--white-soft)' }} />
            </div>
            <h2 className="text-3xl font-light" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary-text)' }}>
              Hospedagem
            </h2>
          </div>

          <p className="mb-6" style={{ color: 'var(--secondary-text)' }}>
            Recomendações de hotéis próximos à Casa HY para nossos convidados de outras cidades:
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {HOTELS.map((hotel, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100 transition-shadow hover:shadow-2xl"
              >
                <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--primary-text)' }}>
                  {hotel.name}
                </h3>
                <div className="space-y-2 text-sm mb-4" style={{ color: 'var(--secondary-text)' }}>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" style={{ color: 'var(--decorative)' }} />
                    {hotel.distance}
                  </p>
                  <p className="font-medium" style={{ color: 'var(--decorative)' }}>
                    {hotel.price}
                  </p>
                  <p className="text-xs">{hotel.address}</p>
                </div>
                <a
                  href={`tel:${hotel.phone.replace(/\D/g, '')}`}
                  className="flex items-center gap-2 text-sm font-medium transition-colors"
                  style={{ color: 'var(--decorative)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--primary-text)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--decorative)';
                  }}
                >
                  <Phone className="w-4 h-4" />
                  {hotel.phone}
                </a>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--decorative)' }}>
              <span className="text-xl font-bold" style={{ color: 'var(--white-soft)' }}>?</span>
            </div>
            <h2 className="text-3xl font-light" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary-text)' }}>
              Perguntas Frequentes
            </h2>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {FAQ_ITEMS.map((faq, index) => (
              <div key={index} className="last:border-b-0" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left transition-colors"
                  style={{ background: 'transparent' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(249, 250, 251, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span className="font-semibold pr-4" style={{ color: 'var(--primary-text)' }}>
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 transition-transform ${
                      expandedFAQ === index ? 'rotate-180' : ''
                    }`}
                    style={{ color: 'var(--decorative)' }}
                  />
                </button>

                <motion.div
                  initial={false}
                  animate={{
                    height: expandedFAQ === index ? 'auto' : 0,
                    opacity: expandedFAQ === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6" style={{ color: 'var(--secondary-text)' }}>
                    {faq.answer}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="rounded-3xl p-8 text-center" style={{ background: 'var(--primary-text)', color: 'var(--white-soft)' }}>
            <h2 className="text-3xl font-light mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              Ainda tem dúvidas?
            </h2>
            <p className="opacity-90 mb-6 max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-crimson)', fontStyle: 'italic' }}>
              Entre em contato conosco! Estamos aqui para ajudar.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="tel:+5585999999999"
                className="flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all"
                style={{
                  background: 'var(--white-soft)',
                  color: 'var(--primary-text)'
                }}
              >
                <Phone className="w-5 h-5" />
                (85) 99999-9999
              </a>

              <a
                href="mailto:contato@thousanddaysof.love"
                className="flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'var(--white-soft)',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                <Mail className="w-5 h-5" />
                contato@thousanddaysof.love
              </a>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
    </>
  );
}
