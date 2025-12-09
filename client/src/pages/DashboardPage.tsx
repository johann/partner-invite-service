import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { usePartnerships } from '../hooks/usePartnership'
import DailyQuestionCard from '../components/questions/DailyQuestionCard'
import MoodCheckinCard from '../components/mood/MoodCheckinCard'
import PartnershipCard from '../components/partnerships/PartnershipCard'
import { useState, useEffect } from 'react'

function DashboardPage() {
  const { user } = useAuth()
  const { partnerships, isLoadingPartnerships, partnershipRequests } = usePartnerships()
  const [searchParams, setSearchParams] = useSearchParams()
  const [showPartnershipAccepted, setShowPartnershipAccepted] = useState(false)

  const activePartnership = partnerships[0] // For MVP, use first partnership

  // Check for partnership_accepted query param
  useEffect(() => {
    if (searchParams.get('partnership_accepted') === 'true') {
      setShowPartnershipAccepted(true)
      // Remove query param from URL
      searchParams.delete('partnership_accepted')
      setSearchParams(searchParams, { replace: true })

      // Hide message after 5 seconds
      const timer = setTimeout(() => {
        setShowPartnershipAccepted(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [searchParams, setSearchParams])

  return (
    <div className="flex w-full flex-col gap-8">
      {/* Header */}
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold text-white">Welcome back, {user?.name || 'User'}! 👋</h1>
        <p className="text-sm text-slate-400">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </section>

      {/* Partnership Accepted Success Message */}
      {showPartnershipAccepted && (
        <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="font-medium text-green-300">Partnership Accepted!</p>
              <p className="text-sm text-green-400">Your partnership has been successfully created. Start your journey together!</p>
            </div>
          </div>
        </div>
      )}

      {/* Partnership Requests Alert */}
      {partnershipRequests.length > 0 && (
        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-indigo-300">
                You have {partnershipRequests.length} pending partnership request
                {partnershipRequests.length > 1 ? 's' : ''}
              </p>
              <p className="text-sm text-indigo-400">Review and accept to start your journey together</p>
            </div>
            <Link
              to="/partnerships"
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
            >
              View Requests
            </Link>
          </div>
        </div>
      )}

      {/* No Partnership State */}
      {!isLoadingPartnerships && !activePartnership && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center">
          <div className="mb-4 text-6xl">💝</div>
          <h2 className="mb-2 text-xl font-semibold text-white">No Active Partnership</h2>
          <p className="mb-6 text-slate-400">
            Create or accept a partnership to start answering daily questions together
          </p>
          <Link
            to="/partnerships"
            className="inline-block rounded-lg bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
          >
            Manage Partnerships
          </Link>
        </div>
      )}

      {/* Main Content - Daily Question and Mood */}
      {activePartnership && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Daily Question */}
          <div className="space-y-6">
            <DailyQuestionCard partnershipId={activePartnership.id} />
          </div>

          {/* Mood Check-in */}
          <div className="space-y-6">
            <MoodCheckinCard />
          </div>
        </div>
      )}

      {/* Active Partnerships Section */}
      {partnerships.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Your Partnerships</h2>
            <Link
              to="/partnerships"
              className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
            >
              View all →
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {partnerships.slice(0, 2).map((partnership) => (
              <PartnershipCard
                key={partnership.id}
                partnership={partnership}
                currentUserId={user!.id}
              />
            ))}
          </div>
        </section>
      )}

      {/* Loading State */}
      {isLoadingPartnerships && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-80 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/40"></div>
          <div className="h-80 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/40"></div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage