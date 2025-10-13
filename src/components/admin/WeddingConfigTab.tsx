'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Settings,
  Calendar,
  MapPin,
  Clock,
  Users,
  Mail,
  Smartphone,
  Globe,
  Palette,
  Save,
  RefreshCw,
  Upload,
  Download,
  Eye,
  Edit,
  CheckCircle,
  AlertCircle,
  Info,
  Heart,
  Camera,
  Music,
  Utensils
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/Textarea'

interface WeddingConfiguration {
  basicInfo: {
    brideNames: string
    groomNames: string
    weddingDate: string
    venue: {
      name: string
      address: string
      city: string
      state: string
      zipCode: string
      coordinates?: { lat: number; lng: number }
    }
    ceremony: {
      time: string
      duration: string
      type: string
    }
    reception: {
      time: string
      duration: string
      type: string
    }
  }
  guestSettings: {
    maxGuests: number
    allowPlusOnes: boolean
    childrenWelcome: boolean
    rsvpDeadline: string
    reminderSettings: {
      enabled: boolean
      firstReminder: number // days before deadline
      finalReminder: number // days before deadline
    }
  }
  websiteSettings: {
    theme: {
      primaryColor: string
      secondaryColor: string
      fontFamily: string
      style: 'romantic' | 'modern' | 'rustic' | 'elegant'
    }
    features: {
      giftRegistry: boolean
      rsvpForm: boolean
      photoGallery: boolean
      timeline: boolean
      guestbook: boolean
      liveStreaming: boolean
    }
    customPages: Array<{
      id: string
      title: string
      content: string
      enabled: boolean
    }>
  }
  communicationSettings: {
    email: {
      enabled: boolean
      senderName: string
      senderEmail: string
      templates: {
        confirmation: { subject: string; content: string }
        reminder: { subject: string; content: string }
        thankyou: { subject: string; content: string }
      }
    }
    sms: {
      enabled: boolean
      templates: {
        confirmation: string
        reminder: string
      }
    }
  }
  paymentSettings: {
    mercadoPago: {
      enabled: boolean
      publicKey: string
      accessToken: string
      webhookUrl: string
    }
    pixSettings: {
      enabled: boolean
      pixKey: string
      pixKeyType: 'email' | 'phone' | 'cpf' | 'random'
      bankName: string
    }
    giftDelivery: {
      allowDelivery: boolean
      deliveryAddress: string
      instructions: string
    }
  }
  socialSettings: {
    hashtag: string
    instagram: string
    facebook: string
    website: string
    shareableContent: {
      saveTheDate: string
      invitation: string
      thankyou: string
    }
  }
}

