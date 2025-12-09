import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PartnershipService } from './partnershipService'
import { supabase } from '../utils/supabaseClient'
import { createMockPartnership, createMockUser } from '../test/helpers'

vi.mock('../utils/supabaseClient', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      ilike: vi.fn().mockReturnThis(),
      single: vi.fn(),
      order: vi.fn().mockReturnThis(),
    })),
  },
}))

describe('PartnershipService', () => {
  let service: PartnershipService

  beforeEach(() => {
    service = new PartnershipService()
    vi.clearAllMocks()
  })

  describe('getActivePartnerships', () => {
    it('returns user partnerships', async () => {
      const mockPartnerships = [
        createMockPartnership({ id: 'p1', profile1_id: 'user-123' }),
        createMockPartnership({ id: 'p2', profile2_id: 'user-123' }),
      ]

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockPartnerships, error: null }),
      })
      ;(supabase.from as any) = mockFrom

      const result = await service.getActivePartnerships('user-123')

      expect(result).toEqual(mockPartnerships)
      expect(supabase.from).toHaveBeenCalledWith('partnerships')
    })

    it('throws error on failure', async () => {
      const error = new Error('Database error')

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: null, error }),
      })
      ;(supabase.from as any) = mockFrom

      await expect(service.getActivePartnerships('user-123')).rejects.toThrow('Database error')
    })
  })

  describe('getPartnershipRequests', () => {
    it('returns incoming requests', async () => {
      const mockRequests = [
        { id: 'req-1', from_user_id: 'user-456', to_user_id: 'user-123', status: 'pending' },
      ]

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockRequests, error: null }),
      })
      ;(supabase.from as any) = mockFrom

      const result = await service.getPartnershipRequests('user-123')

      expect(result).toEqual(mockRequests)
    })
  })

  describe('getSentPartnershipRequests', () => {
    it('returns sent requests', async () => {
      const mockRequests = [
        { id: 'req-1', from_user_id: 'user-123', to_user_id: 'user-456', status: 'pending' },
      ]

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockRequests, error: null }),
      })
      ;(supabase.from as any) = mockFrom

      const result = await service.getSentPartnershipRequests('user-123')

      expect(result).toEqual(mockRequests)
    })
  })

  describe('sendPartnershipRequest', () => {
    it('creates a partnership request', async () => {
      const mockFrom = vi.fn().mockReturnValue({
        insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      })
      ;(supabase.from as any) = mockFrom

      await expect(service.sendPartnershipRequest('user-123', 'user-456', 'Hello!')).resolves.not.toThrow()
      expect(supabase.from).toHaveBeenCalledWith('partnership_requests')
    })

    it('throws error on failure', async () => {
      const error = new Error('Request already exists')

      const mockFrom = vi.fn().mockReturnValue({
        insert: vi.fn().mockResolvedValue({ data: null, error }),
      })
      ;(supabase.from as any) = mockFrom

      await expect(
        service.sendPartnershipRequest('user-123', 'user-456', 'Hello!')
      ).rejects.toThrow('Request already exists')
    })
  })

  describe('acceptPartnershipRequest', () => {
    it('creates partnership using RPC', async () => {
      ;(supabase.rpc as any) = vi.fn().mockResolvedValue({ error: null })

      await expect(service.acceptPartnershipRequest('req-123')).resolves.not.toThrow()
      expect(supabase.rpc).toHaveBeenCalledWith('accept_partnership_request', {
        request_id: 'req-123',
      })
    })

    it('throws error on RPC failure', async () => {
      const error = new Error('RPC failed')
      ;(supabase.rpc as any) = vi.fn().mockResolvedValue({ error })

      await expect(service.acceptPartnershipRequest('req-123')).rejects.toThrow('RPC failed')
    })
  })

  describe('declinePartnershipRequest', () => {
    it('updates request status to declined', async () => {
      const mockFrom = vi.fn().mockReturnValue({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null }),
      })
      ;(supabase.from as any) = mockFrom

      await expect(service.declinePartnershipRequest('req-123')).resolves.not.toThrow()
      expect(supabase.from).toHaveBeenCalledWith('partnership_requests')
    })
  })

  describe('searchUsersByEmail', () => {
    it('returns matching users', async () => {
      const mockUsers = [createMockUser({ email: 'test@example.com' })]

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        ilike: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: mockUsers, error: null }),
      })
      ;(supabase.from as any) = mockFrom

      const result = await service.searchUsersByEmail('test@example.com')

      expect(result).toEqual(mockUsers)
      expect(supabase.from).toHaveBeenCalledWith('profiles')
    })
  })

  describe('getPartnerProfile', () => {
    it('returns partner profile', async () => {
      const mockPartnership = createMockPartnership({
        profile1_id: 'user-123',
        profile2_id: 'user-456',
      })
      const mockPartner = createMockUser({ id: 'user-456' })

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockPartner, error: null }),
      })
      ;(supabase.from as any) = mockFrom

      const result = await service.getPartnerProfile(mockPartnership, 'user-123')

      expect(result).toEqual(mockPartner)
      expect(supabase.from).toHaveBeenCalledWith('profiles')
    })

    it('returns correct partner when user is profile2', async () => {
      const mockPartnership = createMockPartnership({
        profile1_id: 'user-456',
        profile2_id: 'user-123',
      })
      const mockPartner = createMockUser({ id: 'user-456' })

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockPartner, error: null }),
      })
      ;(supabase.from as any) = mockFrom

      const result = await service.getPartnerProfile(mockPartnership, 'user-123')

      expect(result).toEqual(mockPartner)
    })
  })
})