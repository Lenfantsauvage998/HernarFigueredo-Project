import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, MessageCircle } from 'lucide-react'
import { useCartStore } from '../../store/cartStore'

const PHONE = '573026081225'
const MESSAGE = 'Hola Hernan! Me interesa uno de tus libros y me gustaría saber más. 📚'
const WA_URL = `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const WhatsAppButton: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const isCartOpen = useCartStore((s) => s.isOpen)

  // Delay entrance so it doesn't distract on page load
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000)
    return () => clearTimeout(t)
  }, [])

  if (isCartOpen || !visible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* Popup card */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 12 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            className="w-72 bg-[#1a1b1c] border border-white/[0.09] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#f26822] px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle size={18} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm leading-none">Hernan Figueredo</p>
                <p className="text-white/70 text-[11px] mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full inline-block" />
                  Disponible ahora
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-6 h-6 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X size={12} />
              </button>
            </div>

            {/* Message bubble */}
            <div className="p-4">
              <div className="bg-[#2c2b2b] border border-white/[0.06] rounded-xl rounded-tl-sm px-4 py-3 mb-4">
                <p className="text-white/80 text-sm leading-relaxed">
                  👋 Hola! ¿Te interesa alguno de mis libros o tienes alguna pregunta?
                  Escríbeme, con gusto te ayudo.
                </p>
                <p className="text-white/25 text-[10px] mt-2 text-right">ahora</p>
              </div>

              {/* CTA */}
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 w-full bg-[#25D366] hover:bg-[#20bc5a] active:scale-95 text-white font-semibold text-sm py-3 rounded-xl transition-all duration-200 shadow-lg shadow-[#25D366]/20"
              >
                <WhatsAppIcon />
                Iniciar conversación
              </a>

              <p className="text-white/20 text-[10px] text-center mt-3">
                Responde habitualmente en minutos
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.1 }}
        className="relative"
      >
        {/* Pulsing ring — only when closed */}
        {!open && (
          <>
            <motion.div
              animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full bg-[#25D366]"
            />
            <motion.div
              animate={{ scale: [1, 1.35], opacity: [0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
              className="absolute inset-0 rounded-full bg-[#25D366]"
            />
          </>
        )}

        <button
          onClick={() => setOpen(o => !o)}
          aria-label="Contactar por WhatsApp"
          className="relative w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl shadow-black/30 transition-all duration-200 hover:scale-110 active:scale-95"
          style={{ backgroundColor: '#25D366' }}
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.span key="x"
                initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
                <X size={22} />
              </motion.span>
            ) : (
              <motion.span key="wa"
                initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
                <WhatsAppIcon />
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Unread dot — shows when closed */}
        {!open && (
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#f26822] border-2 border-[#2c2b2b] rounded-full flex items-center justify-center"
          >
            <span className="text-white text-[8px] font-bold leading-none">1</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default WhatsAppButton
