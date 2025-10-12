/**
 * Global Schemas Index
 *
 * Singleton global settings (site, navigation, SEO, footer).
 */

import footer from './footer'
import navigation from './navigation'
import seoSettings from './seoSettings'
import siteSettings from './siteSettings'

export const globalSchemas = [footer, navigation, seoSettings, siteSettings]

export default globalSchemas
