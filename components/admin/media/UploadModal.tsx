'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'
import {
  Upload, Loader2, GalleryHorizontal, ChevronLeft, Newspaper, X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  GENERAL_IMAGE_TYPES, fileAcceptList, imageTypeLabel, validateImageFile,
} from '@/lib/media/image-rules'
import { uploadMedia } from '@/actions/media/upload'
import type { MediaContext as BaseMediaContext } from '@/types/app'

// 'carousel' is a valid DB enum value but the generated TS types lag behind
type MediaContext = BaseMediaContext | 'carousel'

// ── Image compression ──────────────────────────────────────────────────────────
async function compressImage(file: File, maxWidth = 1920, quality = 0.82): Promise<File> {
  if (file.type === 'image/gif') return file
  return new Promise((resolve) => {
    const img = new window.Image()
    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      let { width, height } = img
      if (width > maxWidth) {
        height = Math.round(height * (maxWidth / width))
        width = maxWidth
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) { resolve(file); return }
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) { resolve(file); return }
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), { type: 'image/webp' }))
        },
        'image/webp',
        quality,
      )
    }
    img.onerror = () => { URL.revokeObjectURL(objectUrl); resolve(file) }
    img.src = objectUrl
  })
}

// ── Types ──────────────────────────────────────────────────────────────────────
type Step = 'form' | 'copy'

// Contexts that accept multiple files at once
const MULTI_CONTEXTS: MediaContext[] = ['hero', 'gallery', 'admissions', 'page_content']

const CONTEXTS: { value: MediaContext; label: string }[] = [
  { value: 'hero',         label: 'Hero Slideshow' },
  { value: 'carousel',     label: 'Life at School' },
  { value: 'gallery',      label: 'Gallery' },
  { value: 'admissions',   label: 'Admissions' },
  { value: 'news',         label: 'News & Announcements' },
  { value: 'page_content', label: 'Page Content' },
  { value: 'profile',      label: 'Team Members Profile' },
]

const CONTEXT_SPECS: Partial<Record<MediaContext, { size: string; ratio: string; tip: string; hero?: string }>> = {
  hero: {
    size:  '2400 × 1350 px (min 1920 × 1080)',
    ratio: '16:9',
    tip:   'Landscape · Centre your subject · Avoid text near edges · High-res source for all devices',
    hero:  'These images appear as full-screen slides on the homepage hero section.',
  },
  carousel: {
    size:  '1200 × 800 px',
    ratio: '3:2',
    tip:   'Landscape · Showcase school life, activities, and events',
  },
  news: {
    size:  '1920 × 1080 px',
    ratio: '16:9',
    tip:   'Landscape · Keep key content centred · Text overlay will be added on the next step',
  },
}

