'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, FileImage, Users } from 'lucide-react'
import Image from 'next/image'
import { toPng, toJpeg } from 'html-to-image'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { createClient } from '@/lib/supabase/client'

// Asset components
import GuestNameCard from '@/components/assets/GuestNameCard'
import ThankYouBox from '@/components/assets/ThankYouBox'
import MenuCard from '@/components/assets/MenuCard'

interface Guest {
  id: string
  name: string
  attending: boolean
}

export default function MateriaisPage() {
  const [guestName, setGuestName] = useState('Nome do Convidado')
  const [tableNumber, setTableNumber] = useState('5')
  const [attendingGuests, setAttendingGuests] = useState<Guest[]>([])
  const [isLoadingGuests, setIsLoadingGuests] = useState(false)
  const [isBulkDownloading, setIsBulkDownloading] = useState(false)

  const nameCardRef = useRef<HTMLDivElement>(null)
  const thankYouBoxRef = useRef<HTMLDivElement>(null)
  const menuCardRef = useRef<HTMLDivElement>(null)
  const bulkCardRef = useRef<HTMLDivElement>(null)

  const supabase = createClient()

  // Fetch attending guests on mount
  useEffect(() => {
    fetchAttendingGuests()
  }, [])

  const fetchAttendingGuests = async () => {
    setIsLoadingGuests(true)
    try {
      const { data, error } = await supabase
        .from('simple_guests')
        .select('id, name, attending')
        .eq('attending', true)
        .order('name')

      if (error) throw error
      setAttendingGuests(data || [])
    } catch (error) {
      console.error('Error fetching guests:', error)
    } finally {
      setIsLoadingGuests(false)
    }
  }

  const downloadAsset = async (
    ref: React.RefObject<HTMLDivElement>,
    filename: string,
    format: 'png' | 'jpg'
  ) => {
    if (!ref.current) return

    try {
      const dataUrl = format === 'png'
        ? await toPng(ref.current, { quality: 1, pixelRatio: 3 })
        : await toJpeg(ref.current, { quality: 0.95, pixelRatio: 3 })

      const link = document.createElement('a')
      link.download = `${filename}.${format}`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Error generating image:', error)
    }
  }

  const downloadAllGuestCards = async () => {
    if (!bulkCardRef.current || attendingGuests.length === 0) return

    setIsBulkDownloading(true)
    const zip = new JSZip()

    try {
      // Create a temporary container for rendering cards
      const tempContainer = document.createElement('div')
      tempContainer.style.position = 'absolute'
      tempContainer.style.left = '-9999px'
      tempContainer.style.top = '-9999px'
      document.body.appendChild(tempContainer)

      for (let i = 0; i < attendingGuests.length; i++) {
        const guest = attendingGuests[i]

        // Update progress (optional - you could show this to user)
        console.log(`Generating card ${i + 1}/${attendingGuests.length}: ${guest.name}`)

        // Create a temporary element with the guest card
        const cardElement = document.createElement('div')
        tempContainer.appendChild(cardElement)

        // Dynamically import and render the card (simplified approach)
        cardElement.innerHTML = bulkCardRef.current.innerHTML
        const nameElement = cardElement.querySelector('h2')
        if (nameElement) {
          nameElement.textContent = guest.name
        }

        // Generate image
        await new Promise(resolve => setTimeout(resolve, 100)) // Small delay for rendering
        const dataUrl = await toPng(cardElement, { quality: 1, pixelRatio: 3 })

        // Convert data URL to blob
        const response = await fetch(dataUrl)
        const blob = await response.blob()

        // Add to zip with sanitized filename
        const sanitizedName = guest.name
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove accents
          .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special chars
          .replace(/\s+/g, '-') // Replace spaces with dashes
          .toLowerCase()

        zip.file(`marcador-${sanitizedName}.png`, blob)

        // Clean up
        tempContainer.removeChild(cardElement)
      }

      // Remove temporary container
      document.body.removeChild(tempContainer)

      // Generate and download zip
      const content = await zip.generateAsync({ type: 'blob' })
      saveAs(content, `marcadores-mesa-todos-convidados-${attendingGuests.length}.zip`)
    } catch (error) {
      console.error('Error generating bulk download:', error)
      alert('Erro ao gerar os marcadores. Tente novamente.')
    } finally {
      setIsBulkDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-heading text-4xl md:text-5xl text-[var(--primary-text)] mb-4">
            Materiais para Impressão
          </h1>
          <p className="text-lg text-[var(--secondary-text)] font-body italic">
            Baixe os materiais personalizados para o nosso casamento
          </p>
        </motion.div>

        {/* Guest Name Card - Table Number */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-20"
        >
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <FileImage className="h-6 w-6 text-[var(--decorative)]" />
              <h2 className="font-heading text-2xl text-[var(--primary-text)]">
                Marcador de Mesa
              </h2>
            </div>

            <p className="text-[var(--secondary-text)] mb-6 font-body">
              Proporção 5:9 - Marcador de mesa dobrável. A metade superior (com logo invertido) fica virada para os outros convidados quando dobrado, enquanto a metade inferior (com o nome) fica virada para o convidado.
            </p>

            {/* Customization Controls */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-[var(--secondary-text)] mb-2">
                Nome do Convidado
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full px-4 py-2 border border-[var(--decorative)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--decorative)]"
                placeholder="Nome do Convidado"
              />
            </div>

            {/* Preview */}
            <div className="bg-[var(--accent)] p-8 rounded-lg mb-6 flex justify-center">
              <div ref={nameCardRef}>
                <GuestNameCard name={guestName} tableNumber={tableNumber} />
              </div>
            </div>

            {/* Download Buttons */}
            <div className="flex gap-4 justify-center mb-6">
              <button
                onClick={() => downloadAsset(nameCardRef, `marcador-mesa-${guestName.replace(/\s+/g, '-').toLowerCase()}`, 'png')}
                className="flex items-center gap-2 px-6 py-3 bg-[var(--primary-text)] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Download className="h-4 w-4" />
                Baixar PNG
              </button>
              <button
                onClick={() => downloadAsset(nameCardRef, `marcador-mesa-${guestName.replace(/\s+/g, '-').toLowerCase()}`, 'jpg')}
                className="flex items-center gap-2 px-6 py-3 bg-[var(--secondary-text)] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Download className="h-4 w-4" />
                Baixar JPG
              </button>
            </div>

            {/* Bulk Download Section */}
            <div className="border-t border-[var(--decorative)] pt-6 mt-6">
              <div className="text-center mb-4">
                <h3 className="font-heading text-lg text-[var(--primary-text)] mb-2">
                  Download em Massa
                </h3>
                <p className="text-sm text-[var(--secondary-text)] font-body">
                  {isLoadingGuests ? (
                    'Carregando convidados...'
                  ) : (
                    `${attendingGuests.length} convidados confirmados no Supabase`
                  )}
                </p>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={downloadAllGuestCards}
                  disabled={isBulkDownloading || attendingGuests.length === 0}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[var(--primary-text)] to-[var(--secondary-text)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isBulkDownloading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Gerando {attendingGuests.length} marcadores...</span>
                    </>
                  ) : (
                    <>
                      <Users className="h-5 w-5" />
                      <span>Baixar Todos os {attendingGuests.length} Marcadores (ZIP)</span>
                    </>
                  )}
                </button>
              </div>

              {attendingGuests.length > 0 && !isBulkDownloading && (
                <p className="text-xs text-[var(--secondary-text)] text-center mt-3 font-body italic">
                  💡 Isso vai gerar um arquivo ZIP com {attendingGuests.length} marcadores personalizados
                </p>
              )}
            </div>

            {/* Hidden bulk render template */}
            <div ref={bulkCardRef} className="hidden">
              <GuestNameCard name={guestName} tableNumber={tableNumber} />
            </div>
          </div>
        </motion.section>

        {/* Thank You Chocolate Box */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <FileImage className="h-6 w-6 text-[var(--decorative)]" />
              <h2 className="font-heading text-2xl text-[var(--primary-text)]">
                Etiqueta Caixa de Chocolate
              </h2>
            </div>

            <p className="text-[var(--secondary-text)] mb-6 font-body">
              Proporção 4,5:5,5 - Perfeita para caixinhas de chocolate de agradecimento
            </p>

            {/* Preview */}
            <div className="bg-[var(--accent)] p-8 rounded-lg mb-6 flex justify-center">
              <div ref={thankYouBoxRef}>
                <ThankYouBox />
              </div>
            </div>

            {/* Download Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => downloadAsset(thankYouBoxRef, 'etiqueta-chocolate-agradecimento', 'png')}
                className="flex items-center gap-2 px-6 py-3 bg-[var(--primary-text)] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Download className="h-4 w-4" />
                Baixar PNG
              </button>
              <button
                onClick={() => downloadAsset(thankYouBoxRef, 'etiqueta-chocolate-agradecimento', 'jpg')}
                className="flex items-center gap-2 px-6 py-3 bg-[var(--secondary-text)] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Download className="h-4 w-4" />
                Baixar JPG
              </button>
            </div>
          </div>
        </motion.section>

        {/* Menu Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-20"
        >
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <FileImage className="h-6 w-6 text-[var(--decorative)]" />
              <h2 className="font-heading text-2xl text-[var(--primary-text)]">
                Menu do Dia
              </h2>
            </div>

            <p className="text-[var(--secondary-text)] mb-6 font-body">
              Dimensão 99mm x 210mm (DL) - Menu frente e verso. A frente tem o título elegante e a mensagem, o verso contém todos os pratos detalhados de forma compacta.
            </p>

            {/* Preview */}
            <div className="bg-[var(--accent)] p-8 rounded-lg mb-6 flex justify-center overflow-x-auto">
              <div ref={menuCardRef}>
                <MenuCard />
              </div>
            </div>

            <p className="text-sm text-[var(--secondary-text)] mb-6 text-center font-body italic">
              💡 Ao baixar, você terá a frente e o verso lado a lado. Imprima frente e verso para o resultado final.
            </p>

            {/* Download Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => downloadAsset(menuCardRef, 'menu-casamento-frente-verso', 'png')}
                className="flex items-center gap-2 px-6 py-3 bg-[var(--primary-text)] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Download className="h-4 w-4" />
                Baixar PNG (Frente + Verso)
              </button>
              <button
                onClick={() => downloadAsset(menuCardRef, 'menu-casamento-frente-verso', 'jpg')}
                className="flex items-center gap-2 px-6 py-3 bg-[var(--secondary-text)] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Download className="h-4 w-4" />
                Baixar JPG (Frente + Verso)
              </button>
            </div>
          </div>
        </motion.section>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-lg p-8 text-center"
        >
          <h3 className="font-heading text-xl text-[var(--primary-text)] mb-4">
            Dicas para Impressão
          </h3>
          <div className="text-[var(--secondary-text)] font-body space-y-2">
            <p>• Use papel de alta qualidade (mínimo 180g/m²)</p>
            <p>• Imprima em alta resolução para melhores resultados</p>
            <p>• Para o menu, considere papel couché ou vegetal</p>
            <p>• Baixe em PNG para preservar transparências</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
