import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight, Clock, Download, BookOpen } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useBooks } from '../hooks/useBooks'
import type { Article } from '../types'
import Spinner from '../components/ui/Spinner'

// ── Category colour map ───────────────────────────────────────
const CAT_COLOR: Record<string, string> = {
  Mentalidad:     '#f26822',
  Negocios:       '#e8a857',
  Espiritualidad: '#9b8ea8',
  General:        '#6b7280',
}
function catColor(cat: string) { return CAT_COLOR[cat] ?? '#f26822' }

const BIO_PHOTO = '/assets/hernan.png'

// ── Static fallback articles ─────────────────────────────────
const STATIC_ARTICLES: Article[] = [
  {
    id: 's1', slug: 'habitos-que-transformaron-mis-mananas',
    title: 'Los 3 hábitos que transformaron mis mañanas',
    excerpt: 'No se trata de levantarse a las 4am. Se trata de construir una mañana que trabaje para ti, no al revés.',
    category: 'Mentalidad', read_time: 6, cover_url: null, pdf_url: null, is_published: true,
    published_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    content: '', created_at: '', updated_at: '',
  },
  {
    id: 's2', slug: 'error-emprendedores-al-inicio',
    title: 'El error que cometen la mayoría de emprendedores al inicio',
    excerpt: 'Construir antes de vender. Es el error más costoso y más común. Y yo lo cometí durante dos años.',
    category: 'Negocios', read_time: 8, cover_url: null, pdf_url: null, is_published: true,
    published_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    content: '', created_at: '', updated_at: '',
  },
  {
    id: 's3', slug: 'por-que-consejos-productividad-no-funcionan',
    title: 'Por qué la mayoría de consejos de productividad no funcionan',
    excerpt: 'El problema no es tu sistema. El problema es que estás siendo productivo en las cosas equivocadas.',
    category: 'Mentalidad', read_time: 5, cover_url: null, pdf_url: null, is_published: true,
    published_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    content: '', created_at: '', updated_at: '',
  },
  {
    id: 's4', slug: 'la-leccion-del-silencio',
    title: 'La lección del silencio',
    excerpt: 'Pasé años evitando el silencio. Música en el carro, podcast mientras camino, series para dormir. Huía de mí mismo sin saberlo.',
    category: 'Espiritualidad', read_time: 7, cover_url: null, pdf_url: null, is_published: true,
    published_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    content: '', created_at: '', updated_at: '',
  },
]