// ── Drop zone ──────────────────────────────────────────────────────────────────
interface DropZoneProps {
  files:    File[]
  inputRef: React.RefObject<HTMLInputElement | null>
  accept:   string
  multiple?: boolean
  onChange:  (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemove?: (index: number) => void
  hint?:     string
}

function DropZone({ files, inputRef, accept, multiple, onChange, onRemove, hint }: DropZoneProps) {
  const hasFiles = files.length > 0

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={onChange}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-6 text-center hover:border-blue-900/40 hover:bg-blue-50/30 transition-colors"
      >
        {hasFiles && !multiple ? (
          <div className="text-sm">
            <p className="font-medium text-slate-700">{files[0].name}</p>
            <p className="text-slate-400 mt-0.5 text-xs">
              {(files[0].size / 1024 / 1024).toFixed(2)} MB · {files[0].type.split('/')[1]?.toUpperCase()}
            </p>
            <p className="text-blue-900 text-xs mt-1.5 underline underline-offset-2">Click to replace</p>
          </div>
        ) : (
          <div className="text-slate-400">
            <Upload className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-medium">
              {hasFiles ? 'Click to add more images' : multiple ? 'Click to choose images' : 'Click to choose a file'}
            </p>
            {hint && <p className="text-xs mt-1 text-slate-300">{hint}</p>}
          </div>
        )}
      </button>

      {/* File list — only for multi-select */}
      {multiple && hasFiles && (
        <ul className="space-y-1.5 max-h-44 overflow-y-auto pr-0.5">
          {files.map((f, i) => (
            <li key={i} className="flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-100 px-3 py-2">
              <span className="flex-1 truncate text-xs font-medium text-slate-700">{f.name}</span>
              <span className="text-xs text-slate-400 shrink-0">{(f.size / 1024 / 1024).toFixed(1)} MB</span>
              <button
                type="button"
                onClick={() => onRemove?.(i)}
                className="shrink-0 text-slate-400 hover:text-red-500 transition-colors"
                aria-label={`Remove ${f.name}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ── Main modal ─────────────────────────────────────────────────────────────────
interface Props {
  open:       boolean
  onClose:    () => void
  onUploaded: () => void
}

export default function UploadModal({ open, onClose, onUploaded }: Props) {
  const [pending,  setPending]  = useState(false)
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null)
  const [step,     setStep]     = useState<Step>('form')

  const [context,      setContext]      = useState<MediaContext>('carousel')
  const [altText,      setAltText]      = useState('')
  const [files,        setFiles]        = useState<File[]>([])
  const [slideTitle,   setSlideTitle]   = useState('')
  const [slideDesc,    setSlideDesc]    = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function reset() {
    setStep('form')
    setContext('carousel')
    setAltText('')
    setFiles([])
    setSlideTitle('')
    setSlideDesc('')
    setProgress(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  function handleClose() {
    if (pending) return
    reset()
    onClose()
  }

  const isSlideContext = context === 'carousel' || context === 'news'
  const isMultiContext = MULTI_CONTEXTS.includes(context)
  const isMultiUpload  = isMultiContext && files.length > 1
  const isNews         = context === 'news'
  const contextSpec    = CONTEXT_SPECS[context]

  const formReady = files.length > 0
  const copyReady = slideTitle.trim().length > 0 && slideDesc.trim().length > 0

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const incoming = Array.from(e.target.files ?? [])
    if (!incoming.length) return

    const valid: File[] = []
    for (const f of incoming) {
      const error = validateImageFile(f, GENERAL_IMAGE_TYPES)
      if (error) { toast.error(`${f.name}: ${error}`); continue }
      valid.push(f)
    }

    if (isMultiContext) {
      setFiles(prev => {
        const existing = new Set(prev.map(f => `${f.name}-${f.size}`))
        return [...prev, ...valid.filter(f => !existing.has(`${f.name}-${f.size}`))]
      })
    } else {
      setFiles(valid.slice(0, 1))
    }

    if (fileRef.current) fileRef.current.value = ''
  }

  function removeFile(index: number) {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  async function handlePrimary() {
    if (step === 'form' && isSlideContext) {
      setStep('copy')
      return
    }

    if (files.length === 0) return
    setPending(true)

    // Hero images get higher resolution and quality so Next.js has great source
    // material to serve to every device. Everything else uses smaller defaults.
    const [compressW, compressQ] = context === 'hero' ? [2400, 0.90] : [1920, 0.82]

    try {
      if (isMultiUpload) {
        const total = files.length
        let failed = 0
        for (let i = 0; i < files.length; i++) {
          setProgress({ done: i, total })
          const fd = new FormData()
          fd.set('file',     await compressImage(files[i], compressW, compressQ))
          fd.set('context',  context)
          fd.set('alt_text', altText || files[i].name.replace(/\.[^.]+$/, ''))
          const res = await uploadMedia(fd)
          if (!res.success) failed++
        }
        setProgress(null)
        if (failed === 0) {
          toast.success(`${total} image${total > 1 ? 's' : ''} uploaded`)
        } else {
          toast.warning(`${total - failed} of ${total} uploaded — ${failed} failed`)
        }
      } else {
        const fd = new FormData()
        fd.set('file',     await compressImage(files[0], compressW, compressQ))
        fd.set('context',  context)
        fd.set('alt_text', isSlideContext ? slideTitle : altText)
        if (isSlideContext) fd.set('caption', slideDesc)

        const res = await uploadMedia(fd)
        if (res.success) {
          toast.success('Image uploaded')
        } else {
          toast.error(res.error)
          return
        }
      }

      reset()
      onUploaded()
      onClose()
    } finally {
      setPending(false)
    }
  }

  const primaryLabel = progress
    ? `Uploading ${progress.done + 1} of ${progress.total}…`
    : step === 'form' && isSlideContext
      ? 'Next: Add Copy'
      : isMultiUpload
        ? `Upload ${files.length} Images`
        : 'Upload'

  const primaryReady = step === 'copy' ? copyReady : formReady

  return (
    <Dialog open={open} onOpenChange={o => { if (!o) handleClose() }}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 'copy'
              ? (isNews ? 'Add News Slide Copy' : 'Add Carousel Copy')
              : 'Upload Image'}
          </DialogTitle>
          <DialogDescription>
            {step === 'copy'
              ? 'Provide a headline and description for this slide. Both fields are required.'
              : 'Choose a category and select the image to upload.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-1">

          {/* ── Step 1: category + file ───────────────────────────────── */}
          {step === 'form' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select
                  value={context}
                  onValueChange={v => { setContext(v as MediaContext); setFiles([]) }}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CONTEXTS.map(c => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {contextSpec && (
                  <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2.5 space-y-1">
                    <div className="flex items-center gap-1.5">
                      {isNews
                        ? <Newspaper className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        : <GalleryHorizontal className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                      <span className="text-xs font-semibold text-blue-700">
                        Recommended: {contextSpec.size} ({contextSpec.ratio})
                      </span>
                    </div>
                    <p className="text-xs text-blue-600 pl-5">{contextSpec.tip}</p>
                    {contextSpec.hero && (
                      <p className="text-xs font-medium text-blue-700 pl-5 pt-0.5">
                        ★ {contextSpec.hero}
                      </p>
                    )}
                    {isSlideContext && (
                      <p className="text-xs text-blue-500 pl-5 pt-0.5">
                        You&apos;ll add a headline &amp; description on the next step.
                      </p>
                    )}
                  </div>
                )}

                {isMultiContext && (
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    You can select multiple images at once for this category.
                  </p>
                )}
              </div>

              {!isSlideContext && (
                <div className="space-y-1.5">
                  <Label htmlFor="alt-text">
                    Alt text{' '}
                    <span className="text-slate-400 font-normal">
                      (optional{isMultiContext ? ' — applied to all' : ''})
                    </span>
                  </Label>
                  <Input
                    id="alt-text"
                    placeholder="Describe the image for screen readers…"
                    value={altText}
                    onChange={e => setAltText(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <Label>
                  {isMultiContext
                    ? `Files${files.length > 0 ? ` (${files.length} selected)` : ''}`
                    : 'File'}
                </Label>
                <DropZone
                  files={files}
                  inputRef={fileRef}
                  accept={fileAcceptList(GENERAL_IMAGE_TYPES)}
                  multiple={isMultiContext}
                  onChange={handleFileChange}
                  onRemove={removeFile}
                  hint={`${imageTypeLabel(GENERAL_IMAGE_TYPES)} · Max 20 MB · compressed automatically`}
                />
              </div>
            </div>
          )}

          {/* ── Step 2: slide copy ────────────────────────────────────── */}
          {step === 'copy' && (
            <div className="space-y-4">
              {files[0] && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-500">
                  {isNews
                    ? <Newspaper className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    : <GalleryHorizontal className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                  <span className="truncate font-medium">{files[0].name}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="slide-title">
                  Headline <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="slide-title"
                  placeholder={isNews ? 'e.g. Term 1 Academic Results' : 'e.g. Creative Expression'}
                  value={slideTitle}
                  onChange={e => setSlideTitle(e.target.value)}
                  autoFocus
                />
                <p className="text-xs text-slate-400">
                  {isNews
                    ? 'Main headline shown over the news image.'
                    : 'Large title overlaid on the carousel slide.'}
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="slide-desc">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="slide-desc"
                  placeholder={isNews
                    ? 'e.g. Congratulations to all students for outstanding performance this term.'
                    : 'e.g. Nurturing artistic talents through hands-on activities.'}
                  value={slideDesc}
                  onChange={e => setSlideDesc(e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-slate-400">Subtitle shown beneath the headline.</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="pt-2">
          {step === 'copy' ? (
            <Button variant="outline" onClick={() => setStep('form')} disabled={pending}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          ) : (
            <Button variant="outline" onClick={handleClose} disabled={pending}>
              Cancel
            </Button>
          )}
          <Button
            className="bg-blue-900 hover:bg-blue-800 active:scale-95 transition-all"
            onClick={handlePrimary}
            disabled={pending || !primaryReady}
          >
            {pending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {primaryLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
