'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog, DialogContent, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plus, MoreHorizontal, Pencil, Trash2, Loader2, Quote } from 'lucide-react'
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonialPublished,
} from '@/actions/testimonials'
import type { Testimonial } from '@/types/app'

// ── Form dialog ────────────────────────────────────────────────────────────────

interface FormData {
  quote:         string
  author_name:   string
  author_detail: string
  initials:      string
  sort_order:    number
  published:     boolean
}

const EMPTY_FORM: FormData = {
  quote: '', author_name: '', author_detail: '', initials: '', sort_order: 0, published: true,
}

interface FormDialogProps {
  open:      boolean
  onClose:   () => void
  existing?: Testimonial
}

function FormDialog({ open, onClose, existing }: FormDialogProps) {
  const router  = useRouter()
  const [form, setForm] = useState<FormData>(
    existing
      ? {
          quote:         existing.quote,
          author_name:   existing.author_name,
          author_detail: existing.author_detail ?? '',
          initials:      existing.initials ?? '',
          sort_order:    existing.sort_order,
          published:     existing.published,
        }
      : EMPTY_FORM,
  )
  const [pending, startTransition] = useTransition()

  function set<K extends keyof FormData>(k: K, v: FormData[K]) {
    setForm((p) => ({ ...p, [k]: v }))
  }

  async function handleSubmit() {
    if (!form.quote.trim() || !form.author_name.trim()) {
      toast.error('Quote and author name are required.')
      return
    }
    startTransition(async () => {
      const payload = {
        ...form,
        author_detail: form.author_detail || null,
        initials:      form.initials || null,
      }
      const res = existing
        ? await updateTestimonial(existing.id, payload)
        : await createTestimonial(payload)
      if (res.success) {
        toast.success(existing ? 'Testimonial updated' : 'Testimonial added')
        router.refresh()
        onClose()
      } else {
        toast.error(res.error)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{existing ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Quote <span className="text-destructive">*</span></Label>
            <Textarea
              rows={4}
              placeholder="What did the parent say?"
              value={form.quote}
              onChange={(e) => set('quote', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Author Name <span className="text-destructive">*</span></Label>
              <Input
                placeholder="Mrs. Nakato Sarah"
                value={form.author_name}
                onChange={(e) => set('author_name', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Initials</Label>
              <Input
                placeholder="NS"
                maxLength={3}
                value={form.initials}
                onChange={(e) => set('initials', e.target.value.toUpperCase())}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Role / Detail</Label>
            <Input
              placeholder="Parent — Primary 4"
              value={form.author_detail}
              onChange={(e) => set('author_detail', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Sort Order</Label>
              <Input
                type="number"
                min={0}
                value={form.sort_order}
                onChange={(e) => set('sort_order', Number(e.target.value))}
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <Checkbox
                id="published"
                checked={form.published}
                onCheckedChange={(checked) => set('published', checked === true)}
              />
              <Label htmlFor="published">Published</Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={pending}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={pending}
            className="bg-blue-900 hover:bg-blue-800 active:scale-95 transition-all"
          >
            {pending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {existing ? 'Save Changes' : 'Add Testimonial'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Row actions ────────────────────────────────────────────────────────────────

function RowActions({ item }: { item: Testimonial }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [deleting, startDelete] = useTransition()
  const [toggling, startToggle] = useTransition()

  async function handleDelete() {
    if (!confirm(`Delete testimonial by "${item.author_name}"?`)) return
    startDelete(async () => {
      const res = await deleteTestimonial(item.id)
      if (res.success) {
        toast.success('Testimonial deleted')
        router.refresh()
      } else {
        toast.error(res.error)
      }
    })
  }

  async function handleToggle() {
    startToggle(async () => {
      const res = await toggleTestimonialPublished(item.id, !item.published)
      if (res.success) {
        toast.success(item.published ? 'Unpublished' : 'Published')
        router.refresh()
      } else {
        toast.error(res.error)
      }
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" disabled={deleting || toggling}>
            {(deleting || toggling) ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreHorizontal className="w-4 h-4" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditing(true)}>
            <Pencil className="w-4 h-4 mr-2" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleToggle}>
            {item.published ? 'Unpublish' : 'Publish'}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {editing && (
        <FormDialog open={editing} onClose={() => setEditing(false)} existing={item} />
      )}
    </>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

interface Props {
  testimonials: Testimonial[]
}

export default function TestimonialsManager({ testimonials }: Props) {
  const [adding, setAdding] = useState(false)

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {testimonials.length} testimonial{testimonials.length !== 1 ? 's' : ''} total
          {' · '}
          {testimonials.filter((t) => t.published).length} published
        </p>
        <Button
          onClick={() => setAdding(true)}
          className="bg-blue-900 hover:bg-blue-800 active:scale-95 transition-all gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </Button>
      </div>

      {/* Empty state */}
      {testimonials.length === 0 ? (
        <div className="text-center py-20 text-slate-400 border rounded-xl">
          <Quote className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="font-medium">No testimonials yet</p>
          <p className="text-sm mt-1">Add your first parent quote using the button above.</p>
        </div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Author</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell">Quote</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600 w-24">Status</th>
                <th className="px-4 py-3 w-12" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {testimonials.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-navy text-white flex items-center justify-center text-xs font-bold font-display shrink-0">
                        {t.initials ?? t.author_name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 leading-tight">{t.author_name}</p>
                        {t.author_detail && (
                          <p className="text-xs text-slate-500 mt-0.5">{t.author_detail}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-slate-600 line-clamp-2 max-w-md">{t.quote}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="secondary"
                      className={t.published
                        ? 'bg-green-100 text-green-700 hover:bg-green-100'
                        : 'bg-slate-100 text-slate-500'}
                    >
                      {t.published ? 'Published' : 'Draft'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <RowActions item={t} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {adding && <FormDialog open={adding} onClose={() => setAdding(false)} />}
    </div>
  )
}
