import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { useBooks } from '../../hooks/useBooks'
import BookCard from '../books/BookCard'
import BookDetailModal from '../books/BookDetailModal'
import Spinner from '../ui/Spinner'
import type { Book } from '../../types'

const FeaturedBooks: React.FC = () => {
  const { data: books = [], isLoading } = useBooks()
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)

  const featured = books.slice(0, 3)

  return (
    <section className="py-28 bg-[#2c2b2b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-14 gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8 bg-[#c4501a]" />
              <p className="text-[#c4501a] text-xs font-bold uppercase tracking-[0.3em]">
                Publicaciones
              </p>
            </div>
            <h2 className="text-4xl font-bold text-white">
              Libros destacados
            </h2>
          </div>
          <Link
            to="/libros"
            className="group flex items-center gap-2 text-[#c4501a] hover:text-[#d45c1a] font-medium text-sm transition-colors"
          >
            Ver todos
            <ArrowRight
              size={15}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </Link>
        </motion.div>

        {/* Books grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center py-20 text-white/30">
            <p>Los libros aparecerán aquí pronto.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((book, i) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.65,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                viewport={{ once: true }}
              >
                <BookCard book={book} onClick={() => setSelectedBook(book)} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <BookDetailModal book={selectedBook} onClose={() => setSelectedBook(null)} />
    </section>
  )
}

export default FeaturedBooks
