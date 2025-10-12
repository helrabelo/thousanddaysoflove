/**
 * Setup Story Preview Section for Homepage
 *
 * Creates a storyPreview section document and adds it to the homepage
 */

import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN || '',
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function main() {
  console.log('🎬 Setting up Story Preview section for homepage...\n')

  // Check environment variables
  const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !token) {
    console.error('❌ Missing environment variables!')
    process.exit(1)
  }

  // Step 1: Fetch story moments that should show in preview
  console.log('📖 Step 1: Fetching story moments...')
  const moments = await client.fetch(`
    *[_type == "storyMoment" && showInPreview == true && isVisible == true] | order(displayOrder asc) [0...5] {
      _id
    }
  `)
  console.log(`   ✅ Found ${moments.length} moments for preview\n`)

  if (moments.length === 0) {
    console.warn('⚠️  No moments found with showInPreview=true')
    console.warn('   Go to Sanity Studio and toggle "Mostrar na Homepage" for your moments\n')
  }

  // Step 2: Create storyPreview section
  console.log('🎨 Step 2: Creating storyPreview section...')
  const storyPreviewSection = {
    _type: 'storyPreview',
    _id: 'story-preview-homepage',
    sectionId: 'nossa-historia',
    sectionTitle: 'Nossa História',
    sectionDescription:
      'Caseiros e introvertidos de verdade. A gente é daqueles que realmente prefere ficar em casa. Unidos por boa comida (especialmente no Mangue Azul), vinhos que acompanham conversas longas, viagens quando dá, e 4 cachorros que fazem barulho demais mas a gente ama.',
    backgroundImage: null,
    backgroundVideo: null,
    storyMoments: moments.map((m: any) => ({
      _type: 'reference',
      _ref: m._id,
      _key: m._id,
    })),
    ctaButton: {
      label: 'Ver História Completa',
      href: '/historia',
    },
    isVisible: true,
  }

  try {
    await client.createOrReplace(storyPreviewSection)
    console.log('   ✅ Created storyPreview section\n')
  } catch (error) {
    console.error('   ❌ Failed to create storyPreview:', error)
    process.exit(1)
  }

  // Step 3: Add to homepage sections
  console.log('🏠 Step 3: Adding section to homepage...')
  try {
    // Fetch current homepage
    const homepage = await client.fetch(`*[_type == "homePage" && _id == "homePage"][0]`)

    if (!homepage) {
      console.error('   ❌ Homepage document not found!')
      console.log('   Create a homepage document in Sanity Studio first')
      process.exit(1)
    }

    // Check if storyPreview is already in sections
    const currentSections = homepage.sections || []
    const hasStoryPreview = currentSections.some(
      (s: any) =>
        s._ref === 'story-preview-homepage' || (s._type === 'storyPreview' && s._id === 'story-preview-homepage')
    )

    if (hasStoryPreview) {
      console.log('   ✅ Section already in homepage')
    } else {
      // Add storyPreview section reference
      const updatedSections = [
        ...currentSections,
        {
          _type: 'reference',
          _ref: 'story-preview-homepage',
          _key: 'story-preview-homepage',
        },
      ]

      await client.patch('homePage').set({ sections: updatedSections }).commit()
      console.log('   ✅ Added section to homepage')
    }
  } catch (error) {
    console.error('   ❌ Failed to update homepage:', error)
  }

  console.log('\n✨ Setup complete!')
  console.log('\n📝 Next steps:')
  console.log('   1. Go to http://localhost:3000/studio')
  console.log('   2. Navigate to: ❤️ Nossa História → 📄 Onde Aparece → 🏠 Prévia na Homepage')
  console.log('   3. Upload a background image/video (optional)')
  console.log('   4. Upload images to your story moments')
  console.log('   5. Visit http://localhost:3000 to see the section!')
}

main().catch(console.error)
