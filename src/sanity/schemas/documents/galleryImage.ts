/**
 * Gallery Image Document Schema
 *
 * Individual gallery images with full metadata support.
 * Replaces Supabase media_items table with Sanity's asset management.
 *
 * Benefits:
 * - Sanity's global CDN for fast image delivery
 * - Automatic image optimization (WebP, responsive sizes)
 * - Built-in image editor
 * - Version history
 * - Better content management interface
 */

import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'galleryImage',
  title: 'Gallery Images',
  type: 'document',
  icon: () => '📷',
  fields: [
    // Primary Image Asset
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true, // Enable focal point selection
        metadata: ['blurhash', 'lqip', 'palette'], // Extract metadata for placeholders
      },
      validation: (Rule) => Rule.required(),
    }),

    // Basic Information
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Give this photo a meaningful title',
      validation: (Rule) => Rule.required().max(255),
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Tell the story behind this moment',
      rows: 3,
    }),

    // Video Support (for future video migration)
    defineField({
      name: 'video',
      title: 'Video (Optional)',
      type: 'file',
      description: 'Upload a video file instead of an image',
      options: {
        accept: 'video/*',
      },
    }),

    defineField({
      name: 'mediaType',
      title: 'Media Type',
      type: 'string',
      options: {
        list: [
          { title: 'Photo', value: 'photo' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio',
      },
      initialValue: 'photo',
      validation: (Rule) => Rule.required(),
    }),

    // Categorization
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'What moment does this capture?',
      options: {
        list: [
          { title: '💍 Engagement', value: 'engagement' },
          { title: '✈️ Travel', value: 'travel' },
          { title: '💕 Dates', value: 'dates' },
          { title: '👨‍👩‍👧‍👦 Family', value: 'family' },
          { title: '👯 Friends', value: 'friends' },
          { title: '✨ Special Moments', value: 'special_moments' },
          { title: '💎 Proposal', value: 'proposal' },
          { title: '👰 Wedding Prep', value: 'wedding_prep' },
          { title: '🎬 Behind Scenes', value: 'behind_scenes' },
          { title: '📸 Professional', value: 'professional' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      description: 'Add tags for better organization and searching',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),

    // Location & Date
    defineField({
      name: 'dateTaken',
      title: 'Date Taken',
      type: 'date',
      description: 'When was this photo taken?',
      options: {
        dateFormat: 'DD/MM/YYYY',
      },
    }),

    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Where was this photo taken?',
      placeholder: 'e.g., Fortaleza, Ceará',
    }),

    // Display Options
    defineField({
      name: 'isFeatured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show this in featured galleries and highlights',
      initialValue: false,
    }),

    defineField({
      name: 'isPublic',
      title: 'Public',
      type: 'boolean',
      description: 'Make this photo visible on the website',
      initialValue: true,
    }),

    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first (optional - auto-sorted by date if not set)',
      validation: (Rule) => Rule.integer().positive(),
    }),

    // Technical Metadata (optional)
    defineField({
      name: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'number',
      description: 'Width / Height (calculated automatically if not set)',
      readOnly: true,
    }),

    defineField({
      name: 'photographer',
      title: 'Photographer',
      type: 'string',
      description: 'Who took this photo?',
    }),

    defineField({
      name: 'cameraInfo',
      title: 'Camera Info',
      type: 'object',
      description: 'Technical details (optional)',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        {
          name: 'make',
          title: 'Camera Make',
          type: 'string',
          placeholder: 'e.g., Canon',
        },
        {
          name: 'model',
          title: 'Camera Model',
          type: 'string',
          placeholder: 'e.g., EOS R5',
        },
        {
          name: 'lens',
          title: 'Lens',
          type: 'string',
          placeholder: 'e.g., 24-70mm f/2.8',
        },
        {
          name: 'settings',
          title: 'Settings',
          type: 'string',
          placeholder: 'e.g., ISO 400, f/2.8, 1/200s',
        },
      ],
    }),
  ],

  // Preview Configuration
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'image',
      isFeatured: 'isFeatured',
      isPublic: 'isPublic',
      dateTaken: 'dateTaken',
    },
    prepare({ title, subtitle, media, isFeatured, isPublic, dateTaken }) {
      const categoryLabels: Record<string, string> = {
        engagement: '💍 Engagement',
        travel: '✈️ Travel',
        dates: '💕 Dates',
        family: '👨‍👩‍👧‍👦 Family',
        friends: '👯 Friends',
        special_moments: '✨ Special Moments',
        proposal: '💎 Proposal',
        wedding_prep: '👰 Wedding Prep',
        behind_scenes: '🎬 Behind Scenes',
        professional: '📸 Professional',
      }

      const badges = []
      if (isFeatured) badges.push('⭐ Featured')
      if (!isPublic) badges.push('🔒 Private')

      const categoryLabel = categoryLabels[subtitle] || subtitle
      const dateStr = dateTaken ? new Date(dateTaken).toLocaleDateString('pt-BR') : ''

      return {
        title: title,
        subtitle: `${categoryLabel}${dateStr ? ` • ${dateStr}` : ''}${badges.length > 0 ? ` • ${badges.join(' ')}` : ''}`,
        media: media,
      }
    },
  },

  // Initial Value
  initialValue: {
    mediaType: 'photo',
    isPublic: true,
    isFeatured: false,
    category: 'special_moments',
  },

  // Ordering
  orderings: [
    {
      title: 'Date Taken (Newest First)',
      name: 'dateTakenDesc',
      by: [{ field: 'dateTaken', direction: 'desc' }],
    },
    {
      title: 'Date Taken (Oldest First)',
      name: 'dateTakenAsc',
      by: [{ field: 'dateTaken', direction: 'asc' }],
    },
    {
      title: 'Title (A-Z)',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
    {
      title: 'Category',
      name: 'categoryAsc',
      by: [{ field: 'category', direction: 'asc' }],
    },
    {
      title: 'Display Order',
      name: 'displayOrder',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
  ],
})
