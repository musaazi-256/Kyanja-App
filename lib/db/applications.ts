import { createClient } from '@/lib/supabase/server'
import type { ApplicationFilters, PaginatedResult, ApplicationWithHistory } from '@/types/app'
import type { ApplicationStatus } from '@/types/app'

function sanitizeSearchTerm(input: string) {
  return input
    .replace(/[^a-zA-Z0-9@._+\-\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export async function getApplications(
  filters: ApplicationFilters = {},
): Promise<PaginatedResult<ApplicationWithHistory>> {
  const supabase = await createClient()
  const { status, academic_year, applying_for_class, search, page = 1, pageSize = 25 } = filters

  let query = supabase
    .from('applications')
    .select('*, application_status_history(*)', { count: 'exact' })
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (status)              query = query.eq('status', status)
  if (academic_year)       query = query.eq('academic_year', academic_year)
  if (applying_for_class)  query = query.eq('applying_for_class', applying_for_class)
  if (search) {
    const term = sanitizeSearchTerm(search)
    if (term.length > 0) {
      query = query.or(
        `student_first_name.ilike.%${term}%,student_last_name.ilike.%${term}%,parent_email.ilike.%${term}%,parent_name.ilike.%${term}%`,
      )
    }
  }

  const from = (page - 1) * pageSize
  query = query.range(from, from + pageSize - 1)

  const { data, error, count } = await query

  if (error) throw error

  return {
    data: (data ?? []) as ApplicationWithHistory[],
    meta: {
      page,
      pageSize,
      total:      count ?? 0,
      totalPages: Math.ceil((count ?? 0) / pageSize),
    },
  }
}

export async function getApplicationById(id: string): Promise<ApplicationWithHistory | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('applications')
    .select('*, application_status_history(*)')
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error) return null
  return data as ApplicationWithHistory
}

export async function getApplicationStats() {
  const supabase = await createClient()
  const statuses: ApplicationStatus[] = [
    'draft', 'submitted', 'under_review', 'accepted', 'declined', 'waitlisted', 'withdrawn',
  ]

  const [totalResult, ...statusResults] = await Promise.all([
    supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null),
    ...statuses.map((status) => (
      supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .is('deleted_at', null)
        .eq('status', status)
    )),
  ])

  if (totalResult.error) throw totalResult.error

  const stats: Record<ApplicationStatus | 'total', number> = {
    total:        totalResult.count ?? 0,
    submitted:    0,
    under_review: 0,
    accepted:     0,
    declined:     0,
    waitlisted:   0,
    withdrawn:    0,
    draft:        0,
  }

  statusResults.forEach((result, idx) => {
    if (result.error) throw result.error
    stats[statuses[idx]] = result.count ?? 0
  })

  return stats
}

export async function getAcademicYears(): Promise<string[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('applications')
    .select('academic_year')
    .is('deleted_at', null)

  const years = [...new Set(data?.map((r) => r.academic_year) ?? [])]
  return years.sort().reverse()
}
