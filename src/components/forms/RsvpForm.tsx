'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/Textarea'
import { RadioGroup } from '@/components/ui/RadioGroup'
import { Checkbox } from '@/components/ui/Checkbox'
import { validateRsvpForm, formatFormErrors, type RsvpFormData } from '@/lib/validation/forms'
import { GuestService } from '@/lib/services/guests'
import { formatPhoneNumber, personalizedRSVPMessages } from '@/lib/utils/wedding'
import { Guest } from '@/types/wedding'

interface RsvpFormProps {
  initialGuest?: Guest
  onSuccess?: (guest: Guest) => void
  onError?: (error: string) => void
}

export function RsvpForm({ initialGuest, onSuccess, onError }: RsvpFormProps) {
  const [formData, setFormData] = useState<RsvpFormData>({
    name: initialGuest?.name || '',
    email: initialGuest?.email || '',
    phone: initialGuest?.phone || '',
    attending: initialGuest?.attending ?? null,
    dietaryRestrictions: initialGuest?.dietary_restrictions || '',
    specialRequests: initialGuest?.special_requests || '',
    invitationCode: initialGuest?.invitation_code || ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const handleInputChange = (field: keyof RsvpFormData, value: string | boolean | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }

    // Auto-format phone number
    if (field === 'phone' && typeof value === 'string') {
      setFormData(prev => ({ ...prev, [field]: formatPhoneNumber(value) }))
    }
  }

  const validateCurrentStep = () => {
    const stepErrors: Record<string, string> = {}

    if (currentStep === 1) {
      if (!formData.name?.trim()) {
        stepErrors.name = 'Nome é obrigatório'
      }
      if (!formData.email?.trim()) {
        stepErrors.email = 'E-mail é obrigatório'
      }
    }

    if (currentStep === 2) {
      if (formData.attending === null) {
        stepErrors.attending = 'Por favor, confirme sua presença'
      }
    }

    setErrors(stepErrors)
    return Object.keys(stepErrors).length === 0
  }

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    const validationErrors = validateRsvpForm(formData)
    if (validationErrors.length > 0) {
      setErrors(formatFormErrors(validationErrors))
      return
    }

    setIsSubmitting(true)

    try {
      const result = await GuestService.submitRsvp({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        attending: formData.attending!,
        dietaryRestrictions: formData.dietaryRestrictions,
        specialRequests: formData.specialRequests,
        invitationCode: formData.invitationCode
      })

      if (result.success && result.guest) {
        onSuccess?.(result.guest)
      } else {
        onError?.(result.error || 'Erro ao enviar RSVP')
      }
    } catch (error) {
      console.error('Error submitting RSVP:', error)
      onError?.('Erro interno do servidor')
    } finally {
      setIsSubmitting(false)
    }
  }

  const attendingOptions = [
    {
      value: 'true',
      label: '✨ Sim, estarei presente para celebrar!',
      description: 'Mal posso esperar para ver nossos caseiros favoritos dizerem "sim"!'
    },
    {
      value: 'false',
      label: '💔 Infelizmente não poderei comparecer',
      description: 'Sentiremos muito sua falta, mas nosso amor nos conecta mesmo à distância'
    }
  ]

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-burgundy-700">
            Passo {currentStep} de 3
          </span>
          <span className="text-sm text-gray-600">
            {currentStep === 1 && personalizedRSVPMessages.welcome}
            {currentStep === 2 && personalizedRSVPMessages.confirmation}
            {currentStep === 3 && personalizedRSVPMessages.dietaryNeeds}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blush-400 to-blush-600 h-2 rounded-full"
            initial={{ width: '33%' }}
            animate={{ width: `${(currentStep / 3) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl mb-2" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary-text)', fontWeight: '600' }}>
                  Bem-vindo à nossa história de 1000 dias! 💕
                </h2>
                <p style={{ color: 'var(--secondary-text)', fontFamily: 'var(--font-crimson)', fontStyle: 'italic' }}>
                  Como dois caseiros que se encontraram, queremos conhecer você melhor
                </p>
              </div>

              <Input
                label="Seu nome completo"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={errors.name}
                placeholder="Digite seu nome completo"
                required
              />

              <Input
                label="E-mail"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                placeholder="seu@email.com"
                required
              />

              <Input
                label="Telefone (opcional)"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                error={errors.phone}
                placeholder="+55 (11) 99999-9999"
                helperText="Formato brasileiro preferido"
              />

              <Input
                label="Código do convite (se tiver)"
                value={formData.invitationCode}
                onChange={(e) => handleInputChange('invitationCode', e.target.value)}
                error={errors.invitationCode}
                placeholder="ABCD1234"
                helperText="Encontre este código no seu convite"
              />

              <div className="flex justify-end">
                <Button type="button" onClick={handleNext} variant="wedding">
                  Próximo →
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Attendance Confirmation */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl mb-2" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary-text)', fontWeight: '600' }}>
                  Você estará conosco na Casa HY? 🎉
                </h2>
                <p style={{ color: 'var(--secondary-text)', fontFamily: 'var(--font-crimson)', fontStyle: 'italic' }}>
                  Onde a arte encontra o amor e nossos 1000 dias viram para sempre!
                </p>
              </div>

              <RadioGroup
                name="attending"
                value={formData.attending?.toString()}
                onChange={(value) => handleInputChange('attending', value === 'true')}
                options={attendingOptions}
                label="Confirmação de presença"
                error={errors.attending}
                required
              />


              <div className="flex justify-between">
                <Button type="button" onClick={handlePrevious} variant="outline">
                  ← Voltar
                </Button>
                <Button type="button" onClick={handleNext} variant="wedding">
                  Próximo →
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Additional Details */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl mb-2" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary-text)', fontWeight: '600' }}>
                  Últimos toques de amor! ✨
                </h2>
                <p style={{ color: 'var(--secondary-text)', fontFamily: 'var(--font-crimson)', fontStyle: 'italic' }}>
                  Como sempre cuidamos dos nossos amigos em casa, queremos cuidar de você também
                </p>
              </div>

              <Textarea
                label="Restrições alimentares"
                value={formData.dietaryRestrictions}
                onChange={(e) => handleInputChange('dietaryRestrictions', e.target.value)}
                placeholder="Ex: vegetariano, alérgico a frutos do mar, intolerante à lactose..."
                helperText="Nossa paixão por boa comida inclui cuidar bem de todos vocês!"
                rows={3}
              />

              <Textarea
                label="Pedidos especiais ou mensagem"
                value={formData.specialRequests}
                onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                placeholder="Algum pedido especial ou uma mensagem carinhosa para os noivos..."
                helperText="Como Linda (👑), Cacao (🍫), Olivia (🌸) e Oliver (⚡) sempre nos ensinam sobre amor, queremos que se sinta especial!"
                rows={4}
              />

              <div className="flex justify-between">
                <Button type="button" onClick={handlePrevious} variant="outline">
                  ← Voltar
                </Button>
                <Button
                  type="submit"
                  variant="romantic"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando com amor para a Casa HY...' : personalizedRSVPMessages.finalButton}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  )
}