export function WeddingConfigTab() {
  const [config, setConfig] = useState<WeddingConfiguration | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeSection, setActiveSection] = useState<'basic' | 'guests' | 'website' | 'communication' | 'payment' | 'social'>('basic')
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    loadConfiguration()
  }, [])

  const loadConfiguration = async () => {
    setIsLoading(true)
    try {
      // TODO: Load real configuration from backend
      // For now, using mock data with Brazilian wedding defaults

      const mockConfig: WeddingConfiguration = {
        basicInfo: {
          brideNames: 'Ylana',
          groomNames: 'Hel',
          weddingDate: '2025-11-20',
          venue: {
            name: 'Espaço Villa Leopoldina',
            address: 'Rua Carlos Weber, 1235',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '05303-000',
            coordinates: { lat: -23.5505, lng: -46.6333 }
          },
          ceremony: {
            time: '16:00',
            duration: '45',
            type: 'Cerimônia Civil'
          },
          reception: {
            time: '18:00',
            duration: '360',
            type: 'Festa de Casamento'
          }
        },
        guestSettings: {
          maxGuests: 150,
          allowPlusOnes: true,
          childrenWelcome: true,
          rsvpDeadline: '2025-10-25',
          reminderSettings: {
            enabled: true,
            firstReminder: 30,
            finalReminder: 7
          }
        },
        websiteSettings: {
          theme: {
            primaryColor: '#D4A574', // blush
            secondaryColor: '#8B5A5A', // burgundy
            fontFamily: 'Playfair Display',
            style: 'romantic'
          },
          features: {
            giftRegistry: true,
            rsvpForm: true,
            photoGallery: true,
            timeline: true,
            guestbook: true,
            liveStreaming: false
          },
          customPages: [
            {
              id: '1',
              title: 'Nossa História',
              content: 'A história de amor de Hel e Ylana...',
              enabled: true
            },
            {
              id: '2',
              title: 'Como Chegar',
              content: 'Informações sobre transporte e hospedagem...',
              enabled: true
            }
          ]
        },
        communicationSettings: {
          email: {
            enabled: true,
            senderName: 'Hel & Ylana - Casamento',
            senderEmail: 'casamento@thousandaysof.love',
            templates: {
              confirmation: {
                subject: '✨ Confirmação de Presença - Casamento Hel & Ylana',
                content: 'Obrigado por confirmar sua presença em nosso casamento...'
              },
              reminder: {
                subject: '💕 Lembrete: Confirme sua presença no nosso casamento',
                content: 'Esperamos você no nosso grande dia...'
              },
              thankyou: {
                subject: '💝 Obrigado pelo presente!',
                content: 'Ficamos muito felizes com seu carinho...'
              }
            }
          },
          sms: {
            enabled: false,
            templates: {
              confirmation: 'Obrigado por confirmar! Nos vemos no dia 11/11/25 ❤️',
              reminder: 'Não esqueça de confirmar sua presença no nosso casamento! Link: {link}'
            }
          }
        },
        paymentSettings: {
          mercadoPago: {
            enabled: true,
            publicKey: 'TEST-xxx-xxx',
            accessToken: 'TEST-xxx-xxx',
            webhookUrl: 'https://thousandaysof.love/api/webhooks/mercadopago'
          },
          pixSettings: {
            enabled: true,
            pixKey: 'casamento@thousandaysof.love',
            pixKeyType: 'email',
            bankName: 'Banco do Brasil'
          },
          giftDelivery: {
            allowDelivery: true,
            deliveryAddress: 'Rua das Flores, 123 - São Paulo, SP',
            instructions: 'Aceita entregas de segunda a sexta, das 9h às 17h'
          }
        },
        socialSettings: {
          hashtag: '#MilDiasDeAmor',
          instagram: '@helanaylana',
          facebook: 'facebook.com/helanaylana',
          website: 'thousandaysof.love',
          shareableContent: {
            saveTheDate: 'Reservem a data: 11/11/2025! 💕',
            invitation: 'Vocês estão convidados para o nosso casamento! 🎉',
            thankyou: 'Obrigado por fazerem parte do nosso dia especial! ❤️'
          }
        }
      }

      setConfig(mockConfig)
    } catch (error) {
      console.error('Error loading configuration:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveConfiguration = async () => {
    if (!config) return

    setIsSaving(true)
    try {
      // TODO: Save configuration to backend
      if (process.env.NODE_ENV === 'development') {
        console.log('Saving configuration:', config)
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      setHasChanges(false)
      alert('Configurações salvas com sucesso!')
    } catch (error) {
      console.error('Error saving configuration:', error)
      alert('Erro ao salvar configurações')
    } finally {
      setIsSaving(false)
    }
  }

  const updateConfig = (section: keyof WeddingConfiguration, updates: any) => {
    if (!config) return

    setConfig(prev => ({
      ...prev!,
      [section]: {
        ...prev![section],
        ...updates
      }
    }))
    setHasChanges(true)
  }

  const sections = [
    { id: 'basic' as const, label: 'Informações Básicas', icon: Info },
    { id: 'guests' as const, label: 'Convidados', icon: Users },
    { id: 'website' as const, label: 'Website', icon: Globe },
    { id: 'communication' as const, label: 'Comunicação', icon: Mail },
    { id: 'payment' as const, label: 'Pagamentos', icon: Smartphone },
    { id: 'social' as const, label: 'Redes Sociais', icon: Heart }
  ]

  if (isLoading || !config) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blush-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-burgundy-700 font-medium">Carregando configurações...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-playfair font-bold text-burgundy-800 mb-2">
            Configurações do Casamento
          </h2>
          <p className="text-burgundy-600">
            Personalize todos os aspectos do seu site de casamento
          </p>
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <Badge variant="warning" className="mr-2">
              Alterações não salvas
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={loadConfiguration}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Recarregar
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={saveConfiguration}
            disabled={!hasChanges || isSaving}
            className="flex items-center gap-2"
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </div>

      {/* Section Navigation */}
      <Card className="p-6 mb-6">
        <div className="flex flex-wrap gap-2">
          {sections.map(section => {
            const Icon = section.icon
            const isActive = activeSection === section.id

            return (
              <Button
                key={section.id}
                variant={isActive ? 'primary' : 'outline'}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 transition-all duration-300 ${
                  isActive ? 'shadow-lg' : 'hover:shadow-md'
                }`}
              >
                <Icon className="w-4 h-4" />
                {section.label}
              </Button>
            )
          })}
        </div>
      </Card>

      {/* Configuration Content */}
      <Card className="p-6">
        {/* Basic Information */}
        {activeSection === 'basic' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold text-burgundy-800 mb-4">Informações Básicas do Casamento</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-burgundy-700 mb-2">
                  Nome da Noiva
                </label>
                <Input
                  value={config.basicInfo.brideNames}
                  onChange={(e) => updateConfig('basicInfo', { brideNames: e.target.value })}
                  placeholder="Nome da noiva"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-burgundy-700 mb-2">
                  Nome do Noivo
                </label>
                <Input
                  value={config.basicInfo.groomNames}
                  onChange={(e) => updateConfig('basicInfo', { groomNames: e.target.value })}
                  placeholder="Nome do noivo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-burgundy-700 mb-2">
                  Data do Casamento
                </label>
                <Input
                  type="date"
                  value={config.basicInfo.weddingDate}
                  onChange={(e) => updateConfig('basicInfo', { weddingDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-burgundy-700 mb-2">
                  Nome do Local
                </label>
                <Input
                  value={config.basicInfo.venue.name}
                  onChange={(e) => updateConfig('basicInfo', {
                    venue: { ...config.basicInfo.venue, name: e.target.value }
                  })}
                  placeholder="Nome do espaço"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-burgundy-700 mb-2">
                Endereço Completo
              </label>
              <Textarea
                value={`${config.basicInfo.venue.address}, ${config.basicInfo.venue.city}, ${config.basicInfo.venue.state}`}
                onChange={(e) => {
                  const [address, city, state] = e.target.value.split(', ')
                  updateConfig('basicInfo', {
                    venue: {
                      ...config.basicInfo.venue,
                      address: address || '',
                      city: city || '',
                      state: state || ''
                    }
                  })
                }}
                placeholder="Endereço completo do casamento"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-burgundy-800 mb-3">Cerimônia</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-burgundy-700 mb-1">
                      Horário
                    </label>
                    <Input
                      type="time"
                      value={config.basicInfo.ceremony.time}
                      onChange={(e) => updateConfig('basicInfo', {
                        ceremony: { ...config.basicInfo.ceremony, time: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-burgundy-700 mb-1">
                      Tipo
                    </label>
                    <Input
                      value={config.basicInfo.ceremony.type}
                      onChange={(e) => updateConfig('basicInfo', {
                        ceremony: { ...config.basicInfo.ceremony, type: e.target.value }
                      })}
                      placeholder="Ex: Cerimônia Civil"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-burgundy-800 mb-3">Recepção</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-burgundy-700 mb-1">
                      Horário
                    </label>
                    <Input
                      type="time"
                      value={config.basicInfo.reception.time}
                      onChange={(e) => updateConfig('basicInfo', {
                        reception: { ...config.basicInfo.reception, time: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-burgundy-700 mb-1">
                      Tipo
                    </label>
                    <Input
                      value={config.basicInfo.reception.type}
                      onChange={(e) => updateConfig('basicInfo', {
                        reception: { ...config.basicInfo.reception, type: e.target.value }
                      })}
                      placeholder="Ex: Festa de Casamento"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Guest Settings */}
        {activeSection === 'guests' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold text-burgundy-800 mb-4">Configurações de Convidados</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-burgundy-700 mb-2">
                  Número Máximo de Convidados
                </label>
                <Input
                  type="number"
                  value={config.guestSettings.maxGuests}
                  onChange={(e) => updateConfig('guestSettings', { maxGuests: parseInt(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-burgundy-700 mb-2">
                  Prazo Final para RSVP
                </label>
                <Input
                  type="date"
                  value={config.guestSettings.rsvpDeadline}
                  onChange={(e) => updateConfig('guestSettings', { rsvpDeadline: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-burgundy-800">Políticas de Convidados</h4>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="allowPlusOnes"
                    checked={config.guestSettings.allowPlusOnes}
                    onChange={(e) => updateConfig('guestSettings', { allowPlusOnes: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="allowPlusOnes" className="text-sm text-burgundy-700">
                    Permitir acompanhantes
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="childrenWelcome"
                    checked={config.guestSettings.childrenWelcome}
                    onChange={(e) => updateConfig('guestSettings', { childrenWelcome: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="childrenWelcome" className="text-sm text-burgundy-700">
                    Crianças são bem-vindas
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-burgundy-800">Lembretes Automáticos</h4>

              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  id="reminderEnabled"
                  checked={config.guestSettings.reminderSettings.enabled}
                  onChange={(e) => updateConfig('guestSettings', {
                    reminderSettings: {
                      ...config.guestSettings.reminderSettings,
                      enabled: e.target.checked
                    }
                  })}
                  className="rounded border-gray-300"
                />
                <label htmlFor="reminderEnabled" className="text-sm text-burgundy-700">
                  Ativar lembretes automáticos
                </label>
              </div>

              {config.guestSettings.reminderSettings.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                  <div>
                    <label className="block text-sm font-medium text-burgundy-700 mb-2">
                      Primeiro lembrete (dias antes do prazo)
                    </label>
                    <Input
                      type="number"
                      value={config.guestSettings.reminderSettings.firstReminder}
                      onChange={(e) => updateConfig('guestSettings', {
                        reminderSettings: {
                          ...config.guestSettings.reminderSettings,
                          firstReminder: parseInt(e.target.value)
                        }
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-burgundy-700 mb-2">
                      Lembrete final (dias antes do prazo)
                    </label>
                    <Input
                      type="number"
                      value={config.guestSettings.reminderSettings.finalReminder}
                      onChange={(e) => updateConfig('guestSettings', {
                        reminderSettings: {
                          ...config.guestSettings.reminderSettings,
                          finalReminder: parseInt(e.target.value)
                        }
                      })}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Website Settings */}
        {activeSection === 'website' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold text-burgundy-800 mb-4">Configurações do Website</h3>

            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-burgundy-800 mb-3">Tema e Aparência</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-burgundy-700 mb-2">
                      Cor Primária
                    </label>
                    <Input
                      type="color"
                      value={config.websiteSettings.theme.primaryColor}
                      onChange={(e) => updateConfig('websiteSettings', {
                        theme: { ...config.websiteSettings.theme, primaryColor: e.target.value }
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-burgundy-700 mb-2">
                      Cor Secundária
                    </label>
                    <Input
                      type="color"
                      value={config.websiteSettings.theme.secondaryColor}
                      onChange={(e) => updateConfig('websiteSettings', {
                        theme: { ...config.websiteSettings.theme, secondaryColor: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-burgundy-800 mb-3">Funcionalidades do Site</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(config.websiteSettings.features).map(([feature, enabled]) => (
                    <div key={feature} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={feature}
                        checked={enabled}
                        onChange={(e) => updateConfig('websiteSettings', {
                          features: {
                            ...config.websiteSettings.features,
                            [feature]: e.target.checked
                          }
                        })}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor={feature} className="text-sm text-burgundy-700 capitalize">
                        {feature.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Communication Settings */}
        {activeSection === 'communication' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold text-burgundy-800 mb-4">Configurações de Comunicação</h3>

            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-burgundy-800 mb-3">Email</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="emailEnabled"
                      checked={config.communicationSettings.email.enabled}
                      onChange={(e) => updateConfig('communicationSettings', {
                        email: {
                          ...config.communicationSettings.email,
                          enabled: e.target.checked
                        }
                      })}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="emailEnabled" className="text-sm text-burgundy-700">
                      Ativar notificações por email
                    </label>
                  </div>

                  {config.communicationSettings.email.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                      <div>
                        <label className="block text-sm font-medium text-burgundy-700 mb-2">
                          Nome do Remetente
                        </label>
                        <Input
                          value={config.communicationSettings.email.senderName}
                          onChange={(e) => updateConfig('communicationSettings', {
                            email: {
                              ...config.communicationSettings.email,
                              senderName: e.target.value
                            }
                          })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-burgundy-700 mb-2">
                          Email do Remetente
                        </label>
                        <Input
                          type="email"
                          value={config.communicationSettings.email.senderEmail}
                          onChange={(e) => updateConfig('communicationSettings', {
                            email: {
                              ...config.communicationSettings.email,
                              senderEmail: e.target.value
                            }
                          })}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-burgundy-800 mb-3">Templates de Email</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-burgundy-700 mb-2">
                      Assunto - Confirmação
                    </label>
                    <Input
                      value={config.communicationSettings.email.templates.confirmation.subject}
                      onChange={(e) => updateConfig('communicationSettings', {
                        email: {
                          ...config.communicationSettings.email,
                          templates: {
                            ...config.communicationSettings.email.templates,
                            confirmation: {
                              ...config.communicationSettings.email.templates.confirmation,
                              subject: e.target.value
                            }
                          }
                        }
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-burgundy-700 mb-2">
                      Conteúdo - Confirmação
                    </label>
                    <Textarea
                      value={config.communicationSettings.email.templates.confirmation.content}
                      onChange={(e) => updateConfig('communicationSettings', {
                        email: {
                          ...config.communicationSettings.email,
                          templates: {
                            ...config.communicationSettings.email.templates,
                            confirmation: {
                              ...config.communicationSettings.email.templates.confirmation,
                              content: e.target.value
                            }
                          }
                        }
                      })}
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Payment Settings */}
        {activeSection === 'payment' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold text-burgundy-800 mb-4">Configurações de Pagamento</h3>

            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-burgundy-800 mb-3">PIX</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="pixEnabled"
                      checked={config.paymentSettings.pixSettings.enabled}
                      onChange={(e) => updateConfig('paymentSettings', {
                        pixSettings: {
                          ...config.paymentSettings.pixSettings,
                          enabled: e.target.checked
                        }
                      })}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="pixEnabled" className="text-sm text-burgundy-700">
                      Ativar pagamentos PIX
                    </label>
                  </div>

                  {config.paymentSettings.pixSettings.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                      <div>
                        <label className="block text-sm font-medium text-burgundy-700 mb-2">
                          Chave PIX
                        </label>
                        <Input
                          value={config.paymentSettings.pixSettings.pixKey}
                          onChange={(e) => updateConfig('paymentSettings', {
                            pixSettings: {
                              ...config.paymentSettings.pixSettings,
                              pixKey: e.target.value
                            }
                          })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-burgundy-700 mb-2">
                          Banco
                        </label>
                        <Input
                          value={config.paymentSettings.pixSettings.bankName}
                          onChange={(e) => updateConfig('paymentSettings', {
                            pixSettings: {
                              ...config.paymentSettings.pixSettings,
                              bankName: e.target.value
                            }
                          })}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-burgundy-800 mb-3">Entrega de Presentes</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="deliveryEnabled"
                      checked={config.paymentSettings.giftDelivery.allowDelivery}
                      onChange={(e) => updateConfig('paymentSettings', {
                        giftDelivery: {
                          ...config.paymentSettings.giftDelivery,
                          allowDelivery: e.target.checked
                        }
                      })}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="deliveryEnabled" className="text-sm text-burgundy-700">
                      Permitir entrega de presentes
                    </label>
                  </div>

                  {config.paymentSettings.giftDelivery.allowDelivery && (
                    <div className="pl-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-burgundy-700 mb-2">
                          Endereço para Entrega
                        </label>
                        <Textarea
                          value={config.paymentSettings.giftDelivery.deliveryAddress}
                          onChange={(e) => updateConfig('paymentSettings', {
                            giftDelivery: {
                              ...config.paymentSettings.giftDelivery,
                              deliveryAddress: e.target.value
                            }
                          })}
                          rows={2}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-burgundy-700 mb-2">
                          Instruções de Entrega
                        </label>
                        <Textarea
                          value={config.paymentSettings.giftDelivery.instructions}
                          onChange={(e) => updateConfig('paymentSettings', {
                            giftDelivery: {
                              ...config.paymentSettings.giftDelivery,
                              instructions: e.target.value
                            }
                          })}
                          rows={3}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Social Settings */}
        {activeSection === 'social' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold text-burgundy-800 mb-4">Redes Sociais</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-burgundy-700 mb-2">
                  Hashtag do Casamento
                </label>
                <Input
                  value={config.socialSettings.hashtag}
                  onChange={(e) => updateConfig('socialSettings', { hashtag: e.target.value })}
                  placeholder="#MilDiasDeAmor"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-burgundy-700 mb-2">
                  Instagram
                </label>
                <Input
                  value={config.socialSettings.instagram}
                  onChange={(e) => updateConfig('socialSettings', { instagram: e.target.value })}
                  placeholder="@usuario"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-burgundy-700 mb-2">
                  Facebook
                </label>
                <Input
                  value={config.socialSettings.facebook}
                  onChange={(e) => updateConfig('socialSettings', { facebook: e.target.value })}
                  placeholder="facebook.com/usuario"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-burgundy-700 mb-2">
                  Website
                </label>
                <Input
                  value={config.socialSettings.website}
                  onChange={(e) => updateConfig('socialSettings', { website: e.target.value })}
                  placeholder="thousandaysof.love"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-burgundy-800">Conteúdo para Compartilhamento</h4>

              <div>
                <label className="block text-sm font-medium text-burgundy-700 mb-2">
                  Save the Date
                </label>
                <Textarea
                  value={config.socialSettings.shareableContent.saveTheDate}
                  onChange={(e) => updateConfig('socialSettings', {
                    shareableContent: {
                      ...config.socialSettings.shareableContent,
                      saveTheDate: e.target.value
                    }
                  })}
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-burgundy-700 mb-2">
                  Convite
                </label>
                <Textarea
                  value={config.socialSettings.shareableContent.invitation}
                  onChange={(e) => updateConfig('socialSettings', {
                    shareableContent: {
                      ...config.socialSettings.shareableContent,
                      invitation: e.target.value
                    }
                  })}
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-burgundy-700 mb-2">
                  Agradecimento
                </label>
                <Textarea
                  value={config.socialSettings.shareableContent.thankyou}
                  onChange={(e) => updateConfig('socialSettings', {
                    shareableContent: {
                      ...config.socialSettings.shareableContent,
                      thankyou: e.target.value
                    }
                  })}
                  rows={2}
                />
              </div>
            </div>
          </motion.div>
        )}
      </Card>

      {/* Status Footer */}
      <Card className="p-4 mt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {hasChanges ? (
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            ) : (
              <CheckCircle className="w-5 h-5 text-sage-600" />
            )}
            <span className="text-sm text-burgundy-700">
              {hasChanges ? 'Existem alterações não salvas' : 'Todas as configurações estão salvas'}
            </span>
          </div>

          <div className="text-xs text-burgundy-600">
            Última atualização: {new Date().toLocaleString('pt-BR')}
          </div>
        </div>
      </Card>
    </div>
  )
}