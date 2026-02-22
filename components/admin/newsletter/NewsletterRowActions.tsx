'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { MoreHorizontal, Pencil, Send, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { deleteNewsletter, deleteNewsletterDraft } from '@/actions/newsletter/send'
import RecipientSelectDialog from './RecipientSelectDialog'
import type { SendStatus } from '@/types/app'

interface Props {
  id: string
  status: SendStatus
}

export default function NewsletterRowActions({ id, status }: Props) {
  const [pending, startTransition]        = useTransition()
  const [deleteOpen, setDeleteOpen]       = useState(false)
  const [recipientOpen, setRecipientOpen] = useState(false)
  const router = useRouter()

  function handleDelete() {
    startTransition(async () => {
      const action = status === 'draft' ? deleteNewsletterDraft : deleteNewsletter
      const res = await action(id)
      if (res.success) {
        toast.success(res.message ?? 'Deleted')
        setDeleteOpen(false)
        router.refresh()
      } else {
        toast.error(res.error)
      }
    })
  }

  // Sent / currently-sending — no actions available
  if (status === 'sent' || status === 'sending') {
    return <span className="text-xs text-slate-400">—</span>
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="h-8 w-8" disabled={pending}>
            <MoreHorizontal className="w-4 h-4" />
            <span className="sr-only">Newsletter actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {status === 'draft' && (
            <>
              <DropdownMenuItem onSelect={() => router.push(`/dashboard/newsletter/compose?id=${id}`)}>
                <Pencil className="w-4 h-4 mr-2 text-slate-500" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setRecipientOpen(true)} disabled={pending}>
                <Send className="w-4 h-4 mr-2 text-slate-500" />
                Send
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem
            onSelect={() => setDeleteOpen(true)}
            className="text-red-600 focus:text-red-600 focus:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Recipient selection before sending */}
      <RecipientSelectDialog
        open={recipientOpen}
        newsletterId={id}
        onOpenChange={setRecipientOpen}
        onSent={() => router.refresh()}
      />

      {/* Delete confirmation */}
      <Dialog open={deleteOpen} onOpenChange={(o) => !o && setDeleteOpen(false)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete {status === 'draft' ? 'Draft' : 'Newsletter'}?</DialogTitle>
            <DialogDescription>
              This {status === 'draft' ? 'draft' : 'newsletter'} will be permanently deleted and cannot be recovered.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={pending}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={pending}>
              {pending ? 'Deleting…' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
