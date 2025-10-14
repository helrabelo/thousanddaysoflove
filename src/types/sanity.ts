/**
 * Sanity CMS Type Definitions
 *
 * Centralized TypeScript types for all Sanity schemas.
 * These types ensure type safety when fetching and using Sanity content.
 */

// =====================================================
// Base Sanity Document Types
// =====================================================

export interface SanityDocument {
  _id: string
  _type: string
  _createdAt: string
  _updatedAt: string
  _rev: string
}

export interface SanityReference {
  _ref: string
  _type: 'reference'
}

// =====================================================
// Image & Asset Types
// =====================================================

export interface SanityImageHotspot {
  x: number
  y: number
  height: number
  width: number
}

export interface SanityImageCrop {
  top: number
  bottom: number
  left: number
  right: number
}

export interface SanityImageAsset {
  _id: string
  url: string
  metadata?: {
    lqip?: string
    palette?: {
      dominant?: {
        background?: string
        foreground?: string
      }
    }
  }
}

export interface SanityImage {
  asset: SanityImageAsset | SanityReference
  hotspot?: SanityImageHotspot
  crop?: SanityImageCrop
  alt?: string
}

export interface SanityFile {
  asset: {
    _id: string
    url: string
  } | SanityReference
}

// =====================================================
// Global Settings
// =====================================================

export interface SanitySiteSettings extends SanityDocument {
  _type: 'siteSettings'
  title: string
  description?: string
  url: string
  ogImage?: SanityImage
  favicon?: SanityImage
  designTokens?: {
    primaryColor?: string
    accentColor?: string
    backgroundColor?: string
  }
  gtmId?: string
}

export interface SanityNavigation extends SanityDocument {
  _type: 'navigation'
  title: string
  mainNav?: Array<{
    _key: string
    label: string
    href: string
    openInNewTab?: boolean
  }>
  ctaButton?: {
    show: boolean
    label?: string
    href?: string
  }
}

export interface SanityFooter extends SanityDocument {
  _type: 'footer'
  title: string
  copyrightText: string
  footerLinks?: Array<{
    _key: string
    label: string
    href: string
  }>
  socialLinks?: {
    instagram?: string
    whatsapp?: string
  }
  showPoweredBy?: boolean
}

export interface SanitySEOSettings extends SanityDocument {
  _type: 'seoSettings'
  title: string
  defaultTitle: string
  titleTemplate: string
  defaultDescription: string
  keywords?: string[]
  openGraph?: {
    siteName?: string
    locale?: string
    type?: 'website' | 'article'
  }
  twitter?: {
    handle?: string
    cardType?: 'summary' | 'summary_large_image'
  }
  robotsIndex?: boolean
}

// =====================================================
// Wedding-Specific Documents
// =====================================================

export interface SanityWeddingSettings extends SanityDocument {
  _type: 'weddingSettings'
  brideName: string
  groomName: string
  weddingDate: string
  weddingTime: string
  receptionTime?: string
  timezone: string
  venueName: string
  venueAddress: string
  venueCity: string
  venueState?: string
  venueZip?: string
  venueLocation?: {
    lat: number
    lng: number
    placeId?: string
  }
  dressCode?: string
  dressCodeDescription?: string
  rsvpDeadline?: string
  guestLimit?: number
}

export interface SanityGiftItem extends SanityDocument {
  _type: 'giftItem'
  title: string
  description: string
  fullPrice: number
  image: SanityImage
  category: 'kitchen' | 'living-room' | 'bedroom' | 'bathroom' | 'electronics' | 'decor' | 'honeymoon' | 'other'
  allowPartialPayment: boolean
  suggestedContributions?: number[]
  allowCustomAmount: boolean
  priority: 'high' | 'medium' | 'low'
  isActive: boolean
  storeUrl?: string
  notes?: string
}

// =====================================================
// Gallery & Media
// =====================================================

export type MediaCategory =
  | 'engagement'
  | 'travel'
  | 'dates'
  | 'family'
  | 'friends'
  | 'special_moments'
  | 'proposal'
  | 'wedding_prep'
  | 'behind_scenes'
  | 'professional'

export interface SanityGalleryMediaItem {
  _key: string
  mediaType: 'image' | 'video'
  image?: SanityImage
  video?: SanityFile
  alt?: string
  caption?: string
  displayOrder: number
}

export interface SanityGalleryImage extends SanityDocument {
  _type: 'galleryImage'
  title: string
  description?: string
  media: SanityGalleryMediaItem[]
  legacyImage?: SanityImage
  category: MediaCategory
  tags?: string[]
  dateTaken?: string
  location?: string
  isFeatured: boolean
  isPublic: boolean
  displayOrder?: number
  aspectRatio?: number
  photographer?: string
  cameraInfo?: {
    make?: string
    model?: string
    lens?: string
    settings?: string
  }
}

// =====================================================
// Story & Timeline
// =====================================================

