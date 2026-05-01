export const MAX_IMAGE_BYTES = 20 * 1024 * 1024

export const GENERAL_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const

export const HERO_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const

export function fileAcceptList(types: readonly string[]): string {
  return types.join(',')
}

export function imageTypeLabel(types: readonly string[]): string {
  return types
    .map((type) => type.replace('image/', '').toUpperCase())
    .join(' · ')
}

export function validateImageFile(
  file: File,
  allowedTypes: readonly string[],
  maxBytes = MAX_IMAGE_BYTES,
): string | null {
  if (!allowedTypes.includes(file.type)) {
    return `Only ${imageTypeLabel(allowedTypes)} images are accepted`
  }
  if (file.size > maxBytes) return 'Image must be under 20 MB'
  return null
}
