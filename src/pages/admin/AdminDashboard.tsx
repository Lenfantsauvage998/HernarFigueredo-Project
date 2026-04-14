import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { motion, AnimatePresence } from 'motion/react'
import {
  BookOpen, ShoppingBag, TrendingUp, Plus, Edit2, Trash2,
  X, Check, ChevronDown, Package, Upload, Image as ImageIcon,
  Users, Mail, Shield, ShieldOff, Send, UserX, CheckCircle,
  AlertCircle, RefreshCw, FileText, ExternalLink
} from 'lucide-react'
import Spinner from '../../components/ui/Spinner'
import RichTextEditor from '../../components/ui/RichTextEditor'
import type { Book, Article } from '../../types'

// ─── Types ───────────────────────────────────────────────────
interface AdminUser {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
  created_at: string
}

interface Subscriber {
  id: string
  email: string
  name: string | null
  subscribed_at: string
}

interface Order {
  id: string
  user_name: string
  user_email: string
  status: string
  total_amount: number
  customer_phone: string | null
  created_at: string
  items: { service_title: string; quantity: number; price: number }[]
}

type Tab = 'books' | 'orders' | 'users' | 'newsletter' | 'articles'

// ─── Book Form ────────────────────────────────────────────────
const emptyForm = {
  title: '', description: '', price: '', features: ['', '', ''], image_url: ''
}

const BUCKET = 'service-images'

const STATUS_COLORS: Record<string, string> = {
  PENDING:    'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  PROCESSING: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  COMPLETED:  'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  CANCELLED:  'text-red-400 bg-red-400/10 border-red-400/20',
}
const STATUS_ES: Record<string, string> = {
  PENDING: 'Pendiente', PROCESSING: 'Procesando',
  COMPLETED: 'Completado', CANCELLED: 'Cancelado',
}

// ─── Confirm Dialog ───────────────────────────────────────────
interface ConfirmState {
  open: boolean
  title: string
  message: string
  danger?: boolean
  onConfirm: () => void
}
const DIALOG_CLOSED: ConfirmState = { open: false, title: '', message: '', onConfirm: () => {} }


