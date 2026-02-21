import { getApplicationById } from '@/lib/db/applications'
import { requirePermission } from '@/lib/rbac/check'
import { notFound } from 'next/navigation'
import StatusBadge from '@/components/admin/applications/StatusBadge'
import StatusUpdateForm from '@/components/admin/applications/StatusUpdateForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { ArrowLeft, Calendar, Mail, Phone, MapPin, School } from 'lucide-react'
import { format } from 'date-fns'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Application Detail' }

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requirePermission('applications:read')
  const { id } = await params
  const app = await getApplicationById(id)
  if (!app) notFound()

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/applications">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {app.student_first_name} {app.student_last_name}
          </h1>
          <p className="text-slate-500 text-sm">
            Application #{app.id.slice(0, 8).toUpperCase()} ·{' '}
            {format(new Date(app.created_at), 'dd MMMM yyyy')}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <StatusBadge status={app.status} />
          <Badge variant="outline" className="capitalize text-xs">
            {app.source.replace('_', ' ')}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left col: Student + parent info */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Student Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <Field label="First Name"      value={app.student_first_name} />
              <Field label="Last Name"       value={app.student_last_name} />
              <Field label="Date of Birth"   value={format(new Date(app.date_of_birth), 'dd MMM yyyy')} />
              <Field label="Gender"          value={app.gender ?? '—'} />
              <Field label="Nationality"     value={app.nationality ?? '—'} />
              <Field label="Applying For"    value={app.applying_for_class} />
              <Field label="Academic Year"   value={app.academic_year} />
              <Field label="Previous School" value={app.previous_school ?? '—'} />
              {app.special_needs && (
                <div className="col-span-2">
                  <Field label="Special Needs / Requirements" value={app.special_needs} />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Parent / Guardian</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Name"         value={app.parent_name} />
                <Field label="Relationship" value={app.parent_relationship} />
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${app.parent_email}`} className="hover:underline">{app.parent_email}</a>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${app.parent_phone}`} className="hover:underline">{app.parent_phone}</a>
                </div>
                {app.address && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-4 h-4" />
                    <span>{app.address}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {app.notes && (
            <Card>
              <CardHeader><CardTitle className="text-base">Notes</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 whitespace-pre-wrap">{app.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Status history */}
          <Card>
            <CardHeader><CardTitle className="text-base">Status History</CardTitle></CardHeader>
            <CardContent>
              {app.application_status_history.length === 0 ? (
                <p className="text-sm text-slate-500">No history yet</p>
              ) : (
                <div className="space-y-3">
                  {app.application_status_history
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .map((h) => (
                      <div key={h.id} className="flex items-start gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-slate-700">
                            {h.from_status ? (
                              <><span className="capitalize">{h.from_status}</span> → <span className="capitalize font-medium">{h.to_status}</span></>
                            ) : (
                              <span className="capitalize font-medium">{h.to_status}</span>
                            )}
                          </p>
                          {h.note && <p className="text-slate-500 mt-0.5">{h.note}</p>}
                          <p className="text-xs text-slate-400 mt-0.5">
                            {format(new Date(h.created_at), 'dd MMM yyyy, HH:mm')}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right col: Actions */}
        <div>
          <StatusUpdateForm application={app} />
        </div>
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-slate-800 mt-0.5">{value}</p>
    </div>
  )
}