export interface SanityStoryPhase extends SanityDocument {
  _type: 'storyPhase'
  title: string
  dayRange: string
  subtitle?: string
  displayOrder: number
}

export interface SanityStoryMomentMedia {
  _key: string
  mediaType: 'image' | 'video'
  image?: SanityImage
  video?: SanityFile
  alt?: string
  caption?: string
  displayOrder: number
}

export interface SanityStoryMoment extends SanityDocument {
  _type: 'storyMoment'
  title: string
  date: string
  icon?: string
  description: string
  media: SanityStoryMomentMedia[]
  legacyImage?: SanityImage
  legacyVideo?: SanityFile
  phase?: SanityStoryPhase | SanityReference
  dayNumber?: number
  contentAlign: 'left' | 'right'
  displayOrder: number
  showInPreview?: boolean
  showInTimeline?: boolean
}

// =====================================================
// Page Sections
// =====================================================

export interface SanityVideoHero extends SanityDocument {
  _type: 'videoHero'
  title: string
  subtitle?: string
  videoUrl?: string
  videoFile?: SanityFile
  posterImage?: SanityImage
  ctaButton?: {
    show: boolean
    label?: string
    href?: string
  }
}

export interface SanityEventDetails extends SanityDocument {
  _type: 'eventDetails'
  weddingSettings: SanityWeddingSettings | SanityReference
  showCountdown: boolean
  customMessage?: string
}

export interface SanityStoryPreview extends SanityDocument {
  _type: 'storyPreview'
  title: string
  subtitle?: string
  featuredMoments?: Array<SanityStoryMoment | SanityReference>
  ctaButton?: {
    show: boolean
    label?: string
    href?: string
  }
}

export interface SanityAboutUs extends SanityDocument {
  _type: 'aboutUs'
  title: string
  brideBio: string
  groomBio: string
  bridePhoto?: SanityImage
  groomPhoto?: SanityImage
  couplePhoto?: SanityImage
}

export interface SanityPet extends SanityDocument {
  _type: 'pet'
  name: string
  type: string
  photo?: SanityImage
  bio?: string
}

export interface SanityOurFamily extends SanityDocument {
  _type: 'ourFamily'
  title: string
  subtitle?: string
  pets?: Array<SanityPet | SanityReference>
}

export interface SanityQuickPreview extends SanityDocument {
  _type: 'quickPreview'
  title: string
  subtitle?: string
  features?: Array<{
    _key: string
    title: string
    description: string
    icon?: string
    href?: string
  }>
}

export interface SanityWeddingLocation extends SanityDocument {
  _type: 'weddingLocation'
  weddingSettings: SanityWeddingSettings | SanityReference
  mapStyle?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain'
  showDirectionsButton: boolean
}

// =====================================================
// Page Documents
// =====================================================

export interface SanityPageSEO {
  title?: string
  description?: string
  ogImage?: SanityImage
}

export interface SanityHomePage extends SanityDocument {
  _type: 'homePage'
  title: string
  seo?: SanityPageSEO
  sections: Array<SanityReference>
}

export interface SanityTimelinePage extends SanityDocument {
  _type: 'timelinePage'
  title: string
  hero: {
    title: string
    subtitle: string
  }
  phases: Array<{
    _key: string
    id: string
    title: string
    dayRange: string
    subtitle?: string
    events: Array<{
      _key: string
      dayNumber: number
      date: string
      title: string
      description: string
      image?: SanityImage
      video?: SanityFile
      contentAlign: 'left' | 'right'
    }>
  }>
  seo?: SanityPageSEO
}

export interface SanityPage extends SanityDocument {
  _type: 'page'
  title: string
  slug: {
    current: string
  }
  seo?: SanityPageSEO
  sections?: Array<SanityReference>
}

// =====================================================
// Helper Types & Utilities
// =====================================================

/**
 * Helper type to resolve Sanity references
 */
export type Resolved<T> = T extends SanityReference
  ? SanityDocument
  : T extends Array<infer U>
  ? Array<Resolved<U>>
  : T

/**
 * Helper type for GROQ query results
 */
export type SanityQueryResult<T> = T | null

/**
 * Helper type for paginated results
 */
export interface SanityPaginatedResult<T> {
  items: T[]
  total: number
  hasMore: boolean
}

// =====================================================
// Export all types
// =====================================================

export type SanitySchemaType =
  | SanitySiteSettings
  | SanityNavigation
  | SanityFooter
  | SanitySEOSettings
  | SanityWeddingSettings
  | SanityGiftItem
  | SanityGalleryImage
  | SanityStoryPhase
  | SanityStoryMoment
  | SanityPet
  | SanityVideoHero
  | SanityEventDetails
  | SanityStoryPreview
  | SanityAboutUs
  | SanityOurFamily
  | SanityQuickPreview
  | SanityWeddingLocation
  | SanityHomePage
  | SanityTimelinePage
  | SanityPage
