/**
 * Admin Photo Moderation Dashboard
 * View and moderate all guest-uploaded photos
 */

import { createAdminClient } from '@/lib/supabase/server'
import { getPublicUrl } from '@/lib/supabase/storage-server'
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

  const params = await searchParams
  const statusFilter = params.status || 'all'
  const phaseFilter = params.phase || 'all'
  const searchQuery = params.search || ''

  // Fetch photos with admin client (bypasses RLS)
  const supabase = createAdminClient()

  let query = supabase
    .from('guest_photos')
    .select('*, guest:simple_guests(name)')
    .eq('is_deleted', false)
    .order('uploaded_at', { ascending: false })

  // Apply filters
  if (statusFilter !== 'all') {
    query = query.eq('moderation_status', statusFilter)
  }

  if (phaseFilter !== 'all') {
    query = query.eq('upload_phase', phaseFilter)
  }

  if (searchQuery) {
    query = query.ilike('guest_name', `%${searchQuery}%`)
  }

  const { data: photos, error } = await query

  if (error) {
    console.error('Error fetching photos:', error)
    return (
      <div className="min-h-screen bg-[#F8F6F3] p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-serif text-[#2C2C2C] mb-4">
            Erro ao Carregar Fotos
          </h1>
          <p className="text-[#4A4A4A]">{error.message}</p>
        </div>
      </div>
    )
  }

  // Add public URLs to photos
  const photosWithUrls = (photos || []).map((photo) => ({
    ...photo,
    public_url: getPublicUrl(photo.storage_path, photo.storage_bucket),
  }))

  // Calculate stats
  const stats = {
    total: photosWithUrls.length,
    pending: photosWithUrls.filter((p) => p.moderation_status === 'pending')
      .length,
    approved: photosWithUrls.filter((p) => p.moderation_status === 'approved')
      .length,
    rejected: photosWithUrls.filter((p) => p.moderation_status === 'rejected')
      .length,
  }

  return (
    <div className="min-h-screen bg-[#F8F6F3]">
      {/* Header */}
      <div className="bg-white border-b border-[#E8E6E3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-serif text-[#2C2C2C] mb-2">
                Moderação de Fotos
              </h1>
              <p className="text-[#4A4A4A]">
                Gerencie todas as fotos enviadas pelos convidados
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              <StatBadge
                label="Total"
                count={stats.total}
                color="gray"
              />
              <StatBadge
                label="Pendente"
                count={stats.pending}
                color="yellow"
              />
              <StatBadge
                label="Aprovado"
                count={stats.approved}
                color="green"
              />
              <StatBadge
                label="Rejeitado"
                count={stats.rejected}
                color="red"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Moderation Grid (Client Component) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PhotoModerationGrid
          photos={photosWithUrls}
          initialFilters={{
            status: statusFilter,
            phase: phaseFilter,
            search: searchQuery,
          }}
        />
      </div>
    </div>
  )
}

interface StatBadgeProps {
  label: string
  count: number
  color: 'gray' | 'yellow' | 'green' | 'red'
}

function StatBadge({ label, count, color }: StatBadgeProps) {
  const colorClasses = {
    gray: 'bg-gray-100 text-gray-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
  }

  return (
    <div className="text-center">
      <div
        className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${colorClasses[color]} mb-2`}
      >
        <span className="text-2xl font-bold">{count}</span>
      </div>
      <p className="text-sm text-[#4A4A4A]">{label}</p>
    </div>
  )
}
