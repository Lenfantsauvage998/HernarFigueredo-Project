import React from 'react'
import type { OrderStatus, PaymentStatus } from '../../types'

type BadgeVariant = 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'gray'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  accent: 'bg-[#c4501a]/20 text-[#c4501a]',
  success: 'bg-green-500/20 text-green-400',
  warning: 'bg-yellow-500/20 text-yellow-400',
  danger: 'bg-red-500/20 text-red-400',
  info: 'bg-blue-500/20 text-blue-400',
  gray: 'bg-white/10 text-white/60',
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'accent', className = '' }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variantClasses[variant]} ${className}`}
  >
    {children}
  </span>
)

export default Badge

export const OrderStatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const variants: Record<OrderStatus, BadgeVariant> = {
    PENDING: 'warning',
    PROCESSING: 'info',
    COMPLETED: 'success',
    CANCELLED: 'danger',
  }
  const labels: Record<OrderStatus, string> = {
    PENDING: 'Pendiente',
    PROCESSING: 'Procesando',
    COMPLETED: 'Completado',
    CANCELLED: 'Cancelado',
  }
  return <Badge variant={variants[status]}>{labels[status]}</Badge>
}

export const PaymentStatusBadge: React.FC<{ status: PaymentStatus }> = ({ status }) => {
  const variants: Record<PaymentStatus, BadgeVariant> = {
    PENDING: 'warning',
    APPROVED: 'success',
    DECLINED: 'danger',
    VOIDED: 'gray',
    ERROR: 'danger',
  }
  return <Badge variant={variants[status]}>{status}</Badge>
}
