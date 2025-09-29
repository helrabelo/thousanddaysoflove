import { createClient } from '@supabase/supabase-js'
import { MediaItem, TimelineEvent, GalleryStats, GalleryFilter } from '@/types/wedding'

// Supabase-based Gallery service for real storage and persistence
export class SupabaseGalleryService {
  private static supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  private static readonly BUCKET_NAME = 'wedding-media'

  // Media Items Management with Supabase Storage
  static async getMediaItems(filters?: GalleryFilter): Promise<MediaItem[]> {
    try {
      let query = this.supabase
        .from('media_items')
        .select('*')
        .eq('is_public', true)
        .order('upload_date', { ascending: false })

      // Apply filters
      if (filters?.categories && filters.categories.length > 0) {
        query = query.in('category', filters.categories)
      }

      if (filters?.media_types && filters.media_types.length > 0) {
        query = query.in('media_type', filters.media_types)
      }

      if (filters?.is_featured !== undefined) {
        query = query.eq('is_featured', filters.is_featured)
      }

      if (filters?.search_query) {
        query = query.or(`title.ilike.%${filters.search_query}%,description.ilike.%${filters.search_query}%`)
      }

      if (filters?.date_range) {
        query = query
          .gte('date_taken', filters.date_range.start)
          .lte('date_taken', filters.date_range.end)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching media items:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error fetching media items:', error)
      return []
    }
  }

  static async addMediaItem(item: Omit<MediaItem, 'id' | 'created_at' | 'updated_at'>): Promise<MediaItem> {
    try {
      const { data, error } = await this.supabase
        .from('media_items')
        .insert([{
          ...item,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) {
        console.error('Error adding media item:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Error adding media item:', error)
      throw error
    }
  }

  static async updateMediaItem(itemId: string, updates: Partial<MediaItem>): Promise<MediaItem> {
    try {
      const { data, error } = await this.supabase
        .from('media_items')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', itemId)
        .select()
        .single()

      if (error) {
        console.error('Error updating media item:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Error updating media item:', error)
      throw error
    }
  }

  static async deleteMediaItem(itemId: string): Promise<void> {
    try {
      // First get the item to delete the file from storage
      const { data: item, error: fetchError } = await this.supabase
        .from('media_items')
        .select('storage_path')
        .eq('id', itemId)
        .single()

      if (fetchError) {
        console.error('Error fetching item for deletion:', fetchError)
        throw fetchError
      }

      // Delete file from storage
      if (item?.storage_path) {
        const { error: storageError } = await this.supabase.storage
          .from(this.BUCKET_NAME)
          .remove([item.storage_path])

        if (storageError) {
          console.error('Error deleting file from storage:', storageError)
          // Continue with database deletion even if storage deletion fails
        }
      }

      // Delete from database
      const { error } = await this.supabase
        .from('media_items')
        .delete()
        .eq('id', itemId)

      if (error) {
        console.error('Error deleting media item:', error)
        throw error
      }
    } catch (error) {
      console.error('Error deleting media item:', error)
      throw error
    }
  }

  static async bulkUpdateMediaItems(itemIds: string[], updates: Partial<MediaItem>): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('media_items')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .in('id', itemIds)

      if (error) {
        console.error('Error bulk updating media items:', error)
        throw error
      }
    } catch (error) {
      console.error('Error bulk updating media items:', error)
      throw error
    }
  }

  // File Upload to Supabase Storage
  static async uploadFile(file: File, category: string = 'special_moments'): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`
      const filePath = `${category}/${fileName}`

      const { data, error } = await this.supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Error uploading file:', error)
        throw error
      }

      return data.path
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  }

  // Get public URL for uploaded file
  static getPublicUrl(storagePath: string): string {
    const { data } = this.supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(storagePath)

    return data.publicUrl
  }

  // Upload multiple files and create media items
  static async uploadFiles(files: File[]): Promise<MediaItem[]> {
    try {
      const uploadedItems: MediaItem[] = []

      for (const file of files) {
        // Upload file to storage
        const storagePath = await this.uploadFile(file)
        const publicUrl = this.getPublicUrl(storagePath)

        // Create media item
        const mediaItem: Omit<MediaItem, 'id' | 'created_at' | 'updated_at'> = {
          title: file.name.replace(/\.[^/.]+$/, ''),
          description: '',
          storage_path: storagePath,
          url: publicUrl,
          thumbnail_url: publicUrl, // For now, same as url. Could generate thumbnails later
          media_type: file.type.startsWith('image/') ? 'photo' : 'video',
          file_size: file.size,
          aspect_ratio: 1.5, // Would be calculated from actual file
          category: 'special_moments', // Default category
          tags: [],
          is_featured: false,
          is_public: true,
          upload_date: new Date().toISOString()
        }

        const addedItem = await this.addMediaItem(mediaItem)
        uploadedItems.push(addedItem)
      }

      return uploadedItems
    } catch (error) {
      console.error('Error uploading files:', error)
      throw error
    }
  }

  // Timeline Events Management
  static async getTimelineEvents(): Promise<TimelineEvent[]> {
    try {
      const { data, error } = await this.supabase
        .from('timeline_events')
        .select('*')
        .order('order_index', { ascending: true })

      if (error) {
        console.error('Error fetching timeline events:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error fetching timeline events:', error)
      return []
    }
  }

  static async addTimelineEvent(event: Omit<TimelineEvent, 'id' | 'created_at'>): Promise<TimelineEvent> {
    try {
      const { data, error } = await this.supabase
        .from('timeline_events')
        .insert([{
          ...event,
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) {
        console.error('Error adding timeline event:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Error adding timeline event:', error)
      throw error
    }
  }

  static async updateTimelineEvent(eventId: string, updates: Partial<TimelineEvent>): Promise<TimelineEvent> {
    try {
      const { data, error } = await this.supabase
        .from('timeline_events')
        .update(updates)
        .eq('id', eventId)
        .select()
        .single()

      if (error) {
        console.error('Error updating timeline event:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Error updating timeline event:', error)
      throw error
    }
  }

  static async deleteTimelineEvent(eventId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('timeline_events')
        .delete()
        .eq('id', eventId)

      if (error) {
        console.error('Error deleting timeline event:', error)
        throw error
      }
    } catch (error) {
      console.error('Error deleting timeline event:', error)
      throw error
    }
  }

  // Gallery Statistics
  static async getGalleryStats(): Promise<GalleryStats> {
    try {
      const { data: items, error } = await this.supabase
        .from('media_items')
        .select('media_type, category, file_size, is_featured, upload_date')

      if (error) {
        console.error('Error fetching gallery stats:', error)
        throw error
      }

      const { data: events, error: eventsError } = await this.supabase
        .from('timeline_events')
        .select('id')

      if (eventsError) {
        console.error('Error fetching timeline events count:', eventsError)
      }

      const photos = items?.filter(item => item.media_type === 'photo') || []
      const videos = items?.filter(item => item.media_type === 'video') || []
      const featured = items?.filter(item => item.is_featured) || []

      // Calculate total size in MB
      const totalSizeBytes = items?.reduce((total, item) => total + (item.file_size || 0), 0) || 0
      const totalSizeMB = totalSizeBytes / (1024 * 1024)

      // Category breakdown
      const categoriesBreakdown: any = {}
      items?.forEach(item => {
        categoriesBreakdown[item.category] = (categoriesBreakdown[item.category] || 0) + 1
      })

      // Most popular category
      const categoryEntries = Object.entries(categoriesBreakdown)
      const mostPopularCategory = categoryEntries.length > 0
        ? categoryEntries.reduce((a, b) => a[1] > b[1] ? a : b)[0]
        : 'special_moments'

      // Latest upload date
      const latestUploadDate = items && items.length > 0
        ? items.sort((a, b) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime())[0].upload_date
        : undefined

      const stats: GalleryStats = {
        total_photos: photos.length,
        total_videos: videos.length,
        total_size_mb: totalSizeMB,
        categories_breakdown: categoriesBreakdown,
        featured_count: featured.length,
        latest_upload_date: latestUploadDate,
        most_popular_category: mostPopularCategory as any,
        timeline_events_count: events?.length || 0
      }

      return stats
    } catch (error) {
      console.error('Error calculating gallery stats:', error)
      throw error
    }
  }

  // Export functionality
  static async exportGalleryData(): Promise<string> {
    try {
      const [items, events, stats] = await Promise.all([
        this.getMediaItems(),
        this.getTimelineEvents(),
        this.getGalleryStats()
      ])

      const exportData = {
        media_items: items,
        timeline_events: events,
        gallery_stats: stats,
        export_date: new Date().toISOString(),
        export_source: 'supabase'
      }

      return JSON.stringify(exportData, null, 2)
    } catch (error) {
      console.error('Error exporting gallery data:', error)
      throw error
    }
  }

  // Utility method to ensure storage bucket exists
  static async ensureBucketExists(): Promise<void> {
    try {
      const { data, error } = await this.supabase.storage.getBucket(this.BUCKET_NAME)

      if (error && error.message.includes('not found')) {
        // Create bucket if it doesn't exist
        const { error: createError } = await this.supabase.storage.createBucket(this.BUCKET_NAME, {
          public: true
        })

        if (createError) {
          console.error('Error creating storage bucket:', createError)
          throw createError
        }

        console.log('✅ Storage bucket created successfully')
      } else if (error) {
        console.error('Error checking storage bucket:', error)
        throw error
      }
    } catch (error) {
      console.error('Error ensuring bucket exists:', error)
      throw error
    }
  }
}