'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requirePermission } from '@/lib/rbac/check'
import { BUCKETS, MAX_FILE_SIZES, ALLOWED_DOWNLOAD_TYPES } from '@/lib/storage/buckets'
import { ok, fail } from '@/lib/utils/response'
import type { ActionResult } from '@/types/app'
import { revalidatePath } from 'next/cache'

// The `downloads` table is added via migration 010. Cast to `any` to bypass
// the stale auto-generated types until `supabase gen types` is re-run.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const table = (sb: any) => sb.from('downloads')

const REVALIDATE = () => revalidatePath('/dashboard/downloads')

// ── Upload ────────────────────────────────────────────────────────────────────

export async function uploadDownload(
  formData: FormData,
): Promise<ActionResult<{ id: string; url: string }>> {
  try {
    const profile = await requirePermission('downloads:upload')

    const file    = formData.get('file')    as File   | null
    const name    = formData.get('name')    as string | null
    const subcopy = formData.get('subcopy') as string | null
    const icon    = formData.get('icon')    as string | null

    if (!file || file.size === 0) return fail(new Error('No file provided'))
    if (!name?.trim())            return fail(new Error('Name is required'))

    const maxSize = MAX_FILE_SIZES[BUCKETS.DOWNLOADS]
    if (file.size > maxSize) return fail(new Error('File exceeds 10 MB limit'))
    if (!ALLOWED_DOWNLOAD_TYPES.includes(file.type))
      return fail(new Error('File type not allowed'))

    const supabase    = await createClient()
    const now         = new Date()
    const year        = now.getFullYear()
    const month       = String(now.getMonth() + 1).padStart(2, '0')
    const uuid        = crypto.randomUUID()
    const safeName    = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const storagePath = `${year}/${month}/${uuid}-${safeName}`

    const { error: uploadError } = await supabase.storage
      .from(BUCKETS.DOWNLOADS)
      .upload(storagePath, file, { contentType: file.type, upsert: false })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from(BUCKETS.DOWNLOADS)
      .getPublicUrl(storagePath)

    const { data: row, error: dbError } = await table(supabase)
      .insert({
        name:         name.trim(),
        subcopy:      subcopy?.trim() || null,
        icon:         icon ?? 'file-text',
        storage_path: storagePath,
        public_url:   publicUrl,
        file_name:    file.name,
        file_size:    file.size,
        mime_type:    file.type,
        published:    false,
        uploaded_by:  profile.id,
      })
      .select('id')
      .single()

    if (dbError) throw dbError

    REVALIDATE()
    return ok({ id: row.id, url: publicUrl })
  } catch (err) {
    console.error('[downloads] upload failed', err)
    return fail(err)
  }
}

// ── Edit metadata ─────────────────────────────────────────────────────────────

export async function editDownload(
  id: string,
  data: { name: string; subcopy?: string; icon?: string },
): Promise<ActionResult<void>> {
  try {
    await requirePermission('downloads:edit')
    if (!data.name?.trim()) return fail(new Error('Name is required'))

    const supabase = await createClient()
    const { error } = await table(supabase)
      .update({
        name:       data.name.trim(),
        subcopy:    data.subcopy?.trim() || null,
        icon:       data.icon ?? 'file-text',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) throw error
    REVALIDATE()
    return ok(undefined, 'Download updated')
  } catch (err) {
    return fail(err)
  }
}

// ── Publish / Unpublish ───────────────────────────────────────────────────────

export async function setDownloadPublished(
  id: string,
  published: boolean,
): Promise<ActionResult<void>> {
  try {
    await requirePermission('downloads:publish')
    const supabase = await createClient()
    const { error } = await table(supabase)
      .update({ published, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error
    REVALIDATE()
    revalidatePath('/')
    return ok(undefined, published ? 'Published' : 'Unpublished')
  } catch (err) {
    return fail(err)
  }
}

// ── Delete (soft) ─────────────────────────────────────────────────────────────

export async function deleteDownload(id: string): Promise<ActionResult<void>> {
  try {
    await requirePermission('downloads:delete')
    const admin = createAdminClient()
    const { error } = await table(admin)
      .update({ deleted_at: new Date().toISOString(), published: false })
      .eq('id', id)

    if (error) throw error
    REVALIDATE()
    revalidatePath('/')
    return ok(undefined, 'Deleted')
  } catch (err) {
    return fail(err)
  }
}
