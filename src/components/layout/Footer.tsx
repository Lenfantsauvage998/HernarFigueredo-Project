import React from 'react'
import { Link } from 'react-router-dom'

const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
  </svg>
)

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
  </svg>
)

const YoutubeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/>
  </svg>
)

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0f0e0e] text-white">
      {/* Orange top accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#f26822]/35 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div className="md:col-span-2">
            <p className="font-bold tracking-widest uppercase text-sm mb-1 text-white">
              Hernan Figueredo
            </p>
            <div className="h-px w-12 bg-[#f26822]/50 mb-4" />
            <p className="text-white/38 text-sm leading-relaxed max-w-xs mb-7">
              Escritor, pensador y guía de crecimiento personal.
              Ayudando a personas a construir una vida con propósito.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2.5">
              {[
                { Icon: InstagramIcon, label: 'Instagram', href: '#' },
                { Icon: XIcon, label: 'Twitter / X', href: '#' },
                { Icon: YoutubeIcon, label: 'YouTube', href: '#' },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 bg-white/[0.05] hover:bg-[#f26822]/18 border border-white/[0.09] hover:border-[#f26822]/30 rounded-lg flex items-center justify-center text-white/40 hover:text-[#f26822] transition-all duration-200"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/22 mb-5">
              Navegación
            </p>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Inicio' },
                { to: '/libros', label: 'Libros' },
                { to: '/auth', label: 'Mi cuenta' },
                { to: '/dashboard', label: 'Mis órdenes' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/40 hover:text-white transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Books */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/22 mb-5">
              Libros
            </p>
            <ul className="space-y-3">
              {[
                'El Arte de Construir tu Destino',
                'Liderazgo desde Adentro',
                'La Mente del Emprendedor',
                'Conexión Humana',
                'Disciplina Radical',
              ].map((title) => (
                <li key={title}>
                  <Link
                    to="/libros"
                    className="text-sm text-white/40 hover:text-white transition-colors duration-150 leading-snug block"
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/18">
            © {new Date().getFullYear()} Hernan Figueredo. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-xs text-white/18 hover:text-white/50 transition-colors"
            >
              Política de privacidad
            </a>
            <a
              href="#"
              className="text-xs text-white/18 hover:text-white/50 transition-colors"
            >
              Términos de uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
