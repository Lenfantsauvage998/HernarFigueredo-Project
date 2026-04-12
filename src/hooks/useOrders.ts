import { useQuery } from '@tanstack/react-query'
import { fetchMyOrders, fetchOrder } from '../services/orders'

export const useMyOrders = () =>
  useQuery({
    queryKey: ['my-orders'],
    queryFn: fetchMyOrders,
    staleTime: 0,
    refetchOnWindowFocus: true,
  })

export const useOrder = (id: string) =>
  useQuery({
    queryKey: ['order', id],
    queryFn: () => fetchOrder(id),
    enabled: !!id,
  })
