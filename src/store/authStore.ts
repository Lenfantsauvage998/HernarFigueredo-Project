import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Role } from '../types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  clearAuth: () => void
  isAdmin: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),
      clearAuth: () => set({ user: null, isAuthenticated: false, isLoading: false }),
      isAdmin: () => (get().user?.role as Role) === 'admin',
    }),
    {
      name: 'hernan-auth-storage',
      partialize: (state) => ({
        user: state.user ?? null,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
