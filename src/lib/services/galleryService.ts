import { MediaItem, TimelineEvent, GalleryStats, GalleryFilter } from '@/types/wedding'

// Gallery service for managing media items and timeline events
export class GalleryService {
  private static readonly STORAGE_KEYS = {
    MEDIA_ITEMS: 'wedding_media_items',
    TIMELINE_EVENTS: 'wedding_timeline_events',
    GALLERY_STATS: 'wedding_gallery_stats'
  }

  // Media Items Management
  static async getMediaItems(filters?: GalleryFilter): Promise<MediaItem[]> {
    try {
      // In a real implementation, this would call your backend API
      const items = this.getStorageData<MediaItem[]>(this.STORAGE_KEYS.MEDIA_ITEMS, [])

      if (!filters) return items

      return this.applyFilters(items, filters)
    } catch (error) {
      console.error('Error fetching media items:', error)
      return []
    }
  }

  static async addMediaItem(item: MediaItem): Promise<MediaItem> {
    try {
      const items = await this.getMediaItems()
      const newItem = {
        ...item,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const updatedItems = [...items, newItem]
      this.setStorageData(this.STORAGE_KEYS.MEDIA_ITEMS, updatedItems)

      // Update stats
      await this.updateStats()

      return newItem
    } catch (error) {
      console.error('Error adding media item:', error)
      throw error
    }
  }

  static async updateMediaItem(itemId: string, updates: Partial<MediaItem>): Promise<MediaItem> {
    try {
      const items = await this.getMediaItems()
      const itemIndex = items.findIndex(item => item.id === itemId)

      if (itemIndex === -1) {
        throw new Error('Item not found')
      }

      const updatedItem = {
        ...items[itemIndex],
        ...updates,
        updated_at: new Date().toISOString()
      }

      items[itemIndex] = updatedItem
      this.setStorageData(this.STORAGE_KEYS.MEDIA_ITEMS, items)

      // Update stats
      await this.updateStats()

      return updatedItem
    } catch (error) {
      console.error('Error updating media item:', error)
      throw error
    }
  }

  static async deleteMediaItem(itemId: string): Promise<void> {
    try {
      const items = await this.getMediaItems()
      const filteredItems = items.filter(item => item.id !== itemId)

      this.setStorageData(this.STORAGE_KEYS.MEDIA_ITEMS, filteredItems)

      // Update stats
      await this.updateStats()
    } catch (error) {
      console.error('Error deleting media item:', error)
      throw error
    }
  }

  static async bulkUpdateMediaItems(itemIds: string[], updates: Partial<MediaItem>): Promise<void> {
    try {
      const items = await this.getMediaItems()
      const updatedItems = items.map(item =>
        itemIds.includes(item.id)
          ? { ...item, ...updates, updated_at: new Date().toISOString() }
          : item
      )

      this.setStorageData(this.STORAGE_KEYS.MEDIA_ITEMS, updatedItems)

      // Update stats
      await this.updateStats()
    } catch (error) {
      console.error('Error bulk updating media items:', error)
      throw error
    }
  }

  // Timeline Events Management
  static async getTimelineEvents(): Promise<TimelineEvent[]> {
    try {
      return this.getStorageData<TimelineEvent[]>(this.STORAGE_KEYS.TIMELINE_EVENTS, [])
    } catch (error) {
      console.error('Error fetching timeline events:', error)
      return []
    }
  }

  static async addTimelineEvent(event: TimelineEvent): Promise<TimelineEvent> {
    try {
      const events = await this.getTimelineEvents()
      const newEvent = {
        ...event,
        created_at: new Date().toISOString()
      }

      const updatedEvents = [...events, newEvent].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
      )

      this.setStorageData(this.STORAGE_KEYS.TIMELINE_EVENTS, updatedEvents)

      return newEvent
    } catch (error) {
      console.error('Error adding timeline event:', error)
      throw error
    }
  }

