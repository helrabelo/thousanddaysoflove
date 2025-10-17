'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Navigation, ExternalLink } from 'lucide-react'
import GoogleMapsService, { CONSTABLE_GALERIE, type WeddingLocation } from '@/lib/utils/maps'

interface GoogleMapProps {
  location?: WeddingLocation
  height?: string
  className?: string
  showControls?: boolean
  showDirections?: boolean
}

export default function GoogleMap({
  location = CONSTABLE_GALERIE,
  height = '400px',
  className = '',
  showControls = true,
  showDirections = true
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mapsService] = useState(() => new GoogleMapsService())

  useEffect(() => {
    async function initializeMap() {
      if (!mapRef.current) return

      try {
        setIsLoading(true)
        setError(null)

        const map = await mapsService.createMap(mapRef.current, location, {
          zoom: 16,
          gestureHandling: 'cooperative'
        })

        if (!map) {
          throw new Error('Falha ao carregar o Google Maps')
        }

        setIsLoading(false)
      } catch (err) {
        setError('Não foi possível carregar o mapa. Tente novamente.')
        setIsLoading(false)
      }
    }

    initializeMap()
  }, [location, mapsService])

  const handleDirections = () => {
    const directionsUrl = GoogleMapsService.generateDirectionsUrl(location.address)
    window.open(directionsUrl, '_blank')
  }

  const handleOpenInGoogleMaps = () => {
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

  if (error) {
    return (
      <motion.div
        className={`relative ${className}`}
        style={{ height }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center border border-gray-300">
          <div className="text-center p-6">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={handleOpenInGoogleMaps}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              <ExternalLink className="w-4 h-4" />
              Abrir no Google Maps
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ height }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center z-10 border border-gray-300">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 text-sm">Carregando mapa...</p>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div
        ref={mapRef}
        className="w-full h-full rounded-2xl overflow-hidden border border-white/30 shadow-lg"
        style={{ minHeight: height }}
      />

      {/* Controls Overlay */}
      {showControls && !isLoading && !error && (
        <motion.div
          className="absolute top-4 right-4 flex flex-col gap-2 z-10"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          {showDirections && (
            <button
              onClick={handleDirections}
              className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
              title="Como Chegar"
            >
              <Navigation className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={handleOpenInGoogleMaps}
            className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
            title="Abrir no Google Maps"
          >
            <ExternalLink className="w-5 h-5" />
          </button>
        </motion.div>
      )}

      {/* Mobile-friendly controls at bottom */}
      {showDirections && (
        <motion.div
          className="absolute bottom-4 left-4 right-4 md:hidden z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.4 }}
        >
          <div className="flex gap-2">
            <button
              onClick={handleDirections}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
            >
              <Navigation className="w-4 h-4" />
              Como Chegar
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
              title="Compartilhar no WhatsApp"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

// Location Info Badge Component
export function LocationInfoBadge({ location = CONSTABLE_GALERIE }: { location?: WeddingLocation }) {
  return (
    <motion.div
      className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-start gap-3">
        <div className="bg-gray-500 p-2 rounded-full">
          <MapPin className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-800 text-sm">{location.name}</h4>
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{location.address}</p>
        </div>
      </div>
    </motion.div>
  )
}