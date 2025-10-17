/**
 * Sanity GROQ Queries for Gifts Page
 *
 * Fetches the gifts page sections (header, footer, project renders).
 * Used to manage all copy and imagery for the /presentes page.
 */

import { groq } from 'next-sanity'

/**
 * Gifts Page Sections Query
 * Fetches the active gifts page sections document with all images resolved
 */
export const giftsPageSectionsQuery = groq`
  *[_type == "giftsPageSections" && isActive == true][0] {
    _id,

    // Header Section
    headerTitle,
    headerContent,

    // Project Render Gallery
    showProjectGallery,
    projectGalleryTitle,
    projectGalleryDescription,
    projectRenders[] {
      _key,
      title,
      alt,
      caption,
      renderType,
      displayOrder,
      asset-> {
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      },
      hotspot,
      crop
    },

    // Footer CTA Section
    footerTitle,
    footerContent,
    footerBullets[] {
      text
    },

    // Meta
    lastUpdated,
    isActive
  }
`

/**
 * Project Renders Only Query
 * Fetches just the project render images for gallery display
 */
export const projectRendersQuery = groq`
  *[_type == "giftsPageSections" && isActive == true && showProjectGallery == true][0] {
    projectGalleryTitle,
    projectGalleryDescription,
    projectRenders[] {
      _key,
      title,
      alt,
      caption,
      renderType,
      displayOrder,
      asset-> {
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      },
      hotspot,
      crop
    } | order(displayOrder asc)
  }
`
