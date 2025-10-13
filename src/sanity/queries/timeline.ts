/**
 * Sanity GROQ Queries for Timeline Page
 *
 * Fetches story phases and moments for the complete timeline page.
 */

import { groq } from 'next-sanity'

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
        image {
          asset-> { url },
          alt
        },
        video {
          asset-> { url }
        },
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
    image {
      asset-> { url },
      alt
    },
    video {
      asset-> { url }
    },
    phase-> {
      _id,
      title,
      dayRange
    },
    dayNumber,
    displayOrder,
    contentAlign,
    showInPreview
  }
`
