import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { usePartnerships, useUserSearch } from '../hooks/usePartnership'
import PartnershipCard from '../components/partnerships/PartnershipCard'
import PartnershipRequestCard from '../components/partnerships/PartnershipRequestCard'
import type { Profile } from '../types/models'

export default function PartnershipsPage() {
  const { user } = useAuth()
  const {
    partnerships,
    isLoadingPartnerships,
    partnershipRequests,
    acceptRequest,
    declineRequest,
    sendRequest,
    isProcessing,
  } = usePartnerships()

  const userSearch = useUserSearch()
  
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [searchEmail, setSearchEmail] = useState('')
  const [searchResults, setSearchResults] = useState<Profile[]>([])
  const [inviteMessage, setInviteMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleSearch = async () => {
    if (!searchEmail) return
    
    try {
      const results = await userSearch.mutateAsync(searchEmail)
      // Filter out current user and existing partnerships
      const filtered = results.filter((profile) => {
        if (profile.id === user?.id) return false
        return !partnerships.some(
          (p) => p.profile1_id === profile.id || p.profile2_id === profile.id
        )
      })
      setSearchResults(filtered)
    } catch (error) {
      console.error('Search failed:', error)
    }
  }

  const handleSendInvite = async (toUserId: string) => {
    try {
      await sendRequest({ toUserId, message: inviteMessage })
      setSuccessMessage('Partnership request sent!')
      setShowInviteDialog(false)
      setSearchEmail('')
      setSearchResults([])
      setInviteMessage('')
      
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Failed to send request:', error)
    }
  }

  const handleAccept = async (requestId: string) => {
    try {
      await acceptRequest(requestId)
    } catch (error) {
      console.error('Failed to accept request:', error)
    }
  }

  const handleDecline = async (requestId: string) => {
    try {
      await declineRequest(requestId)
    } catch (error) {
      console.error('Failed to decline request:', error)
    }
  }

  return (
    <div className="flex w-full flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Partnerships</h1>
          <p className="mt-2 text-sm text-slate-400">
            Manage your connections and grow together
          </p>
        </div>
        <button
          onClick={() => setShowInviteDialog(true)}
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
        >
          Invite Partner
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
          <p className="text-sm text-green-400">{successMessage}</p>
        </div>
      )}

      {/* Pending Requests */}
      {partnershipRequests.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">
            Pending Requests ({partnershipRequests.length})
          </h2>
          <div className="space-y-3">
            {partnershipRequests.map((request) => (
              <PartnershipRequestCard
                key={request.id}
                request={request}
                onAccept={handleAccept}
                onDecline={handleDecline}
                isProcessing={isProcessing}
              />
            ))}
          </div>
        </section>
      )}

      {/* Active Partnerships */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">
          Active Partnerships ({partnerships.length})
        </h2>
        
        {isLoadingPartnerships ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/40"
              />
            ))}
          </div>
        ) : partnerships.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center">
            <p className="text-slate-400">No active partnerships yet</p>
            <button
              onClick={() => setShowInviteDialog(true)}
              className="mt-4 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
            >
              Invite your first partner
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {partnerships.map((partnership) => (
              <PartnershipCard
                key={partnership.id}
                partnership={partnership}
                currentUserId={user!.id}
              />
            ))}
          </div>
        )}
      </section>

      {/* Invite Dialog */}
      {showInviteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-xl font-semibold text-white">Invite Partner</h3>
            <p className="mt-1 text-sm text-slate-400">
              Search for a user by email to send them a partnership request
            </p>

            <div className="mt-6 space-y-4">
              {/* Search */}
              <div className="flex gap-2">
                <input
                  type="email"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  placeholder="partner@example.com"
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
                <button
                  onClick={handleSearch}
                  disabled={userSearch.isPending}
                  className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
                >
                  {userSearch.isPending ? 'Searching...' : 'Search'}
                </button>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-2">
                  {searchResults.map((profile) => (
                    <div
                      key={profile.id}
                      className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-800/50 p-3"
                    >
                      <div>
                        <p className="font-medium text-white">{profile.name}</p>
                        <p className="text-xs text-slate-400">{profile.email}</p>
                      </div>
                      <button
                        onClick={() => handleSendInvite(profile.id)}
                        disabled={isProcessing}
                        className="rounded-lg bg-indigo-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-indigo-400"
                      >
                        Invite
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-slate-300">
                  Message (Optional)
                </label>
                <textarea
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  placeholder="Hi! Let's grow together..."
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowInviteDialog(false)
                    setSearchEmail('')
                    setSearchResults([])
                    setInviteMessage('')
                  }}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}