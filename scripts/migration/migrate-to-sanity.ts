/**
 * Supabase → Sanity Migration Script
 *
 * Migrates all content from Supabase to Sanity CMS.
 * Uses the Sanity write token to create documents.
 *
 * Run with: npx tsx scripts/migration/migrate-to-sanity.ts
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createClient as createSanityClient } from 'next-sanity'

// Supabase connection
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createSupabaseClient(supabaseUrl, supabaseKey)

// Sanity write client
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'
const writeToken = process.env.SANITY_API_WRITE_TOKEN!

const writeClient = createSanityClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: writeToken,
  perspective: 'previewDrafts',
})

// Migration stats
const stats = {
  success: 0,
  failed: 0,
  skipped: 0,
  errors: [] as string[],
}

/**
 * Migrate Wedding Settings (singleton)
 */
async function migrateWeddingSettings() {
  console.log('\n📋 Migrating Wedding Settings...')

  try {
    const { data, error } = await supabase
      .from('wedding_settings')
      .select('*')
      .eq('is_published', true)
      .limit(1)
      .maybeSingle()

    if (error) throw error
    if (!data) {
      console.log('  ⏭️  No wedding settings found')
      stats.skipped++
      return
    }

    await writeClient.createOrReplace({
      _id: 'weddingSettings',
      _type: 'weddingSettings',
      brideName: data.bride_name,
      groomName: data.groom_name,
      weddingDate: data.wedding_date,
      weddingTime: data.wedding_time,
      receptionTime: data.reception_time,
      timezone: data.wedding_timezone,
      venueName: data.venue_name,
      venueAddress: data.venue_address,
      venueCity: data.venue_city,
      venueState: data.venue_state,
      venueZip: data.venue_zip,
      venueLocation: {
        lat: data.venue_lat,
        lng: data.venue_lng,
        placeId: data.google_maps_place_id,
      },
      dressCode: data.dress_code,
      dressCodeDescription: data.dress_code_description,
      rsvpDeadline: data.rsvp_deadline,
      guestLimit: data.guest_limit,
    })

    console.log('  ✅ Wedding settings migrated')
    stats.success++
  } catch (err: any) {
    console.error('  ❌ Error:', err.message)
    stats.failed++
    stats.errors.push(`Wedding Settings: ${err.message}`)
  }
}

/**
 * Migrate Pets
 */
async function migratePets() {
  console.log('\n🐕 Migrating Pets...')

  try {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('is_visible', true)
      .order('display_order')

    if (error) throw error
    if (!data || data.length === 0) {
      console.log('  ⏭️  No pets found')
      stats.skipped++
      return
    }

    for (const pet of data) {
      // Generate slug from name
      const slugCurrent = pet.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')

      await writeClient.createOrReplace({
        _id: `pet-${pet.id}`,
        _type: 'pet',
        name: pet.name,
        slug: { _type: 'slug', current: slugCurrent },
        bio: pet.description || pet.name, // Map description → bio
        role: pet.personality, // Map personality → role
        breed: pet.breed,
        adoptionDate: pet.date_joined, // Map date_joined → adoptionDate
        displayOrder: pet.display_order,
        isVisible: pet.is_visible,
        // Note: photo will need manual upload or separate image migration
        // For now, we'll just note the image_url in a comment
        photo: pet.image_url
          ? {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: `image-${pet.id}`, // Placeholder - needs actual upload to Sanity
              },
              // TODO: Upload image from pet.image_url to Sanity
            }
          : undefined,
      })

      console.log(`  ✅ Migrated pet: ${pet.name}`)
      stats.success++
    }
  } catch (err: any) {
    console.error('  ❌ Error:', err.message)
    stats.failed++
    stats.errors.push(`Pets: ${err.message}`)
  }
}

/**
 * Migrate Story Cards
 */
