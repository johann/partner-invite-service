import { useState, useEffect } from 'react'
import { partnershipService } from '../../services/partnershipService'
import type { Partnership, Profile } from '../../types/models'

interface PartnershipCardProps {
  partnership: Partnership
  currentUserId: string
}

export default function PartnershipCard({ partnership, currentUserId }: PartnershipCardProps) {
  const [partner, setPartner] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    partnershipService
      .getPartnerProfile(partnership, currentUserId)
      .then((profile) => {
        setPartner(profile)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Failed to load partner profile:', error)
        setLoading(false)
      })
  }, [partnership, currentUserId])

  if (loading) {
    return (
      <div className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <div className="h-20"></div>
      </div>
    )
  }

  if (!partner) {
    return null
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 transition hover:border-slate-700">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10 text-lg font-semibold text-indigo-400">
            {partner.name?.[0]?.toUpperCase() || 'P'}
          </div>

          {/* Partner Info */}
          <div>
            <h3 className="text-lg font-semibold text-white">{partner.name || 'Partner'}</h3>
            <p className="text-sm text-slate-400">{partner.email}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 flex items-center space-x-6 border-t border-slate-800 pt-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🔥</span>
          <div>
            <p className="text-xs text-slate-500">Streak</p>
            <p className="text-sm font-semibold text-white">{partnership.streak_days} days</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-2xl">⭐</span>
          <div>
            <p className="text-xs text-slate-500">Score</p>
            <p className="text-sm font-semibold text-white">{partnership.partnership_score}</p>
          </div>
        </div>
      </div>
    </div>
  )
}