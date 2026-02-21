import { requirePermission } from '@/lib/rbac/check'
import { getSubscriberCount } from '@/lib/db/newsletter'
import { getNewsletterById } from '@/lib/db/newsletter'
import ComposeForm from '@/components/admin/newsletter/ComposeForm'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Compose Newsletter' }

export default async function ComposePage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  await requirePermission('newsletter:compose')
  const { id } = await searchParams

  const [count, draft] = await Promise.all([
    getSubscriberCount(),
    id ? getNewsletterById(id) : Promise.resolve(null),
  ])

  const initialDraft = draft && draft.status === 'draft'
    ? { id: draft.id, subject: draft.subject, body_html: draft.body_html }
    : undefined

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/newsletter"><ArrowLeft className="w-4 h-4 mr-1" />Back</Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Compose Newsletter</h1>
          <p className="text-slate-500 text-sm">Will be sent to {count} active subscribers</p>
        </div>
      </div>
      <ComposeForm subscriberCount={count} initialDraft={initialDraft} />
    </div>
  )
}
