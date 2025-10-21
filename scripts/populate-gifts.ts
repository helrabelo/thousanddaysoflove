/**
 * Populate Sanity with wedding gifts
 * Auto-generates descriptions and detects categories
 */

import { config } from 'dotenv'
import { createClient } from '@sanity/client'
import axios from 'axios'

// Load environment variables
config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
})

interface GiftData {
  title: string
  price: number
  url: string
  imageUrl?: string
}

const gifts: GiftData[] = [
  {
    title: 'Cafeteira Elétrica Tramontina by Breville Express Pro com Moedor 2L',
    price: 7376,
    url: 'https://www.tramontina.com.br/cafeteira-eletrica-tramontina-by-breville-express-pro-em-aco-inox-com-moedor-2-l-220-v/69066012.html',
    imageUrl: 'https://assets.tramontina.com.br/upload/tramon/imagens/FAR/69066011PDM001G.jpg',
  },
  {
    title: 'Ar Condicionado Split Cassete 4 Vias Carrier 48000 BTU/h',
    price: 11998,
    url: 'https://www.friopecas.com.br/split-carrier-k7-4v-48k-220-1-f-in-1034667/p',
    imageUrl: 'https://friopecas.vtexassets.com/arquivos/ids/247070-800-auto',
  },
  {
    title: 'Cervejeira Blue Light Venax 100L Preta',
    price: 5997,
    url: 'https://www.mercadolivre.com.br/cervejeira-blue-light-venax-adega-100l-porta-invertida-cor-preta-fosca/p/MLB31979579',
    imageUrl: 'https://http2.mlstatic.com/D_NQ_NP_917229-MLA95352403865_102025-O.jpg',
  },
  {
    title: 'Geladeira Brastemp French Door 554L Inox',
    price: 6199,
    url: 'https://www.casasbahia.com.br/geladeira-brastemp-french-door-bro85ak-frost-free-tecnologia-inverter-turbo-freezer-design-premium-554-l-inox/p/55054275',
  },
  {
    title: 'Smart TV TCL 75" 4K QD Mini LED 144Hz',
    price: 6969,
    url: 'https://www.casasbahia.com.br/smart-tv-75-tcl-75c7k-4k-qd-mini-led-144hz-com-sistema-operacional-google-tv/p/55069662',
  },
  {
    title: 'Ar Condicionado Split LG Dual Inverter 18000 BTUs',
    price: 3458,
    url: 'https://www.casasbahia.com.br/ar-condicionado-split-hw-lg-dual-inverter-voice-ai-18000-btus-r-32-so-frio-220v/p/1570698064',
  },
  {
    title: 'Porta Utensílios Le Creuset Signature 1L',
    price: 289,
    url: 'https://www.lecreuset.com.br/porta-utensilios-signature-1l/71502.html',
  },
  {
    title: 'Travessa Retangular Le Creuset Heritage Flame 19cm',
    price: 479,
    url: 'https://www.lecreuset.com.br/travessa-retangular-heritage-flame-19cm/71102190900001.html',
  },
  {
    title: 'Porta Sal Le Creuset',
    price: 349,
    url: 'https://www.lecreuset.com.br/porta-sal-lecreuset/910022.html',
  },
  {
    title: 'Grelha Quadrada Le Creuset Signature Flame 26cm',
    price: 1266,
    url: 'https://www.lecreuset.com.br/grelha-quadrada-signature-flame-26cm/20183260900422.html',
  },
  {
    title: 'Set 5 Palitos para Aperitivo Le Creuset',
    price: 339,
    url: 'https://www.lecreuset.com.br/set-5-palitos-para-aperitivo/69242007849013.html',
  },
]

/**
 * Generate description based on title
 */
