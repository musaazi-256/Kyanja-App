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
): Promise<string> {
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
  return publicUrl
}

/**
 * Upload one or both hero background images (desktop / mobile).
 * formData fields: desktop_image (File), mobile_image (File) — at least one required.
 */
export async function uploadHeroImages(
  formData: FormData,
): Promise<ActionResult<{ desktopUrl?: string; mobileUrl?: string }>> {
  try {
    await requirePermission('content:write')

    const desktopFile = formData.get('desktop_image') as File | null
    const mobileFile  = formData.get('mobile_image')  as File | null

    const hasDesktop = !!desktopFile && desktopFile.size > 0
    const hasMobile  = !!mobileFile  && mobileFile.size  > 0

    if (!hasDesktop && !hasMobile) {
      throw new ValidationError('Please select at least one image')
    }

    const admin = createAdminClient()
    const result: { desktopUrl?: string; mobileUrl?: string } = {}
    const upserts: { key: string; value: string; updated_at: string }[] = []
    const now = new Date().toISOString()

    if (hasDesktop) {
      result.desktopUrl = await validateAndUpload(admin, desktopFile!, 'desktop')
      upserts.push({ key: 'hero_image_url_desktop', value: result.desktopUrl, updated_at: now })
    }
    if (hasMobile) {
      result.mobileUrl = await validateAndUpload(admin, mobileFile!, 'mobile')
      upserts.push({ key: 'hero_image_url_mobile', value: result.mobileUrl, updated_at: now })
    }

    const { error: settingsError } = await admin
      .from('site_settings')
      .upsert(upserts, { onConflict: 'key' })

    if (settingsError) throw new AppError(settingsError.message, 'DB_ERROR', 400)

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
