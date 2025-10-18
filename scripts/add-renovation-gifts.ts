/**
 * Add renovation gifts with local images
 */

import { config } from 'dotenv'
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'

// Load environment variables
config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
})

interface RenovationGift {
  title: string
  price: number
  imagePath: string
  description: string
  category: string
}

const renovations: RenovationGift[] = [
  {
    title: 'Reforma do Quarto Master',
    price: 25000,
    imagePath: '/Users/helrabelo/Downloads/quarto-master.png',
    description:
      'Para transformarmos nosso quarto no refúgio dos sonhos! Um espaço aconchegante e especial onde começaremos e terminaremos cada dia juntos.',
    category: 'bedroom',
  },
  {
    title: 'Reforma da Cozinha',
    price: 50000,
    imagePath: '/Users/helrabelo/Downloads/cozinha.png',
    description:
      'A cozinha dos nossos sonhos onde prepararemos refeições deliciosas juntos! O coração da nossa casa, onde criaremos memórias e receitas especiais.',
    category: 'kitchen',
  },
  {
    title: 'Reforma da Sala',
    price: 50000,
    imagePath: '/Users/helrabelo/Downloads/sala-1.png',
    description:
      'Para criarmos uma sala linda e acolhedora onde receberemos família e amigos! O espaço perfeito para nossos momentos de convivência e celebração.',
    category: 'living-room',
  },
]

/**
 * Upload local image to Sanity
 */
async function uploadLocalImage(imagePath: string, title: string) {
  try {
    console.log(`  📥 Reading image from ${imagePath}...`)
    const buffer = readFileSync(imagePath)

    console.log(`  ⬆️  Uploading to Sanity...`)
    const asset = await client.assets.upload('image', buffer, {
      contentType: 'image/png',
      filename: `${title.toLowerCase().replace(/\s+/g, '-')}.png`,
    })

    console.log(`  ✅ Image uploaded: ${asset._id}`)
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    }
  } catch (error) {
    console.error(`  ❌ Failed to upload image:`, error)
    throw error
  }
}

/**
 * Create renovation gift in Sanity
 */
async function createRenovationGift(renovation: RenovationGift) {
  console.log(`\n🏠 Creating renovation: ${renovation.title}`)

  console.log(`  📁 Category: ${renovation.category}`)
  console.log(`  ⭐ Priority: high (R$${renovation.price.toLocaleString('pt-BR')})`)

  const imageAsset = await uploadLocalImage(
    renovation.imagePath,
    renovation.title
  )

  const giftDoc = {
    _type: 'giftItem',
    title: renovation.title,
    description: renovation.description,
    fullPrice: renovation.price,
    category: renovation.category,
    priority: 'high', // All renovations are high priority!
    allowPartialPayment: true,
    allowCustomAmount: true,
    suggestedContributions: [500, 1000, 2500, 5000, 10000], // Higher amounts for renovations
    isActive: true,
    image: imageAsset,
    notes: 'Reforma completa do ambiente',
  }

  try {
    const result = await client.create(giftDoc)
    console.log(`  ✅ Created gift: ${result._id}`)
    return result
  } catch (error) {
    console.error(`  ❌ Failed to create gift:`, error)
    throw error
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🏠 Starting renovation gifts population...\n')
  console.log(`📊 Total renovations to create: ${renovations.length}\n`)

  let successCount = 0
  let failCount = 0

  for (const renovation of renovations) {
    try {
      await createRenovationGift(renovation)
      successCount++
    } catch (error) {
      failCount++
      console.error(`Failed to process ${renovation.title}`)
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log(`\n✅ Successfully created: ${successCount} renovation gifts`)
  if (failCount > 0) {
    console.log(`❌ Failed: ${failCount} gifts`)
  }
  console.log('\n🎉 Done! Total gifts now: 14')
  console.log(`   https://thousandaysof.love/studio/structure/giftItem\n`)
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
