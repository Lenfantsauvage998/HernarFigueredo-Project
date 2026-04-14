import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, Menu, X, ChevronDown, User, LogOut, LayoutDashboard, Shield } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import { logoutUser } from '../../services/auth'
import CartSidebar from '../cart/CartSidebar'

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { user, isAuthenticated, clearAuth, isAdmin } = useAuthStore()
  const { getItemCount, toggleCart } = useCartStore()
  const navigate = useNavigate()
  const location = useLocation()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const itemCount = getItemCount()

  const isLanding = location.pathname === '/inicio'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = async () => {
    await logoutUser()
    clearAuth()
    setDropdownOpen(false)
    navigate('/')
  }

  // Always include border-b so it doesn't flash; only change color/bg
  const navBg = isLanding && !scrolled
    ? 'bg-transparent border-b border-transparent'
    : 'bg-[#1f1d1d]/92 backdrop-blur-md border-b border-white/[0.07]'

  const navLinks = [
    { to: '/',        label: 'Artículos' },
    { to: '/libros',  label: 'Libros' },
    { to: '/inicio',  label: 'Inicio' },
  ]

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${navBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Wordmark */}
            <Link
              to="/"
              className="flex items-center gap-3 group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#c4501a] flex items-center justify-center flex-shrink-0 group-hover:bg-[#b8461a] transition-colors">
                <span className="text-white font-bold text-base leading-none" style={{ fontFamily: 'Georgia, serif' }}>H</span>
              </div>
              <span className="text-white font-bold tracking-widest uppercase text-sm md:text-base group-hover:text-[#c4501a] transition-colors">
                Hernan Figueredo
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium transition-colors hover:text-[#c4501a] ${
                    location.pathname === link.to ? 'text-[#c4501a]' : 'text-white/80'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
                aria-label="Carrito de compras"
              >
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#c4501a] text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>

              {/* Auth — desktop */}
              {isAuthenticated && user ? (
                <div className="relative hidden md:block" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-white"
                  >
                    <div className="w-7 h-7 bg-[#c4501a] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium max-w-[100px] truncate">{user.name}</span>
                    <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-[#1f1d1d] rounded-xl shadow-2xl border border-white/10 py-2 z-50">
                      <div className="px-4 py-2 border-b border-white/10 mb-1">
                        <p className="text-xs text-white/40">Conectado como</p>
                        <p className="text-sm font-medium text-white truncate">{user.email}</p>
                      </div>
                      {isAdmin() && (
                        <Link
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-[#c4501a] hover:bg-[#c4501a]/10 transition-colors"
                        >
                          <Shield size={15} className="text-[#c4501a]" />
                          Panel admin
                        </Link>
                      )}
                      {!isAdmin() && (
                        <Link
                          to="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                        >
                          <LayoutDashboard size={15} className="text-[#c4501a]" />
                          Mis órdenes
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut size={15} />
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="hidden md:flex items-center gap-2 border border-white/20 hover:border-[#c4501a] hover:text-[#c4501a] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  <User size={15} />
                  Ingresar
                </Link>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-[#1f1d1d] border-t border-white/10">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-white/10" />
              {isAuthenticated && user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 rounded-lg text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
                  >
                    Mis órdenes
                  </Link>
                  <button
                    onClick={() => { void handleLogout(); setMobileOpen(false) }}
                    className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-semibold text-white bg-[#c4501a] text-center"
                >
                  Ingresar
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      <CartSidebar />
    </>
  )
}

export default Navbar