function generateDescription(title: string): string {
  const descriptions: Record<string, string> = {
    cafeteira:
      'Uma cafeteira profissional com moedor integrado para começarmos nossos dias juntos com o melhor café! Perfeita para quem ama um café especial.',
    'ar condicionado':
      'Para manter nossa casa sempre fresquinha e aconchegante, mesmo nos dias mais quentes. Conforto é essencial!',
    cervejeira:
      'Para sempre termos aquela cerveja gelada esperando no fim do dia. Perfeita para receber amigos e família!',
    geladeira:
      'Uma geladeira espaçosa e moderna para nossa cozinha dos sonhos. Com tecnologia inverter para economia de energia.',
    tv: 'Para assistirmos nossos filmes e séries favoritos juntos. Tela grande com qualidade de imagem incrível!',
    'smart tv':
      'Para assistirmos nossos filmes e séries favoritos juntos. Tela grande com qualidade de imagem incrível!',
    'porta utensílios':
      'Peça Le Creuset para manter nossa cozinha organizada com muito estilo. Qualidade e beleza que duram para sempre.',
    travessa:
      'Travessa Le Creuset linda para servir nossas refeições especiais. Perfeita para receber com elegância.',
    'porta sal':
      'Um toque de sofisticação Le Creuset para nossa mesa. Detalhes que fazem toda a diferença!',
    grelha:
      'Grelha Le Creuset de ferro fundido para preparar carnes e legumes perfeitos. Qualidade profissional para nossa cozinha.',
    palitos:
      'Set elegante Le Creuset para servir aperitivos com classe. Para nossos momentos de receber amigos!',
  }

  const titleLower = title.toLowerCase()

  for (const [keyword, description] of Object.entries(descriptions)) {
    if (titleLower.includes(keyword)) {
      return description
    }
  }

  return 'Um presente especial para nossa nova vida juntos. Escolhido com muito carinho!'
}

/**
 * Detect category from title
 */
function detectCategory(title: string): string {
  const titleLower = title.toLowerCase()

  if (
    titleLower.includes('geladeira') ||
    titleLower.includes('cervejeira') ||
    titleLower.includes('cafeteira') ||
    titleLower.includes('porta utensílios') ||
    titleLower.includes('travessa') ||
    titleLower.includes('porta sal') ||
    titleLower.includes('grelha') ||
    titleLower.includes('palitos')
  ) {
    return 'kitchen'
  }

  if (titleLower.includes('tv') || titleLower.includes('smart tv')) {
    return 'electronics'
  }

  if (titleLower.includes('ar condicionado')) {
    return 'electronics'
  }

  return 'other'
}

/**
 * Determine priority based on price
 */
function determinePriority(price: number): 'high' | 'medium' | 'low' {
  if (price >= 5000) return 'high'
  if (price >= 1000) return 'medium'
  return 'low'
}

/**
 * Upload image to Sanity
 */
async function uploadImage(imageUrl: string, title: string) {
  try {
    console.log(`  📥 Downloading image from ${imageUrl}...`)
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 30000,
    })

    const buffer = Buffer.from(response.data)
    const contentType = response.headers['content-type'] || 'image/jpeg'

    console.log(`  ⬆️  Uploading to Sanity...`)
    const asset = await client.assets.upload('image', buffer, {
      contentType,
      filename: `${title.toLowerCase().replace(/\s+/g, '-')}.jpg`,
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
    return null
  }
}

/**
 * Create gift in Sanity
 */
async function createGift(gift: GiftData) {
  console.log(`\n📦 Creating gift: ${gift.title}`)

  const category = detectCategory(gift.title)
  const description = generateDescription(gift.title)
  const priority = determinePriority(gift.price)

  console.log(`  📁 Category: ${category}`)
  console.log(`  ⭐ Priority: ${priority}`)
  console.log(`  💰 Price: R$ ${gift.price.toLocaleString('pt-BR')}`)

  let imageAsset = null
  if (gift.imageUrl) {
    imageAsset = await uploadImage(gift.imageUrl, gift.title)
  }

  const giftDoc = {
    _type: 'giftItem',
    title: gift.title,
    description,
    fullPrice: gift.price,
    category,
    priority,
    allowPartialPayment: true,
    allowCustomAmount: true,
    suggestedContributions: [100, 250, 500, 1000],
    isActive: true,
    storeUrl: gift.url,
    ...(imageAsset && { image: imageAsset }),
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
  console.log('🎁 Starting gift population...\n')
  console.log(`📊 Total gifts to create: ${gifts.length}\n`)

  let successCount = 0
  let failCount = 0

  for (const gift of gifts) {
    try {
      await createGift(gift)
      successCount++
    } catch (error) {
      failCount++
      console.error(`Failed to process ${gift.title}:`, error)
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log(`\n✅ Successfully created: ${successCount} gifts`)
  if (failCount > 0) {
    console.log(`❌ Failed: ${failCount} gifts`)
  }
  console.log('\n🎉 Done! Check your gifts at:')
  console.log(`   https://thousandaysof.love/studio/structure/giftItem\n`)
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
