/**
 * Mobile-Optimized QR Code Invitation Component
 *
 * Features:
 * 📱 QR code scanning for instant RSVP access
 * 🇧🇷 WhatsApp sharing for Brazilian guests
 * 📧 Email sharing with beautiful templates
 * 💾 Download invitation as image
 * 🌟 Beautiful romantic design with animations
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  QrCode,
  Share2,
  Download,
  Mail,
  MessageCircle,
  Copy,
  Check,
  Heart,
  Calendar,
  MapPin,
  Clock,
  Smartphone
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Guest } from '@/types/wedding'
import {
  generateQRCodeData,
  generateWhatsAppShareURL,
  formatBrazilianDate
} from '@/lib/utils/wedding'

interface QRCodeInvitationProps {
  guest: Guest
  className?: string
}

export function QRCodeInvitation({ guest, className = '' }: QRCodeInvitationProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://thousandaysof.love'
  const rsvpUrl = `${baseUrl}/rsvp?code=${guest.invitation_code}`
  const qrCodeData = generateQRCodeData(guest.invitation_code, baseUrl)

  useEffect(() => {
    generateQRCode()
  }, [guest.invitation_code])

  const generateQRCode = async () => {
    setIsGenerating(true)
    try {
      // Using QR Server API for immediate functionality
      // TODO: Replace with local qrcode library for production
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrCodeData)}&bgcolor=FFFFFF&color=BE185D&margin=10`
      setQrCodeUrl(qrUrl)
    } catch (error) {
      console.error('Error generating QR code:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyInvitationCode = async () => {
    try {
      await navigator.clipboard.writeText(guest.invitation_code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error copying to clipboard:', error)
    }
  }

  const handleCopyRsvpUrl = async () => {
    try {
      await navigator.clipboard.writeText(rsvpUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error copying URL:', error)
    }
  }

  const handleWhatsAppShare = () => {
    const whatsappUrl = generateWhatsAppShareURL(guest.invitation_code, guest.name, baseUrl)
    window.open(whatsappUrl, '_blank')
  }

  const handleEmailShare = () => {
    const subject = encodeURIComponent('Convite para o Casamento de Hel & Ylana')
    const body = encodeURIComponent(
      `Olá!\n\n` +
      `Você está convidado(a) para o casamento de Hel & Ylana!\n\n` +
      `📅 Data: 20 de Novembro de 2025\n` +
      `⏰ Horário: 16:00h\n\n` +
      `Para confirmar sua presença, acesse:\n${rsvpUrl}\n\n` +
      `Código do convite: ${guest.invitation_code}\n\n` +
      `Não vemos a hora de celebrar com você! 💕\n\n` +
      `Hel & Ylana`
    )
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank')
  }

  const handleDownloadInvitation = async () => {
    try {
      // Create a beautiful invitation card for download
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Set canvas size for high quality
      canvas.width = 800
      canvas.height = 1200

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, '#f6e6f0')
      gradient.addColorStop(1, '#f0e6f6')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add wedding details (simplified for demo)
      ctx.fillStyle = '#BE185D'
      ctx.font = 'bold 48px Georgia'
      ctx.textAlign = 'center'
      ctx.fillText('Mil Dias de Amor', canvas.width / 2, 100)

      ctx.font = '32px Georgia'
      ctx.fillText('Hel & Ylana', canvas.width / 2, 160)

      ctx.font = '24px Georgia'
      ctx.fillStyle = '#64748B'
      ctx.fillText('20 de Novembro de 2025', canvas.width / 2, 220)
      ctx.fillText('16:00h', canvas.width / 2, 260)

      // Add QR code (if available)
      if (qrCodeUrl) {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          ctx.drawImage(img, canvas.width / 2 - 150, 350, 300, 300)

          // Add invitation code
          ctx.font = 'bold 32px monospace'
          ctx.fillStyle = '#BE185D'
          ctx.fillText(guest.invitation_code, canvas.width / 2, 720)

          // Add guest name
          ctx.font = '28px Georgia'
          ctx.fillStyle = '#1F2937'
          ctx.fillText(`Convite para: ${guest.name}`, canvas.width / 2, 800)

          // Download the canvas as image
          const link = document.createElement('a')
          link.download = `convite-casamento-${guest.name.replace(/\s+/g, '-').toLowerCase()}.png`
          link.href = canvas.toDataURL()
          link.click()
        }
        img.src = qrCodeUrl
      }
    } catch (error) {
      console.error('Error downloading invitation:', error)
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Hidden canvas for download functionality */}
      <canvas ref={canvasRef} className="hidden" />

      <Card className="glass p-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="space-y-2">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blush-400 to-blush-600 rounded-full mb-4"
            >
              <QrCode className="w-8 h-8 text-white" />
            </motion.div>

            <h3 className="text-2xl font-playfair font-bold text-burgundy-800">
              Convite Digital
            </h3>
            <p className="text-burgundy-600">
              Escaneie o QR Code para confirmar presença instantaneamente
            </p>
          </div>

          {/* Wedding Details Card */}
          <div className="bg-blush-50 border border-blush-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-center space-x-2 text-burgundy-800">
              <Heart className="w-5 h-5 text-blush-500" fill="currentColor" />
              <span className="font-semibold">Casamento Hel & Ylana</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex flex-col items-center space-y-2">
                <Calendar className="w-5 h-5 text-blush-500" />
                <span className="font-medium text-burgundy-700">Data</span>
                <span className="text-burgundy-600">20 de Novembro</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Clock className="w-5 h-5 text-blush-500" />
                <span className="font-medium text-burgundy-700">Horário</span>
                <span className="text-burgundy-600">16:00h</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <MapPin className="w-5 h-5 text-blush-500" />
                <span className="font-medium text-burgundy-700">Local</span>
                <span className="text-burgundy-600">Em breve</span>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl shadow-lg inline-block">
              {isGenerating ? (
                <div className="w-[250px] h-[250px] flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-4 border-blush-200 border-t-blush-500 rounded-full"
                  />
                </div>
              ) : qrCodeUrl ? (
                <motion.img
                  src={qrCodeUrl}
                  alt="QR Code do Convite"
                  className="w-[250px] h-[250px] rounded-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                />
              ) : (
                <div className="w-[250px] h-[250px] flex items-center justify-center bg-gray-100 rounded-lg">
                  <QrCode className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex items-center justify-center space-x-2 text-sm text-burgundy-600">
              <Smartphone className="w-4 h-4" />
              <span>Aponte a câmera do celular para o QR Code</span>
            </div>
          </div>

          {/* Invitation Code */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-burgundy-700">
              Ou use seu código de convite:
            </p>
            <div className="flex items-center justify-center space-x-2">
              <code className="bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg font-mono text-lg font-bold text-blue-700">
                {guest.invitation_code}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyInvitationCode}
                className="h-10"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Share Options */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center space-x-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Compartilhar Convite</span>
              </Button>
            </div>

            <AnimatePresence>
              {showShareMenu && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-3"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleWhatsAppShare}
                    className="flex flex-col items-center space-y-1 h-auto py-3"
                  >
                    <MessageCircle className="w-5 h-5 text-green-600" />
                    <span className="text-xs">WhatsApp</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEmailShare}
                    className="flex flex-col items-center space-y-1 h-auto py-3"
                  >
                    <Mail className="w-5 h-5 text-blue-600" />
                    <span className="text-xs">Email</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyRsvpUrl}
                    className="flex flex-col items-center space-y-1 h-auto py-3"
                  >
                    <Copy className="w-5 h-5 text-purple-600" />
                    <span className="text-xs">Copiar Link</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadInvitation}
                    className="flex flex-col items-center space-y-1 h-auto py-3"
                  >
                    <Download className="w-5 h-5 text-orange-600" />
                    <span className="text-xs">Baixar</span>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Direct RSVP Link */}
          <div className="pt-4 border-t border-blush-200">
            <Button
              variant="romantic"
              size="lg"
              onClick={() => window.open(rsvpUrl, '_blank')}
              className="w-full"
            >
              ✨ Confirmar Presença Agora
            </Button>
          </div>

          {/* Guest Info */}
          <div className="text-sm text-burgundy-600">
            <p>Convite especial para:</p>
            <p className="font-semibold text-burgundy-800">{guest.name}</p>
            {guest.family_group_id && (
              <p className="text-xs text-burgundy-500 mt-1">
                Convite familiar • Válido para toda a família
              </p>
            )}
          </div>
        </motion.div>
      </Card>
    </div>
  )
}

export default QRCodeInvitation
