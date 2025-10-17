/**
 * Sanity Studio Desk Structure
 *
 * Organizes the Studio sidebar with clear hierarchy:
 * - Páginas (Homepage, Timeline, Other Pages)
 * - Nossa História (Story phases, moments, and preview)
 * - Conteúdo Base (Reusable collections like pets and feature cards)
 * - Galeria (Curated photo collections)
 * - Seções (Reusable sections/components)
 * - Configurações (Global and wedding settings)
 */

import type {StructureResolver} from 'sanity/structure'
import {
  Home,
  FileText,
  Clock,
  Settings,
  Layout,
  Database,
  Dog,
  Heart,
  LayoutGrid,
  Church,
  Menu,
  PanelBottom,
  Search,
  Cog,
  Layers,
  ImageIcon,
  Gift,
  Sparkles,
  PlayCircle,
} from 'lucide-react'

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title('Conteúdo')
    .items([
      // 📄 PÁGINAS PRINCIPAIS
      S.listItem()
        .title('📄 Páginas')
        .icon(FileText)
        .child(
          S.list()
            .title('Páginas')
            .items([
              S.listItem()
                .title('Homepage')
                .icon(Home)
                .child(
                  S.document()
                    .schemaType('homePage')
                    .documentId('homePage')
                    .title('Homepage')
                ),

              S.listItem()
                .title('Página da História')
                .icon(Clock)
                .child(
                  S.document()
                    .schemaType('timelinePage')
                    .documentId('timelinePage')
                    .title('Página: História Completa')
                ),

              S.divider(),

              S.listItem()
                .title('Outras Páginas')
                .icon(FileText)
                .child(S.documentTypeList('page').title('Páginas')),
            ])
        ),

      S.divider(),

      // ❤️ NOSSA HISTÓRIA
      S.listItem()
        .title('❤️ Nossa História')
        .icon(Heart)
        .child(
          S.list()
            .title('Nossa História')
            .items([
              S.listItem()
                .title('Capítulos')
                .icon(Layers)
                .child(
                  S.documentTypeList('storyPhase')
                    .title('Capítulos da História')
                    .filter('_type == "storyPhase"')
                    .defaultOrdering([{field: 'displayOrder', direction: 'asc'}])
                ),

              S.listItem()
                .title('Momentos Especiais')
                .icon(Sparkles)
                .child(
                  S.documentTypeList('storyMoment')
                    .title('Momentos da História')
                    .filter('_type == "storyMoment"')
                    .defaultOrdering([{field: 'displayOrder', direction: 'asc'}])
                ),

              S.divider(),

              S.listItem()
                .title('Prévia na Homepage')
                .icon(PlayCircle)
                .child(
                  S.documentTypeList('storyPreview')
                    .title('Seção: História (Homepage)')
                    .filter('_type == "storyPreview"')
                ),
            ])
        ),

      S.divider(),

      // 📚 CONTEÚDO BASE
      S.listItem()
        .title('📚 Conteúdo Base')
        .icon(Database)
        .child(
          S.list()
            .title('Conteúdo Base')
            .items([
              S.listItem()
                .title('Feature Cards')
                .icon(LayoutGrid)
                .child(
                  S.documentTypeList('featureCard')
                    .title('Feature Cards')
                    .filter('_type == "featureCard"')
                    .defaultOrdering([{field: 'displayOrder', direction: 'asc'}])
                ),

              S.listItem()
                .title('Pets')
                .icon(Dog)
                .child(
                  S.documentTypeList('pet')
                    .title('Pets')
                    .filter('_type == "pet"')
                    .defaultOrdering([{field: 'displayOrder', direction: 'asc'}])
                ),

              S.listItem()
                .title('Lista de Presentes')
                .icon(Gift)
                .child(
                  S.documentTypeList('giftItem')
                    .title('Lista de Presentes')
                    .filter('_type == "giftItem"')
                    .defaultOrdering([
                      {field: 'priority', direction: 'asc'},
                      {field: 'fullPrice', direction: 'desc'},
                    ])
                ),
            ])
        ),

      S.divider(),

      // 📷 GALERIA
      S.listItem()
        .title('📷 Galeria')
        .icon(ImageIcon)
        .child(
          S.list()
            .title('Galeria de Fotos')
            .items([
              S.listItem()
                .title('Todas as Imagens')
                .icon(ImageIcon)
                .child(
                  S.documentTypeList('galleryImage')
                    .title('Galeria Completa')
                    .filter('_type == "galleryImage"')
                    .defaultOrdering([
                      {field: 'displayOrder', direction: 'asc'},
                      {field: 'dateTaken', direction: 'desc'},
                    ])
                ),

              S.divider(),

              S.listItem()
                .title('⭐ Imagens Destacadas')
                .child(
                  S.documentTypeList('galleryImage')
                    .title('Imagens Destacadas')
                    .filter('_type == "galleryImage" && isFeatured == true')
                    .defaultOrdering([{field: 'displayOrder', direction: 'asc'}])
                ),

              S.divider(),

              S.listItem()
                .title('📂 Por Categoria')
                .child(
                  S.list()
                    .title('Categorias')
                    .items([
                      S.listItem()
                        .title('💍 Noivado')
                        .child(
                          S.documentTypeList('galleryImage')
                            .title('Noivado')
                            .filter('_type == "galleryImage" && category == "engagement"')
                            .defaultOrdering([{field: 'dateTaken', direction: 'desc'}])
                        ),
                      S.listItem()
                        .title('✈️ Viagens')
                        .child(
                          S.documentTypeList('galleryImage')
                            .title('Viagens')
                            .filter('_type == "galleryImage" && category == "travel"')
                            .defaultOrdering([{field: 'dateTaken', direction: 'desc'}])
                        ),
                      S.listItem()
                        .title('💕 Encontros')
                        .child(
                          S.documentTypeList('galleryImage')
                            .title('Encontros')
                            .filter('_type == "galleryImage" && category == "dates"')
                            .defaultOrdering([{field: 'dateTaken', direction: 'desc'}])
                        ),
                      S.listItem()
                        .title('👨‍👩‍👧‍👦 Família')
                        .child(
                          S.documentTypeList('galleryImage')
                            .title('Família')
                            .filter('_type == "galleryImage" && category == "family"')
                            .defaultOrdering([{field: 'dateTaken', direction: 'desc'}])
                        ),
                      S.listItem()
                        .title('👯 Amigos')
                        .child(
                          S.documentTypeList('galleryImage')
                            .title('Amigos')
                            .filter('_type == "galleryImage" && category == "friends"')
                            .defaultOrdering([{field: 'dateTaken', direction: 'desc'}])
                        ),
                      S.listItem()
                        .title('✨ Momentos Especiais')
                        .child(
                          S.documentTypeList('galleryImage')
                            .title('Momentos Especiais')
                            .filter('_type == "galleryImage" && category == "special_moments"')
                            .defaultOrdering([{field: 'dateTaken', direction: 'desc'}])
                        ),
                      S.listItem()
                        .title('💎 Pedido')
                        .child(
                          S.documentTypeList('galleryImage')
                            .title('Pedido')
                            .filter('_type == "galleryImage" && category == "proposal"')
                            .defaultOrdering([{field: 'dateTaken', direction: 'desc'}])
                        ),
                      S.listItem()
                        .title('👰 Preparativos')
                        .child(
                          S.documentTypeList('galleryImage')
                            .title('Preparativos')
                            .filter('_type == "galleryImage" && category == "wedding_prep"')
                            .defaultOrdering([{field: 'dateTaken', direction: 'desc'}])
                        ),
                      S.listItem()
                        .title('🎬 Bastidores')
                        .child(
                          S.documentTypeList('galleryImage')
                            .title('Bastidores')
                            .filter('_type == "galleryImage" && category == "behind_scenes"')
                            .defaultOrdering([{field: 'dateTaken', direction: 'desc'}])
                        ),
                      S.listItem()
                        .title('📸 Profissionais')
                        .child(
                          S.documentTypeList('galleryImage')
                            .title('Profissionais')
                            .filter('_type == "galleryImage" && category == "professional"')
                            .defaultOrdering([{field: 'dateTaken', direction: 'desc'}])
                        ),
                    ])
                ),
            ])
        ),

      S.divider(),

      // 🎨 SEÇÕES E COMPONENTES
      S.listItem()
        .title('🎨 Seções')
        .icon(Layout)
        .child(
          S.list()
            .title('Seções Disponíveis')
            .items([
              S.listItem()
                .title('Video Hero')
                .child(S.documentTypeList('videoHero').title('Video Hero Sections')),

              S.listItem()
                .title('Event Details')
                .child(S.documentTypeList('eventDetails').title('Event Details Sections')),

              S.listItem()
                .title('About Us')
                .child(S.documentTypeList('aboutUs').title('About Us Sections')),

              S.listItem()
                .title('Our Family')
                .child(S.documentTypeList('ourFamily').title('Our Family Sections')),

              S.listItem()
                .title('Quick Preview')
                .child(S.documentTypeList('quickPreview').title('Quick Preview Sections')),

              S.listItem()
                .title('Wedding Location')
                .child(S.documentTypeList('weddingLocation').title('Wedding Location Sections')),

              S.listItem()
                .title('História - Prévia')
                .child(S.documentTypeList('storyPreview').title('Story Preview Sections')),
            ])
        ),

      S.divider(),

      // ⚙️ CONFIGURAÇÕES
      S.listItem()
        .title('⚙️ Configurações')
        .icon(Settings)
        .child(
          S.list()
            .title('Configurações Globais')
            .items([
              S.listItem()
                .title('Configurações do Casamento')
                .icon(Church)
                .child(
                  S.document()
                    .schemaType('weddingSettings')
                    .documentId('weddingSettings')
                    .title('Configurações do Casamento')
                ),

              S.listItem()
                .title('Configurações do Site')
                .icon(Cog)
                .child(
                  S.document()
                    .schemaType('siteSettings')
                    .documentId('siteSettings')
                    .title('Configurações do Site')
                ),

              S.listItem()
                .title('Navegação')
                .icon(Menu)
                .child(
                  S.document()
                    .schemaType('navigation')
                    .documentId('navigation')
                    .title('Navegação')
                ),

              S.listItem()
                .title('Rodapé')
                .icon(PanelBottom)
                .child(S.document().schemaType('footer').documentId('footer').title('Rodapé')),

              S.listItem()
                .title('Configurações de SEO')
                .icon(Search)
                .child(
                  S.document()
                    .schemaType('seoSettings')
                    .documentId('seoSettings')
                    .title('Configurações de SEO')
                ),
            ])
        ),
    ])
