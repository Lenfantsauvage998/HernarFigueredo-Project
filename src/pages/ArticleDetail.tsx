import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft, ArrowRight, Clock, Download, BookOpen, Headphones } from 'lucide-react'

const WhatsAppShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)
import { supabase } from '../lib/supabase'
import { useBooks } from '../hooks/useBooks'
import type { Article } from '../types'
import Spinner from '../components/ui/Spinner'
import CommentSection from '../components/articles/CommentSection'

const CAT_COLOR: Record<string, string> = {
  Mentalidad:    '#f26822',
  Negocios:      '#e8a857',
  Espiritualidad:'#9b8ea8',
  General:       '#6b7280',
}
function catColor(cat: string) { return CAT_COLOR[cat] ?? '#f26822' }

// ── Static content map (keyed by slug) ───────────────────────
const STATIC_CONTENT: Record<string, Omit<Article, 'id' | 'created_at' | 'updated_at'>> = {
  'habitos-que-transformaron-mis-mananas': {
    slug: 'habitos-que-transformaron-mis-mananas',
    title: 'Los 3 hábitos que transformaron mis mañanas',
    excerpt: 'No se trata de levantarse a las 4am. Se trata de construir una mañana que trabaje para ti, no al revés.',
    category: 'Mentalidad', read_time: 6, cover_url: null, pdf_url: null, audio_url: null, is_published: true,
    published_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    content: `Durante años creí que la disciplina era una cuestión de fuerza de voluntad.\n\nMe equivocaba.\n\nLa fuerza de voluntad es un recurso finito. Se agota. Y si construyes tu mañana dependiendo de ella, tarde o temprano va a fallar.\n\nLo que funciona no es motivación. Es arquitectura.\n\n**1. El teléfono no existe los primeros 30 minutos**\n\nCada vez que enciendes el teléfono al despertar, le entregas el control de tu estado mental a otra persona. Las notificaciones, los mensajes, las redes sociales — todo eso te pone en modo reactivo antes de que hayas tenido un solo pensamiento propio.\n\nCuando empecé a dejar el teléfono en otra habitación, los primeros días fueron incómodos. La mente busca ese estímulo automáticamente. Pero después de dos semanas, algo cambió. Empecé a despertar con mis propios pensamientos. Con claridad.\n\nNo necesitas meditar. No necesitas escribir un diario. Solo necesitas treinta minutos sin que nadie te interrumpa.\n\n**2. Mover el cuerpo antes de pensar**\n\nNo hablo de una sesión de crossfit a las 5am. Hablo de 10 a 15 minutos de movimiento — lo que sea: caminar, estirar, algo que despierte el cuerpo físicamente antes de exigirle al cerebro que funcione.\n\nEl movimiento libera dopamina. La dopamina mejora el foco. El foco mejora las decisiones. Las decisiones construyen resultados.\n\nEs una cadena simple que la mayoría ignora porque suena demasiado básica.\n\n**3. La primera tarea del día es irrompible**\n\nAntes de revisar correos, antes de atender a nadie, hay una sola tarea que hago. La más difícil, la que más importa, la que llevo postergando.\n\nVeinte minutos de trabajo profundo en esa tarea antes de abrir cualquier otra cosa.\n\nLa mayoría de las personas llegan al final del día preguntándose qué hicieron. Este hábito garantiza que al menos una cosa importante avanzó.\n\nLas mañanas no te salvan la vida. Pero sí definen el tono del día. Y el tono del día define, con el tiempo, el tono de tu vida.`,
  },
  'error-emprendedores-al-inicio': {
    slug: 'error-emprendedores-al-inicio',
    title: 'El error que cometen la mayoría de emprendedores al inicio',
    excerpt: 'Construir antes de vender. Es el error más costoso y más común. Y yo lo cometí durante dos años.',
    category: 'Negocios', read_time: 8, cover_url: null, pdf_url: null, audio_url: null, is_published: true,
    published_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    content: `Dos años.\n\nEso tardé en aprender la lección que todo emprendedor aprende tarde: el mercado no te debe nada.\n\nCuando empecé, hice lo que hace casi todo el mundo. Construí. Diseñé el producto perfecto, pensé en cada detalle, lo pulí durante meses. Y cuando por fin lo lancé, descubrí que nadie lo quería.\n\nNo porque fuera malo. Sino porque nadie me lo había pedido.\n\n**La trampa del producto perfecto**\n\nHay una fantasía muy seductora en el emprendimiento: la idea de que si construyes algo suficientemente bueno, la gente vendrá sola. Que la calidad habla por sí misma.\n\nEsa fantasía ha quebrado más negocios que la falta de capital.\n\nLa realidad es que la gente no compra lo mejor. Compra lo que entiende, lo que confía, y lo que resuelve un problema que ya está sintiendo en este momento.\n\n**Lo que funciona**\n\nAntes de construir cualquier cosa, necesitas vender la idea. Literal.\n\nCrea una página de aterrizaje. Describe el producto. Pon un botón de compra. Dirige tráfico. Si nadie compra, no construyas.\n\nSi alguien compra, devuelve el dinero, agradece la confianza, y ahora sí, construye.\n\nEs incómodo. Se siente deshonesto al principio. No lo es. Es la única forma de saber si existe un mercado real antes de gastar tiempo y dinero.\n\n**La venta es información**\n\nCada vez que alguien dice que no, te está dando información gratuita. Cada vez que alguien dice que sí, también.\n\nSal del cuarto primero. Consigue un sí. Después construye.\n\nYo lo aprendí tarde. Tú puedes aprenderlo ahora.`,
  },
  'por-que-consejos-productividad-no-funcionan': {
    slug: 'por-que-consejos-productividad-no-funcionan',
    title: 'Por qué la mayoría de consejos de productividad no funcionan',
    excerpt: 'El problema no es tu sistema. El problema es que estás siendo productivo en las cosas equivocadas.',
    category: 'Mentalidad', read_time: 5, cover_url: null, pdf_url: null, audio_url: null, is_published: true,
    published_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    content: `Hay una industria entera construida sobre hacerte sentir que eres menos productivo de lo que deberías ser.\n\nAplicaciones, métodos, frameworks, libros, cursos. Todo diseñado para ayudarte a hacer más cosas.\n\nPero nadie te pregunta si las cosas que estás haciendo valen la pena.\n\n**Productividad sin dirección es ruido**\n\nPuedes ser increíblemente eficiente haciendo cosas que no importan. Puedes optimizar, automatizar, y sistematizar un conjunto de tareas que no te acercan a nada significativo.\n\nDías enteros "siendo productivo", llegando a la noche con una lista de tareas completadas y la sensación extraña de no haber avanzado en nada real.\n\n**La pregunta que cambia todo**\n\nAntes de preguntar cómo hacer algo más rápido, pregunta si deberías hacerlo en absoluto.\n\n¿Esta tarea me acerca a donde quiero estar en tres años?\n¿O simplemente me mantiene ocupado?\n\nOcupado y productivo no son lo mismo. Esta distinción parece obvia cuando la lees. Pero en el día a día, la urgencia de lo que grita más fuerte aplasta lo que realmente importa.\n\n**Un sistema simple que funciona**\n\nCada semana, escribe tres cosas. Solo tres. Las tres acciones que, si las completaras esta semana, harían que la semana valiera la pena independientemente de todo lo demás.\n\nLuego protege el tiempo para esas tres cosas como si fueran reuniones irrompibles contigo mismo.\n\nTodo lo demás es secundario.\n\nNo necesitas un sistema más sofisticado. Necesitas claridad sobre qué importa, y la disciplina de protegerlo.`,
  },
  'la-leccion-del-silencio': {
    slug: 'la-leccion-del-silencio',
    title: 'La lección del silencio',
    excerpt: 'Pasé años evitando el silencio. Música en el carro, podcast mientras camino, series para dormir. Huía de mí mismo sin saberlo.',
    category: 'Espiritualidad', read_time: 7, cover_url: null, pdf_url: null, audio_url: null, is_published: true,
    published_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    content: `No era consciente de que huía.\n\nCreía que simplemente me gustaba el ruido. Que era curioso, que quería aprender, que aprovechaba el tiempo.\n\nPero había algo más. El silencio me incomodaba porque en el silencio aparecían preguntas que yo no quería responder.\n\n¿Estoy donde quiero estar?\n¿Estoy siendo quien quiero ser?\n¿Hacia dónde va esto?\n\nEl ruido constante era una forma de no tener que escuchar.\n\n**Lo que encontré cuando me detuve**\n\nHace tres años, pasé un fin de semana sin teléfono, sin música, sin nada. Solo.\n\nLos primeras horas fueron casi físicamente incómodas. La mente salta, busca estimulación, crea drama donde no lo hay.\n\nPero hacia el segundo día, algo se asentó.\n\nEmpecé a notar cosas que siempre habían estado ahí: el peso de decisiones que llevaba posponiendo, relaciones que me costaban más de lo que me daban, trabajo que hacía por inercia en vez de por elección.\n\nEl silencio no me dijo qué hacer. Pero me mostró con claridad lo que ya sabía y no quería ver.\n\n**No es meditación. Es honestidad**\n\nNo te estoy pidiendo que medites, aunque si lo haces, bien.\n\nTe estoy pidiendo que al menos una vez a la semana, por una hora, no pongas nada. Sin podcasts, sin música, sin scroll.\n\nCamina. Maneja. Siéntate.\n\nDeja que tu mente haga lo que tiene que hacer.\n\nLas respuestas que buscas en libros, en gurús, en contenido — muchas veces ya las tienes. Solo necesitas suficiente silencio para escucharlas.`,
  },
}

