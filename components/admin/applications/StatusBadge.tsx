import { Badge } from '@/components/ui/badge'
import type { ApplicationStatus } from '@/types/app'

const CONFIG: Record<ApplicationStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }> = {
  draft:        { label: 'Draft',        variant: 'outline',     className: 'border-slate-300 text-slate-600' },
  submitted:    { label: 'Submitted',    variant: 'default',     className: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100' },
  under_review: { label: 'Under Review', variant: 'secondary',   className: 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100' },
  accepted:     { label: 'Accepted',     variant: 'default',     className: 'bg-green-100 text-green-700 border-green-200 hover:bg-green-100' },
  declined:     { label: 'Declined',     variant: 'destructive', className: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-100' },
  waitlisted:   { label: 'Waitlisted',   variant: 'outline',     className: 'bg-slate-100 text-slate-600 border-slate-300' },
  withdrawn:    { label: 'Withdrawn',    variant: 'outline',     className: 'bg-slate-50 text-slate-400 border-slate-200' },
}

export default function StatusBadge({ status }: { status: ApplicationStatus }) {
  const cfg = CONFIG[status] ?? CONFIG.submitted
  return (
    <Badge variant={cfg.variant} className={cfg.className}>
      {cfg.label}
    </Badge>
  )
}
