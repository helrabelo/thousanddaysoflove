'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, FileImage, Users, Map } from 'lucide-react'
import Image from 'next/image'
import { toPng, toJpeg } from 'html-to-image'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { createClient } from '@/lib/supabase/client'
import type { TableWithGuests } from '@/types/wedding'

// Asset components
import GuestNameCard from '@/components/assets/GuestNameCard'
import ThankYouBox from '@/components/assets/ThankYouBox'
import MenuCard from '@/components/assets/MenuCard'
import SeatingChartPrintable from '@/components/seating/SeatingChartPrintable'

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
  const [seatingTables, setSeatingTables] = useState<TableWithGuests[]>([])
  const [isLoadingTables, setIsLoadingTables] = useState(false)
  const [showGuestNames, setShowGuestNames] = useState(false)

  const nameCardRef = useRef<HTMLDivElement>(null)
  const thankYouBoxRef = useRef<HTMLDivElement>(null)
  const menuCardRef = useRef<HTMLDivElement>(null)
  const bulkCardRef = useRef<HTMLDivElement>(null)
  const seatingChartRef = useRef<HTMLDivElement>(null)

  const supabase = createClient()

  // Fetch attending guests and tables on mount
  useEffect(() => {
    fetchAttendingGuests()
    fetchSeatingTables()
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

  const fetchSeatingTables = async () => {
    setIsLoadingTables(true)
    try {
      // Fetch all tables
      const { data: tables, error: tablesError } = await supabase
        .from('tables')
        .select('*')
        .order('table_number')

      if (tablesError) throw tablesError

      // Fetch all invitations with table assignments
      const { data: invitations, error: invError } = await supabase
        .from('invitations')
        .select('guest_name, guest_email, plus_one_allowed, plus_one_name, rsvp_completed, dietary_restrictions, table_number')
        .not('table_number', 'is', null)
        .order('guest_name')

      if (invError) throw invError

      // Map tables with guests
      const tablesWithGuests: TableWithGuests[] = (tables || []).map((table) => {
        const tableGuests = (invitations || [])
          .filter((inv) => inv.table_number === table.table_number)
          .map((inv) => ({
            guest_name: inv.guest_name,
            guest_email: inv.guest_email || undefined,
            plus_one_allowed: inv.plus_one_allowed || false,
            plus_one_name: inv.plus_one_name || undefined,
            rsvp_completed: inv.rsvp_completed || false,
            dietary_restrictions: inv.dietary_restrictions || undefined,
          }))

        const confirmedGuests = tableGuests.filter((g) => g.rsvp_completed).length

        return {
          ...table,
          guests: tableGuests,
          assigned_guests: tableGuests.length,
          confirmed_guests: confirmedGuests,
        }
      })

      setSeatingTables(tablesWithGuests)
    } catch (error) {
      console.error('Error fetching tables:', error)
    } finally {
      setIsLoadingTables(false)
    }
  }

  const downloadAsset = async (
    ref: React.RefObject<HTMLDivElement>,
    filename: string,
    format: 'png' | 'jpg' | 'pdf'
  ) => {
    if (!ref.current) return

    try {
      if (format === 'pdf') {
        // Use html2canvas for PDF generation
        const canvas = await html2canvas(ref.current, {
          scale: 2,
          useCORS: true,
          logging: false,
        })

        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        })

        const imgWidth = 210 // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
        pdf.save(`${filename}.pdf`)
      } else {
        const dataUrl = format === 'png'
          ? await toPng(ref.current, { quality: 1, pixelRatio: 3 })
          : await toJpeg(ref.current, { quality: 0.95, pixelRatio: 3 })

        const link = document.createElement('a')
        link.download = `${filename}.${format}`
        link.href = dataUrl
        link.click()
      }
    } catch (error) {
      console.error('Error generating file:', error)
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
            <div className="flex flex-wrap gap-4 justify-center mb-6">
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
              <button
                onClick={() => downloadAsset(nameCardRef, `marcador-mesa-${guestName.replace(/\s+/g, '-').toLowerCase()}`, 'pdf')}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Download className="h-4 w-4" />
                Baixar PDF
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
            <div className="flex flex-wrap gap-4 justify-center">
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
              <button
                onClick={() => downloadAsset(thankYouBoxRef, 'etiqueta-chocolate-agradecimento', 'pdf')}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Download className="h-4 w-4" />
                Baixar PDF
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
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => downloadAsset(menuCardRef, 'menu-casamento-frente-verso', 'png')}
                className="flex items-center gap-2 px-6 py-3 bg-[var(--primary-text)] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Download className="h-4 w-4" />
                Baixar PNG
              </button>
              <button
                onClick={() => downloadAsset(menuCardRef, 'menu-casamento-frente-verso', 'jpg')}
                className="flex items-center gap-2 px-6 py-3 bg-[var(--secondary-text)] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Download className="h-4 w-4" />
                Baixar JPG
              </button>
              <button
                onClick={() => downloadAsset(menuCardRef, 'menu-casamento-frente-verso', 'pdf')}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Download className="h-4 w-4" />
                Baixar PDF
              </button>
            </div>
          </div>
        </motion.section>

        {/* Seating Chart - Table Map */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-20"
        >
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Map className="h-6 w-6 text-[var(--decorative)]" />
              <h2 className="font-heading text-2xl text-[var(--primary-text)]">
                Mapa de Mesas
              </h2>
            </div>

            <p className="text-[var(--secondary-text)] mb-6 font-body">
              Formato A3 (297mm x 420mm) - Layout completo do salão com todas as mesas
            </p>

            {/* Show guest names toggle */}
            <div className="mb-6 flex items-center justify-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showGuestNames}
                  onChange={(e) => setShowGuestNames(e.target.checked)}
                  className="w-4 h-4 text-[var(--primary-text)] border-[var(--decorative)] rounded focus:ring-2 focus:ring-[var(--decorative)]"
                />
                <span className="text-sm font-medium text-[var(--secondary-text)]">
                  Incluir nomes dos convidados
                </span>
              </label>
            </div>

            {/* Preview */}
            {isLoadingTables ? (
              <div className="bg-[var(--accent)] p-8 rounded-lg mb-6 flex justify-center items-center min-h-[400px]">
                <div className="text-center">
                  <div className="h-8 w-8 border-2 border-[var(--primary-text)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-[var(--secondary-text)] font-body">Carregando mapa de mesas...</p>
                </div>
              </div>
            ) : seatingTables.length > 0 ? (
              <div className="bg-[var(--accent)] p-8 rounded-lg mb-6">
                <div ref={seatingChartRef}>
                  <SeatingChartPrintable
                    tables={seatingTables}
                    showGuestNames={showGuestNames}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-[var(--accent)] p-8 rounded-lg mb-6 text-center">
                <p className="text-[var(--secondary-text)] font-body">
                  Nenhuma mesa configurada ainda.
                </p>
              </div>
            )}

            {/* Download Buttons */}
            {seatingTables.length > 0 && (
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={() => downloadAsset(seatingChartRef, 'mapa-mesas-casamento', 'png')}
                  className="flex items-center gap-2 px-6 py-3 bg-[var(--primary-text)] text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Download className="h-4 w-4" />
                  Baixar PNG
                </button>
                <button
                  onClick={() => downloadAsset(seatingChartRef, 'mapa-mesas-casamento', 'jpg')}
                  className="flex items-center gap-2 px-6 py-3 bg-[var(--secondary-text)] text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Download className="h-4 w-4" />
                  Baixar JPG
                </button>
                <button
                  onClick={() => downloadAsset(seatingChartRef, 'mapa-mesas-casamento', 'pdf')}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Download className="h-4 w-4" />
                  Baixar PDF (A3)
                </button>
              </div>
            )}

            {seatingTables.length > 0 && (
              <p className="text-sm text-[var(--secondary-text)] text-center mt-4 font-body italic">
                💡 Total: {seatingTables.reduce((sum, t) => sum + t.assigned_guests, 0)} convidados em {seatingTables.length} mesas
              </p>
            )}
          </div>
        </motion.section>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
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
            <p>• PDF é recomendado para impressão em gráficas (formato padrão)</p>
            <p>• Para o mapa de mesas, imprima em A3 para melhor visualização</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