async function migrateStoryCards() {
  console.log('\n📖 Migrating Story Cards...')

  try {
    const { data, error } = await supabase
      .from('story_cards')
      .select('*')
      .eq('is_visible', true)
      .order('display_order')

    if (error) throw error
    if (!data || data.length === 0) {
      console.log('  ⏭️  No story cards found')
      stats.skipped++
      return
    }

    for (const card of data) {
      await writeClient.createOrReplace({
        _id: `storyCard-${card.id}`,
        _type: 'storyCard',
        title: card.title,
        description: card.description,
        dayNumber: card.day_number,
        displayOrder: card.display_order,
        isVisible: card.is_visible,
      })

      console.log(`  ✅ Migrated story card: ${card.title}`)
      stats.success++
    }
  } catch (err: any) {
    console.error('  ❌ Error:', err.message)
    stats.failed++
    stats.errors.push(`Story Cards: ${err.message}`)
  }
}

/**
 * Migrate Feature Cards
 */
async function migrateFeatureCards() {
  console.log('\n🎯 Migrating Feature Cards...')

  try {
    const { data, error } = await supabase
      .from('homepage_features')
      .select('*')
      .eq('is_visible', true)
      .order('display_order')

    if (error) throw error
    if (!data || data.length === 0) {
      console.log('  ⏭️  No feature cards found')
      stats.skipped++
      return
    }

    for (const feature of data) {
      await writeClient.createOrReplace({
        _id: `featureCard-${feature.id}`,
        _type: 'featureCard',
        title: feature.title,
        description: feature.description,
        icon: feature.icon_name,
        linkUrl: feature.link_url,
        linkText: feature.link_text,
        displayOrder: feature.display_order,
        isVisible: feature.is_visible,
      })

      console.log(`  ✅ Migrated feature card: ${feature.title}`)
      stats.success++
    }
  } catch (err: any) {
    console.error('  ❌ Error:', err.message)
    stats.failed++
    stats.errors.push(`Feature Cards: ${err.message}`)
  }
}

/**
 * Migrate Homepage with Sections
 */
