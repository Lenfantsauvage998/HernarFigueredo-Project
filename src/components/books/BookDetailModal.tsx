import React from 'react'
import { BookOpen, ShoppingCart, Check, Star } from 'lucide-react'
import { useCartStore } from '../../store/cartStore'
import type { Book } from '../../types'
import Modal from '../ui/Modal'
import Button from '../ui/Button'

interface BookDetailModalProps {
  book: Book | null
  onClose: () => void
}

const BookDetailModal: React.FC<BookDetailModalProps> = ({ book, onClose }) => {
  const { addItem, items } = useCartStore()
  const inCart = book ? items.some((i) => i.service.id === book.id) : false

  if (!book) return null

  return (
    <Modal isOpen={!!book} onClose={onClose} size="lg">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Cover */}
        <div className="w-full md:w-48 flex-shrink-0">
          <div className="h-64 md:h-full min-h-48 bg-gradient-to-br from-[#c4501a]/10 to-[#2c2b2b] rounded-xl overflow-hidden border border-white/10">
            {book.image_url ? (
              <img
                src={book.image_url}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <BookOpen size={48} className="text-[#c4501a]/40" />
                <span className="text-white/20 text-xs uppercase tracking-widest text-center px-2">
                  Hernan Figueredo
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={13} className="text-[#c4501a] fill-[#c4501a]" />
            ))}
            <span className="text-white/40 text-xs ml-1">Hernan Figueredo</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-3 leading-tight">{book.title}</h2>

          <p className="text-white/60 text-sm leading-relaxed mb-5">{book.description}</p>

          {/* Features */}
          {book.features.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-3">
                Lo que aprenderás
              </p>
              <ul className="space-y-2">
                {book.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c4501a] flex-shrink-0 mt-1.5" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-[#c4501a]">
                ${book.price.toLocaleString('es-CO')}
              </p>
              <p className="text-xs text-white/30">COP</p>
            </div>
            <Button
              onClick={() => { addItem(book); onClose() }}
              variant={inCart ? 'outline' : 'primary'}
              size="lg"
            >
              {inCart ? (
                <>
                  <Check size={16} />
                  Ya en carrito
                </>
              ) : (
                <>
                  <ShoppingCart size={16} />
                  Agregar al carrito
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default BookDetailModal
