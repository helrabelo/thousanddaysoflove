"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  User,
  Mail,
  Phone,
  Users,
  Check,
  X,
  Clock,
  MessageSquare,
  Edit,
  Trash2,
  Send
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn, formatDateTime, formatPhoneNumber } from "@/lib/utils"

export interface Guest {
  id: string
  name: string
  email: string
  phone: string
  attendance: "confirmed" | "declined" | "pending"
  companions: number
  dietaryRestrictions?: string
  message?: string
  invitationSent: boolean
  invitationSentAt?: Date
  rsvpDate?: Date
  createdAt: Date
  updatedAt: Date
}

export interface GuestCardProps {
  guest: Guest
  onEdit?: (guest: Guest) => void
  onDelete?: (guestId: string) => void
  onSendInvitation?: (guestId: string) => Promise<void>
  onResendInvitation?: (guestId: string) => Promise<void>
  variant?: "default" | "compact" | "detailed"
  showActions?: boolean
  className?: string
}

const attendanceColors = {
  confirmed: "confirmed",
  declined: "declined",
  pending: "pending"
} as const

const attendanceIcons = {
  confirmed: Check,
  declined: X,
  pending: Clock
}

const attendanceLabels = {
  confirmed: "Confirmado",
  declined: "Não Virá",
  pending: "Pendente"
}

