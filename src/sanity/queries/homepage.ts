/**
 * Sanity GROQ Queries for Homepage
 *
 * Fetches the homepage document with all section references resolved.
 * This follows the DTF-inspired modular pattern where pages compose sections.
 */

import { groq } from 'next-sanity'

/**
 * Homepage Query
 * Fetches the homepage singleton with all sections and their referenced data resolved
 */
export const homePageQuery = groq`
  *[_type == "homePage" && _id == "homePage"][0] {
    _id,
    title,
    seo,
    sections[]-> {
      _type,
      _id,

      // Video Hero Section
      _type == "videoHero" => {
        monogram,
        tagline,
        dateBadge,
        primaryCta,
        secondaryCta,
        scrollText,
        backgroundVideo {
          asset-> { url }
        },
        backgroundImage {
          asset-> { url },
          alt
        },
        posterImage {
          asset-> { url },
          alt
        }
      },

      // Event Details Section
      _type == "eventDetails" => {
        sectionTitle,
        weddingSettings-> {
          brideName,
          groomName,
          weddingDate,
          weddingTime,
          receptionTime,
          timezone,
          venueName,
          venueAddress,
          venueCity,
          venueState,
          venueZip,
          venueLocation,
          dressCode,
          dressCodeDescription,
          rsvpDeadline,
          guestLimit
        },
        showCountdown,
        showEventDetails,
        showDressCode
      },

      // Story Preview Section
      _type == "storyPreview" => {
        sectionTitle,
        sectionDescription,
        storyCards[]-> {
          _id,
          title,
          description,
          dayNumber,
          displayOrder,
          image {
            asset-> { url },
            alt
          }
        },
        ctaButton
      },

      // About Us Section
      _type == "aboutUs" => {
        sectionTitle,
        content,
        couplePhoto {
          asset-> { url },
          alt
        }
      },

      // Our Family Section
      _type == "ourFamily" => {
        sectionTitle,
        sectionDescription,
        pets[]-> {
          _id,
          name,
          slug,
          photo {
            asset-> { url },
            alt
          },
          bio,
          role,
          breed,
          adoptionDate,
          displayOrder
        }
      },

      // Quick Preview Section
      _type == "quickPreview" => {
        sectionTitle,
        sectionDescription,
        featureCards[]-> {
          _id,
          title,
          description,
          icon,
          linkUrl,
          linkText,
          displayOrder
        },
        showHighlights,
        highlightsTitle
      },

      // Wedding Location Section
      _type == "weddingLocation" => {
        sectionTitle,
        sectionDescription,
        weddingSettings-> {
          venueName,
          venueAddress,
          venueCity,
          venueState,
          venueZip,
          venueLocation
        },
        mapStyle,
        showDirections
      }
    }
  }
`

/**
 * Global Settings Query
 * Fetches site-wide settings for navigation, footer, SEO, etc.
 */
export const globalSettingsQuery = groq`
  {
    "siteSettings": *[_type == "siteSettings" && _id == "siteSettings"][0],
    "navigation": *[_type == "navigation" && _id == "navigation"][0],
    "footer": *[_type == "footer" && _id == "footer"][0],
    "seoSettings": *[_type == "seoSettings" && _id == "seoSettings"][0]
  }
`

/**
 * Wedding Settings Query
 * Standalone query for wedding settings (used by multiple sections)
 */
export const weddingSettingsQuery = groq`
  *[_type == "weddingSettings" && _id == "weddingSettings"][0]
`
