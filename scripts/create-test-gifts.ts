/**
 * Create low-value test gifts for payment testing
 * These gifts will only appear when MIN_PAYMENT_AMOUNT is set to 1 (local testing)
 */

import { config } from 'dotenv'
import { createClient } from '@sanity/client'

// Load environment variables
config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
})

const testGifts = [
  {
    title: '[TESTE] Café Pilão 500g',
    description: 'Presente de teste para validação de pagamento PIX com valor mínimo. NÃO APARECE EM PRODUÇÃO.',
    fullPrice: 1,
    category: 'kitchen',
    priority: 'low' as const,
  },
  {
    title: '[TESTE] Pano de Prato',
    description: 'Presente de teste para validação de pagamento com cartão de crédito. NÃO APARECE EM PRODUÇÃO.',
    fullPrice: 2,
    category: 'kitchen',
    priority: 'low' as const,
  },
  {
    title: '[TESTE] Tigela Pequena',
    description: 'Presente de teste para validação de pagamento parcial. NÃO APARECE EM PRODUÇÃO.',
    fullPrice: 5,
    category: 'kitchen',
    priority: 'low' as const,
  },
]

async function createTestGift(gift: typeof testGifts[0]) {
  console.log(`\n📦 Creating test gift: ${gift.title}`)
  console.log(`  💰 Price: R$ ${gift.fullPrice.toLocaleString('pt-BR')}`)

  const giftDoc = {
    _type: 'giftItem',
    title: gift.title,
    description: gift.description,
    fullPrice: gift.fullPrice,
    category: gift.category,
    priority: gift.priority,
    allowPartialPayment: true,
    allowCustomAmount: true,
    suggestedContributions: [1, 2, 5, 10], // Low values for testing
    isActive: true,
    notes: 'GIFT DE TESTE - Será filtrado em produção quando MIN_PAYMENT_AMOUNT=50',
  }

  try {
    const result = await client.create(giftDoc)
    console.log(`  ✅ Created test gift: ${result._id}`)
    return result
  } catch (error) {
    console.error(`  ❌ Failed to create test gift:`, error)
    throw error
  }
}

async function main() {
  console.log('🧪 Creating test gifts for payment validation...\n')
  console.log(`📊 Total test gifts to create: ${testGifts.length}\n`)
  console.log('⚠️  These gifts will only appear when NEXT_PUBLIC_MIN_PAYMENT_AMOUNT=1')
  console.log('⚠️  In production (MIN_PAYMENT_AMOUNT=50), they will be filtered out\n')

  let successCount = 0

  for (const gift of testGifts) {
    try {
      await createTestGift(gift)
      successCount++
    } catch (error) {
      console.error(`Failed to create ${gift.title}:`, error)
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log(`\n✅ Successfully created: ${successCount} test gifts`)
  console.log('\n💡 Next steps:')
  console.log('   1. Set NEXT_PUBLIC_MIN_PAYMENT_AMOUNT=1 in .env.local')
  console.log('   2. Restart your dev server: npm run dev')
  console.log('   3. Test PIX and credit card payments')
  console.log('   4. Set NEXT_PUBLIC_MIN_PAYMENT_AMOUNT=50 for production\n')
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
