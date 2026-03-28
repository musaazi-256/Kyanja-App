import { GENERAL_IMAGE_TYPES, MAX_IMAGE_BYTES } from '@/lib/media/image-rules'

export const BUCKETS = {
  GALLERY:   'gallery',
  MEDIA:     'media',
  DOCUMENTS: 'documents',
  AVATARS:   'avatars',
  IMPORTS:   'imports',
  DOWNLOADS: 'downloads',
} as const

export type BucketName = (typeof BUCKETS)[keyof typeof BUCKETS]

export const PUBLIC_BUCKETS: BucketName[] = [BUCKETS.GALLERY, BUCKETS.MEDIA, BUCKETS.AVATARS, BUCKETS.DOWNLOADS]

/** Max sizes in bytes */
export const MAX_FILE_SIZES: Record<BucketName, number> = {
  gallery:   MAX_IMAGE_BYTES,   // 3 MB
  media:     MAX_IMAGE_BYTES,
  documents: 50 * 1024 * 1024,  // 50 MB
  avatars:   2 * 1024 * 1024,   // 2 MB
  imports:   5 * 1024 * 1024,   // 5 MB
  downloads: 10 * 1024 * 1024,  // 10 MB
}

export const ALLOWED_IMAGE_TYPES = [...GENERAL_IMAGE_TYPES]
export const ALLOWED_DOC_TYPES   = ['application/pdf', 'text/csv']
export const ALLOWED_DOWNLOAD_TYPES = [
  'application/pdf',
  'text/csv',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]
