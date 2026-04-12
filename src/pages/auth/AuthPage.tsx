import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { Eye, EyeOff, LogIn, UserPlus, AlertCircle, Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { loginUser, registerUser } from '../../services/auth'
import { useAuthStore } from '../../store/authStore'
import { supabase } from '../../lib/supabase'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

type Tab = 'login' | 'register'

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('login')
  const [showForgot, setShowForgot] = useState(false)
  const { isAuthenticated, user } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [])

  if (isAuthenticated && user) {
    return <Navigate to="/dashboard" replace />
  }

  if (showForgot) {
    return <ForgotPasswordView onBack={() => setShowForgot(false)} />
  }

  return (
    <div className="min-h-screen pt-24 md:pt-36 flex items-center justify-center bg-[#2c2b2b] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="font-bold tracking-widest uppercase text-sm text-white mb-1">
            Hernan Figueredo
          </p>
          <p className="text-white/40 text-sm">Accede a tu cuenta o crea una nueva</p>
        </div>

        <div className="bg-[#1a1b1c] border border-white/10 rounded-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-white/10">
            {(['login', 'register'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${
                  activeTab === tab ? 'text-[#f26822]' : 'text-white/40 hover:text-white'
                }`}
              >
                {tab === 'login' ? 'Ingresar' : 'Crear cuenta'}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f26822]" />
                )}
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === 'login' ? (
              <LoginForm
                onSuccess={() => navigate('/dashboard')}
                onForgotPassword={() => setShowForgot(true)}
              />
            ) : (
              <RegisterForm onSuccess={() => navigate('/dashboard')} />
            )}
          </div>
        </div>

        <p className="text-center text-xs text-white/20 mt-6">
          Al ingresar, aceptas nuestros{' '}
          <a href="#" className="text-[#f26822] hover:underline">Términos de uso</a>
          {' '}y{' '}
          <a href="#" className="text-[#f26822] hover:underline">Política de privacidad</a>
        </p>
      </div>
    </div>
  )
}

// ── Forgot Password View ──────────────────────────────────────
interface ForgotPasswordViewProps { onBack: () => void }

const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({ onBack }) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setLoading(false)
    if (err) {
      setError(err.message.includes('rate') ? 'Demasiados intentos. Espera un momento.' : err.message)
      return
    }
    setSent(true)
  }

  return (
    <div className="min-h-screen pt-24 md:pt-36 flex items-center justify-center bg-[#2c2b2b] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="font-bold tracking-widest uppercase text-sm text-white mb-1">
            Hernan Figueredo
          </p>
          <p className="text-white/40 text-sm">Recupera el acceso a tu cuenta</p>
        </div>

        <div className="bg-[#1a1b1c] border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-8">
            {sent ? (
              <div className="text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto">
                  <CheckCircle size={24} className="text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg mb-2">¡Revisa tu email!</h2>
                  <p className="text-white/40 text-sm leading-relaxed">
                    Enviamos un enlace de recuperación a <span className="text-white/70">{email}</span>.
                    Revisa también tu carpeta de spam.
                  </p>
                </div>
                <button onClick={onBack}
                  className="flex items-center justify-center gap-2 text-[#f26822] hover:text-white text-sm font-medium transition-colors mx-auto">
                  <ArrowLeft size={14} />
                  Volver al inicio de sesión
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="text-center mb-2">
                  <div className="w-12 h-12 bg-[#f26822]/10 border border-[#f26822]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Mail size={20} className="text-[#f26822]" />
                  </div>
                  <h2 className="text-white font-bold text-lg mb-1">¿Olvidaste tu contraseña?</h2>
                  <p className="text-white/40 text-sm">
                    Ingresa tu email y te enviaremos un enlace para restablecerla.
                  </p>
                </div>

                <Input
                  label="Correo electrónico"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  autoComplete="email"
                  required
                />

                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                    <AlertCircle size={15} className="flex-shrink-0" />
                    {error}
                  </div>
                )}

                <Button type="submit" loading={loading} className="w-full" size="lg">
                  <Mail size={16} />
                  Enviar enlace de recuperación
                </Button>

                <button type="button" onClick={onBack}
                  className="flex items-center justify-center gap-2 text-white/40 hover:text-white text-sm transition-colors w-full">
                  <ArrowLeft size={14} />
                  Volver al inicio de sesión
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Login Form ────────────────────────────────────────────────
interface LoginFormProps {
  onSuccess: () => void
  onForgotPassword: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onForgotPassword }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isCoolingDown, setIsCoolingDown] = useState(false)
  const cooldownRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (cooldownRef.current) clearTimeout(cooldownRef.current) }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isCoolingDown) return
    setError('')
    setLoading(true)
    try {
      await loginUser(email.trim(), password)
      let waited = 0
      const poll = setInterval(() => {
        const { user: u, isAuthenticated } = useAuthStore.getState()
        waited += 100
        if (isAuthenticated && u) {
          clearInterval(poll)
          setLoading(false)
          onSuccess()
        } else if (waited >= 3000) {
          clearInterval(poll)
          setLoading(false)
          setError('No se pudo cargar tu perfil. Intenta de nuevo.')
        }
      }, 100)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al ingresar'
      setError(msg.includes('Invalid') ? 'Email o contraseña incorrectos' : msg)
      setLoading(false)
    } finally {
      setIsCoolingDown(true)
      cooldownRef.current = setTimeout(() => setIsCoolingDown(false), 5000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input label="Correo electrónico" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@email.com" autoComplete="email" required />
      <div>
        <div className="relative">
          <Input label="Contraseña" type={showPw ? 'text' : 'password'} value={password}
            onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
            autoComplete="current-password" required />
          <button type="button" onClick={() => setShowPw(!showPw)}
            className="absolute right-3 bottom-2.5 text-white/30 hover:text-white/60 transition-colors">
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <div className="flex justify-end mt-1.5">
          <button type="button" onClick={onForgotPassword}
            className="text-xs text-white/35 hover:text-[#f26822] transition-colors">
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      </div>
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          <AlertCircle size={15} className="flex-shrink-0" />
          {error}
        </div>
      )}
      <Button type="submit" loading={loading} disabled={isCoolingDown} className="w-full" size="lg">
        <LogIn size={16} />
        {isCoolingDown ? 'Por favor espera…' : 'Ingresar'}
      </Button>
    </form>
  )
}

// ── Register Form ─────────────────────────────────────────────
interface RegisterFormProps { onSuccess: () => void }

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isCoolingDown, setIsCoolingDown] = useState(false)
  const cooldownRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (cooldownRef.current) clearTimeout(cooldownRef.current) }, [])

  const validate = () => {
    if (name.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Por favor ingresa un email válido'
    if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres'
    if (!/[A-Z]/.test(password)) return 'La contraseña debe contener al menos una mayúscula'
    if (!/[0-9]/.test(password)) return 'La contraseña debe contener al menos un número'
    if (password !== confirm) return 'Las contraseñas no coinciden'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) { setError(validationError); return }
    setError('')
    setLoading(true)
    try {
      await registerUser(email.trim(), password, name.trim())
      setTimeout(onSuccess, 500)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al registrarse'
      setError(msg.includes('already') ? 'Ya existe una cuenta con este email' : msg)
    } finally {
      setLoading(false)
      setIsCoolingDown(true)
      cooldownRef.current = setTimeout(() => setIsCoolingDown(false), 5000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Nombre completo" type="text" value={name} onChange={(e) => setName(e.target.value)}
        placeholder="Juan Pérez" autoComplete="name" required />
      <Input label="Correo electrónico" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@email.com" autoComplete="email" required />
      <div className="relative">
        <Input label="Contraseña" type={showPw ? 'text' : 'password'} value={password}
          onChange={(e) => setPassword(e.target.value)} placeholder="Mín. 8 caracteres, 1 mayúscula, 1 número"
          helperText="Al menos 8 caracteres, una mayúscula y un número" autoComplete="new-password" required />
        <button type="button" onClick={() => setShowPw(!showPw)}
          className="absolute right-3 bottom-2.5 text-white/30 hover:text-white/60 transition-colors">
          {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      <Input label="Confirmar contraseña" type={showPw ? 'text' : 'password'} value={confirm}
        onChange={(e) => setConfirm(e.target.value)} placeholder="Repite tu contraseña"
        autoComplete="new-password" required />
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          <AlertCircle size={15} className="flex-shrink-0" />
          {error}
        </div>
      )}
      <Button type="submit" loading={loading} disabled={isCoolingDown} className="w-full" size="lg">
        <UserPlus size={16} />
        {isCoolingDown ? 'Por favor espera…' : 'Crear cuenta'}
      </Button>
    </form>
  )
}

export default AuthPage
