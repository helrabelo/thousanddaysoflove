/**
 * Admin Photo Moderation Dashboard
 * View and moderate all guest-uploaded photos
 */

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import PhotoModerationGrid from '@/components/admin/PhotoModerationGrid'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{
    status?: string
    phase?: string
    search?: string
  }>
}

export default async function AdminPhotosPage({ searchParams }: PageProps) {
  // Check admin authentication
  const cookieStore = await cookies()
  const adminSession = cookieStore.get('admin_session')?.value

  if (!adminSession) {
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
