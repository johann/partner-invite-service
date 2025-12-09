import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { moodService } from '../services/moodService'
import { useAuth } from './useAuth'
import type { MoodCheckinInsert, MoodCheckinUpdate } from '../types/models'

/**
 * Hook to manage mood check-ins
 */
export function useMoodCheckin() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Query for today's mood check-in
  const todaysMood = useQuery({
    queryKey: ['mood-checkin', 'today', user?.id],
    queryFn: async () => {
      console.log('😊 [useMoodCheckin] Fetching today\'s mood', { userId: user!.id })
      try {
        const result = await moodService.getTodaysMoodCheckin(user!.id)
        console.log('✅ [useMoodCheckin] Today\'s mood loaded', { hasMood: !!result, moodId: result?.id })
        return result
      } catch (error) {
        console.error('❌ [useMoodCheckin] Failed to load today\'s mood', {
          error,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          userId: user!.id,
        })
        throw error
      }
    },
    enabled: !!user,
    staleTime: 1 * 60 * 1000, // 1 minute
  })

  // Mutation to submit a new mood check-in
  const submitMood = useMutation({
    mutationFn: async (insert: Omit<MoodCheckinInsert, 'user_id'>) => {
      console.log('📝 [useMoodCheckin] Submitting new mood check-in', {
        userId: user!.id,
        overallMood: insert.overall_mood,
        energyLevel: insert.energy_level,
        stressLevel: insert.stress_level,
      })
      try {
        const result = await moodService.submitMoodCheckin({
          ...insert,
          user_id: user!.id,
        })
        console.log('✅ [useMoodCheckin] Mood check-in submitted', { moodId: result.id })
        return result
      } catch (error) {
        console.error('❌ [useMoodCheckin] Failed to submit mood', {
          error,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        })
        throw error
      }
    },
    onSuccess: () => {
      console.log('🔄 [useMoodCheckin] Invalidating mood cache after submit')
      queryClient.invalidateQueries({ queryKey: ['mood-checkin'] })
    },
  })

  // Mutation to update existing mood check-in
  const updateMood = useMutation({
    mutationFn: async ({ id, update }: { id: string; update: MoodCheckinUpdate }) => {
      console.log('✏️ [useMoodCheckin] Updating mood check-in', { moodId: id })
      try {
        const result = await moodService.updateMoodCheckin(id, update)
        console.log('✅ [useMoodCheckin] Mood check-in updated')
        return result
      } catch (error) {
        console.error('❌ [useMoodCheckin] Failed to update mood', {
          error,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          moodId: id,
        })
        throw error
      }
    },
    onSuccess: () => {
      console.log('🔄 [useMoodCheckin] Invalidating mood cache after update')
      queryClient.invalidateQueries({ queryKey: ['mood-checkin'] })
    },
  })

  return {
    // Data
    todaysMood: todaysMood.data,
    isLoadingMood: todaysMood.isLoading,
    error: todaysMood.error,

    // Actions
    submitMood: submitMood.mutateAsync,
    updateMood: updateMood.mutateAsync,

    // Status
    isSubmitting: submitMood.isPending || updateMood.isPending,
  }
}