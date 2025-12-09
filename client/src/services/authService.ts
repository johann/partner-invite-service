import { supabase } from '../utils/supabaseClient'
import type { Profile, ProfileInsert } from '../types/models'
import type { Session } from '@supabase/supabase-js'

export class AuthService {
  /**
   * Sign up a new user with email and password
   */
  async signUp(email: string, password: string, name: string): Promise<Profile> {
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })

    if (authError) throw authError
    if (!authData.user) throw new Error('User creation failed')

    // 2. Create profile (might already exist via database trigger)
    const profileData: ProfileInsert = {
      id: authData.user.id,
      name: name,
      email: email,
      streak_days: 0,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      is_verified: false,
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .upsert(profileData)
      .select()
      .single()

    if (profileError) throw profileError
    return profile
  }

  /**
   * Sign in existing user with email and password
   */
  async signIn(email: string, password: string): Promise<Profile> {
    // 1. Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) throw authError
    if (!authData.user) throw new Error('Sign in failed')

    // 2. Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (profileError) {
      // If profile doesn't exist, create it
      const newProfile: ProfileInsert = {
        id: authData.user.id,
        name: authData.user.email?.split('@')[0] || 'User',
        email: authData.user.email || '',
        streak_days: 0,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        is_verified: false,
      }

      const { data: createdProfile, error: createError } = await supabase
        .from('profiles')
        .insert(newProfile)
        .select()
        .single()

      if (createError) throw createError
      return createdProfile
    }

    return profile
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  /**
   * Get current authenticated user's profile
   */
  async getCurrentUser(): Promise<Profile | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

    return profile
  }

  /**
   * Get current auth session
   */
  async getSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

export const authService = new AuthService()