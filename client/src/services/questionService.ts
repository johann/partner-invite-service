import { supabase } from '../utils/supabaseClient'
import type { Question, QuestionAssignment } from '../types/models'

export class QuestionService {
  /**
   * Get or assign today's daily question for a partnership
   */
  async getDailyQuestion(partnershipId: string): Promise<{
    assignment: QuestionAssignment
    question: Question
  }> {
    console.log('📋 [QuestionService] getDailyQuestion called', { partnershipId })
    const today = new Date().toISOString().split('T')[0]
    console.log('📅 [QuestionService] Date:', today)

    try {
      // 1. Check if there's already an assignment for today
      console.log('📋 [QuestionService] Step 1: Checking for existing assignment...')
      const { data: existingAssignment, error: checkError } = await supabase
        .from('question_assignments')
        .select('*')
        .eq('partnership_id', partnershipId)
        .eq('date', today)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 is "not found" which is expected
        console.error('❌ [QuestionService] Error checking for existing assignment', {
          error: checkError,
          code: checkError.code,
          message: checkError.message,
        })
      }

      let assignment = existingAssignment

      if (assignment) {
        console.log('✅ [QuestionService] Step 1: Found existing assignment', {
          assignmentId: assignment.id,
          questionId: assignment.question_id,
        })
      }

      // 2. If no assignment exists, create one using RPC function
      if (!assignment) {
        console.log('📋 [QuestionService] Step 2: No assignment found, creating new one via RPC...')
        const { error: rpcError } = await supabase.rpc(
          'assign_daily_question_atomic',
          {
            p_partnership_id: partnershipId,
          }
        )

        if (rpcError) {
          console.error('❌ [QuestionService] RPC error when assigning question', {
            error: rpcError,
            message: rpcError.message,
            details: rpcError.details,
            hint: rpcError.hint,
          })
          throw new Error(`Failed to assign daily question: ${rpcError.message}`)
        }

        console.log('✅ [QuestionService] Step 2: RPC call successful, fetching new assignment...')

        // Fetch the newly created assignment
        const { data: newAssignment, error: fetchError } = await supabase
          .from('question_assignments')
          .select('*')
          .eq('partnership_id', partnershipId)
          .eq('date', today)
          .single()

        if (fetchError) {
          console.error('❌ [QuestionService] Error fetching newly created assignment', {
            error: fetchError,
            message: fetchError.message,
          })
          throw new Error(`Failed to fetch assignment after creation: ${fetchError.message}`)
        }

        assignment = newAssignment
        console.log('✅ [QuestionService] Step 2: New assignment fetched', {
          assignmentId: assignment.id,
          questionId: assignment.question_id,
        })
      }

      // 3. Fetch the question details
      console.log('📋 [QuestionService] Step 3: Fetching question details...', {
        questionId: assignment.question_id,
      })
      const { data: question, error: questionError } = await supabase
        .from('questions')
        .select('*')
        .eq('id', assignment.question_id)
        .single()

      if (questionError) {
        console.error('❌ [QuestionService] Error fetching question details', {
          error: questionError,
          message: questionError.message,
          questionId: assignment.question_id,
        })
        throw new Error(`Failed to fetch question: ${questionError.message}`)
      }

      console.log('✅ [QuestionService] Step 3: Question details fetched', {
        questionId: question.id,
        questionText: question.text?.substring(0, 50) + '...',
        category: question.category,
      })

      console.log('✅ [QuestionService] Successfully retrieved daily question')
      return { assignment, question }
    } catch (error) {
      console.error('❌ [QuestionService] getDailyQuestion failed', {
        error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : undefined,
        partnershipId,
        today,
      })
      throw error
    }
  }

  /**
   * Get a question by ID
   */
  async getQuestion(questionId: string): Promise<Question> {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('id', questionId)
      .single()

    if (error) throw error
    return data
  }
}

export const questionService = new QuestionService()