'use client'

import { motion } from 'framer-motion'
import { Gift, Users, MapPin, Calendar } from 'lucide-react'
import Link from 'next/link'

const features = [
  {
    icon: Users,
    title: 'Confirmação',
    description: 'Junte-se a nós para celebrar nosso dia especial',
    color: 'from-rose-500 to-pink-600',
    bgColor: 'from-rose-50 to-pink-50',
    href: '/rsvp'
  },
  {
    icon: Gift,
    title: 'Lista de Presentes',
    description: 'Nos ajude a começar nosso novo capítulo juntos',
    color: 'from-purple-500 to-indigo-600',
    bgColor: 'from-purple-50 to-indigo-50',
    href: '#registry'
  },
  {
    icon: Calendar,
    title: 'Cronograma',
    description: 'Datas importantes e eventos',
    color: 'from-pink-500 to-rose-600',
    bgColor: 'from-pink-50 to-rose-50',
    href: '#timeline'
  },
  {
    icon: MapPin,
    title: 'Detalhes',
    description: 'Local, acomodações e mais informações',
    color: 'from-indigo-500 to-purple-600',
    bgColor: 'from-indigo-50 to-purple-50',
    href: '#details'
  }
]

export default function QuickPreview() {
  return (
    <section className="py-20 bg-gradient-to-br from-white via-rose-25 to-purple-25">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Tudo Que Você Precisa
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Da confirmação à lista de presentes, facilitamos para você fazer parte da nossa celebração.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Link href={feature.href} className="block h-full">
                  <div className={`bg-gradient-to-br ${feature.bgColor} rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50 h-full cursor-pointer`}>
                    <div className={`bg-gradient-to-r ${feature.color} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                      {feature.title}
                    </h3>

                    <p className="text-gray-600 text-center leading-relaxed">
                      {feature.description}
                    </p>

                    <div className="mt-6 text-center">
                      <span className={`inline-block bg-gradient-to-r ${feature.color} bg-clip-text text-transparent font-semibold group-hover:underline`}>
                        {feature.title === 'Confirmação' ? 'Confirmar Presença →' : 'Saiba Mais →'}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Wedding Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="bg-white/40 backdrop-blur-md rounded-3xl p-8 border border-white/30 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Reserve a Data: 11 de Novembro de 2025
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-gray-600">
              <div>
                <div className="font-semibold text-gray-800">Cerimônia</div>
                <div>16:00h</div>
              </div>
              <div>
                <div className="font-semibold text-gray-800">Recepção</div>
                <div>18:00h</div>
              </div>
              <div>
                <div className="font-semibold text-gray-800">Dress Code</div>
                <div>Traje Social</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}