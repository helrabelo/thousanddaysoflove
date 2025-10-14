/**
 * Guest Media Document Schema
 *
 * This schema stores photos and videos uploaded by wedding guests.
 * Images/videos are stored in Sanity's asset CDN, while metadata
 * and references are stored in both Sanity and Supabase.
 *
 * Flow:
 * 1. Guest uploads file via Next.js API
 * 2. API uploads to Sanity asset system
 * 3. Sanity document created with asset reference
 * 4. Supabase record created with Sanity IDs for fast queries
 * 5. After moderation approval, content becomes public
 */

import { defineType, defineField } from 'sanity'
import { ImageIcon, PlayIcon } from '@sanity/icons'

export default defineType({
  name: 'guestMedia',
  title: 'Guest Photos & Videos',
  type: 'document',
  icon: ImageIcon,
  fields: [
    // ============================================================================
    // MEDIA ASSET
    // ============================================================================
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
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: {
        hotspot: true, // Enable focal point selection
        accept: 'image/jpeg, image/png, image/webp, image/heic',
      },
      hidden: ({ document }) => document?.mediaType !== 'photo',
    }),

    defineField({
      name: 'video',
      title: 'Video',
      type: 'file',
      options: {
        accept: 'video/mp4, video/quicktime, video/x-msvideo',
      },
      hidden: ({ document }) => document?.mediaType !== 'video',
    }),

    // Video thumbnail (auto-generated or manually uploaded)
    defineField({
      name: 'videoThumbnail',
      title: 'Video Thumbnail',
      type: 'image',
      options: {
        hotspot: true,
      },
      hidden: ({ document }) => document?.mediaType !== 'video',
      description: 'Thumbnail image for video preview',
    }),

    // ============================================================================
    // GUEST INFORMATION
    // ============================================================================
    defineField({
      name: 'guestId',
      title: 'Guest ID (Supabase)',
      type: 'string',
      description: 'UUID reference to simple_guests table in Supabase',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'guestName',
      title: 'Guest Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    // ============================================================================
    // CONTENT DETAILS
    // ============================================================================
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Optional title for the photo/video',
    }),

    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.max(500).warning('Keep captions under 500 characters'),
    }),

    defineField({
      name: 'uploadPhase',
      title: 'Upload Phase',
      type: 'string',
      options: {
        list: [
          { title: '📆 Before Wedding', value: 'before' },
          { title: '💒 During Wedding', value: 'during' },
          { title: '🎉 After Wedding', value: 'after' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'uploadedAt',
      title: 'Uploaded At',
      type: 'datetime',
      options: {
        dateFormat: 'DD-MM-YYYY',
        timeFormat: 'HH:mm',
        timeStep: 1,
      },
      initialValue: () => new Date().toISOString(),
    }),

    // ============================================================================
    // MODERATION
    // ============================================================================
    defineField({
      name: 'moderationStatus',
      title: 'Moderation Status',
      type: 'string',
      options: {
        list: [
          { title: '⏳ Pending Review', value: 'pending' },
          { title: '✅ Approved', value: 'approved' },
          { title: '❌ Rejected', value: 'rejected' },
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'moderatedAt',
      title: 'Moderated At',
      type: 'datetime',
      readOnly: true,
      hidden: ({ document }) => document?.moderationStatus === 'pending',
    }),

    defineField({
      name: 'moderatedBy',
      title: 'Moderated By',
      type: 'string',
      readOnly: true,
      hidden: ({ document }) => document?.moderationStatus === 'pending',
    }),

    defineField({
      name: 'rejectionReason',
      title: 'Rejection Reason',
      type: 'text',
      rows: 2,
      hidden: ({ document }) => document?.moderationStatus !== 'rejected',
      description: 'Why this content was rejected (optional)',
    }),

    // ============================================================================
    // ENGAGEMENT METRICS (Synced from Supabase)
    // ============================================================================
    defineField({
      name: 'likeCount',
      title: 'Likes',
      type: 'number',
      readOnly: true,
      initialValue: 0,
    }),

    defineField({
      name: 'commentCount',
      title: 'Comments',
      type: 'number',
      readOnly: true,
      initialValue: 0,
    }),

    defineField({
      name: 'viewCount',
      title: 'Views',
      type: 'number',
      readOnly: true,
      initialValue: 0,
    }),

    // ============================================================================
    // FLAGS & FEATURES
    // ============================================================================
    defineField({
      name: 'isFeatured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show this in featured gallery sections',
      initialValue: false,
    }),

    defineField({
      name: 'isDeleted',
      title: 'Deleted',
      type: 'boolean',
      description: 'Soft delete flag',
      initialValue: false,
      hidden: true,
    }),

    // ============================================================================
    // TECHNICAL METADATA
    // ============================================================================
    defineField({
      name: 'originalFilename',
      title: 'Original Filename',
      type: 'string',
      readOnly: true,
    }),

    defineField({
      name: 'fileSize',
      title: 'File Size (bytes)',
      type: 'number',
      readOnly: true,
    }),

    defineField({
      name: 'duration',
      title: 'Video Duration (seconds)',
      type: 'number',
      readOnly: true,
      hidden: ({ document }) => document?.mediaType !== 'video',
    }),

    // EXIF data (optional)
    defineField({
      name: 'metadata',
      title: 'Metadata',
      type: 'object',
      fields: [
        { name: 'dateTaken', title: 'Date Taken', type: 'datetime' },
        { name: 'location', title: 'Location', type: 'string' },
        { name: 'camera', title: 'Camera Model', type: 'string' },
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
  ],

  // ============================================================================
  // PREVIEW CONFIGURATION
  // ============================================================================
  preview: {
    select: {
      title: 'guestName',
      caption: 'caption',
      mediaType: 'mediaType',
      moderationStatus: 'moderationStatus',
      uploadPhase: 'uploadPhase',
      image: 'image',
      videoThumbnail: 'videoThumbnail',
    },
    prepare(selection) {
      const { title, caption, mediaType, moderationStatus, uploadPhase, image, videoThumbnail } = selection

      // Status emoji
      const statusEmoji: Record<string, string> = {
        pending: '⏳',
        approved: '✅',
        rejected: '❌',
      }
      const status = (moderationStatus as string) || 'pending'

      // Phase emoji
      const phaseEmoji: Record<string, string> = {
        before: '📆',
        during: '💒',
        after: '🎉',
      }
      const phase = (uploadPhase as string) || 'before'

      // Media type icon
      const mediaEmoji = mediaType === 'video' ? '🎥' : '📷'

      return {
        title: `${statusEmoji[status] || '❓'} ${title}`,
        subtitle: `${mediaEmoji} ${phaseEmoji[phase] || '📸'} ${caption || 'No caption'}`,
        media: mediaType === 'video' ? videoThumbnail || PlayIcon : image || ImageIcon,
      }
    },
  },

  // ============================================================================
  // ORDERING
  // ============================================================================
  orderings: [
    {
      title: 'Upload Date (Newest)',
      name: 'uploadedAtDesc',
      by: [{ field: 'uploadedAt', direction: 'desc' }],
    },
    {
      title: 'Upload Date (Oldest)',
      name: 'uploadedAtAsc',
      by: [{ field: 'uploadedAt', direction: 'asc' }],
    },
    {
      title: 'Most Liked',
      name: 'likeCountDesc',
      by: [{ field: 'likeCount', direction: 'desc' }],
    },
    {
      title: 'Moderation Status',
      name: 'moderationStatus',
      by: [
        { field: 'moderationStatus', direction: 'asc' },
        { field: 'uploadedAt', direction: 'desc' },
      ],
    },
  ],
})
