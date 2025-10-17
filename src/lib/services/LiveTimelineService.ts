import { addMinutes, differenceInMinutes, isAfter, isBefore } from 'date-fns'
import type {
  LiveTimelineData,
  TimelineEventPhoto,
  TimelineEventState,
  WeddingTimelineEvent,
} from '@/types/wedding'

const DEFAULT_INTERVAL_MS = 30_000

export class LiveTimelineService {
  /**
   * Calculate full live timeline state for a list of events at a given moment.
   */
  static calculateTimelineState(
    events: WeddingTimelineEvent[],
    currentTime: Date = new Date(),
    photosByEvent: Record<string, TimelineEventPhoto[]> = {}
  ): LiveTimelineData {
    if (events.length === 0) {
      return {
        events: [],
        currentEvent: undefined,
        nextEvent: undefined,
        overallProgress: 0,
        totalEvents: 0,
        completedEvents: 0,
        currentTime: currentTime.toISOString(),
        weddingStartTime: currentTime.toISOString(),
        weddingEndTime: currentTime.toISOString(),
      }
    }

    const sortedEvents = [...events].sort((a, b) => {
      if (a.displayOrder !== b.displayOrder) {
        return a.displayOrder - b.displayOrder
      }
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    })

    const weddingStart = new Date(sortedEvents[0].startTime)
    const weddingEnd = sortedEvents.reduce((latest, event) => {
      const end = this.resolveEndTime(event)
      return isAfter(end, latest) ? end : latest
    }, weddingStart)

    let currentEvent: TimelineEventState | undefined
    let nextEvent: TimelineEventState | undefined
    let completedEvents = 0
    let capturedNext = false

    const eventStates: TimelineEventState[] = sortedEvents.map((event) => {
      const safeEvent: WeddingTimelineEvent = {
        ...event,
        guestPhotosCount:
          typeof event.guestPhotosCount === 'number' && Number.isFinite(event.guestPhotosCount)
            ? event.guestPhotosCount
            : 0,
      }

      const start = new Date(safeEvent.startTime)
      const end = this.resolveEndTime(safeEvent)
      const status = this.getEventStatus(safeEvent, currentTime)

      let timeUntilStart: number | undefined
      let timeRemaining: number | undefined
      let progressPercentage: number | undefined

      if (status === 'upcoming') {
        timeUntilStart = Math.max(
          0,
          Math.ceil(differenceInMinutes(start, currentTime))
        )
      }

      if (status === 'happening_now') {
        const minutesRemaining = differenceInMinutes(end, currentTime)
        timeRemaining = Math.max(0, minutesRemaining)

        const totalDuration = differenceInMinutes(end, start)
        const elapsed = totalDuration - timeRemaining
        progressPercentage = totalDuration > 0
          ? Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))
          : undefined
      }

      if (status === 'completed') {
        completedEvents += 1
      }

      const state: TimelineEventState = {
        event: safeEvent,
        status,
        timeUntilStart,
        timeRemaining,
        progressPercentage,
        isNext: false,
        guestPhotos: photosByEvent[safeEvent._id] ?? [],
      }

      if (status === 'happening_now') {
        currentEvent = state
      } else if (status === 'upcoming' && !capturedNext) {
        state.isNext = true
        capturedNext = true
        nextEvent = state
      }

      return state
    })

    const overallProgress = this.calculateOverallProgress(
      weddingStart,
      weddingEnd,
      currentTime
    )

    return {
      events: eventStates,
      currentEvent,
      nextEvent,
      overallProgress,
      totalEvents: sortedEvents.length,
      completedEvents,
      currentTime: currentTime.toISOString(),
      weddingStartTime: weddingStart.toISOString(),
      weddingEndTime: weddingEnd.toISOString(),
    }
  }

  /**
   * Determine the status of a single event given current time.
   */
  static getEventStatus(
    event: WeddingTimelineEvent,
    currentTime: Date = new Date()
  ): TimelineEventState['status'] {
    const start = new Date(event.startTime)
    const end = this.resolveEndTime(event)

    if (isBefore(currentTime, start)) {
      return 'upcoming'
    }

    if (isAfter(currentTime, end)) {
      return 'completed'
    }

    return 'happening_now'
  }

  /**
   * Start an interval that recalculates timeline state and passes the new value
   * to the provided callback. Returns a cleanup function.
   */
  static startAutoUpdate(
    events: WeddingTimelineEvent[],
    onUpdate: (data: LiveTimelineData) => void,
    intervalMs: number = DEFAULT_INTERVAL_MS,
    photosByEvent: Record<string, TimelineEventPhoto[]> = {}
  ): () => void {
    const tick = () => {
      const data = this.calculateTimelineState(events, new Date(), photosByEvent)
      onUpdate(data)
    }

    const interval = setInterval(tick, intervalMs)
    tick()

    return () => clearInterval(interval)
  }

  private static resolveEndTime(event: WeddingTimelineEvent): Date {
    if (event.endTime) {
      return new Date(event.endTime)
    }

    const start = new Date(event.startTime)
    const duration = Number.isFinite(event.estimatedDuration)
      ? event.estimatedDuration
      : 0

    return duration > 0 ? addMinutes(start, duration) : start
  }

  private static calculateOverallProgress(
    start: Date,
    end: Date,
    current: Date
  ): number {
    if (!isBefore(start, end)) {
      return 100
    }

    if (isBefore(current, start)) {
      return 0
    }

    if (isAfter(current, end)) {
      return 100
    }

    const totalMinutes = differenceInMinutes(end, start)
    const elapsedMinutes = differenceInMinutes(current, start)

    if (totalMinutes <= 0) {
      return 100
    }

    return Math.min(100, Math.max(0, (elapsedMinutes / totalMinutes) * 100))
  }
}

export default LiveTimelineService
