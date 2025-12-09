import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QuestionService } from './questionService'
import { supabase } from '../utils/supabaseClient'
import { createMockQuestion } from '../test/helpers'

vi.mock('../utils/supabaseClient', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
    rpc: vi.fn(),
  },
}))

describe('QuestionService', () => {
  let service: QuestionService

  beforeEach(() => {
    service = new QuestionService()
    vi.clearAllMocks()
  })

  describe('getDailyQuestion', () => {
    it('returns existing assignment', async () => {
      const mockAssignment = {
        id: 'assign-123',
        partnership_id: 'partnership-123',
        question_id: 'question-123',
        date: new Date().toISOString().split('T')[0],
      }
      const mockQuestion = createMockQuestion({ id: 'question-123' })

      const mockFrom = vi.fn()
      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockAssignment, error: null }),
      })
      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockQuestion, error: null }),
      })
      ;(supabase.from as any) = mockFrom

      const result = await service.getDailyQuestion('partnership-123')

      expect(result.assignment).toEqual(mockAssignment)
      expect(result.question).toEqual(mockQuestion)
    })

    it('creates new assignment when none exists', async () => {
      const mockAssignment = {
        id: 'assign-123',
        partnership_id: 'partnership-123',
        question_id: 'question-456',
        date: new Date().toISOString().split('T')[0],
      }
      const mockQuestion = createMockQuestion({ id: 'question-456' })

      ;(supabase.rpc as any).mockResolvedValue({ data: 'question-456', error: null })

      const mockFrom = vi.fn()
      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      })
      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockAssignment, error: null }),
      })
      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockQuestion, error: null }),
      })
      ;(supabase.from as any) = mockFrom

      const result = await service.getDailyQuestion('partnership-123')

      expect(supabase.rpc).toHaveBeenCalledWith('assign_daily_question_atomic', {
        p_partnership_id: 'partnership-123',
      })
      expect(result.assignment).toEqual(mockAssignment)
      expect(result.question).toEqual(mockQuestion)
    })

    it('throws error when RPC fails', async () => {
      const error = new Error('RPC failed')

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      })
      ;(supabase.from as any) = mockFrom
      ;(supabase.rpc as any).mockResolvedValue({ data: null, error })

      await expect(service.getDailyQuestion('partnership-123')).rejects.toThrow('RPC failed')
    })
  })

  describe('getQuestion', () => {
    it('returns question by ID', async () => {
      const mockQuestion = createMockQuestion({ id: 'question-123' })

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockQuestion, error: null }),
      })
      ;(supabase.from as any) = mockFrom

      const result = await service.getQuestion('question-123')

      expect(result).toEqual(mockQuestion)
    })

    it('throws error when question not found', async () => {
      const error = new Error('Question not found')

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error }),
      })
      ;(supabase.from as any) = mockFrom

      await expect(service.getQuestion('invalid-id')).rejects.toThrow('Question not found')
    })
  })
})