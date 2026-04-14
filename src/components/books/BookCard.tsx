import React from 'react'
import { BookOpen, ShoppingCart, Check } from 'lucide-react'
import { motion } from 'motion/react'
import { useCartStore } from '../../store/cartStore'
import type { Book } from '../../types'

interface BookCardProps {
  book: Book
  onClick: () => void
}

const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  const { addItem, items } = useCartStore()
  const inCart = items.some((i) => i.service.id === book.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem(book)
  }

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className="group cursor-pointer relative overflow-hidden rounded-2xl bg-[#1a1b1c] shadow-xl shadow-black/30"
      onClick={onClick}
    >
      {/* Book cover */}
      <div className="relative h-72 overflow-hidden bg-[#1a1b1c]">
        {book.image_url ? (
          <img
            src={book.image_url}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#2a1e14] via-[#1a1b1c] to-[#0d0d0e] flex flex-col items-center justify-center gap-4 relative">
            {/* Book spine accent */}
            <div className="absolute left-0 top-0 bottom-0 w-5 bg-gradient-to-r from-[#c4501a]/25 to-transparent" />
            <div className="absolute left-5 top-0 bottom-0 w-px bg-[#c4501a]/10" />
            <BookOpen size={52} className="text-[#c4501a]/30" strokeWidth={1} />
            <p className="text-white/12 text-[10px] uppercase tracking-[0.35em]">
              Hernan Figueredo
            </p>
          </div>
        )}

        {/* Bottom gradient overlay — always present */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1b1c] via-[#1a1b1c]/10 to-transparent" />

        {/* Hover darkening */}
        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Orange top accent bar — draws in on hover */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#c4501a]/40 via-[#c4501a] to-[#c4501a]/40 origin-left"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* View details overlay pill */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-white text-xs font-semibold border border-white/30 bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2 tracking-wider uppercase">
            Ver detalles
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-white text-base leading-snug line-clamp-2 mb-1.5 group-hover:text-[#c4501a] transition-colors duration-200">
          {book.title}
        </h3>
        <p className="text-white/38 text-sm line-clamp-2 mb-5 leading-relaxed">
          {book.description}
        </p>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-[#c4501a] font-bold text-xl tracking-tight leading-none">
              ${book.price.toLocaleString('es-CO')}
            </p>
            <p className="text-white/22 text-[10px] uppercase tracking-wider mt-0.5">COP</p>
          </div>

          <button
            onClick={handleAddToCart}
            className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
              inCart
                ? 'bg-emerald-500/12 text-emerald-400 border border-emerald-500/20'
                : 'bg-[#c4501a] hover:bg-[#d45c1a] text-white shadow-lg shadow-[#c4501a]/20 hover:shadow-[#c4501a]/35 active:scale-95'
            }`}
          >
            {inCart ? (
              <>
                <Check size={14} />
                En carrito
              </>
            ) : (
              <>
                <ShoppingCart size={14} />
                Comprar
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default BookCard
