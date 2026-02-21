'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import { useCallback, useState } from 'react'

const STATUSES = [
  { value: 'submitted',    label: 'Submitted' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'accepted',     label: 'Accepted' },
  { value: 'declined',     label: 'Declined' },
  { value: 'waitlisted',   label: 'Waitlisted' },
  { value: 'withdrawn',    label: 'Withdrawn' },
  { value: 'draft',        label: 'Draft' },
]

export default function ApplicationsFilter({ academicYears }: { academicYears: string[] }) {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') ?? '')

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value && value !== 'all') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete('page')
      router.push(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams],
  )

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    updateParam('search', search)
  }

  function clearAll() {
    setSearch('')
    router.push(pathname)
  }

  const hasFilters = searchParams.has('status') ||
    searchParams.has('academic_year') ||
    searchParams.has('search')

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search name, email…"
            className="pl-9 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button type="submit" variant="outline" size="sm">Search</Button>
      </form>

      <Select
        value={searchParams.get('status') ?? 'all'}
        onValueChange={(v) => updateParam('status', v)}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {STATUSES.map((s) => (
            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {academicYears.length > 0 && (
        <Select
          value={searchParams.get('academic_year') ?? 'all'}
          onValueChange={(v) => updateParam('academic_year', v)}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All years" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All years</SelectItem>
            {academicYears.map((y) => (
              <SelectItem key={y} value={y}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearAll} className="text-slate-500">
          <X className="w-4 h-4 mr-1" />
          Clear filters
        </Button>
      )}
    </div>
  )
}
