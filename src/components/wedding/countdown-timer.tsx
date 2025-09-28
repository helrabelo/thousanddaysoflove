"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Heart, Calendar, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { getTimeUntilWedding } from "@/lib/utils"
import { Card } from "@/components/ui/card"

export interface CountdownTimerProps {
  variant?: "default" | "hero" | "compact"
  showLabels?: boolean
  className?: string
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  variant = "default",
  showLabels = true,
  className
}) => {
  const [timeLeft, setTimeLeft] = React.useState(getTimeUntilWedding())

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilWedding())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const timeUnits = [
    { value: timeLeft.days, label: timeLeft.days === 1 ? "Dia" : "Dias", shortLabel: "D" },
    { value: timeLeft.hours, label: timeLeft.hours === 1 ? "Hora" : "Horas", shortLabel: "H" },
    { value: timeLeft.minutes, label: timeLeft.minutes === 1 ? "Minuto" : "Minutos", shortLabel: "M" },
    { value: timeLeft.seconds, label: timeLeft.seconds === 1 ? "Segundo" : "Segundos", shortLabel: "S" }
  ]

  if (timeLeft.isPast) {
    return (
      <Card variant="romantic" className={cn("p-8 text-center", className)}>
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Heart className="h-8 w-8 text-blush-500 animate-heartbeat" />
          <h2 className="text-3xl font-heading font-bold text-burgundy-800">
            Estamos Casados!
          </h2>
          <Heart className="h-8 w-8 text-blush-500 animate-heartbeat" />
        </div>
        <p className="text-sage-600 font-body">
          11 de Novembro de 2025 - O dia mais especial das nossas vidas
        </p>
      </Card>
    )
  }

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-blush-200", className)}>
        <Clock className="h-5 w-5 text-blush-500" />
        <div className="flex items-center space-x-2 font-body">
          {timeUnits.map((unit, index) => (
            <React.Fragment key={unit.label}>
              <div className="text-center">
                <div className="text-lg font-bold text-burgundy-800">
                  {unit.value.toString().padStart(2, "0")}
                </div>
                {showLabels && (
                  <div className="text-xs text-sage-600">{unit.shortLabel}</div>
                )}
              </div>
              {index < timeUnits.length - 1 && (
                <div className="text-blush-400 font-bold">:</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    )
  }

  if (variant === "hero") {
    return (
      <Card variant="glass" className={cn("p-8 text-center", className)}>
        <div className="flex items-center justify-center space-x-2 mb-6">
          <Calendar className="h-6 w-6 text-blush-500" />
          <h2 className="text-2xl font-heading font-bold text-burgundy-800">
            Contagem Regressiva
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {timeUnits.map((unit, index) => (
            <motion.div
              key={unit.label}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="bg-gradient-to-br from-blush-500 to-burgundy-600 text-white rounded-xl p-4 mb-2 shadow-lg">
                <motion.div
                  key={unit.value}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-3xl md:text-4xl font-bold font-body"
                >
                  {unit.value.toString().padStart(2, "0")}
                </motion.div>
              </div>
              {showLabels && (
                <div className="text-sm font-medium text-sage-600 font-body">
                  {unit.label}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <p className="text-sage-600 font-body">
          Até o nosso grande dia - 11 de Novembro de 2025
        </p>
      </Card>
    )
  }

  return (
    <Card variant="romantic" className={cn("p-6", className)}>
      <div className="text-center">
        <h3 className="text-xl font-heading font-semibold text-burgundy-800 mb-4">
          Faltam apenas...
        </h3>

        <div className="grid grid-cols-4 gap-3 mb-4">
          {timeUnits.map((unit, index) => (
            <div key={unit.label} className="text-center">
              <motion.div
                key={unit.value}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="bg-white/80 backdrop-blur-sm rounded-lg p-3 mb-2 border border-blush-200"
              >
                <div className="text-2xl font-bold text-burgundy-800 font-body">
                  {unit.value.toString().padStart(2, "0")}
                </div>
              </motion.div>
              {showLabels && (
                <div className="text-xs font-medium text-sage-600 font-body">
                  {unit.label}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center space-x-1 text-blush-600">
          <Heart className="h-4 w-4 animate-heartbeat" />
          <span className="text-sm font-body">11/11/2025</span>
          <Heart className="h-4 w-4 animate-heartbeat" />
        </div>
      </div>
    </Card>
  )
}

CountdownTimer.displayName = "CountdownTimer"

export { CountdownTimer }