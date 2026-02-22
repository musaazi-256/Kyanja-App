import { notFound } from 'next/navigation'
import { requirePermission } from '@/lib/rbac/check'
import { getNewsletterWithSends } from '@/lib/db/newsletter'
import NewsletterDetail from '@/components/admin/newsletter/NewsletterDetail'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Newsletter Detail' }

export default async function NewsletterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requirePermission('newsletter:read')
  const { id } = await params
  const newsletter = await getNewsletterWithSends(id)

  if (!newsletter) notFound()

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/newsletter">
            <ArrowLeft className="w-4 h-4 mr-1" />Back
          </Link>
        </Button>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-900 truncate">{newsletter.subject}</h1>
          <p className="text-slate-500 text-sm mt-0.5">Newsletter detail</p>
        </div>
      </div>
      <NewsletterDetail newsletter={newsletter} />
    </div>
  )
}
