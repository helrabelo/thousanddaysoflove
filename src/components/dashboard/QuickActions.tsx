'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Gift,
  Camera,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import type { Invitation } from '@/types/wedding';

interface QuickActionsProps {
  invitation: Invitation;
}

export default function QuickActions({ invitation }: QuickActionsProps) {
  const actions = [
    {
      title: 'RSVP',
      icon: CheckCircle,
      href: '/rsvp',
      completed: invitation.rsvp_completed,
      description: 'Confirme sua presença',
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Presentes',
      icon: Gift,
      href: '/presentes',
      completed: invitation.gift_selected,
      description: 'Escolha um presente',
      color: 'from-pink-500 to-rose-500',
    },
    {
      title: 'Fotos',
      icon: Camera,
      href: '/dia-1000/upload',
      completed: invitation.photos_uploaded,
      description: 'Envie suas fotos',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Mensagens',
      icon: MessageSquare,
      href: '/mensagens',
      completed: false, // Always available
      description: 'Deixe uma mensagem',
      color: 'from-purple-500 to-indigo-500',
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="font-playfair text-2xl text-[#2C2C2C] mb-4">
        Ações Rápidas
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;

          return (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link
                href={action.href}
                className={`block bg-white rounded-xl shadow-md p-5 border-2 transition-all duration-300
                  ${
                    action.completed
                      ? 'border-green-200 opacity-75'
                      : 'border-transparent hover:border-pink-200 hover:shadow-lg hover:-translate-y-1'
                  }
                  ${action.completed ? '' : 'group'}
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center
                      ${action.completed ? 'bg-green-100' : `bg-gradient-to-br ${action.color}`}`}
                    >
                      {action.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <Icon className="w-6 h-6 text-white" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-playfair text-lg font-semibold text-[#2C2C2C] mb-1">
                        {action.title}
                      </h3>
                      <p className="font-crimson text-sm text-[#4A4A4A]">
                        {action.description}
                      </p>

                      {/* Status badge */}
                      <div className="mt-2">
                        {action.completed ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                            <CheckCircle className="w-3 h-3" />
                            Completo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
                            Pendente
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Arrow icon (only for non-completed) */}
                  {!action.completed && (
                    <motion.div
                      className="flex-shrink-0"
                      initial={{ x: 0 }}
                      whileHover={{ x: 4 }}
                    >
                      <ArrowRight className="w-5 h-5 text-[#A8A8A8] group-hover:text-pink-600 transition-colors" />
                    </motion.div>
                  )}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
