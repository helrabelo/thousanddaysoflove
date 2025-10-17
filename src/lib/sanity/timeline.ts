import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client'
import type { WeddingTimelineEvent } from '@/types/wedding'

export const TIMELINE_EVENTS_QUERY = groq`
  *[_type == "weddingTimelineEvent" && isActive == true]
    | order(displayOrder asc, startTime asc) {
      _id,
      title,
      description,
      startTime,
      endTime,
      estimatedDuration,
      icon,
      colorGradient,
      location,
      eventType,
      allowPhotoUploads,
      photoUploadPrompt,
      isHighlight,
      showOnTVDisplay,
      displayOrder,
      isActive,
      sendNotifications,
      notificationLeadTime,
      guestPhotosCount,
      viewCount
    }
`

export async function fetchTimelineEvents(): Promise<WeddingTimelineEvent[]> {
  const events = await client.fetch<WeddingTimelineEvent[]>(TIMELINE_EVENTS_QUERY)
  return events.map((event) => ({
    ...event,
    photoUploadPrompt: event.photoUploadPrompt ?? undefined,
    endTime: event.endTime ?? undefined,
    notificationLeadTime: event.notificationLeadTime ?? undefined,
  }))
}
