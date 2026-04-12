import { supabase } from '../lib/supabase'
import type { Payment } from '../types'

interface InitiatePaymentParams {
  orderId: string
  customerEmail?: string
  customerName?: string
  customerPhone?: string
  customerIdType?: string
  customerIdNumber?: string
}

export const initiatePayment = async (
  params: InitiatePaymentParams
): Promise<{ orderId: string; amount: number }> => {
  const { data: { session } } = await supabase.auth.getSession()

  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/initiate-payment`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify(params),
    }
  )

  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Payment initiation failed')
  return json
}

export const fetchPaymentByOrder = async (orderId: string): Promise<Payment | null> => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('order_id', orderId)
    .maybeSingle()

  if (error) throw error
  return data as Payment | null
}

export const checkPaymentLive = async (orderId: string): Promise<{ status: string }> => {
  const { data: { session } } = await supabase.auth.getSession()
  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/check-payment?orderId=${encodeURIComponent(orderId)}`,
    {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
    }
  )
  if (!res.ok) throw new Error('Failed to check payment status')
  return res.json()
}
