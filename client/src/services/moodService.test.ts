import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MoodService } from './moodService'
import { supabase } from '../utils/supabaseClient'
import { createMockMoodCheckin } from '../test/helpers'

vi.mock('../utils/supabaseClient', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn(),
      maybeSingle: vi.fn(),
    })),
  },
}))

describe('MoodService', () => {
  let service: MoodService

  beforeEach(() => {
    service = new MoodService()
    vi.clearAllMocks()
  })

  describe('getTodaysMoodCheckin', () => {
    it('returns today\'s mood checkin', async () => {
      const mockMood = createMockMoodCheckin()

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: mockMood, error: null }),
      })
      ;(supabase.from as any) = mockFrom

      const result = await service.getTodaysMoodCheckin('user-123')

      expect(result).toEqual(mockMood)
      expect(supabase.from).toHaveBeenCalledWith('mood_checkins')
    })

    it('returns null when no mood exists', async () => {
      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      })
      ;(supabase.from as any) = mockFrom

      const result = await service.getTodaysMoodCheckin('user-123')

      expect(result).toBeNull()
    })
  })

  describe('submitMoodCheckin', () => {
    it('creates new mood checkin', async () => {
      const moodData = {
        user_id: 'user-123',
        overall_mood: 4,
        energy_level: 3,
        stress_level: 2,
        relationship_satisfaction: 5,
        mood_tags: ['happy'],
        mood_note: 'Great day',
      }
      const mockMood = createMockMoodCheckin(moodData)

      const mockFrom = vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockMood, error: null }),
      })
      ;(supabase.from as any) = mockFrom

      const result = await service.submitMoodCheckin(moodData)

      expect(result).toEqual(mockMood)
    })

    it('throws error on failure', async () => {
      const error = new Error('Database error')
      const moodData = {
        user_id: 'user-123',
        overall_mood: 4,
        energy_level: 3,
        stress_level: 2,
      }

      const mockFrom = vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error }),
      })
      ;(supabase.from as any) = mockFrom

      await expect(service.submitMoodCheckin(moodData)).rejects.toThrow('Database error')
    })
  })

  describe('updateMoodCheckin', () => {
    it('updates existing mood checkin', async () => {
      const updates = {
        overall_mood: 5,
        mood_note: 'Updated note',
      }
      const mockMood = createMockMoodCheckin(updates)

      const mockFrom = vi.fn().mockReturnValue({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockMood, error: null }),
      })
      ;(supabase.from as any) = mockFrom

      const result = await service.updateMoodCheckin('mood-123', updates)

      expect(result).toEqual(mockMood)
    })
  })

  describe('getMoodHistory', () => {
    it('returns mood history for date range', async () => {
      const mockMoods = [
        createMockMoodCheckin({ id: 'mood-1' }),
        createMockMoodCheckin({ id: 'mood-2' }),
      ]

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockMoods, error: null }),
      })
      ;(supabase.from as any) = mockFrom

      const startDate = new Date('2024-01-01')
      const endDate = new Date('2024-01-31')
      const result = await service.getMoodHistory('user-123', startDate, endDate)

      expect(result).toEqual(mockMoods)
      expect(supabase.from).toHaveBeenCalledWith('mood_checkins')
    })
  })
})