// ── Main page ─────────────────────────────────────────────────
const Articles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>(STATIC_ARTICLES)
  const [loading, setLoading]   = useState(true)
  const { data: books = [] } = useBooks()
  const navigate  = useNavigate()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    supabase
      .from('articles').select('*').eq('is_published', true)
      .order('published_at', { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) setArticles(data as Article[])
        setLoading(false)
      })
  }, [])

  // Show first 1-2 books as teasers
  const featuredBooks = books.slice(0, 2)

  return (
    <div className="min-h-screen bg-[#2c2b2b]">

      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="pt-28 pb-12 px-4 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#f26822]" />
            <span className="text-[#f26822] text-xs font-bold uppercase tracking-[0.3em]">Artículos</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
            Ideas que valen<br className="hidden sm:block" /> tu tiempo.
          </h1>
          <p className="mt-4 text-white/40 text-base max-w-md leading-relaxed">
            Reflexiones sobre mentalidad, negocios y vida. Sin relleno.
          </p>
        </motion.div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-[#f26822]/30 via-white/10 to-transparent" />
      </div>

      {/* ── Article list ─────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 py-4">
        {loading ? (
          <div className="flex justify-center py-32"><Spinner size="lg" /></div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {articles.map((article, i) => (
              <motion.li key={article.id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}>
                <ArticleRow article={article} />
              </motion.li>
            ))}
            {articles.length === 0 && (
              <div className="text-center py-32 text-white/25">
                <p>Próximamente los primeros artículos.</p>
              </div>
            )}
          </ul>
        )}
      </div>

      {/* ── Books CTA ────────────────────────────────────── */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto px-4 py-16"
        >
          <div className="h-px bg-white/[0.05] mb-14" />

          {/* Section header */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-px w-6 bg-[#f26822]" />
                <span className="text-[#f26822] text-[10px] font-bold uppercase tracking-[0.3em]">
                  Si los artículos te resonaron
                </span>
              </div>
              <h2 className="text-white text-2xl font-bold">Los libros van más a fondo.</h2>
              <p className="text-white/35 text-sm mt-1.5 max-w-sm">
                Cada libro es una exploración completa de los temas que encuentras aquí.
              </p>
            </div>
            <Link to="/libros"
              className="hidden sm:flex items-center gap-2 text-white/40 hover:text-[#f26822] text-xs font-medium transition-colors group flex-shrink-0 ml-4">
              Ver todos
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Book previews */}
          {featuredBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {featuredBooks.map((book: import('../types').Book, i: number) => (
                <motion.div key={book.id}
                  initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <Link to="/libros"
                    className="group flex items-center gap-4 bg-[#1a1b1c] border border-white/[0.07] hover:border-[#f26822]/30 rounded-2xl p-4 transition-all duration-200">
                    {/* Cover */}
                    <div className="w-14 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[#f26822]/10 border border-[#f26822]/20 flex items-center justify-center">
                      {book.image_url
                        ? <img src={book.image_url} alt={book.title} className="w-full h-full object-cover" />
                        : <BookOpen size={18} className="text-[#f26822]/60" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm leading-snug line-clamp-2 group-hover:text-white transition-colors">
                        {book.title}
                      </p>
                      <p className="text-[#f26822] text-xs font-bold mt-1.5">
                        ${book.price.toLocaleString('es-CO')} COP
                      </p>
                    </div>
                    <ArrowRight size={14} className="text-white/20 group-hover:text-[#f26822] flex-shrink-0 transition-colors" />
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            /* Fallback if books not loaded yet */
            <Link to="/libros"
              className="group flex items-center justify-between bg-[#1a1b1c] border border-white/[0.07] hover:border-[#f26822]/30 rounded-2xl p-5 mb-6 transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#f26822]/10 border border-[#f26822]/20 rounded-xl flex items-center justify-center">
                  <BookOpen size={18} className="text-[#f26822]" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Explorar los libros</p>
                  <p className="text-white/35 text-xs">Contenido completo, sin límites</p>
                </div>
              </div>
              <ArrowRight size={14} className="text-white/25 group-hover:text-[#f26822] transition-colors" />
            </Link>
          )}

          <Link to="/libros"
            className="sm:hidden flex items-center justify-center gap-2 border border-white/[0.1] hover:border-[#f26822]/40 text-white/50 hover:text-white text-sm font-medium px-5 py-3 rounded-xl transition-all">
            Ver todos los libros <ArrowRight size={14} />
          </Link>
        </motion.div>
      )}

      {/* ── Bio ──────────────────────────────────────────── */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto px-4 pb-16"
        >
          <div className="h-px bg-white/[0.05] mb-14" />
          <div className="flex flex-col sm:flex-row items-start gap-8">
            <div className="flex-shrink-0">
              {BIO_PHOTO ? (
                <img src={BIO_PHOTO} alt="Hernan Figueredo"
                  className="w-20 h-20 rounded-2xl object-cover object-top border border-white/10" />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-[#f26822]/10 border border-[#f26822]/20 flex items-center justify-center">
                  <span className="text-[#f26822] text-2xl font-bold">H</span>
                </div>
              )}
            </div>
            <div>
              <p className="text-[#f26822] text-xs font-bold uppercase tracking-[0.25em] mb-2">
                Hernan Figueredo
              </p>
              <p className="text-white/70 text-base leading-relaxed max-w-lg">
                Emprendedor, escritor y conferencista. Ayuda a personas a construir
                negocios y vidas con propósito a través de sus libros, artículos
                y programas de mentoría.
              </p>
              <button onClick={() => navigate('/inicio')}
                className="mt-4 flex items-center gap-2 text-sm text-white/40 hover:text-[#f26822] transition-colors group">
                Conocer más
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Show more → landing ───────────────────────────── */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto px-4 pb-24"
        >
          <div className="h-px bg-white/[0.05] mb-14" />
          <div className="text-center">
            <p className="text-white/25 text-xs uppercase tracking-widest mb-5">¿Quieres saber más?</p>
            <Link to="/inicio"
              className="inline-flex items-center gap-3 border border-white/[0.12] hover:border-[#f26822]/50 text-white/60 hover:text-white px-7 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group">
              Ver sitio completo
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// ── Article row ───────────────────────────────────────────────
const ArticleRow: React.FC<{ article: Article }> = ({ article }) => {
  const color = catColor(article.category)
  const date  = new Date(article.published_at).toLocaleDateString('es-CO', {
    year: 'numeric', month: 'short', day: 'numeric',
  })

  return (
    <Link to={`/articulos/${article.slug}`}
      className="group flex flex-col h-full bg-[#1a1b1c] border border-white/[0.06] hover:border-white/[0.14] rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer">

      {/* Cover image */}
      {article.cover_url ? (
        <div className="w-full h-44 overflow-hidden flex-shrink-0">
          <img src={article.cover_url} alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      ) : (
        <div className="w-full h-44 flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}10`, borderBottom: `1px solid ${color}20` }}>
          <span className="text-5xl font-bold opacity-20" style={{ color }}>
            {article.title.charAt(0)}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color }}>
            {article.category}
          </span>
          <span className="text-white/20 text-[11px]">{date}</span>
        </div>

        <h2 className="text-white text-lg font-bold leading-snug mb-2">
          {article.title}
        </h2>

        <p className="text-white/40 text-sm leading-relaxed line-clamp-3 flex-1">{article.excerpt}</p>

        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/[0.05]">
          <span className="flex items-center gap-1.5 text-white/25 text-xs">
            <Clock size={11} /> {article.read_time} min
          </span>
          {article.pdf_url && (
            <span className="flex items-center gap-1.5 text-white/25 text-xs">
              <Download size={11} /> Descargable
            </span>
          )}
          <span className="ml-auto flex items-center gap-1 text-white/25 group-hover:text-[#f26822] text-xs font-medium transition-colors">
            Leer <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  )
}

export default Articles
