'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Upload, Pencil, Trash2, Globe, EyeOff, ExternalLink,
  FileUp, Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { setDownloadPublished, deleteDownload } from '@/actions/downloads'
import { getDownloadIcon, formatFileSize } from '@/lib/downloads/icons'
import UploadDownloadModal from './UploadDownloadModal'
import EditDownloadModal from './EditDownloadModal'
import type { Download } from '@/types/app'

interface Props {
  initialDownloads: Download[]
}

export default function DownloadsManager({ initialDownloads }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const [downloads, setDownloads] = useState<Download[]>(initialDownloads)
  const [uploadOpen, setUploadOpen]   = useState(false)
  const [editing,    setEditing]      = useState<Download | null>(null)
  const [busyId,     setBusyId]       = useState<string | null>(null)

  function refresh() {
    router.refresh()
  }

  function handleUploaded() {
    refresh()
  }

  function handlePublishToggle(dl: Download) {
    setBusyId(dl.id)
    startTransition(async () => {
      const res = await setDownloadPublished(dl.id, !dl.published)
      if (res.success) {
        toast.success(dl.published ? 'Unpublished' : 'Published')
        setDownloads((prev) =>
          prev.map((d) => d.id === dl.id ? { ...d, published: !d.published } : d)
        )
      } else {
        toast.error(res.error)
      }
      setBusyId(null)
    })
  }

  function handleDelete(dl: Download) {
    if (!confirm(`Delete "${dl.name}"? This cannot be undone.`)) return
    setBusyId(dl.id)
    startTransition(async () => {
      const res = await deleteDownload(dl.id)
      if (res.success) {
        toast.success('Deleted')
        setDownloads((prev) => prev.filter((d) => d.id !== dl.id))
      } else {
        toast.error(res.error)
      }
      setBusyId(null)
    })
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-500">{downloads.length} file{downloads.length !== 1 ? 's' : ''}</p>
        <Button
          onClick={() => setUploadOpen(true)}
          className="bg-[#1e3a5f] hover:bg-[#16305a] gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload File
        </Button>
      </div>

      {/* Empty state */}
      {downloads.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
          <FileUp className="w-10 h-10 mb-3 opacity-40" />
          <p className="font-medium text-slate-500">No files yet</p>
          <p className="text-sm mt-1">Upload a file to get started</p>
        </div>
      )}

      {/* Download list */}
      {downloads.length > 0 && (
        <div className="space-y-3">
          {downloads.map((dl) => {
            const { Icon, color } = getDownloadIcon(dl.icon)
            const busy = busyId === dl.id && pending

            return (
              <div
                key={dl.id}
                className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Icon */}
                <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center shadow-sm ${color}`}>
                  <Icon className="w-6 h-6" />
                </div>

                {/* Info */}
                <div className="grow min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <p className="font-semibold text-slate-900 truncate">{dl.name}</p>
                    <Badge
                      variant={dl.published ? 'default' : 'secondary'}
                      className={dl.published
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-100'
                      }
                    >
                      {dl.published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>

                  {dl.subcopy && (
                    <p className="text-sm text-slate-500 line-clamp-1 mb-1">{dl.subcopy}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-400 font-medium">
                    <span>{dl.file_name}</span>
                    <span>·</span>
                    <span>{formatFileSize(dl.file_size)}</span>
                    <span>·</span>
                    <span>
                      {new Date(dl.updated_at).toLocaleDateString('en-UG', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* View file */}
                  <a
                    href={dl.public_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
                    title="Open file"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  {/* Edit */}
                  <button
                    onClick={() => setEditing(dl)}
                    className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  {/* Publish / Unpublish */}
                  <button
                    onClick={() => handlePublishToggle(dl)}
                    disabled={busy}
                    className={[
                      'w-9 h-9 rounded-lg border flex items-center justify-center transition-colors',
                      dl.published
                        ? 'border-amber-200 text-amber-600 hover:bg-amber-50'
                        : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50',
                    ].join(' ')}
                    title={dl.published ? 'Unpublish' : 'Publish'}
                  >
                    {busy
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : dl.published
                        ? <EyeOff className="w-4 h-4" />
                        : <Globe className="w-4 h-4" />
                    }
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(dl)}
                    disabled={busy}
                    className="w-9 h-9 rounded-lg border border-red-100 flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    {busy
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Trash2 className="w-4 h-4" />
                    }
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modals */}
      <UploadDownloadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={handleUploaded}
      />

      {editing && (
        <EditDownloadModal
          download={editing}
          open={!!editing}
          onClose={() => setEditing(null)}
          onSaved={refresh}
        />
      )}
    </>
  )
}
