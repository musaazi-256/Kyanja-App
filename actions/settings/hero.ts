'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { requirePermission } from '@/lib/rbac/check'
import { ok, fail } from '@/lib/utils/response'
import { AppError, ValidationError } from '@/lib/utils/errors'
import type { ActionResult } from '@/types/app'

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_BYTES      = 3 * 1024 * 1024   // 3 MB per image
const BUCKET         = 'media'

function fileExt(type: string) {
  return type === 'image/jpeg' ? 'jpg' : type.split('/')[1]
}

async function validateAndUpload(
  admin: ReturnType<typeof createAdminClient>,
  file: File,
  variant: 'desktop' | 'mobile',
): Promise<{ publicUrl: string; storagePath: string }> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new ValidationError('Only JPEG, PNG and WEBP images are accepted')
  }
  if (file.size > MAX_BYTES) {
    throw new ValidationError('Each image must be under 3 MB')
  }

  const storagePath = `hero/background-${variant}.${fileExt(file.type)}`

  const { error: uploadError } = await admin.storage
    .from(BUCKET)
    .upload(storagePath, await file.arrayBuffer(), {
      contentType: file.type,
      upsert: true,
    })

  if (uploadError) throw new AppError(uploadError.message, 'UPLOAD_ERROR', 400)

  const { data: { publicUrl } } = admin.storage.from(BUCKET).getPublicUrl(storagePath)
  return { publicUrl, storagePath }
}

/**
 * Upload one or both hero background images (desktop / mobile).
 * formData fields: desktop_image (File), mobile_image (File) — at least one required.
 */
export async function uploadHeroImages(
  formData: FormData,
): Promise<ActionResult<{ desktopUrl?: string; mobileUrl?: string }>> {
  try {
    const profile = await requirePermission('content:write')

    const desktopFile = formData.get('desktop_image') as File | null
    const mobileFile  = formData.get('mobile_image')  as File | null

    const hasDesktop = !!desktopFile && desktopFile.size > 0
    const hasMobile  = !!mobileFile  && mobileFile.size  > 0

    if (!hasDesktop && !hasMobile) {
      throw new ValidationError('Please select at least one image')
    }

    const admin = createAdminClient()
    const result: { desktopUrl?: string; mobileUrl?: string } = {}
    const settingsUpserts: { key: string; value: string; updated_at: string }[] = []
    const mediaUpserts: {
      bucket: string; storage_path: string; public_url: string
      file_name: string; file_size: number; mime_type: string
      context: 'hero'; alt_text: string; uploaded_by: string
    }[] = []
    const now = new Date().toISOString()

    if (hasDesktop) {
      const { publicUrl, storagePath } = await validateAndUpload(admin, desktopFile!, 'desktop')
      // Cache-bust URL is stored in site_settings so every upload forces a fresh fetch.
      // The base URL (no ?t=) is stored in media_files for clean display in the library.
      const cacheBustedUrl = `${publicUrl}?t=${Date.now()}`
      result.desktopUrl = cacheBustedUrl
      settingsUpserts.push({ key: 'hero_image_url_desktop', value: cacheBustedUrl, updated_at: now })
      mediaUpserts.push({
        bucket:       BUCKET,
        storage_path: storagePath,
        public_url:   publicUrl,
        file_name:    'Hero – Desktop',
        file_size:    desktopFile!.size,
        mime_type:    desktopFile!.type,
        context:      'hero',
        alt_text:     'Homepage hero desktop image',
        uploaded_by:  profile.id,
      })
    }

    if (hasMobile) {
      const { publicUrl, storagePath } = await validateAndUpload(admin, mobileFile!, 'mobile')
      const cacheBustedUrl = `${publicUrl}?t=${Date.now()}`
      result.mobileUrl = cacheBustedUrl
      settingsUpserts.push({ key: 'hero_image_url_mobile', value: cacheBustedUrl, updated_at: now })
      mediaUpserts.push({
        bucket:       BUCKET,
        storage_path: storagePath,
        public_url:   publicUrl,
        file_name:    'Hero – Mobile',
        file_size:    mobileFile!.size,
        mime_type:    mobileFile!.type,
        context:      'hero',
        alt_text:     'Homepage hero mobile image',
        uploaded_by:  profile.id,
      })
    }

    const { error: settingsError } = await admin
      .from('site_settings')
      .upsert(settingsUpserts, { onConflict: 'key' })

    if (settingsError) throw new AppError(settingsError.message, 'DB_ERROR', 400)

    // Track hero images in media_files so they appear in the Media Library.
    // storage_path is the conflict key — re-uploading updates the existing record.
    if (mediaUpserts.length > 0) {
      const { error: mediaError } = await admin
        .from('media_files')
        .upsert(mediaUpserts, { onConflict: 'storage_path' })

      if (mediaError) {
        // Non-fatal — the image is live even if the library record fails.
        console.error('[hero] media_files upsert failed', mediaError)
      }
    }

    revalidatePath('/')
    revalidatePath('/dashboard/media')
    revalidatePath('/dashboard/settings')

    const label =
      hasDesktop && hasMobile ? 'Desktop and mobile hero images updated' :
      hasDesktop               ? 'Desktop hero image updated' :
                                 'Mobile hero image updated'

    return ok(result, label)
  } catch (err) {
    return fail(err)
  }
}
