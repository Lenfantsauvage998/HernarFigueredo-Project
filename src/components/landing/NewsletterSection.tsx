import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowRight, CheckCircle } from 'lucide-react'

const SUBSCRIBE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/subscribe-newsletter`
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(SUBSCRIBE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: ANON_KEY },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error ?? 'Algo salió mal. Intenta de nuevo.')
        return
      }
      setSubmitted(true)
      setEmail('')
    } catch {
      setError('No se pudo conectar. Revisa tu conexión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-[#2c2b2b] py-28 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[350px] bg-[#f26822] opacity-[0.04] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-3 mb-7">
            <div className="h-px w-8 bg-[#f26822]/60" />
            <span className="text-[#f26822] text-xs font-bold uppercase tracking-[0.3em]">Newsletter</span>
            <div className="h-px w-8 bg-[#f26822]/60" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Ideas que no encontrarás<br />en ningún otro lugar.
          </h2>
          <p className="text-white/40 text-base mb-10 max-w-lg mx-auto leading-relaxed">
            Reflexiones sobre mentalidad, disciplina y liderazgo — directamente
            en tu bandeja de entrada. Sin spam. Sin relleno.
          </p>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div key="success"
                initial={{ opacity: 0, scale: 0.92, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-6 py-4 rounded-xl text-sm font-medium"
              >
                <CheckCircle size={16} className="flex-shrink-0" />
                ¡Listo! Te llegará el próximo número.
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="tu@email.com" required
                  className="flex-1 px-5 py-3.5 bg-white/[0.05] border border-white/[0.1] rounded-xl text-white placeholder:text-white/22 text-sm outline-none focus:border-[#f26822]/45 focus:bg-white/[0.07] transition-all duration-200" />
                <button type="submit" disabled={loading}
                  className="flex items-center justify-center gap-2 bg-[#f26822] hover:bg-[#d45c1a] active:scale-95 text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 text-sm whitespace-nowrap shadow-lg shadow-[#f26822]/20 disabled:opacity-60 disabled:pointer-events-none">
                  {loading ? 'Guardando...' : <><span>Suscribirme</span><ArrowRight size={15} /></>}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
          <p className="text-white/18 text-xs mt-6 tracking-wide">Únete a +10,000 lectores en Latinoamérica</p>
        </motion.div>
      </div>
    </section>
  )
}

export default NewsletterSection
