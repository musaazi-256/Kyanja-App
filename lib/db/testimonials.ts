import { createClient } from '@/lib/supabase/server'
import type { Testimonial } from '@/types/app'

// The `testimonials` table is added via migration 011.
// Run the following SQL in the Supabase SQL Editor to create it:
//
//   create table testimonials (
//     id           uuid primary key default gen_random_uuid(),
//     quote        text not null,
//     author_name  text not null,
//     author_detail text,
//     initials     text,
//     sort_order   int  not null default 0,
//     published    boolean not null default true,
//     created_at   timestamptz not null default now(),
//     updated_at   timestamptz not null default now()
//   );
//   alter table testimonials enable row level security;
//   create policy "Anon can read published testimonials"
//     on testimonials for select to anon using (published = true);
//   create policy "Authenticated full access"
//     on testimonials for all to authenticated using (true) with check (true);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const table = (sb: any) => sb.from('testimonials')

/** Published testimonials for the public homepage — build-safe. */
export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  try {
    const supabase = await createClient()
    const { data } = await table(supabase)
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })
    return (data ?? []) as Testimonial[]
  } catch {
    return []
  }
}

/** All testimonials (including unpublished) for the admin panel. */
export async function getAllTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient()
  const { data, error } = await table(supabase)
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
  if (error) {
    const msg = (error as { message?: string }).message ?? ''
    if (msg.includes('relation') && msg.includes('does not exist')) {
      throw new Error(
        'The testimonials table does not exist. Please run migration 011 in the Supabase SQL Editor.',
      )
    }
    throw error
  }
  return (data ?? []) as Testimonial[]
}
