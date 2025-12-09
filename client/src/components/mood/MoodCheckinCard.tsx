import { useState } from 'react'
import { useMoodCheckin } from '../../hooks/useMoodCheckin'

const MOOD_EMOJIS = ['😔', '😕', '😐', '🙂', '😊']
const MOOD_LABELS = ['Very Low', 'Low', 'Neutral', 'Good', 'Great']

const MOOD_TAGS = [
  'Happy',
  'Grateful',
  'Excited',
  'Calm',
  'Peaceful',
  'Anxious',
  'Stressed',
  'Tired',
  'Frustrated',
  'Sad',
  'Motivated',
  'Confident',
  'Loved',
  'Lonely',
  'Overwhelmed',
]

export default function MoodCheckinCard() {
  const { todaysMood, isLoadingMood, submitMood, updateMood, isSubmitting } = useMoodCheckin()

  const [showForm, setShowForm] = useState(false)
  const [overallMood, setOverallMood] = useState(3)
  const [energyLevel, setEnergyLevel] = useState(3)
  const [stressLevel, setStressLevel] = useState(3)
  const [relationshipSatisfaction, setRelationshipSatisfaction] = useState(3)
  const [moodNote, setMoodNote] = useState('')
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)

  const openForm = () => {
    if (todaysMood) {
      setOverallMood(todaysMood.overall_mood)
      setEnergyLevel(todaysMood.energy_level)
      setStressLevel(todaysMood.stress_level)
      setRelationshipSatisfaction(todaysMood.relationship_satisfaction || 3)
      setMoodNote(todaysMood.mood_note || '')
      setSelectedTags(new Set(todaysMood.mood_tags || []))
    }
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setError(null)
  }

  const toggleTag = (tag: string) => {
    const newTags = new Set(selectedTags)
    if (newTags.has(tag)) {
      newTags.delete(tag)
    } else {
      newTags.add(tag)
    }
    setSelectedTags(newTags)
  }

  const handleSubmit = async () => {
    try {
      setError(null)

      const data = {
        overall_mood: overallMood,
        energy_level: energyLevel,
        stress_level: stressLevel,
        relationship_satisfaction: relationshipSatisfaction,
        mood_note: moodNote || null,
        mood_tags: Array.from(selectedTags),
        partnership_id: null, // Optional
      }

      if (todaysMood) {
        await updateMood({ id: todaysMood.id, update: data })
      } else {
        await submitMood(data)
      }

      closeForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save mood check-in')
    }
  }

  if (isLoadingMood) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <div className="h-40 animate-pulse"></div>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Mood Check-in</h2>

        {todaysMood ? (
          <div className="space-y-4">
            {/* Mood Display */}
            <div className="text-center">
              <div className="mb-2 text-6xl">{MOOD_EMOJIS[todaysMood.overall_mood - 1]}</div>
              <p className="text-lg font-medium text-white">
                {MOOD_LABELS[todaysMood.overall_mood - 1]}
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-slate-800 bg-slate-800/50 p-3">
                <p className="text-xs text-slate-400">Energy</p>
                <p className="text-lg font-semibold text-white">{todaysMood.energy_level}/5</p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-800/50 p-3">
                <p className="text-xs text-slate-400">Stress</p>
                <p className="text-lg font-semibold text-white">{todaysMood.stress_level}/5</p>
              </div>
            </div>

            {/* Note */}
            {todaysMood.mood_note && (
              <div className="rounded-lg bg-slate-800/50 p-3">
                <p className="text-sm text-slate-300">{todaysMood.mood_note}</p>
              </div>
            )}

            {/* Tags */}
            {todaysMood.mood_tags && todaysMood.mood_tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {todaysMood.mood_tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={openForm}
              className="w-full rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
            >
              Update Mood
            </button>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <div className="text-4xl">🤔</div>
            <p className="text-slate-400">How are you feeling today?</p>
            <button
              onClick={openForm}
              className="w-full rounded-lg bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
            >
              Check In
            </button>
          </div>
        )}
      </div>

      {/* Mood Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="mb-4 text-xl font-semibold text-white">Mood Check-in</h3>

            {error && (
              <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Overall Mood */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Overall Mood</label>
                <div className="flex items-center justify-between">
                  {MOOD_EMOJIS.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => setOverallMood(index + 1)}
                      className={`text-4xl transition ${
                        overallMood === index + 1 ? 'scale-125' : 'opacity-50 hover:opacity-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Energy Level */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Energy Level</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Exhausted</span>
                  <span>Energized</span>
                </div>
              </div>

              {/* Stress Level */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Stress Level</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={stressLevel}
                  onChange={(e) => setStressLevel(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Relaxed</span>
                  <span>Very Stressed</span>
                </div>
              </div>

              {/* Relationship Satisfaction */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Relationship Satisfaction
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={relationshipSatisfaction}
                  onChange={(e) => setRelationshipSatisfaction(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Struggling</span>
                  <span>Thriving</span>
                </div>
              </div>

              {/* Mood Tags */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  How are you feeling? (Optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {MOOD_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                        selectedTags.has(tag)
                          ? 'bg-indigo-500 text-white'
                          : 'border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Notes (Optional)
                </label>
                <textarea
                  value={moodNote}
                  onChange={(e) => setMoodNote(e.target.value)}
                  placeholder="What's on your mind?"
                  rows={3}
                  className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={closeForm}
                  disabled={isSubmitting}
                  className="flex-1 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : todaysMood ? 'Update' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}