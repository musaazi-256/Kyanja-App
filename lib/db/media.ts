import { createClient } from '@/lib/supabase/server'
import type { MediaFile, MediaFilters, PaginatedResult } from '@/types/app'

export async function getMediaFiles(
  filters: MediaFilters = {},
): Promise<PaginatedResult<MediaFile>> {
  const supabase = await createClient()
  const { context, search, page = 1, pageSize = 40 } = filters

  let query = supabase
    .from('media_files')
    .select('*', { count: 'exact' })
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (context)  query = query.eq('context', context)
  if (search)   query = query.ilike('file_name', `%${search}%`)

  const from = (page - 1) * pageSize
  query = query.range(from, from + pageSize - 1)

  const { data, error, count } = await query
  if (error) throw error

  return {
    data: (data ?? []) as unknown as MediaFile[],
    meta: { page, pageSize, total: count ?? 0, totalPages: Math.ceil((count ?? 0) / pageSize) },
  }
}

export async function getCarouselImages(): Promise<MediaFile[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('media_files')
      .select('*')
      .filter('context', 'eq', 'carousel')
      .is('deleted_at', null)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
    return (data ?? []) as unknown as MediaFile[]
  } catch {
    return []
  }
}

export async function getNewsImages(): Promise<MediaFile[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('media_files')
      .select('*')
      .filter('context', 'eq', 'news')
      .is('deleted_at', null)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
    return (data ?? []) as unknown as MediaFile[]
  } catch {
    return []
  }
}

export async function getGalleryImages(): Promise<MediaFile[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('media_files')
      .select('*')
      .eq('context', 'gallery')
      .is('deleted_at', null)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
    return (data ?? []) as unknown as MediaFile[]
  } catch {
    // Keep public gallery page build-safe when env vars are unavailable at build time.
    return []
  }
}
