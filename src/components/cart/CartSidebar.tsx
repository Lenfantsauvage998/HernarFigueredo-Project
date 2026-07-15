import React from 'react'
import { X, ShoppingCart, Trash2, Plus, Minus, BookOpen } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartStore, unitPrice } from '../../store/cartStore'
import { useAuthStore } from '../../store/authStore'
import Button from '../ui/Button'

const CartSidebar: React.FC = () => {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotal, clearCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const total = getTotal()

  const handleCheckout = () => {
    closeCart()
    if (!isAuthenticated) {
      navigate('/auth')
    } else {
      navigate('/checkout')
    }
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Sidebar panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-[#1f1d1d] shadow-2xl z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} className="text-[#f26822]" />
            <h2 className="font-semibold text-white">Tu carrito</h2>
            {items.length > 0 && (
              <span className="bg-[#f26822] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                <ShoppingCart size={28} className="text-white/30" />
              </div>
              <div>
                <p className="font-medium text-white">Tu carrito está vacío</p>
                <p className="text-sm text-white/40 mt-1">Echa un vistazo a los libros para empezar</p>
              </div>
              <Link
                to="/libros"
                onClick={closeCart}
                className="text-sm font-semibold text-[#f26822] hover:text-[#d45c1a]"
              >
                Ver libros
              </Link>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div key={`${item.service.id}-${item.format}`} className="flex gap-4 p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-14 h-14 bg-[#f26822]/10 rounded-lg flex-shrink-0 flex items-center justify-center">
                    {item.service.image_url ? (
                      <img
                        src={item.service.image_url}
                        alt={item.service.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <BookOpen size={20} className="text-[#f26822]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white line-clamp-1">{item.service.title}</p>
                    <p className="text-xs text-white/40">{item.format === 'EPUB' ? 'EPUB' : 'Físico'}</p>
                    <p className="text-sm font-bold text-[#f26822] mt-1">
                      ${(unitPrice(item.service, item.format) * item.quantity).toLocaleString('es-CO')}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeItem(item.service.id, item.format)}
                      className="text-white/30 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.service.id, item.format, item.quantity - 1)}
                        className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center hover:bg-[#f26822]/20 transition-colors text-white"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-semibold w-6 text-center text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.service.id, item.format, item.quantity + 1)}
                        className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center hover:bg-[#f26822]/20 transition-colors text-white"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={clearCart}
                className="text-xs text-white/30 hover:text-red-400 transition-colors w-full text-right"
              >
                Vaciar carrito
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">Subtotal</span>
              <span className="font-bold text-white">
                {total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
              </span>
            </div>
            <p className="text-xs text-white/30">El total final se muestra al finalizar la compra</p>
            <Button
              onClick={handleCheckout}
              variant="primary"
              className="w-full"
              size="lg"
            >
              {isAuthenticated ? 'Pagar ahora' : 'Ingresar para continuar'}
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

export default CartSidebar
