import 'dotenv/config'
import { writeClient } from '@/sanity/lib/client'
import { createAdminClient } from '@/lib/supabase/server'

async function backfillTimelinePhotoCounts() {
  console.log('Backfilling guest photo counts per timeline event...')

  const supabase = createAdminClient()
  const { data: events, error: eventsError } = await supabase
    .from('guest_photos')
    .select('timeline_event_id, count:count(*)')
    .eq('moderation_status', 'approved')
    .eq('is_deleted', false)
    .not('timeline_event_id', 'is', null)
    .group('timeline_event_id')

  if (eventsError) {
    throw eventsError
  }

  const transaction = writeClient.transaction()

  events?.forEach((event) => {
    transaction.patch(event.timeline_event_id, (p) =>
      p.set({ guestPhotosCount: event.count ?? 0 })
    )
  })

  await transaction.commit()
  console.log('Backfill complete.')
}

backfillTimelinePhotoCounts().catch((error) => {
  console.error('Failed to backfill timeline photo counts:', error)
  process.exit(1)
})
