'use client'

import { useRef, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Upload, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { uploadDownload } from '@/actions/downloads'
import { DOWNLOAD_ICONS } from '@/lib/downloads/icons'

interface Props {
  open: boolean
  onClose: () => void
  onUploaded: () => void
}

const ACCEPTED = '.pdf,.csv,.doc,.docx,.xls,.xlsx'

export default function UploadDownloadModal({ open, onClose, onUploaded }: Props) {
  const [pending, startTransition] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)

  const [file,     setFile]     = useState<File | null>(null)
  const [name,     setName]     = useState('')
  const [subcopy,  setSubcopy]  = useState('')
  const [icon,     setIcon]     = useState('file-text')

  function reset() {
    setFile(null); setName(''); setSubcopy(''); setIcon('file-text')
    if (fileRef.current) fileRef.current.value = ''
  }

  function handleClose() {
    if (pending) return
    reset(); onClose()
  }

  const canSubmit = !!file && name.trim().length > 0

  function handleSubmit() {
    if (!canSubmit) return
    startTransition(async () => {
      const fd = new FormData()
      fd.set('file',    file!)
      fd.set('name',    name.trim())
      fd.set('subcopy', subcopy.trim())
      fd.set('icon',    icon)

      const res = await uploadDownload(fd)
      if (res.success) {
        toast.success('File uploaded as draft')
        reset(); onUploaded(); onClose()
      } else {
        toast.error(res.error)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose() }}>
      <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Download File</DialogTitle>
          <DialogDescription>
            Fill in the details and choose an icon. The file will be saved as a draft — publish it when ready.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-1">

          {/* File drop zone */}
          <div className="space-y-1.5">
            <Label>File <span className="text-red-500">*</span></Label>
            <input ref={fileRef} type="file" accept={ACCEPTED} className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null
                setFile(f)
                if (f && !name) setName(f.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '))
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-8 text-center hover:border-[#1e3a5f]/40 hover:bg-blue-50/30 transition-colors"
            >
              {file ? (
                <div className="text-sm space-y-0.5">
                  <p className="font-semibold text-slate-800">{file.name}</p>
                  <p className="text-slate-400 text-xs">
                    {(file.size / 1024 / 1024).toFixed(2)} MB · {file.type.split('/').pop()?.toUpperCase()}
                  </p>
                  <p className="text-[#1e3a5f] text-xs underline underline-offset-2">Click to replace</p>
                </div>
              ) : (
                <div className="text-slate-400">
                  <Upload className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm">Click to choose a file</p>
                  <p className="text-xs mt-1 text-slate-300">PDF · CSV · DOC · DOCX · XLS · XLSX · Max 10 MB</p>
                </div>
              )}
            </button>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="dl-name">Name <span className="text-red-500">*</span></Label>
            <Input
              id="dl-name"
              placeholder="e.g. Term 1 School Circular"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Subcopy */}
          <div className="space-y-1.5">
            <Label htmlFor="dl-subcopy">
              Description <span className="text-slate-400 font-normal">(optional)</span>
            </Label>
            <Textarea
              id="dl-subcopy"
              placeholder="Brief description of what this file contains…"
              value={subcopy}
              onChange={(e) => setSubcopy(e.target.value)}
              rows={2}
            />
          </div>

          {/* Icon picker */}
          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {DOWNLOAD_ICONS.map(({ id, label, Icon, color }) => {
                const selected = icon === id
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setIcon(id)}
                    title={label}
                    className={[
                      'flex flex-col items-center gap-1.5 rounded-xl border-2 py-3 px-1 text-[10px] font-semibold transition-all',
                      selected
                        ? 'border-[#1e3a5f] bg-blue-50 text-[#1e3a5f]'
                        : 'border-slate-200 text-slate-500 hover:border-slate-300',
                    ].join(' ')}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selected ? 'bg-[#1e3a5f] text-white' : color}`}>
                      {selected
                        ? <Check className="w-4 h-4" />
                        : <Icon className="w-4 h-4" />
                      }
                    </div>
                    <span className="truncate w-full text-center leading-tight">{label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={handleClose} disabled={pending}>Cancel</Button>
          <Button
            className="bg-[#1e3a5f] hover:bg-[#16305a]"
            onClick={handleSubmit}
            disabled={pending || !canSubmit}
          >
            {pending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {pending ? 'Uploading…' : 'Upload as Draft'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
