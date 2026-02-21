import { Suspense } from 'react'
import { getMediaFiles } from '@/lib/db/media'
import { requirePermission } from '@/lib/rbac/check'
import MediaLibrary from '@/components/admin/media/MediaLibrary'
import type { Metadata } from 'next'
import type { MediaContext } from '@/types/app'

export const metadata: Metadata = { title: 'Media Library' }

interface PageProps {
  searchParams: Promise<{ context?: string; page?: string; search?: string }>
}

export default async function MediaPage({ searchParams }: PageProps) {
  await requirePermission('media:read')
  const params = await searchParams

  const { data: files, meta } = await getMediaFiles({
    context:  params.context as MediaContext | undefined,
    search:   params.search,
    page:     params.page ? parseInt(params.page) : 1,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Media Library</h1>
        <p className="text-slate-500 text-sm mt-0.5">{meta.total} files</p>
      </div>
      <Suspense>
        <MediaLibrary initialFiles={files} meta={meta} />
      </Suspense>
    </div>
  )
}
