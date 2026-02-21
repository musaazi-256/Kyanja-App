import { requirePermission } from '@/lib/rbac/check'
import { createManualApplication } from '@/actions/applications/create'
import ApplicationForm from '@/components/admin/applications/ApplicationForm'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'New Application' }

export default async function NewApplicationPage() {
  await requirePermission('applications:write')

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/applications">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">New Application</h1>
          <p className="text-slate-500 text-sm">Manually enter a new application</p>
        </div>
      </div>

      <ApplicationForm action={createManualApplication} submitLabel="Create Application" />
    </div>
  )
}
