'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { editDownload } from '@/actions/downloads'
import { DOWNLOAD_ICONS } from '@/lib/downloads/icons'
import type { Download } from '@/types/app'

interface Props {
  download: Download
  open: boolean
  onClose: () => void
  onSaved: () => void
}

export default function EditDownloadModal({ download, open, onClose, onSaved }: Props) {
  const [pending, startTransition] = useTransition()

  const [name,    setName]    = useState(download.name)
  const [subcopy, setSubcopy] = useState(download.subcopy ?? '')
  const [icon,    setIcon]    = useState(download.icon)

  function handleClose() {
    if (pending) return
    onClose()
  }

  function handleSubmit() {
    if (!name.trim()) return
    startTransition(async () => {
      const res = await editDownload(download.id, { name, subcopy, icon })
      if (res.success) {
        toast.success('Download updated')
        onSaved(); onClose()
      } else {
        toast.error(res.error)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose() }}>
      <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Download</DialogTitle>
          <DialogDescription>
            Update the name, description, or icon. The file itself cannot be replaced — delete and re-upload if needed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-1">
          {/* File info (read-only) */}
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-500">
            <span className="font-medium truncate">{download.file_name}</span>
            <span className="shrink-0 ml-auto">
              {(download.file_size / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-name">Name <span className="text-red-500">*</span></Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Subcopy */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-subcopy">
              Description <span className="text-slate-400 font-normal">(optional)</span>
            </Label>
            <Textarea
              id="edit-subcopy"
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
                      {selected ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
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
            disabled={pending || !name.trim()}
          >
            {pending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {pending ? 'Saving…' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
