import { getSubscribers } from '@/lib/db/newsletter'
import { requirePermission } from '@/lib/rbac/check'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Subscribers' }

export default async function SubscribersPage() {
  await requirePermission('newsletter:subscribers')
  const subscribers = await getSubscribers(false)
  const active = subscribers.filter((s) => s.is_active).length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/newsletter"><ArrowLeft className="w-4 h-4 mr-1" />Back</Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Subscribers</h1>
          <p className="text-slate-500 text-sm">{active} active of {subscribers.length} total</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Subscribed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                    No subscribers yet.
                  </TableCell>
                </TableRow>
              ) : (
                subscribers.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.email}</TableCell>
                    <TableCell className="text-slate-500">{s.full_name ?? '—'}</TableCell>
                    <TableCell>
                      <Badge className={s.is_active
                        ? 'bg-green-100 text-green-700 border-0'
                        : 'bg-slate-100 text-slate-500 border-0'
                      }>
                        {s.is_active ? 'Active' : 'Unsubscribed'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500 capitalize">{s.source ?? 'website'}</TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {format(new Date(s.subscribed_at), 'dd MMM yyyy')}
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
