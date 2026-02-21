'use client'

import { useRef, useState, useTransition } from 'react'
import { toast } from 'sonner'
import {
  Upload, Loader2, ImageIcon, Monitor, Smartphone, Layers,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { uploadMedia } from '@/actions/media/upload'
import { uploadHeroImages } from '@/actions/settings/hero'
import type { MediaContext } from '@/types/app'

// ── Types ─────────────────────────────────────────────────────────────────────
type UploadType  = 'general' | 'hero'
type HeroVariant = 'desktop' | 'mobile' | 'both'

const CONTEXTS: { value: MediaContext; label: string }[] = [
  { value: 'gallery',      label: 'Gallery' },
  { value: 'admissions',   label: 'Admissions' },
  { value: 'news',         label: 'News' },
  { value: 'page_content', label: 'Page Content' },
  { value: 'profile',      label: 'Profile' },
]

const HERO_VARIANTS: { value: HeroVariant; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'desktop', label: 'Desktop',      icon: Monitor },
  { value: 'mobile',  label: 'Mobile',       icon: Smartphone },
  { value: 'both',    label: 'Both',         icon: Layers },
]

// ── File drop zone ─────────────────────────────────────────────────────────────
interface DropZoneProps {
  file: File | null
  inputRef: React.RefObject<HTMLInputElement | null>
  accept: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  hint?: string
}

