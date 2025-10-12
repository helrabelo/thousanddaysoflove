/**
 * Sanity queries for SEO settings
 */

export const seoSettingsQuery = `
  *[_type == "seoSettings"][0] {
    defaultTitle,
    titleTemplate,
    defaultDescription,
    keywords,
    openGraph {
      siteName,
      locale,
      type
    },
    twitter {
      handle,
      cardType
    },
    robotsIndex
  }
`
