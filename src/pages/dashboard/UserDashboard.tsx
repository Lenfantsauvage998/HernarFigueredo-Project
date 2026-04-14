import React, { useState, useEffect } from 'react'
import { Package, Clock, CheckCircle2, XCircle, BookOpen, ArrowRight, Copy, Check, X } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../../store/authStore'
import { useMyOrders } from '../../hooks/useOrders'
import { OrderStatusBadge } from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import type { Order, OrderStatus } from '../../types'

const CopyId: React.FC<{ id: string }> = ({ id }) => {
  const [copied, setCopied] = useState(false)
  const handle = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={handle} className="ml-1 p-0.5 rounded hover:bg-white/10 text-white/30 hover:text-[#c4501a] transition-colors" title="Copiar ID">
      {copied ? <Check size={12} className="text-[#c4501a]" /> : <Copy size={12} />}
    </button>
  )
}

const statusIcons: Record<OrderStatus, React.ReactNode> = {
  PENDING: <Clock size={16} className="text-yellow-400" />,
  PROCESSING: <Package size={16} className="text-blue-400" />,
  COMPLETED: <CheckCircle2 size={16} className="text-green-400" />,
  CANCELLED: <XCircle size={16} className="text-red-400" />,
}

const UserDashboard: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [])

  const { user } = useAuthStore()
  const { data: orders = [], isLoading } = useMyOrders()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const [showToast, setShowToast] = useState(() => searchParams.get('new') === '1')
  const queryClient = useQueryClient()

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      setSearchParams({}, { replace: true })
      queryClient.invalidateQueries({ queryKey: ['my-orders'] })
      const t = setTimeout(() => setShowToast(false), 6000)
      return () => clearTimeout(t)
    }
  }, [])

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'PENDING').length,
    processing: orders.filter((o) => o.status === 'PROCESSING').length,
    completed: orders.filter((o) => o.status === 'COMPLETED').length,
  }

  return (
    <div className="min-h-screen bg-[#2c2b2b] pt-24 md:pt-36 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[#c4501a] text-sm font-semibold uppercase tracking-widest mb-2">Mi cuenta</p>
          <h1 className="text-3xl font-bold text-white">
            Bienvenido, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-white/40 mt-1">{user?.email}</p>
        </div>

        {/* Purchase success toast */}
        {showToast && (
          <div className="mb-8 flex items-start gap-4 bg-green-500/10 border border-green-500/20 rounded-2xl px-5 py-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 size={20} className="text-green-400" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-green-400 text-sm">¡Compra realizada exitosamente!</p>
              <p className="text-green-400/60 text-xs mt-0.5">Tu orden ha sido registrada y está siendo procesada.</p>
            </div>
            <button onClick={() => setShowToast(false)} className="text-green-400/40 hover:text-green-400 transition-colors flex-shrink-0">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total', value: stats.total, icon: <BookOpen size={20} className="text-white/30" /> },
            { label: 'Pendiente', value: stats.pending, icon: <Clock size={20} className="text-yellow-400" /> },
            { label: 'Procesando', value: stats.processing, icon: <Package size={20} className="text-blue-400" /> },
            { label: 'Completado', value: stats.completed, icon: <CheckCircle2 size={20} className="text-green-400" /> },
          ].map((s) => (
            <div key={s.label} className="bg-[#1a1b1c] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-white/30 uppercase tracking-wider">{s.label}</span>
                {s.icon}
              </div>
              <div className="text-3xl font-bold text-white">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Orders table */}
        <div className="bg-[#1a1b1c] border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
            <h2 className="font-semibold text-white">Mis órdenes</h2>
            <Link
              to="/libros"
              className="flex items-center gap-1 text-sm text-[#c4501a] hover:text-[#d45c1a] transition-colors font-semibold"
            >
              Comprar más <ArrowRight size={14} />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen size={28} className="text-white/20" />
              </div>
              <p className="font-medium text-white">Aún no tienes órdenes</p>
              <p className="text-white/30 text-sm mt-1 mb-6">Empieza explorando los libros de Hernan</p>
              <Link
                to="/libros"
                className="inline-flex items-center gap-2 bg-[#c4501a] text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-[#d45c1a] transition-colors text-sm"
              >
                Ver libros
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    {['ID de orden', 'Fecha', 'Libros', 'Total', 'Estado', ''].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-white/30 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          {statusIcons[order.status]}
                          <span className="text-sm font-mono text-white/60">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </span>
                          <CopyId id={order.id} />
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-white/40">
                        {new Date(order.created_at).toLocaleDateString('es-CO', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      </td>
                      <td className="px-5 py-4 text-sm text-white/40">
                        {order.items?.length ?? '—'} libro{(order.items?.length ?? 0) !== 1 ? 's' : ''}
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-semibold text-white">
                          ${Number(order.total_amount).toLocaleString('es-CO')} COP
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-xs font-semibold text-[#c4501a] hover:text-[#d45c1a] transition-colors"
                        >
                          Detalles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Orden #${selectedOrder.id.slice(0, 8).toUpperCase()}`}
          size="lg"
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/40">
                  Realizada el {new Date(selectedOrder.created_at).toLocaleDateString('es-CO', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <p className="text-xs font-mono text-white/20">{selectedOrder.id}</p>
                  <CopyId id={selectedOrder.id} />
                </div>
              </div>
              <OrderStatusBadge status={selectedOrder.status} />
            </div>

            <div className="space-y-3">
              {selectedOrder.items?.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                  <div className="w-12 h-12 bg-[#c4501a]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen size={18} className="text-[#c4501a]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{item.service?.title || 'Libro'}</p>
                    <p className="text-xs text-white/30">Libro digital</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">×{item.quantity}</p>
                    <p className="text-xs text-white/30">${Number(item.price).toLocaleString('es-CO')} c/u</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4">
              <div className="flex justify-between font-bold">
                <span className="text-white">Total</span>
                <span className="text-[#c4501a] text-lg">
                  ${Number(selectedOrder.total_amount).toLocaleString('es-CO')} COP
                </span>
              </div>
            </div>

            {selectedOrder.payment && (
              <div className="bg-white/5 rounded-xl p-4 text-sm">
                <p className="font-semibold text-white mb-2">Info de pago</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-white/40">Método</span>
                  <span className="font-medium text-white">{selectedOrder.payment.method || 'N/A'}</span>
                  <span className="text-white/40">Estado</span>
                  <span className="font-medium text-white">{selectedOrder.payment.status}</span>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}

export default UserDashboard
