import { useState } from 'react'
import { useDailyQuestion } from '../../hooks/useDailyQuestion'

interface DailyQuestionCardProps {
  partnershipId: string
}

export default function DailyQuestionCard({ partnershipId }: DailyQuestionCardProps) {
  const {
    question,
    userAnswer,
    partnerAnswer,
    isLoading,
    submitAnswer,
    isSubmitting,
    error,
  } = useDailyQuestion(partnershipId)

  const [answerText, setAnswerText] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!answerText.trim()) {
      setSubmitError('Please write an answer')
      return
    }

    try {
      setSubmitError(null)
      await submitAnswer(answerText)
      setAnswerText('')
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit answer')
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <div className="space-y-4">
          <div className="h-6 w-32 animate-pulse rounded bg-slate-800"></div>
          <div className="h-20 animate-pulse rounded bg-slate-800"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <p className="text-sm text-red-400">Failed to load daily question</p>
      </div>
    )
  }

  if (!question) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <p className="text-sm text-slate-400">No question available</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Today's Question</h2>
        <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
          {question.category || 'Daily'}
        </span>
      </div>

      {/* Question */}
      <div className="mb-6">
        <p className="text-lg font-medium text-slate-200">{question.text}</p>
      </div>

      {/* User's Answer Section */}
      {userAnswer ? (
        <div className="mb-4 rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-400">
            Your Answer
          </p>
          <p className="text-sm text-blue-100">{userAnswer.text}</p>
          <p className="mt-2 text-xs text-blue-400/70">
            Answered {new Date(userAnswer.created_at!).toLocaleString()}
          </p>
        </div>
      ) : (
        <div className="mb-4 space-y-3">
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Share your thoughts..."
            rows={4}
            className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {submitError && <p className="text-sm text-red-400">{submitError}</p>}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !answerText.trim()}
            className="w-full rounded-lg bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Answer'}
          </button>
        </div>
      )}

      {/* Partner's Answer Section */}
      {partnerAnswer && (
        <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-green-400">
            Partner's Answer
          </p>
          <p className="text-sm text-green-100">{partnerAnswer.text}</p>
          <p className="mt-2 text-xs text-green-400/70">
            Answered {new Date(partnerAnswer.created_at!).toLocaleString()}
          </p>
        </div>
      )}

      {/* Waiting for Partner */}
      {userAnswer && !partnerAnswer && (
        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 text-center">
          <p className="text-sm text-slate-400">⏳ Waiting for your partner to answer...</p>
        </div>
      )}
    </div>
  )
}