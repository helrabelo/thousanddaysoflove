/**
 * Admin Photo Moderation Dashboard
 * View and moderate all guest-uploaded photos
 */

import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/auth/adminAuth'
import PhotoModerationGrid from '@/components/admin/PhotoModerationGrid'

export const dynamic = 'force-dynamic'

export default async function AdminPhotosPage() {
  // Check admin authentication
  if (!(await isAdminAuthenticated())) {
    redirect('/admin/login')
  }

  // Component now handles all data fetching via API
  return (
    <PhotoModerationGrid
      photos={[]}
      initialFilters={{
        status: 'pending',
        phase: 'all',
        search: '',
      }}
    />
  )
}
