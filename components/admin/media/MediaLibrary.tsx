'use client'

import { useState, useTransition, useRef } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'
import { uploadMedia, deleteMedia } from '@/actions/media/upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import {
  Upload, Trash2, Loader2, ImageIcon,
  LayoutGrid, LayoutList, Search,
  ChevronLeft, ChevronRight,
} from 'lucide-react'
import type { MediaFile, PaginationMeta, MediaContext } from '@/types/app'

const CONTEXTS: { value: MediaContext; label: string }[] = [
  { value: 'gallery',      label: 'Gallery' },
  { value: 'admissions',   label: 'Admissions' },
  { value: 'news',         label: 'News' },
  { value: 'page_content', label: 'Page Content' },
  { value: 'profile',      label: 'Profile' },
]

function formatBytes(bytes: number | null | undefined): string {
  if (!bytes) return '—'
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

interface Props {
  initialFiles: MediaFile[]
  meta: PaginationMeta
}

export default function MediaLibrary({ initialFiles, meta }: Props) {
  const [files]              = useState<MediaFile[]>(initialFiles)
  const [view, setView]      = useState<'grid' | 'list'>('grid')
  const [uploading, start]   = useTransition()
  const [toDelete, setToDelete]       = useState<MediaFile | null>(null)
  const [altText, setAltText]         = useState('')
  const [uploadContext, setUploadContext] = useState<MediaContext>('gallery')
  const [searchDraft, setSearchDraft] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router       = useRouter()
  const searchParams = useSearchParams()

  function updateParams(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, val] of Object.entries(updates)) {
      if (val !== undefined) params.set(key, val)
      else params.delete(key)
    }
    router.push(`?${params.toString()}`)
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const fd = new FormData()
    fd.set('file', file)
    fd.set('context', uploadContext)
    fd.set('alt_text', altText)

    start(async () => {
      const res = await uploadMedia(fd)
      if (fileInputRef.current) fileInputRef.current.value = ''
      if (res.success) {
        toast.success('Image uploaded')
        setAltText('')
        router.refresh()
      } else {
        toast.error(res.error)
      }
    })
  }

  async function handleDelete() {
    if (!toDelete) return
    start(async () => {
      const res = await deleteMedia(toDelete.id)
      if (res.success) {
        toast.success('File deleted')
        setToDelete(null)
        router.refresh()
      } else {
        toast.error(res.error)
      }
    })
  }

  const activeContext = searchParams.get('context') as MediaContext | null
  const activeSearch  = searchParams.get('search') ?? ''

  return (
    <div className="space-y-5">

      {/* ── Upload panel ───────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-1.5">
              <Label>Context</Label>
              <Select value={uploadContext} onValueChange={(v) => setUploadContext(v as MediaContext)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTEXTS.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="alt-text">Alt text</Label>
              <Input
                id="alt-text"
                placeholder="Describe the image…"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                className="w-64"
              />
            </div>

            <Label
              htmlFor="file-upload"
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-md text-sm font-medium hover:bg-[#16305a] transition-colors"
            >
              {uploading
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Upload className="w-4 h-4" />}
              {uploading ? 'Uploading…' : 'Upload Image'}
            </Label>
            <input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Toolbar: search / filter / view toggle ─────────────── */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              updateParams({ search: searchDraft || undefined, page: undefined })
            }}
            className="relative"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <Input
              placeholder="Search filename…"
              value={searchDraft}
              onChange={(e) => {
                setSearchDraft(e.target.value)
                if (e.target.value === '') updateParams({ search: undefined, page: undefined })
              }}
              className="pl-9 w-52"
            />
          </form>

          {/* Context filter */}
          <Select
            value={activeContext ?? 'all'}
            onValueChange={(v) =>
              updateParams({ context: v === 'all' ? undefined : v, page: undefined })
            }
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All contexts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All contexts</SelectItem>
              {CONTEXTS.map((c) => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(activeSearch || activeContext) && (
            <button
              onClick={() => {
                setSearchDraft('')
                updateParams({ search: undefined, context: undefined, page: undefined })
              }}
              className="text-sm text-slate-500 hover:text-slate-800 underline-offset-2 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* View toggle */}
        <div className="flex rounded-md border overflow-hidden shrink-0">
          <button
            onClick={() => setView('grid')}
            className={`px-3 py-1.5 flex items-center gap-1.5 text-sm transition-colors ${
              view === 'grid'
                ? 'bg-[#1e3a5f] text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Grid</span>
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-3 py-1.5 flex items-center gap-1.5 text-sm transition-colors border-l ${
              view === 'list'
                ? 'bg-[#1e3a5f] text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <LayoutList className="w-4 h-4" />
            <span className="hidden sm:inline">List</span>
          </button>
        </div>
      </div>

      {/* ── Empty state ────────────────────────────────────────── */}
      {files.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-25" />
          <p className="font-medium">No images found</p>
          <p className="text-sm mt-1">
            {activeSearch || activeContext
              ? 'Try clearing your filters.'
              : 'Upload your first image above.'}
          </p>
        </div>

      ) : view === 'grid' ? (
        /* ── Grid view ─────────────────────────────────────────── */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="group relative aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shadow-sm"
            >
              {file.public_url ? (
                <Image
                  src={`${file.public_url}?width=300&height=300`}
                  alt={file.alt_text ?? file.file_name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <ImageIcon className="w-8 h-8 text-slate-400" />
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs text-center font-medium line-clamp-2 w-full px-1">
                  {file.file_name}
                </p>
                <p className="text-white/70 text-[10px]">{formatBytes(file.file_size)}</p>
                <Button
                  size="icon"
                  variant="destructive"
                  className="w-8 h-8 mt-1"
                  onClick={() => setToDelete(file)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Context badge */}
              {file.context && (
                <Badge className="absolute top-1.5 left-1.5 text-[10px] px-1.5 py-0 bg-black/50 text-white border-0 capitalize pointer-events-none">
                  {file.context.replace('_', ' ')}
                </Badge>
              )}
            </div>
          ))}
        </div>

      ) : (
        /* ── List view ─────────────────────────────────────────── */
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600 w-14">Preview</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">File</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600 hidden sm:table-cell w-32">Context</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell w-24">Size</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600 hidden lg:table-cell w-36">Uploaded</th>
                <th className="w-12" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {files.map((file) => (
                <tr key={file.id} className="bg-white hover:bg-slate-50 transition-colors">
                  {/* Thumbnail */}
                  <td className="px-4 py-2.5">
                    <div className="relative w-11 h-11 rounded overflow-hidden bg-slate-100 shrink-0">
                      {file.public_url ? (
                        <Image
                          src={`${file.public_url}?width=88&height=88`}
                          alt={file.alt_text ?? file.file_name}
                          fill
                          className="object-cover"
                          sizes="44px"
                        />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-slate-400 absolute inset-0 m-auto" />
                      )}
                    </div>
                  </td>

                  {/* Name + alt text */}
                  <td className="px-4 py-2.5 min-w-0">
                    <p className="font-medium text-slate-800 truncate max-w-[220px]" title={file.file_name}>
                      {file.file_name}
                    </p>
                    {file.alt_text && (
                      <p className="text-slate-400 text-xs truncate max-w-[220px] mt-0.5" title={file.alt_text}>
                        {file.alt_text}
                      </p>
                    )}
                  </td>

                  {/* Context */}
                  <td className="px-4 py-2.5 hidden sm:table-cell">
                    {file.context && (
                      <Badge variant="secondary" className="capitalize text-xs font-normal">
                        {file.context.replace('_', ' ')}
                      </Badge>
                    )}
                  </td>

                  {/* Size */}
                  <td className="px-4 py-2.5 text-slate-500 hidden md:table-cell tabular-nums">
                    {formatBytes(file.file_size)}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-2.5 text-slate-500 hidden lg:table-cell">
                    {formatDate(file.created_at)}
                  </td>

                  {/* Delete */}
                  <td className="px-3 py-2.5 text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-8 h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setToDelete(file)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Pagination ─────────────────────────────────────────── */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500 pt-1">
          <span>
            Page {meta.page} of {meta.totalPages}
            <span className="hidden sm:inline"> · {meta.total} files</span>
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page <= 1}
              onClick={() => updateParams({ page: String(meta.page - 1) })}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page >= meta.totalPages}
              onClick={() => updateParams({ page: String(meta.page + 1) })}
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Delete confirm dialog (single instance) ────────────── */}
      <Dialog open={!!toDelete} onOpenChange={(open) => { if (!open) setToDelete(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete image?</DialogTitle>
            <DialogDescription>
              <span className="font-medium text-slate-700">&quot;{toDelete?.file_name}&quot;</span> will be
              removed from the media library. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToDelete(null)} disabled={uploading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={uploading}>
              {uploading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
