/**
 * Sanity Studio Configuration
 *
 * This file configures the Sanity Studio interface for managing
 * wedding website content. Inspired by Din Tai Fung's modular approach.
 */
import {BulkDelete} from 'sanity-plugin-bulk-delete'
import { defineConfig } from 'sanity'
import type { SanityDocument } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './src/sanity/schemas'
import { deskStructure } from './src/sanity/desk'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!

const getDocumentSlug = (doc: SanityDocument): string | undefined => {
  const slugField = (doc as Record<string, unknown>).slug

  if (
    slugField &&
    typeof slugField === 'object' &&
    'current' in slugField &&
    typeof (slugField as { current?: unknown }).current === 'string'
  ) {
    return (slugField as { current: string }).current
  }

  return undefined
}

export default defineConfig({
  name: 'thousand-days-of-love',
  title: 'Thousand Days of Love',

  projectId,
  dataset,

  basePath: '/studio',

  plugins: [
    structureTool({
      structure: deskStructure,
    }),
    visionTool(),
    BulkDelete({
      schemaTypes: schemaTypes, // Pass your schema types here
      // roles: ['administrator', 'editor'], // Optionally restrict to specific roles
    }),
  ],

  schema: {
    types: schemaTypes,
  },

  // Portuguese language support
  document: {
    productionUrl: async (prev, { document }: { document: SanityDocument }) => {

      // Generate preview URLs for pages
      if (document._type === 'page') {
        const slug = getDocumentSlug(document)
        return `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${slug || ''}`
      }

      if (document._type === 'homePage') {
        return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      }

      return prev
    },
  },
})
