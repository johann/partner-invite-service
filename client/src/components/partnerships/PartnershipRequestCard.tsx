import { useState, useEffect } from 'react'
import { partnershipService } from '../../services/partnershipService'
import type { PartnershipRequest, Profile } from '../../types/models'

interface PartnershipRequestCardProps {
  request: PartnershipRequest
  onAccept: (requestId: string) => void
  onDecline: (requestId: string) => void
  isProcessing: boolean
}

export default function PartnershipRequestCard({
  request,
  onAccept,
  onDecline,
  isProcessing,
}: PartnershipRequestCardProps) {
  const [fromUser, setFromUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    partnershipService
      .getProfileById(request.from_user_id)
      .then((profile) => {
        setFromUser(profile)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Failed to load user profile:', error)
        setLoading(false)
      })
  }, [request.from_user_id])

  if (loading) {
    return (
      <div className="animate-pulse rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <div className="h-16"></div>
      </div>
    )
  }

  if (!fromUser) {
    return null
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/10 text-sm font-semibold text-indigo-400">
            {fromUser.name?.[0]?.toUpperCase() || 'U'}
          </div>

          {/* User Info */}
          <div>
            <p className="font-medium text-white">{fromUser.name || 'User'}</p>
            <p className="text-xs text-slate-400">{fromUser.email}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onDecline(request.id)}
            disabled={isProcessing}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Decline
          </button>
          <button
            onClick={() => onAccept(request.id)}
            disabled={isProcessing}
            className="rounded-lg bg-indigo-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Accept
          </button>
        </div>
      </div>

      {/* Message */}
      {request.message && (
        <div className="mt-3 rounded-lg bg-slate-800/50 p-3">
          <p className="text-sm text-slate-300">{request.message}</p>
        </div>
      )}
    </div>
  )
}