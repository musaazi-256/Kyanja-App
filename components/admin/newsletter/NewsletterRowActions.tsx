'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { sendNewsletter, deleteNewsletterDraft } from '@/actions/newsletter/send'

interface Props {
  id: string
  isDraft: boolean
}

export default function NewsletterRowActions({ id, isDraft }: Props) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function handleSend() {
    startTransition(async () => {
      const res = await sendNewsletter(id)
      if (res.success) {
        toast.success(res.message ?? 'Newsletter queued')
        router.refresh()
      } else {
        toast.error(res.error)
      }
    })
  }

  function handleDelete() {
    if (!confirm('Delete this draft newsletter?')) return

    startTransition(async () => {
      const res = await deleteNewsletterDraft(id)
      if (res.success) {
        toast.success('Draft deleted')
        router.refresh()
      } else {
        toast.error(res.error)
      }
    })
  }

  if (!isDraft) {
    return <span className="text-xs text-slate-400">—</span>
  }

  return (
    <div className="flex items-center gap-2 justify-end">
      <Button asChild size="sm" variant="outline" disabled={pending}>
        <Link href={`/dashboard/newsletter/compose?id=${id}`}>Edit</Link>
      </Button>
      <Button size="sm" className="bg-[#1e3a5f] hover:bg-[#16305a]" onClick={handleSend} disabled={pending}>
        Send
      </Button>
      <Button size="sm" variant="destructive" onClick={handleDelete} disabled={pending}>
        Delete
      </Button>
    </div>
  )
}
