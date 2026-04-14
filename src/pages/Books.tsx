import React, { useState, useEffect } from 'react'
import { Search, SlidersHorizontal, X, BookOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useBooks } from '../hooks/useBooks'
import BookCard from '../components/books/BookCard'
import BookDetailModal from '../components/books/BookDetailModal'
import Spinner from '../components/ui/Spinner'
import type { Book } from '../types'

const Books: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [])

  const [search, setSearch] = useState('')
  const [minPrice, setMinPrice] = useState<number | undefined>()
  const [maxPrice, setMaxPrice] = useState<number | undefined>()
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const { data: books = [], isLoading } = useBooks({
    search: search || undefined,
    minPrice,
    maxPrice,
  })

  const hasActiveFilters = minPrice !== undefined || maxPrice !== undefined

  return (
    <div className="min-h-screen bg-[#2c2b2b] pt-24 md:pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-[#f26822]" />
            <p className="text-[#f26822] text-xs font-bold uppercase tracking-[0.3em]">
              Publicaciones
            </p>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 leading-tight">Libros</h1>
          <p className="text-white/45 text-lg max-w-xl leading-relaxed">
            Todos los libros de Hernan Figueredo. Elige el tuyo y empieza a transformar tu vida.
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-3 mb-8"
        >
          {/* Search input */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/28" />
            <input
              type="text"
              placeholder="Buscar por título..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#1a1b1c] border border-white/[0.09] rounded-xl text-white placeholder:text-white/25 text-sm outline-none focus:border-[#f26822]/45 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
              showFilters || hasActiveFilters
                ? 'border-[#f26822]/50 text-[#f26822] bg-[#f26822]/8'
                : 'border-white/[0.09] text-white/50 hover:border-white/25 hover:text-white bg-[#1a1b1c]'
            }`}
          >
            <SlidersHorizontal size={15} />
            Filtrar
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#f26822]" />
            )}
          </button>
        </motion.div>

        {/* Price filters panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden mb-8"
            >
              <div className="p-5 bg-[#1a1b1c] border border-white/[0.09] rounded-xl flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-white/35 uppercase tracking-widest">
                    Precio mínimo (COP)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={minPrice ?? ''}
                    onChange={(e) =>
                      setMinPrice(e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="px-4 py-2.5 bg-[#2c2b2b] border border-white/[0.09] rounded-lg text-white text-sm outline-none focus:border-[#f26822]/45 w-44"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-white/35 uppercase tracking-widest">
                    Precio máximo (COP)
                  </label>
                  <input
                    type="number"
                    placeholder="Sin límite"
                    value={maxPrice ?? ''}
                    onChange={(e) =>
                      setMaxPrice(e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="px-4 py-2.5 bg-[#2c2b2b] border border-white/[0.09] rounded-lg text-white text-sm outline-none focus:border-[#f26822]/45 w-44"
                  />
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={() => {
                      setMinPrice(undefined)
                      setMaxPrice(undefined)
                    }}
                    className="text-xs text-white/35 hover:text-white transition-colors px-3 py-2.5 flex items-center gap-1.5"
                  >
                    <X size={12} />
                    Limpiar
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center py-28">
            <Spinner size="lg" />
          </div>
        ) : books.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-28"
          >
            <div className="w-16 h-16 bg-white/[0.04] border border-white/[0.08] rounded-2xl flex items-center justify-center mx-auto mb-5">
              <BookOpen size={28} className="text-white/20" strokeWidth={1.5} />
            </div>
            <p className="text-white/40 text-lg mb-2 font-medium">No se encontraron libros</p>
            <p className="text-white/22 text-sm">Intenta con otros términos de búsqueda</p>
            {(search || hasActiveFilters) && (
              <button
                onClick={() => {
                  setSearch('')
                  setMinPrice(undefined)
                  setMaxPrice(undefined)
                }}
                className="mt-6 text-[#f26822] hover:text-[#d45c1a] text-sm font-medium transition-colors"
              >
                Limpiar filtros
              </button>
            )}
          </motion.div>
        ) : (
          <>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white/25 text-sm mb-7"
            >
              {books.length} {books.length === 1 ? 'libro' : 'libros'} encontrado
              {books.length !== 1 ? 's' : ''}
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {books.map((book, i) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.55,
                    delay: i * 0.07,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <BookCard book={book} onClick={() => setSelectedBook(book)} />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      <BookDetailModal book={selectedBook} onClose={() => setSelectedBook(null)} />
    </div>
  )
}

export default Books
