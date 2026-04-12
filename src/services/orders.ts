import { supabase } from '../lib/supabase'
import type { Order } from '../types'

export const fetchMyOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(
        *,
        service:services(id, title, category, price, image_url)
      ),
      payment:payments(*)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as Order[]) ?? []
}

export const fetchOrder = async (id: string): Promise<Order> => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(
        *,
        service:services(id, title, category, price, image_url)
      ),
      payment:payments(*)
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Order
}

export const createOrderDirect = async (
  items: { serviceId: string; quantity: number }[],
  customerPhone?: string
): Promise<{ orderId: string; totalAmount: number }> => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: services, error: svcErr } = await supabase
    .from('services')
    .select('id, price')
    .in('id', items.map((i) => i.serviceId))
    .eq('is_active', true)
  if (svcErr) throw svcErr

  const priceMap = Object.fromEntries((services ?? []).map((s: { id: string; price: number }) => [s.id, s.price]))
  const totalAmount = items.reduce((sum, item) => sum + (priceMap[item.serviceId] ?? 0) * item.quantity, 0)

  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({ user_id: user.id, status: 'PENDING', total_amount: totalAmount, customer_phone: customerPhone ?? null })
    .select('id')
    .single()
  if (orderErr) throw orderErr

  const { error: itemsErr } = await supabase
    .from('order_items')
    .insert(items.map((item) => ({
      order_id: order.id,
      service_id: item.serviceId,
      quantity: item.quantity,
      price: priceMap[item.serviceId] ?? 0,
    })))
  if (itemsErr) throw itemsErr

  return { orderId: order.id, totalAmount }
}

export const cancelOrder = async (orderId: string): Promise<void> => {
  const { error } = await supabase.rpc('cancel_my_order', { p_order_id: orderId })
  if (error) throw error
}

export const patchOrderPhone = async (orderId: string, phone: string): Promise<void> => {
  await supabase.from('orders').update({ customer_phone: phone }).eq('id', orderId)
}

export const createOrderViaEdgeFunction = async (
  items: { serviceId: string; quantity: number }[]
): Promise<{ orderId: string; totalAmount: number }> => {
  const { data: { session } } = await supabase.auth.getSession()

  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-order`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ items }),
    }
  )

  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Failed to create order')
  return json
}