// ─── Main Component ───────────────────────────────────────────
const AdminDashboard: React.FC = () => {
  const [tab, setTab] = useState<Tab>('books')
  const [books, setBooks] = useState<Book[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [users, setUsers] = useState<AdminUser[]>([])
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [stats, setStats] = useState({ books: 0, orders: 0, revenue: 0, users: 0 })
  const [loading, setLoading] = useState(true)
  const [dialog, setDialog] = useState<ConfirmState>(DIALOG_CLOSED)
  const [actionError, setActionError] = useState('')

  const askConfirm = (title: string, message: string, onConfirm: () => void, danger = true) =>
    setDialog({ open: true, title, message, danger, onConfirm })

  // Book form
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Book | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  // Orders
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  // Users
  const [deletingUser, setDeletingUser] = useState<string | null>(null)
  const [togglingRole, setTogglingRole] = useState<string | null>(null)

  // Newsletter
  const [nlSubject, setNlSubject] = useState('')
  const [nlBody, setNlBody] = useState('')
  const [nlTarget, setNlTarget] = useState<'subscribers' | 'users'>('subscribers')
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ ok: boolean; msg: string } | null>(null)

  // Articles
  const [articles, setArticles] = useState<Article[]>([])
  const [showArticleForm, setShowArticleForm] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [articleForm, setArticleForm] = useState({
    title: '', slug: '', excerpt: '', category: 'Mentalidad',
    content: '', pdf_url: '', cover_url: '', read_time: '5', is_published: true,
  })
  const [savingArticle, setSavingArticle] = useState(false)
  const [deletingArticle, setDeletingArticle] = useState<string | null>(null)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setLoading(true)
    await Promise.all([fetchBooks(), fetchOrders(), fetchUsers(), fetchSubscribers(), fetchArticles()])
    setLoading(false)
  }

  const fetchBooks = async () => {
    const { data } = await supabase
      .from('services').select('*').eq('category', 'LIBRO').order('created_at', { ascending: false })
    const b = (data ?? []) as Book[]
    setBooks(b)
    setStats(s => ({ ...s, books: b.length }))
  }

  const fetchOrders = async () => {
    const { data } = await supabase.rpc('admin_get_all_orders')
    const all = (data ?? []) as Order[]
    const revenue = all.reduce((s, o) => o.status !== 'CANCELLED' ? s + o.total_amount : s, 0)
    setOrders(all)
    setStats(s => ({ ...s, orders: all.length, revenue }))
  }

  const fetchUsers = async () => {
    const { data, error } = await supabase.rpc('admin_get_all_users')
    if (error) { console.error('fetchUsers:', error); return }
    const all = (data ?? []) as AdminUser[]
    setUsers(all)
    setStats(s => ({ ...s, users: all.length }))
  }

  const fetchSubscribers = async () => {
    const { data, error } = await supabase.rpc('admin_get_subscribers')
    if (error) { console.error('fetchSubscribers:', error); return }
    setSubscribers((data ?? []) as Subscriber[])
  }

  const fetchArticles = async () => {
    const { data } = await supabase
      .from('articles').select('*').order('published_at', { ascending: false })
    setArticles((data ?? []) as Article[])
  }

  // ── Article CRUD ──────────────────────────────────────────
  const slugify = (s: string) =>
    s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')

  const openCreateArticle = () => {
    setEditingArticle(null)
    setArticleForm({ title: '', slug: '', excerpt: '', category: 'Mentalidad',
      content: '', pdf_url: '', cover_url: '', read_time: '5', is_published: true })
    setCoverPreview(null)
    setShowArticleForm(true)
  }

  const openEditArticle = (a: Article) => {
    setEditingArticle(a)
    setArticleForm({ title: a.title, slug: a.slug, excerpt: a.excerpt,
      category: a.category, content: a.content, pdf_url: a.pdf_url ?? '',
      cover_url: a.cover_url ?? '', read_time: String(a.read_time), is_published: a.is_published })
    setCoverPreview(a.cover_url ?? null)
    setShowArticleForm(true)
  }

  const handleCoverUpload = async (file: File) => {
    if (!file) return
    setUploadingCover(true)
    const ext = file.name.split('.').pop()
    const path = `articles/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true })
    if (error) { console.error(error); setUploadingCover(false); return }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
    setArticleForm(f => ({ ...f, cover_url: data.publicUrl }))
    setCoverPreview(data.publicUrl)
    setUploadingCover(false)
  }

  const saveArticle = async (e: React.FormEvent) => {
    e.preventDefault(); setSavingArticle(true)
    const payload = {
      title: articleForm.title.trim(),
      slug: articleForm.slug.trim() || slugify(articleForm.title),
      excerpt: articleForm.excerpt.trim(),
      category: articleForm.category,
      content: articleForm.content.trim(),
      cover_url: articleForm.cover_url.trim() || null,
      pdf_url: articleForm.pdf_url.trim() || null,
      read_time: Number(articleForm.read_time) || 5,
      is_published: articleForm.is_published,
    }
    if (editingArticle) {
      await supabase.from('articles').update(payload).eq('id', editingArticle.id)
    } else {
      await supabase.from('articles').insert({ ...payload, published_at: new Date().toISOString() })
    }
    setSavingArticle(false); setShowArticleForm(false); fetchArticles()
  }

  const deleteArticle = (id: string) => {
    askConfirm(
      'Eliminar artículo',
      '¿Estás seguro? Esta acción no se puede deshacer.',
      async () => {
        setDialog(DIALOG_CLOSED)
        setDeletingArticle(id)
        await supabase.from('articles').delete().eq('id', id)
        setDeletingArticle(null); fetchArticles()
      }
    )
  }

  // ── Book CRUD ──────────────────────────────────────────────
  const openCreate = () => {
    setEditing(null); setForm(emptyForm); setImagePreview(null); setShowForm(true)
  }
  const openEdit = (book: Book) => {
    setEditing(book)
    setForm({ title: book.title, description: book.description, price: String(book.price),
      features: [...book.features, '', '', ''].slice(0, 3), image_url: book.image_url ?? '' })
    setImagePreview(book.image_url ?? null)
    setShowForm(true)
  }
  const handleImageUpload = async (file: File) => {
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `books/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true })
    if (error) { console.error(error); setUploading(false); return }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
    setForm(f => ({ ...f, image_url: data.publicUrl }))
    setImagePreview(data.publicUrl)
    setUploading(false)
  }
  const saveBook = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    const payload = { title: form.title.trim(), description: form.description.trim(),
      price: Number(form.price), features: form.features.filter(f => f.trim()),
      image_url: form.image_url.trim() || null, category: 'LIBRO', is_active: true }
    if (editing) await supabase.from('services').update(payload).eq('id', editing.id)
    else await supabase.from('services').insert(payload)
    setSaving(false); setShowForm(false); fetchBooks()
  }
  const deleteBook = (id: string) => {
    askConfirm(
      'Eliminar libro',
      '¿Estás seguro? Esta acción no se puede deshacer.',
      async () => {
        setDialog(DIALOG_CLOSED)
        setDeleting(id)
        await supabase.from('services').delete().eq('id', id)
        setDeleting(null); fetchBooks()
      }
    )
  }

  // ── Order status ──────────────────────────────────────────
  const updateStatus = async (orderId: string, status: string) => {
    setUpdatingStatus(orderId)
    await supabase.rpc('admin_update_order_status', { p_order_id: orderId, p_new_status: status })
    setUpdatingStatus(null); fetchOrders()
  }

  // ── User management ───────────────────────────────────────
  const handleDeleteUser = (userId: string, userEmail: string) => {
    askConfirm(
      'Eliminar usuario',
      `¿Estás seguro de que quieres eliminar a ${userEmail}? Esta acción no se puede deshacer.`,
      async () => {
        setDialog(DIALOG_CLOSED)
        setDeletingUser(userId)
        const { error } = await supabase.rpc('admin_delete_user', { p_user_id: userId })
        if (error) setActionError(error.message)
        setDeletingUser(null); fetchUsers()
      }
    )
  }

  const handleToggleRole = (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    if (newRole === 'admin') {
      askConfirm(
        'Dar permisos de admin',
        '¿Dar permisos de administrador a este usuario? Tendrá acceso total al panel.',
        async () => {
          setDialog(DIALOG_CLOSED)
          setTogglingRole(userId)
          const { error } = await supabase.rpc('admin_set_user_role', { p_user_id: userId, p_role: newRole })
          if (error) setActionError(error.message)
          setTogglingRole(null); fetchUsers()
        },
        false
      )
    } else {
      // Downgrade — no confirm needed, just do it
      setTogglingRole(userId)
      supabase.rpc('admin_set_user_role', { p_user_id: userId, p_role: newRole })
        .then(({ error }) => {
          if (error) setActionError(error.message)
          setTogglingRole(null); fetchUsers()
        })
    }
  }

  // ── Newsletter ────────────────────────────────────────────
  const invokeNewsletter = async (recipients: { email: string; name?: string }[]) => {
    try {
      // Let Supabase JS attach the session token automatically — do NOT pass manual header
      const { data, error } = await supabase.functions.invoke('send-newsletter', {
        body: { subject: nlSubject, body: nlBody, recipients },
      })

      if (error) {
        // Try to extract the actual body from the error context
        let detail = error.message
        try {
          const ctx = (error as any).context
          if (ctx) {
            const text = typeof ctx.json === 'function' ? await ctx.json() : ctx
            detail = text?.error ?? text?.message ?? error.message
          }
        } catch { /* ignore */ }
        setSendResult({ ok: false, msg: detail })
      } else if (data?.error) {
        setSendResult({ ok: false, msg: data.error })
      } else {
        setSendResult({ ok: true, msg: `¡Enviado a ${data.sent} destinatario${data.sent !== 1 ? 's' : ''}!${data.errors?.length ? ` (${data.errors.length} fallidos)` : ''}` })
      }
    } catch (err) {
      setSendResult({ ok: false, msg: String(err) })
    }
    setSending(false)
  }

  const sendTest = async () => {
    if (!nlSubject.trim() || nlBody.replace(/<[^>]*>/g, '').trim() === '') return
    setSending(true); setSendResult(null)
    const { data: { session } } = await supabase.auth.getSession()
    const email = session?.user?.email
    if (!email) { setSendResult({ ok: false, msg: 'No se encontró tu email.' }); setSending(false); return }
    await invokeNewsletter([{ email }])
  }

  const sendNewsletter = async () => {
    if (!nlSubject.trim() || !nlBody.trim()) return
    setSending(true); setSendResult(null)

    const recipients = nlTarget === 'subscribers'
      ? subscribers.map(s => ({ email: s.email, name: s.name ?? undefined }))
      : users.map(u => ({ email: u.email, name: u.name || undefined }))

    if (!recipients.length) {
      setSendResult({ ok: false, msg: 'No hay destinatarios en esta lista.' })
      setSending(false); return
    }

    await invokeNewsletter(recipients)
  }

  const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'articles',   label: 'Artículos',    icon: FileText    },
    { key: 'books',      label: 'Libros',       icon: BookOpen    },
    { key: 'orders',     label: 'Órdenes',      icon: ShoppingBag },
    { key: 'users',      label: 'Usuarios',     icon: Users       },
    { key: 'newsletter', label: 'Newsletter',   icon: Mail        },
  ]

  // ─── Render ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#2c2b2b] pt-24 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-8 bg-[#c4501a]" />
            <p className="text-[#c4501a] text-xs font-bold uppercase tracking-[0.3em]">Panel</p>
          </div>
          <h1 className="text-4xl font-bold text-white">Admin</h1>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { icon: BookOpen,    label: 'Libros',      value: stats.books },
            { icon: ShoppingBag, label: 'Órdenes',     value: stats.orders },
            { icon: TrendingUp,  label: 'Ingresos',    value: `$${stats.revenue.toLocaleString('es-CO')}` },
            { icon: Users,       label: 'Usuarios',    value: stats.users },
          ].map(({ icon: Icon, label, value }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-[#1a1b1c] border border-white/[0.07] rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-[#c4501a]/10 border border-[#c4501a]/20 rounded-xl flex items-center justify-center">
                <Icon size={18} className="text-[#c4501a]" />
              </div>
              <div>
                <p className="text-xl font-bold text-white">{loading ? '—' : value}</p>
                <p className="text-white/35 text-[10px] uppercase tracking-wider">{label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-[#1a1b1c] border border-white/[0.07] rounded-xl p-1 w-fit flex-wrap">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                tab === key
                  ? 'bg-[#c4501a] text-white shadow-lg shadow-[#c4501a]/20'
                  : 'text-white/40 hover:text-white'
              }`}>
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-24"><Spinner size="lg" /></div>
        ) : (
          <>
            {/* ── BOOKS TAB ── */}
            {tab === 'books' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex justify-end mb-5">
                  <button onClick={openCreate}
                    className="flex items-center gap-2 bg-[#c4501a] hover:bg-[#d45c1a] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-[#c4501a]/20">
                    <Plus size={15} /> Nuevo libro
                  </button>
                </div>
                <div className="space-y-3">
                  {books.map(book => (
                    <div key={book.id}
                      className="bg-[#1a1b1c] border border-white/[0.07] rounded-2xl p-5 flex items-center gap-5">
                      <div className="w-12 h-16 bg-[#c4501a]/10 border border-[#c4501a]/20 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {book.image_url
                          ? <img src={book.image_url} alt={book.title} className="w-full h-full object-cover" />
                          : <BookOpen size={18} className="text-[#c4501a]/60" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm truncate">{book.title}</p>
                        <p className="text-white/40 text-xs mt-0.5 line-clamp-1">{book.description}</p>
                        <p className="text-[#c4501a] text-xs font-bold mt-1">${book.price.toLocaleString('es-CO')} COP</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(book)}
                          className="w-8 h-8 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] rounded-lg flex items-center justify-center text-white/50 hover:text-white transition-all">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => deleteBook(book.id)} disabled={deleting === book.id}
                          className="w-8 h-8 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg flex items-center justify-center text-red-400 transition-all">
                          {deleting === book.id ? <Spinner size="sm" /> : <Trash2 size={13} />}
                        </button>
                      </div>
                    </div>
                  ))}
                  {books.length === 0 && (
                    <div className="text-center py-16 text-white/25">
                      <BookOpen size={32} className="mx-auto mb-3 opacity-30" strokeWidth={1} />
                      <p>No hay libros. Crea uno nuevo.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── ORDERS TAB ── */}
            {tab === 'orders' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                {orders.length === 0 && (
                  <div className="text-center py-16 text-white/25">
                    <Package size={32} className="mx-auto mb-3 opacity-30" strokeWidth={1} />
                    <p>No hay órdenes aún.</p>
                  </div>
                )}
                {orders.map(order => (
                  <div key={order.id} className="bg-[#1a1b1c] border border-white/[0.07] rounded-2xl overflow-hidden">
                    <div className="p-5 flex items-center gap-4 cursor-pointer"
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold truncate">{order.user_name}</p>
                        <p className="text-white/35 text-xs">{order.user_email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#c4501a] font-bold text-sm">${order.total_amount.toLocaleString('es-CO')}</p>
                        <p className="text-white/25 text-[10px]">{new Date(order.created_at).toLocaleDateString('es-CO')}</p>
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-lg border ${STATUS_COLORS[order.status]}`}>
                        {STATUS_ES[order.status]}
                      </span>
                      <ChevronDown size={14} className={`text-white/30 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} />
                    </div>
                    <AnimatePresence>
                      {expandedOrder === order.id && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                          className="overflow-hidden border-t border-white/[0.06]">
                          <div className="p-5 space-y-4">
                            <div>
                              <p className="text-[10px] uppercase tracking-widest text-white/25 mb-2">Libros comprados</p>
                              <div className="space-y-1.5">
                                {order.items?.map((item, i) => (
                                  <div key={i} className="flex justify-between text-sm">
                                    <span className="text-white/70">{item.service_title} × {item.quantity}</span>
                                    <span className="text-white/50">${item.price.toLocaleString('es-CO')}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-widest text-white/25 mb-2">Cambiar estado</p>
                              <div className="flex flex-wrap gap-2">
                                {['PENDING','PROCESSING','COMPLETED','CANCELLED'].map(s => (
                                  <button key={s} disabled={order.status === s || updatingStatus === order.id}
                                    onClick={() => updateStatus(order.id, s)}
                                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                                      order.status === s
                                        ? STATUS_COLORS[s]
                                        : 'border-white/[0.08] text-white/40 hover:text-white hover:border-white/20'
                                    }`}>
                                    {updatingStatus === order.id && order.status !== s ? '...' : STATUS_ES[s]}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </motion.div>
            )}

            {/* ── USERS TAB ── */}
            {tab === 'users' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-center justify-between mb-5">
                  <p className="text-white/40 text-sm">{users.length} usuario{users.length !== 1 ? 's' : ''} registrado{users.length !== 1 ? 's' : ''}</p>
                  <button onClick={fetchUsers}
                    className="flex items-center gap-2 text-white/40 hover:text-white text-xs border border-white/[0.08] hover:border-white/20 px-3 py-1.5 rounded-lg transition-all">
                    <RefreshCw size={11} /> Actualizar
                  </button>
                </div>

                <div className="space-y-2">
                  {users.map(u => (
                    <div key={u.id}
                      className="bg-[#1a1b1c] border border-white/[0.07] rounded-2xl p-4 flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-xl bg-[#c4501a]/10 border border-[#c4501a]/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-[#c4501a] text-sm font-bold">
                          {(u.name || u.email).charAt(0).toUpperCase()}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-white text-sm font-semibold truncate">
                            {u.name || <span className="text-white/30 italic">Sin nombre</span>}
                          </p>
                          {u.role === 'admin' && (
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-[#c4501a]/15 border border-[#c4501a]/30 text-[#c4501a] rounded-md uppercase tracking-wide">
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-white/40 text-xs truncate">{u.email}</p>
                        <p className="text-white/20 text-[10px] mt-0.5">
                          Registrado {new Date(u.created_at).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleToggleRole(u.id, u.role)}
                          disabled={togglingRole === u.id}
                          title={u.role === 'admin' ? 'Quitar admin' : 'Hacer admin'}
                          className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${
                            u.role === 'admin'
                              ? 'bg-[#c4501a]/10 border-[#c4501a]/25 text-[#c4501a] hover:bg-[#c4501a]/20'
                              : 'bg-white/[0.04] border-white/[0.08] text-white/35 hover:text-[#c4501a] hover:border-[#c4501a]/25'
                          }`}>
                          {togglingRole === u.id
                            ? <Spinner size="sm" />
                            : u.role === 'admin' ? <ShieldOff size={13} /> : <Shield size={13} />
                          }
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id, u.email)}
                          disabled={deletingUser === u.id}
                          title="Eliminar usuario"
                          className="w-8 h-8 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg flex items-center justify-center text-red-400 transition-all">
                          {deletingUser === u.id ? <Spinner size="sm" /> : <UserX size={13} />}
                        </button>
                      </div>
                    </div>
                  ))}

                  {users.length === 0 && (
                    <div className="text-center py-16 text-white/25">
                      <Users size={32} className="mx-auto mb-3 opacity-30" strokeWidth={1} />
                      <p>No hay usuarios aún.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── NEWSLETTER TAB ── */}
            {tab === 'newsletter' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                  {/* Compose */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="bg-[#1a1b1c] border border-white/[0.07] rounded-2xl p-6">
                      <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
                        <Mail size={16} className="text-[#c4501a]" />
                        Redactar email
                      </h3>

                      {/* Target selector */}
                      <div className="mb-5">
                        <label className="text-[10px] uppercase tracking-widest text-white/35 block mb-2">
                          Enviar a
                        </label>
                        <div className="flex gap-2">
                          {[
                            { value: 'subscribers', label: `Suscriptores (${subscribers.length})` },
                            { value: 'users',        label: `Usuarios registrados (${users.length})` },
                          ].map(opt => (
                            <button key={opt.value}
                              onClick={() => setNlTarget(opt.value as typeof nlTarget)}
                              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium border transition-all ${
                                nlTarget === opt.value
                                  ? 'bg-[#c4501a] border-[#c4501a] text-white shadow-lg shadow-[#c4501a]/20'
                                  : 'border-white/[0.08] text-white/40 hover:text-white hover:border-white/20'
                              }`}>
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Subject */}
                      <div className="mb-4">
                        <label className="text-[10px] uppercase tracking-widest text-white/35 block mb-1.5">
                          Asunto *
                        </label>
                        <input
                          value={nlSubject}
                          onChange={e => setNlSubject(e.target.value)}
                          placeholder="Ej: 3 hábitos que cambiarán tu mañana"
                          className="w-full px-4 py-2.5 bg-[#2c2b2b] border border-white/[0.09] rounded-xl text-white text-sm outline-none focus:border-[#c4501a]/45 placeholder:text-white/20"
                        />
                      </div>

                      {/* Body */}
                      <div className="mb-5">
                        <label className="text-[10px] uppercase tracking-widest text-white/35 block mb-1.5">
                          Contenido *
                        </label>
                        <RichTextEditor
                          value={nlBody}
                          onChange={html => setNlBody(html)}
                          placeholder="Escribe el contenido del email aquí…"
                        />
                      </div>

                      {/* Result message */}
                      <AnimatePresence>
                        {sendResult && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className={`flex items-start gap-3 px-4 py-3 rounded-xl border mb-4 text-sm ${
                              sendResult.ok
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                : 'bg-red-500/10 border-red-500/20 text-red-400'
                            }`}>
                            {sendResult.ok
                              ? <CheckCircle size={15} className="flex-shrink-0 mt-0.5" />
                              : <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                            }
                            {sendResult.msg}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={sendTest}
                          disabled={sending || !nlSubject.trim() || nlBody.replace(/<[^>]*>/g, '').trim() === ''}
                          className="flex-1 flex items-center justify-center gap-2 border border-white/20 hover:border-[#c4501a]/50 text-white/60 hover:text-white font-medium py-3 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none text-sm">
                          {sending ? <Spinner size="sm" /> : <Send size={14} />}
                          Probar (mi email)
                        </button>
                        <button
                          onClick={sendNewsletter}
                          disabled={sending || !nlSubject.trim() || !nlBody.trim() || nlBody.replace(/<[^>]*>/g, '').trim() === ''}
                          className="flex-1 flex items-center justify-center gap-2 bg-[#c4501a] hover:bg-[#d45c1a] text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-[#c4501a]/20 disabled:opacity-50 disabled:pointer-events-none text-sm">
                          {sending ? <><Spinner size="sm" /> Enviando...</> : <><Send size={15} /> Enviar a todos</>}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar: subscriber list */}
                  <div className="space-y-4">
                    <div className="bg-[#1a1b1c] border border-white/[0.07] rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                          <Users size={14} className="text-[#c4501a]" />
                          Suscriptores ({subscribers.length})
                        </h3>
                        <button onClick={fetchSubscribers}
                          className="text-white/30 hover:text-white transition-colors">
                          <RefreshCw size={12} />
                        </button>
                      </div>

                      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                        {subscribers.map(s => (
                          <div key={s.id} className="flex items-center gap-2 py-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-white/70 text-xs truncate">{s.email}</p>
                              <p className="text-white/25 text-[10px]">
                                {new Date(s.subscribed_at).toLocaleDateString('es-CO')}
                              </p>
                            </div>
                          </div>
                        ))}
                        {subscribers.length === 0 && (
                          <p className="text-white/25 text-xs text-center py-4">Sin suscriptores aún</p>
                        )}
                      </div>
                    </div>

                    {/* Tips */}
                    <div className="bg-[#c4501a]/5 border border-[#c4501a]/15 rounded-2xl p-4">
                      <p className="text-[#c4501a] text-xs font-bold uppercase tracking-widest mb-3">Consejos</p>
                      <ul className="space-y-2 text-white/40 text-xs">
                        <li>• Asunto corto = más aperturas</li>
                        <li>• Escribe en primera persona</li>
                        <li>• Un solo mensaje clave por email</li>
                        <li>• Incluye un CTA claro al final</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── ARTICLES TAB ── */}
            {tab === 'articles' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex justify-end mb-5">
                  <button onClick={openCreateArticle}
                    className="flex items-center gap-2 bg-[#c4501a] hover:bg-[#d45c1a] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-[#c4501a]/20">
                    <Plus size={15} /> Nuevo artículo
                  </button>
                </div>

                <div className="space-y-3">
                  {articles.map(a => (
                    <div key={a.id}
                      className="bg-[#1a1b1c] border border-white/[0.07] rounded-2xl p-5 flex items-center gap-5">
                      <div className="w-10 h-10 bg-[#c4501a]/10 border border-[#c4501a]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText size={16} className="text-[#c4501a]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-white font-semibold text-sm truncate">{a.title}</p>
                          {!a.is_published && (
                            <span className="text-[10px] px-2 py-0.5 bg-white/[0.06] text-white/30 rounded-md border border-white/[0.08]">
                              Borrador
                            </span>
                          )}
                        </div>
                        <p className="text-white/30 text-xs mt-0.5">{a.category} · {a.read_time} min</p>
                        <p className="text-white/25 text-xs mt-0.5 line-clamp-1">{a.excerpt}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <a href={`/articulos/${a.slug}`} target="_blank" rel="noopener noreferrer"
                          className="w-8 h-8 bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.08] rounded-lg flex items-center justify-center text-white/30 hover:text-white transition-all">
                          <ExternalLink size={12} />
                        </a>
                        <button onClick={() => openEditArticle(a)}
                          className="w-8 h-8 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] rounded-lg flex items-center justify-center text-white/50 hover:text-white transition-all">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => deleteArticle(a.id)} disabled={deletingArticle === a.id}
                          className="w-8 h-8 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg flex items-center justify-center text-red-400 transition-all">
                          {deletingArticle === a.id ? <Spinner size="sm" /> : <Trash2 size={13} />}
                        </button>
                      </div>
                    </div>
                  ))}
                  {articles.length === 0 && (
                    <div className="text-center py-16 text-white/25">
                      <FileText size={32} className="mx-auto mb-3 opacity-30" strokeWidth={1} />
                      <p>No hay artículos. Crea el primero.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* ── Article Form Modal ── */}
      <AnimatePresence>
        {showArticleForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowArticleForm(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="bg-[#1a1b1c] border border-white/[0.09] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

              <div className="flex items-center justify-between p-6 border-b border-white/[0.07]">
                <h2 className="text-white font-bold text-lg">
                  {editingArticle ? 'Editar artículo' : 'Nuevo artículo'}
                </h2>
                <button onClick={() => setShowArticleForm(false)}
                  className="w-8 h-8 bg-white/[0.05] hover:bg-white/[0.1] rounded-lg flex items-center justify-center text-white/50 hover:text-white transition-all">
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={saveArticle} className="p-6 space-y-4">
                {/* Title */}
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-white/35 block mb-1.5">Título *</label>
                  <input required value={articleForm.title}
                    onChange={e => setArticleForm(f => ({
                      ...f, title: e.target.value,
                      slug: f.slug || slugify(e.target.value)
                    }))}
                    className="w-full px-4 py-2.5 bg-[#2c2b2b] border border-white/[0.09] rounded-xl text-white text-sm outline-none focus:border-[#c4501a]/45"
                    placeholder="El título del artículo" />
                </div>

                {/* Slug */}
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-white/35 block mb-1.5">Slug (URL)</label>
                  <input value={articleForm.slug}
                    onChange={e => setArticleForm(f => ({ ...f, slug: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[#2c2b2b] border border-white/[0.09] rounded-xl text-white/60 text-sm outline-none focus:border-[#c4501a]/45 font-mono"
                    placeholder="auto-generado-del-titulo" />
                </div>

                {/* Category + read time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-white/35 block mb-1.5">Categoría</label>
                    <select value={articleForm.category}
                      onChange={e => setArticleForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-[#2c2b2b] border border-white/[0.09] rounded-xl text-white text-sm outline-none focus:border-[#c4501a]/45">
                      {['Mentalidad','Negocios','Espiritualidad','General'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-white/35 block mb-1.5">Tiempo de lectura (min)</label>
                    <input type="number" min="1" max="60" value={articleForm.read_time}
                      onChange={e => setArticleForm(f => ({ ...f, read_time: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-[#2c2b2b] border border-white/[0.09] rounded-xl text-white text-sm outline-none focus:border-[#c4501a]/45" />
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-white/35 block mb-1.5">Extracto *</label>
                  <textarea required value={articleForm.excerpt}
                    onChange={e => setArticleForm(f => ({ ...f, excerpt: e.target.value }))}
                    rows={2}
                    className="w-full px-4 py-2.5 bg-[#2c2b2b] border border-white/[0.09] rounded-xl text-white text-sm outline-none focus:border-[#c4501a]/45 resize-none"
                    placeholder="Frase corta que aparece en la lista..." />
                </div>

                {/* Content */}
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-white/35 block mb-1.5">
                    Contenido *
                  </label>
                  <RichTextEditor
                    value={articleForm.content}
                    onChange={html => setArticleForm(f => ({ ...f, content: html }))}
                    placeholder="Escribe el contenido del artículo aquí…"
                  />
                </div>

                {/* Cover image */}
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-white/35 block mb-1.5">Imagen de portada</label>
                  {coverPreview && (
                    <div className="relative mb-2 w-full h-36 rounded-xl overflow-hidden border border-white/[0.09]">
                      <img src={coverPreview} alt="cover" className="w-full h-full object-cover" />
                      <button type="button"
                        onClick={() => { setCoverPreview(null); setArticleForm(f => ({ ...f, cover_url: '' })) }}
                        className="absolute top-2 right-2 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center text-white hover:bg-red-500/80 transition-colors">
                        <X size={11} />
                      </button>
                    </div>
                  )}
                  <label className={`flex items-center gap-3 px-4 py-3 bg-[#2c2b2b] border border-dashed border-white/[0.15] hover:border-[#c4501a]/40 rounded-xl cursor-pointer transition-colors ${uploadingCover ? 'opacity-60 pointer-events-none' : ''}`}>
                    {uploadingCover
                      ? <><Spinner size="sm" /><span className="text-white/40 text-sm">Subiendo...</span></>
                      : <><Upload size={15} className="text-white/40" /><span className="text-white/40 text-sm">Subir imagen de portada</span></>
                    }
                    <input type="file" accept="image/*" className="hidden"
                      onChange={e => { const f = e.target.files?.[0]; if (f) handleCoverUpload(f) }} />
                  </label>
                  <div className="flex items-center gap-2 mt-2">
                    <ImageIcon size={12} className="text-white/20 flex-shrink-0" />
                    <input value={articleForm.cover_url}
                      onChange={e => { setArticleForm(f => ({ ...f, cover_url: e.target.value })); setCoverPreview(e.target.value || null) }}
                      className="flex-1 px-3 py-1.5 bg-transparent border-b border-white/[0.07] text-white/40 text-xs outline-none focus:border-[#c4501a]/30 placeholder:text-white/20"
                      placeholder="O pega una URL de imagen..." />
                  </div>
                </div>

                {/* PDF URL */}
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-white/35 block mb-1.5">URL de PDF (opcional)</label>
                  <input value={articleForm.pdf_url}
                    onChange={e => setArticleForm(f => ({ ...f, pdf_url: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[#2c2b2b] border border-white/[0.09] rounded-xl text-white/60 text-sm outline-none focus:border-[#c4501a]/45"
                    placeholder="https://..." />
                </div>

                {/* Published toggle */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => setArticleForm(f => ({ ...f, is_published: !f.is_published }))}
                    className={`w-10 h-5 rounded-full transition-colors flex items-center px-0.5 ${articleForm.is_published ? 'bg-[#c4501a]' : 'bg-white/10'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${articleForm.is_published ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                  <span className="text-white/60 text-sm">{articleForm.is_published ? 'Publicado' : 'Borrador'}</span>
                </label>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowArticleForm(false)}
                    className="flex-1 py-3 border border-white/[0.09] text-white/50 hover:text-white rounded-xl text-sm font-medium transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" disabled={savingArticle}
                    className="flex-1 py-3 bg-[#c4501a] hover:bg-[#d45c1a] text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#c4501a]/20">
                    {savingArticle ? <Spinner size="sm" /> : <Check size={15} />}
                    {savingArticle ? 'Guardando...' : editingArticle ? 'Guardar cambios' : 'Publicar artículo'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Book Form Modal ── */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="bg-[#1a1b1c] border border-white/[0.09] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

              <div className="flex items-center justify-between p-6 border-b border-white/[0.07]">
                <h2 className="text-white font-bold text-lg">
                  {editing ? 'Editar libro' : 'Nuevo libro'}
                </h2>
                <button onClick={() => setShowForm(false)}
                  className="w-8 h-8 bg-white/[0.05] hover:bg-white/[0.1] rounded-lg flex items-center justify-center text-white/50 hover:text-white transition-all">
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={saveBook} className="p-6 space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-white/35 block mb-1.5">Título *</label>
                  <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[#2c2b2b] border border-white/[0.09] rounded-xl text-white text-sm outline-none focus:border-[#c4501a]/45"
                    placeholder="El Arte de Construir tu Destino" />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-white/35 block mb-1.5">Descripción *</label>
                  <textarea required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={3} className="w-full px-4 py-2.5 bg-[#2c2b2b] border border-white/[0.09] rounded-xl text-white text-sm outline-none focus:border-[#c4501a]/45 resize-none"
                    placeholder="Descripción del libro..." />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-white/35 block mb-1.5">Precio (COP) *</label>
                  <input required type="number" min="0" value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[#2c2b2b] border border-white/[0.09] rounded-xl text-white text-sm outline-none focus:border-[#c4501a]/45"
                    placeholder="35000" />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-white/35 block mb-1.5">Portada del libro</label>
                  {imagePreview && (
                    <div className="relative mb-2 w-24 h-32 rounded-xl overflow-hidden border border-white/[0.09]">
                      <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                      <button type="button"
                        onClick={() => { setImagePreview(null); setForm(f => ({ ...f, image_url: '' })) }}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center text-white hover:bg-red-500/80 transition-colors">
                        <X size={10} />
                      </button>
                    </div>
                  )}
                  <label className={`flex items-center gap-3 px-4 py-3 bg-[#2c2b2b] border border-dashed border-white/[0.15] hover:border-[#c4501a]/40 rounded-xl cursor-pointer transition-colors ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
                    {uploading
                      ? <><Spinner size="sm" /><span className="text-white/40 text-sm">Subiendo...</span></>
                      : <><Upload size={15} className="text-white/40" /><span className="text-white/40 text-sm">Subir imagen (JPG, PNG, WebP)</span></>
                    }
                    <input type="file" accept="image/*" className="hidden"
                      onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f) }} />
                  </label>
                  <div className="flex items-center gap-2 mt-2">
                    <ImageIcon size={12} className="text-white/20 flex-shrink-0" />
                    <input value={form.image_url} onChange={e => { setForm(f => ({ ...f, image_url: e.target.value })); setImagePreview(e.target.value || null) }}
                      className="flex-1 px-3 py-1.5 bg-transparent border-b border-white/[0.07] text-white/40 text-xs outline-none focus:border-[#c4501a]/30 placeholder:text-white/20"
                      placeholder="O pega una URL directamente..." />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-white/35 block mb-1.5">Características (hasta 3)</label>
                  {form.features.map((f, i) => (
                    <input key={i} value={f}
                      onChange={e => setForm(prev => {
                        const features = [...prev.features]; features[i] = e.target.value; return { ...prev, features }
                      })}
                      className="w-full px-4 py-2.5 bg-[#2c2b2b] border border-white/[0.09] rounded-xl text-white text-sm outline-none focus:border-[#c4501a]/45 mb-2"
                      placeholder={`Característica ${i + 1}`} />
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)}
                    className="flex-1 py-3 border border-white/[0.09] text-white/50 hover:text-white rounded-xl text-sm font-medium transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" disabled={saving}
                    className="flex-1 py-3 bg-[#c4501a] hover:bg-[#d45c1a] text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#c4501a]/20">
                    {saving ? <Spinner size="sm" /> : <Check size={15} />}
                    {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Crear libro'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Confirm Dialog ── */}
      <AnimatePresence>
        {dialog.open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setDialog(DIALOG_CLOSED)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-sm bg-[#1a1b1c] border border-white/[0.09] rounded-2xl p-6 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Icon */}
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${
                dialog.danger ? 'bg-red-500/10 border border-red-500/20' : 'bg-[#c4501a]/10 border border-[#c4501a]/20'
              }`}>
                {dialog.danger
                  ? <AlertCircle size={20} className="text-red-400" />
                  : <Shield size={20} className="text-[#c4501a]" />
                }
              </div>

              <h3 className="text-white font-bold text-lg mb-2">{dialog.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed mb-6">{dialog.message}</p>

              <div className="flex gap-3">
                <button
                  onClick={() => setDialog(DIALOG_CLOSED)}
                  className="flex-1 py-2.5 rounded-xl border border-white/[0.09] text-white/50 hover:text-white hover:border-white/20 text-sm font-medium transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={dialog.onConfirm}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    dialog.danger
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-[#c4501a] hover:bg-[#d45c1a] text-white'
                  }`}
                >
                  {dialog.danger ? 'Sí, eliminar' : 'Confirmar'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Action error toast ── */}
      <AnimatePresence>
        {actionError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-red-500/10 border border-red-500/25 text-red-400 text-sm px-5 py-3 rounded-xl shadow-xl backdrop-blur-md"
          >
            <AlertCircle size={15} />
            {actionError}
            <button onClick={() => setActionError('')} className="ml-2 text-red-400/50 hover:text-red-400">
              <X size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default AdminDashboard
