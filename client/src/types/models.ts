// Core domain models for ScratchyPad application
import type { Database } from './database.types'

// Database table types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Partnership = Database['public']['Tables']['partnerships']['Row']
export type PartnershipInsert = Database['public']['Tables']['partnerships']['Insert']
export type PartnershipUpdate = Database['public']['Tables']['partnerships']['Update']

export type PartnershipRequest = Database['public']['Tables']['partnership_requests']['Row']
export type PartnershipRequestInsert = Database['public']['Tables']['partnership_requests']['Insert']
export type PartnershipRequestUpdate = Database['public']['Tables']['partnership_requests']['Update']

export type Question = Database['public']['Tables']['questions']['Row']
export type QuestionAssignment = Database['public']['Tables']['question_assignments']['Row']

export type Answer = Database['public']['Tables']['answers']['Row']
export type AnswerInsert = Database['public']['Tables']['answers']['Insert']
export type AnswerUpdate = Database['public']['Tables']['answers']['Update']

export type MoodCheckin = Database['public']['Tables']['mood_checkins']['Row']
export type MoodCheckinInsert = Database['public']['Tables']['mood_checkins']['Insert']
export type MoodCheckinUpdate = Database['public']['Tables']['mood_checkins']['Update']

// Partnership status enum
export type PartnershipStatus = 'active' | 'archived' | 'paused'
export type PartnershipRequestStatus = 'pending' | 'accepted' | 'declined'

// UI-specific types
export interface PartnershipWithProfile extends Partnership {
  partnerProfile?: Profile
}

export interface QuestionWithAnswers extends Question {
  userAnswer?: Answer
  partnerAnswer?: Answer
}

export interface DailyQuestionData {
  question: Question
  assignment: QuestionAssignment
  userAnswer?: Answer
  partnerAnswer?: Answer
}