'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'
import {
  Upload, Loader2, ImageIcon, Monitor, Smartphone, Layers,
  GalleryHorizontal, ChevronLeft, Newspaper, X,
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
  GENERAL_IMAGE_TYPES, HERO_IMAGE_TYPES, fileAcceptList, imageTypeLabel, validateImageFile,
} from '@/lib/media/image-rules'
import { uploadMedia } from '@/actions/media/upload'
import { uploadHeroImages } from '@/actions/settings/hero'
import type { MediaContext as BaseMediaContext } from '@/types/app'

// ── Image compression ──────────────────────────────────────────────────────────
/** Re-encodes an image as WebP at ≤1920 px wide and 82 % quality.
 *  GIFs are skipped (animation would be destroyed by canvas). */
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
type MediaContext = BaseMediaContext | 'carousel'
type UploadType  = 'general' | 'hero'
type HeroVariant = 'desktop' | 'mobile' | 'both'
type Step        = 'form' | 'copy'

// Contexts that allow selecting multiple files at once
const MULTI_CONTEXTS: MediaContext[] = ['gallery', 'admissions', 'page_content']

const CONTEXTS: { value: MediaContext; label: string }[] = [
  { value: 'carousel',     label: 'Carousel' },
  { value: 'gallery',      label: 'Gallery' },
  { value: 'admissions',   label: 'Admissions' },
  { value: 'news',         label: 'News & Announcements' },
  { value: 'page_content', label: 'Page Content' },
  { value: 'profile',      label: 'Profile' },
]

const HERO_VARIANTS: { value: HeroVariant; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'desktop', label: 'Desktop', icon: Monitor    },
  { value: 'mobile',  label: 'Mobile',  icon: Smartphone },
  { value: 'both',    label: 'Both',    icon: Layers     },
]

const CONTEXT_SPECS: Partial<Record<MediaContext, { size: string; ratio: string; tip: string }>> = {
  carousel: {
    size:  '1920 × 1080 px',
    ratio: '16:9',
    tip:   'Landscape · Centre your subject · Avoid text near the edges',
  },
  news: {
    size:  '1920 × 1080 px',
    ratio: '16:9',
    tip:   'Landscape · Keep key content centred · Text overlay will be added on the next step',
  },
}

// ── Drop zone ──────────────────────────────────────────────────────────────────
interface DropZoneProps {
  files: File[]
  inputRef: React.RefObject<HTMLInputElement | null>
  accept: string
  multiple?: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemove?: (index: number) => void
  hint?: string
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

      {/* File list — only shown for multi-select */}
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
  open: boolean
  onClose: () => void
  onUploaded: () => void
}

