'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requirePermission } from '@/lib/rbac/check'
import { BUCKETS, ALLOWED_IMAGE_TYPES, MAX_FILE_SIZES } from '@/lib/storage/buckets'
import { ok, fail } from '@/lib/utils/response'
import type { ActionResult, MediaContext } from '@/types/app'
import { revalidatePath } from 'next/cache'

async function ensureBucketExists(bucket: string) {
  const admin = createAdminClient()
  const { data: existing, error: getError } = await admin.storage.getBucket(bucket)

  if (!getError && existing) return

  const { error: createError } = await admin.storage.createBucket(bucket, {
    public: bucket === BUCKETS.GALLERY || bucket === BUCKETS.MEDIA || bucket === BUCKETS.AVATARS,
  })

  // Ignore "already exists" race; bubble up real failures.
  if (createError && !/already exists/i.test(createError.message)) {
    throw createError
  }
}

export async function uploadMedia(formData: FormData): Promise<ActionResult<{ url: string; id: string }>> {
  try {
    const profile = await requirePermission('media:upload')

    const file     = formData.get('file') as File | null
    const context  = (formData.get('context') as MediaContext) ?? 'gallery'
    const altText  = formData.get('alt_text') as string | null
    const caption  = formData.get('caption') as string | null

    if (!file || file.size === 0) return fail(new Error('No file provided'))

    const bucket = context === 'gallery' ? BUCKETS.GALLERY : BUCKETS.MEDIA
    const maxSize = MAX_FILE_SIZES[bucket]

    if (file.size > maxSize) return fail(new Error(`File exceeds maximum size`))
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return fail(new Error('File type not allowed'))

    await ensureBucketExists(bucket)

    const supabase = await createClient()
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const uuid = crypto.randomUUID()
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const storagePath = `${context}/${year}/${month}/${uuid}-${safeName}`

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(storagePath, file, { contentType: file.type, upsert: false })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(storagePath)

    const { data: mediaRecord, error: dbError } = await supabase
      .from('media_files')
      .insert({
        bucket:       bucket,
        storage_path: storagePath,
        public_url:   publicUrl,
        file_name:    file.name,
        file_size:    file.size,
        mime_type:    file.type,
        context,
        alt_text:    altText ?? null,
        caption:     caption ?? null,
        uploaded_by: profile.id,
      })
      .select('id')
      .single()

    if (dbError) throw dbError

    revalidatePath('/dashboard/media')
    return ok({ url: publicUrl, id: mediaRecord.id })
  } catch (err) {
    console.error('[media] upload failed', err)
    return fail(err)
  }
}

export async function deleteMedia(id: string): Promise<ActionResult<void>> {
  try {
    await requirePermission('media:delete')
    const supabase = await createClient()

    const { error } = await supabase
      .from('media_files')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error

    revalidatePath('/dashboard/media')
    return ok(undefined, 'File deleted')
  } catch (err) {
    return fail(err)
  }
}
