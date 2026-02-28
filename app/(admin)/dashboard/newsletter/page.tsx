import { getNewsletters } from '@/lib/db/newsletter'
import { getSubscriberCount } from '@/lib/db/newsletter'
import { requirePermission } from '@/lib/rbac/check'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import Link from 'next/link'
import { Plus, Users } from 'lucide-react'
import { format } from 'date-fns'
import type { Metadata } from 'next'
import type { SendStatus } from '@/types/app'
import NewsletterRowActions from '@/components/admin/newsletter/NewsletterRowActions'

export const metadata: Metadata = { title: 'Newsletter' }

const STATUS_COLORS: Record<SendStatus, string> = {
  draft:   'bg-slate-100 text-slate-600',
  queued:  'bg-blue-100 text-blue-700',
  sending: 'bg-amber-100 text-amber-700',
  sent:    'bg-green-100 text-green-700',
  failed:  'bg-red-100 text-red-700',
}

const FILTERS: Array<{ key: 'all' | SendStatus; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'draft', label: 'Draft' },
  { key: 'queued', label: 'Queued' },
  { key: 'sending', label: 'Sending' },
  { key: 'sent', label: 'Sent' },
  { key: 'failed', label: 'Failed' },
]

export default async function NewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  await requirePermission('newsletter:read')
  const params = await searchParams
  const activeFilter = FILTERS.some((f) => f.key === params.status) ? (params.status as SendStatus | 'all') : 'all'
  const [newsletters, subscriberCount] = await Promise.all([getNewsletters(), getSubscriberCount()])

  const counts: Record<'all' | SendStatus, number> = {
    all: newsletters.length,
    draft: newsletters.filter((n) => n.status === 'draft').length,
    queued: newsletters.filter((n) => n.status === 'queued').length,
    sending: newsletters.filter((n) => n.status === 'sending').length,
    sent: newsletters.filter((n) => n.status === 'sent').length,
    failed: newsletters.filter((n) => n.status === 'failed').length,
  }

  const filtered = activeFilter === 'all'
    ? newsletters
    : newsletters.filter((n) => n.status === activeFilter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Newsletter</h1>
          <p className="text-slate-500 text-sm mt-0.5">{subscriberCount} active subscribers</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/newsletter/subscribers">
              <Users className="w-4 h-4 mr-2" />
              Subscribers
            </Link>
          </Button>
          <Button asChild size="sm" className="bg-blue-900 hover:bg-blue-800 active:scale-95 transition-all">
            <Link href="/dashboard/newsletter/compose">
              <Plus className="w-4 h-4 mr-2" />
              Compose
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Newsletter History</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="px-4 pt-2 pb-3 border-b bg-slate-50/70">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {FILTERS.map((f, idx) => (
                <div key={f.key} className="flex items-center gap-4">
                  <Link
                    href={f.key === 'all' ? '/dashboard/newsletter' : `/dashboard/newsletter?status=${f.key}`}
                    className={`inline-flex items-center gap-2 pb-2 border-b-2 transition-colors ${
                      activeFilter === f.key
                        ? 'text-blue-600 border-blue-600 font-medium'
                        : 'text-slate-600 border-transparent hover:text-slate-900'
                    }`}
                  >
                    <span>{f.label}</span>
                    <span className="inline-flex min-w-5 h-5 items-center justify-center rounded-full bg-slate-200 text-slate-600 text-xs px-1.5">
                      {counts[f.key]}
                    </span>
                  </Link>
                  {idx < FILTERS.length - 1 && <span className="text-slate-300">|</span>}
                </div>
              ))}
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-slate-100/90 hover:bg-slate-100/90">
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Failed</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-slate-500">
                    {activeFilter === 'all' ? 'No newsletters yet. Compose your first one!' : 'No newsletters in this status.'}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((nl) => (
                  <TableRow key={nl.id}>
                    <TableCell className="font-medium max-w-xs truncate">
                      <Link
                        href={`/dashboard/newsletter/${nl.id}`}
                        className="hover:underline hover:text-blue-600 transition-colors"
                      >
                        {nl.subject}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${STATUS_COLORS[nl.status]} border-0 capitalize`}>
                        {nl.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{nl.recipient_count}</TableCell>
                    <TableCell>{nl.sent_count}</TableCell>
                    <TableCell className={nl.failed_count > 0 ? 'text-red-600' : ''}>
                      {nl.failed_count}
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {format(new Date(nl.created_at), 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <NewsletterRowActions id={nl.id} status={nl.status} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
