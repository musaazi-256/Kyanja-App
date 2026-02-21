'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { saveNewsletterDraft, sendNewsletter } from '@/actions/newsletter/send'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Send, Save, Users } from 'lucide-react'

interface Props { subscriberCount: number }

export default function ComposeForm({ subscriberCount }: Props) {
  const [subject, setSubject]     = useState('')
  const [body, setBody]           = useState('')
  const [savedId, setSavedId]     = useState<string | null>(null)
  const [sendOpen, setSendOpen]   = useState(false)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function handleSaveDraft() {
    const fd = new FormData()
    fd.set('subject', subject)
    fd.set('body_html', body)

    startTransition(async () => {
      const res = await saveNewsletterDraft(fd)
      if (res.success) {
        setSavedId(res.data.id)
        toast.success('Draft saved')
      } else {
        toast.error(res.error)
      }
    })
  }

  function handleSend() {
    if (!savedId) {
      toast.error('Please save the draft first')
      return
    }
    setSendOpen(true)
  }

  function confirmSend() {
    if (!savedId) return
    startTransition(async () => {
      const res = await sendNewsletter(savedId)
      if (res.success) {
        toast.success(res.message ?? 'Newsletter queued for delivery')
        setSendOpen(false)
        router.push('/dashboard/newsletter')
      } else {
        toast.error(res.error)
        setSendOpen(false)
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

        <Card>
          <CardHeader><CardTitle className="text-base">Email Content</CardTitle></CardHeader>
          <CardContent className="space-y-4">
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
                rows={16}
                className="font-mono text-sm"
              />
              <p className="text-xs text-slate-500">
                An unsubscribe link will be automatically appended to every email.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={pending || !subject || !body}
          >
            {pending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Draft
          </Button>
          <Button
            onClick={handleSend}
            disabled={pending || !savedId || subscriberCount === 0}
            className="bg-[#1e3a5f] hover:bg-[#16305a]"
          >
            <Send className="w-4 h-4 mr-2" />
            Send to {subscriberCount} Subscribers
          </Button>
        </div>

        {savedId && (
          <p className="text-xs text-slate-500">
            Draft saved · ID: {savedId.slice(0, 8).toUpperCase()}
          </p>
        )}
      </div>

      <Dialog open={sendOpen} onOpenChange={setSendOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Newsletter</DialogTitle>
            <DialogDescription>
              This will send the newsletter to{' '}
              <strong>{subscriberCount} active subscribers</strong>. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg text-sm">
            <Users className="w-5 h-5 text-slate-500" />
            <div>
              <p className="font-medium">Subject: {subject}</p>
              <p className="text-slate-500">Recipients: {subscriberCount}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSendOpen(false)}>Cancel</Button>
            <Button onClick={confirmSend} disabled={pending} className="bg-[#1e3a5f] hover:bg-[#16305a]">
              {pending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
              Confirm & Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
