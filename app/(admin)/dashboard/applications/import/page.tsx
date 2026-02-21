import { requirePermission } from '@/lib/rbac/check'
import CSVImporter from '@/components/admin/applications/CSVImporter'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Import Applications' }

export default async function ImportPage() {
  await requirePermission('applications:import')

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/applications">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Import Applications</h1>
          <p className="text-slate-500 text-sm">Bulk import applications from a CSV file</p>
        </div>
      </div>
      <CSVImporter />
    </div>
  )
}
