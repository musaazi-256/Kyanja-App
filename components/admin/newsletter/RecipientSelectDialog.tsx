'use client'

import { useState, useTransition, useEffect, useDeferredValue } from 'react'
import { toast } from 'sonner'
import { Send, Search, Loader2, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getActiveSubscribersForSelect, sendNewsletter } from '@/actions/newsletter/send'
import type { SubscriberSelectItem } from '@/types/app'

interface Props {
  open: boolean
  newsletterId: string
  onOpenChange: (open: boolean) => void
  onSent: () => void
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function RecipientSelectDialog({ open, newsletterId, onOpenChange, onSent }: Props) {
  const [subscribers, setSubscribers]   = useState<SubscriberSelectItem[]>([])
  const [loading, setLoading]           = useState(false)
  const [selected, setSelected]         = useState<Set<string>>(new Set())
  const [search, setSearch]             = useState('')
  const [extraInput, setExtraInput]     = useState('')
  const [extraEmails, setExtraEmails]   = useState<string[]>([])
  const [pending, startTransition]      = useTransition()
  const deferredSearch                  = useDeferredValue(search)

  // Load subscribers once when dialog opens
  useEffect(() => {
    if (!open) return
    setSearch('')
    setExtraInput('')
    setExtraEmails([])
    setLoading(true)
    getActiveSubscribersForSelect().then((res) => {
      if (res.success) {
        setSubscribers(res.data)
        setSelected(new Set(res.data.map((s) => s.id)))
      } else {
        toast.error(res.error)
        onOpenChange(false)
      }
      setLoading(false)
    })
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = subscribers.filter((s) => {
    const q = deferredSearch.toLowerCase()
    return s.email.toLowerCase().includes(q) || (s.full_name ?? '').toLowerCase().includes(q)
  })

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAll() {
    if (selected.size === subscribers.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(subscribers.map((s) => s.id)))
    }
  }

  function addExtraEmail() {
    const email = extraInput.trim().toLowerCase()
    if (!EMAIL_RE.test(email)) {
      toast.error('Enter a valid email address')
      return
    }
    const alreadySubscriber = subscribers.some((s) => s.email.toLowerCase() === email)
    if (alreadySubscriber) {
      toast.error('This email is already in the subscriber list above')
      return
    }
    if (extraEmails.includes(email)) {
      toast.error('Already added')
      return
    }
    setExtraEmails((prev) => [...prev, email])
    setExtraInput('')
  }

  function removeExtraEmail(email: string) {
    setExtraEmails((prev) => prev.filter((e) => e !== email))
  }

  const totalRecipients = selected.size + extraEmails.length

  function handleSend() {
    if (totalRecipients === 0) {
      toast.error('Select at least one recipient')
      return
    }
    startTransition(async () => {
      const res = await sendNewsletter(
        newsletterId,
        Array.from(selected),
        extraEmails.length > 0 ? extraEmails : undefined,
      )
      if (res.success) {
        toast.success(res.message ?? 'Newsletter sent')
        onOpenChange(false)
        onSent()
      } else {
        toast.error(res.error)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Recipients</DialogTitle>
          <DialogDescription>
            Choose subscribers and/or add extra email addresses.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : (
          <div className="space-y-4">

            {/* ── Subscriber list ─────────────────────────────────── */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Subscribers
              </p>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <Input
                  placeholder="Search by email or name…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-8 text-sm"
                />
              </div>

              {/* Select all + count */}
              <div className="flex items-center justify-between px-1 text-xs">
                <button type="button" onClick={toggleAll} className="text-blue-600 hover:underline">
                  {selected.size === subscribers.length ? 'Deselect all' : 'Select all'}
                </button>
                <span className="text-slate-500">{selected.size} of {subscribers.length} selected</span>
              </div>

              {/* List */}
              <ScrollArea className="h-44 rounded-md border">
                <div className="p-2 space-y-0.5">
                  {subscribers.length === 0 ? (
                    <p className="text-center text-slate-400 text-sm py-4">No active subscribers</p>
                  ) : filtered.length === 0 ? (
                    <p className="text-center text-slate-400 text-sm py-4">No matches</p>
                  ) : (
                    filtered.map((s) => (
                      <label
                        key={s.id}
                        className="flex items-center gap-3 px-2 py-1.5 rounded hover:bg-slate-50 cursor-pointer"
                      >
                        <Checkbox
                          checked={selected.has(s.id)}
                          onCheckedChange={() => toggleOne(s.id)}
                        />
                        <div className="min-w-0">
                          <p className="text-sm truncate">{s.email}</p>
                          {s.full_name && (
                            <p className="text-xs text-slate-400 truncate">{s.full_name}</p>
                          )}
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* ── Extra emails ────────────────────────────────────── */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Add extra recipients
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="email@example.com"
                  value={extraInput}
                  onChange={(e) => setExtraInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addExtraEmail())}
                  className="h-8 text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={addExtraEmail}
                  disabled={!extraInput.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {extraEmails.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {extraEmails.map((email) => (
                    <span
                      key={email}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs border border-blue-200"
                    >
                      {email}
                      <button
                        type="button"
                        onClick={() => removeExtraEmail(email)}
                        className="hover:text-blue-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={pending}>
            Cancel
          </Button>
          <Button
            className="bg-blue-900 hover:bg-blue-800 active:scale-95 transition-all"
            onClick={handleSend}
            disabled={pending || loading || totalRecipients === 0}
          >
            {pending
              ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending…</>
              : <><Send className="w-4 h-4 mr-2" />Send to {totalRecipients}</>
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
