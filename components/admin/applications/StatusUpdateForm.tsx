'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { updateApplicationStatus, deleteApplication } from '@/actions/applications/update-status'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { CheckCircle, XCircle, Clock, AlertCircle, Loader2, Trash2 } from 'lucide-react'
import type { ApplicationWithHistory, ApplicationStatus } from '@/types/app'
import { useRouter } from 'next/navigation'

interface Props {
  application: ApplicationWithHistory
}

const VALID_TRANSITIONS: Record<ApplicationStatus, { status: ApplicationStatus; label: string; icon: React.ElementType; className: string }[]> = {
  draft:        [{ status: 'submitted', label: 'Submit', icon: CheckCircle, className: 'bg-blue-600 hover:bg-blue-700 text-white' }],
  submitted:    [
    { status: 'under_review', label: 'Mark Under Review', icon: Clock, className: 'bg-amber-500 hover:bg-amber-600 text-white' },
    { status: 'accepted',     label: 'Accept',            icon: CheckCircle, className: 'bg-green-600 hover:bg-green-700 text-white' },
    { status: 'declined',     label: 'Decline',           icon: XCircle, className: 'bg-red-600 hover:bg-red-700 text-white' },
  ],
  under_review: [
    { status: 'accepted',   label: 'Accept',    icon: CheckCircle, className: 'bg-green-600 hover:bg-green-700 text-white' },
    { status: 'declined',   label: 'Decline',   icon: XCircle, className: 'bg-red-600 hover:bg-red-700 text-white' },
    { status: 'waitlisted', label: 'Waitlist',  icon: AlertCircle, className: 'bg-slate-500 hover:bg-slate-600 text-white' },
  ],
  waitlisted: [
    { status: 'accepted', label: 'Accept',   icon: CheckCircle, className: 'bg-green-600 hover:bg-green-700 text-white' },
    { status: 'declined', label: 'Decline',  icon: XCircle, className: 'bg-red-600 hover:bg-red-700 text-white' },
    { status: 'withdrawn', label: 'Withdraw', icon: XCircle, className: 'bg-slate-500 hover:bg-slate-600 text-white' },
  ],
  accepted:  [{ status: 'withdrawn', label: 'Withdraw', icon: XCircle, className: 'bg-slate-500 hover:bg-slate-600 text-white' }],
  declined:  [],
  withdrawn: [],
}

export default function StatusUpdateForm({ application }: Props) {
  const [note, setNote]           = useState('')
  const [pending, startTransition] = useTransition()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const router = useRouter()

  const actions = VALID_TRANSITIONS[application.status as ApplicationStatus] ?? []

  async function handleStatusChange(newStatus: ApplicationStatus) {
    const fd = new FormData()
    fd.set('application_id', application.id)
    fd.set('new_status', newStatus)
    if (note) fd.set('note', note)

    startTransition(async () => {
      const result = await updateApplicationStatus(fd)
      if (result.success) {
        toast.success(result.message ?? 'Status updated')
        setNote('')
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  async function handleDelete() {
    startTransition(async () => {
      const result = await deleteApplication(application.id)
      if (result.success) {
        toast.success('Application deleted')
        router.push('/dashboard/applications')
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Update Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {actions.length === 0 ? (
          <p className="text-sm text-slate-500">
            No further status changes available for this application.
          </p>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="note">Note (optional)</Label>
              <Textarea
                id="note"
                placeholder="Add a note about this decision…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              {actions.map(({ status, label, icon: Icon, className }) => (
                <Button
                  key={status}
                  className={`w-full ${className}`}
                  onClick={() => handleStatusChange(status)}
                  disabled={pending}
                >
                  {pending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Icon className="w-4 h-4 mr-2" />
                  )}
                  {label}
                </Button>
              ))}
            </div>
          </>
        )}

        <Separator />

        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Application
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Application</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this application? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete} disabled={pending}>
                {pending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
