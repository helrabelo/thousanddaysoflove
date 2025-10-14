// Gallery Components Export
export { default as HeroVideoSection } from './HeroVideoSection'
export { default as StoryTimeline } from './StoryTimeline'
export { default as MasonryGallery } from './MasonryGallery'
export { default as VideoGallery } from './VideoGallery'
export { default as MediaLightbox } from './MediaLightbox'
// MediaUploader and GalleryAdmin are not yet implemented
// export { default as MediaUploader } from './MediaUploader'
// export { default as GalleryAdmin } from './GalleryAdmin'

// Types re-export for convenience
export type {
  MediaItem,
  TimelineEvent,
  MediaCategory,
  GalleryStats,
  GalleryFilter,
  GallerySection,
  MediaUpload,
  LightboxState,
  SocialShare
} from '@/types/wedding'