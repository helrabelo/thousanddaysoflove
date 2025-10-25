/**
 * Populate Gifts Page Sections in Sanity
 *
 * This script creates the initial giftsPageSections document in Sanity CMS
 * with the content matching the voice and tone guide.
 *
 * Run with: npm run sanity:populate-gifts
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@sanity/client'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

// Create Sanity write client directly
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
  perspective: 'previewDrafts',
})

const GIFTS_SECTIONS_ID = 'gifts-page-sections-main'

const giftsPageSectionsData = {
  _id: GIFTS_SECTIONS_ID,
  _type: 'giftsPageSections',

  // Header Section
  headerTitle: 'Presentes? A Gente Só Quer Você Lá',
  headerContent: `Deus nos deu muita coisa. Saúde. Família. Trabalho.  Sinceramente? A gente não precisa de nada. Só de você lá dia 20 de novembro.

Mas a gente sabe. Tem gente que faz questão. Que quer materializar o carinho de algum jeito.

Então... a gente tá finalmente (finalmente!) reformando esse apê. Tava meio inacabado desde que a gente se mudou. Agora vai virar nosso lar de verdade. Pra sempre. Família de 6 (contando Linda 👑, Cacao 🍫, Olivia 🌸 e Oliver ⚡).

Se quiser contribuir pro nosso cantinho - uma TV, um sofá, lua de mel, decoração - a gente abraça e agradece o gesto. De coração.`,

  // Project Render Gallery
  showProjectGallery: true,
  projectGalleryTitle: 'O Projeto do Nosso Lar',
  projectGalleryDescription:
    'Esse apartamento que tava meio largado? Agora vira nosso lar de verdade. Veja como vai ficar depois da reforma.',
  projectRenders: [], // Empty array - user will upload images in Sanity Studio

  // Footer CTA Section
  footerTitle: 'Obrigado Por Se Importar (Mas Principalmente Por Estar Lá!)',
  footerContent: `Tem item grande? A gente divide em pedacinhos (aquela TV de R$10.000 vira cotas de R$100, R$250, R$500 - ou o valor que você quiser, mínimo R$50). Tem também contribuição pra lua de mel, decoração, aquelas coisinhas que transformam casa em lar.

Cada gesto ajuda a fazer desse apartamento (que tava meio largado) nosso cantinho de verdade. Os 4 cachorros barulhentos também agradecem.

Mas pra gente, o presente maior é você lá. Casa HY. 20 de novembro. O resto é só carinho materializado.`,

  footerBullets: [
    { _key: 'bullet-1', text: 'PIX brasileiro, rápido e seguro' },
    { _key: 'bullet-2', text: 'Confirmação na hora do carinho' },
    {
      _key: 'bullet-3',
      text: '"O que temos entre nós é muito maior" - Hel & Ylana',
    },
  ],

  // Meta
  lastUpdated: new Date().toISOString(),
  isActive: true,
}

async function populateGiftsSections() {
  try {
    console.log('🚀 Starting Sanity population for Gifts Page Sections...\n')

    // Check if document already exists
    const existing = await writeClient.fetch(
      `*[_type == "giftsPageSections" && _id == $id][0]`,
      { id: GIFTS_SECTIONS_ID }
    )

    if (existing) {
      console.log('⚠️  Document already exists. Updating...\n')

      // Update existing document
      const result = await writeClient
        .patch(GIFTS_SECTIONS_ID)
        .set({
          headerTitle: giftsPageSectionsData.headerTitle,
          headerContent: giftsPageSectionsData.headerContent,
          showProjectGallery: giftsPageSectionsData.showProjectGallery,
          projectGalleryTitle: giftsPageSectionsData.projectGalleryTitle,
          projectGalleryDescription: giftsPageSectionsData.projectGalleryDescription,
          footerTitle: giftsPageSectionsData.footerTitle,
          footerContent: giftsPageSectionsData.footerContent,
          footerBullets: giftsPageSectionsData.footerBullets,
          lastUpdated: giftsPageSectionsData.lastUpdated,
          isActive: giftsPageSectionsData.isActive,
        })
        .commit()

      console.log('✅ Updated existing document:', result._id)
    } else {
      console.log('📝 Creating new document...\n')

      // Create new document
      const result = await writeClient.create(giftsPageSectionsData)

      console.log('✅ Created new document:', result._id)
    }

    console.log('\n📊 Document Summary:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`Header Title: "${giftsPageSectionsData.headerTitle}"`)
    console.log(`Footer Title: "${giftsPageSectionsData.footerTitle}"`)
    console.log(`Project Gallery: ${giftsPageSectionsData.showProjectGallery ? 'Enabled' : 'Disabled'}`)
    console.log(`Footer Bullets: ${giftsPageSectionsData.footerBullets.length}`)
    console.log(`Status: ${giftsPageSectionsData.isActive ? 'Active ✅' : 'Inactive ❌'}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    console.log('\n🎉 Success! Gifts Page Sections populated in Sanity.')
    console.log('\n📝 Next Steps:')
    console.log('   1. Visit http://localhost:3000/studio')
    console.log('   2. Find "Página de Presentes - Seções" in the sidebar')
    console.log('   3. Upload project render images in the "Renders do Projeto" section')
    console.log('   4. The frontend will now fetch content from Sanity!\n')
  } catch (error) {
    console.error('❌ Error populating Gifts Page Sections:', error)
    throw error
  }
}

// Run the script
populateGiftsSections()
  .then(() => {
    console.log('✨ Script completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Script failed:', error)
    process.exit(1)
  })
