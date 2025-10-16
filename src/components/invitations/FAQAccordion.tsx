'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronRight, ChevronDown, Mail, MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
  subPoints?: string[];
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Quando devo confirmar presença?',
    answer:
      'O quanto antes! Idealmente até 1º de novembro para ajudarmos no planejamento.',
    subPoints: [
      'Quanto mais cedo, melhor para organizarmos',
      'Você pode editar sua confirmação depois',
      'Confirme mesmo se ainda tiver dúvidas',
    ],
  },
  {
    question: 'Posso trazer acompanhante?',
    answer:
      'Verifique seu convite. Se estiver marcado "Você e [nome]" ou "Você pode trazer acompanhante", sim!',
    subPoints: [
      'O convite especifica se há acompanhante',
      'Confirme o nome do acompanhante no RSVP',
      'Tem dúvida? Entre em contato conosco',
    ],
  },
  {
    question: 'Como funciona a lista de presentes?',
    answer:
      'Escolha um presente, pague via PIX, e receba confirmação por email. Simples assim!',
    subPoints: [
      'Navegue a lista e escolha o que combina com você',
      'Pagamento seguro via PIX',
      'Contribuições parciais são bem-vindas',
      'Confirmação automática por email',
    ],
  },
  {
    question: 'Preciso fazer upload de fotos antes do casamento?',
    answer:
      'Não é obrigatório, mas adoraríamos ver fotos de vocês se preparando! Podem enviar antes, durante e depois.',
    subPoints: [
      'Fotos de preparação são muito bem-vindas',
      'Podem enviar a qualquer momento',
      'O site continua ativo após o casamento',
    ],
  },
  {
    question: 'Minhas fotos serão públicas?',
    answer:
      'Todas as fotos passam por aprovação antes de aparecer na galeria pública. Você está seguro!',
    subPoints: [
      'Moderação manual por nós',
      'Aprovação em até 24 horas',
      'Apenas fotos apropriadas são publicadas',
      'Controle total sobre suas contribuições',
    ],
  },
  {
    question: 'O que é o "feed ao vivo" do casamento?',
    answer:
      'No dia 20/11, você pode acompanhar o casamento em tempo real com fotos e posts de todos os convidados!',
    subPoints: [
      'Posts aparecem instantaneamente',
      'Fotos e vídeos em tempo real',
      'Curta e comente com outros convidados',
      'Reviva momentos mesmo à distância',
    ],
  },
  {
    question: 'Preciso criar conta ou baixar app?',
    answer:
      'Não! Tudo funciona neste site. Basta ter o código do seu convite (que você já tem!).',
    subPoints: [
      'Sem cadastros ou senhas',
      'Acesso direto com código do convite',
      'Funciona em qualquer navegador',
      'Mobile-first e otimizado para celular',
    ],
  },
  {
    question: 'Posso editar minha confirmação depois?',
    answer:
      'Sim! Basta voltar à página de RSVP e clicar em "Editar confirmação".',
    subPoints: [
      'Mudanças de planos acontecem',
      'Pode atualizar até a data limite',
      'Restrições alimentares também podem ser editadas',
    ],
  },
];

function FAQItemComponent({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: FAQItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="border-2 border-accent rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      {/* Question Header */}
      <button
        onClick={onToggle}
        className="
          w-full px-6 py-4 text-left
          flex items-center justify-between gap-4
          hover:bg-accent/30 transition-colors
          focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-text
        "
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
      >
        <span className="font-playfair text-lg md:text-xl font-semibold text-primary-text flex-1">
          {index + 1}. {faq.question}
        </span>

        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          {isOpen ? (
            <ChevronDown className="w-6 h-6 text-decorative" aria-hidden="true" />
          ) : (
            <ChevronRight className="w-6 h-6 text-decorative" aria-hidden="true" />
          )}
        </motion.div>
      </button>

      {/* Answer Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-answer-${index}`}
            initial={
              shouldReduceMotion ? false : { height: 0, opacity: 0 }
            }
            animate={{ height: 'auto', opacity: 1 }}
            exit={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 bg-accent/30">
              {/* Main Answer */}
              <motion.div
                className="flex items-start gap-2 mb-4"
                initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <span className="text-lg flex-shrink-0" aria-hidden="true">
                  📌
                </span>
                <p className="font-crimson text-base md:text-lg text-secondary-text">
                  {faq.answer}
                </p>
              </motion.div>

              {/* Sub-points */}
              {faq.subPoints && faq.subPoints.length > 0 && (
                <motion.ul
                  className="space-y-2 pl-7"
                  initial={shouldReduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  {faq.subPoints.map((point, i) => (
                    <li
                      key={i}
                      className="font-crimson text-sm md:text-base text-secondary-text flex items-start gap-2"
                    >
                      <span className="text-decorative mt-0.5">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </motion.ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQAccordion() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const shouldReduceMotion = useReducedMotion();

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <section
      className="w-full max-w-4xl mx-auto px-4 py-12"
      aria-labelledby="faq-title"
    >
      {/* Section Header */}
      <motion.div
        className="text-center mb-8"
        initial={shouldReduceMotion ? false : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2
          id="faq-title"
          className="font-playfair text-3xl md:text-4xl font-bold text-primary-text mb-2"
        >
          ❓ Perguntas Frequentes
        </h2>
        <p className="font-crimson text-base md:text-lg text-secondary-text italic">
          Tire suas dúvidas sobre a celebração
        </p>
      </motion.div>

      {/* FAQ Items */}
      <div className="space-y-4 mb-12" role="list">
        {FAQ_ITEMS.map((faq, index) => (
          <FAQItemComponent
            key={index}
            faq={faq}
            index={index}
            isOpen={openItems.has(index)}
            onToggle={() => toggleItem(index)}
          />
        ))}
      </div>

      {/* Divider */}
      <motion.div
        className="border-t-2 border-dotted border-decorative/30 mb-8"
        initial={shouldReduceMotion ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      />

      {/* Contact Card */}
      <motion.div
        className="bg-gradient-to-br from-accent to-white rounded-lg shadow-md p-8 text-center"
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h3 className="font-playfair text-2xl font-bold text-primary-text mb-4">
          Ainda tem dúvidas?
        </h3>
        <p className="font-crimson text-base text-secondary-text mb-6">
          Estamos aqui para ajudar! Entre em contato conosco:
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Email */}
          <Link
            href="mailto:helrabelo@gmail.com"
            className="
              inline-flex items-center gap-2 px-6 py-3
              bg-white rounded-full shadow-sm
              font-crimson text-base text-secondary-text
              hover:shadow-md hover:scale-105
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-primary-text focus:ring-offset-2
            "
          >
            <Mail className="w-5 h-5" aria-hidden="true" />
            <span>helrabelo@gmail.com</span>
          </Link>

          {/* WhatsApp */}
          <Link
            href="https://wa.me/5585988776655?text=Olá!%20Tenho%20uma%20dúvida%20sobre%20o%20casamento"
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-2 px-6 py-3
              bg-white rounded-full shadow-sm
              font-crimson text-base text-secondary-text
              hover:shadow-md hover:scale-105
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-primary-text focus:ring-offset-2
            "
          >
            <MessageCircle className="w-5 h-5" aria-hidden="true" />
            <span>WhatsApp</span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
