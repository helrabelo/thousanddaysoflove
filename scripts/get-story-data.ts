import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

async function main() {
  const phases = await client.fetch(`*[_type == "storyPhase"] | order(displayOrder asc)`)
  const moments = await client.fetch(`*[_type == "storyMoment"] | order(displayOrder asc){..., phase->{_id, title}}`)

  console.log(JSON.stringify({ phases, moments }, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
