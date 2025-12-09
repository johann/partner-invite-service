import { supabase } from '../utils/supabaseClient'
import type { Answer, AnswerInsert, AnswerUpdate } from '../types/models'

// Simple answer encryption (matches iOS app pattern)
// For production, implement proper encryption
class AnswerEncryption {
  static encrypt(text: string): string {
    // TODO: Implement proper encryption matching iOS implementation
    return text
  }

  static decrypt(text: string): string {
    // TODO: Implement proper decryption matching iOS implementation
    return text
  }
}

export class AnswerService {
  /**
   * Submit a new answer to a question
   */
  async submitAnswer(
    userId: string,
    questionId: string,
    text: string
  ): Promise<Answer> {
    console.log('💬 [AnswerService] submitAnswer called', {
      userId,
      questionId,
      textLength: text.length,
    })

    try {
      const insert: AnswerInsert = {
        user_id: userId,
        question_id: questionId,
        text: AnswerEncryption.encrypt(text),
        skipped: false,
        visibility: 'partnership',
      }

      const { data, error } = await supabase.from('answers').insert(insert).select().single()

      if (error) {
        console.error('❌ [AnswerService] Error submitting answer', {
          error,
          message: error.message,
          details: error.details,
        })
        throw error
      }

      console.log('✅ [AnswerService] Answer submitted successfully', { answerId: data.id })
      return data
    } catch (error) {
      console.error('❌ [AnswerService] submitAnswer failed', {
        error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      })
      throw error
    }
  }

  /**
   * Get answers for a specific question from both users in a partnership
   */
  async getPartnershipAnswers(
    userId: string,
    partnerId: string,
    questionId: string
  ): Promise<{ userAnswer: Answer | null; partnerAnswer: Answer | null }> {
    console.log('📖 [AnswerService] getPartnershipAnswers called', {
      userId,
      partnerId,
      questionId,
    })

    try {
      const { data, error } = await supabase
        .from('answers')
        .select('*')
        .eq('question_id', questionId)
        .in('user_id', [userId, partnerId])

      if (error) {
        console.error('❌ [AnswerService] Error fetching partnership answers', {
          error,
          message: error.message,
          details: error.details,
        })
        throw error
      }

      const answers = data || []
      const userAnswer = answers.find((a) => a.user_id === userId) || null
      const partnerAnswer = answers.find((a) => a.user_id === partnerId) || null

      console.log('✅ [AnswerService] Partnership answers retrieved', {
        totalAnswers: answers.length,
        hasUserAnswer: !!userAnswer,
        hasPartnerAnswer: !!partnerAnswer,
      })

      return { userAnswer, partnerAnswer }
    } catch (error) {
      console.error('❌ [AnswerService] getPartnershipAnswers failed', {
        error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      })
      throw error
    }
  }

  /**
   * Update an existing answer
   */
  async updateAnswer(answerId: string, text: string): Promise<Answer> {
    console.log('✏️ [AnswerService] updateAnswer called', {
      answerId,
      textLength: text.length,
    })

    try {
      const update: AnswerUpdate = {
        text: AnswerEncryption.encrypt(text),
        edited_at: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from('answers')
        .update(update)
        .eq('id', answerId)
        .select()
        .single()

      if (error) {
        console.error('❌ [AnswerService] Error updating answer', {
          error,
          message: error.message,
          details: error.details,
        })
        throw error
      }

      console.log('✅ [AnswerService] Answer updated successfully')
      return data
    } catch (error) {
      console.error('❌ [AnswerService] updateAnswer failed', {
        error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      })
      throw error
    }
  }

  /**
   * Delete an answer
   */
  async deleteAnswer(answerId: string): Promise<void> {
    const { error } = await supabase.from('answers').delete().eq('id', answerId)

    if (error) throw error
  }

  /**
   * Skip a question
   */
  async skipQuestion(userId: string, questionId: string, reason?: string): Promise<Answer> {
    console.log('⏭️ [AnswerService] skipQuestion called', {
      userId,
      questionId,
      hasReason: !!reason,
    })

    try {
      const insert: AnswerInsert = {
        user_id: userId,
        question_id: questionId,
        text: '',
        skipped: true,
        skip_reason: reason || null,
        visibility: 'private',
      }

      const { data, error } = await supabase.from('answers').insert(insert).select().single()

      if (error) {
        console.error('❌ [AnswerService] Error skipping question', {
          error,
          message: error.message,
          details: error.details,
        })
        throw error
      }

      console.log('✅ [AnswerService] Question skipped successfully', { answerId: data.id })
      return data
    } catch (error) {
      console.error('❌ [AnswerService] skipQuestion failed', {
        error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      })
      throw error
    }
  }
}

export const answerService = new AnswerService()