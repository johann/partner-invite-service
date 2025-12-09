/**
 * Service for interacting with the invitation API
 * Handles email-based partnership invitations
 */

export interface InvitationResponse {
  success: boolean
  message: string
  invitation: {
    id: string
    to_user_email: string
    status: string
  }
}

export interface Partnership {
  partnership_id: string
  partner: {
    id: string
    name: string
    email: string
    profile_picture_url?: string
  }
  created_at: string
  streak_days?: number
}

export interface PendingInvitations {
  sent: Array<{
    id: string
    to_user_email?: string
    to_user?: {
      name: string
      email: string
    }
    status: string
    created_at: string
  }>
  received: Array<{
    id: string
    from_user: {
      name: string
      email: string
      profile_picture_url?: string
    }
    status: string
    created_at: string
  }>
}

class InvitationService {
  private baseUrl = '/api/invitations'

  /**
   * Send an email invitation to a partner
   * Requires authentication token in Authorization header
   */
  async sendInvitation(email: string, token: string): Promise<InvitationResponse> {
    const response = await fetch(`${this.baseUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ invitee_email: email }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to send invitation' }))
      throw new Error(error.error || 'Failed to send invitation')
    }

    return response.json()
  }

  /**
   * Get user's partnerships
   * Requires authentication token in Authorization header
   */
  async getPartnerships(token: string): Promise<{ partnerships: Partnership[] }> {
    const response = await fetch(`${this.baseUrl}/partnerships`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch partnerships')
    }

    return response.json()
  }

  /**
   * Get pending invitations (sent and received)
   * Requires authentication token in Authorization header
   */
  async getPendingInvitations(token: string): Promise<PendingInvitations> {
    const response = await fetch(`${this.baseUrl}/pending`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch pending invitations')
    }

    return response.json()
  }
}

export const invitationService = new InvitationService()

