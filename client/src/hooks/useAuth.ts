import { useEffect } from 'react'
import { create } from 'zustand'
import { authService } from '../services/authService'
import type { Profile } from '../types/models'

interface AuthState {
  user: Profile | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  initialized: boolean
  
  // Actions
  initialize: () => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
  initialized: false,

  initialize: async () => {
    try {
      console.log('🔐 Initializing auth...')
      set({ isLoading: true, error: null })
      const profile = await authService.getCurrentUser()
      
      if (profile) {
        console.log('✅ User authenticated:', profile.email)
        set({ user: profile, isAuthenticated: true, isLoading: false, initialized: true })
      } else {
        console.log('ℹ️ No user session found')
        set({ user: null, isAuthenticated: false, isLoading: false, initialized: true })
      }
    } catch (error) {
      console.error('❌ Failed to initialize auth:', error)
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        initialized: true,
        error: error instanceof Error ? error.message : 'Failed to initialize'
      })
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null })
      const profile = await authService.signIn(email, password)
      set({ user: profile, isAuthenticated: true, isLoading: false })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sign in'
      set({ isLoading: false, error: message })
      throw error
    }
  },

  signUp: async (email: string, password: string, name: string) => {
    try {
      set({ isLoading: true, error: null })
      const profile = await authService.signUp(email, password, name)
      set({ user: profile, isAuthenticated: true, isLoading: false })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sign up'
      set({ isLoading: false, error: message })
      throw error
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true, error: null })
      await authService.signOut()
      set({ user: null, isAuthenticated: false, isLoading: false })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sign out'
      set({ isLoading: false, error: message })
      throw error
    }
  },

  clearError: () => set({ error: null }),
}))

/**
 * Hook to use auth state and actions
 * Automatically initializes auth on mount
 */
export function useAuth() {
  const store = useAuthStore()
  const initialized = useAuthStore(state => state.initialized)

  useEffect(() => {
    // Only initialize once
    if (!initialized) {
      console.log('🚀 Starting auth initialization')
      store.initialize()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized])

  useEffect(() => {
    // Listen for auth state changes (separate effect)
    console.log('👂 Setting up auth listener')
    const { data } = authService.onAuthStateChange(async (event, session) => {
      console.log('🔔 Auth state changed:', event)
      if (event === 'SIGNED_OUT') {
        // Don't call store.signOut() as it would trigger another auth state change
        // Just update the state directly
        useAuthStore.setState({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false 
        })
      } else if (event === 'SIGNED_IN' && session) {
        // Re-initialize to get fresh user data
        store.initialize()
      }
    })

    return () => {
      console.log('🧹 Cleaning up auth listener')
      data.subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return store
}