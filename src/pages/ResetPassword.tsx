import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle, Mail } from 'lucide-react'
import { supabase } from '../lib/supabase'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

type State = 'checking' | 'ready' | 'invalid' | 'success'

const ResetPassword: React.FC = () => {
  const [state, setState]     = useState<State>('checking')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [formError, setFormError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })

    let settled = false
    const resolve = () => { if (!settled) { settled = true; setState('ready') } }
    const reject  = () => { if (!settled) { settled = true; setState('invalid') } }

    // 1. Subscribe first — catches event if Supabase hasn't processed the URL yet
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') resolve()
    })

    const init = async () => {
      // 2. PKCE flow — code is in the query string (?code=xxx)
      const code = new URLSearchParams(window.location.search).get('code')
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) { reject(); return }
        // Clean URL so refresh doesn't re-exchange
        window.history.replaceState({}, '', window.location.pathname)
        resolve()
        return
      }

      // 3. Implicit/hash flow — token_type=recovery in hash (older projects)
      const hash = new URLSearchParams(window.location.hash.substring(1))
      if (hash.get('type') === 'recovery') { resolve(); return }

      // 4. Already has a session (page reloaded after code exchange)
      const { data: { session } } = await supabase.auth.getSession()
      if (session) { resolve(); return }

      // 5. Nothing found — give the onAuthStateChange listener 2 more seconds
      setTimeout(() => { if (!settled) reject() }, 2000)
    }

    init()

    return () => subscription.unsubscribe()
  }, [])

  const validate = () => {
    if (password.length < 8)       return 'La contraseña debe tener al menos 8 caracteres'
    if (!/[A-Z]/.test(password))   return 'Debe contener al menos una mayúscula'
    if (!/[0-9]/.test(password))   return 'Debe contener al menos un número'
    if (password !== confirm)       return 'Las contraseñas no coinciden'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = validate()
    if (err) { setFormError(err); return }
    setFormError('')
    setLoading(true)

    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) {
      setFormError(
        error.message.toLowerCase().includes('session') || error.message.toLowerCase().includes('token')
          ? 'El enlace expiró o ya fue usado. Solicita uno nuevo.'
          : error.message
      )
      return
    }

    setState('success')
    setTimeout(() => navigate('/dashboard'), 2500)
  }

  return (
    <div className="min-h-screen pt-24 md:pt-36 flex items-center justify-center bg-[#2c2b2b] px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <p className="font-bold tracking-widest uppercase text-sm text-white mb-1">Hernan Figueredo</p>
          <p className="text-white/40 text-sm">Restablece tu contraseña</p>
        </div>

        <div className="bg-[#1a1b1c] border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-8">

            {/* ── Checking ── */}
            {state === 'checking' && (
              <div className="text-center space-y-4 py-6">
                <div className="w-12 h-12 bg-[#f26822]/10 border border-[#f26822]/20 rounded-2xl flex items-center justify-center mx-auto">
                  <Lock size={20} className="text-[#f26822] animate-pulse" />
                </div>
                <h2 className="text-white font-bold text-lg">Verificando enlace…</h2>
                <p className="text-white/40 text-sm">Solo tomará un momento.</p>
              </div>
            )}

            {/* ── Invalid link ── */}
            {state === 'invalid' && (
              <div className="text-center space-y-4 py-6">
                <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto">
                  <AlertCircle size={20} className="text-red-400" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg mb-2">Enlace inválido o expirado</h2>
                  <p className="text-white/40 text-sm leading-relaxed">
                    Este enlace ya fue usado o expiró.<br />Solicita uno nuevo desde el inicio de sesión.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/auth')}
                  className="flex items-center justify-center gap-2 text-[#f26822] hover:text-white text-sm font-medium transition-colors mx-auto mt-2"
                >
                  <Mail size={14} />
                  Solicitar nuevo enlace
                </button>
              </div>
            )}

            {/* ── Success ── */}
            {state === 'success' && (
              <div className="text-center space-y-4 py-6">
                <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto">
                  <CheckCircle size={24} className="text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg mb-2">¡Contraseña actualizada!</h2>
                  <p className="text-white/40 text-sm">Redirigiendo a tu cuenta…</p>
                </div>
                <div className="flex justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f26822] animate-ping" />
                </div>
              </div>
            )}

            {/* ── Reset form ── */}
            {state === 'ready' && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="text-center mb-2">
                  <div className="w-12 h-12 bg-[#f26822]/10 border border-[#f26822]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Lock size={20} className="text-[#f26822]" />
                  </div>
                  <h2 className="text-white font-bold text-lg mb-1">Nueva contraseña</h2>
                  <p className="text-white/40 text-sm">Elige una contraseña segura.</p>
                </div>

                <div className="relative">
                  <Input
                    label="Nueva contraseña"
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mín. 8 caracteres, 1 mayúscula, 1 número"
                    autoComplete="new-password"
                    required
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 bottom-2.5 text-white/30 hover:text-white/60 transition-colors">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <Input
                  label="Confirmar contraseña"
                  type={showPw ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repite tu contraseña"
                  autoComplete="new-password"
                  required
                />

                {/* Strength checklist */}
                {password.length > 0 && (
                  <div className="space-y-1.5">
                    {[
                      { ok: password.length >= 8,                            label: 'Al menos 8 caracteres' },
                      { ok: /[A-Z]/.test(password),                          label: 'Una mayúscula' },
                      { ok: /[0-9]/.test(password),                          label: 'Un número' },
                      { ok: password === confirm && confirm.length > 0,      label: 'Contraseñas coinciden' },
                    ].map(({ ok, label }) => (
                      <div key={label} className={`flex items-center gap-2 text-xs ${ok ? 'text-emerald-400' : 'text-white/30'}`}>
                        <div className={`w-1 h-1 rounded-full flex-shrink-0 ${ok ? 'bg-emerald-400' : 'bg-white/20'}`} />
                        {label}
                      </div>
                    ))}
                  </div>
                )}

                {formError && (
                  <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                    <AlertCircle size={15} className="flex-shrink-0" />
                    {formError}
                  </div>
                )}

                <Button type="submit" loading={loading} className="w-full" size="lg">
                  <Lock size={16} />
                  Guardar nueva contraseña
                </Button>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
