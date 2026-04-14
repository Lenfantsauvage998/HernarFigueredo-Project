import React from 'react'
import { Link } from 'react-router-dom'

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#2c2b2b] flex flex-col items-center justify-center px-4 pt-20">
      <p className="text-[#c4501a] text-8xl font-bold mb-4">404</p>
      <h1 className="text-2xl font-bold text-white mb-2">Página no encontrada</h1>
      <p className="text-white/40 text-sm mb-8">Esta página no existe o fue movida.</p>
      <Link
        to="/"
        className="bg-[#c4501a] hover:bg-[#d45c1a] text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
      >
        Volver al inicio
      </Link>
    </div>
  )
}

export default NotFound
