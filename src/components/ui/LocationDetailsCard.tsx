'use client'

import { motion } from 'framer-motion'
import { MapPin, Clock, Car, Phone, Info, Navigation, Share2, ExternalLink } from 'lucide-react'
import { CONSTABLE_GALERIE, type WeddingLocation } from '@/lib/utils/maps'
import GoogleMapsService from '@/lib/utils/maps'

interface LocationDetailsCardProps {
  location?: WeddingLocation
  className?: string
  variant?: 'default' | 'compact' | 'preview'
  showActions?: boolean
}

export default function LocationDetailsCard({
  location = CONSTABLE_GALERIE,
  className = '',
  variant = 'default',
  showActions = true
}: LocationDetailsCardProps) {
  const handleDirections = () => {
    const directionsUrl = GoogleMapsService.generateDirectionsUrl(location.address)
    window.open(directionsUrl, '_blank')
  }

  const handleOpenMaps = () => {
    const mapsUrl = GoogleMapsService.generateGoogleMapsUrl(
      location.coordinates.lat,
      location.coordinates.lng
    )
    window.open(mapsUrl, '_blank')
  }

  const handleWhatsAppShare = () => {
    const whatsappUrl = GoogleMapsService.generateWhatsAppLocationMessage(location)
    window.open(whatsappUrl, '_blank')
  }

  if (variant === 'compact') {
    return (
      <motion.div
        className={`bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg ${className}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-start gap-4">
          <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-3 rounded-full flex-shrink-0">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-800 mb-1">{location.name}</h3>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{location.address}</p>
            <p className="text-xs text-gray-500">20 de Novembro de 2025 • 10:30h</p>
          </div>
        </div>

        {showActions && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleDirections}
              className="flex-1 bg-rose-500 hover:bg-rose-600 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center justify-center gap-1"
            >
              <Navigation className="w-3 h-3" />
              Direções
            </button>
            <button
              onClick={handleOpenMaps}
              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-200"
              title="Abrir no Google Maps"
            >
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        )}
      </motion.div>
    )
  }

  if (variant === 'preview') {
    return (
      <motion.div
        className={`bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-white/40 shadow-lg ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-2 rounded-full">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-800 text-sm">{location.name}</h4>
            <p className="text-xs text-gray-600">Eng. Luciano Cavalcante</p>
          </div>
        </div>

        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 text-purple-500" />
            <span>20 de Nov • 10:30h</span>
          </div>
          <div className="flex items-center gap-2">
            <Car className="w-3 h-3 text-blue-500" />
            <span>Estacionamento gratuito</span>
          </div>
        </div>

        {showActions && (
          <button
            onClick={handleDirections}
            className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 mt-3 flex items-center justify-center gap-1"
          >
            <Navigation className="w-3 h-3" />
            Ver Localização
          </button>
        )}
      </motion.div>
    )
  }

  // Default variant
  return (
    <motion.div
      className={`bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-xl ${className}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-start gap-4 mb-6">
        <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-4 rounded-full">
          <MapPin className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {location.name}
          </h3>
          {location.description && (
            <p className="text-gray-600 leading-relaxed mb-4">
              {location.description}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Address */}
        <div className="flex items-start gap-4">
          <div className="bg-gray-100 p-2 rounded-full">
            <MapPin className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <p className="font-medium text-gray-800 mb-1">Endereço</p>
            <p className="text-gray-600 text-sm leading-relaxed">{location.address}</p>
          </div>
        </div>

        {/* Date and Time */}
        <div className="flex items-start gap-4">
          <div className="bg-purple-100 p-2 rounded-full">
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <p className="font-medium text-gray-800 mb-1">Data e Horário</p>
            <p className="text-gray-600 text-sm">
              <strong>20 de Novembro de 2025</strong><br />
              Início às <strong>10:30h</strong> (Horário de Brasília)
            </p>
          </div>
        </div>

        {/* Parking */}
        {location.parkingInfo && (
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <Car className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-800 mb-1">Estacionamento</p>
              <p className="text-gray-600 text-sm">{location.parkingInfo}</p>
            </div>
          </div>
        )}

        {/* Phone */}
        {location.phoneNumber && (
          <div className="flex items-start gap-4">
            <div className="bg-green-100 p-2 rounded-full">
              <Phone className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-800 mb-1">Contato</p>
              <p className="text-gray-600 text-sm">{location.phoneNumber}</p>
            </div>
          </div>
        )}

        {/* Accessibility */}
        {location.accessibilityInfo && (
          <div className="flex items-start gap-4">
            <div className="bg-emerald-100 p-2 rounded-full">
              <Info className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="font-medium text-gray-800 mb-1">Acessibilidade</p>
              <p className="text-gray-600 text-sm">{location.accessibilityInfo}</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <button
            onClick={handleDirections}
            className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Navigation className="w-5 h-5" />
            Como Chegar
          </button>

          <button
            onClick={handleOpenMaps}
            className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <ExternalLink className="w-5 h-5" />
            Abrir no Maps
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Share2 className="w-5 h-5" />
            Compartilhar
          </button>
        </div>
      )}

      {/* Additional Info */}
      <div className="mt-8 p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-200">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-rose-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Informações Importantes</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Recomendamos chegar com 15-20 minutos de antecedência</li>
              <li>• Traje social solicitado</li>
              <li>• Local climatizado e acessível</li>
              <li>• Serviço de manobrista disponível</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  )
}