export type Role = 'user' | 'admin'

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED'

export type PaymentStatus = 'PENDING' | 'APPROVED' | 'DECLINED' | 'VOIDED' | 'ERROR'

export type PaymentMethod = 'PSE' | 'CARD' | 'EFECTY' | 'DAVIPLATA' | 'SAFETYPAY' | 'OTHER'

export interface Profile {
  id: string
  name: string
  role: Role
  created_at: string
}

export interface User extends Profile {
  email: string
  phone?: string | null
}

// Books are stored as services with category='LIBRO'
export interface Book {
  id: string
  title: string
  description: string
  category: 'LIBRO'
  price: number
  image_url: string | null
  image_urls: string[]
  features: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  service_id: string
  quantity: number
  price: number
  service?: Book
}

export interface Order {
  id: string
  user_id: string
  status: OrderStatus
  total_amount: number
  created_at: string
  updated_at: string
  items?: OrderItem[]
  payment?: Payment
}

export interface Payment {
  id: string
  order_id: string
  gateway: string
  gateway_ref: string | null
  status: PaymentStatus
  amount: number
  currency: string
  method: PaymentMethod | null
  created_at: string
  updated_at: string
}

export interface CartItem {
  service: Book
  quantity: number
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pendiente',
  PROCESSING: 'Procesando',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  PSE: 'PSE (Transferencia bancaria)',
  CARD: 'Tarjeta Crédito / Débito',
  EFECTY: 'Efecty',
  DAVIPLATA: 'Daviplata',
  SAFETYPAY: 'SafetyPay',
  OTHER: 'Otro',
}
