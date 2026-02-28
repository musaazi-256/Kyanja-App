import { Suspense } from 'react'
import type { Metadata } from 'next'
import { requirePermission } from '@/lib/rbac/check'
import { getAllDownloads } from '@/lib/db/downloads'
import DownloadsManager from '@/components/admin/downloads/DownloadsManager'

export const metadata: Metadata = { title: 'Download Center' }

export default async function DownloadsPage() {
  await requirePermission('downloads:read')
  const downloads = await getAllDownloads()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Download Center</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Manage downloadable files. Upload as drafts and publish when ready.
        </p>
      </div>
      <Suspense>
        <DownloadsManager initialDownloads={downloads} />
      </Suspense>
    </div>
  )
}
