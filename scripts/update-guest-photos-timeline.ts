import 'dotenv/config'
import { writeClient } from '@/sanity/lib/client'

async function resetGuestPhotoCounts() {
  console.log('Resetting guest photo counts on timeline events...')

  const events = await writeClient.fetch<{ _id: string }[]>(`
    *[_type == "weddingTimelineEvent"]{ _id }
  `)

  if (!events.length) {
    console.log('No timeline events found, skipping reset.')
    return
  }

  const transaction = writeClient.transaction()
  events.forEach((event) => {
    transaction.patch(event._id, (p) => p.set({ guestPhotosCount: 0, viewCount: 0 }))
  })

  await transaction.commit()
  console.log('Counts reset completed.')
}

resetGuestPhotoCounts().catch((error) => {
  console.error('Failed to reset counts:', error)
  process.exit(1)
})
