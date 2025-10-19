'use client'

import { NumberInputProps, set, unset } from 'sanity'
import { Stack, Text, Card } from '@sanity/ui'
import { calculateDayNumber, formatDayNumber } from '@/lib/utils/relationship-days'
import { useEffect } from 'react'

/**
 * Custom input component for dayNumber field
 * Automatically calculates the day number based on the date field
 * Displays it as read-only with helpful context
 */
export function DayNumberInput(props: NumberInputProps) {
  const { value, onChange } = props

  // Get the parent document to access the date field
  const parent = props.document as { date?: string }
  const date = parent?.date

  // Calculate day number whenever date changes
  useEffect(() => {
    if (date) {
      const calculatedDay = calculateDayNumber(date)

      // Only update if the value has changed to avoid infinite loops
      if (calculatedDay !== value) {
        onChange(set(calculatedDay))
      }
    } else {
      // Clear the day number if no date is set
      if (value !== undefined) {
        onChange(unset())
      }
    }
  }, [date, value, onChange])

  // If no date is set, show a helpful message
  if (!date) {
    return (
      <Card padding={3} radius={2} shadow={1} tone="caution">
        <Stack space={2}>
          <Text size={1} weight="semibold">
            📅 Dia não calculado
          </Text>
          <Text size={1} muted>
            Adicione uma data primeiro para calcular automaticamente o dia do relacionamento.
          </Text>
        </Stack>
      </Card>
    )
  }

  const dayNumber = calculateDayNumber(date)
  const isBeforeRelationship = dayNumber < 1
  const isWeddingDay = dayNumber === 1000

  return (
    <Card
      padding={3}
      radius={2}
      shadow={1}
      tone={isWeddingDay ? 'positive' : isBeforeRelationship ? 'caution' : 'primary'}
    >
      <Stack space={3}>
        <Text size={2} weight="bold">
          {formatDayNumber(dayNumber)}
        </Text>

        <Text size={1} muted>
          Calculado automaticamente a partir de {new Date(date).toLocaleDateString('pt-BR')}
        </Text>

        {isBeforeRelationship && (
          <Text size={1} style={{ color: 'var(--card-badge-caution-dot-color)' }}>
            ⚠️ Este evento aconteceu {Math.abs(dayNumber - 1)} {Math.abs(dayNumber - 1) === 1 ? 'dia' : 'dias'} antes do namoro oficial (25/02/2023)
          </Text>
        )}

        {isWeddingDay && (
          <Text size={1} style={{ color: 'var(--card-badge-positive-dot-color)' }}>
            💒 Dia do Casamento - Mil Dias Viram Para Sempre!
          </Text>
        )}

        {dayNumber > 0 && dayNumber < 1000 && (
          <Text size={1} muted>
            {1000 - dayNumber} {1000 - dayNumber === 1 ? 'dia' : 'dias'} até o casamento
          </Text>
        )}
      </Stack>
    </Card>
  )
}
