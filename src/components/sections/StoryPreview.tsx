'use client'

import { motion } from 'framer-motion'
import { Heart, Calendar, Star } from 'lucide-react'

export default function StoryPreview() {
  return (
    <section className="py-20 bg-white/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Nossa História de Amor
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Toda grande história de amor é única, mas a nossa é medida em dias que levaram ao para sempre.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Day 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-gradient-to-br from-rose-100 to-pink-100 rounded-3xl p-8 mb-6 hover:shadow-lg transition-all duration-300">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-rose-500" fill="currentColor" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Dia 1</h3>
              <p className="text-gray-600">
                O dia em que nossos corações se encontraram e soubemos que algo mágico estava começando.
              </p>
            </div>
          </motion.div>

          {/* Day 500 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-3xl p-8 mb-6 hover:shadow-lg transition-all duration-300">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-purple-500" fill="currentColor" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Dia 500</h3>
              <p className="text-gray-600">
                Na metade dos nossos mil dias, soubéramos que queríamos passar todos os dias juntos.
              </p>
            </div>
          </motion.div>

          {/* Day 1000 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-gradient-to-br from-pink-100 to-rose-100 rounded-3xl p-8 mb-6 hover:shadow-lg transition-all duration-300">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-pink-500" fill="currentColor" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Dia 1000</h3>
              <p className="text-gray-600">
                Nosso dia de casamento - quando mil dias de amor se tornam uma promessa para a vida toda.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 text-gray-700 font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            Leia Nossa História Completa
          </button>
        </motion.div>
      </div>
    </section>
  )
}