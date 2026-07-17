import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import { useAuthStore } from './store/authStore'
import { useCurrencyStore } from './store/currencyStore'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Landing from './pages/Landing'
import Books from './pages/Books'
import Checkout from './pages/Checkout'
import CheckoutSuccess from './pages/CheckoutSuccess'
import CheckoutFailed from './pages/CheckoutFailed'
import AuthPage from './pages/auth/AuthPage'
import UserDashboard from './pages/dashboard/UserDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import ResetPassword from './pages/ResetPassword'
import Articles from './pages/Articles'
import ArticleDetail from './pages/ArticleDetail'
import NotFound from './pages/NotFound'
import Spinner from './components/ui/Spinner'
import WhatsAppButton from './components/ui/WhatsAppButton'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 1000 * 60 * 5 } },
})

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore()
  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#2c2b2b]">
      <Spinner size="lg" color="accent" />
    </div>
  )
  if (!isAuthenticated) return <Navigate to="/auth" replace />
  return <>{children}</>
}

// Redirects admins from user dashboard → admin panel
const AdminRedirect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAuthStore()
  if (isAdmin()) return <Navigate to="/admin" replace />
  return <>{children}</>
}

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, isAdmin } = useAuthStore()
  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#2c2b2b]">
      <Spinner size="lg" color="accent" />
    </div>
  )
  if (!isAuthenticated) return <Navigate to="/auth" replace />
  if (!isAdmin()) return <Navigate to="/" replace />
  return <>{children}</>
}

function App() {
  const { ensureRates, autoDetect } = useCurrencyStore()

  useEffect(() => {
    ensureRates()
    autoDetect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-[#2c2b2b]">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Articles />} />
                <Route path="/articulos" element={<Navigate to="/" replace />} />
                <Route path="/inicio" element={<Landing />} />
                <Route path="/libros" element={<Books />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/checkout/success" element={<CheckoutSuccess />} />
                <Route path="/checkout/failed" element={<CheckoutFailed />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <AdminRedirect><UserDashboard /></AdminRedirect>
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/articulos/:slug" element={<ArticleDetail />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <WhatsAppButton />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
