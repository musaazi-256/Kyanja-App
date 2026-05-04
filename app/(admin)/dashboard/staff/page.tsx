import { getAllStaff } from '@/lib/db/staff'
import { requirePermission } from '@/lib/rbac/check'
import StaffManager from '@/components/admin/staff/StaffManager'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Staff Members' }

const MIGRATION_SQL = `create table staff_members (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  position    text not null,
  category    text not null check (category in ('admin','teaching','non_teaching')),
  photo_url   text,
  featured    boolean not null default false,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
alter table staff_members enable row level security;
create policy "Anon can read staff"
  on staff_members for select to anon using (true);
create policy "Authenticated full access"
  on staff_members for all to authenticated using (true) with check (true);`

export default async function StaffPage() {
  await requirePermission('staff:read')

  let members: Awaited<ReturnType<typeof getAllStaff>> = []
  let migrationNeeded = false

  try {
    members = await getAllStaff()
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    if (msg.includes('migration 012') || msg.includes('does not exist')) {
      migrationNeeded = true
    } else {
      throw err
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Staff Members</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Manage staff profiles shown on the public{' '}
          <a href="/team" target="_blank" className="underline hover:text-slate-700">
            Our Team
          </a>{' '}
          page. Star members appear on the homepage.
        </p>
      </div>

      {migrationNeeded ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
          <p className="font-semibold mb-2">Database table not found</p>
          <p className="mb-3">
            The <code className="font-mono bg-amber-100 px-1 rounded">staff_members</code> table
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
          <pre className="bg-amber-100 rounded p-3 text-xs overflow-x-auto whitespace-pre-wrap">
            {MIGRATION_SQL}
          </pre>
        </div>
      ) : (
        <StaffManager members={members} />
      )}
    </div>
  )
}
