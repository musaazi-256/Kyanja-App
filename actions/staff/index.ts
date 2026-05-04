'use server'

import { createClient } from '@/lib/supabase/server'
import { requirePermission } from '@/lib/rbac/check'
import { revalidatePath } from 'next/cache'
import type { ActionResult, StaffMember, StaffCategory } from '@/types/app'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const table = (sb: any) => sb.from('staff_members')

type StaffWriteData = {
  name:       string
  position:   string
  category:   StaffCategory
  photo_url:  string | null
  featured:   boolean
  sort_order: number
}

export async function createStaffMember(data: StaffWriteData): Promise<ActionResult<StaffMember>> {
  await requirePermission('staff:write')
  const supabase = await createClient()
  const { data: row, error } = await table(supabase)
    .insert({ ...data, updated_at: new Date().toISOString() })
    .select()
    .single()
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  revalidatePath('/team')
  revalidatePath('/dashboard/staff')
  return { success: true, data: row as StaffMember }
}

export async function updateStaffMember(
  id: string,
  data: Partial<StaffWriteData>,
): Promise<ActionResult<StaffMember>> {
  await requirePermission('staff:write')
  const supabase = await createClient()
  const { data: row, error } = await table(supabase)
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  revalidatePath('/team')
  revalidatePath('/dashboard/staff')
  return { success: true, data: row as StaffMember }
}

export async function deleteStaffMember(id: string): Promise<ActionResult> {
  await requirePermission('staff:delete')
  const supabase = await createClient()
  const { error } = await table(supabase).delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  revalidatePath('/team')
  revalidatePath('/dashboard/staff')
  return { success: true, data: undefined }
}

export async function toggleStaffFeatured(id: string, featured: boolean): Promise<ActionResult> {
  await requirePermission('staff:write')
  const supabase = await createClient()
  const { error } = await table(supabase)
    .update({ featured, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  revalidatePath('/dashboard/staff')
  return { success: true, data: undefined }
}
