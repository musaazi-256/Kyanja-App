'use server'

import { createClient } from '@/lib/supabase/server'
import { requirePermission } from '@/lib/rbac/check'
import { revalidatePath } from 'next/cache'
import type { ActionResult, Testimonial } from '@/types/app'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const table = (sb: any) => sb.from('testimonials')

export async function createTestimonial(
  data: Pick<Testimonial, 'quote' | 'author_name' | 'author_detail' | 'initials' | 'sort_order' | 'published'>,
): Promise<ActionResult<Testimonial>> {
  await requirePermission('testimonials:write')
  const supabase = await createClient()
  const { data: row, error } = await table(supabase)
    .insert({ ...data, updated_at: new Date().toISOString() })
    .select()
    .single()
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  revalidatePath('/dashboard/testimonials')
  return { success: true, data: row as Testimonial }
}

export async function updateTestimonial(
  id: string,
  data: Partial<Pick<Testimonial, 'quote' | 'author_name' | 'author_detail' | 'initials' | 'sort_order' | 'published'>>,
): Promise<ActionResult<Testimonial>> {
  await requirePermission('testimonials:write')
  const supabase = await createClient()
  const { data: row, error } = await table(supabase)
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  revalidatePath('/dashboard/testimonials')
  return { success: true, data: row as Testimonial }
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  await requirePermission('testimonials:delete')
  const supabase = await createClient()
  const { error } = await table(supabase).delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  revalidatePath('/dashboard/testimonials')
  return { success: true, data: undefined }
}

export async function toggleTestimonialPublished(
  id: string,
  published: boolean,
): Promise<ActionResult> {
  await requirePermission('testimonials:publish')
  const supabase = await createClient()
  const { error } = await table(supabase)
    .update({ published, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  revalidatePath('/dashboard/testimonials')
  return { success: true, data: undefined }
}
