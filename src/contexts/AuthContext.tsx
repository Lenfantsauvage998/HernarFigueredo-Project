import React, { createContext, useContext, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import type { User } from '../types'

const AuthContext = createContext<null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setUser, clearAuth, setLoading } = useAuthStore()

  useEffect(() => {
    setLoading(true)

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const { id, email } = session.user
        setTimeout(() => { loadUserProfile(id, email!) }, 0)
      } else {
        clearAuth()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (userId: string, email: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, name, role, created_at')
        .eq('id', userId)
        .single()

      if (error) throw error

      const user: User = {
        id: profile.id,
        name: profile.name,
        role: profile.role,
        email,
        created_at: profile.created_at,
      }
      setUser(user)
    } catch (err) {
      console.error('Failed to load user profile:', err)
      clearAuth()
    }
  }

  return <AuthContext.Provider value={null}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => useContext(AuthContext)
