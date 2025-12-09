import { supabase } from '../utils/supabaseClient'
import type {
  Partnership,
  PartnershipRequest,
  PartnershipRequestInsert,
  Profile,
} from '../types/models'

export class PartnershipService {
  /**
   * Get all active partnerships for a user
   */
  async getActivePartnerships(userId: string): Promise<Partnership[]> {
    const { data, error } = await supabase
      .from('partnerships')
      .select('*')
      .or(`profile1_id.eq.${userId},profile2_id.eq.${userId}`)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  /**
   * Get partnership requests received by a user
   */
  async getPartnershipRequests(userId: string): Promise<PartnershipRequest[]> {
    const { data, error } = await supabase
      .from('partnership_requests')
      .select('*')
      .eq('to_user_id', userId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  /**
   * Get partnership requests sent by a user
   */
  async getSentPartnershipRequests(userId: string): Promise<PartnershipRequest[]> {
    const { data, error } = await supabase
      .from('partnership_requests')
      .select('*')
      .eq('from_user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  /**
   * Send a partnership request
   */
  async sendPartnershipRequest(
    fromUserId: string,
    toUserId: string,
    message?: string
  ): Promise<void> {
    const insert: PartnershipRequestInsert = {
      from_user_id: fromUserId,
      to_user_id: toUserId,
      message: message || null,
      status: 'pending',
    }

    const { error } = await supabase.from('partnership_requests').insert(insert)

    if (error) throw error
  }

  /**
   * Accept a partnership request (creates partnership)
   */
  async acceptPartnershipRequest(requestId: string): Promise<void> {
    const { error } = await supabase.rpc('accept_partnership_request', {
      request_id: requestId,
    })

    if (error) throw error
  }

  /**
   * Decline a partnership request
   */
  async declinePartnershipRequest(requestId: string): Promise<void> {
    const { error } = await supabase
      .from('partnership_requests')
      .update({ status: 'declined' })
      .eq('id', requestId)

    if (error) throw error
  }

  /**
   * Get the partner's profile from a partnership
   */
  async getPartnerProfile(partnership: Partnership, currentUserId: string): Promise<Profile> {
    const partnerId =
      partnership.profile1_id === currentUserId
        ? partnership.profile2_id
        : partnership.profile1_id

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', partnerId)
      .single()

    if (error) throw error
    return data
  }

  /**
   * Get a profile by user ID (for looking up request senders)
   */
  async getProfileById(userId: string): Promise<Profile> {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()

    if (error) throw error
    return data
  }

  /**
   * Search for users by email
   */
  async searchUsersByEmail(email: string): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('email', `%${email}%`)
      .limit(5)

    if (error) throw error
    return data || []
  }

  /**
   * Remove/archive a partnership
   */
  async removePartnership(partnershipId: string): Promise<void> {
    const { error } = await supabase
      .from('partnerships')
      .update({ status: 'archived' })
      .eq('id', partnershipId)

    if (error) throw error
  }
}

export const partnershipService = new PartnershipService()