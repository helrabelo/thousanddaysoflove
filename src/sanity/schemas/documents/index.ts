/**
 * Document Schemas
 *
 * Reusable content types that can be referenced by sections and pages.
 * These are standalone documents that can be created and managed independently.
 */

import pet from './pet'
import storyMoment from './storyMoment'
import storyPhase from './storyPhase'
import featureCard from './featureCard'
import weddingSettings from './weddingSettings'
import galleryImage from './galleryImage'
import guestMedia from './guestMedia'
import { giftItem } from './giftItem'
import weddingTimelineEvent from './weddingTimelineEvent'

export const documentSchemas = [
  pet,
  storyMoment,
  storyPhase,
  featureCard,
  weddingSettings,
  galleryImage,
  guestMedia, // Guest-uploaded photos and videos
  giftItem, // Gift registry items
  weddingTimelineEvent, // Wedding day timeline events
]

export default documentSchemas
