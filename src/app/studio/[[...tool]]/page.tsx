/**
 * Sanity Studio Route
 *
 * Renders the Sanity Studio interface at /studio
 * Accessible for content management and editing.
 *
 * IMPORTANT: This route is fully dynamic and client-only.
 * It will not be pre-rendered during build.
 */

'use client'

import { NextStudio } from 'next-sanity/studio'
import { useEffect, useState } from 'react'
import type { Config } from 'sanity'

export default function StudioPage() {
  const [config, setConfig] = useState<Config | null>(null)

  useEffect(() => {
    // Dynamically import config at runtime only
    import('../../../../sanity.config').then((mod) => {
      setConfig(mod.default as Config)
    })
  }, [])

  if (!config) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading Sanity Studio...</p>
      </div>
    )
  }

  return <NextStudio config={config} />
}
