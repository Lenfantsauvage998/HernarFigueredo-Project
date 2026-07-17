import React, { useState, useEffect } from 'react'
import { BookOpen, ShoppingCart, Check, Star, Smartphone, Package, ExternalLink, Info } from 'lucide-react'
import { useCartStore, unitPrice } from '../../store/cartStore'
import type { Book, BookFormat } from '../../types'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import PriceDisplay from '../ui/PriceDisplay'

interface BookDetailModalProps {
  book: Book | null
  onClose: () => void
}

const BookDetailModal: React.FC<BookDetailModalProps> = ({ book, onClose }) => {
  const { addItem, items } = useCartStore()
  const [format, setFormat] = useState<BookFormat>('FISICO')

  const hasPhysical = !!book && (!!book.marketlibros_url || !!book.amazon_url)
  const hasVirtual = !!book && book.epub_price != null
  const showToggle = hasPhysical && hasVirtual

  useEffect(() => {
    if (!book) return
    setFormat(hasVirtual ? 'EPUB' : hasPhysical ? 'FISICO' : 'FISICO')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book?.id])

  if (!book) return null

  const inCart = items.some((i) => i.service.id === book.id && i.format === 'EPUB')

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
          {showToggle && (
            <div className="flex gap-2 mb-5">
              <button
                type="button"
                onClick={() => setFormat('EPUB')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium border transition-all ${
                  format === 'EPUB'
                    ? 'bg-[#f26822] border-[#f26822] text-white shadow-lg shadow-[#f26822]/20'
                    : 'border-white/[0.1] text-white/50 hover:text-white hover:border-white/25'
                }`}
              >
                <Smartphone size={14} /> Virtual (EPUB)
              </button>
              <button
                type="button"
                onClick={() => setFormat('FISICO')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium border transition-all ${
                  format === 'FISICO'
                    ? 'bg-[#f26822] border-[#f26822] text-white shadow-lg shadow-[#f26822]/20'
                    : 'border-white/[0.1] text-white/50 hover:text-white hover:border-white/25'
                }`}
              >
                <Package size={14} /> Físico
              </button>
            </div>
          )}

          {/* Condensed buying guide — only relevant when choosing Físico */}
          {format === 'FISICO' && hasPhysical && (
            <div className="flex gap-2.5 items-start bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 mb-4">
              <Info size={14} className="text-[#f26822] flex-shrink-0 mt-0.5" />
              <p className="text-white/50 text-xs leading-relaxed">
                Impreso bajo demanda. <span className="text-white/70 font-medium">Marketlibros</span> para Colombia, Ecuador, Argentina, Bolivia, Brasil, México y España; <span className="text-white/70 font-medium">Amazon</span> para EE.UU., Europa y el resto del mundo.
              </p>
            </div>
          )}

          {/* ── Físico: external vendor links, no price shown ── */}
          {format === 'FISICO' && hasPhysical && (
            <div className="space-y-2.5">
              <p className="text-xs text-white/30 mb-1">Disponible impreso a través de:</p>
              {book.marketlibros_url && (
                <div>
                  <a
                    href={book.marketlibros_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 px-5 py-3.5 rounded-xl border border-white/[0.1] hover:border-[#f26822]/50 bg-white/[0.03] hover:bg-[#f26822]/10 transition-all group"
                  >
                    <span className="text-white font-semibold text-sm">Comprar en Marketlibros</span>
                    <ExternalLink size={15} className="text-white/40 group-hover:text-[#f26822] transition-colors" />
                  </a>
                  <p className="text-white/25 text-[11px] mt-1.5 px-1">
                    Marketlibros imprime el libro en tu país — te ahorras el envío internacional.
                  </p>
                </div>
              )}
              {book.amazon_url && (
                <a
                  href={book.amazon_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 px-5 py-3.5 rounded-xl border border-white/[0.1] hover:border-[#f26822]/50 bg-white/[0.03] hover:bg-[#f26822]/10 transition-all group"
                >
                  <span className="text-white font-semibold text-sm">Comprar en Amazon</span>
                  <ExternalLink size={15} className="text-white/40 group-hover:text-[#f26822] transition-colors" />
                </a>
              )}
            </div>
          )}

          {format === 'FISICO' && !hasPhysical && (
            <p className="text-white/30 text-sm">Versión física próximamente disponible.</p>
          )}

          {/* ── Virtual/EPUB: normal cart + checkout flow, price shown ── */}
          {format === 'EPUB' && hasVirtual && (
            <>
              <div className="flex gap-2.5 items-start bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 mb-4">
                <Info size={14} className="text-[#f26822] flex-shrink-0 mt-0.5" />
                <p className="text-white/50 text-xs leading-relaxed">
                  Lectura inmediata en cualquier dispositivo. Recibirás el libro en tu correo dentro de las próximas <span className="text-white/70 font-medium">12 horas</span> tras confirmar la compra.
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <PriceDisplay
                    amountCOP={unitPrice(book, 'EPUB')}
                    className="text-3xl font-bold text-[#f26822] hover:text-[#ff7c33] transition-colors cursor-pointer"
                  />
                  <p className="text-xs text-white/30">Virtual · EPUB</p>
                </div>
                <Button
                  onClick={() => { addItem(book, 'EPUB'); onClose() }}
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
            </>
          )}

          {format === 'EPUB' && !hasVirtual && (
            <p className="text-white/30 text-sm">Versión virtual próximamente disponible.</p>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default BookDetailModal
