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

export const metadata: Metadata = { title: 'Newsletter' }

const STATUS_COLORS: Record<SendStatus, string> = {
  draft:   'bg-slate-100 text-slate-600',
  queued:  'bg-blue-100 text-blue-700',
  sending: 'bg-amber-100 text-amber-700',
  sent:    'bg-green-100 text-green-700',
  failed:  'bg-red-100 text-red-700',
}

export default async function NewsletterPage() {
  await requirePermission('newsletter:read')
  const [newsletters, subscriberCount] = await Promise.all([getNewsletters(), getSubscriberCount()])

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
          <Button asChild size="sm" className="bg-[#1e3a5f] hover:bg-[#16305a]">
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Failed</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {newsletters.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-slate-500">
                    No newsletters yet. Compose your first one!
                  </TableCell>
                </TableRow>
              ) : (
                newsletters.map((nl) => (
                  <TableRow key={nl.id}>
                    <TableCell className="font-medium max-w-xs truncate">{nl.subject}</TableCell>
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
