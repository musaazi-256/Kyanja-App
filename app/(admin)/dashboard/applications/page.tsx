import { getApplications, getAcademicYears, getApplicationStats } from '@/lib/db/applications'
import { requirePermission } from '@/lib/rbac/check'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import StatusBadge from '@/components/admin/applications/StatusBadge'
import ApplicationsFilter from '@/components/admin/applications/ApplicationsFilter'
import { Plus, Upload } from 'lucide-react'
import { format } from 'date-fns'
import type { Metadata } from 'next'
import type { ApplicationStatus } from '@/types/app'

export const metadata: Metadata = { title: 'Applications' }

interface PageProps {
  searchParams: Promise<{
    status?: string
    academic_year?: string
    search?: string
    page?: string
  }>
}

export default async function ApplicationsPage({ searchParams }: PageProps) {
  await requirePermission('applications:read')
  const params = await searchParams
  const activeStatus = params.status as ApplicationStatus | undefined

  const [{ data: applications, meta }, academicYears, stats] = await Promise.all([
    getApplications({
      status:        params.status as ApplicationStatus | undefined,
      academic_year: params.academic_year,
      search:        params.search,
      page:          params.page ? parseInt(params.page) : 1,
    }),
    getAcademicYears(),
    getApplicationStats(),
  ])

  const statusTabs: Array<{ key?: ApplicationStatus; label: string; count: number }> = [
    { label: 'All', count: stats.total },
    { key: 'submitted', label: 'Submitted', count: stats.submitted },
    { key: 'under_review', label: 'Under Review', count: stats.under_review },
    { key: 'accepted', label: 'Accepted', count: stats.accepted },
    { key: 'waitlisted', label: 'Waitlisted', count: stats.waitlisted },
    { key: 'declined', label: 'Declined', count: stats.declined },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Applications</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {meta.total} total application{meta.total !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/applications/import">
              <Upload className="w-4 h-4 mr-2" />
              Import CSV
            </Link>
          </Button>
          <Button asChild size="sm" className="bg-blue-900 hover:bg-blue-800 active:scale-95 transition-all">
            <Link href="/dashboard/applications/new">
              <Plus className="w-4 h-4 mr-2" />
              New Application
            </Link>
          </Button>
        </div>
      </div>

      <ApplicationsFilter academicYears={academicYears} />

      <Card>
        <CardContent className="p-0">
          <div className="px-4 pt-2 pb-3 border-b bg-slate-50/70">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {statusTabs.map((tab, idx) => (
                <div key={tab.key ?? 'all'} className="flex items-center gap-4">
                  <Link
                    href={tab.key ? `/dashboard/applications?status=${tab.key}` : '/dashboard/applications'}
                    className={`inline-flex items-center gap-2 pb-2 border-b-2 transition-colors ${
                      (tab.key ? activeStatus === tab.key : !activeStatus)
                        ? 'text-blue-600 border-blue-600 font-medium'
                        : 'text-slate-600 border-transparent hover:text-slate-900'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className="inline-flex min-w-5 h-5 items-center justify-center rounded-full bg-slate-200 text-slate-600 text-xs px-1.5">
                      {tab.count}
                    </span>
                  </Link>
                  {idx < statusTabs.length - 1 && <span className="text-slate-300">|</span>}
                </div>
              ))}
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-slate-100/90 hover:bg-slate-100/90">
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Academic Year</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-slate-500">
                    No applications found. Try adjusting your filters.
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((app) => (
                  <TableRow key={app.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">
                      {app.student_first_name} {app.student_last_name}
                    </TableCell>
                    <TableCell>{app.applying_for_class}</TableCell>
                    <TableCell>{app.academic_year}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{app.parent_name}</p>
                        <p className="text-xs text-slate-500">{app.parent_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={app.status} />
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {format(new Date(app.created_at), 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs capitalize">
                        {app.source.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/dashboard/applications/${app.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>
            Page {meta.page} of {meta.totalPages} ({meta.total} results)
          </span>
          <div className="flex gap-2">
            {meta.page > 1 && (
              <Button asChild variant="outline" size="sm">
                <Link href={`?page=${meta.page - 1}`}>Previous</Link>
              </Button>
            )}
            {meta.page < meta.totalPages && (
              <Button asChild variant="outline" size="sm">
                <Link href={`?page=${meta.page + 1}`}>Next</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
