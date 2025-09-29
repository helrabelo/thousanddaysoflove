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
import { formatPhoneNumber } from '@/lib/utils/wedding'
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
    plusOne: initialGuest?.plus_one || false,
    plusOneName: initialGuest?.plus_one_name || '',
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
      if (formData.plusOne && !formData.plusOneName?.trim()) {
        stepErrors.plusOneName = 'Nome do acompanhante é obrigatório'
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
        plusOne: formData.plusOne,
        plusOneName: formData.plusOneName,
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
      label: '✨ Sim, estarei presente!',
      description: 'Mal posso esperar para celebrar os mil dias de amor de vocês!'
    },
    {
      value: 'false',
      label: '💔 Infelizmente não poderei comparecer',
      description: 'Sentiremos muito sua falta, mas estaremos unidos pelo amor'
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
            {currentStep === 1 && 'Encontrando você na nossa história de amor...'}
            {currentStep === 2 && 'Confirmando sua presença em nosso grande dia'}
            {currentStep === 3 && 'Cuidaremos de você com todo carinho'}
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
                <h2 className="text-2xl font-playfair font-bold text-burgundy-800 mb-2">
                  Vamos começar! 💕
                </h2>
                <p className="text-gray-600">
                  Conte-nos um pouco sobre você
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
                <Button type="button" onClick={handleNext} variant="primary">
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
                <h2 className="text-2xl font-playfair font-bold text-burgundy-800 mb-2">
                  Você virá celebrar nossos mil dias? 🎉
                </h2>
                <p className="text-gray-600">
                  Sua presença tornará nosso dia ainda mais especial!
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

              {formData.attending === true && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4"
                >
                  <Checkbox
                    checked={formData.plusOne}
                    onChange={(e) => handleInputChange('plusOne', e.target.checked)}
                    label="Trarei um acompanhante"
                    description="Se você deseja trazer alguém especial"
                  />

                  {formData.plusOne && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <Input
                        label="Nome do acompanhante"
                        value={formData.plusOneName}
                        onChange={(e) => handleInputChange('plusOneName', e.target.value)}
                        error={errors.plusOneName}
                        placeholder="Nome completo do acompanhante"
                        required={formData.plusOne}
                      />
                    </motion.div>
                  )}
                </motion.div>
              )}

              <div className="flex justify-between">
                <Button type="button" onClick={handlePrevious} variant="outline">
                  ← Voltar
                </Button>
                <Button type="button" onClick={handleNext} variant="primary">
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
                <h2 className="text-2xl font-playfair font-bold text-burgundy-800 mb-2">
                  Quase lá! ✨
                </h2>
                <p className="text-gray-600">
                  Últimos detalhes para tornar tudo perfeito
                </p>
              </div>

              <Textarea
                label="Restrições alimentares"
                value={formData.dietaryRestrictions}
                onChange={(e) => handleInputChange('dietaryRestrictions', e.target.value)}
                placeholder="Ex: vegetariano, alérgico a frutos do mar, intolerante à lactose..."
                helperText="Queremos garantir que você tenha uma experiência gastronômica incrível!"
                rows={3}
              />

              <Textarea
                label="Pedidos especiais ou mensagem"
                value={formData.specialRequests}
                onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                placeholder="Algum pedido especial ou uma mensagem carinhosa para os noivos..."
                helperText="Conte-nos se há algo especial que podemos fazer por você ou deixe uma mensagem ❤️"
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
                  {isSubmitting ? 'Enviando com amor...' : 'Confirmar presença nos mil dias 💕'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  )
}