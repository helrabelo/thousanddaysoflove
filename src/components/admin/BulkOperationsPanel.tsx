/**
 * Bulk Operations Panel for Advanced Wedding Guest Management
 *
 * Features:
 * 📧 Bulk invitation code generation
 * 🔄 Mass email sending (invitations, reminders)
 * 📊 Import/Export guest lists
 * 👥 Family group creation
 * 📱 QR code batch generation
 * 🇧🇷 Brazilian data import from CSV/Excel
 */

'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Mail,
  Download,
  Upload,
  QrCode,
  UserPlus,
  Send,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  Heart,
  Family,
  MessageSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Guest, FamilyGroup } from '@/types/wedding'
import EnhancedGuestService from '@/lib/services/enhanced-guests'
import EmailAutomationService from '@/lib/services/email-automation'

interface BulkOperationsResult {
  success: number
  failed: number
  errors: string[]
}

interface BulkOperationsPanelProps {
  guests: Guest[]
  selectedGuestIds: string[]
  onRefreshGuests: () => void
  className?: string
}

export function BulkOperationsPanel({
  guests,
  selectedGuestIds,
  onRefreshGuests,
  className = ''
}: BulkOperationsPanelProps) {
  const [activeOperation, setActiveOperation] = useState<string | null>(null)
  const [operationResult, setOperationResult] = useState<BulkOperationsResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const selectedGuests = guests.filter(guest => selectedGuestIds.includes(guest.id))

  // ====================
  // BULK EMAIL OPERATIONS
  // ====================

  const handleBulkSendInvitations = async () => {
    setIsLoading(true)
    setActiveOperation('invitations')
    setOperationResult(null)

    try {
      const result: BulkOperationsResult = { success: 0, failed: 0, errors: [] }

      for (const guest of selectedGuests) {
        if (!guest.invitation_sent_date) {
          const success = await EmailAutomationService.sendInvitationEmail(guest)
          if (success) {
            result.success++
          } else {
            result.failed++
            result.errors.push(`Falha ao enviar convite para ${guest.name}`)
          }
        } else {
          result.errors.push(`${guest.name} já recebeu convite`)
        }

        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      setOperationResult(result)
      onRefreshGuests()
    } catch (error) {
      console.error('Bulk invitation error:', error)
      setOperationResult({
        success: 0,
        failed: selectedGuests.length,
        errors: ['Erro interno ao enviar convites']
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkSendReminders = async () => {
    setIsLoading(true)
    setActiveOperation('reminders')
    setOperationResult(null)

    try {
      const result: BulkOperationsResult = { success: 0, failed: 0, errors: [] }
      const pendingGuests = selectedGuests.filter(guest => guest.attending === null)

      for (const guest of pendingGuests) {
        if (guest.rsvp_reminder_count < 3) {
          const success = await EmailAutomationService.sendReminderEmail(guest, guest.rsvp_reminder_count + 1)
          if (success) {
            result.success++
          } else {
            result.failed++
            result.errors.push(`Falha ao enviar lembrete para ${guest.name}`)
          }
        } else {
          result.errors.push(`${guest.name} já recebeu 3 lembretes`)
        }

        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      setOperationResult(result)
      onRefreshGuests()
    } catch (error) {
      console.error('Bulk reminder error:', error)
      setOperationResult({
        success: 0,
        failed: pendingGuests.length,
        errors: ['Erro interno ao enviar lembretes']
      })
    } finally {
      setIsLoading(false)
    }
  }

  // ====================
  // INVITATION CODE OPERATIONS
  // ====================

  const handleGenerateBulkCodes = async () => {
    setIsLoading(true)
    setActiveOperation('codes')
    setOperationResult(null)

    try {
      const codeCount = 50 // Generate 50 codes at a time
      const codes = await EnhancedGuestService.generateBulkCodes(codeCount, 'individual')

      setOperationResult({
        success: codes.length,
        failed: codeCount - codes.length,
        errors: codes.length < codeCount ? ['Alguns códigos não puderam ser gerados'] : []
      })
    } catch (error) {
      console.error('Bulk code generation error:', error)
      setOperationResult({
        success: 0,
        failed: 50,
        errors: ['Erro ao gerar códigos de convite']
      })
    } finally {
      setIsLoading(false)
    }
  }

  // ====================
  // FAMILY GROUP OPERATIONS
  // ====================

  const handleCreateFamilyGroups = async () => {
    setIsLoading(true)
    setActiveOperation('families')
    setOperationResult(null)

    try {
      const result: BulkOperationsResult = { success: 0, failed: 0, errors: [] }

      // Group guests by family name heuristic (same last name)
      const familyGroups = new Map<string, Guest[]>()

      selectedGuests.forEach(guest => {
        const lastName = guest.name.split(' ').pop()?.toLowerCase() || ''
        if (lastName) {
          if (!familyGroups.has(lastName)) {
            familyGroups.set(lastName, [])
          }
          familyGroups.get(lastName)!.push(guest)
        }
      })

      // Create family groups for families with 2+ members
      for (const [familyName, members] of familyGroups) {
        if (members.length >= 2) {
          try {
            const familyGroup = await EnhancedGuestService.createFamilyGroup(
              `Família ${familyName.charAt(0).toUpperCase() + familyName.slice(1)}`,
              members.length
            )

            if (familyGroup) {
              // Add all members to the family group
              for (const member of members) {
                await EnhancedGuestService.addGuestToFamily(member.id, familyGroup.id)
              }
              result.success++
            } else {
              result.failed++
              result.errors.push(`Falha ao criar grupo familiar ${familyName}`)
            }
          } catch (error) {
            result.failed++
            result.errors.push(`Erro ao processar família ${familyName}`)
          }
        }
      }

      setOperationResult(result)
      onRefreshGuests()
    } catch (error) {
      console.error('Family group creation error:', error)
      setOperationResult({
        success: 0,
        failed: 1,
        errors: ['Erro interno ao criar grupos familiares']
      })
    } finally {
      setIsLoading(false)
    }
  }

  // ====================
  // IMPORT/EXPORT OPERATIONS
  // ====================

  const handleExportGuestList = async () => {
    setIsLoading(true)
    setActiveOperation('export')

    try {
      const csvContent = await EnhancedGuestService.exportGuestsCSV()
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `lista-convidados-${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }

      setOperationResult({
        success: guests.length,
        failed: 0,
        errors: []
      })
    } catch (error) {
      console.error('Export error:', error)
      setOperationResult({
        success: 0,
        failed: 1,
        errors: ['Erro ao exportar lista de convidados']
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImportGuestList = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setActiveOperation('import')
    setOperationResult(null)

    try {
      const text = await file.text()
      const lines = text.split('\\n').filter(line => line.trim())
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim())

      const result: BulkOperationsResult = { success: 0, failed: 0, errors: [] }

      // Skip header row
      for (let i = 1; i < lines.length; i++) {
        try {
          const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim())
          const guestData: Partial<Guest> = {}

          // Map CSV columns to guest fields
          headers.forEach((header, index) => {
            const value = values[index]
            switch (header.toLowerCase()) {
              case 'nome':
              case 'name':
                guestData.name = value
                break
              case 'email':
                guestData.email = value
                break
              case 'telefone':
              case 'phone':
                guestData.phone = value
                break
              case 'tipo':
              case 'guest_type':
                guestData.guest_type = value as any
                break
            }
          })

          // Validate required fields
          if (!guestData.name || !guestData.email) {
            result.failed++
            result.errors.push(`Linha ${i + 1}: Nome e email são obrigatórios`)
            continue
          }

          // Create guest
          const newGuest = await EnhancedGuestService.createGuest({
            name: guestData.name,
            email: guestData.email,
            phone: guestData.phone,
            attending: null,
            guest_type: guestData.guest_type || 'individual',
            rsvp_reminder_count: 0,
            communication_preferences: {
              email_notifications: true,
              whatsapp_notifications: true,
              sms_notifications: false,
              language: 'pt-BR',
              preferred_time: 'afternoon'
            },
            email_delivery_status: 'pending'
          } as any)

          if (newGuest) {
            result.success++
          } else {
            result.failed++
            result.errors.push(`Linha ${i + 1}: Falha ao criar convidado`)
          }
        } catch (error) {
          result.failed++
          result.errors.push(`Linha ${i + 1}: Erro de formatação`)
        }
      }

      setOperationResult(result)
      onRefreshGuests()
    } catch (error) {
      console.error('Import error:', error)
      setOperationResult({
        success: 0,
        failed: 1,
        errors: ['Erro ao processar arquivo CSV']
      })
    } finally {
      setIsLoading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // ====================
  // WHATSAPP OPERATIONS
  // ====================

  const handleBulkWhatsAppReminders = async () => {
    setIsLoading(true)
    setActiveOperation('whatsapp')
    setOperationResult(null)

    try {
      const result: BulkOperationsResult = { success: 0, failed: 0, errors: [] }
      const guestsWithPhone = selectedGuests.filter(guest => guest.phone && guest.attending === null)

      for (const guest of guestsWithPhone) {
        // For now, just generate WhatsApp URLs (actual sending would require WhatsApp Business API)
        const whatsappUrl = EnhancedGuestService.generateWhatsAppInvitation(guest)
        if (process.env.NODE_ENV === 'development') {
          console.log(`WhatsApp reminder for ${guest.name}:`, whatsappUrl)
        }
        result.success++

        // Track the attempt
        await EnhancedGuestService.trackEvent(guest.id, 'whatsapp_reminder_generated', {
          phone: guest.phone
        })
      }

      if (guestsWithPhone.length === 0) {
        result.errors.push('Nenhum convidado selecionado possui telefone cadastrado')
      }

      setOperationResult(result)
    } catch (error) {
      console.error('WhatsApp bulk error:', error)
      setOperationResult({
        success: 0,
        failed: selectedGuests.length,
        errors: ['Erro ao gerar lembretes WhatsApp']
      })
    } finally {
      setIsLoading(false)
    }
  }

  const operations = [
    {
      id: 'invitations',
      title: 'Enviar Convites',
      description: 'Enviar convites por email para convidados selecionados',
      icon: Mail,
      color: 'bg-blue-500',
      action: handleBulkSendInvitations,
      disabled: selectedGuestIds.length === 0,
      count: selectedGuests.filter(g => !g.invitation_sent_date).length
    },
    {
      id: 'reminders',
      title: 'Enviar Lembretes',
      description: 'Enviar lembretes RSVP para convidados pendentes',
      icon: Send,
      color: 'bg-orange-500',
      action: handleBulkSendReminders,
      disabled: selectedGuests.filter(g => g.attending === null && g.rsvp_reminder_count < 3).length === 0,
      count: selectedGuests.filter(g => g.attending === null && g.rsvp_reminder_count < 3).length
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      description: 'Gerar links de lembrete para WhatsApp',
      icon: MessageSquare,
      color: 'bg-green-500',
      action: handleBulkWhatsAppReminders,
      disabled: selectedGuests.filter(g => g.phone && g.attending === null).length === 0,
      count: selectedGuests.filter(g => g.phone && g.attending === null).length
    },
    {
      id: 'codes',
      title: 'Gerar Códigos',
      description: 'Gerar 50 códigos de convite em lote',
      icon: QrCode,
      color: 'bg-purple-500',
      action: handleGenerateBulkCodes,
      disabled: false,
      count: 50
    },
    {
      id: 'families',
      title: 'Grupos Familiares',
      description: 'Criar grupos familiares automaticamente',
      icon: Family,
      color: 'bg-pink-500',
      action: handleCreateFamilyGroups,
      disabled: selectedGuestIds.length < 2,
      count: Math.floor(selectedGuestIds.length / 2)
    },
    {
      id: 'export',
      title: 'Exportar CSV',
      description: 'Baixar lista completa de convidados',
      icon: Download,
      color: 'bg-indigo-500',
      action: handleExportGuestList,
      disabled: guests.length === 0,
      count: guests.length
    }
  ]

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-playfair font-bold text-burgundy-800 mb-2">
          Operações em Lote
        </h3>
        <p className="text-burgundy-600">
          {selectedGuestIds.length > 0
            ? `${selectedGuestIds.length} convidado(s) selecionado(s)`
            : 'Selecione convidados para habilitar as operações'
          }
        </p>
      </div>

      {/* Operations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {operations.map((operation) => {
          const Icon = operation.icon
          const isActive = activeOperation === operation.id
          const isDisabled = operation.disabled || isLoading

          return (
            <motion.div
              key={operation.id}
              whileHover={{ scale: isDisabled ? 1 : 1.02 }}
              whileTap={{ scale: isDisabled ? 1 : 0.98 }}
            >
              <Card className={`glass p-6 h-full transition-all duration-300 ${
                isActive ? 'ring-2 ring-blush-400' : ''
              } ${isDisabled ? 'opacity-60' : 'hover:shadow-lg cursor-pointer'}`}>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`w-16 h-16 rounded-full ${operation.color} flex items-center justify-center`}>
                    {isActive && isLoading ? (
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    ) : (
                      <Icon className="w-8 h-8 text-white" />
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold text-burgundy-800 mb-1">
                      {operation.title}
                    </h4>
                    <p className="text-sm text-burgundy-600 mb-3">
                      {operation.description}
                    </p>
                    {operation.count > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {operation.count} item(s)
                      </Badge>
                    )}
                  </div>

                  <Button
                    variant={isActive ? 'romantic' : 'outline'}
                    size="sm"
                    onClick={operation.action}
                    disabled={isDisabled}
                    className="w-full"
                  >
                    {isActive && isLoading ? 'Processando...' : 'Executar'}
                  </Button>
                </div>
              </Card>
            </motion.div>
          )
        })}

        {/* Import Card */}
        <Card className="glass p-6 h-full">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
              <Upload className="w-8 h-8 text-white" />
            </div>

            <div>
              <h4 className="font-semibold text-burgundy-800 mb-1">
                Importar CSV
              </h4>
              <p className="text-sm text-burgundy-600 mb-3">
                Importar lista de convidados
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt"
              onChange={handleImportGuestList}
              disabled={isLoading}
              className="hidden"
            />

            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="w-full"
            >
              Selecionar Arquivo
            </Button>
          </div>
        </Card>
      </div>

      {/* Results */}
      <AnimatePresence>
        {operationResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="glass p-6">
              <div className="flex items-center space-x-3 mb-4">
                {operationResult.failed === 0 ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                )}
                <h4 className="font-semibold text-burgundy-800">
                  Resultado da Operação
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Badge variant="success" className="text-green-700 bg-green-100">
                    ✓ {operationResult.success} Sucesso
                  </Badge>
                </div>
                {operationResult.failed > 0 && (
                  <div className="flex items-center space-x-2">
                    <Badge variant="destructive" className="text-red-700 bg-red-100">
                      ✗ {operationResult.failed} Falhas
                    </Badge>
                  </div>
                )}
              </div>

              {operationResult.errors.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-medium text-burgundy-700">Detalhes dos Erros:</h5>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 max-h-32 overflow-y-auto">
                    {operationResult.errors.map((error, index) => (
                      <p key={index} className="text-sm text-red-700">
                        • {error}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOperationResult(null)}
                >
                  Fechar
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default BulkOperationsPanel