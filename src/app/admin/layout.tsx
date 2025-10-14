/**
 * Admin Layout
 * Wraps all admin pages with navigation header
 */

import AdminHeader from '@/components/admin/AdminHeader'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AdminHeader />
      {children}
    </>
  )
}
