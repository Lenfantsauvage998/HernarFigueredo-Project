import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { XCircle, RotateCcw, ArrowRight, AlertCircle, Copy, Check } from 'lucide-react'

const CopyButton: React.FC<{ value: string }> = ({ value }) => {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="ml-2 p-1 rounded hover:bg-white/10 text-white/30 hover:text-[#c4501a] transition-colors flex-shrink-0"
    >
      {copied ? <Check size={13} className="text-[#c4501a]" /> : <Copy size={13} />}
    </button>
  )
}

const DECLINE_REASONS: Record<string, string> = {
  INSUFFICIENT_FUNDS: 'Fondos insuficientes en la cuenta.',
  CARD_DECLINED: 'La tarjeta fue rechazada por el banco.',
  INVALID_CARD: 'Los datos de la tarjeta son incorrectos.',
  TRANSACTION_DECLINED: 'La transacción fue rechazada por el emisor.',
  CONTACT_ISSUER: 'Contacta a tu banco para autorizar el pago.',
  EXPIRED_CARD: 'La tarjeta está vencida.',
}

const CheckoutFailed: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [])

  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('order')
  const transactionId = searchParams.get('id')
  const reasonCode = searchParams.get('reason')?.toUpperCase() ?? ''
  const friendlyReason = DECLINE_REASONS[reasonCode] ?? 'El pago no pudo ser procesado. Por favor intenta de nuevo.'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#2c2b2b] px-4 pt-24 pb-16">
      <div className="bg-[#1a1b1c] border border-white/10 rounded-3xl shadow-lg p-10 text-center max-w-md w-full">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle size={40} className="text-red-400" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Pago rechazado</h1>
        <p className="text-white/40 text-sm mb-6">Tu orden no fue completada y no se realizó ningún cobro.</p>

        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 mb-6 text-left">
          <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm">{friendlyReason}</p>
        </div>

        {(orderId || transactionId) && (
          <div className="bg-white/5 rounded-2xl px-5 py-4 mb-6 text-left space-y-3">
            {transactionId && (
              <div>
                <p className="text-xs text-white/30 uppercase tracking-wider mb-1">ID de transacción</p>
                <div className="flex items-center justify-between">
                  <p className="font-mono text-sm font-semibold text-white break-all">{transactionId}</p>
                  <CopyButton value={transactionId} />
                </div>
              </div>
            )}
            {orderId && (
              <div className={transactionId ? 'border-t border-white/10 pt-3' : ''}>
                <p className="text-xs text-white/30 uppercase tracking-wider mb-1">ID de orden</p>
                <div className="flex items-center justify-between">
                  <p className="font-mono text-sm font-semibold text-white">#{orderId.slice(0, 8).toUpperCase()}</p>
                  <CopyButton value={orderId} />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-left mb-8">
          <p className="text-xs font-semibold text-white/20 uppercase tracking-wider mb-3">¿Qué puedo hacer?</p>
          <ul className="space-y-2">
            {[
              'Verifica que los datos de pago sean correctos',
              'Intenta con otro método de pago (PSE, tarjeta)',
              'Contacta a tu banco si el problema persiste',
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2 text-sm text-white/50">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c4501a] flex-shrink-0 mt-1.5" />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            to="/checkout"
            className="flex items-center justify-center gap-2 bg-[#c4501a] hover:bg-[#d45c1a] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <RotateCcw size={16} />
            Intentar de nuevo
          </Link>
          <Link
            to="/libros"
            className="flex items-center justify-center gap-2 text-white/40 hover:text-white text-sm font-medium transition-colors"
          >
            Volver a libros <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CheckoutFailed
