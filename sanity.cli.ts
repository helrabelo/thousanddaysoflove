/**
 * Sanity CLI Configuration
 */

import { defineCliConfig } from 'sanity/cli'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },

  /**
   * Enable auto-updates for studios
   * (IP allowlisting required for production)
   */
  autoUpdates: true,
})
