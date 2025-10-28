'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  Phone,
  Users,
  UserCheck,
  Clock,
  Search,
  Download,
  RefreshCw,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Copy,
  QrCode,
  Filter,
  TrendingUp,
  Gift,
  Camera,
  MessageSquare,
  UserPlus,
  ExternalLink,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { useToast } from '@/components/ui/Toast'
import type { Invitation } from '@/types/wedding'
import { InlineEditableSelect, InlineEditableText } from '@/components/admin/InlineEditableField'
import {
  getAllInvitations,
  deleteInvitation,
  getInvitationAnalytics,
  exportInvitationsToCSV,
  createInvitation,
  updateInvitation,
  generateUniqueCode,
} from '@/lib/supabase/invitations'
import { formatDate, formatDateTime } from '@/lib/utils'
import QRCode from 'qrcode'

type FilterStatus = 'all' | 'opened' | 'rsvp' | 'gift' | 'photos'
type RelationshipFilter = 'all' | 'family' | 'friend' | 'colleague' | 'other'
type InvitationAnalytics = Awaited<ReturnType<typeof getInvitationAnalytics>>

export default function AdminInvitationsPage() {
  const { showToast, ToastRenderer } = useToast()
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [filteredInvitations, setFilteredInvitations] = useState<Invitation[]>([])
  const [analytics, setAnalytics] = useState<InvitationAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [relationshipFilter, setRelationshipFilter] = useState<RelationshipFilter>('all')
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const sortBy: 'created_at' | 'guest_name' | 'opened_at' | 'open_count' = 'created_at'
  const sortOrder: 'asc' | 'desc' = 'desc'
  const [quickEditMode, setQuickEditMode] = useState(false)
  const [quickSaving, setQuickSaving] = useState<Record<string, boolean>>({})
  const [deletePromptId, setDeletePromptId] = useState<string | null>(null)
  const deletePromptTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const setFieldSaving = (id: string, field: string, value: boolean) => {
    const key = `${id}:${field}`
    setQuickSaving((prev) => {
      if (value) {
        return { ...prev, [key]: true }
      }
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const isFieldSaving = (id: string, field: string) => quickSaving[`${id}:${field}`] === true

  const handleInvitationQuickUpdate = async (
    id: string,
    updates: Partial<Invitation>,
    fieldKey?: string
  ) => {
    if (fieldKey) {
      setFieldSaving(id, fieldKey, true)
    }

    try {
      const updated = await updateInvitation(id, updates)
      if (!updated) {
        throw new Error('Nenhum convite retornado pela atualização')
      }

      setInvitations((prev) =>
        prev.map((invitation) => (invitation.id === id ? { ...invitation, ...updated } : invitation))
      )

      setSelectedInvitation((prev) =>
        prev && prev.id === id ? { ...prev, ...updated } : prev
      )
    } catch (error) {
      console.error('Error updating invitation inline:', error)
      showToast({ title: 'Erro ao atualizar convite', message: 'Tente novamente.', type: 'error' })
      throw error
    } finally {
      if (fieldKey) {
        setFieldSaving(id, fieldKey, false)
      }
    }
  }

  const renderBooleanQuickToggle = (
    invitationId: string,
    label: string,
    field: 'rsvp_completed' | 'gift_selected' | 'photos_uploaded',
    value: boolean
  ) => {
    const saving = isFieldSaving(invitationId, field)

    return (
      <div className="flex items-center justify-between gap-3 rounded-md border border-[#E8E6E3] px-3 py-2">
        <span className="text-xs font-medium uppercase tracking-wide text-[#4A4A4A]">
          {label}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={async () => {
              if (value || saving) return
              const updates: Partial<Invitation> = { [field]: true } as Partial<Invitation>
              try {
                await handleInvitationQuickUpdate(invitationId, updates, field)
              } catch {
                // handled via alert in handler
              }
            }}
            className={`rounded-md border px-2 py-1 text-xs font-medium transition ${
              value
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 bg-white text-[#4A4A4A] hover:border-gray-300'
            }`}
            disabled={saving}
          >
            Sim
          </button>
          <button
            type="button"
            onClick={async () => {
              if (!value || saving) return
              const updates: Partial<Invitation> = { [field]: false } as Partial<Invitation>
              try {
                await handleInvitationQuickUpdate(invitationId, updates, field)
              } catch {
                // handled via alert in handler
              }
            }}
            className={`rounded-md border px-2 py-1 text-xs font-medium transition ${
              !value
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-200 bg-white text-[#4A4A4A] hover:border-gray-300'
            }`}
            disabled={saving}
          >
            Não
          </button>
        </div>
      </div>
    )
  }

  // Filter invitations
  useEffect(() => {
    let filtered = invitations

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (inv) =>
          inv.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inv.guest_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inv.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter((inv) => {
        switch (filterStatus) {
          case 'opened':
            return inv.opened_at !== null
          case 'rsvp':
            return inv.rsvp_completed
          case 'gift':
            return inv.gift_selected
          case 'photos':
            return inv.photos_uploaded
          default:
            return true
        }
      })
    }

    // Apply relationship filter
    if (relationshipFilter !== 'all') {
      filtered = filtered.filter((inv) => inv.relationship_type === relationshipFilter)
    }

    setFilteredInvitations(filtered)
  }, [invitations, searchTerm, filterStatus, relationshipFilter])

  const loadData = useCallback(
    async ({ showSpinner = true }: { showSpinner?: boolean } = {}) => {
      if (showSpinner) {
        setIsLoading(true)
      }
      try {
        const [invitationsList, analyticsData] = await Promise.all([
          getAllInvitations(undefined, sortBy, sortOrder),
          getInvitationAnalytics(),
        ])
        setInvitations(invitationsList)
        setAnalytics(analyticsData)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        if (showSpinner) {
          setIsLoading(false)
        }
      }
    },
    [sortBy, sortOrder]
  )

  // Load data
  useEffect(() => {
    void loadData()
  }, [loadData])

  useEffect(() => {
    return () => {
      if (deletePromptTimeout.current) {
        clearTimeout(deletePromptTimeout.current)
      }
    }
  }, [])

  useEffect(() => {
    setDeletePromptId(null)
    if (deletePromptTimeout.current) {
      clearTimeout(deletePromptTimeout.current)
      deletePromptTimeout.current = null
    }
  }, [quickEditMode])

  const handleDeleteInvitation = async (id: string) => {
    try {
      const success = await deleteInvitation(id)
      if (!success) {
        throw new Error('Falha ao remover convite')
      }

      setInvitations((prev) => prev.filter((inv) => inv.id !== id))
      setSelectedInvitation((prev) => (prev && prev.id === id ? null : prev))
      setDeletePromptId(null)

      void loadData({ showSpinner: false })
    } catch (error) {
      console.error('Error deleting invitation:', error)
      showToast({ title: 'Erro ao excluir convite', type: 'error' })
    }
  }

  const requestDeleteInvitation = (id: string) => {
    if (deletePromptId === id) {
      if (deletePromptTimeout.current) {
        clearTimeout(deletePromptTimeout.current)
        deletePromptTimeout.current = null
      }
      void handleDeleteInvitation(id)
      return
    }

    if (deletePromptTimeout.current) {
      clearTimeout(deletePromptTimeout.current)
    }

    setDeletePromptId(id)
    deletePromptTimeout.current = setTimeout(() => {
      setDeletePromptId(null)
      deletePromptTimeout.current = null
    }, 4000)
  }

  const handleExportCSV = async () => {
    try {
      const csv = await exportInvitationsToCSV()
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `convites-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error exporting CSV:', error)
      showToast({ title: 'Erro ao exportar CSV', type: 'error' })
    }
  }

  const handleCopyInvitationLink = async (code: string) => {
    const url = `${window.location.origin}/convite/${code}`
    try {
      await navigator.clipboard.writeText(url)
      showToast({ title: 'Link copiado!', message: 'Link copiado para a área de transferência', type: 'success' })
    } catch (error) {
      console.error('Error copying link:', error)
      showToast({ title: 'Erro ao copiar link', type: 'error' })
    }
  }

  const handleGenerateQRCode = async (code: string) => {
    const url = `${window.location.origin}/convite/${code}`
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(url, {
        width: 512,
        margin: 2,
        color: {
          dark: '#2C2C2C',
          light: '#F8F6F3',
        },
      })

      // Download QR code
      const link = document.createElement('a')
      link.href = qrCodeDataUrl
      link.download = `qr-code-${code}.png`
      link.click()
    } catch (error) {
      console.error('Error generating QR code:', error)
      showToast({ title: 'Erro ao gerar QR code', type: 'error' })
    }
  }

  const getRelationshipBadge = (type: string) => {
    const badges = {
      family: <Badge className="bg-gray-100 text-gray-800 border-gray-200">Família</Badge>,
      friend: <Badge className="bg-blue-100 text-blue-800 border-blue-200">Amigo</Badge>,
      colleague: <Badge className="bg-green-100 text-green-800 border-green-200">Colega</Badge>,
      other: <Badge className="bg-gray-100 text-gray-800 border-gray-200">Outro</Badge>,
    }
    return badges[type as keyof typeof badges] || badges.other
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 75) return 'text-green-600'
    if (percentage >= 50) return 'text-yellow-600'
    if (percentage >= 25) return 'text-orange-600'
    return 'text-red-600'
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#A8A8A8] border-t-transparent mx-auto mb-4"></div>
        <p className="text-[#2C2C2C] font-medium">Carregando convites...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-playfair font-bold text-[#2C2C2C] mb-2">
            Gestão de Convites
          </h2>
          <p className="text-[#4A4A4A]">
            Gerencie convites personalizados e acompanhe o progresso dos convidados
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </Button>
          <Button
            size="sm"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Novo Convite
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-br from-gray-50 to-white border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <Users className="w-6 h-6 text-gray-500 mb-2" />
                <h3 className="text-2xl font-bold text-[#2C2C2C]">{analytics.total}</h3>
                <p className="text-sm text-[#4A4A4A]">Total de Convites</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-[#4A4A4A]">Taxa de abertura</div>
                <div className="text-xs text-gray-600 font-medium">
                  {analytics.open_rate}%
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-50 to-white border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <UserCheck className="w-6 h-6 text-green-500 mb-2" />
                <h3 className="text-2xl font-bold text-[#2C2C2C]">
                  {analytics.rsvp_completed}
                </h3>
                <p className="text-sm text-[#4A4A4A]">RSVP Completos</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-[#4A4A4A]">Taxa de RSVP</div>
                <div className="text-xs text-green-600 font-medium">
                  {analytics.rsvp_rate}%
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-blue-50 to-white border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <Gift className="w-6 h-6 text-blue-500 mb-2" />
                <h3 className="text-2xl font-bold text-[#2C2C2C]">
                  {analytics.gift_selected}
                </h3>
                <p className="text-sm text-[#4A4A4A]">Presentes Selecionados</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-[#4A4A4A]">Taxa de presentes</div>
                <div className="text-xs text-blue-600 font-medium">
                  {analytics.gift_rate}%
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-gray-50 to-white border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <Camera className="w-6 h-6 text-gray-500 mb-2" />
                <h3 className="text-2xl font-bold text-[#2C2C2C]">
                  {analytics.photos_uploaded}
                </h3>
                <p className="text-sm text-[#4A4A4A]">Fotos Enviadas</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-[#4A4A4A]">Taxa de fotos</div>
                <div className="text-xs text-gray-600 font-medium">
                  {analytics.photo_rate}%
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar por nome, email ou código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 min-w-[300px]"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filterStatus === 'all' ? 'wedding' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                <Filter className="w-4 h-4 mr-2" />
                Todos
              </Button>
              <Button
                variant={filterStatus === 'opened' ? 'wedding' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('opened')}
              >
                <Clock className="w-4 h-4 mr-2" />
                Abertos
              </Button>
              <Button
                variant={filterStatus === 'rsvp' ? 'wedding' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('rsvp')}
              >
                <UserCheck className="w-4 h-4 mr-2" />
                RSVP
              </Button>
              <Button
                variant={filterStatus === 'gift' ? 'wedding' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('gift')}
              >
                <Gift className="w-4 h-4 mr-2" />
                Presentes
              </Button>
            </div>

            <div className="flex gap-2 flex-wrap">
              {([
                { key: 'all', label: 'Todos' },
                { key: 'family', label: 'Família' },
                { key: 'friend', label: 'Amigos' },
                { key: 'colleague', label: 'Trabalho' },
                { key: 'other', label: 'Outros' }
              ] as const).map(({ key, label }) => (
                <Button
                  key={key}
                  variant={relationshipFilter === key ? 'wedding' : 'outline'}
                  size="sm"
                  onClick={() => setRelationshipFilter(key)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant={quickEditMode ? 'wedding' : 'outline'}
              size="sm"
              onClick={() => setQuickEditMode((prev) => !prev)}
              className="flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              {quickEditMode ? 'Sair do modo rápido' : 'Edição rápida'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void loadData()}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Atualizar
            </Button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[#E8E6E3]">
          <p className="text-sm text-[#4A4A4A]">
            Mostrando <strong>{filteredInvitations.length}</strong> de{' '}
            <strong>{invitations.length}</strong> convites
          </p>
        </div>
      </Card>

      {/* Invitations Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className=" border-b border-[#E8E6E3]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#2C2C2C]">
                  Código
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#2C2C2C]">
                  Convidado
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#2C2C2C]">
                  Contato
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#2C2C2C]">
                  Tipo
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#2C2C2C]">
                  Progresso
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#2C2C2C]">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#2C2C2C]">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E6E3]">
              {filteredInvitations.map((invitation, index) => {
                const progress = Math.round(
                  ((invitation.rsvp_completed ? 1 : 0) +
                    (invitation.gift_selected ? 1 : 0) +
                    (invitation.photos_uploaded ? 1 : 0)) /
                    3 *
                    100
                )

                return (
                  <motion.tr
                    key={invitation.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono bg-gray-100 px-3 py-1 rounded text-sm font-medium text-[#2C2C2C]">
                        {invitation.code}
                      </span>
                    </td>

                    <td className="px-6 py-4 align-top">
                      {quickEditMode ? (
                        <div className="space-y-3">
                          <InlineEditableText
                            active={quickEditMode}
                            value={invitation.guest_name}
                            onSave={async (next) => {
                              await handleInvitationQuickUpdate(invitation.id, { guest_name: next })
                            }}
                            placeholder="Nome do convidado"
                            className="max-w-xs"
                            displayClassName="font-semibold text-[#2C2C2C]"
                            inputClassName="font-semibold text-[#2C2C2C]"
                            maxLength={120}
                          />

                          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            <InlineEditableText
                              active={quickEditMode}
                              value={invitation.table_number?.toString() ?? ''}
                              onSave={async (next) => {
                                const sanitized = next.trim()
                                const parsed = sanitized === '' ? null : Number.parseInt(sanitized, 10)
                                const tableNumber = parsed !== null && !Number.isNaN(parsed) ? parsed : null
                                await handleInvitationQuickUpdate(invitation.id, { table_number: tableNumber })
                              }}
                              placeholder="Mesa"
                              type="number"
                              className="max-w-[140px]"
                              inputClassName="text-sm"
                              emptyDisplay={<span className="text-sm text-[#A8A8A8]">Sem mesa</span>}
                            />
                            <InlineEditableText
                              active={quickEditMode}
                              value={invitation.dietary_restrictions ?? ''}
                              onSave={async (next) => {
                                await handleInvitationQuickUpdate(invitation.id, {
                                  dietary_restrictions: next ? next : null,
                                })
                              }}
                              placeholder="Restrições alimentares"
                              inputClassName="text-sm"
                              emptyDisplay={<span className="text-sm text-[#A8A8A8]">Sem restrições</span>}
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="font-semibold text-[#2C2C2C]">{invitation.guest_name}</div>
                          {invitation.table_number && (
                            <div className="mt-1 text-sm text-[#4A4A4A]">
                              Mesa{' '}
                              <span className="font-semibold text-[#2C2C2C]">{invitation.table_number}</span>
                            </div>
                          )}
                          {invitation.dietary_restrictions && (
                            <div className="mt-1 text-xs text-[#4A4A4A]">
                              {invitation.dietary_restrictions}
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 align-top">
                      {quickEditMode ? (
                        <div className="space-y-2">
                          <InlineEditableText
                            active={quickEditMode}
                            value={invitation.guest_email ?? ''}
                            onSave={async (next) => {
                              await handleInvitationQuickUpdate(invitation.id, {
                                guest_email: next ? next : null,
                              })
                            }}
                            placeholder="email@exemplo.com"
                            type="email"
                            className="max-w-xs"
                            inputClassName="text-sm"
                            emptyDisplay={<span className="text-sm text-[#A8A8A8]">Sem e-mail</span>}
                          />
                          <InlineEditableText
                            active={quickEditMode}
                            value={invitation.guest_phone ?? ''}
                            onSave={async (next) => {
                              await handleInvitationQuickUpdate(invitation.id, {
                                guest_phone: next ? next : null,
                              })
                            }}
                            placeholder="(11) 99999-9999"
                            type="tel"
                            className="max-w-xs"
                            inputClassName="text-sm"
                            emptyDisplay={<span className="text-sm text-[#A8A8A8]">Sem telefone</span>}
                          />
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {invitation.guest_email ? (
                            <div className="flex items-center text-sm text-[#4A4A4A]">
                              <Mail className="mr-2 h-4 w-4 text-[#A8A8A8]" />
                              {invitation.guest_email}
                            </div>
                          ) : (
                            <div className="text-xs text-[#A8A8A8]">Sem e-mail</div>
                          )}
                          {invitation.guest_phone ? (
                            <div className="flex items-center text-sm text-[#4A4A4A]">
                              <Phone className="mr-2 h-4 w-4 text-[#A8A8A8]" />
                              {invitation.guest_phone}
                            </div>
                          ) : (
                            <div className="text-xs text-[#A8A8A8]">Sem telefone</div>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 align-top">
                      <InlineEditableSelect
                        active={quickEditMode}
                        value={invitation.relationship_type}
                        options={[
                          { value: 'family', label: 'Família' },
                          { value: 'friend', label: 'Amigo' },
                          { value: 'colleague', label: 'Colega' },
                          { value: 'other', label: 'Outro' },
                        ]}
                        onSave={async (next) => {
                          await handleInvitationQuickUpdate(
                            invitation.id,
                            { relationship_type: next as Invitation['relationship_type'] }
                          )
                        }}
                        placeholder="Selecione"
                        className="max-w-[160px]"
                        displayValue={getRelationshipBadge(invitation.relationship_type)}
                      />
                    </td>

                    <td className="px-6 py-4 align-top">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="h-2 w-full rounded-full bg-gray-200">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                progress >= 75
                                  ? 'bg-green-500'
                                  : progress >= 50
                                  ? 'bg-yellow-500'
                                  : progress >= 25
                                  ? 'bg-orange-500'
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                        <span className={`text-sm font-medium ${getProgressColor(progress)}`}>
                          {progress}%
                        </span>
                      </div>

                      {quickEditMode ? (
                        <div className="mt-3 space-y-2">
                          {renderBooleanQuickToggle(
                            invitation.id,
                            'RSVP',
                            'rsvp_completed',
                            invitation.rsvp_completed
                          )}
                          {renderBooleanQuickToggle(
                            invitation.id,
                            'Presente',
                            'gift_selected',
                            invitation.gift_selected
                          )}
                          {renderBooleanQuickToggle(
                            invitation.id,
                            'Fotos',
                            'photos_uploaded',
                            invitation.photos_uploaded
                          )}
                        </div>
                      ) : (
                        <div className="mt-2 flex items-center gap-2">
                          {invitation.rsvp_completed && (
                            <UserCheck className="h-4 w-4 text-green-500" aria-label="RSVP completo" />
                          )}
                          {invitation.gift_selected && (
                            <Gift className="h-4 w-4 text-blue-500" aria-label="Presente selecionado" />
                          )}
                          {invitation.photos_uploaded && (
                            <Camera className="h-4 w-4 text-gray-500" aria-label="Fotos enviadas" />
                          )}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {invitation.opened_at ? (
                          <>
                            <div className="text-sm text-green-600 font-medium flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Aberto
                            </div>
                            <div className="text-xs text-[#4A4A4A]">
                              {invitation.open_count}x • {formatDate(new Date(invitation.opened_at))}
                            </div>
                          </>
                        ) : (
                          <div className="text-sm text-gray-500">Não aberto</div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedInvitation(invitation)
                            setShowDetailModal(true)
                          }}
                          className="p-2"
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedInvitation(invitation)
                            setShowEditModal(true)
                          }}
                          className="p-2"
                          title="Editar"
                          disabled={quickEditMode}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopyInvitationLink(invitation.code)}
                          className="p-2"
                          title="Copiar link"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleGenerateQRCode(invitation.code)}
                          className="p-2"
                          title="Gerar QR Code"
                        >
                          <QrCode className="w-4 h-4" />
                        </Button>
                        <div className="relative">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => requestDeleteInvitation(invitation.id)}
                            className="p-2 text-red-600 hover:text-red-800"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          {deletePromptId === invitation.id && (
                            <div className="pointer-events-none absolute right-0 top-full mt-2 w-48 rounded-md border border-red-200 bg-white p-2 text-xs text-[#4A4A4A] shadow-lg">
                              Clique novamente para excluir.
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>

          {filteredInvitations.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchTerm || filterStatus !== 'all'
                  ? 'Nenhum convite encontrado com os filtros aplicados'
                  : 'Nenhum convite criado ainda'}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Create Invitation Modal */}
      <CreateInvitationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          void loadData()
          setShowCreateModal(false)
        }}
        showToast={showToast}
      />

      {/* Edit Invitation Modal */}
      <EditInvitationModal
        isOpen={showEditModal}
        invitation={selectedInvitation}
        onClose={() => {
          setShowEditModal(false)
          setSelectedInvitation(null)
        }}
        onSuccess={() => {
          void loadData()
          setShowEditModal(false)
          setSelectedInvitation(null)
        }}
        showToast={showToast}
      />

      {/* Detail View Modal */}
      <DetailViewModal
        isOpen={showDetailModal}
        invitation={selectedInvitation}
        onClose={() => {
          setShowDetailModal(false)
          setSelectedInvitation(null)
        }}
        onEdit={(invitation) => {
          setShowDetailModal(false)
          setSelectedInvitation(invitation)
          setShowEditModal(true)
        }}
        onDelete={async (id) => {
          await handleDeleteInvitation(id)
          setShowDetailModal(false)
          setSelectedInvitation(null)
        }}
        showToast={showToast}
      />

      {/* Toast Notifications */}
      <ToastRenderer />
    </div>
  )
}

// Create Invitation Modal Component
function CreateInvitationModal({
  isOpen,
  onClose,
  onSuccess,
  showToast,
}: {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  showToast: (toast: { title: string; message?: string; type?: 'success' | 'error' | 'info' }) => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    relationship_type: 'friend' as 'family' | 'friend' | 'colleague' | 'other',
    custom_message: '',
    table_number: '',
    dietary_restrictions: '',
  })
  const [previewCode, setPreviewCode] = useState<string>('')

  // Generate preview code when relationship type changes
  useEffect(() => {
    let isActive = true

    const loadCode = async () => {
      if (!formData.relationship_type) return
      const code = await generateUniqueCode(formData.relationship_type)
      if (isActive) {
        setPreviewCode(code)
      }
    }

    void loadCode()

    return () => {
      isActive = false
    }
  }, [formData.relationship_type])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const ensuredCode = previewCode || (await generateUniqueCode(formData.relationship_type))
      setPreviewCode(ensuredCode)

      await createInvitation({
        code: ensuredCode,
        guest_name: formData.guest_name,
        guest_email: formData.guest_email || undefined,
        guest_phone: formData.guest_phone || undefined,
        relationship_type: formData.relationship_type,
        custom_message: formData.custom_message || undefined,
        table_number: formData.table_number ? parseInt(formData.table_number) : undefined,
        dietary_restrictions: formData.dietary_restrictions || undefined,
      })

      showToast({ title: 'Convite criado!', message: 'Convite criado com sucesso', type: 'success' })
      onSuccess()

      // Reset form
      setFormData({
        guest_name: '',
        guest_email: '',
        guest_phone: '',
        relationship_type: 'friend',
        custom_message: '',
        table_number: '',
        dietary_restrictions: '',
      })
    } catch (error) {
      console.error('Error creating invitation:', error)
      showToast({ title: 'Erro ao criar convite', message: 'Por favor, tente novamente', type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-playfair font-bold text-[#2C2C2C]">
              Criar Novo Convite
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Guest Information Section */}
            <div className="space-y-4">
              <h4 className="font-semibold text-[#2C2C2C] flex items-center gap-2">
                <Users className="w-5 h-5" />
                Informações do Convidado
              </h4>

              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                  Nome Completo *
                </label>
                <Input
                  required
                  value={formData.guest_name}
                  onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                  placeholder="Convidado(a)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.guest_email}
                    onChange={(e) => setFormData({ ...formData, guest_email: e.target.value })}
                    placeholder="joao@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                    Telefone
                  </label>
                  <Input
                    type="tel"
                    value={formData.guest_phone}
                    onChange={(e) => setFormData({ ...formData, guest_phone: e.target.value })}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                  Tipo de Relacionamento *
                </label>
                <select
                  required
                  value={formData.relationship_type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      relationship_type: e.target.value as Invitation['relationship_type'],
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C2C2C] focus:border-transparent"
                >
                  <option value="family">Família</option>
                  <option value="friend">Amigo</option>
                  <option value="colleague">Colega</option>
                  <option value="other">Outro</option>
                </select>
              </div>
            </div>

            {/* Additional Details Section */}
            <div className="space-y-4 pt-6 border-t border-[#E8E6E3]">
              <h4 className="font-semibold text-[#2C2C2C] flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Detalhes Adicionais
              </h4>

              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                  Mensagem Personalizada
                </label>
                <textarea
                  value={formData.custom_message}
                  onChange={(e) =>
                    setFormData({ ...formData, custom_message: e.target.value })
                  }
                  placeholder="Deixe uma mensagem especial para o convidado..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C2C2C] focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                    Número da Mesa
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.table_number}
                    onChange={(e) =>
                      setFormData({ ...formData, table_number: e.target.value })
                    }
                    placeholder="5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                    Restrições Alimentares
                  </label>
                  <Input
                    value={formData.dietary_restrictions}
                    onChange={(e) =>
                      setFormData({ ...formData, dietary_restrictions: e.target.value })
                    }
                    placeholder="Vegetariano, sem glúten..."
                  />
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl">
              <h4 className="font-semibold text-[#2C2C2C] mb-2 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Preview do Convite
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#4A4A4A]">Código:</span>
                  <span className="font-mono bg-white px-3 py-1 rounded text-sm font-medium text-[#2C2C2C]">
                    {previewCode}
                  </span>
                </div>
                <div className="text-sm text-[#4A4A4A]">
                  Link:{' '}
                  <span className="font-mono text-xs">
                    {window.location.origin}/convite/{previewCode}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-[#E8E6E3]">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" variant="wedding" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Convite
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Edit Invitation Modal Component
function EditInvitationModal({
  isOpen,
  invitation,
  onClose,
  onSuccess,
  showToast,
}: {
  isOpen: boolean
  invitation: Invitation | null
  onClose: () => void
  onSuccess: () => void
  showToast: (toast: { title: string; message?: string; type?: 'success' | 'error' | 'info' }) => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    relationship_type: 'friend' as 'family' | 'friend' | 'colleague' | 'other',
    custom_message: '',
    table_number: '',
    dietary_restrictions: '',
  })

  // Populate form when invitation changes
  useEffect(() => {
    if (invitation) {
      setFormData({
        guest_name: invitation.guest_name,
        guest_email: invitation.guest_email || '',
        guest_phone: invitation.guest_phone || '',
        relationship_type: invitation.relationship_type as Invitation['relationship_type'],
        custom_message: invitation.custom_message || '',
        table_number: invitation.table_number?.toString() || '',
        dietary_restrictions: invitation.dietary_restrictions || '',
      })
    }
  }, [invitation])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!invitation) return

    setIsSubmitting(true)

    try {
      await updateInvitation(invitation.id, {
        guest_name: formData.guest_name,
        guest_email: formData.guest_email || undefined,
        guest_phone: formData.guest_phone || undefined,
        relationship_type: formData.relationship_type,
        custom_message: formData.custom_message || undefined,
        table_number: formData.table_number ? parseInt(formData.table_number) : undefined,
        dietary_restrictions: formData.dietary_restrictions || undefined,
      })

      showToast({ title: 'Convite atualizado!', message: 'Convite atualizado com sucesso', type: 'success' })
      onSuccess()
    } catch (error) {
      console.error('Error updating invitation:', error)
      showToast({ title: 'Erro ao atualizar convite', message: 'Por favor, tente novamente', type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen || !invitation) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-playfair font-bold text-[#2C2C2C]">
                Editar Convite
              </h3>
              <p className="text-sm text-[#4A4A4A] mt-1">
                Código: <span className="font-mono font-medium">{invitation.code}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Guest Information Section */}
            <div className="space-y-4">
              <h4 className="font-semibold text-[#2C2C2C] flex items-center gap-2">
                <Users className="w-5 h-5" />
                Informações do Convidado
              </h4>

              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                  Nome Completo *
                </label>
                <Input
                  required
                  value={formData.guest_name}
                  onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                  placeholder="João Silva"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.guest_email}
                    onChange={(e) => setFormData({ ...formData, guest_email: e.target.value })}
                    placeholder="joao@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                    Telefone
                  </label>
                  <Input
                    type="tel"
                    value={formData.guest_phone}
                    onChange={(e) => setFormData({ ...formData, guest_phone: e.target.value })}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                  Tipo de Relacionamento *
                </label>
                <select
                  required
                  value={formData.relationship_type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      relationship_type: e.target.value as Invitation['relationship_type'],
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C2C2C] focus:border-transparent"
                >
                  <option value="family">Família</option>
                  <option value="friend">Amigo</option>
                  <option value="colleague">Colega</option>
                  <option value="other">Outro</option>
                </select>
              </div>
            </div>

            {/* Additional Details Section */}
            <div className="space-y-4 pt-6 border-t border-[#E8E6E3]">
              <h4 className="font-semibold text-[#2C2C2C] flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Detalhes Adicionais
              </h4>

              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                  Mensagem Personalizada
                </label>
                <textarea
                  value={formData.custom_message}
                  onChange={(e) =>
                    setFormData({ ...formData, custom_message: e.target.value })
                  }
                  placeholder="Deixe uma mensagem especial para o convidado..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C2C2C] focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                    Número da Mesa
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.table_number}
                    onChange={(e) =>
                      setFormData({ ...formData, table_number: e.target.value })
                    }
                    placeholder="5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                    Restrições Alimentares
                  </label>
                  <Input
                    value={formData.dietary_restrictions}
                    onChange={(e) =>
                      setFormData({ ...formData, dietary_restrictions: e.target.value })
                    }
                    placeholder="Vegetariano, sem glúten..."
                  />
                </div>
              </div>
            </div>

            {/* Last Updated Info */}
            {invitation.updated_at && (
              <div className="p-3 bg-gray-50 rounded-lg text-sm text-[#4A4A4A]">
                <Clock className="w-4 h-4 inline mr-2" />
                Última atualização: {formatDateTime(new Date(invitation.updated_at))}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-[#E8E6E3]">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" variant="wedding" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Detail View Modal Component
function DetailViewModal({
  isOpen,
  invitation,
  onClose,
  onEdit,
  onDelete,
  showToast,
}: {
  isOpen: boolean
  invitation: Invitation | null
  onClose: () => void
  onEdit: (invitation: Invitation) => void
  onDelete: (id: string) => Promise<void> | void
  showToast: (toast: { title: string; message?: string; type?: 'success' | 'error' | 'info' }) => void
}) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [deletePromptVisible, setDeletePromptVisible] = useState(false)
  const deletePromptTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (invitation && isOpen) {
      // Generate QR code
      const url = `${window.location.origin}/convite/${invitation.code}`
      QRCode.toDataURL(url, {
        width: 256,
        margin: 2,
        color: {
          dark: '#2C2C2C',
          light: '#F8F6F3',
        },
      }).then(setQrCodeUrl)
    }
  }, [invitation, isOpen])

  useEffect(() => {
    setDeletePromptVisible(false)
    if (deletePromptTimeout.current) {
      clearTimeout(deletePromptTimeout.current)
      deletePromptTimeout.current = null
    }
  }, [invitation?.id])

  useEffect(() => {
    if (!isOpen) {
      setDeletePromptVisible(false)
      if (deletePromptTimeout.current) {
        clearTimeout(deletePromptTimeout.current)
        deletePromptTimeout.current = null
      }
    }

    return () => {
      if (deletePromptTimeout.current) {
        clearTimeout(deletePromptTimeout.current)
        deletePromptTimeout.current = null
      }
    }
  }, [isOpen])

  const handleCopyLink = async () => {
    if (!invitation) return
    const url = `${window.location.origin}/convite/${invitation.code}`
    try {
      await navigator.clipboard.writeText(url)
      showToast({ title: 'Link copiado!', type: 'success' })
    } catch (error) {
      console.error('Error copying link:', error)
      showToast({ title: 'Erro ao copiar link', type: 'error' })
    }
  }

  const handleDownloadQR = () => {
    if (!qrCodeUrl || !invitation) return
    const link = document.createElement('a')
    link.href = qrCodeUrl
    link.download = `qr-code-${invitation.code}.png`
    link.click()
  }

  const handleOpenInvitation = () => {
    if (!invitation) return
    window.open(`/convite/${invitation.code}`, '_blank')
  }

  if (!isOpen || !invitation) return null

  const progress = Math.round(
    ((invitation.rsvp_completed ? 1 : 0) +
      (invitation.gift_selected ? 1 : 0) +
      (invitation.photos_uploaded ? 1 : 0)) /
      3 *
      100
  )

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-playfair font-bold text-[#2C2C2C]">
                Detalhes do Convite
              </h3>
              <p className="text-sm text-[#4A4A4A] mt-1">
                Código: <span className="font-mono font-medium">{invitation.code}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Guest Information */}
            <Card className="p-4 bg-gradient-to-br from-gray-50 to-white border-gray-200">
              <h4 className="font-semibold text-[#2C2C2C] mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Informações do Convidado
              </h4>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-[#4A4A4A]">Nome:</span>
                  <p className="font-semibold text-[#2C2C2C]">{invitation.guest_name}</p>
                </div>
                {invitation.guest_email && (
                  <div>
                    <span className="text-sm text-[#4A4A4A]">Email:</span>
                    <p className="text-[#2C2C2C] flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {invitation.guest_email}
                    </p>
                  </div>
                )}
                {invitation.guest_phone && (
                  <div>
                    <span className="text-sm text-[#4A4A4A]">Telefone:</span>
                    <p className="text-[#2C2C2C] flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {invitation.guest_phone}
                    </p>
                  </div>
                )}
                <div>
                  <span className="text-sm text-[#4A4A4A]">Relacionamento:</span>
                  <div className="mt-1">
                    {invitation.relationship_type === 'family' && (
                      <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                        Família
                      </Badge>
                    )}
                    {invitation.relationship_type === 'friend' && (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">Amigo</Badge>
                    )}
                    {invitation.relationship_type === 'colleague' && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Colega
                      </Badge>
                    )}
                    {invitation.relationship_type === 'other' && (
                      <Badge className="bg-gray-100 text-gray-800 border-gray-200">Outro</Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Additional Details */}
            <Card className="p-4">
              <h4 className="font-semibold text-[#2C2C2C] mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Detalhes Adicionais
              </h4>
              <div className="space-y-3">
                {invitation.custom_message && (
                  <div>
                    <span className="text-sm text-[#4A4A4A]">Mensagem Personalizada:</span>
                    <p className="text-[#2C2C2C] italic mt-1 p-3  rounded-lg">
                      "{invitation.custom_message}"
                    </p>
                  </div>
                )}
                {invitation.table_number && (
                  <div>
                    <span className="text-sm text-[#4A4A4A]">Número da Mesa:</span>
                    <p className="text-[#2C2C2C] font-semibold">Mesa {invitation.table_number}</p>
                  </div>
                )}
                {invitation.dietary_restrictions && (
                  <div>
                    <span className="text-sm text-[#4A4A4A]">Restrições Alimentares:</span>
                    <p className="text-[#2C2C2C]">{invitation.dietary_restrictions}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Progress and Tracking */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 bg-gradient-to-br from-green-50 to-white border-green-200">
                <h4 className="font-semibold text-[#2C2C2C] mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Progresso
                </h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#4A4A4A]">Conclusão</span>
                      <span className="text-sm font-semibold text-[#2C2C2C]">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          progress >= 75
                            ? 'bg-green-500'
                            : progress >= 50
                            ? 'bg-yellow-500'
                            : progress >= 25
                            ? 'bg-orange-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <UserCheck
                        className={`w-5 h-5 ${
                          invitation.rsvp_completed ? 'text-green-500' : 'text-gray-300'
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          invitation.rsvp_completed ? 'text-[#2C2C2C]' : 'text-gray-400'
                        }`}
                      >
                        RSVP Completo
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gift
                        className={`w-5 h-5 ${
                          invitation.gift_selected ? 'text-blue-500' : 'text-gray-300'
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          invitation.gift_selected ? 'text-[#2C2C2C]' : 'text-gray-400'
                        }`}
                      >
                        Presente Selecionado
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Camera
                        className={`w-5 h-5 ${
                          invitation.photos_uploaded ? 'text-gray-500' : 'text-gray-300'
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          invitation.photos_uploaded ? 'text-[#2C2C2C]' : 'text-gray-400'
                        }`}
                      >
                        Fotos Enviadas
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-semibold text-[#2C2C2C] mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Rastreamento
                </h4>
                <div className="space-y-3">
                  {invitation.opened_at ? (
                    <>
                      <div>
                        <span className="text-sm text-[#4A4A4A]">Primeira Abertura:</span>
                        <p className="text-[#2C2C2C] font-medium">
                          {formatDateTime(new Date(invitation.opened_at))}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-[#4A4A4A]">Total de Aberturas:</span>
                        <p className="text-[#2C2C2C] font-semibold text-xl">
                          {invitation.open_count}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Convite ainda não foi aberto</p>
                    </div>
                  )}
                  <div className="pt-3 border-t border-[#E8E6E3]">
                    <span className="text-sm text-[#4A4A4A]">Criado em:</span>
                    <p className="text-[#2C2C2C] text-sm">
                      {formatDateTime(new Date(invitation.created_at))}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* QR Code */}
            {qrCodeUrl && (
              <Card className="p-4 text-center">
                <h4 className="font-semibold text-[#2C2C2C] mb-4 flex items-center justify-center gap-2">
                  <QrCode className="w-5 h-5" />
                  QR Code do Convite
                </h4>
                <Image
                  src={qrCodeUrl}
                  alt="QR Code"
                  width={192}
                  height={192}
                  className="w-48 h-48 mx-auto mb-4 border-4 border-[#E8E6E3] rounded-lg"
                  unoptimized
                />
                <div className="flex justify-center gap-2">
                  <Button size="sm" variant="outline" onClick={handleDownloadQR}>
                    <Download className="w-4 h-4 mr-2" />
                    Baixar
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCopyLink}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar Link
                  </Button>
                </div>
              </Card>
            )}

            {/* Actions */}
            <div className="flex flex-wrap justify-end gap-3 pt-6 border-t border-[#E8E6E3]">
              <Button variant="outline" onClick={handleOpenInvitation} size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir Convite
              </Button>
              <Button
                variant="outline"
                onClick={() => invitation && onEdit(invitation)}
                size="sm"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Editar
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  if (deletePromptVisible) {
                    if (deletePromptTimeout.current) {
                      clearTimeout(deletePromptTimeout.current)
                      deletePromptTimeout.current = null
                    }
                    setDeletePromptVisible(false)
                    await onDelete(invitation.id)
                    return
                  }

                  if (deletePromptTimeout.current) {
                    clearTimeout(deletePromptTimeout.current)
                  }

                  setDeletePromptVisible(true)
                  deletePromptTimeout.current = setTimeout(() => {
                    setDeletePromptVisible(false)
                    deletePromptTimeout.current = null
                  }, 4000)
                }}
                size="sm"
                className="text-red-600 hover:text-red-800 border-red-200 hover:border-red-300"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </Button>
              {deletePromptVisible && (
                <div className="w-full text-right text-xs text-red-600">
                  Clique novamente para excluir.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
