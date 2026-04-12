import { useQuery } from '@tanstack/react-query'
import { fetchBooks, type BookFilters } from '../services/books'

export const useBooks = (filters: BookFilters = {}) =>
  useQuery({
    queryKey: ['books', filters],
    queryFn: () => fetchBooks(filters),
    staleTime: 1000 * 60 * 5,
  })
