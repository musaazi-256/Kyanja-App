/**
 * Converts a Supabase public storage URL to the render/image endpoint
 * which serves on-the-fly resized and quality-compressed images via CDN.
 *
 * Non-Supabase URLs (Unsplash, ibb.co, etc.) are returned unchanged so
 * the helper is safe to call on any image src.
 */
export function imageUrl(
  src: string,
  { width, quality = 80 }: { width?: number; quality?: number } = {},
): string {
  if (!src || !src.includes('/storage/v1/object/public/')) return src
  const [base] = src.split('?')
  const renderBase = base.replace(
    '/storage/v1/object/public/',
    '/storage/v1/render/image/public/',
  )
  const params = new URLSearchParams()
  if (width) params.set('width', String(width))
  params.set('quality', String(quality))
  return `${renderBase}?${params}`
}
