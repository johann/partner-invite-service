import { supabase } from '../utils/supabaseClient'
import type { MoodCheckin, MoodCheckinInsert, MoodCheckinUpdate } from '../types/models'

export class MoodService {
  /**
   * Get today's mood check-in for a user
   */
  async getTodaysMoodCheckin(userId: string): Promise<MoodCheckin | null> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayISO = today.toISOString()

    const { data, error } = await supabase
      .from('mood_checkins')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', todayISO)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) throw error
    return data
  }

  /**
   * Submit a new mood check-in
   */
  async submitMoodCheckin(insert: MoodCheckinInsert): Promise<MoodCheckin> {
    const { data, error } = await supabase.from('mood_checkins').insert(insert).select().single()

    if (error) throw error
    return data
  }

  /**
   * Update an existing mood check-in
   */
  async updateMoodCheckin(id: string, update: MoodCheckinUpdate): Promise<MoodCheckin> {
    const { data, error } = await supabase
      .from('mood_checkins')
      .update({ ...update, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  /**
   * Get mood check-ins for a date range
   */
  async getMoodHistory(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<MoodCheckin[]> {
    const { data, error } = await supabase
      .from('mood_checkins')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }
}

export const moodService = new MoodService()