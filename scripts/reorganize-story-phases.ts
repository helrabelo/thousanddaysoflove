import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../.env.local') })

const token = process.env.SANITY_API_WRITE_TOKEN

if (!token) {
  throw new Error('SANITY_API_WRITE_TOKEN is required')
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token,
  useCdn: false,
})

async function updatePhases() {
  const transaction = client.transaction()

  transaction.patch('phase-primeiros-dias', (patch) =>
    patch.set({
      title: 'Do Match ao Sim',
      subtitle:
        "Match, encontro, remédio com chá e um pedido improvisado em Guaramiranga. Nosso começo do jeito que a gente realmente é.",
      dayRange: 'Dia -49 - 5',
      displayOrder: 1,
      id: { _type: 'slug', current: 'do-match-ao-sim' },
    })
  )

  transaction.patch('phase-construindo-juntos', (patch) =>
    patch.set({
      title: 'Família Virando Lar',
      subtitle:
        'De dois pra quatro cachorros, réveillon em casa, surpresa de aniversário e mudar pro apê que Hel sonhou a vida inteira.',
      dayRange: 'Dia 5 - 385',
      displayOrder: 2,
      id: { _type: 'slug', current: 'familia-virando-lar' },
    })
  )

  transaction.createIfNotExists({
    _id: 'phase-vida-que-a-gente-planeja',
    _type: 'storyPhase',
    title: 'Vida que a gente tá planejando',
    subtitle:
      'Mangue Azul, Natal e Réveillon na nossa casa e decisões gigantes tipo congelar óvulos. Nosso futuro tomando forma de verdade.',
    dayRange: 'Dia 609 - 781',
    displayOrder: 3,
    isVisible: true,
    id: { _type: 'slug', current: 'vida-que-a-gente-planeja' },
  })

  transaction.patch('phase-rumo-ao-altar', (patch) =>
    patch.set({
      title: 'Do Pedido ao Altar',
      subtitle:
        'Surpresa em Icaraí, contagem pros 1000 dias e o dia do sim na Constable. Zero conto de fadas, só a gente do nosso jeito.',
      dayRange: 'Dia 918 - 1000',
      displayOrder: 4,
      id: { _type: 'slug', current: 'do-pedido-ao-altar' },
    })
  )

  await transaction.commit({ visibility: 'async' })
}

async function reassignMoments() {
  const assignments: Record<string, string[]> = {
    'phase-primeiros-dias': [
      'story-moment-fde6201e-ef5c-4db6-8252-fb2381112c88',
      'story-moment-be85bc04-f7e4-472c-970d-f9ad0db67858',
      'story-moment-a0a914be-5d8b-479b-8a8f-de4192a75ec9',
      'story-moment-cabf29bc-fb6a-42e7-ad9a-4e2ee8239fc0',
    ],
    'phase-construindo-juntos': [
      'story-moment-9533f4ad-afcc-4353-aaf6-9468795dee92',
      'story-moment-6fc9f7ba-82c4-4f69-85b6-468bf4754c5a',
      'story-moment-5d9b65bf-0302-4c4d-a36d-9a8f484f6175',
      'story-moment-23df88cb-d0f6-4d0f-97b4-234129d92bfe',
      'story-moment-c0e4b19c-4927-41a1-901b-d319521016ac',
    ],
    'phase-vida-que-a-gente-planeja': [
      'story-moment-b6514d59-c9b2-45f0-b18e-0a94aee91348',
      'story-moment-048fe3fb-eb31-4f3d-b651-775d546015da',
      'story-moment-2a2f8a52-2dfe-4c11-9d9a-c56226b578ff',
      'story-moment-7ccc1d06-be06-420f-b896-9ea531b3b851',
    ],
    'phase-rumo-ao-altar': [
      'story-moment-b01555c3-d295-4724-97b1-b398e2e3bf25',
      'story-moment-1c15334f-ea56-4449-9042-6e76666e28c3',
    ],
  }

  for (const [phaseId, momentIds] of Object.entries(assignments)) {
    for (const momentId of momentIds) {
      await client
        .patch(momentId)
        .set({ phase: { _type: 'reference', _ref: phaseId } })
        .unset(['dayNumber'])
        .commit({ visibility: 'async' })
    }
  }
}

async function main() {
  console.log('📚 Updating story phases...')
  await updatePhases()
  console.log('✅ Phases updated')

  console.log('🔄 Reassigning story moments...')
  await reassignMoments()
  console.log('✅ Moments reassigned')

  console.log('🎉 Story structure reorganized')
}

main().catch((error) => {
  console.error('❌ Error reorganizing story structure:', error)
  process.exit(1)
})
