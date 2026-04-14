import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, ArrowLeft, AlertCircle } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { createOrderViaEdgeFunction, createOrderDirect, patchOrderPhone } from '../services/orders'
import { initiatePayment } from '../services/payments'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

interface EPaycoOpenParams {
  name: string
  description: string
  invoice: string
  currency: string
  amount: string
  tax_base: string
  tax: string
  country: string
  lang: string
  external: string
  response: string
  confirmation: string
  email_billing?: string
  name_billing?: string
  type_doc_billing?: string
  number_doc_billing?: string
  mobilephone_billing?: string
}
interface EPaycoSDK {
  checkout: {
    configure: (opts: { key: string; test?: boolean }) => {
      open: (params: EPaycoOpenParams) => void
    }
  }
}

const Checkout: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [])

  useEffect(() => {
    if (document.getElementById('epayco-script')) return
    const script = document.createElement('script')
    script.id = 'epayco-script'
    script.src = 'https://checkout.epayco.co/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      const el = document.getElementById('epayco-script')
      if (el) document.body.removeChild(el)
    }
  }, [])

  const { items, getTotal, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigatingAway = useRef(false)

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: '',
    idType: 'CC',
    idNumber: '',
  })

  if (items.length === 0 && !navigatingAway.current) {
    navigate('/libros')
    return null
  }

  const total = getTotal()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const phoneClean = form.phone.replace(/[\s\-\(\)]/g, '')
    if (!/^[0-9]{10}$/.test(phoneClean)) {
      setError('El teléfono debe tener exactamente 10 dígitos (ej: 3001234567)')
      return
    }

    const idClean = form.idNumber.trim()
    if (!idClean) {
      setError('El número de identificación es obligatorio')
      return
    }
    if (form.idType === 'PP') {
      if (!/^[A-Za-z0-9]{5,20}$/.test(idClean)) {
        setError('El pasaporte debe tener entre 5 y 20 caracteres alfanuméricos')
        return
      }
    } else {
      if (!/^[0-9]{5,15}$/.test(idClean)) {
        setError('El número de identificación debe contener solo dígitos (5–15 dígitos)')
        return
      }
    }

    setLoading(true)
    try {
      let orderId: string
      try {
        const result = await createOrderViaEdgeFunction(
          items.map((i) => ({ serviceId: i.service.id, quantity: i.quantity }))
        )
        orderId = result.orderId
        if (form.phone) await patchOrderPhone(orderId, form.phone)
      } catch {
        const result = await createOrderDirect(
          items.map((i) => ({ serviceId: i.service.id, quantity: i.quantity })),
          form.phone
        )
        orderId = result.orderId
      }

      const { amount } = await initiatePayment({
        orderId,
        customerEmail: user?.email,
        customerName: form.name,
        customerPhone: form.phone,
        customerIdType: form.idType,
        customerIdNumber: form.idNumber,
      })

      const ePayco = (window as unknown as { ePayco: EPaycoSDK }).ePayco
      if (!ePayco) {
        throw new Error('El SDK de pagos aún se está cargando. Por favor intenta en un momento.')
      }

      const handler = ePayco.checkout.configure({
        key: import.meta.env.VITE_EPAYCO_PUBLIC_KEY as string,
        test: import.meta.env.VITE_EPAYCO_TEST_MODE !== 'false',
      })

      navigatingAway.current = true
      clearCart()

      handler.open({
        name: 'Hernan Figueredo — Libros',
        description: `Orden #${orderId.slice(0, 8).toUpperCase()}`,
        invoice: orderId,
        currency: 'cop',
        amount: String(amount),
        tax_base: '0',
        tax: '0',
        country: 'co',
        lang: 'es',
        external: 'false',
        response: `${window.location.origin}/checkout/success?order=${orderId}`,
        confirmation: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/epayco-webhook`,
        email_billing: user?.email,
        name_billing: form.name,
        type_doc_billing: form.idType.toLowerCase(),
        number_doc_billing: form.idNumber,
        mobilephone_billing: form.phone,
      })

    } catch (err: unknown) {
      navigatingAway.current = false
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      const isFetchError = msg === 'Failed to fetch' || msg.toLowerCase().includes('fetch')
      setError(
        isFetchError
          ? 'No se pudo conectar con el servicio de pagos. Verifica tu conexión e intenta nuevamente.'
          : msg
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#2c2b2b] pt-24 md:pt-36 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/libros')}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 text-sm"
        >
          <ArrowLeft size={16} />
          Volver a libros
        </button>

        <h1 className="text-3xl font-bold text-white mb-6">Finalizar compra</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left: Customer info */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-[#1a1b1c] rounded-2xl p-6 border border-white/10">
                <h2 className="font-semibold text-white mb-4">Información de contacto</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Nombre completo"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Número telefónico"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="3001234567"
                    required
                  />
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-white/80">Tipo de identificación</label>
                    <select
                      value={form.idType}
                      onChange={(e) => setForm({ ...form, idType: e.target.value })}
                      className="px-4 py-2.5 rounded-xl border border-white/10 bg-[#1a1b1c] text-white text-sm focus:border-[#c4501a]/50 outline-none"
                    >
                      <option value="CC">Cédula de Ciudadanía (CC)</option>
                      <option value="NIT">NIT</option>
                      <option value="CE">Cédula de Extranjería (CE)</option>
                      <option value="PP">Pasaporte (PP)</option>
                    </select>
                  </div>
                  <Input
                    label="Número de identificación"
                    value={form.idNumber}
                    onChange={(e) => setForm({ ...form, idNumber: e.target.value })}
                    placeholder="1234567890"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  {error}
                </div>
              )}

              <p className="text-xs text-white/30">
                Al hacer clic en "Pagar ahora" se abrirá la pasarela segura de ePayco donde podrás elegir
                tu método de pago: PSE, tarjeta de crédito/débito, Efecty y más.
              </p>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-[#1a1b1c] rounded-2xl p-6 border border-white/10 sticky top-24">
                <div className="flex items-center gap-2 mb-5">
                  <BookOpen size={18} className="text-[#c4501a]" />
                  <h2 className="font-semibold text-white">Resumen del pedido</h2>
                </div>

                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.service.id} className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-[#c4501a]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen size={16} className="text-[#c4501a]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white line-clamp-1">{item.service.title}</p>
                        <p className="text-xs text-white/40">Libro × {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold text-white flex-shrink-0">
                        ${(item.service.price * item.quantity).toLocaleString('es-CO')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4 space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Subtotal</span>
                    <span className="text-white font-medium">${total.toLocaleString('es-CO')} COP</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-[#c4501a] text-lg">${total.toLocaleString('es-CO')} COP</span>
                  </div>
                </div>

                <Button type="submit" loading={loading} className="w-full" size="lg">
                  Pagar ahora
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Checkout
