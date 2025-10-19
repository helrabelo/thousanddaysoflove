'use client'

import { StringInputProps, set } from 'sanity'
import { Stack, Text, Card, Spinner } from '@sanity/ui'
import { useEffect, useState } from 'react'
import { client } from '@/sanity/lib/client'
import { calculateDayNumber } from '@/lib/utils/relationship-days'

/**
 * Custom input component for dayRange field in storyPhase
 * Automatically calculates the day range based on the phase's story moments
 */
export function DayRangeInput(props: StringInputProps) {
  const { value, onChange } = props
  const [loading, setLoading] = useState(true)
  const [calculatedRange, setCalculatedRange] = useState<string>('')
  const [momentCount, setMomentCount] = useState(0)

  // Get the current phase document ID
  const phaseId = props.document._id

  useEffect(() => {
    async function calculateRange() {
      try {
        setLoading(true)

        // Query all story moments that reference this phase
        const moments = await client.fetch<Array<{ date: string }>>(
          `*[_type == "storyMoment" && references($phaseId) && defined(date)]{ date } | order(date asc)`,
          { phaseId }
        )

        setMomentCount(moments.length)

        if (moments.length === 0) {
          setCalculatedRange('Sem momentos')
          onChange(set('Sem momentos'))
          return
        }

        // Calculate day numbers for all moments
        const dayNumbers = moments.map((m) => calculateDayNumber(m.date))
        const minDay = Math.min(...dayNumbers)
        const maxDay = Math.max(...dayNumbers)

        // Format the range
        const range = minDay === maxDay ? `Dia ${minDay}` : `Dia ${minDay} - ${maxDay}`

        setCalculatedRange(range)

        // Only update if the value has changed
        if (range !== value) {
          onChange(set(range))
        }
      } catch (error) {
        console.error('Error calculating day range:', error)
        setCalculatedRange('Erro ao calcular')
      } finally {
        setLoading(false)
      }
    }

    calculateRange()
  }, [phaseId, value, onChange])

  if (loading) {
    return (
      <Card padding={3} radius={2} shadow={1}>
        <Stack space={2} align="center">
          <Spinner />
          <Text size={1} muted>
            Calculando intervalo de dias...
          </Text>
        </Stack>
      </Card>
    )
  }

  if (momentCount === 0) {
    return (
      <Card padding={3} radius={2} shadow={1} tone="caution">
        <Stack space={2}>
          <Text size={1} weight="semibold">
            📅 Sem momentos nesta fase
          </Text>
          <Text size={1} muted>
            Adicione momentos especiais que referenciem esta fase para calcular automaticamente o intervalo de dias.
          </Text>
        </Stack>
      </Card>
    )
  }

  return (
    <Card padding={3} radius={2} shadow={1} tone="primary">
      <Stack space={3}>
        <Text size={2} weight="bold">
          {calculatedRange}
        </Text>

        <Text size={1} muted>
          Calculado automaticamente baseado em {momentCount}{' '}
          {momentCount === 1 ? 'momento especial' : 'momentos especiais'}
        </Text>

        <Text size={1} muted style={{ fontStyle: 'italic' }}>
          💡 Este valor é atualizado automaticamente quando você adiciona ou remove momentos desta fase.
        </Text>
      </Stack>
    </Card>
  )
}