function DropZone({ file, inputRef, accept, onChange, hint }: DropZoneProps) {
  return (
    <div className="space-y-1">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={onChange}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-7 text-center hover:border-[#1e3a5f]/40 hover:bg-blue-50/30 transition-colors"
      >
        {file ? (
          <div className="text-sm">
            <p className="font-medium text-slate-700">{file.name}</p>
            <p className="text-slate-400 mt-0.5 text-xs">
              {(file.size / 1024 / 1024).toFixed(2)} MB · {file.type.split('/')[1].toUpperCase()}
            </p>
            <p className="text-[#1e3a5f] text-xs mt-1.5 underline underline-offset-2">Click to replace</p>
          </div>
        ) : (
          <div className="text-slate-400">
            <Upload className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm">Click to choose a file</p>
            {hint && <p className="text-xs mt-1 text-slate-300">{hint}</p>}
          </div>
        )}
      </button>
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
  const [pending, startTransition] = useTransition()

  // Upload type
  const [uploadType, setUploadType] = useState<UploadType>('general')

  // General media state
  const [context,     setContext]     = useState<MediaContext>('gallery')
  const [altText,     setAltText]     = useState('')
  const [generalFile, setGeneralFile] = useState<File | null>(null)
  const generalRef = useRef<HTMLInputElement>(null)

  // Hero state
  const [heroVariant,  setHeroVariant]  = useState<HeroVariant>('desktop')
  const [desktopFile,  setDesktopFile]  = useState<File | null>(null)
  const [mobileFile,   setMobileFile]   = useState<File | null>(null)
  const desktopRef = useRef<HTMLInputElement>(null)
  const mobileRef  = useRef<HTMLInputElement>(null)

  function reset() {
    setUploadType('general')
    setContext('gallery')
    setAltText('')
    setGeneralFile(null)
    setHeroVariant('desktop')
    setDesktopFile(null)
    setMobileFile(null)
    if (generalRef.current) generalRef.current.value = ''
    if (desktopRef.current) desktopRef.current.value = ''
    if (mobileRef.current)  mobileRef.current.value  = ''
  }

  function handleClose() {
    if (pending) return
    reset()
    onClose()
  }

  // Determine whether the form is ready to submit
  const canSubmit = uploadType === 'general'
    ? !!generalFile
    : heroVariant === 'desktop'
      ? !!desktopFile
      : heroVariant === 'mobile'
        ? !!mobileFile
        : !!(desktopFile || mobileFile)   // "both" — at least one

  function handleSubmit() {
    startTransition(async () => {
      if (uploadType === 'general') {
        if (!generalFile) return

        const fd = new FormData()
        fd.set('file', generalFile)
        fd.set('context', context)
        fd.set('alt_text', altText)

        const res = await uploadMedia(fd)
        if (res.success) {
          toast.success('Image uploaded')
          reset()
          onUploaded()
          onClose()
        } else {
          toast.error(res.error)
        }
      } else {
        const fd = new FormData()
        if (desktopFile && (heroVariant === 'desktop' || heroVariant === 'both')) {
          fd.set('desktop_image', desktopFile)
        }
        if (mobileFile && (heroVariant === 'mobile' || heroVariant === 'both')) {
          fd.set('mobile_image', mobileFile)
        }

        const res = await uploadHeroImages(fd)
        if (res.success) {
          toast.success(res.message ?? 'Hero image updated')
          reset()
          onUploaded()
          onClose()
        } else {
          toast.error(res.error)
        }
      }
    })
  }

  const showDesktop = uploadType === 'hero' && (heroVariant === 'desktop' || heroVariant === 'both')
  const showMobile  = uploadType === 'hero' && (heroVariant === 'mobile'  || heroVariant === 'both')

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose() }}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
          <DialogDescription>
            Choose what you&apos;re uploading and fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-1">

          {/* ── Step 1: Upload type ───────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-3">
            {([
              { value: 'general', label: 'General Media',  sub: 'Gallery, news, admissions…', icon: ImageIcon },
              { value: 'hero',    label: 'Hero Image',     sub: 'Homepage background',         icon: Layers    },
            ] as const).map(({ value, label, sub, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setUploadType(value)}
                className={`flex flex-col items-start gap-1 rounded-xl border-2 p-4 text-left transition-colors ${
                  uploadType === value
                    ? 'border-[#1e3a5f] bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-5 h-5 ${uploadType === value ? 'text-[#1e3a5f]' : 'text-slate-400'}`} />
                <span className={`text-sm font-semibold ${uploadType === value ? 'text-[#1e3a5f]' : 'text-slate-700'}`}>
                  {label}
                </span>
                <span className="text-xs text-slate-400">{sub}</span>
              </button>
            ))}
          </div>

          {/* ── General Media fields ──────────────────────────────────────── */}
          {uploadType === 'general' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Context</Label>
                <Select value={context} onValueChange={(v) => setContext(v as MediaContext)}>
                  <SelectTrigger>
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
                <Label htmlFor="alt-text">
                  Alt text <span className="text-slate-400 font-normal">(optional)</span>
                </Label>
                <Input
                  id="alt-text"
                  placeholder="Describe the image for screen readers…"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label>File</Label>
                <DropZone
                  file={generalFile}
                  inputRef={generalRef}
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setGeneralFile(e.target.files?.[0] ?? null)}
                  hint="JPEG · PNG · WEBP · Max 5 MB"
                />
              </div>
            </div>
          )}

          {/* ── Hero Image fields ─────────────────────────────────────────── */}
          {uploadType === 'hero' && (
            <div className="space-y-4">

              {/* Variant selector */}
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
                          ? 'border-[#1e3a5f] bg-blue-50 text-[#1e3a5f]'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Desktop file input */}
              {showDesktop && (
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-slate-400" />
                    Desktop Image
                  </Label>
                  <p className="text-xs text-slate-400 -mt-1">
                    Recommended: landscape, 1920 × 1080 px or larger
                  </p>
                  <DropZone
                    file={desktopFile}
                    inputRef={desktopRef}
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => setDesktopFile(e.target.files?.[0] ?? null)}
                    hint="Click to choose desktop image"
                  />
                </div>
              )}

              {/* Mobile file input */}
              {showMobile && (
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-slate-400" />
                    Mobile Image
                  </Label>
                  <p className="text-xs text-slate-400 -mt-1">
                    Recommended: portrait, 768 × 1200 px or larger
                  </p>
                  <DropZone
                    file={mobileFile}
                    inputRef={mobileRef}
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => setMobileFile(e.target.files?.[0] ?? null)}
                    hint="Click to choose mobile image"
                  />
                </div>
              )}

              <p className="text-xs text-slate-400 pt-1">
                Accepted: JPEG · PNG · WEBP &nbsp;·&nbsp; Max 3 MB per image
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={handleClose} disabled={pending}>
            Cancel
          </Button>
          <Button
            className="bg-[#1e3a5f] hover:bg-[#16305a]"
            onClick={handleSubmit}
            disabled={pending || !canSubmit}
          >
            {pending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {pending ? 'Uploading…' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
