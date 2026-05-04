'use client'

import { useRef, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plus, MoreHorizontal, Pencil, Trash2, Loader2, Upload, Star, User, X } from 'lucide-react'
import { uploadMedia } from '@/actions/media/upload'
import { createStaffMember, updateStaffMember, deleteStaffMember, toggleStaffFeatured } from '@/actions/staff'
import type { StaffMember, StaffCategory } from '@/types/app'

// ── Compress helper ────────────────────────────────────────────────────────────
async function compressImage(file: File): Promise<File> {
  if (file.type === 'image/gif') return file
  return new Promise((resolve) => {
    const img = new window.Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      const maxW = 800
      if (width > maxW) { height = Math.round(height * (maxW / width)); width = maxW }
      const canvas = document.createElement('canvas')
      canvas.width = width; canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) { resolve(file); return }
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) { resolve(file); return }
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), { type: 'image/webp' }))
        },
        'image/webp', 0.85,
      )
    }
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file) }
    img.src = url
  })
}

// ── Constants ──────────────────────────────────────────────────────────────────
const CATEGORIES: { value: StaffCategory; label: string }[] = [
  { value: 'admin',        label: 'Administrators' },
  { value: 'teaching',     label: 'Teaching Staff' },
  { value: 'non_teaching', label: 'Support Staff' },
]

const CATEGORY_LABELS: Record<StaffCategory, string> = {
  admin:        'Administrators',
  teaching:     'Teaching Staff',
  non_teaching: 'Support Staff',
}

const CATEGORY_COLORS: Record<StaffCategory, string> = {
  admin:        'bg-blue-100 text-blue-700',
  teaching:     'bg-emerald-100 text-emerald-700',
  non_teaching: 'bg-slate-100 text-slate-600',
}

// ── Form state ─────────────────────────────────────────────────────────────────
interface FormState {
  name:        string
  position:    string
  category:    StaffCategory
  photo_url:   string | null   // existing saved URL (edit mode)
  photo_file:  File | null     // staged local file, uploaded on submit
  featured:    boolean
  sort_order:  number
}

const EMPTY: FormState = {
  name: '', position: '', category: 'teaching',
  photo_url: null, photo_file: null,
  featured: false, sort_order: 0,
}

// ── Photo picker — local preview only, no upload until save ───────────────────
interface PhotoPickerProps {
  savedUrl:    string | null
  stagedFile:  File | null
  onPick:      (file: File) => void
  onClear:     () => void
}

function PhotoPicker({ savedUrl, stagedFile, onPick, onClear }: PhotoPickerProps) {
  const fileRef = useRef<HTMLInputElement>(null)

  // Show staged preview > saved URL > empty
  const previewSrc = stagedFile
    ? URL.createObjectURL(stagedFile)
    : savedUrl

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('Please choose an image file'); return }
    if (file.size > 20 * 1024 * 1024) { toast.error('File too large (max 20 MB)'); return }
    onPick(file)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="flex items-center gap-4">
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />

      {/* Preview */}
      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center">
        {previewSrc ? (
          <>
            <Image
              src={previewSrc}
              alt="Preview"
              fill
              className="object-cover object-top"
              unoptimized={!!stagedFile}
            />
            <button
              type="button"
              onClick={onClear}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
              aria-label="Remove photo"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </>
        ) : (
          <User className="w-7 h-7 text-slate-300" />
        )}
      </div>

      <div className="space-y-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          {previewSrc ? 'Replace photo' : 'Choose photo'}
        </Button>
        <p className="text-xs text-slate-400">
          {stagedFile
            ? `${stagedFile.name} · ${(stagedFile.size / 1024 / 1024).toFixed(1)} MB — will upload on save`
            : 'JPG, PNG or WebP · max 20 MB'}
        </p>
      </div>
    </div>
  )
}

// ── Form dialog ────────────────────────────────────────────────────────────────
interface FormDialogProps {
  open:      boolean
  onClose:   () => void
  existing?: StaffMember
}