const GuestCard: React.FC<GuestCardProps> = ({
  guest,
  onEdit,
  onDelete,
  onSendInvitation,
  onResendInvitation,
  variant = "default",
  showActions = true,
  className
}) => {
  const [isSendingInvitation, setIsSendingInvitation] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const AttendanceIcon = attendanceIcons[guest.attendance]

  const handleSendInvitation = async () => {
    if (!onSendInvitation) return

    setIsSendingInvitation(true)
    try {
      await onSendInvitation(guest.id)
    } catch (error) {
      console.error("Erro ao enviar convite:", error)
    } finally {
      setIsSendingInvitation(false)
    }
  }

  const handleResendInvitation = async () => {
    if (!onResendInvitation) return

    setIsSendingInvitation(true)
    try {
      await onResendInvitation(guest.id)
    } catch (error) {
      console.error("Erro ao reenviar convite:", error)
    } finally {
      setIsSendingInvitation(false)
    }
  }

  const handleDelete = async () => {
    if (!onDelete || !confirm(`Tem certeza que deseja excluir ${guest.name}?`)) return

    setIsDeleting(true)
    try {
      await onDelete(guest.id)
    } catch (error) {
      console.error("Erro ao excluir convidado:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const totalGuests = guest.companions + 1

  if (variant === "compact") {
    return (
      <Card variant="elegant" className={cn("hover:scale-105 transition-all duration-300", className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blush-400 to-blush-600 rounded-full flex items-center justify-center text-white font-semibold">
                {guest.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-burgundy-800 font-heading">
                  {guest.name}
                </h3>
                <p className="text-sm text-sage-600 font-body">
                  {totalGuests} {totalGuests === 1 ? "pessoa" : "pessoas"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant={attendanceColors[guest.attendance]} size="sm">
                <AttendanceIcon className="h-3 w-3 mr-1" />
                {attendanceLabels[guest.attendance]}
              </Badge>

              {showActions && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit?.(guest)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === "detailed") {
    return (
      <Card variant="romantic" className={cn("", className)}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blush-400 to-blush-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {guest.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <CardTitle className="text-xl">{guest.name}</CardTitle>
                <div className="flex items-center space-x-4 mt-1 text-sm text-sage-600">
                  <div className="flex items-center space-x-1">
                    <Mail className="h-4 w-4" />
                    <span>{guest.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Phone className="h-4 w-4" />
                    <span>{formatPhoneNumber(guest.phone)}</span>
                  </div>
                </div>
              </div>
            </div>

            <Badge variant={attendanceColors[guest.attendance]}>
              <AttendanceIcon className="h-4 w-4 mr-2" />
              {attendanceLabels[guest.attendance]}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Guest Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blush-500" />
                <span className="text-sm font-medium text-burgundy-700">
                  Total de Pessoas: {totalGuests}
                </span>
              </div>

              {guest.companions > 0 && (
                <p className="text-sm text-sage-600 ml-6">
                  + {guest.companions} {guest.companions === 1 ? "acompanhante" : "acompanhantes"}
                </p>
              )}

              {guest.dietaryRestrictions && (
                <div className="text-sm">
                  <span className="font-medium text-burgundy-700">Restrições:</span>
                  <p className="text-sage-600 ml-2">{guest.dietaryRestrictions}</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium text-burgundy-700">Convite:</span>
                <p className={cn(
                  "ml-2",
                  guest.invitationSent ? "text-sage-600" : "text-burgundy-600"
                )}>
                  {guest.invitationSent
                    ? `Enviado em ${formatDateTime(guest.invitationSentAt!)}`
                    : "Não enviado"
                  }
                </p>
              </div>

              {guest.rsvpDate && (
                <div className="text-sm">
                  <span className="font-medium text-burgundy-700">RSVP:</span>
                  <p className="text-sage-600 ml-2">
                    {formatDateTime(guest.rsvpDate)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Message */}
          {guest.message && (
            <div className="p-3 bg-blush-50 rounded-lg border border-blush-200">
              <div className="flex items-start space-x-2">
                <MessageSquare className="h-4 w-4 text-blush-500 mt-0.5" />
                <div>
                  <span className="text-sm font-medium text-burgundy-700">Mensagem:</span>
                  <p className="text-sm text-sage-700 mt-1">{guest.message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          {showActions && (
            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit?.(guest)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Editar
              </Button>

              {guest.invitationSent ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleResendInvitation}
                  isLoading={isSendingInvitation}
                >
                  <Send className="h-4 w-4 mr-1" />
                  Reenviar Convite
                </Button>
              ) : (
                <Button
                  variant="romantic"
                  size="sm"
                  onClick={handleSendInvitation}
                  isLoading={isSendingInvitation}
                >
                  <Send className="h-4 w-4 mr-1" />
                  Enviar Convite
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                isLoading={isDeleting}
                className="text-burgundy-600 hover:text-burgundy-700 hover:bg-burgundy-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Excluir
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card variant="elegant" className={cn("h-full", className)}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blush-400 to-blush-600 rounded-full flex items-center justify-center text-white font-semibold">
                {guest.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <CardTitle className="text-lg">{guest.name}</CardTitle>
                <p className="text-sm text-sage-600 font-body">
                  {guest.email}
                </p>
              </div>
            </div>

            <Badge variant={attendanceColors[guest.attendance]} size="sm">
              <AttendanceIcon className="h-3 w-3 mr-1" />
              {attendanceLabels[guest.attendance]}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1 text-sage-600">
              <Users className="h-4 w-4" />
              <span>{totalGuests} {totalGuests === 1 ? "pessoa" : "pessoas"}</span>
            </div>

            <div className={cn(
              "text-xs px-2 py-1 rounded-full",
              guest.invitationSent
                ? "bg-sage-100 text-sage-700"
                : "bg-burgundy-100 text-burgundy-700"
            )}>
              {guest.invitationSent ? "Convite enviado" : "Convite pendente"}
            </div>
          </div>

          {guest.message && (
            <div className="text-sm">
              <p className="text-sage-600 line-clamp-2">
                "{guest.message}"
              </p>
            </div>
          )}

          {showActions && (
            <div className="flex justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit?.(guest)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Editar
              </Button>

              {!guest.invitationSent && (
                <Button
                  variant="romantic"
                  size="sm"
                  onClick={handleSendInvitation}
                  isLoading={isSendingInvitation}
                >
                  <Send className="h-4 w-4 mr-1" />
                  Enviar
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

GuestCard.displayName = "GuestCard"

export { GuestCard }