async function migrateHomePage() {
  console.log('\n🏠 Migrating Homepage...')

  try {
    // Create homepage with sections
    const sections = []

    // 1. Video Hero Section
    const { data: heroData } = await supabase
      .from('hero_text')
      .select('*')
      .eq('is_published', true)
      .limit(1)
      .maybeSingle()

    if (heroData) {
      const heroSection = await writeClient.create({
        _type: 'videoHero',
        monogram: heroData.monogram,
        tagline: heroData.tagline,
        dateBadge: heroData.date_badge,
        primaryCta: {
          label: heroData.primary_cta_text,
          href: heroData.primary_cta_link,
        },
        secondaryCta: {
          label: heroData.secondary_cta_text,
          href: heroData.secondary_cta_link,
        },
        scrollText: heroData.scroll_text,
      })
      sections.push({ _type: 'reference', _ref: heroSection._id, _key: 'hero' })
      console.log('  ✅ Created Video Hero section')
      stats.success++
    }

    // 2. Event Details Section
    const eventSection = await writeClient.create({
      _type: 'eventDetails',
      sectionTitle: 'Faltam Apenas',
      weddingSettings: { _type: 'reference', _ref: 'weddingSettings' },
      showCountdown: true,
      showEventDetails: true,
      showDressCode: true,
    })
    sections.push({ _type: 'reference', _ref: eventSection._id, _key: 'events' })
    console.log('  ✅ Created Event Details section')
    stats.success++

    // 3. Story Preview Section
    const { data: storySettings } = await supabase
      .from('story_preview_settings')
      .select('*')
      .eq('is_published', true)
      .limit(1)
      .maybeSingle()

    if (storySettings) {
      const { data: storyCards } = await supabase
        .from('story_cards')
        .select('id')
        .eq('is_visible', true)
        .order('display_order')

      const storySection = await writeClient.create({
        _type: 'storyPreview',
        sectionTitle: storySettings.section_title,
        sectionDescription: storySettings.section_description,
        storyCards: storyCards?.map((card) => ({
          _type: 'reference',
          _ref: `storyCard-${card.id}`,
          _key: card.id,
        })),
        ctaButton: {
          label: storySettings.cta_text,
          href: storySettings.cta_link,
        },
      })
      sections.push({ _type: 'reference', _ref: storySection._id, _key: 'story' })
      console.log('  ✅ Created Story Preview section')
      stats.success++
    }

    // 4. About Us Section
    const { data: aboutData } = await supabase
      .from('about_us_content')
      .select('*')
      .eq('is_published', true)
      .limit(1)
      .maybeSingle()

    if (aboutData) {
      const aboutSection = await writeClient.create({
        _type: 'aboutUs',
        sectionTitle: aboutData.section_title,
        content: [
          {
            _type: 'block',
            _key: 'content',
            children: [
              {
                _type: 'span',
                text: aboutData.content,
              },
            ],
          },
        ],
      })
      sections.push({ _type: 'reference', _ref: aboutSection._id, _key: 'about' })
      console.log('  ✅ Created About Us section')
      stats.success++
    }

    // 5. Our Family Section
    const { data: pets } = await supabase
      .from('pets')
      .select('id')
      .eq('is_visible', true)
      .order('display_order')

    if (pets && pets.length > 0) {
      const familySection = await writeClient.create({
        _type: 'ourFamily',
        sectionTitle: 'Nossa Família',
        sectionDescription: 'Conheça nossos 4 cachorros que fazem barulho demais mas a gente ama.',
        pets: pets.map((pet) => ({
          _type: 'reference',
          _ref: `pet-${pet.id}`,
          _key: pet.id,
        })),
      })
      sections.push({ _type: 'reference', _ref: familySection._id, _key: 'family' })
      console.log('  ✅ Created Our Family section')
      stats.success++
    }

    // 6. Quick Preview Section
    const { data: featuresSettings } = await supabase
      .from('homepage_section_settings')
      .select('*')
      .eq('is_published', true)
      .limit(1)
      .maybeSingle()

    if (featuresSettings) {
      const { data: features } = await supabase
        .from('homepage_features')
        .select('id')
        .eq('is_visible', true)
        .order('display_order')

      const quickSection = await writeClient.create({
        _type: 'quickPreview',
        sectionTitle: featuresSettings.section_title,
        sectionDescription: featuresSettings.section_description,
        featureCards: features?.map((f) => ({
          _type: 'reference',
          _ref: `featureCard-${f.id}`,
          _key: f.id,
        })),
        showHighlights: featuresSettings.show_highlights,
        highlightsTitle: featuresSettings.highlights_title,
      })
      sections.push({ _type: 'reference', _ref: quickSection._id, _key: 'quick' })
      console.log('  ✅ Created Quick Preview section')
      stats.success++
    }

    // 7. Wedding Location Section
    const locationSection = await writeClient.create({
      _type: 'weddingLocation',
      sectionTitle: 'Como Chegar',
      sectionDescription: 'Encontre-nos no dia do casamento',
      weddingSettings: { _type: 'reference', _ref: 'weddingSettings' },
      mapStyle: 'standard',
      showDirections: true,
    })
    sections.push({ _type: 'reference', _ref: locationSection._id, _key: 'location' })
    console.log('  ✅ Created Wedding Location section')
    stats.success++

    // Create Homepage document
    await writeClient.createOrReplace({
      _id: 'homePage',
      _type: 'homePage',
      title: 'Homepage',
      sections: sections,
      seo: {
        title: 'Thousand Days of Love - Casamento Hel & Ylana',
        description:
          '1000 dias juntos. Celebre conosco no dia 20 de Novembro de 2025.',
      },
    })

    console.log('  ✅ Homepage created with all sections')
    stats.success++
  } catch (err: any) {
    console.error('  ❌ Error:', err.message)
    stats.failed++
    stats.errors.push(`Homepage: ${err.message}`)
  }
}

