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

  const loadUserProfile = async (userId: string, email: string, attempt = 1) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, name, role, created_at')
        .eq('id', userId)
        .single()

      // Profile row may not exist yet if the trigger hasn't fired (new signup race).
      // Retry up to 5 times with 400 ms delay before giving up.
      if (error) {
        if (attempt < 5) {
          setTimeout(() => loadUserProfile(userId, email, attempt + 1), 400)
          return
        }
        // Fallback: use metadata name, treat as regular user so they aren't locked out
        const meta = (await supabase.auth.getUser()).data.user?.user_metadata
        const user: User = {
          id: userId,
          name: meta?.name ?? meta?.full_name ?? email.split('@')[0],
          role: 'user',
          email,
          created_at: new Date().toISOString(),
        }
        setUser(user)
        return
      }

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
      if (attempt < 5) {
        setTimeout(() => loadUserProfile(userId, email, attempt + 1), 400)
      } else {
        clearAuth()
      }
    }
  }

  return <AuthContext.Provider value={null}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => useContext(AuthContext)
