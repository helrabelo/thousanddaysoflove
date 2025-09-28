"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Gift, Heart, Check, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn, formatCurrency } from "@/lib/utils"

export interface GiftItem {
  id: string
  name: string
  description: string
  price: number
  imageUrl?: string
  category: "kitchen" | "bedroom" | "living" | "bathroom" | "experience" | "honeymoon"
  priority: "high" | "medium" | "low"
  isReserved: boolean
  reservedBy?: string
  pixCode?: string
  storeUrl?: string
}

export interface GiftCardProps {
  gift: GiftItem
  onReserve?: (giftId: string) => Promise<void>
  onPurchase?: (giftId: string, paymentMethod: "pix" | "store") => Promise<void>
  variant?: "default" | "compact" | "featured"
  showReserveButton?: boolean
  className?: string
}

const categoryIcons = {
  kitchen: "🍳",
  bedroom: "🛏️",
  living: "🛋️",
  bathroom: "🛁",
  experience: "✨",
  honeymoon: "🌴"
}

const categoryLabels = {
  kitchen: "Cozinha",
  bedroom: "Quarto",
  living: "Sala",
  bathroom: "Banheiro",
  experience: "Experiência",
  honeymoon: "Lua de Mel"
}

const priorityColors = {
  high: "romantic",
  medium: "gold",
  low: "default"
} as const

const GiftCard: React.FC<GiftCardProps> = ({
  gift,
  onReserve,
  onPurchase,
  variant = "default",
  showReserveButton = true,
  className
}) => {
  const [isReserving, setIsReserving] = React.useState(false)
  const [isPurchasing, setIsPurchasing] = React.useState<"pix" | "store" | null>(null)

  const handleReserve = async () => {
    if (!onReserve || gift.isReserved) return

    setIsReserving(true)
    try {
      await onReserve(gift.id)
    } catch (error) {
      console.error("Erro ao reservar presente:", error)
    } finally {
      setIsReserving(false)
    }
  }

  const handlePurchase = async (method: "pix" | "store") => {
    if (!onPurchase) return

    setIsPurchasing(method)
    try {
      await onPurchase(gift.id, method)
    } catch (error) {
      console.error("Erro ao processar compra:", error)
    } finally {
      setIsPurchasing(null)
    }
  }

  if (variant === "compact") {
    return (
      <Card
        variant={gift.isReserved ? "default" : "elegant"}
        className={cn(
          "transition-all duration-300",
          !gift.isReserved && "hover:scale-105",
          gift.isReserved && "opacity-75",
          className
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">{categoryIcons[gift.category]}</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-burgundy-800 font-heading truncate">
                {gift.name}
              </h3>
              <p className="text-sm text-sage-600 font-body line-clamp-2">
                {gift.description}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-lg font-bold text-blush-600">
                  {formatCurrency(gift.price)}
                </span>
                {gift.isReserved ? (
                  <Badge variant="confirmed" size="sm">
                    <Check className="h-3 w-3 mr-1" />
                    Reservado
                  </Badge>
                ) : (
                  <Badge variant={priorityColors[gift.priority]} size="sm">
                    {gift.priority === "high" ? "Prioridade" :
                     gift.priority === "medium" ? "Desejado" : "Opcional"}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === "featured") {
    return (
      <Card
        variant="floating"
        className={cn(
          "overflow-hidden",
          gift.isReserved && "opacity-75",
          className
        )}
      >
        {gift.imageUrl && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={gift.imageUrl}
              alt={gift.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            />
            <div className="absolute top-4 left-4">
              <Badge variant={priorityColors[gift.priority]}>
                {gift.priority === "high" ? "🌟 Prioridade" :
                 gift.priority === "medium" ? "💝 Desejado" : "🎁 Opcional"}
              </Badge>
            </div>
            {gift.isReserved && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="confirmed" size="lg">
                  <Check className="h-4 w-4 mr-2" />
                  Reservado
                </Badge>
              </div>
            )}
          </div>
        )}

        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{gift.name}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-sage-600 font-body">
                  {categoryIcons[gift.category]} {categoryLabels[gift.category]}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blush-600">
                {formatCurrency(gift.price)}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sage-700 font-body">{gift.description}</p>

          {!gift.isReserved && (
            <div className="space-y-3">
              {showReserveButton && (
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleReserve}
                  isLoading={isReserving}
                  className="w-full"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Reservar para Presentear
                </Button>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {gift.pixCode && (
                  <Button
                    variant="romantic"
                    size="sm"
                    onClick={() => handlePurchase("pix")}
                    isLoading={isPurchasing === "pix"}
                  >
                    💳 Pagar com PIX
                  </Button>
                )}

                {gift.storeUrl && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handlePurchase("store")}
                    isLoading={isPurchasing === "store"}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Ver na Loja
                  </Button>
                )}
              </div>
            </div>
          )}

          {gift.isReserved && gift.reservedBy && (
            <div className="text-center text-sm text-sage-600 font-body">
              Reservado por <span className="font-semibold">{gift.reservedBy}</span>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        variant={gift.isReserved ? "default" : "romantic"}
        className={cn(
          "h-full",
          gift.isReserved && "opacity-75",
          className
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl">{categoryIcons[gift.category]}</span>
              <div>
                <CardTitle className="text-lg">{gift.name}</CardTitle>
                <p className="text-sm text-sage-600 font-body">
                  {categoryLabels[gift.category]}
                </p>
              </div>
            </div>
            <Badge variant={priorityColors[gift.priority]} size="sm">
              {gift.priority === "high" ? "Alta" :
               gift.priority === "medium" ? "Média" : "Baixa"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sage-700 font-body text-sm">{gift.description}</p>

          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-blush-600">
              {formatCurrency(gift.price)}
            </span>

            {gift.isReserved ? (
              <Badge variant="confirmed">
                <Check className="h-3 w-3 mr-1" />
                Reservado
              </Badge>
            ) : (
              <div className="flex space-x-2">
                {showReserveButton && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReserve}
                    isLoading={isReserving}
                  >
                    <Gift className="h-4 w-4 mr-1" />
                    Reservar
                  </Button>
                )}
              </div>
            )}
          </div>

          {!gift.isReserved && (gift.pixCode || gift.storeUrl) && (
            <div className="pt-2 space-y-2">
              {gift.pixCode && (
                <Button
                  variant="romantic"
                  size="sm"
                  onClick={() => handlePurchase("pix")}
                  isLoading={isPurchasing === "pix"}
                  className="w-full"
                >
                  💳 Comprar com PIX
                </Button>
              )}

              {gift.storeUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePurchase("store")}
                  isLoading={isPurchasing === "store"}
                  className="w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Ver na Loja Online
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

GiftCard.displayName = "GiftCard"

export { GiftCard }