  static async updateTimelineEvent(eventId: string, updates: Partial<TimelineEvent>): Promise<TimelineEvent> {
    try {
      const events = await this.getTimelineEvents()
      const eventIndex = events.findIndex(event => event.id === eventId)

      if (eventIndex === -1) {
        throw new Error('Event not found')
      }

      const updatedEvent = { ...events[eventIndex], ...updates }
      events[eventIndex] = updatedEvent

      // Re-sort by date
      const sortedEvents = events.sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
      )

      this.setStorageData(this.STORAGE_KEYS.TIMELINE_EVENTS, sortedEvents)

      return updatedEvent
    } catch (error) {
      console.error('Error updating timeline event:', error)
      throw error
    }
  }

  static async deleteTimelineEvent(eventId: string): Promise<void> {
    try {
      const events = await this.getTimelineEvents()
      const filteredEvents = events.filter(event => event.id !== eventId)

      this.setStorageData(this.STORAGE_KEYS.TIMELINE_EVENTS, filteredEvents)
    } catch (error) {
      console.error('Error deleting timeline event:', error)
      throw error
    }
  }

  // Gallery Statistics
  static async getGalleryStats(): Promise<GalleryStats> {
    try {
      const items = await this.getMediaItems()
      const events = await this.getTimelineEvents()

      const stats: GalleryStats = {
        total_photos: items.filter(item => item.media_type === 'photo').length,
        total_videos: items.filter(item => item.media_type === 'video').length,
        total_size_mb: this.calculateTotalSize(items),
        categories_breakdown: this.getCategoriesBreakdown(items),
        featured_count: items.filter(item => item.is_featured).length,
        latest_upload_date: this.getLatestUploadDate(items),
        most_popular_category: this.getMostPopularCategory(items),
        timeline_events_count: events.length
      }

      this.setStorageData(this.STORAGE_KEYS.GALLERY_STATS, stats)

      return stats
    } catch (error) {
      console.error('Error calculating gallery stats:', error)
      throw error
    }
  }

  // File Upload Simulation
  static async uploadFiles(files: File[]): Promise<MediaItem[]> {
    try {
      const uploadedItems: MediaItem[] = []

      for (const file of files) {
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        const mediaItem: MediaItem = {
          id: this.generateId(),
          title: file.name.replace(/\.[^/.]+$/, ''),
          description: '',
          url: URL.createObjectURL(file), // In real app, this would be the uploaded URL
          thumbnail_url: URL.createObjectURL(file),
          media_type: file.type.startsWith('image/') ? 'photo' : 'video',
          file_size: file.size,
          aspect_ratio: 1.5, // Would be calculated from actual file
          category: 'special_moments', // Default category
          tags: [],
          is_featured: false,
          is_public: true,
          upload_date: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        uploadedItems.push(await this.addMediaItem(mediaItem))
      }

      return uploadedItems
    } catch (error) {
      console.error('Error uploading files:', error)
      throw error
    }
  }

  // Export functionality
  static async exportGalleryData(): Promise<string> {
    try {
      const items = await this.getMediaItems()
      const events = await this.getTimelineEvents()
      const stats = await this.getGalleryStats()

      const exportData = {
        media_items: items,
        timeline_events: events,
        gallery_stats: stats,
        export_date: new Date().toISOString()
      }

      return JSON.stringify(exportData, null, 2)
    } catch (error) {
      console.error('Error exporting gallery data:', error)
      throw error
    }
  }

  // Helper methods
  private static applyFilters(items: MediaItem[], filters: GalleryFilter): MediaItem[] {
    let filtered = items

    // Apply category filter
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(item => filters.categories!.includes(item.category))
    }

    // Apply media type filter
    if (filters.media_types && filters.media_types.length > 0) {
      filtered = filtered.filter(item => filters.media_types!.includes(item.media_type))
    }

    // Apply date range filter
    if (filters.date_range) {
      filtered = filtered.filter(item => {
        if (!item.date_taken) return true
        const itemDate = new Date(item.date_taken)
        const startDate = new Date(filters.date_range!.start)
        const endDate = new Date(filters.date_range!.end)
        return itemDate >= startDate && itemDate <= endDate
      })
    }

    // Apply tags filter
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(item =>
        filters.tags!.some(tag => item.tags.includes(tag))
      )
    }

    // Apply featured filter
    if (filters.is_featured !== undefined) {
      filtered = filtered.filter(item => item.is_featured === filters.is_featured)
    }

    // Apply search query
    if (filters.search_query) {
      const query = filters.search_query.toLowerCase()
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal: any, bVal: any

      switch (filters.sort_by) {
        case 'title':
          aVal = a.title.toLowerCase()
          bVal = b.title.toLowerCase()
          break
        case 'category':
          aVal = a.category
          bVal = b.category
          break
        case 'date_taken':
          aVal = new Date(a.date_taken || 0).getTime()
          bVal = new Date(b.date_taken || 0).getTime()
          break
        default:
          aVal = new Date(a.upload_date).getTime()
          bVal = new Date(b.upload_date).getTime()
      }

      if (filters.sort_order === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      }
    })

    return filtered
  }

  private static async updateStats(): Promise<void> {
    await this.getGalleryStats() // This will recalculate and store stats
  }

  private static calculateTotalSize(items: MediaItem[]): number {
    return items.reduce((total, item) => total + (item.file_size || 0), 0) / (1024 * 1024) // Convert to MB
  }

  private static getCategoriesBreakdown(items: MediaItem[]): GalleryStats['categories_breakdown'] {
    const breakdown: any = {}

    items.forEach(item => {
      breakdown[item.category] = (breakdown[item.category] || 0) + 1
    })

    return breakdown
  }

  private static getLatestUploadDate(items: MediaItem[]): string | undefined {
    if (items.length === 0) return undefined

    return items
      .sort((a, b) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime())
      [0].upload_date
  }

  private static getMostPopularCategory(items: MediaItem[]): any {
    const breakdown = this.getCategoriesBreakdown(items)
    const entries = Object.entries(breakdown)

    if (entries.length === 0) return 'special_moments'

    return entries.reduce((a, b) => a[1] > b[1] ? a : b)[0]
  }

  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }

  private static getStorageData<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue

    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : defaultValue
    } catch {
      return defaultValue
    }
  }

  private static setStorageData<T>(key: string, data: T): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  // Initialize with sample data if empty
  static async initializeSampleData(): Promise<void> {
    try {
      const existingItems = await this.getMediaItems()
      const existingEvents = await this.getTimelineEvents()

      // Only initialize if no data exists (DISABLED - user has real data)
      if (false && existingItems.length === 0) {
        // Sample media items
        const sampleItems: MediaItem[] = [
          {
            id: 'sample-1',
            title: 'Primeiro Encontro no Café',
            description: 'O momento em que tudo começou - nosso primeiro encontro no café da Rua Augusta',
            url: '/images/gallery/primeiro-encontro.jpg',
            thumbnail_url: '/images/gallery/primeiro-encontro-thumb.jpg',
            media_type: 'photo',
            file_size: 2500000, // 2.5MB
            aspect_ratio: 1.5,
            category: 'dates',
            tags: ['primeiro', 'encontro', 'café', 'início'],
            date_taken: '2022-11-20',
            location: 'Café da Rua Augusta, São Paulo',
            is_featured: true,
            is_public: true,
            upload_date: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'sample-2',
            title: 'Jantar Romântico - Dia dos Namorados',
            description: 'Nossa primeira celebração do Dia dos Namorados juntos',
            url: '/images/gallery/dia-namorados.jpg',
            thumbnail_url: '/images/gallery/dia-namorados-thumb.jpg',
            media_type: 'photo',
            file_size: 3200000, // 3.2MB
            aspect_ratio: 1.2,
            category: 'dates',
            tags: ['romântico', 'dia dos namorados', 'jantar'],
            date_taken: '2023-02-14',
            location: 'Restaurante Panorâmico, São Paulo',
            is_featured: true,
            is_public: true,
            upload_date: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'sample-3',
            title: 'Viagem para o Rio de Janeiro',
            description: 'Nossa primeira viagem juntos - praias, Cristo Redentor e muito amor',
            url: '/images/gallery/rio-viagem.jpg',
            thumbnail_url: '/images/gallery/rio-viagem-thumb.jpg',
            media_type: 'photo',
            file_size: 4100000, // 4.1MB
            aspect_ratio: 1.8,
            category: 'travel',
            tags: ['viagem', 'rio', 'praia', 'primeira viagem'],
            date_taken: '2023-07-15',
            location: 'Rio de Janeiro, RJ',
            is_featured: true,
            is_public: true,
            upload_date: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'sample-4',
            title: 'Video do Pedido de Casamento',
            description: 'O momento mais emocionante e especial das nossas vidas',
            url: '/videos/gallery/pedido-casamento.mp4',
            thumbnail_url: '/images/gallery/pedido-thumb.jpg',
            media_type: 'video',
            file_size: 85000000, // 85MB
            aspect_ratio: 1.77,
            category: 'proposal',
            tags: ['pedido', 'casamento', 'noivado', 'emoção'],
            date_taken: '2024-05-10',
            location: 'Praia de Copacabana, Rio de Janeiro',
            is_featured: true,
            is_public: true,
            upload_date: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'sample-5',
            title: 'Festa de Noivado',
            description: 'Celebrando nosso noivado com todos os nossos amigos e família',
            url: '/images/gallery/festa-noivado.jpg',
            thumbnail_url: '/images/gallery/festa-noivado-thumb.jpg',
            media_type: 'photo',
            file_size: 3800000, // 3.8MB
            aspect_ratio: 1.3,
            category: 'friends',
            tags: ['festa', 'noivado', 'celebração', 'amigos', 'família'],
            date_taken: '2024-06-20',
            location: 'Buffet Vila Olímpia, São Paulo',
            is_featured: false,
            is_public: true,
            upload_date: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'sample-6',
            title: 'Ensaio Pré-Wedding',
            description: 'Nosso ensaio fotográfico profissional no Parque Ibirapuera',
            url: '/images/gallery/ensaio-pre-wedding.jpg',
            thumbnail_url: '/images/gallery/ensaio-pre-wedding-thumb.jpg',
            media_type: 'photo',
            file_size: 5200000, // 5.2MB
            aspect_ratio: 1.4,
            category: 'professional',
            tags: ['ensaio', 'pré-wedding', 'fotografia', 'profissional'],
            date_taken: '2024-09-10',
            location: 'Parque Ibirapuera, São Paulo',
            is_featured: true,
            is_public: true,
            upload_date: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]

        // Store sample items
        this.setStorageData(this.STORAGE_KEYS.MEDIA_ITEMS, sampleItems)
      }

      if (false && existingEvents.length === 0) {
        // Sample timeline events
        const sampleEvents: TimelineEvent[] = [
          {
            id: 'timeline-1',
            date: '2022-11-20',
            title: 'Primeiro Encontro',
            description: 'Nosso primeiro encontro no café da Rua Augusta. Foi amor à primeira vista! Conversamos por horas sobre sonhos, viagens e a vida.',
            media_type: 'photo',
            media_url: '/images/gallery/primeiro-encontro.jpg',
            thumbnail_url: '/images/gallery/primeiro-encontro-thumb.jpg',
            location: 'Café da Rua Augusta, São Paulo',
            milestone_type: 'first_date',
            is_major_milestone: true,
            order_index: 1,
            created_at: new Date().toISOString()
          },
          {
            id: 'timeline-2',
            date: '2023-02-14',
            title: 'Nosso Primeiro Dia dos Namorados',
            description: 'Uma noite mágica no restaurante com vista para a cidade. Foi quando soubemos que era para sempre.',
            media_type: 'photo',
            media_url: '/images/gallery/dia-namorados.jpg',
            thumbnail_url: '/images/gallery/dia-namorados-thumb.jpg',
            location: 'Restaurante Panorâmico, São Paulo',
            milestone_type: 'anniversary',
            is_major_milestone: true,
            order_index: 2,
            created_at: new Date().toISOString()
          },
          {
            id: 'timeline-3',
            date: '2024-05-10',
            title: 'O Pedido',
            description: 'O momento mais especial de nossas vidas. No pôr do sol na praia, com o anel que eu escolhi pensando nela.',
            media_type: 'video',
            media_url: '/videos/gallery/pedido.mp4',
            thumbnail_url: '/images/gallery/pedido-thumb.jpg',
            location: 'Praia de Copacabana, Rio de Janeiro',
            milestone_type: 'proposal',
            is_major_milestone: true,
            order_index: 4,
            created_at: new Date().toISOString()
          }
        ]

        // Store sample events
        this.setStorageData(this.STORAGE_KEYS.TIMELINE_EVENTS, sampleEvents)
      }
    } catch (error) {
      console.error('Erro ao inicializar dados de exemplo:', error)
    }
  }
}