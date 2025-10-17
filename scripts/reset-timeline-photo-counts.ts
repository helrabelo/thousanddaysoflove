import 'dotenv/config'
import { writeClient } from '@/sanity/lib/client'

async function resetTimelineCounts() {
  const events = await writeClient.fetch<{ _id: string }[]>(`
    *[_type == "weddingTimelineEvent"]{ _id }
  `)

  if (!events.length) {
    console.log('No timeline events found.')
    return
  }

  const tx = writeClient.transaction()
  events.forEach((event) => {
    tx.patch(event._id, (p) => p.set({ guestPhotosCount: 0 }))
  })

  await tx.commit()
  console.log('Timeline guest photo counts reset to 0.')
}

resetTimelineCounts().catch((error) => {
  console.error('Failed to reset timeline counts:', error)
  process.exit(1)
})
