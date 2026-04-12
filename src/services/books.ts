import { supabase } from '../lib/supabase'
import type { Book } from '../types'

export interface BookFilters {
  search?: string
  minPrice?: number
  maxPrice?: number
}

export const fetchBooks = async (filters: BookFilters = {}): Promise<Book[]> => {
  let query = supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .eq('category', 'LIBRO')

  if (filters.search) query = query.ilike('title', `%${filters.search}%`)
  if (filters.minPrice !== undefined) query = query.gte('price', filters.minPrice)
  if (filters.maxPrice !== undefined) query = query.lte('price', filters.maxPrice)

  query = query.order('created_at', { ascending: false })

  const { data, error } = await query
  if (error) throw error
  return (data as Book[]) ?? []
}
