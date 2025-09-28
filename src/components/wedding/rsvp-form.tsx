"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Heart, Send, UserCheck, UserX, Users, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface RSVPFormData {
  name: string
  email: string
  phone: string
  attendance: "confirmed" | "declined" | ""
  companions: number
  dietaryRestrictions: string
  message: string
}

export interface RSVPFormProps {
  onSubmit: (data: RSVPFormData) => Promise<void>
  isLoading?: boolean
  className?: string
}

const RSVPForm: React.FC<RSVPFormProps> = ({
  onSubmit,
  isLoading = false,
  className
}) => {
  const [formData, setFormData] = React.useState<RSVPFormData>({
    name: "",
    email: "",
    phone: "",
    attendance: "",
    companions: 0,
    dietaryRestrictions: "",
    message: ""
  })

  const [errors, setErrors] = React.useState<Partial<RSVPFormData>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<RSVPFormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório"
    }

    if (!formData.attendance) {
      newErrors.attendance = "Por favor, confirme sua presença"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error("Erro ao enviar RSVP:", error)
    }
  }

  const handleInputChange = (field: keyof RSVPFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <Card variant="romantic" className={cn("max-w-2xl mx-auto", className)}>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2">
          <Heart className="h-6 w-6 text-blush-500" />
          <span>Confirme sua Presença</span>
          <Heart className="h-6 w-6 text-blush-500" />
        </CardTitle>
        <p className="text-sage-600 font-body">
          Sua presença tornará nosso dia ainda mais especial
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-burgundy-800 font-heading">
              Informações Pessoais
            </h3>

            <Input
              label="Nome Completo"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={errors.name}
              required
              placeholder="Seu nome completo"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                error={errors.email}
                required
                placeholder="seu@email.com"
              />

              <Input
                label="Telefone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                error={errors.phone}
                required
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          {/* Attendance Confirmation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-burgundy-800 font-heading">
              Confirmação de Presença
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleInputChange("attendance", "confirmed")}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all duration-300 text-left",
                  formData.attendance === "confirmed"
                    ? "border-sage-400 bg-sage-50 shadow-lg"
                    : "border-blush-200 bg-white/50 hover:border-sage-300"
                )}
              >
                <div className="flex items-center space-x-3">
                  <UserCheck className={cn(
                    "h-6 w-6",
                    formData.attendance === "confirmed" ? "text-sage-600" : "text-sage-400"
                  )} />
                  <div>
                    <div className="font-semibold text-burgundy-800">Sim, estarei presente!</div>
                    <div className="text-sm text-sage-600">Mal posso esperar para celebrar com vocês</div>
                  </div>
                </div>
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleInputChange("attendance", "declined")}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all duration-300 text-left",
                  formData.attendance === "declined"
                    ? "border-burgundy-400 bg-burgundy-50 shadow-lg"
                    : "border-blush-200 bg-white/50 hover:border-burgundy-300"
                )}
              >
                <div className="flex items-center space-x-3">
                  <UserX className={cn(
                    "h-6 w-6",
                    formData.attendance === "declined" ? "text-burgundy-600" : "text-burgundy-400"
                  )} />
                  <div>
                    <div className="font-semibold text-burgundy-800">Infelizmente não poderei ir</div>
                    <div className="text-sm text-sage-600">Estarei com vocês em pensamento</div>
                  </div>
                </div>
              </motion.button>
            </div>

            {errors.attendance && (
              <p className="text-sm text-burgundy-600">{errors.attendance}</p>
            )}
          </div>

          {/* Companions */}
          {formData.attendance === "confirmed" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blush-500" />
                <h3 className="text-lg font-semibold text-burgundy-800 font-heading">
                  Acompanhantes
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-burgundy-700 mb-2">
                  Número de acompanhantes (além de você)
                </label>
                <select
                  value={formData.companions}
                  onChange={(e) => handleInputChange("companions", parseInt(e.target.value))}
                  className="w-full px-4 py-3 border rounded-xl bg-white/50 backdrop-blur-sm border-blush-200 focus:border-blush-400 focus:ring-2 focus:ring-blush-400/20"
                >
                  <option value={0}>Só eu</option>
                  <option value={1}>1 acompanhante</option>
                  <option value={2}>2 acompanhantes</option>
                  <option value={3}>3 acompanhantes</option>
                  <option value={4}>4+ acompanhantes</option>
                </select>
              </div>

              <Input
                label="Restrições Alimentares"
                value={formData.dietaryRestrictions}
                onChange={(e) => handleInputChange("dietaryRestrictions", e.target.value)}
                placeholder="Vegetariano, vegano, alergias, etc."
                helperText="Nos ajude a preparar o melhor menu para todos"
              />
            </motion.div>
          )}

          {/* Message */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-burgundy-800 font-heading">
              Mensagem para os Noivos
            </h3>

            <div>
              <textarea
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="Deixe uma mensagem carinhosa para Hel e Ylana..."
                rows={4}
                className="w-full px-4 py-3 border rounded-xl bg-white/50 backdrop-blur-sm border-blush-200 focus:border-blush-400 focus:ring-2 focus:ring-blush-400/20 resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              variant="romantic"
              size="lg"
              isLoading={isLoading}
              className="w-full"
              disabled={!formData.attendance}
            >
              <Send className="h-5 w-5 mr-2" />
              {formData.attendance === "confirmed" ? "Confirmar Presença" : "Enviar Resposta"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

RSVPForm.displayName = "RSVPForm"

export { RSVPForm }