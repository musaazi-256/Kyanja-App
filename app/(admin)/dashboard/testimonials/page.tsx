import { getAllTestimonials } from '@/lib/db/testimonials'
import { requirePermission } from '@/lib/rbac/check'
import TestimonialsManager from '@/components/admin/testimonials/TestimonialsManager'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Testimonials' }

export default async function TestimonialsPage() {
  await requirePermission('testimonials:read')

  let testimonials = []
  let migrationNeeded = false

  try {
    testimonials = await getAllTestimonials()
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    if (msg.includes('migration 011')) {
      migrationNeeded = true
    } else {
      throw err
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Testimonials</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Manage parent quotes shown on the homepage.
        </p>
      </div>

      {migrationNeeded ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
          <p className="font-semibold mb-2">Database table not found</p>
          <p className="mb-3">
            The <code className="font-mono bg-amber-100 px-1 rounded">testimonials</code> table
            does not exist yet. Run the SQL below in your{' '}
            <a
              href="https://app.supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Supabase SQL Editor
            </a>{' '}
            to create it:
          </p>
          <pre className="bg-amber-100 rounded p-3 text-xs overflow-x-auto whitespace-pre-wrap">{`create table testimonials (
  id           uuid primary key default gen_random_uuid(),
  quote        text not null,
  author_name  text not null,
  author_detail text,
  initials     text,
  sort_order   int  not null default 0,
  published    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
alter table testimonials enable row level security;
create policy "Anon can read published testimonials"
  on testimonials for select to anon using (published = true);
create policy "Authenticated full access"
  on testimonials for all to authenticated using (true) with check (true);`}</pre>
        </div>
      ) : (
        <TestimonialsManager testimonials={testimonials} />
      )}
    </div>
  )
}
