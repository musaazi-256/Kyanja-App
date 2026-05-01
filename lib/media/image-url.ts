/**
 * Returns a clean Supabase storage URL, stripping any stale query params
 * (e.g. the old ?width=1200 or ?t=timestamp cache-busters).
 *
 * next/image handles all resizing, WebP conversion, and caching on its own,
 * so no server-side transform endpoint is needed. Non-Supabase URLs
 * (Unsplash, ibb.co, etc.) are returned unchanged.
 *
 * The width/quality parameters are accepted but intentionally unused —
 * they serve as documentation of the intended display size and can be
 * wired to Supabase's render endpoint once the project upgrades to Pro.
 */
export function imageUrl(
  src: string | null | undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _options: { width?: number; quality?: number } = {},
): string {
  if (!src || !src.includes('/storage/v1/object/public/')) return src ?? ''
  const [base] = src.split('?')
  return base
}