function FormDialog({ open, onClose, existing }: FormDialogProps) {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(
    existing
      ? {
          name:       existing.name,
          position:   existing.position,
          category:   existing.category,
          photo_url:  existing.photo_url,
          photo_file: null,
          featured:   existing.featured,
          sort_order: existing.sort_order,
        }
      : EMPTY,
  )
  const [pending, startTransition] = useTransition()

  function field<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm(f => ({ ...f, [key]: val }))
  }

  function handleClose() {
    if (!pending) { onClose(); setForm(EMPTY) }
  }

  function handleSubmit() {
    if (!form.name.trim() || !form.position.trim()) {
      toast.error('Name and position are required')
      return
    }

    startTransition(async () => {
      // Upload staged photo first if one was chosen
      let photoUrl = form.photo_url
      if (form.photo_file) {
        const compressed = await compressImage(form.photo_file)
        const fd = new FormData()
        fd.set('file',     compressed)
        fd.set('context',  'profile')
        fd.set('alt_text', form.name.trim())
        const up = await uploadMedia(fd)
        if (!up.success) { toast.error(up.error); return }
        photoUrl = up.data.url
      }

      const payload = {
        name:       form.name.trim(),
        position:   form.position.trim(),
        category:   form.category,
        photo_url:  photoUrl,
        featured:   form.featured,
        sort_order: form.sort_order,
      }

      const res = existing
        ? await updateStaffMember(existing.id, payload)
        : await createStaffMember(payload)

      if (!res.success) { toast.error(res.error); return }
      toast.success(existing ? 'Staff member updated' : 'Staff member added')
      router.refresh()
      handleClose()
    })
  }

  return (
    <Dialog open={open} onOpenChange={o => { if (!o) handleClose() }}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{existing ? 'Edit Staff Member' : 'Add Staff Member'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-1">

          {/* Photo */}
          <div className="space-y-1.5">
            <Label>Photo</Label>
            <PhotoPicker
              savedUrl={form.photo_url}
              stagedFile={form.photo_file}
              onPick={file => field('photo_file', file)}
              onClear={() => setForm(f => ({ ...f, photo_file: null, photo_url: null }))}
            />
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="sm-name">Full Name <span className="text-red-500">*</span></Label>
            <Input
              id="sm-name"
              placeholder="e.g. Mrs. Sarah Nakato"
              value={form.name}
              onChange={e => field('name', e.target.value)}
            />
          </div>

          {/* Position / Title */}
          <div className="space-y-1.5">
            <Label htmlFor="sm-position">Position / Title <span className="text-red-500">*</span></Label>
            <Input
              id="sm-position"
              placeholder="e.g. Head Teacher"
              value={form.position}
              onChange={e => field('position', e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={v => field('category', v as StaffCategory)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Display order */}
          <div className="space-y-1.5">
            <Label htmlFor="sm-order">Display Order</Label>
            <Input
              id="sm-order"
              type="number"
              min={0}
              value={form.sort_order}
              onChange={e => field('sort_order', parseInt(e.target.value) || 0)}
              className="w-24"
            />
            <p className="text-xs text-slate-400">Lower numbers appear first within the category.</p>
          </div>

          {/* Featured / homepage */}
          <div className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 p-3.5">
            <Checkbox
              id="sm-featured"
              checked={form.featured}
              onCheckedChange={v => field('featured', !!v)}
              className="mt-0.5"
            />
            <div>
              <Label htmlFor="sm-featured" className="cursor-pointer font-semibold text-amber-800">
                Show on homepage
              </Label>
              <p className="text-xs text-amber-600 mt-0.5">
                Up to 3 featured members appear in the &ldquo;Our Team&rdquo; section on the homepage.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={pending}>Cancel</Button>
          <Button
            className="bg-blue-900 hover:bg-blue-800 active:scale-95 transition-all"
            onClick={handleSubmit}
            disabled={pending || !form.name.trim() || !form.position.trim()}
          >
            {pending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {pending
              ? (form.photo_file ? 'Uploading…' : 'Saving…')
              : (existing ? 'Save Changes' : 'Add Member')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Row actions ────────────────────────────────────────────────────────────────
interface RowActionsProps {
  member: StaffMember
  onEdit: () => void
}

function RowActions({ member, onEdit }: RowActionsProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm(`Delete ${member.name}? This cannot be undone.`)) return
    startTransition(async () => {
      const res = await deleteStaffMember(member.id)
      if (!res.success) { toast.error(res.error); return }
      toast.success('Staff member deleted')
      router.refresh()
    })
  }

  function handleToggleFeatured() {
    startTransition(async () => {
      const res = await toggleStaffFeatured(member.id, !member.featured)
      if (!res.success) { toast.error(res.error); return }
      toast.success(member.featured ? 'Removed from homepage' : 'Added to homepage')
      router.refresh()
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={pending}>
          {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreHorizontal className="w-4 h-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="w-4 h-4 mr-2" /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleToggleFeatured}>
          <Star className="w-4 h-4 mr-2" />
          {member.featured ? 'Remove from homepage' : 'Show on homepage'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
          <Trash2 className="w-4 h-4 mr-2" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
interface Props {
  members: StaffMember[]
}

export default function StaffManager({ members }: Props) {
  const [addOpen, setAddOpen] = useState(false)
  const [editing, setEditing] = useState<StaffMember | null>(null)

  const grouped = CATEGORIES.reduce<Record<StaffCategory, StaffMember[]>>(
    (acc, { value: cat }) => {
      acc[cat] = members.filter(m => m.category === cat)
      return acc
    },
    { admin: [], teaching: [], non_teaching: [] },
  )

  const featuredCount = members.filter(m => m.featured).length

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {featuredCount > 0 && (
            <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full font-medium">
              <Star className="w-3 h-3 inline mr-1" />
              {featuredCount} / 3 on homepage
            </span>
          )}
        </div>
        <Button
          onClick={() => setAddOpen(true)}
          className="bg-blue-900 hover:bg-blue-800 active:scale-95 transition-all"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Add Member
        </Button>
      </div>

      {members.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-200 rounded-2xl">
          <User className="w-10 h-10 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">No staff members yet</p>
          <p className="text-slate-400 text-sm mt-1">Click &ldquo;Add Member&rdquo; to get started.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {CATEGORIES.map(({ value: cat, label }) => {
            const items = grouped[cat]
            if (items.length === 0) return null
            return (
              <section key={cat}>
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">{label}</h2>
                <div className="border border-slate-100 rounded-2xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Member</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Position</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                        <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Homepage</th>
                        <th className="px-4 py-3 w-10" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {items.map(member => (
                        <tr key={member.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
                                {member.photo_url ? (
                                  <Image
                                    src={member.photo_url}
                                    alt={member.name}
                                    width={36}
                                    height={36}
                                    className="w-full h-full object-cover object-top"
                                  />
                                ) : (
                                  <User className="w-4 h-4 text-slate-300" />
                                )}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900 leading-tight">{member.name}</p>
                                <p className="text-xs text-slate-400 sm:hidden">{member.position}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-600 hidden sm:table-cell">{member.position}</td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[member.category]}`}>
                              {CATEGORY_LABELS[member.category]}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {member.featured
                              ? <Star className="w-4 h-4 text-amber-500 mx-auto fill-amber-400" />
                              : <span className="text-slate-200">—</span>}
                          </td>
                          <td className="px-4 py-3">
                            <RowActions member={member} onEdit={() => setEditing(member)} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )
          })}
        </div>
      )}

      <FormDialog open={addOpen} onClose={() => setAddOpen(false)} />
      {editing && (
        <FormDialog open={true} onClose={() => setEditing(null)} existing={editing} />
      )}
    </>
  )
}
