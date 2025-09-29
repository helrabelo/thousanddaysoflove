'use client'

import { motion } from 'framer-motion'
import { MapPin, Clock, Car, Bus, Phone, Info, Navigation, Share2 } from 'lucide-react'
import GoogleMap from '@/components/ui/GoogleMap'
import { CONSTABLE_GALERIE } from '@/lib/utils/maps'
import GoogleMapsService from '@/lib/utils/maps'

export default function WeddingLocation() {
  const handleDirections = () => {
    const directionsUrl = GoogleMapsService.generateDirectionsUrl(CONSTABLE_GALERIE.address)
    window.open(directionsUrl, '_blank')
  }

  const handleWhatsAppShare = () => {
    const whatsappUrl = GoogleMapsService.generateWhatsAppLocationMessage(CONSTABLE_GALERIE)
    window.open(whatsappUrl, '_blank')
  }

  const nearbyLandmarks = GoogleMapsService.getNearbyLandmarks()
  const transportInfo = GoogleMapsService.getPublicTransportInfo()

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-rose-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Local da Cerimônia
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Será uma alegria imensa celebrar nosso amor com você neste local especial em Fortaleza
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Venue Information */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Venue Details Card */}
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-3 rounded-full">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {CONSTABLE_GALERIE.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {CONSTABLE_GALERIE.description}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-rose-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Endereço</p>
                    <p className="text-gray-600 text-sm">{CONSTABLE_GALERIE.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Data e Horário</p>
                    <p className="text-gray-600 text-sm">20 de Novembro de 2025, às 10:30h</p>
                  </div>
                </div>

                {CONSTABLE_GALERIE.parkingInfo && (
                  <div className="flex items-start gap-3">
                    <Car className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-800">Estacionamento</p>
                      <p className="text-gray-600 text-sm">{CONSTABLE_GALERIE.parkingInfo}</p>
                    </div>
                  </div>
                )}

                {CONSTABLE_GALERIE.accessibilityInfo && (
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-800">Acessibilidade</p>
                      <p className="text-gray-600 text-sm">{CONSTABLE_GALERIE.accessibilityInfo}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <button
                  onClick={handleDirections}
                  className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Navigation className="w-5 h-5" />
                  Como Chegar
                </button>

                <button
                  onClick={handleWhatsAppShare}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Share2 className="w-5 h-5" />
                  Compartilhar
                </button>
              </div>
            </div>

            {/* Transportation Info */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Public Transportation */}
              <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-full">
                    <Bus className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-800">Transporte Público</h4>
                </div>
                <ul className="space-y-2">
                  {transportInfo.map((info, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <div className="w-1 h-1 bg-blue-500 rounded-full mt-2" />
                      {info}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Nearby Landmarks */}
              <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-2 rounded-full">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-800">Pontos de Referência</h4>
                </div>
                <ul className="space-y-2">
                  {nearbyLandmarks.map((landmark, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <div className="w-1 h-1 bg-purple-500 rounded-full mt-2" />
                      {landmark}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Interactive Map */}
          <motion.div
            className="lg:sticky lg:top-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-xl">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Localização no Mapa
              </h3>

              <GoogleMap
                location={CONSTABLE_GALERIE}
                height="500px"
                className="rounded-2xl overflow-hidden"
                showControls={true}
                showDirections={true}
              />

              <div className="mt-6 p-4 bg-gradient-to-r from-rose-100 to-pink-100 rounded-xl border border-rose-200">
                <h4 className="font-medium text-gray-800 mb-2">💡 Dica Importante</h4>
                <p className="text-sm text-gray-600">
                  O local fica na região nobre de Eng. Luciano Cavalcante, próximo aos principais shoppings de Fortaleza.
                  Recomendamos chegar com 15-20 minutos de antecedência.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Additional Information */}
        <motion.div
          className="mt-16 bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Informações Adicionais
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Horário da Cerimônia</h4>
              <p className="text-gray-600 text-sm">
                Início às 10:30h da manhã<br />
                Duração aproximada: 2-3 horas
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Car className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Estacionamento</h4>
              <p className="text-gray-600 text-sm">
                Vagas gratuitas disponíveis<br />
                Manobrista no local
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Info className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Traje</h4>
              <p className="text-gray-600 text-sm">
                Traje social<br />
                Cores claras recomendadas
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}