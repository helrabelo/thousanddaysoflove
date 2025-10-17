'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { fetchTimelineEvents } from '@/lib/sanity/timeline'
import LiveTimelineService from '@/lib/services/LiveTimelineService'
import { SupabaseGalleryService, GUEST_PHOTO_BUCKET } from '@/lib/supabase/gallery'
import { createClient as createSupabaseClient } from '@/lib/supabase/client'
import type {
  LiveTimelineData,
  TimelineEventPhoto,
  WeddingTimelineEvent,
} from '@/types/wedding'

interface UseTimelineStateOptions {
  /** Enable automatic interval-based recalculation (default: true) */
  autoUpdate?: boolean
  /** Interval in milliseconds for recalculation (default: 30s) */
  updateIntervalMs?: number
}

interface UseTimelineStateResult {
  events: WeddingTimelineEvent[]
  data: LiveTimelineData | null
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
  lastUpdatedAt: Date | null
}

interface GuestPhotoRealtimeRecord {
  id: string
  timeline_event_id: string | null
  guest_name: string
  storage_path: string
  storage_bucket?: string | null
  is_video: boolean
  upload_phase: TimelineEventPhoto['uploadPhase']
  uploaded_at: string
  width?: number | null
  height?: number | null
  moderation_status: 'pending' | 'approved' | 'rejected'
}

export function useTimelineState(
  options: UseTimelineStateOptions = {}
): UseTimelineStateResult {
  const { autoUpdate = true, updateIntervalMs } = options

  const [events, setEvents] = useState<WeddingTimelineEvent[]>([])
  const [data, setData] = useState<LiveTimelineData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null)
  const [photosByEvent, setPhotosByEvent] = useState<Record<string, TimelineEventPhoto[]>>({})

  const eventsRef = useRef<WeddingTimelineEvent[]>([])
  eventsRef.current = events

  const photosRef = useRef<Record<string, TimelineEventPhoto[]>>({})
  photosRef.current = photosByEvent

  const recalculate = useCallback((
    sourceEvents: WeddingTimelineEvent[],
    photosMap: Record<string, TimelineEventPhoto[]> = photosRef.current
  ) => {
    if (sourceEvents.length === 0) {
      setData(null)
      return
    }

    const timelineData = LiveTimelineService.calculateTimelineState(
      sourceEvents,
      new Date(),
      photosMap
    )
    setData(timelineData)
  }, [])

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const timelineEvents = await fetchTimelineEvents()
      let groupedPhotos: Record<string, TimelineEventPhoto[]> = {}

      try {
        const eventIds = timelineEvents.map((event) => event._id)
        if (eventIds.length > 0) {
          groupedPhotos = await SupabaseGalleryService.getApprovedPhotosByTimelineEvent(eventIds)
        }
      } catch (photoError) {
        console.error('[useTimelineState] Failed to fetch event photos:', photoError)
        groupedPhotos = {}
      }

      setEvents(timelineEvents)
      setPhotosByEvent(groupedPhotos)
      recalculate(timelineEvents, groupedPhotos)
      setLastUpdatedAt(new Date())
    } catch (err) {
      console.error('[useTimelineState] Failed to fetch timeline events:', err)
      setError('Nao foi possivel carregar a timeline agora. Tenta de novo?')
      setPhotosByEvent({})
    } finally {
      setIsLoading(false)
    }
  }, [recalculate])

  useEffect(() => {
    void refresh()
  }, [refresh])

  useEffect(() => {
    const handleMediaUploaded = () => {
      void refresh()
    }

    window.addEventListener('media-uploaded', handleMediaUploaded as EventListener)
    return () => window.removeEventListener('media-uploaded', handleMediaUploaded as EventListener)
  }, [refresh])

  useEffect(() => {
    const supabase = createSupabaseClient()

    const upsertApprovedPhoto = (record: GuestPhotoRealtimeRecord) => {
      if (!record.timeline_event_id) {
        return
      }

      const eventId = record.timeline_event_id
      const bucket = record.storage_bucket || GUEST_PHOTO_BUCKET
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(record.storage_path)

      const publicUrl = urlData.publicUrl

      const photo: TimelineEventPhoto = {
        id: record.id,
        timelineEventId: eventId,
        publicUrl,
        storagePath: record.storage_path,
        isVideo: Boolean(record.is_video),
        guestName: record.guest_name,
        uploadedAt: record.uploaded_at,
        uploadPhase: record.upload_phase,
        width: record.width ?? null,
        height: record.height ?? null,
      }

      let shouldIncrementCount = false

      setPhotosByEvent((prev) => {
        const existing = prev[eventId] ?? []
        const alreadyExists = existing.some((existingPhoto) => existingPhoto.id === photo.id)

        if (!alreadyExists) {
          shouldIncrementCount = true
        }

        const updatedPhotos = alreadyExists
          ? existing.map((existingPhoto) =>
              existingPhoto.id === photo.id ? photo : existingPhoto
            )
          : [photo, ...existing]

        return {
          ...prev,
          [eventId]: updatedPhotos,
        }
      })

      if (shouldIncrementCount) {
        setEvents((prev) =>
          prev.map((event) => {
            if (event._id !== eventId) {
              return event
            }

            const currentCount =
              typeof event.guestPhotosCount === 'number' && Number.isFinite(event.guestPhotosCount)
                ? event.guestPhotosCount
                : 0

            return {
              ...event,
              guestPhotosCount: currentCount + 1,
            }
          })
        )
      }
    }

    const channel = supabase
      .channel('live-timeline-guest-photos')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'guest_photos',
          filter: 'timeline_event_id=not.is.null',
        },
        (payload) => {
          const record = payload.new as GuestPhotoRealtimeRecord
          if (record.moderation_status !== 'approved') {
            return
          }
          upsertApprovedPhoto(record)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'guest_photos',
          filter: 'timeline_event_id=not.is.null',
        },
        (payload) => {
          const newRecord = payload.new as GuestPhotoRealtimeRecord
          const oldRecord = payload.old as GuestPhotoRealtimeRecord | null
          if (
            newRecord.moderation_status !== 'approved' ||
            oldRecord?.moderation_status === 'approved'
          ) {
            return
          }
          upsertApprovedPhoto(newRecord)
        }
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    if (!autoUpdate || eventsRef.current.length === 0) {
      return
    }

    const interval = setInterval(() => {
      recalculate(eventsRef.current, photosRef.current)
    }, updateIntervalMs ?? 30_000)

    return () => clearInterval(interval)
  }, [autoUpdate, recalculate, updateIntervalMs])

  useEffect(() => {
    if (events.length > 0) {
      recalculate(events, photosByEvent)
    }
  }, [events, photosByEvent, recalculate])

  useEffect(() => {
    if (eventsRef.current.length > 0) {
      recalculate(eventsRef.current, photosByEvent)
    }
  }, [photosByEvent, recalculate])

  return useMemo(
    () => ({
      events,
      data,
      isLoading,
      error,
      refresh,
      lastUpdatedAt,
    }),
    [data, error, events, isLoading, lastUpdatedAt, refresh]
  )
}

export default useTimelineState
