import React, { useEffect, useState } from 'react'
import { MessageCircle, Trash2, Send, AlertCircle, Reply, CornerDownRight } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'

interface Comment {
  id: string
  article_id: string
  author_name: string
  content: string
  created_at: string
  parent_id: string | null
  is_admin_reply: boolean
}

interface Props {
  articleId: string
}

interface ConfirmState {
  open: boolean
  commentId: string | null
  authorName: string
}

const CommentSection: React.FC<Props> = ({ articleId }) => {
  const [comments, setComments]   = useState<Comment[]>([])
  const [loading, setLoading]     = useState(true)
  const [name, setName]           = useState('')
  const [text, setText]           = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState(false)
  const [confirm, setConfirm]     = useState<ConfirmState>({ open: false, commentId: null, authorName: '' })
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText]   = useState('')
  const [submittingReply, setSubmittingReply] = useState(false)
  const { isAdmin, user } = useAuthStore()

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('article_id', articleId)
      .order('created_at', { ascending: true })
    setComments((data ?? []) as Comment[])
    setLoading(false)
  }

  const topLevel = comments.filter(c => !c.parent_id)
  const repliesOf = (id: string) => comments.filter(c => c.parent_id === id)

  const handleReplySubmit = async (parentId: string) => {
    if (!replyText.trim()) return
    setSubmittingReply(true)
    const { error: err } = await supabase.from('comments').insert({
      article_id:     articleId,
      author_name:    user?.name || 'Hernan Figueredo',
      content:        replyText.trim(),
      parent_id:      parentId,
      is_admin_reply: true,
    })
    setSubmittingReply(false)
    if (err) return
    setReplyText('')
    setReplyingTo(null)
    fetchComments()
  }

  useEffect(() => { fetchComments() }, [articleId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !text.trim()) return
    setSubmitting(true)
    setError('')

    const { error: err } = await supabase.from('comments').insert({
      article_id:  articleId,
      author_name: name.trim(),
      content:     text.trim(),
    })

    setSubmitting(false)

    if (err) {
      setError('No se pudo publicar el comentario. Intenta de nuevo.')
      return
    }

    setName('')
    setText('')
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
    fetchComments()
  }

  const handleDelete = async () => {
    if (!confirm.commentId) return
    const { error: err } = await supabase.from('comments').delete().eq('id', confirm.commentId)
    if (!err) setComments(prev => prev.filter(c => c.id !== confirm.commentId))
    setConfirm({ open: false, commentId: null, authorName: '' })
  }

  return (
    <section className="max-w-2xl mx-auto px-4 pb-20 mt-4">
      <div className="h-px bg-white/[0.06] mb-12" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <MessageCircle size={18} className="text-[#f26822]" />
        <h2 className="text-white font-bold text-lg">
          {comments.length > 0
            ? `${comments.length} comentario${comments.length !== 1 ? 's' : ''}`
            : 'Comentarios'}
        </h2>
      </div>

      {/* Comment list */}
      {loading ? (
        <div className="space-y-4 mb-10">
          {[1, 2].map(i => (
            <div key={i} className="bg-[#1a1b1c] border border-white/[0.06] rounded-2xl p-5 animate-pulse">
              <div className="h-3 bg-white/10 rounded w-24 mb-3" />
              <div className="h-3 bg-white/[0.06] rounded w-full mb-2" />
              <div className="h-3 bg-white/[0.06] rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-white/25 text-sm mb-10">
          Sé el primero en dejar un comentario.
        </p>
      ) : (
        <AnimatePresence initial={false}>
          <ul className="space-y-4 mb-10">
            {topLevel.map(c => (
              <motion.li
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25 }}
                className="bg-[#1a1b1c] border border-white/[0.06] rounded-2xl p-5 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar initial */}
                    <div className="w-8 h-8 rounded-full bg-[#f26822]/15 border border-[#f26822]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#f26822] text-xs font-bold">
                        {c.author_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <span className="text-white text-sm font-semibold">{c.author_name}</span>
                      <span className="text-white/20 text-xs ml-2">
                        {new Date(c.created_at).toLocaleDateString('es-CO', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Admin delete */}
                  {isAdmin() && (
                    <button
                      onClick={() => setConfirm({ open: true, commentId: c.id, authorName: c.author_name })}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0"
                      title="Eliminar comentario"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                <p className="text-white/60 text-sm leading-relaxed mt-3 pl-11">
                  {c.content}
                </p>

                {/* Admin reply trigger */}
                {isAdmin() && (
                  <button
                    onClick={() => { setReplyingTo(replyingTo === c.id ? null : c.id); setReplyText('') }}
                    className="flex items-center gap-1.5 text-[#f26822]/70 hover:text-[#f26822] text-xs font-medium mt-3 pl-11 transition-colors"
                  >
                    <Reply size={12} /> Responder
                  </button>
                )}

                {/* Inline reply form */}
                {replyingTo === c.id && (
                  <div className="mt-3 pl-11">
                    <textarea
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      rows={2}
                      maxLength={1000}
                      placeholder="Escribe tu respuesta..."
                      className="w-full px-3 py-2 bg-[#2c2b2b] border border-white/[0.09] rounded-xl text-white text-sm placeholder:text-white/20 outline-none focus:border-[#f26822]/40 transition-colors resize-none"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleReplySubmit(c.id)}
                        disabled={submittingReply || !replyText.trim()}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f26822] hover:bg-[#f26822]/90 disabled:opacity-40 text-white text-xs font-semibold rounded-lg transition-all"
                      >
                        <Send size={11} /> {submittingReply ? 'Enviando…' : 'Enviar'}
                      </button>
                      <button
                        onClick={() => { setReplyingTo(null); setReplyText('') }}
                        className="px-3 py-1.5 text-white/40 hover:text-white text-xs font-medium transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {/* Replies */}
                {repliesOf(c.id).length > 0 && (
                  <ul className="mt-4 pl-11 space-y-3">
                    {repliesOf(c.id).map(r => (
                      <li key={r.id} className="flex gap-2 group/reply">
                        <CornerDownRight size={14} className="text-white/15 flex-shrink-0 mt-1" />
                        <div className="flex-1 min-w-0 bg-[#f26822]/[0.04] border border-[#f26822]/10 rounded-xl p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-white text-sm font-semibold">{r.author_name}</span>
                              {r.is_admin_reply && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#f26822]/15 border border-[#f26822]/30 text-[#f26822] rounded-md uppercase tracking-wide">
                                  Autor
                                </span>
                              )}
                              <span className="text-white/20 text-xs">
                                {new Date(r.created_at).toLocaleDateString('es-CO', {
                                  year: 'numeric', month: 'short', day: 'numeric',
                                })}
                              </span>
                            </div>
                            {isAdmin() && (
                              <button
                                onClick={() => setConfirm({ open: true, commentId: r.id, authorName: r.author_name })}
                                className="opacity-0 group-hover/reply:opacity-100 p-1 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0"
                                title="Eliminar respuesta"
                              >
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                          <p className="text-white/60 text-sm leading-relaxed mt-2">{r.content}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.li>
            ))}
          </ul>
        </AnimatePresence>
      )}

      {/* Submit form */}
      <div className="bg-[#1a1b1c] border border-white/[0.08] rounded-2xl p-6">
        <h3 className="text-white font-semibold text-sm mb-5">Deja tu comentario</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] text-white/35 uppercase tracking-widest mb-1.5">
              Tu nombre *
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Juan Pérez"
              maxLength={80}
              required
              className="w-full px-4 py-2.5 bg-[#2c2b2b] border border-white/[0.09] rounded-xl text-white text-sm placeholder:text-white/20 outline-none focus:border-[#f26822]/40 transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] text-white/35 uppercase tracking-widest mb-1.5">
              Comentario *
            </label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="¿Qué piensas sobre este artículo?"
              rows={4}
              maxLength={1000}
              required
              className="w-full px-4 py-2.5 bg-[#2c2b2b] border border-white/[0.09] rounded-xl text-white text-sm placeholder:text-white/20 outline-none focus:border-[#f26822]/40 transition-colors resize-none"
            />
            <p className="text-white/15 text-xs text-right mt-1">{text.length}/1000</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <AlertCircle size={14} className="flex-shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
              ✓ Comentario publicado
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !name.trim() || !text.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#f26822] hover:bg-[#f26822]/90 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all"
          >
            <Send size={14} />
            {submitting ? 'Publicando…' : 'Publicar comentario'}
          </button>
        </form>
      </div>
      {/* ── Confirm delete dialog ─────────────────────────── */}
      <AnimatePresence>
        {confirm.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setConfirm({ open: false, commentId: null, authorName: '' })}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.18 }}
              className="bg-[#1a1b1c] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-11 h-11 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center mb-4">
                <Trash2 size={18} className="text-red-400" />
              </div>
              <h3 className="text-white font-bold text-base mb-1">¿Eliminar comentario?</h3>
              <p className="text-white/40 text-sm mb-6">
                El comentario de <span className="text-white/70 font-medium">{confirm.authorName}</span> será eliminado permanentemente.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirm({ open: false, commentId: null, authorName: '' })}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/25 text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 text-sm font-semibold transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default CommentSection
