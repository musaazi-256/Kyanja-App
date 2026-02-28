'use client'

import { useState, useTransition, useDeferredValue } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { saveNewsletterDraft, updateNewsletterDraft, deleteNewsletterDraft } from '@/actions/newsletter/send'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Send, Save } from 'lucide-react'
import RecipientSelectDialog from './RecipientSelectDialog'

const FOOTER_HTML = `
  <br/><br/>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
  <p style="font-size:12px;color:#9ca3af;text-align:center">
    Kyanja Junior School · 500 M from West Mall, Kyanja ·
    Plot 43a Katumba Zone-Kyanja Nakawa Division<br/>
    <a href="#" style="color:#9ca3af">Unsubscribe</a>
  </p>
`

function buildPreviewDoc(subject: string, body: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <style>
    body { font-family: Arial, sans-serif; font-size:14px; line-height:1.6;
           color:#1f2937; max-width:600px; margin:0 auto; padding:20px; }
    a { color:#1e3a5f; }
    img { max-width:100%; }
  </style>
</head>
<body>
  ${body || '<p style="color:#9ca3af">Start typing to see a preview…</p>'}
  ${body ? FOOTER_HTML : ''}
</body>
</html>`
}

interface Props {
  subscriberCount: number
  initialDraft?: {
    id: string
    subject: string
    body_html: string
  }
}

export default function ComposeForm({ subscriberCount, initialDraft }: Props) {
  const [subject, setSubject]           = useState(initialDraft?.subject ?? '')
  const [body, setBody]                 = useState(initialDraft?.body_html ?? '')
  const [savedId, setSavedId]           = useState<string | null>(initialDraft?.id ?? null)
  const [recipientOpen, setRecipientOpen] = useState(false)
  const [deleteOpen, setDeleteOpen]     = useState(false)
  const [pending, startTransition]      = useTransition()
  const router = useRouter()

  const deferredBody    = useDeferredValue(body)
  const previewDoc      = buildPreviewDoc(subject, deferredBody)

  function handleSaveDraft() {
    const fd = new FormData()
    fd.set('subject', subject)
    fd.set('body_html', body)

    startTransition(async () => {
      const res = savedId
        ? await updateNewsletterDraft(savedId, fd)
        : await saveNewsletterDraft(fd)
      if (res.success) {
        setSavedId(res.data.id)
        toast.success(savedId ? 'Draft updated' : 'Draft saved')
      } else {
        toast.error(res.error)
      }
    })
  }

  function handleSend() {
    if (!savedId) {
      toast.error('Save the draft first before sending')
      return
    }
    setRecipientOpen(true)
  }

  function handleDeleteDraft() {
    if (!savedId) return
    startTransition(async () => {
      const res = await deleteNewsletterDraft(savedId)
      if (res.success) {
        toast.success('Draft deleted')
        setDeleteOpen(false)
        router.push('/dashboard/newsletter')
      } else {
        toast.error(res.error)
      }
    })
  }

  return (
    <>
      <div className="space-y-4">
        {subscriberCount === 0 && (
          <Alert>
            <AlertDescription>
              There are no active subscribers. The newsletter will not be sent to anyone.
            </AlertDescription>
          </Alert>
        )}

        {/* ── Split panel: editor | live preview ─────────────────────── */}
        <div className="rounded-lg border shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">

            {/* Left — editor */}
            <div className="p-5 space-y-4 bg-white">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  placeholder="e.g. Updates from Kyanja Junior School — Term 2, 2025"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="body">Email Body (HTML supported) *</Label>
                <Textarea
                  id="body"
                  placeholder="Write your newsletter content here. Basic HTML is supported (e.g. <b>, <br>, <a href='...'>)."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={20}
                  className="font-mono text-sm resize-none"
                />
                <p className="text-xs text-slate-500">
                  An unsubscribe link will be automatically appended to every email.
                </p>
              </div>
            </div>

            {/* Right — live preview */}
            <div className="flex flex-col bg-slate-50">
              <div className="px-4 py-2.5 border-b bg-white flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Live Preview
                </p>
                {subject && (
                  <p className="text-xs text-slate-400 truncate max-w-[180px]" title={subject}>
                    {subject}
                  </p>
                )}
              </div>
              <iframe
                srcDoc={previewDoc}
                sandbox="allow-same-origin"
                title="Email preview"
                className="flex-1 w-full border-0"
                style={{ minHeight: '520px' }}
              />
            </div>
          </div>
        </div>

        {/* ── Action buttons ─────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={pending || !subject || !body}
          >
            {pending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {savedId ? 'Save Changes' : 'Save Draft'}
          </Button>
          <Button
            onClick={handleSend}
            disabled={pending || !savedId || subscriberCount === 0}
            className="bg-blue-900 hover:bg-blue-800 active:scale-95 transition-all"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Newsletter
          </Button>
          {savedId && (
            <Button
              variant="destructive"
              onClick={() => setDeleteOpen(true)}
              disabled={pending}
            >
              Delete Draft
            </Button>
          )}
        </div>

        {savedId && (
          <p className="text-xs text-slate-500">
            Draft saved · ID: {savedId.slice(0, 8).toUpperCase()}
          </p>
        )}
      </div>

      {/* ── Recipient selection dialog ──────────────────────────────── */}
      {savedId && (
        <RecipientSelectDialog
          open={recipientOpen}
          newsletterId={savedId}
          onOpenChange={setRecipientOpen}
          onSent={() => router.push('/dashboard/newsletter')}
        />
      )}

      {/* ── Delete draft dialog ─────────────────────────────────────── */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Draft</DialogTitle>
            <DialogDescription>
              This will permanently delete this draft newsletter.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteDraft} disabled={pending}>
              {pending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
