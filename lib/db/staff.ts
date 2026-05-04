import { createClient } from '@/lib/supabase/server'
import type { StaffMember } from '@/types/app'

// The `staff_members` table is added via migration 012.
// Run the following SQL in the Supabase SQL Editor to create it:
//
//   create table staff_members (
//     id          uuid primary key default gen_random_uuid(),
//     name        text not null,
//     position    text not null,
//     category    text not null check (category in ('admin','teaching','non_teaching')),
//     photo_url   text,
//     featured    boolean not null default false,
//     sort_order  int not null default 0,
//     created_at  timestamptz not null default now(),
//     updated_at  timestamptz not null default now()
//   );
//   alter table staff_members enable row level security;
//   create policy "Anon can read staff"
//     on staff_members for select to anon using (true);
//   create policy "Authenticated full access"
//     on staff_members for all to authenticated using (true) with check (true);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const table = (sb: any) => sb.from('staff_members')

/** Up to 3 featured members for the homepage. Build-safe (returns [] on any error). */
export async function getFeaturedStaff(): Promise<StaffMember[]> {
  try {
    const supabase = await createClient()
    const { data } = await table(supabase)
      .select('*')
      .eq('featured', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })
      .limit(3)
    return (data ?? []) as StaffMember[]
  } catch {
    return []
  }
}

/** All staff grouped for the public /team page. Build-safe. */
export async function getAllPublicStaff(): Promise<StaffMember[]> {
  try {
    const supabase = await createClient()
    const { data } = await table(supabase)
      .select('*')
      .order('category', { ascending: true })
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })
    return (data ?? []) as StaffMember[]
  } catch {
    return []
  }
}

/** All staff for the admin panel — throws on real DB errors. */
export async function getAllStaff(): Promise<StaffMember[]> {
  const supabase = await createClient()
  const { data, error } = await table(supabase)
    .select('*')
    .order('category', { ascending: true })
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })
  if (error) {
    const msg = (error as { message?: string }).message ?? ''
    if (msg.includes('relation') && msg.includes('does not exist')) {
      throw new Error(
        'The staff_members table does not exist. Please run migration 012 in the Supabase SQL Editor.',
      )
    }
    throw error
  }
  return (data ?? []) as StaffMember[]
}
