import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { partnershipService } from '../services/partnershipService'
import { useAuth } from './useAuth'

/**
 * Hook for managing partnerships
 */
export function usePartnerships() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Query for active partnerships
  const partnerships = useQuery({
    queryKey: ['partnerships', user?.id],
    queryFn: async () => {
      console.log('🤝 [usePartnerships] Fetching active partnerships', { userId: user!.id })
      try {
        const result = await partnershipService.getActivePartnerships(user!.id)
        console.log('✅ [usePartnerships] Active partnerships loaded', { count: result.length })
        return result
      } catch (error) {
        console.error('❌ [usePartnerships] Failed to load partnerships', {
          error,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          userId: user!.id,
        })
        throw error
      }
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })

  // Query for received partnership requests
  const partnershipRequests = useQuery({
    queryKey: ['partnership-requests', user?.id],
    queryFn: async () => {
      console.log('📥 [usePartnerships] Fetching partnership requests', { userId: user!.id })
      try {
        const result = await partnershipService.getPartnershipRequests(user!.id)
        console.log('✅ [usePartnerships] Partnership requests loaded', { count: result.length })
        return result
      } catch (error) {
        console.error('❌ [usePartnerships] Failed to load partnership requests', {
          error,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        })
        throw error
      }
    },
    enabled: !!user,
    staleTime: 1 * 60 * 1000, // 1 minute
  })

  // Query for sent partnership requests
  const sentRequests = useQuery({
    queryKey: ['sent-partnership-requests', user?.id],
    queryFn: async () => {
      console.log('📤 [usePartnerships] Fetching sent requests', { userId: user!.id })
      try {
        const result = await partnershipService.getSentPartnershipRequests(user!.id)
        console.log('✅ [usePartnerships] Sent requests loaded', { count: result.length })
        return result
      } catch (error) {
        console.error('❌ [usePartnerships] Failed to load sent requests', {
          error,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        })
        throw error
      }
    },
    enabled: !!user,
  })

  // Mutation to send a partnership request
  const sendRequest = useMutation({
    mutationFn: async ({ toUserId, message }: { toUserId: string; message?: string }) => {
      console.log('📨 [usePartnerships] Sending partnership request', { toUserId, hasMessage: !!message })
      try {
        await partnershipService.sendPartnershipRequest(user!.id, toUserId, message)
        console.log('✅ [usePartnerships] Partnership request sent')
      } catch (error) {
        console.error('❌ [usePartnerships] Failed to send request', {
          error,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        })
        throw error
      }
    },
    onSuccess: () => {
      console.log('🔄 [usePartnerships] Invalidating sent requests cache')
      queryClient.invalidateQueries({ queryKey: ['sent-partnership-requests'] })
    },
  })

  // Mutation to accept a partnership request
  const acceptRequest = useMutation({
    mutationFn: async (requestId: string) => {
      console.log('✅ [usePartnerships] Accepting partnership request', { requestId })
      try {
        await partnershipService.acceptPartnershipRequest(requestId)
        console.log('✅ [usePartnerships] Partnership request accepted')
      } catch (error) {
        console.error('❌ [usePartnerships] Failed to accept request', {
          error,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          requestId,
        })
        throw error
      }
    },
    onSuccess: () => {
      console.log('🔄 [usePartnerships] Invalidating partnerships and requests cache')
      queryClient.invalidateQueries({ queryKey: ['partnership-requests'] })
      queryClient.invalidateQueries({ queryKey: ['partnerships'] })
    },
  })

  // Mutation to decline a partnership request
  const declineRequest = useMutation({
    mutationFn: async (requestId: string) => {
      console.log('❌ [usePartnerships] Declining partnership request', { requestId })
      try {
        await partnershipService.declinePartnershipRequest(requestId)
        console.log('✅ [usePartnerships] Partnership request declined')
      } catch (error) {
        console.error('❌ [usePartnerships] Failed to decline request', {
          error,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          requestId,
        })
        throw error
      }
    },
    onSuccess: () => {
      console.log('🔄 [usePartnerships] Invalidating requests cache')
      queryClient.invalidateQueries({ queryKey: ['partnership-requests'] })
    },
  })

  // Mutation to remove a partnership
  const removePartnership = useMutation({
    mutationFn: async (partnershipId: string) => {
      console.log('🗑️ [usePartnerships] Removing partnership', { partnershipId })
      try {
        await partnershipService.removePartnership(partnershipId)
        console.log('✅ [usePartnerships] Partnership removed')
      } catch (error) {
        console.error('❌ [usePartnerships] Failed to remove partnership', {
          error,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          partnershipId,
        })
        throw error
      }
    },
    onSuccess: () => {
      console.log('🔄 [usePartnerships] Invalidating partnerships cache')
      queryClient.invalidateQueries({ queryKey: ['partnerships'] })
    },
  })

  return {
    // Data
    partnerships: partnerships.data || [],
    isLoadingPartnerships: partnerships.isLoading,
    partnershipRequests: partnershipRequests.data || [],
    sentRequests: sentRequests.data || [],
    
    // Actions
    sendRequest: sendRequest.mutateAsync,
    acceptRequest: acceptRequest.mutateAsync,
    declineRequest: declineRequest.mutateAsync,
    removePartnership: removePartnership.mutateAsync,
    
    // Status
    isProcessing:
      sendRequest.isPending ||
      acceptRequest.isPending ||
      declineRequest.isPending ||
      removePartnership.isPending,
  }
}

/**
 * Hook to search for users
 */
export function useUserSearch() {
  return useMutation({
    mutationFn: (email: string) => partnershipService.searchUsersByEmail(email),
  })
}