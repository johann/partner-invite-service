import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthService } from './authService'
import { supabase } from '../utils/supabaseClient'
import { createMockUser } from '../test/helpers'

// Mock the entire supabase module
vi.mock('../utils/supabaseClient', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      upsert: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
  },
}))

describe('AuthService', () => {
  let authService: AuthService

  beforeEach(() => {
    authService = new AuthService()
    vi.clearAllMocks()
  })

  describe('signUp', () => {
    it('creates user and profile successfully', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' }
      const mockProfile = createMockUser({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
      })

      ;(supabase.auth.signUp as any).mockResolvedValue({
        data: { user: mockUser, session: null },
        error: null,
      })

      const mockFrom = vi.fn().mockReturnValue({
        upsert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
      })
      ;(supabase.from as any) = mockFrom

      const result = await authService.signUp('test@example.com', 'password123', 'Test User')

      expect(result).toEqual(mockProfile)
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: {
            name: 'Test User',
          },
        },
      })
    })

    it('throws error on invalid credentials', async () => {
      const error = new Error('Email already registered')

      ;(supabase.auth.signUp as any).mockResolvedValue({
        data: { user: null, session: null },
        error,
      })

      await expect(authService.signUp('test@example.com', 'pass', 'Test')).rejects.toThrow(
        'Email already registered'
      )
    })
  })

  describe('signIn', () => {
    it('returns profile on valid credentials', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' }
      const mockProfile = createMockUser({ id: 'user-123', email: 'test@example.com' })

      ;(supabase.auth.signInWithPassword as any).mockResolvedValue({
        data: { user: mockUser, session: {} },
        error: null,
      })

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
      })
      ;(supabase.from as any) = mockFrom

      const result = await authService.signIn('test@example.com', 'password123')

      expect(result).toEqual(mockProfile)
    })

    it('throws error on invalid credentials', async () => {
      const error = new Error('Invalid login credentials')

      ;(supabase.auth.signInWithPassword as any).mockResolvedValue({
        data: { user: null, session: null },
        error,
      })

      await expect(authService.signIn('test@example.com', 'wrong')).rejects.toThrow(
        'Invalid login credentials'
      )
    })
  })

  describe('signOut', () => {
    it('signs out successfully', async () => {
      ;(supabase.auth.signOut as any).mockResolvedValue({ error: null })

      await expect(authService.signOut()).resolves.not.toThrow()
      expect(supabase.auth.signOut).toHaveBeenCalled()
    })
  })

  describe('getCurrentUser', () => {
    it('returns profile when authenticated', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' }
      const mockProfile = createMockUser({ id: 'user-123' })

      ;(supabase.auth.getUser as any).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
      })
      ;(supabase.from as any) = mockFrom

      const result = await authService.getCurrentUser()

      expect(result).toEqual(mockProfile)
    })

    it('returns null when not authenticated', async () => {
      ;(supabase.auth.getUser as any).mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const result = await authService.getCurrentUser()

      expect(result).toBeNull()
    })
  })

  describe('getSession', () => {
    it('returns current session', async () => {
      const mockSession = { access_token: 'token-123' }

      ;(supabase.auth.getSession as any).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      })

      const result = await authService.getSession()

      expect(result).toEqual(mockSession)
    })
  })

  describe('onAuthStateChange', () => {
    it('registers callback for auth state changes', () => {
      const callback = vi.fn()
      const mockSubscription = { subscription: { unsubscribe: vi.fn() } }

      ;(supabase.auth.onAuthStateChange as any).mockReturnValue({
        data: mockSubscription,
      })

      const result = authService.onAuthStateChange(callback)

      expect(supabase.auth.onAuthStateChange).toHaveBeenCalledWith(callback)
      expect(result).toEqual({ data: mockSubscription })
    })
  })
})