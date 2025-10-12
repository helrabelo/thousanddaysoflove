/**
 * Sanity Studio Desk Structure
 *
 * Organizes the Studio sidebar into logical sections:
 * - Pages (Homepage, Timeline, Other Pages)
 * - Content (Sections, Documents)
 * - Settings (Globals)
 */

import type { StructureResolver } from 'sanity/structure'
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
} from 'lucide-react'

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title('Conteúdo')
    .items([
      // PAGES SECTION
      S.listItem()
        .title('Páginas')
        .icon(FileText)
        .child(
          S.list()
            .title('Páginas')
            .items([
              // Homepage (singleton)
              S.listItem()
                .title('Homepage')
                .icon(Home)
                .child(
                  S.document()
                    .schemaType('homePage')
                    .documentId('homePage')
                    .title('Homepage')
                ),

              // Timeline Page (singleton)
              S.listItem()
                .title('Nossa História (Timeline)')
                .icon(Clock)
                .child(
                  S.document()
                    .schemaType('timelinePage')
                    .documentId('timelinePage')
                    .title('Nossa História Completa')
                ),

              S.divider(),

              // Other Pages (list)
              S.listItem()
                .title('Outras Páginas')
                .icon(FileText)
                .child(S.documentTypeList('page').title('Páginas')),
            ])
        ),

      S.divider(),

      // CONTENT SECTION
      S.listItem()
        .title('Conteúdo')
        .icon(Database)
        .child(
          S.list()
            .title('Conteúdo')
            .items([
              // Story Cards
              S.listItem()
                .title('Story Cards')
                .icon(Heart)
                .child(
                  S.documentTypeList('storyCard')
                    .title('Story Cards')
                    .filter('_type == "storyCard"')
                    .defaultOrdering([{ field: 'displayOrder', direction: 'asc' }])
                ),

              // Feature Cards
              S.listItem()
                .title('Feature Cards')
                .icon(LayoutGrid)
                .child(
                  S.documentTypeList('featureCard')
                    .title('Feature Cards')
                    .filter('_type == "featureCard"')
                    .defaultOrdering([{ field: 'displayOrder', direction: 'asc' }])
                ),

              // Pets
              S.listItem()
                .title('Pets')
                .icon(Dog)
                .child(
                  S.documentTypeList('pet')
                    .title('Pets')
                    .filter('_type == "pet"')
                    .defaultOrdering([{ field: 'displayOrder', direction: 'asc' }])
                ),

              S.divider(),

              // Wedding Settings (singleton)
              S.listItem()
                .title('Configurações do Casamento')
                .icon(Church)
                .child(
                  S.document()
                    .schemaType('weddingSettings')
                    .documentId('weddingSettings')
                    .title('Configurações do Casamento')
                ),
            ])
        ),

      S.divider(),

      // SECTIONS (for reference, not commonly edited)
      S.listItem()
        .title('Seções')
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
                .title('Story Preview')
                .child(S.documentTypeList('storyPreview').title('Story Preview Sections')),

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
            ])
        ),

      S.divider(),

      // SETTINGS SECTION
      S.listItem()
        .title('Configurações')
        .icon(Settings)
        .child(
          S.list()
            .title('Configurações Globais')
            .items([
              // Site Settings (singleton)
              S.listItem()
                .title('Configurações do Site')
                .icon(Cog)
                .child(
                  S.document()
                    .schemaType('siteSettings')
                    .documentId('siteSettings')
                    .title('Configurações do Site')
                ),

              // Navigation (singleton)
              S.listItem()
                .title('Navegação')
                .icon(Menu)
                .child(
                  S.document()
                    .schemaType('navigation')
                    .documentId('navigation')
                    .title('Navegação')
                ),

              // Footer (singleton)
              S.listItem()
                .title('Rodapé')
                .icon(PanelBottom)
                .child(S.document().schemaType('footer').documentId('footer').title('Rodapé')),

              // SEO Settings (singleton)
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
