import React, { useState, useEffect } from 'react'
import { BookOpen, ShoppingCart, Check, Star, Smartphone, Package, ExternalLink } from 'lucide-react'
import { useCartStore, unitPrice } from '../../store/cartStore'
import type { Book, BookFormat } from '../../types'
import Modal from '../ui/Modal'
import Button from '../ui/Button'

interface BookDetailModalProps {
  book: Book | null
  onClose: () => void
}

const BookDetailModal: React.FC<BookDetailModalProps> = ({ book, onClose }) => {
  const { addItem, items } = useCartStore()
  const [format, setFormat] = useState<BookFormat>('FISICO')

  useEffect(() => { setFormat('FISICO') }, [book?.id])

  if (!book) return null

  const hasEpub = book.epub_price != null
  const inCart = items.some((i) => i.service.id === book.id && i.format === format)

  return (
    <Modal isOpen={!!book} onClose={onClose} size="lg">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Cover */}
        <div className="w-full md:w-48 flex-shrink-0">
          <div className="relative h-64 md:h-full min-h-48 bg-gradient-to-br from-[#f26822]/10 to-[#2c2b2b] rounded-xl overflow-hidden border border-white/10">
            {book.image_url ? (
              <>
                {/* Blurred backdrop fills any letterbox space behind the cover */}
                <img
                  src={book.image_url}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover scale-125 blur-2xl opacity-50"
                />
                <img
                  src={book.image_url}
                  alt={book.title}
                  className="relative w-full h-full object-contain"
                />
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <BookOpen size={48} className="text-[#f26822]/40" />
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
              <Star key={i} size={13} className="text-[#f26822] fill-[#f26822]" />
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
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f26822] flex-shrink-0 mt-1.5" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Format selector */}
          {hasEpub && (
            <div className="flex gap-2 mb-5">
              <button
                type="button"
                onClick={() => setFormat('FISICO')}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 px-3 rounded-xl text-sm font-medium border transition-all ${
                  format === 'FISICO'
                    ? 'bg-[#f26822] border-[#f26822] text-white shadow-lg shadow-[#f26822]/20'
                    : 'border-white/[0.1] text-white/50 hover:text-white hover:border-white/25'
                }`}
              >
                <span className="flex items-center gap-2"><Package size={14} /> Físico</span>
                <span className={`text-xs font-normal ${format === 'FISICO' ? 'text-white/80' : 'text-white/30'}`}>
                  ${book.price.toLocaleString('es-CO')}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setFormat('EPUB')}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 px-3 rounded-xl text-sm font-medium border transition-all ${
                  format === 'EPUB'
                    ? 'bg-[#f26822] border-[#f26822] text-white shadow-lg shadow-[#f26822]/20'
                    : 'border-white/[0.1] text-white/50 hover:text-white hover:border-white/25'
                }`}
              >
                <span className="flex items-center gap-2"><Smartphone size={14} /> EPUB</span>
                <span className={`text-xs font-normal ${format === 'EPUB' ? 'text-white/80' : 'text-white/30'}`}>
                  ${unitPrice(book, 'EPUB').toLocaleString('es-CO')}
                </span>
              </button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-[#f26822]">
                ${unitPrice(book, format).toLocaleString('es-CO')}
              </p>
              <p className="text-xs text-white/30">COP{hasEpub ? ` · ${format === 'EPUB' ? 'EPUB' : 'Físico'}` : ''}</p>
            </div>
            {format === 'EPUB' ? (
              <Button
                onClick={() => { window.open(book.epub_url!, '_blank', 'noopener,noreferrer') }}
                disabled={!book.epub_url}
                variant="primary"
                size="lg"
              >
                <ExternalLink size={16} />
                {book.epub_url ? 'Comprar en Amazon' : 'Próximamente'}
              </Button>
            ) : (
              <Button
                onClick={() => { addItem(book, format); onClose() }}
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
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default BookDetailModal
