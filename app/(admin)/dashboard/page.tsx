import { getApplicationStats } from '@/lib/db/applications'
import { getSubscriberCount } from '@/lib/db/newsletter'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, CheckCircle, Clock, Users, XCircle, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const [stats, subscriberCount] = await Promise.all([
    getApplicationStats(),
    getSubscriberCount(),
  ])

  const cards = [
    { label: 'Total Applications',  value: stats.total,        icon: FileText,      color: 'text-blue-600',   bg: 'bg-blue-50',   href: '/dashboard/applications' },
    { label: 'Pending Review',       value: stats.submitted + stats.under_review, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', href: '/dashboard/applications?status=submitted' },
    { label: 'Accepted',             value: stats.accepted,     icon: CheckCircle,   color: 'text-green-600',  bg: 'bg-green-50',  href: '/dashboard/applications?status=accepted' },
    { label: 'Declined',             value: stats.declined,     icon: XCircle,       color: 'text-red-600',    bg: 'bg-red-50',    href: '/dashboard/applications?status=declined' },
    { label: 'Newsletter Subscribers', value: subscriberCount,  icon: Users,         color: 'text-purple-600', bg: 'bg-purple-50', href: '/dashboard/newsletter/subscribers' },
    { label: 'Waitlisted',           value: stats.waitlisted,   icon: BookOpen,      color: 'text-slate-600',  bg: 'bg-slate-50',  href: '/dashboard/applications?status=waitlisted' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Overview of school operations</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/applications/import">Import CSV</Link>
          </Button>
          <Button asChild size="sm" className="bg-blue-900 hover:bg-blue-800 active:scale-95 transition-all">
            <Link href="/dashboard/applications/new">New Application</Link>
          </Button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(({ label, value, icon: Icon, color, bg, href }) => (
          <Link key={label} href={href}>
            <Card className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
              <CardContent className="flex items-center gap-4 pt-6">
                <div className={`${bg} p-3 rounded-xl`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{value}</p>
                  <p className="text-sm text-slate-500">{label}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/applications/new">
                <FileText className="w-4 h-4 mr-2" />
                Add Manual Application
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/applications/import">
                <FileText className="w-4 h-4 mr-2" />
                Import Applications via CSV
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/newsletter/compose">
                <Users className="w-4 h-4 mr-2" />
                Compose Newsletter
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/media">
                <BookOpen className="w-4 h-4 mr-2" />
                Manage Media Library
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Application Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: 'Submitted',    value: stats.submitted,    color: 'bg-blue-500' },
              { label: 'Under Review', value: stats.under_review, color: 'bg-amber-500' },
              { label: 'Accepted',     value: stats.accepted,     color: 'bg-green-500' },
              { label: 'Waitlisted',   value: stats.waitlisted,   color: 'bg-slate-400' },
              { label: 'Declined',     value: stats.declined,     color: 'bg-red-500' },
              { label: 'Withdrawn',    value: stats.withdrawn,    color: 'bg-slate-300' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                  <span className="text-slate-600">{label}</span>
                </div>
                <span className="font-medium text-slate-900">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
