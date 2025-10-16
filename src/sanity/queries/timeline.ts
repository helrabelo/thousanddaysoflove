/**
 * Sanity GROQ Queries for Timeline Page
 *
 * Fetches story phases and moments for the complete timeline page.
 */

import { groq } from 'next-sanity'

/**
 * Media Fragment
 * Fetches media array with proper asset resolution for both images and videos
 * Includes dimensions for aspect ratio calculation
 */
const mediaFragment = groq`
  media[] {
    mediaType,
    "image": select(
      mediaType == "image" => image {
        asset-> {
          url,
          metadata {
            dimensions {
              width,
              height,
              aspectRatio
            }
          }
        },
        alt,
        hotspot,
        crop
      }
    ),
    "video": select(
      mediaType == "video" => video {
        asset-> {
          url,
          metadata {
            dimensions {
              width,
              height,
              aspectRatio
            }
          }
        }
      }
    ),
    alt,
    caption,
    displayOrder
  } | order(displayOrder asc)
`

/**
 * Legacy Media Fragment (for backwards compatibility)
 * Fetches old single image/video fields if they exist
 * This can be removed once all content is migrated to the new media array
 */
const legacyMediaFragment = groq`
  "legacyImage": image {
    asset-> { url },
    alt
  },
  "legacyVideo": video {
    asset-> { url }
  }
`

/**
 * Timeline Query
 * Fetches all story phases with their associated moments
 * Note: showInTimeline defaults to true if not set (for backwards compatibility)
 */
export const timelineQuery = groq`
  {
    "phases": *[_type == "storyPhase" && isVisible != false] | order(displayOrder asc) {
      _id,
      id,
      title,
      dayRange,
      subtitle,
      displayOrder,
      "moments": *[_type == "storyMoment" && references(^._id) && (showInTimeline == true || !defined(showInTimeline)) && isVisible != false] | order(displayOrder asc) {
        _id,
        title,
        date,
        icon,
        description,
        ${mediaFragment},
        ${legacyMediaFragment},
        dayNumber,
        contentAlign,
        displayOrder
      }
    }
  }
`

/**
 * Story Preview Query (for homepage)
 * Fetches moments that should appear in homepage preview
 * Uses same filtering as timeline to ensure consistency
 * Note: showInTimeline defaults to true if not set (for backwards compatibility)
 */
export const storyPreviewMomentsQuery = groq`
  *[_type == "storyMoment" && (showInTimeline == true || !defined(showInTimeline)) && isVisible != false] | order(displayOrder asc) [0...12] {
    _id,
    title,
    date,
    icon,
    description,
    ${mediaFragment},
    ${legacyMediaFragment},
    phase-> {
      _id,
      title,
      dayRange,
      displayOrder
    },
    dayNumber,
    displayOrder,
    contentAlign,
    showInPreview
  }
`
