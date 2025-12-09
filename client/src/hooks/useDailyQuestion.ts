import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { questionService } from '../services/questionService'
import { answerService } from '../services/answerService'
import { useAuth } from './useAuth'
import { supabase } from '../utils/supabaseClient'
import type { DailyQuestionData } from '../types/models'

/**
 * Hook to manage daily question for a partnership
 */
export function useDailyQuestion(partnershipId: string | undefined) {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Query for the daily question
  const dailyQuestion = useQuery({
    queryKey: ['daily-question', partnershipId],
    queryFn: async (): Promise<DailyQuestionData> => {
      try {
        console.log('📝 [useDailyQuestion] Fetching daily question', {
          partnershipId,
          userId: user?.id,
        })

        // Step 1: Get daily question
        console.log('📝 [useDailyQuestion] Step 1: Getting daily question from service...')
        const { assignment, question } = await questionService.getDailyQuestion(partnershipId!)
        console.log('✅ [useDailyQuestion] Step 1: Daily question retrieved', {
          questionId: question.id,
          questionText: question.text?.substring(0, 50) + '...',
          assignmentId: assignment.id,
        })

        // Step 2: Get partnership to determine partner ID
        console.log('📝 [useDailyQuestion] Step 2: Fetching partnership details...')
        const { data: partnership, error: partnershipError } = await supabase
          .from('partnerships')
          .select('*')
          .eq('id', partnershipId!)
          .single()

        if (partnershipError) {
          console.error('❌ [useDailyQuestion] Step 2: Partnership fetch error', {
            error: partnershipError,
            partnershipId,
          })
          throw new Error(`Partnership fetch failed: ${partnershipError.message}`)
        }

        if (!partnership) {
          console.error('❌ [useDailyQuestion] Step 2: Partnership not found', { partnershipId })
          throw new Error('Partnership not found')
        }

        console.log('✅ [useDailyQuestion] Step 2: Partnership found', {
          partnershipId: partnership.id,
          profile1: partnership.profile1_id,
          profile2: partnership.profile2_id,
        })

        // Step 3: Determine partner ID
        const partnerId =
          partnership.profile1_id === user!.id
            ? partnership.profile2_id
            : partnership.profile1_id
        
        console.log('📝 [useDailyQuestion] Step 3: Partner ID determined', {
          currentUserId: user!.id,
          partnerId,
        })

        // Step 4: Get answers for both users
        console.log('📝 [useDailyQuestion] Step 4: Fetching answers...')
        const { userAnswer, partnerAnswer } = await answerService.getPartnershipAnswers(
          user!.id,
          partnerId,
          question.id
        )
        console.log('✅ [useDailyQuestion] Step 4: Answers retrieved', {
          hasUserAnswer: !!userAnswer,
          hasPartnerAnswer: !!partnerAnswer,
          userAnswerId: userAnswer?.id,
          partnerAnswerId: partnerAnswer?.id,
        })

        console.log('✅ [useDailyQuestion] Successfully loaded daily question data')
        return {
          question,
          assignment,
          userAnswer: userAnswer || undefined,
          partnerAnswer: partnerAnswer || undefined,
        }
      } catch (error) {
        console.error('❌ [useDailyQuestion] Failed to load daily question', {
          error,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          errorStack: error instanceof Error ? error.stack : undefined,
          partnershipId,
          userId: user?.id,
        })
        throw error
      }
    },
    enabled: !!partnershipId && !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error) => {
      console.warn('⚠️ [useDailyQuestion] Query retry', {
        attempt: failureCount,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      return failureCount < 2 // Only retry twice
    },
  })

  // Mutation to submit an answer
  const submitAnswer = useMutation({
    mutationFn: async (text: string) => {
      console.log('💬 [useDailyQuestion] Submitting answer', {
        userId: user!.id,
        questionId: dailyQuestion.data!.question.id,
        textLength: text.length,
      })
      try {
        const result = await answerService.submitAnswer(user!.id, dailyQuestion.data!.question.id, text)
        console.log('✅ [useDailyQuestion] Answer submitted successfully', { answerId: result.id })
        return result
      } catch (error) {
        console.error('❌ [useDailyQuestion] Failed to submit answer', {
          error,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        })
        throw error
      }
    },
    onSuccess: () => {
      console.log('🔄 [useDailyQuestion] Invalidating daily question cache after submit')
      queryClient.invalidateQueries({ queryKey: ['daily-question', partnershipId] })
    },
    onError: (error) => {
      console.error('❌ [useDailyQuestion] Submit answer mutation error', { error })
    },
  })

  // Mutation to update an answer
  const updateAnswer = useMutation({
    mutationFn: async ({ answerId, text }: { answerId: string; text: string }) => {
      console.log('✏️ [useDailyQuestion] Updating answer', { answerId, textLength: text.length })
      try {
        const result = await answerService.updateAnswer(answerId, text)
        console.log('✅ [useDailyQuestion] Answer updated successfully')
        return result
      } catch (error) {
        console.error('❌ [useDailyQuestion] Failed to update answer', {
          error,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          answerId,
        })
        throw error
      }
    },
    onSuccess: () => {
      console.log('🔄 [useDailyQuestion] Invalidating daily question cache after update')
      queryClient.invalidateQueries({ queryKey: ['daily-question', partnershipId] })
    },
    onError: (error) => {
      console.error('❌ [useDailyQuestion] Update answer mutation error', { error })
    },
  })

  // Mutation to skip a question
  const skipQuestion = useMutation({
    mutationFn: async (reason?: string) => {
      console.log('⏭️ [useDailyQuestion] Skipping question', {
        userId: user!.id,
        questionId: dailyQuestion.data!.question.id,
        hasReason: !!reason,
      })
      try {
        const result = await answerService.skipQuestion(user!.id, dailyQuestion.data!.question.id, reason)
        console.log('✅ [useDailyQuestion] Question skipped successfully')
        return result
      } catch (error) {
        console.error('❌ [useDailyQuestion] Failed to skip question', {
          error,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        })
        throw error
      }
    },
    onSuccess: () => {
      console.log('🔄 [useDailyQuestion] Invalidating daily question cache after skip')
      queryClient.invalidateQueries({ queryKey: ['daily-question', partnershipId] })
    },
    onError: (error) => {
      console.error('❌ [useDailyQuestion] Skip question mutation error', { error })
    },
  })

  return {
    // Data
    question: dailyQuestion.data?.question,
    userAnswer: dailyQuestion.data?.userAnswer,
    partnerAnswer: dailyQuestion.data?.partnerAnswer,
    isLoading: dailyQuestion.isLoading,
    error: dailyQuestion.error,

    // Actions
    submitAnswer: submitAnswer.mutateAsync,
    updateAnswer: updateAnswer.mutateAsync,
    skipQuestion: skipQuestion.mutateAsync,

    // Status
    isSubmitting: submitAnswer.isPending || updateAnswer.isPending || skipQuestion.isPending,
  }
}