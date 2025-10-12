/**
 * Sanity Schema Registry
 *
 * Centralized schema imports for the wedding website CMS.
 * Organized into:
 * - Globals: Singleton settings (site, navigation, SEO, footer)
 * - Documents: Reusable content (pets, story cards, feature cards, wedding settings)
 * - Sections: Page sections (hero, event details, story, location, etc.)
 * - Pages: Top-level pages (homePage, page, timelinePage)
 */

import { globalSchemas } from './globals'
import { documentSchemas } from './documents'
import { sectionSchemas } from './sections'
import { pageSchemas } from './pages'

// All schemas for Sanity Studio (18 total)
export const schemaTypes = [
  ...globalSchemas, // 4 singletons
  ...documentSchemas, // 4 reusable docs
  ...sectionSchemas, // 7 sections
  ...pageSchemas, // 3 pages
]

export default schemaTypes
