/**
 * Setup Script: Create Default Sanity Homepage Sections
 *
 * This script creates all the required section documents in Sanity
 * so they can be added to the homepage sections array.
 *
 * Run with: npx tsx scripts/setup-sanity-homepage.ts
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Need write access
  apiVersion: '2024-01-01',
})

async function setupHomepage() {
  console.log('🚀 Setting up Sanity homepage sections...\n')

  try {
    // 1. Create Video Hero Section
    console.log('📹 Creating Video Hero section...')
    const videoHero = await client.create({
      _type: 'videoHero',
      sectionId: 'hero',
      monogram: 'H ♥ Y',
      tagline: '1000 dias. Sim, a gente fez a conta.',
      dateBadge: '20.11.2025',
      primaryCta: {
        label: 'Confirmar Presença',
        href: '/rsvp',
      },
      secondaryCta: {
        label: 'Nossa História',
        href: '/historia',
      },
      scrollText: 'Explorar',
      isVisible: true,
    })
    console.log('✅ Video Hero created:', videoHero._id)

    // 2. Create Event Details Section
    console.log('📅 Creating Event Details section...')
    const eventDetails = await client.create({
      _type: 'eventDetails',
      sectionTitle: 'Detalhes do Evento',
      showCountdown: true,
      showEventDetails: true,
      showDressCode: true,
      isVisible: true,
    })
    console.log('✅ Event Details created:', eventDetails._id)

    // 3. Create Story Preview Section
    console.log('📖 Creating Story Preview section...')
    const storyPreview = await client.create({
      _type: 'storyPreview',
      sectionTitle: 'Nossa História',
      sectionDescription: 'A jornada dos nossos mil dias',
      ctaButton: {
        label: 'Ver História Completa',
        href: '/historia',
      },
      isVisible: true,
    })
    console.log('✅ Story Preview created:', storyPreview._id)

    // 4. Create About Us Section
    console.log('💑 Creating About Us section...')
    const aboutUs = await client.create({
      _type: 'aboutUs',
      sectionTitle: 'Sobre Nós',
      content: [{
        _type: 'block',
        children: [{
          _type: 'span',
          text: 'Somos Hel e Ylana, e estamos celebrando nossos 1000 dias juntos com o início de nossa jornada eterna.',
        }],
      }],
      isVisible: true,
    })
    console.log('✅ About Us created:', aboutUs._id)

    // 5. Create Our Family Section
    console.log('🐾 Creating Our Family section...')
    const ourFamily = await client.create({
      _type: 'ourFamily',
      sectionTitle: 'Nossa Família',
      sectionDescription: 'Conheça nossos pets',
      isVisible: true,
    })
    console.log('✅ Our Family created:', ourFamily._id)

    // 6. Create Quick Preview Section
    console.log('🎯 Creating Quick Preview section...')
    const quickPreview = await client.create({
      _type: 'quickPreview',
      sectionTitle: 'Tudo Que Você Precisa',
      sectionDescription: 'Acesse rapidamente as informações importantes',
      showHighlights: true,
      highlightsTitle: 'Destaques',
      isVisible: true,
    })
    console.log('✅ Quick Preview created:', quickPreview._id)

    // 7. Create Wedding Location Section
    console.log('📍 Creating Wedding Location section...')
    const weddingLocation = await client.create({
      _type: 'weddingLocation',
      sectionTitle: 'Local do Evento',
      sectionDescription: 'Onde vamos celebrar nosso grande dia',
      mapStyle: 'elegant',
      showDirections: true,
      isVisible: true,
    })
    console.log('✅ Wedding Location created:', weddingLocation._id)

    // 8. Create or Update Homepage with all sections
    console.log('\n🏠 Setting up Homepage document...')

    // Check if homepage exists
    const existingHomepage = await client.fetch('*[_type == "homePage" && _id == "homePage"][0]')

    const homepageData = {
      _type: 'homePage',
      title: 'Homepage',
      sections: [
        { _type: 'reference', _ref: videoHero._id },
        { _type: 'reference', _ref: eventDetails._id },
        { _type: 'reference', _ref: storyPreview._id },
        { _type: 'reference', _ref: aboutUs._id },
        { _type: 'reference', _ref: ourFamily._id },
        { _type: 'reference', _ref: quickPreview._id },
        { _type: 'reference', _ref: weddingLocation._id },
      ],
    }

    if (existingHomepage) {
      await client
        .patch('homePage')
        .set(homepageData)
        .commit()
      console.log('✅ Homepage updated with sections')
    } else {
      await client.create({
        _id: 'homePage',
        ...homepageData,
      })
      console.log('✅ Homepage created with sections')
    }

    console.log('\n✨ Setup complete! All sections are ready.\n')
    console.log('📝 Next steps:')
    console.log('   1. Open Sanity Studio: http://localhost:3000/studio')
    console.log('   2. Navigate to "Páginas" → "Homepage"')
    console.log('   3. Add images/videos to the Video Hero section')
    console.log('   4. Publish the homepage and all sections')
    console.log('   5. View your site at: http://localhost:3001\n')

  } catch (error) {
    console.error('❌ Error setting up homepage:', error)
    throw error
  }
}

// Run the setup
setupHomepage()