export default function UploadModal({ open, onClose, onUploaded }: Props) {
  const [pending,  setPending]  = useState(false)
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null)

  const [step,       setStep]       = useState<Step>('form')
  const [uploadType, setUploadType] = useState<UploadType>('general')

  // General media state
  const [context,      setContext]      = useState<MediaContext>('carousel')
  const [altText,      setAltText]      = useState('')
  const [generalFiles, setGeneralFiles] = useState<File[]>([])
  const generalRef = useRef<HTMLInputElement>(null)

  // Slide copy fields
  const [slideTitle, setSlideTitle] = useState('')
  const [slideDesc,  setSlideDesc]  = useState('')

  // Hero state
  const [heroVariant, setHeroVariant] = useState<HeroVariant>('desktop')
  const [desktopFile, setDesktopFile] = useState<File | null>(null)
  const [mobileFile,  setMobileFile]  = useState<File | null>(null)
  const desktopRef = useRef<HTMLInputElement>(null)
  const mobileRef  = useRef<HTMLInputElement>(null)

  function reset() {
    setStep('form')
    setUploadType('general')
    setContext('carousel')
    setAltText('')
    setGeneralFiles([])
    setSlideTitle('')
    setSlideDesc('')
    setHeroVariant('desktop')
    setDesktopFile(null)
    setMobileFile(null)
    setProgress(null)
    if (generalRef.current) generalRef.current.value = ''
    if (desktopRef.current) desktopRef.current.value = ''
    if (mobileRef.current)  mobileRef.current.value  = ''
  }

  function handleClose() {
    if (pending) return
    reset()
    onClose()
  }

  const isSlideContext  = uploadType === 'general' && (context === 'carousel' || context === 'news')
  const isMultiContext  = uploadType === 'general' && MULTI_CONTEXTS.includes(context as MediaContext)
  const isMultiUpload   = isMultiContext && generalFiles.length > 1

  const formReady = uploadType === 'general'
    ? generalFiles.length > 0
    : heroVariant === 'desktop' ? !!desktopFile
    : heroVariant === 'mobile'  ? !!mobileFile
    : !!(desktopFile || mobileFile)

  const copyReady = slideTitle.trim().length > 0 && slideDesc.trim().length > 0

  function handleGeneralFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const incoming = Array.from(e.target.files ?? [])
    if (!incoming.length) return

    const valid: File[] = []
    for (const f of incoming) {
      const error = validateImageFile(f, GENERAL_IMAGE_TYPES)
      if (error) { toast.error(`${f.name}: ${error}`); continue }
      valid.push(f)
    }

    if (isMultiContext) {
      // Accumulate — deduplicate by name+size
      setGeneralFiles(prev => {
        const existing = new Set(prev.map(f => `${f.name}-${f.size}`))
        const fresh = valid.filter(f => !existing.has(`${f.name}-${f.size}`))
        return [...prev, ...fresh]
      })
    } else {
      setGeneralFiles(valid.slice(0, 1))
    }

    // Reset the input so the same file can be re-added after removal
    if (generalRef.current) generalRef.current.value = ''
  }

  function removeFile(index: number) {
    setGeneralFiles(prev => prev.filter((_, i) => i !== index))
  }

  async function handlePrimary() {
    if (step === 'form' && isSlideContext) {
      setStep('copy')
      return
    }

    setPending(true)
    try {
      if (uploadType === 'general') {
        if (generalFiles.length === 0) return

        if (isMultiUpload) {
          // ── Multi-file upload ──────────────────────────────────────
          const total = generalFiles.length
          let failed = 0

          for (let i = 0; i < generalFiles.length; i++) {
            setProgress({ done: i, total })
            const compressed = await compressImage(generalFiles[i])
            const fd = new FormData()
            fd.set('file',     compressed)
            fd.set('context',  context)
            fd.set('alt_text', altText || generalFiles[i].name.replace(/\.[^.]+$/, ''))
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
          // ── Single-file upload ─────────────────────────────────────
          const fd = new FormData()
          fd.set('file',     await compressImage(generalFiles[0]))
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

        reset(); onUploaded(); onClose()

      } else {
        // ── Hero upload ────────────────────────────────────────────────
        const fd = new FormData()
        if (desktopFile && (heroVariant === 'desktop' || heroVariant === 'both'))
          fd.set('desktop_image', await compressImage(desktopFile))
        if (mobileFile && (heroVariant === 'mobile' || heroVariant === 'both'))
          fd.set('mobile_image', await compressImage(mobileFile))

        const res = await uploadHeroImages(fd)
        if (res.success) {
          toast.success(res.message ?? 'Hero image updated')
          reset(); onUploaded(); onClose()
        } else {
          toast.error(res.error)
        }
      }
    } finally {
      setPending(false)
    }
  }

  const primaryLabel = progress
    ? `Uploading ${progress.done + 1} of ${progress.total}…`
    : step === 'form' && isSlideContext
      ? 'Next: Add Copy'
      : isMultiUpload
        ? `Upload ${generalFiles.length} Images`
        : 'Upload'

  const primaryReady = step === 'copy' ? copyReady : formReady
  const showDesktop  = uploadType === 'hero' && (heroVariant === 'desktop' || heroVariant === 'both')
  const showMobile   = uploadType === 'hero' && (heroVariant === 'mobile'  || heroVariant === 'both')
  const contextSpec  = CONTEXT_SPECS[context]
  const isNews       = context === 'news'

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose() }}>
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
              : 'Choose what you\'re uploading and fill in the details below.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-1">

          {/* ── Step 1: file / type ───────────────────────────────────── */}
          {step === 'form' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { value: 'general', label: 'General Media',  sub: 'Carousel, gallery, news…', icon: ImageIcon },
                  { value: 'hero',    label: 'Hero Image',      sub: 'Homepage background',      icon: Layers    },
                ] as const).map(({ value, label, sub, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setUploadType(value)}
                    className={`flex flex-col items-start gap-1 rounded-xl border-2 p-4 text-left transition-colors ${
                      uploadType === value
                        ? 'border-blue-900 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${uploadType === value ? 'text-blue-900' : 'text-slate-400'}`} />
                    <span className={`text-sm font-semibold ${uploadType === value ? 'text-blue-900' : 'text-slate-700'}`}>
                      {label}
                    </span>
                    <span className="text-xs text-slate-400">{sub}</span>
                  </button>
                ))}
              </div>

              {uploadType === 'general' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Category</Label>
                    <Select value={context} onValueChange={(v) => { setContext(v as MediaContext); setGeneralFiles([]) }}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {CONTEXTS.map((c) => (
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
                            Recommended size: {contextSpec.size} ({contextSpec.ratio})
                          </span>
                        </div>
                        <p className="text-xs text-blue-600 pl-5">{contextSpec.tip}</p>
                        <p className="text-xs text-blue-500 pl-5 pt-0.5">
                          You&apos;ll add a headline &amp; description on the next step.
                        </p>
                      </div>
                    )}

                    {/* Multi-upload hint */}
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
                        Alt text <span className="text-slate-400 font-normal">(optional{isMultiContext ? ' — applied to all' : ''})</span>
                      </Label>
                      <Input
                        id="alt-text"
                        placeholder="Describe the image for screen readers…"
                        value={altText}
                        onChange={(e) => setAltText(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label>
                      {isMultiContext ? `Files${generalFiles.length > 0 ? ` (${generalFiles.length} selected)` : ''}` : 'File'}
                    </Label>
                    <DropZone
                      files={generalFiles}
                      inputRef={generalRef}
                      accept={fileAcceptList(GENERAL_IMAGE_TYPES)}
                      multiple={isMultiContext}
                      onChange={handleGeneralFileChange}
                      onRemove={removeFile}
                      hint={`${imageTypeLabel(GENERAL_IMAGE_TYPES)} · Max 20 MB · compressed automatically`}
                    />
                  </div>
                </div>
              )}

              {uploadType === 'hero' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Variant</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {HERO_VARIANTS.map(({ value, label, icon: Icon }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setHeroVariant(value)}
                          className={`flex flex-col items-center gap-1.5 rounded-lg border-2 py-3 text-xs font-medium transition-colors ${
                            heroVariant === value
                              ? 'border-blue-900 bg-blue-50 text-blue-900'
                              : 'border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {showDesktop && (
                    <div className="space-y-1.5">
                      <Label className="flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-slate-400" /> Desktop Image
                      </Label>
                      <p className="text-xs text-slate-400 -mt-1">1920 × 1440 px (4:3) · Landscape · Centre your subject</p>
                      <DropZone
                        files={desktopFile ? [desktopFile] : []}
                        inputRef={desktopRef}
                        accept={fileAcceptList(HERO_IMAGE_TYPES)}
                        onChange={(e) => {
                          const f = e.target.files?.[0] ?? null
                          if (!f) { setDesktopFile(null); return }
                          const error = validateImageFile(f, HERO_IMAGE_TYPES)
                          if (error) { toast.error(error); setDesktopFile(null); if (desktopRef.current) desktopRef.current.value = ''; return }
                          setDesktopFile(f)
                        }}
                        hint="Click to choose desktop image"
                      />
                    </div>
                  )}

                  {showMobile && (
                    <div className="space-y-1.5">
                      <Label className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-slate-400" /> Mobile Image
                      </Label>
                      <p className="text-xs text-slate-400 -mt-1">1080 × 1350 px (4:5) · Portrait · Keep subject upper-centre</p>
                      <DropZone
                        files={mobileFile ? [mobileFile] : []}
                        inputRef={mobileRef}
                        accept={fileAcceptList(HERO_IMAGE_TYPES)}
                        onChange={(e) => {
                          const f = e.target.files?.[0] ?? null
                          if (!f) { setMobileFile(null); return }
                          const error = validateImageFile(f, HERO_IMAGE_TYPES)
                          if (error) { toast.error(error); setMobileFile(null); if (mobileRef.current) mobileRef.current.value = ''; return }
                          setMobileFile(f)
                        }}
                        hint="Click to choose mobile image"
                      />
                    </div>
                  )}

                  <p className="text-xs text-slate-400 pt-1">
                    Accepted: {imageTypeLabel(HERO_IMAGE_TYPES)} &nbsp;·&nbsp; Max 20 MB · compressed automatically
                  </p>
                </div>
              )}
            </>
          )}

          {/* ── Step 2: Slide copy ────────────────────────────────────── */}
          {step === 'copy' && (
            <div className="space-y-4">
              {generalFiles[0] && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-500">
                  {isNews
                    ? <Newspaper className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    : <GalleryHorizontal className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                  <span className="truncate font-medium">{generalFiles[0].name}</span>
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
                  onChange={(e) => setSlideTitle(e.target.value)}
                  autoFocus
                />
                <p className="text-xs text-slate-400">
                  {isNews ? 'Main headline shown over the news image.' : 'Large title overlaid on the carousel slide.'}
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
                  onChange={(e) => setSlideDesc(e.target.value)}
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