/**
 * Migrate Global Settings
 */
async function migrateGlobalSettings() {
  console.log('\n⚙️  Migrating Global Settings...')

  try {
    // Site Settings
    await writeClient.createOrReplace({
      _id: 'siteSettings',
      _type: 'siteSettings',
      title: 'Thousand Days of Love',
      description:
        'Casamento de Hel e Ylana - 1000 dias de amor, uma vida inteira pela frente.',
      url: 'https://thousanddaysof.love',
    })
    console.log('  ✅ Site settings migrated')
    stats.success++

    // Navigation
    await writeClient.createOrReplace({
      _id: 'navigation',
      _type: 'navigation',
      title: 'Menu Principal',
      mainNav: [
        { label: 'História', href: '/historia', openInNewTab: false },
        { label: 'Detalhes', href: '/detalhes', openInNewTab: false },
        { label: 'Presentes', href: '/presentes', openInNewTab: false },
        { label: 'Galeria', href: '/galeria', openInNewTab: false },
        { label: 'Local', href: '#location', openInNewTab: false },
      ],
      ctaButton: {
        show: true,
        label: 'Confirmar Presença',
        href: '/rsvp',
      },
    })
    console.log('  ✅ Navigation migrated')
    stats.success++

    // Footer
    await writeClient.createOrReplace({
      _id: 'footer',
      _type: 'footer',
      title: 'Rodapé',
      copyrightText: '© 2025 Hel & Ylana. Todos os direitos reservados.',
      footerLinks: [
        { label: 'Nossa História', href: '/historia' },
        { label: 'Presentes', href: '/presentes' },
        { label: 'RSVP', href: '/rsvp' },
      ],
      showPoweredBy: true,
    })
    console.log('  ✅ Footer migrated')
    stats.success++

    // SEO Settings
    await writeClient.createOrReplace({
      _id: 'seoSettings',
      _type: 'seoSettings',
      title: 'SEO Padrão',
      defaultTitle: 'Thousand Days of Love - Casamento Hel & Ylana',
      titleTemplate: '%s | Thousand Days of Love',
      defaultDescription:
        '1000 dias juntos. Celebre conosco o casamento de Hel e Ylana no dia 20 de Novembro de 2025.',
      keywords: [
        'casamento',
        'Hel e Ylana',
        'thousand days of love',
        'casamento Rio de Janeiro',
      ],
      openGraph: {
        siteName: 'Thousand Days of Love',
        locale: 'pt_BR',
        type: 'website',
      },
      twitter: {
        cardType: 'summary_large_image',
      },
      robotsIndex: true,
    })
    console.log('  ✅ SEO settings migrated')
    stats.success++
  } catch (err: any) {
    console.error('  ❌ Error:', err.message)
    stats.failed++
    stats.errors.push(`Global Settings: ${err.message}`)
  }
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('🚀 Starting Supabase → Sanity Migration\n')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  // Run migrations in order
  await migrateWeddingSettings()
  await migratePets()
  await migrateStoryCards()
  await migrateFeatureCards()
  await migrateGlobalSettings()
  await migrateHomePage()

  // Print summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('\n📊 Migration Summary:')
  console.log(`  ✅ Successful: ${stats.success}`)
  console.log(`  ❌ Failed: ${stats.failed}`)
  console.log(`  ⏭️  Skipped: ${stats.skipped}`)

  if (stats.errors.length > 0) {
    console.log('\n❌ Errors:')
    stats.errors.forEach((err) => console.log(`  - ${err}`))
  }

  console.log('\n✨ Migration complete!')
  console.log('\n📝 Next steps:')
  console.log('  1. Check Sanity Studio to verify content')
  console.log('  2. Upload images manually or run image migration')
  console.log('  3. Update frontend components to fetch from Sanity')
  console.log('  4. Test all pages')
}

// Run migration
migrate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('\n💥 Fatal error:', err)
    process.exit(1)
  })