// Detect whether content is HTML (from Tiptap) or legacy plain-text
function isHTML(str: string) { return /<[a-z][\s\S]*>/i.test(str) }

function renderContent(raw: string) {
  if (!raw?.trim()) return null

  // HTML content from Tiptap editor
  if (isHTML(raw)) {
    return (
      <div
        className="article-prose"
        dangerouslySetInnerHTML={{ __html: raw }}
      />
    )
  }

  // Legacy plain-text with **bold** markers (static fallback articles)
  const paragraphs = raw.split(/\n\n+/)
  return paragraphs.map((para, i) => {
    if (!para.trim()) return null
    const parts = para.split(/\*\*(.*?)\*\*/g)
    const nodes = parts.map((p, j) =>
      j % 2 === 1 ? <strong key={j} className="text-white font-semibold">{p}</strong> : p
    )
    return (
      <p key={i} className="text-white/70 leading-[1.85] text-base sm:text-[1.05rem] mb-6">
        {nodes}
      </p>
    )
  })
}

const ArticleDetail: React.FC = () => {
  const { slug }                  = useParams<{ slug: string }>()
  const [article, setArticle]     = useState<Article | null>(null)
  const [loading, setLoading]     = useState(true)
  const [notFound, setNotFound]   = useState(false)
  const [related, setRelated]     = useState<Article[]>([])
  const { data: books = [] } = useBooks()
  const navigate = useNavigate()
  const featuredBooks = books.slice(0, 2)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    if (!slug) { setNotFound(true); setLoading(false); return }

    supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          // Fall back to static content
          const staticData = STATIC_CONTENT[slug]
          if (staticData) {
            setArticle({ ...staticData, id: slug, created_at: '', updated_at: '' } as Article)
            // Related from static pool
            const rel = Object.values(STATIC_CONTENT)
              .filter(a => a.category === staticData.category && a.slug !== slug)
              .slice(0, 2)
              .map(a => ({ ...a, id: a.slug, created_at: '', updated_at: '' } as Article))
            setRelated(rel)
          } else {
            setNotFound(true)
          }
          setLoading(false)
          return
        }
        setArticle(data as Article)

        // Fetch 2 related articles (same category, exclude current)
        supabase
          .from('articles')
          .select('id, title, slug, excerpt, category, read_time, pdf_url, published_at, is_published, content, created_at, updated_at')
          .eq('is_published', true)
          .eq('category', (data as Article).category)
          .neq('slug', slug)
          .limit(2)
          .then(({ data: rel }) => setRelated((rel ?? []) as Article[]))

        setLoading(false)
      })
  }, [slug])

  if (loading) return (
    <div className="min-h-screen bg-[#2c2b2b] flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  )

  if (notFound || !article) return (
    <div className="min-h-screen bg-[#2c2b2b] flex flex-col items-center justify-center gap-4 px-4">
      <BookOpen size={40} className="text-white/10" strokeWidth={1} />
      <p className="text-white/40 text-lg">Artículo no encontrado.</p>
      <Link to="/articulos" className="text-[#f26822] text-sm hover:underline">
        Ver todos los artículos
      </Link>
    </div>
  )

  const color = catColor(article.category)
  const date  = new Date(article.published_at).toLocaleDateString('es-CO', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div
      className="min-h-screen bg-[#2c2b2b] select-none"
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if (
          (e.ctrlKey || e.metaKey) &&
          ['c', 'a', 'x', 'u', 's', 'p'].includes(e.key.toLowerCase())
        ) {
          e.preventDefault()
        }
      }}
    >

      {/* ── Hero cover image ─────────────────────────────── */}
      {article.cover_url && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
          className="w-full max-h-[420px] overflow-hidden"
          style={{ marginTop: '80px' }}
        >
          <img src={article.cover_url} alt={article.title}
            className="w-full h-full object-cover object-center"
            style={{ maxHeight: '420px' }} />
          <div className="h-16 -mt-16 bg-gradient-to-t from-[#2c2b2b] to-transparent" />
        </motion.div>
      )}

      {/* ── Back nav ─────────────────────────────────────── */}
      <div className={`max-w-2xl mx-auto px-4 ${article.cover_url ? 'pt-4' : 'pt-28'} pb-2`}>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/30 hover:text-white text-sm transition-colors group mb-10"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Todos los artículos
        </button>
      </div>

      {/* ── Article header ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
        className="max-w-2xl mx-auto px-4"
      >
        <div className="flex items-center gap-4 mb-5">
          <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color }}>
            {article.category}
          </span>
          <span className="text-white/20 text-xs">{date}</span>
          <span className="flex items-center gap-1 text-white/20 text-xs">
            <Clock size={11} /> {article.read_time} min de lectura
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
          {article.title}
        </h1>

        <p className="text-white/50 text-lg leading-relaxed mb-8 font-light italic border-l-2 pl-4"
          style={{ borderColor: color }}>
          {article.excerpt}
        </p>

        {article.audio_url && (
          <div className="flex items-center gap-3 bg-[#1a1b1c] border border-white/[0.08] rounded-2xl p-4 mb-10">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}1A`, border: `1px solid ${color}33` }}>
              <Headphones size={16} style={{ color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/40 text-[11px] uppercase tracking-widest mb-1.5">
                ¿No lo puedes leer? Escúchalo
              </p>
              <audio src={article.audio_url} controls className="w-full h-9" />
            </div>
          </div>
        )}

        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="h-px mb-10 origin-left"
          style={{ background: `linear-gradient(to right, ${color}55, transparent)` }}
        />
      </motion.div>

      {/* ── Content ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="max-w-2xl mx-auto px-4 pb-10"
      >
        {renderContent(article.content)}
      </motion.div>

      {/* ── WhatsApp share ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="max-w-2xl mx-auto px-4 mb-8"
      >
        <div className="flex items-center justify-between border border-white/[0.07] rounded-2xl px-5 py-4">
          <p className="text-white/40 text-sm">¿Te pareció útil? Compártelo.</p>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`Hola, te comparto este artículo acabado de crear y sé que te interesará: ${window.location.href}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Compartir en WhatsApp"
            className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            <WhatsAppShareIcon />
            Compartir en WhatsApp
          </a>
        </div>
      </motion.div>

      {/* ── Download CTA ─────────────────────────────────── */}
      {article.pdf_url && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="max-w-2xl mx-auto px-4 mb-14"
        >
          <div className="bg-[#1a1b1c] border border-white/[0.07] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-11 h-11 bg-[#f26822]/10 border border-[#f26822]/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Download size={18} className="text-[#f26822]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm">Descarga este artículo en PDF</p>
              <p className="text-white/35 text-xs mt-0.5">Versión gratuita para leer offline cuando quieras.</p>
            </div>
            <a
              href={article.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="flex items-center gap-2 bg-[#f26822] hover:bg-[#d45c1a] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-[#f26822]/20 whitespace-nowrap"
            >
              <Download size={14} />
              Descargar PDF
            </a>
          </div>
        </motion.div>
      )}

      {/* ── Books CTA ────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-4 mb-10">
        <div className="bg-[#1a1b1c] border border-[#f26822]/20 rounded-2xl p-6">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-10 h-10 bg-[#f26822]/10 border border-[#f26822]/25 rounded-xl flex items-center justify-center flex-shrink-0">
              <BookOpen size={18} className="text-[#f26822]" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">¿Este artículo te resonó?</p>
              <p className="text-white/40 text-xs mt-0.5 leading-relaxed">
                En los libros voy mucho más a fondo. Cada uno es una guía completa, no un artículo.
              </p>
            </div>
          </div>

          {featuredBooks.length > 0 ? (
            <div className="space-y-3 mb-4">
              {featuredBooks.map((book: import('../types').Book) => (
                <Link key={book.id} to="/libros"
                  className="group flex items-center gap-3 bg-[#2c2b2b] hover:bg-white/[0.04] border border-white/[0.06] hover:border-[#f26822]/25 rounded-xl p-3 transition-all duration-200">
                  <div className="w-10 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-[#f26822]/10 border border-[#f26822]/20 flex items-center justify-center">
                    {book.image_url
                      ? <img src={book.image_url} alt={book.title} className="w-full h-full object-cover" />
                      : <BookOpen size={14} className="text-[#f26822]/60" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/80 text-xs font-semibold line-clamp-2 leading-snug group-hover:text-white transition-colors">
                      {book.title}
                    </p>
                    <p className="text-white/30 text-[11px] mt-1">Ver opciones</p>
                  </div>
                  <ArrowRight size={13} className="text-white/20 group-hover:text-[#f26822] flex-shrink-0 transition-colors" />
                </Link>
              ))}
            </div>
          ) : null}

          <Link to="/libros"
            className="flex items-center justify-center gap-2 w-full bg-[#f26822] hover:bg-[#d45c1a] text-white text-sm font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-[#f26822]/15">
            Ver todos los libros
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* ── Related articles ─────────────────────────────── */}
      {related.length > 0 && (
        <div className="max-w-2xl mx-auto px-4 pb-8">
          <div className="h-px bg-white/[0.05] mb-10" />
          <p className="text-[10px] uppercase tracking-widest text-white/25 mb-6">
            También te puede interesar
          </p>
          <div className="space-y-0">
            {related.map(r => (
              <Link
                key={r.id}
                to={`/articulos/${r.slug}`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="group flex items-start gap-5 py-5 border-b border-white/[0.05] last:border-0"
              >
                <span
                  className="text-[10px] font-bold uppercase tracking-widest mt-1 flex-shrink-0"
                  style={{ color: catColor(r.category) }}
                >
                  {r.category}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-white/80 font-semibold text-sm group-hover:text-white transition-colors line-clamp-1">
                    {r.title}
                  </p>
                  <p className="text-white/30 text-xs mt-0.5 flex items-center gap-1.5">
                    <Clock size={10} /> {r.read_time} min
                  </p>
                </div>
                <ArrowLeft size={13} className="text-white/20 group-hover:text-[#f26822] rotate-180 mt-1 flex-shrink-0 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Comments ─────────────────────────────────────── */}
      <CommentSection articleId={article.id} />

      {/* ── Back to all ──────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-4 pb-24 pt-4">
        <Link to="/"
          className="flex items-center gap-2 text-white/25 hover:text-[#f26822] text-sm transition-colors group">
          <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
          Todos los artículos
        </Link>
      </div>
    </div>
  )
}

export default ArticleDetail
