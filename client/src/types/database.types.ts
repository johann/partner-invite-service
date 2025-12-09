export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string
          color: string
          created_at: string | null
          description: string
          icon_name: string
          id: string
          is_active: boolean | null
          is_secret: boolean | null
          name: string
          points: number | null
          requirements: Json
        }
        Insert: {
          category: string
          color: string
          created_at?: string | null
          description: string
          icon_name: string
          id?: string
          is_active?: boolean | null
          is_secret?: boolean | null
          name: string
          points?: number | null
          requirements: Json
        }
        Update: {
          category?: string
          color?: string
          created_at?: string | null
          description?: string
          icon_name?: string
          id?: string
          is_active?: boolean | null
          is_secret?: boolean | null
          name?: string
          points?: number | null
          requirements?: Json
        }
        Relationships: []
      }
      adventure_achievements: {
        Row: {
          achievement_name: string
          achievement_type: string
          activity_ids: string[] | null
          description: string | null
          earned_at: string
          icon_name: string | null
          id: string
          metadata: Json | null
          partnership_id: string
        }
        Insert: {
          achievement_name: string
          achievement_type: string
          activity_ids?: string[] | null
          description?: string | null
          earned_at?: string
          icon_name?: string | null
          id?: string
          metadata?: Json | null
          partnership_id: string
        }
        Update: {
          achievement_name?: string
          achievement_type?: string
          activity_ids?: string[] | null
          description?: string | null
          earned_at?: string
          icon_name?: string | null
          id?: string
          metadata?: Json | null
          partnership_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "adventure_achievements_partnership_id_fkey"
            columns: ["partnership_id"]
            isOneToOne: false
            referencedRelation: "partnerships"
            referencedColumns: ["id"]
          },
        ]
      }
      adventure_activities: {
        Row: {
          actual_cost: number | null
          actual_duration_minutes: number | null
          booking_details: Json | null
          budget_limit: number | null
          category: Database["public"]["Enums"]["adventure_category"]
          completed_date: string | null
          created_at: string
          created_by: string
          description: string | null
          difficulty_level: number | null
          estimated_duration_minutes: number | null
          id: string
          location: string | null
          notes: string | null
          partner_notes: string | null
          partner_rating: number | null
          partnership_id: string
          photo_urls: string[] | null
          planned_date: string | null
          rating: number | null
          requires_booking: boolean | null
          shared_with_partner: boolean | null
          status: Database["public"]["Enums"]["adventure_status"]
          tags: string[] | null
          title: string
          updated_at: string
          weather_preference: string | null
        }
        Insert: {
          actual_cost?: number | null
          actual_duration_minutes?: number | null
          booking_details?: Json | null
          budget_limit?: number | null
          category: Database["public"]["Enums"]["adventure_category"]
          completed_date?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          difficulty_level?: number | null
          estimated_duration_minutes?: number | null
          id?: string
          location?: string | null
          notes?: string | null
          partner_notes?: string | null
          partner_rating?: number | null
          partnership_id: string
          photo_urls?: string[] | null
          planned_date?: string | null
          rating?: number | null
          requires_booking?: boolean | null
          shared_with_partner?: boolean | null
          status?: Database["public"]["Enums"]["adventure_status"]
          tags?: string[] | null
          title: string
          updated_at?: string
          weather_preference?: string | null
        }
        Update: {
          actual_cost?: number | null
          actual_duration_minutes?: number | null
          booking_details?: Json | null
          budget_limit?: number | null
          category?: Database["public"]["Enums"]["adventure_category"]
          completed_date?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          difficulty_level?: number | null
          estimated_duration_minutes?: number | null
          id?: string
          location?: string | null
          notes?: string | null
          partner_notes?: string | null
          partner_rating?: number | null
          partnership_id?: string
          photo_urls?: string[] | null
          planned_date?: string | null
          rating?: number | null
          requires_booking?: boolean | null
          shared_with_partner?: boolean | null
          status?: Database["public"]["Enums"]["adventure_status"]
          tags?: string[] | null
          title?: string
          updated_at?: string
          weather_preference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "adventure_activities_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adventure_activities_partnership_id_fkey"
            columns: ["partnership_id"]
            isOneToOne: false
            referencedRelation: "partnerships"
            referencedColumns: ["id"]
          },
        ]
      }
      adventure_streaks: {
        Row: {
          best_count: number
          current_count: number
          id: string
          last_activity_date: string | null
          partnership_id: string
          started_at: string
          streak_type: string
          updated_at: string
        }
        Insert: {
          best_count?: number
          current_count?: number
          id?: string
          last_activity_date?: string | null
          partnership_id: string
          started_at?: string
          streak_type: string
          updated_at?: string
        }
        Update: {
          best_count?: number
          current_count?: number
          id?: string
          last_activity_date?: string | null
          partnership_id?: string
          started_at?: string
          streak_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "adventure_streaks_partnership_id_fkey"
            columns: ["partnership_id"]
            isOneToOne: false
            referencedRelation: "partnerships"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_preferences: {
        Row: {
          created_at: string
          enabled: boolean
          id: string
          preferences: Json
          question_generation_enabled: boolean
          updated_at: string
          user_id: string
          weekly_insights_enabled: boolean
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          id?: string
          preferences?: Json
          question_generation_enabled?: boolean
          updated_at?: string
          user_id: string
          weekly_insights_enabled?: boolean
        }
        Update: {
          created_at?: string
          enabled?: boolean
          id?: string
          preferences?: Json
          question_generation_enabled?: boolean
          updated_at?: string
          user_id?: string
          weekly_insights_enabled?: boolean
        }
        Relationships: []
      }
      answers: {
        Row: {
          created_at: string | null
          edited_at: string | null
          id: string
          original_text: string | null
          question_id: string
          response_time: number | null
          skip_reason: string | null
          skipped: boolean | null
          text: string | null
          user_id: string
          visibility: string | null
        }
        Insert: {
          created_at?: string | null
          edited_at?: string | null
          id?: string
          original_text?: string | null
          question_id: string
          response_time?: number | null
          skip_reason?: string | null
          skipped?: boolean | null
          text?: string | null
          user_id: string
          visibility?: string | null
        }
        Update: {
          created_at?: string | null
          edited_at?: string | null
          id?: string
          original_text?: string | null
          question_id?: string
          response_time?: number | null
          skip_reason?: string | null
          skipped?: boolean | null
          text?: string | null
          user_id?: string
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "answers_profile_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "love_language_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      blocked_users: {
        Row: {
          blocked_at: string | null
          blocked_id: string
          blocker_id: string
          created_at: string | null
          id: string
          reason: string | null
        }
        Insert: {
          blocked_at?: string | null
          blocked_id: string
          blocker_id: string
          created_at?: string | null
          id?: string
          reason?: string | null
        }
        Update: {
          blocked_at?: string | null
          blocked_id?: string
          blocker_id?: string
          created_at?: string | null
          id?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blocked_users_blocked_id_fkey"
            columns: ["blocked_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blocked_users_blocker_id_fkey"
            columns: ["blocker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      deep_dive_insights: {
        Row: {
          action_suggestions: string[] | null
          confidence_score: number | null
          created_at: string
          generated_by: string
          id: string
          insight_description: string
          insight_title: string
          insight_type: string
          is_actionable: boolean
          partnership_id: string
          session_id: string
          supporting_responses: string[] | null
        }
        Insert: {
          action_suggestions?: string[] | null
          confidence_score?: number | null
          created_at?: string
          generated_by?: string
          id?: string
          insight_description: string
          insight_title: string
          insight_type: string
          is_actionable?: boolean
          partnership_id: string
          session_id: string
          supporting_responses?: string[] | null
        }
        Update: {
          action_suggestions?: string[] | null
          confidence_score?: number | null
          created_at?: string
          generated_by?: string
          id?: string
          insight_description?: string
          insight_title?: string
          insight_type?: string
          is_actionable?: boolean
          partnership_id?: string
          session_id?: string
          supporting_responses?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "deep_dive_insights_partnership_fkey"
            columns: ["partnership_id"]
            isOneToOne: false
            referencedRelation: "partnerships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deep_dive_insights_session_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "active_deep_dive_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deep_dive_insights_session_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "completed_deep_dive_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deep_dive_insights_session_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "deep_dive_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      deep_dive_parts: {
        Row: {
          created_at: string
          description: string | null
          estimated_minutes: number
          id: string
          instructions: string | null
          part_index: number
          part_type: string
          settings: Json
          template_id: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          estimated_minutes?: number
          id?: string
          instructions?: string | null
          part_index: number
          part_type?: string
          settings?: Json
          template_id: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          estimated_minutes?: number
          id?: string
          instructions?: string | null
          part_index?: number
          part_type?: string
          settings?: Json
          template_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "deep_dive_parts_template_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "deep_dive_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      deep_dive_questions: {
        Row: {
          created_at: string
          follow_up_trigger_conditions: Json | null
          id: string
          is_follow_up: boolean
          metadata: Json
          order_index: number
          parent_question_id: string | null
          part_id: string
          points_value: number
          question_text: string
          question_type: string
          time_limit_seconds: number | null
        }
        Insert: {
          created_at?: string
          follow_up_trigger_conditions?: Json | null
          id?: string
          is_follow_up?: boolean
          metadata?: Json
          order_index: number
          parent_question_id?: string | null
          part_id: string
          points_value?: number
          question_text: string
          question_type?: string
          time_limit_seconds?: number | null
        }
        Update: {
          created_at?: string
          follow_up_trigger_conditions?: Json | null
          id?: string
          is_follow_up?: boolean
          metadata?: Json
          order_index?: number
          parent_question_id?: string | null
          part_id?: string
          points_value?: number
          question_text?: string
          question_type?: string
          time_limit_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "deep_dive_questions_parent_fkey"
            columns: ["parent_question_id"]
            isOneToOne: false
            referencedRelation: "deep_dive_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deep_dive_questions_part_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "deep_dive_parts"
            referencedColumns: ["id"]
          },
        ]
      }
      deep_dive_responses: {
        Row: {
          created_at: string
          emotional_tags: string[] | null
          follow_up_responses: Json | null
          id: string
          is_skipped: boolean
          question_id: string
          response_choice: string | null
          response_rating: number | null
          response_text: string | null
          session_id: string
          skip_reason: string | null
          time_taken_seconds: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emotional_tags?: string[] | null
          follow_up_responses?: Json | null
          id?: string
          is_skipped?: boolean
          question_id: string
          response_choice?: string | null
          response_rating?: number | null
          response_text?: string | null
          session_id: string
          skip_reason?: string | null
          time_taken_seconds?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          emotional_tags?: string[] | null
          follow_up_responses?: Json | null
          id?: string
          is_skipped?: boolean
          question_id?: string
          response_choice?: string | null
          response_rating?: number | null
          response_text?: string | null
          session_id?: string
          skip_reason?: string | null
          time_taken_seconds?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deep_dive_responses_question_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "deep_dive_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deep_dive_responses_session_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "active_deep_dive_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deep_dive_responses_session_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "completed_deep_dive_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deep_dive_responses_session_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "deep_dive_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deep_dive_responses_user_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      deep_dive_sessions: {
        Row: {
          completed_at: string | null
          created_at: string
          current_part_index: number
          id: string
          mood_after: number | null
          mood_before: number | null
          partnership_id: string
          paused_at: string | null
          progress_percentage: number
          satisfaction_rating: number | null
          session_notes: string | null
          started_at: string | null
          status: string
          template_id: string
          total_parts: number
          total_time_spent_minutes: number
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          current_part_index?: number
          id?: string
          mood_after?: number | null
          mood_before?: number | null
          partnership_id: string
          paused_at?: string | null
          progress_percentage?: number
          satisfaction_rating?: number | null
          session_notes?: string | null
          started_at?: string | null
          status?: string
          template_id: string
          total_parts: number
          total_time_spent_minutes?: number
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          current_part_index?: number
          id?: string
          mood_after?: number | null
          mood_before?: number | null
          partnership_id?: string
          paused_at?: string | null
          progress_percentage?: number
          satisfaction_rating?: number | null
          session_notes?: string | null
          started_at?: string | null
          status?: string
          template_id?: string
          total_parts?: number
          total_time_spent_minutes?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deep_dive_sessions_partnership_fkey"
            columns: ["partnership_id"]
            isOneToOne: false
            referencedRelation: "partnerships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deep_dive_sessions_template_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "deep_dive_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      deep_dive_templates: {
        Row: {
          category: string
          created_at: string
          description: string
          difficulty_level: number
          estimated_duration_minutes: number
          id: string
          is_active: boolean
          prerequisite_template_id: string | null
          sort_order: number
          themes: string[]
          title: string
          unlock_criteria: Json | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          difficulty_level?: number
          estimated_duration_minutes?: number
          id?: string
          is_active?: boolean
          prerequisite_template_id?: string | null
          sort_order?: number
          themes?: string[]
          title: string
          unlock_criteria?: Json | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          difficulty_level?: number
          estimated_duration_minutes?: number
          id?: string
          is_active?: boolean
          prerequisite_template_id?: string | null
          sort_order?: number
          themes?: string[]
          title?: string
          unlock_criteria?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deep_dive_templates_prerequisite_fkey"
            columns: ["prerequisite_template_id"]
            isOneToOne: false
            referencedRelation: "deep_dive_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      future_date_plans: {
        Row: {
          activity_type: string | null
          booking_notes: string | null
          created_at: string | null
          created_by: string
          description: string | null
          estimated_cost: number | null
          id: string
          location: string | null
          metadata: Json | null
          partnership_id: string
          planned_date: string | null
          related_goal_id: string | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          activity_type?: string | null
          booking_notes?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          estimated_cost?: number | null
          id?: string
          location?: string | null
          metadata?: Json | null
          partnership_id: string
          planned_date?: string | null
          related_goal_id?: string | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          activity_type?: string | null
          booking_notes?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          estimated_cost?: number | null
          id?: string
          location?: string | null
          metadata?: Json | null
          partnership_id?: string
          planned_date?: string | null
          related_goal_id?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "future_date_plans_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "future_date_plans_partnership_id_fkey"
            columns: ["partnership_id"]
            isOneToOne: false
            referencedRelation: "partnerships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "future_date_plans_related_goal_id_fkey"
            columns: ["related_goal_id"]
            isOneToOne: false
            referencedRelation: "shared_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      game_mode_configs: {
        Row: {
          ai_insights_enabled: boolean
          classic_mode_enabled: boolean
          couple_game_enabled: boolean
          created_at: string
          deep_dive_enabled: boolean
          deep_dive_reminder_enabled: boolean
          id: string
          memory_lane_enabled: boolean
          memory_lane_phase_threshold: number
          settings: Json
          silly_spicy_mode: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_insights_enabled?: boolean
          classic_mode_enabled?: boolean
          couple_game_enabled?: boolean
          created_at?: string
          deep_dive_enabled?: boolean
          deep_dive_reminder_enabled?: boolean
          id?: string
          memory_lane_enabled?: boolean
          memory_lane_phase_threshold?: number
          settings?: Json
          silly_spicy_mode?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_insights_enabled?: boolean
          classic_mode_enabled?: boolean
          couple_game_enabled?: boolean
          created_at?: string
          deep_dive_enabled?: boolean
          deep_dive_reminder_enabled?: boolean
          id?: string
          memory_lane_enabled?: boolean
          memory_lane_phase_threshold?: number
          settings?: Json
          silly_spicy_mode?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_mode_configs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      game_session_questions: {
        Row: {
          answered_at: string | null
          id: string
          order_index: number | null
          player_index: number | null
          points_earned: number | null
          question_id: string | null
          session_id: string | null
          was_answered: boolean | null
          was_skipped: boolean | null
        }
        Insert: {
          answered_at?: string | null
          id?: string
          order_index?: number | null
          player_index?: number | null
          points_earned?: number | null
          question_id?: string | null
          session_id?: string | null
          was_answered?: boolean | null
          was_skipped?: boolean | null
        }
        Update: {
          answered_at?: string | null
          id?: string
          order_index?: number | null
          player_index?: number | null
          points_earned?: number | null
          question_id?: string | null
          session_id?: string | null
          was_answered?: boolean | null
          was_skipped?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "game_session_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "love_language_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_session_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_session_questions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      game_sessions: {
        Row: {
          completed_at: string | null
          current_mode: string | null
          current_player_index: number | null
          id: string
          mode_switches: number | null
          partnership_id: string | null
          score: number | null
          settings: Json | null
          started_at: string | null
        }
        Insert: {
          completed_at?: string | null
          current_mode?: string | null
          current_player_index?: number | null
          id?: string
          mode_switches?: number | null
          partnership_id?: string | null
          score?: number | null
          settings?: Json | null
          started_at?: string | null
        }
        Update: {
          completed_at?: string | null
          current_mode?: string | null
          current_player_index?: number | null
          id?: string
          mode_switches?: number | null
          partnership_id?: string | null
          score?: number | null
          settings?: Json | null
          started_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_sessions_partnership_id_fkey"
            columns: ["partnership_id"]
            isOneToOne: false
            referencedRelation: "partnerships"
            referencedColumns: ["id"]
          },
        ]
      }
      goal_milestones: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          completed_by: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          goal_id: string
          id: string
          order_index: number
          title: string
          updated_at: string | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          goal_id: string
          id?: string
          order_index?: number
          title: string
          updated_at?: string | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          goal_id?: string
          id?: string
          order_index?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "goal_milestones_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goal_milestones_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "shared_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      goal_progress_updates: {
        Row: {
          created_at: string | null
          goal_id: string
          id: string
          metadata: Json | null
          milestone_id: string | null
          progress_note: string | null
          progress_percentage: number | null
          update_type: string | null
          updated_by: string
        }
        Insert: {
          created_at?: string | null
          goal_id: string
          id?: string
          metadata?: Json | null
          milestone_id?: string | null
          progress_note?: string | null
          progress_percentage?: number | null
          update_type?: string | null
          updated_by: string
        }
        Update: {
          created_at?: string | null
          goal_id?: string
          id?: string
          metadata?: Json | null
          milestone_id?: string | null
          progress_note?: string | null
          progress_percentage?: number | null
          update_type?: string | null
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "goal_progress_updates_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "shared_goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goal_progress_updates_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "goal_milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goal_progress_updates_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          category: string | null
          created_at: string | null
          deadline: string | null
          description: string
          id: string
          is_achieved: boolean | null
          partnership_id: string
          progress: number | null
          reminder_frequency: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          deadline?: string | null
          description: string
          id?: string
          is_achieved?: boolean | null
          partnership_id: string
          progress?: number | null
          reminder_frequency?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string
          id?: string
          is_achieved?: boolean | null
          partnership_id?: string
          progress?: number | null
          reminder_frequency?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "goals_partnership_id_fkey"
            columns: ["partnership_id"]
            isOneToOne: false
            referencedRelation: "partnerships"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_entries: {
        Row: {
          content: string
          created_at: string | null
          entry_type: string | null
          id: string
          is_encrypted: boolean | null
          is_private: boolean | null
          mood_tag: string | null
          prompt_id: string | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          entry_type?: string | null
          id?: string
          is_encrypted?: boolean | null
          is_private?: boolean | null
          mood_tag?: string | null
          prompt_id?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          entry_type?: string | null
          id?: string
          is_encrypted?: boolean | null
          is_private?: boolean | null
          mood_tag?: string | null
          prompt_id?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      love_language_assessments: {
        Row: {
          assessment_date: string
          created_at: string | null
          id: string
          profile_id: string
          question_responses: Json
          total_score: number
          user_id: string
        }
        Insert: {
          assessment_date?: string
          created_at?: string | null
          id?: string
          profile_id: string
          question_responses?: Json
          total_score?: number
          user_id: string
        }
        Update: {
          assessment_date?: string
          created_at?: string | null
          id?: string
          profile_id?: string
          question_responses?: Json
          total_score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "love_language_assessments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "love_language_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "love_language_assessments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "love_language_profiles_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "love_language_assessments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      love_language_profiles: {
        Row: {
          created_at: string | null
          id: string
          last_assessment: string
          preferences: Json
          primary_language: string
          scores: Json
          secondary_language: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_assessment?: string
          preferences?: Json
          primary_language: string
          scores?: Json
          secondary_language?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_assessment?: string
          preferences?: Json
          primary_language?: string
          scores?: Json
          secondary_language?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "love_language_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      memory_book_entries: {
        Row: {
          card_text: string
          completion_id: string
          created_at: string
          id: string
          partner_response: string | null
          phase: string
          photo_url: string | null
          session_id: string
          user_response: string
        }
        Insert: {
          card_text: string
          completion_id: string
          created_at?: string
          id?: string
          partner_response?: string | null
          phase: string
          photo_url?: string | null
          session_id: string
          user_response: string
        }
        Update: {
          card_text?: string
          completion_id?: string
          created_at?: string
          id?: string
          partner_response?: string | null
          phase?: string
          photo_url?: string | null
          session_id?: string
          user_response?: string
        }
        Relationships: [
          {
            foreignKeyName: "memory_book_entries_completion_id_fkey"
            columns: ["completion_id"]
            isOneToOne: false
            referencedRelation: "memory_lane_completions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memory_book_entries_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "memory_lane_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      memory_lane_cards: {
        Row: {
          card_type: string
          created_at: string
          id: string
          is_active: boolean
          phase: string
          photo_prompt: string | null
          points: number
          recreation_prompt: string | null
          sort_order: number
          text: string
        }
        Insert: {
          card_type: string
          created_at?: string
          id?: string
          is_active?: boolean
          phase: string
          photo_prompt?: string | null
          points?: number
          recreation_prompt?: string | null
          sort_order?: number
          text: string
        }
        Update: {
          card_type?: string
          created_at?: string
          id?: string
          is_active?: boolean
          phase?: string
          photo_prompt?: string | null
          points?: number
          recreation_prompt?: string | null
          sort_order?: number
          text?: string
        }
        Relationships: []
      }
      memory_lane_completions: {
        Row: {
          card_id: string
          completed_at: string
          id: string
          partner_id: string
          partner_response: string | null
          photo_url: string | null
          points_earned: number
          session_id: string
          user_id: string
          user_response: string
        }
        Insert: {
          card_id: string
          completed_at?: string
          id?: string
          partner_id: string
          partner_response?: string | null
          photo_url?: string | null
          points_earned: number
          session_id: string
          user_id: string
          user_response: string
        }
        Update: {
          card_id?: string
          completed_at?: string
          id?: string
          partner_id?: string
          partner_response?: string | null
          photo_url?: string | null
          points_earned?: number
          session_id?: string
          user_id?: string
          user_response?: string
        }
        Relationships: [
          {
            foreignKeyName: "memory_lane_completions_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "memory_lane_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memory_lane_completions_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memory_lane_completions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "memory_lane_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memory_lane_completions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      memory_lane_sessions: {
        Row: {
          created_at: string
          current_phase: string
          id: string
          last_played_at: string
          partnership_id: string
          settings: Json
          started_at: string
          total_score: number
          unlocked_phases: string[]
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_phase?: string
          id?: string
          last_played_at?: string
          partnership_id: string
          settings?: Json
          started_at?: string
          total_score?: number
          unlocked_phases?: string[]
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_phase?: string
          id?: string
          last_played_at?: string
          partnership_id?: string
          settings?: Json
          started_at?: string
          total_score?: number
          unlocked_phases?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "memory_lane_sessions_partnership_id_fkey"
            columns: ["partnership_id"]
            isOneToOne: false
            referencedRelation: "partnerships"
            referencedColumns: ["id"]
          },
        ]
      }
      mood_checkins: {
        Row: {
          created_at: string | null
          energy_level: number
          id: string
          mood_note: string | null
          mood_tags: string[] | null
          overall_mood: number
          partnership_id: string | null
          relationship_satisfaction: number | null
          stress_level: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          energy_level: number
          id?: string
          mood_note?: string | null
          mood_tags?: string[] | null
          overall_mood: number
          partnership_id?: string | null
          relationship_satisfaction?: number | null
          stress_level: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          energy_level?: number
          id?: string
          mood_note?: string | null
          mood_tags?: string[] | null
          overall_mood?: number
          partnership_id?: string | null
          relationship_satisfaction?: number | null
          stress_level?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mood_checkins_partnership_id_fkey"
            columns: ["partnership_id"]
            isOneToOne: false
            referencedRelation: "partnerships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mood_checkins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mood_insights: {
        Row: {
          created_at: string | null
          id: string
          insight_data: Json
          insight_type: string
          partnership_id: string | null
          period_end: string
          period_start: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          insight_data: Json
          insight_type: string
          partnership_id?: string | null
          period_end: string
          period_start: string
        }
        Update: {
          created_at?: string | null
          id?: string
          insight_data?: Json
          insight_type?: string
          partnership_id?: string | null
          period_end?: string
          period_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "mood_insights_partnership_id_fkey"
            columns: ["partnership_id"]
            isOneToOne: false
            referencedRelation: "partnerships"
            referencedColumns: ["id"]
          },
        ]
      }
      mood_reminder_settings: {
        Row: {
          created_at: string | null
          enabled: boolean | null
          id: string
          reminder_days: number[] | null
          reminder_frequency: string | null
          reminder_time: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          reminder_days?: number[] | null
          reminder_frequency?: string | null
          reminder_time?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          reminder_days?: number[] | null
          reminder_frequency?: string | null
          reminder_time?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mood_reminder_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      partnership_requests: {
        Row: {
          created_at: string | null
          expires_at: string | null
          from_user_id: string
          id: string
          message: string | null
          status: string | null
          to_user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          from_user_id: string
          id?: string
          message?: string | null
          status?: string | null
          to_user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          from_user_id?: string
          id?: string
          message?: string | null
          status?: string | null
          to_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "partnership_requests_from_user_id_fkey"
            columns: ["from_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partnership_requests_to_user_id_fkey"
            columns: ["to_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      partnerships: {
        Row: {
          active_goals_count: number | null
          archived_at: string | null
          created_at: string | null
          deep_dive_sessions_completed: number
          future_building_enabled: boolean | null
          id: string
          last_active_date: string | null
          last_deep_dive_at: string | null
          last_quarterly_review_date: string | null
          partnership_score: number | null
          preferred_question_time: string | null
          profile1_id: string
          profile2_id: string
          question_history: Json | null
          status: string | null
          streak_backup: Json | null
          streak_days: number | null
          total_deep_dive_time_minutes: number
          vision_alignment_score: number | null
        }
        Insert: {
          active_goals_count?: number | null
          archived_at?: string | null
          created_at?: string | null
          deep_dive_sessions_completed?: number
          future_building_enabled?: boolean | null
          id?: string
          last_active_date?: string | null
          last_deep_dive_at?: string | null
          last_quarterly_review_date?: string | null
          partnership_score?: number | null
          preferred_question_time?: string | null
          profile1_id: string
          profile2_id: string
          question_history?: Json | null
          status?: string | null
          streak_backup?: Json | null
          streak_days?: number | null
          total_deep_dive_time_minutes?: number
          vision_alignment_score?: number | null
        }
        Update: {
          active_goals_count?: number | null
          archived_at?: string | null
          created_at?: string | null
          deep_dive_sessions_completed?: number
          future_building_enabled?: boolean | null
          id?: string
          last_active_date?: string | null
          last_deep_dive_at?: string | null
          last_quarterly_review_date?: string | null
          partnership_score?: number | null
          preferred_question_time?: string | null
          profile1_id?: string
          profile2_id?: string
          question_history?: Json | null
          status?: string | null
          streak_backup?: Json | null
          streak_days?: number | null
          total_deep_dive_time_minutes?: number
          vision_alignment_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "partnerships_profile1_id_fkey"
            columns: ["profile1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partnerships_profile2_id_fkey"
            columns: ["profile2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          deep_dive_preferences: Json | null
          email: string | null
          id: string
          is_verified: boolean | null
          last_active: string | null
          max_partnerships: number | null
          name: string | null
          preferences: Json | null
          profile_picture_url: string | null
          role: string | null
          streak_days: number | null
          timezone: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          deep_dive_preferences?: Json | null
          email?: string | null
          id: string
          is_verified?: boolean | null
          last_active?: string | null
          max_partnerships?: number | null
          name?: string | null
          preferences?: Json | null
          profile_picture_url?: string | null
          role?: string | null
          streak_days?: number | null
          timezone?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          deep_dive_preferences?: Json | null
          email?: string | null
          id?: string
          is_verified?: boolean | null
          last_active?: string | null
          max_partnerships?: number | null
          name?: string | null
          preferences?: Json | null
          profile_picture_url?: string | null
          role?: string | null
          streak_days?: number | null
          timezone?: string | null
          username?: string | null
        }
        Relationships: []
      }
      quarterly_reviews: {
        Row: {
          action_items: string[] | null
          completed_goals: number | null
          created_at: string | null
          goals_reviewed: string[] | null
          id: string
          new_goals_set: number | null
          next_review_date: string | null
          notes: string | null
          overall_satisfaction: number | null
          partnership_id: string
          quarter: number
          relationship_progress_rating: number | null
          review_date: string
          updated_at: string | null
          year: number
        }
        Insert: {
          action_items?: string[] | null
          completed_goals?: number | null
          created_at?: string | null
          goals_reviewed?: string[] | null
          id?: string
          new_goals_set?: number | null
          next_review_date?: string | null
          notes?: string | null
          overall_satisfaction?: number | null
          partnership_id: string
          quarter: number
          relationship_progress_rating?: number | null
          review_date: string
          updated_at?: string | null
          year: number
        }
        Update: {
          action_items?: string[] | null
          completed_goals?: number | null
          created_at?: string | null
          goals_reviewed?: string[] | null
          id?: string
          new_goals_set?: number | null
          next_review_date?: string | null
          notes?: string | null
          overall_satisfaction?: number | null
          partnership_id?: string
          quarter?: number
          relationship_progress_rating?: number | null
          review_date?: string
          updated_at?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "quarterly_reviews_partnership_id_fkey"
            columns: ["partnership_id"]
            isOneToOne: false
            referencedRelation: "partnerships"
            referencedColumns: ["id"]
          },
        ]
      }
      question_assignments: {
        Row: {
          created_at: string | null
          date: string
          difficulty_adjustments: number | null
          id: string
          partnership_id: string
          question_id: string
          revealed_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          difficulty_adjustments?: number | null
          id?: string
          partnership_id: string
          question_id: string
          revealed_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          difficulty_adjustments?: number | null
          id?: string
          partnership_id?: string
          question_id?: string
          revealed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "question_assignments_partnership_id_fkey"
            columns: ["partnership_id"]
            isOneToOne: false
            referencedRelation: "partnerships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_assignments_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "love_language_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_assignments_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      question_flags: {
        Row: {
          created_at: string | null
          description: string | null
          flag_type: string
          id: string
          question_id: string
          resolved: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          flag_type: string
          id?: string
          question_id: string
          resolved?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          flag_type?: string
          id?: string
          question_id?: string
          resolved?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_flags_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "love_language_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_flags_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_flags_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      question_pack_mappings: {
        Row: {
          created_at: string | null
          id: string
          pack_id: string | null
          question_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          pack_id?: string | null
          question_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          pack_id?: string | null
          question_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "question_pack_mappings_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "question_packs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_pack_mappings_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "love_language_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_pack_mappings_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      question_packs: {
        Row: {
          accent_color: string | null
          created_at: string | null
          description: string | null
          icon_name: string | null
          id: string
          name: string
        }
        Insert: {
          accent_color?: string | null
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          name: string
        }
        Update: {
          accent_color?: string | null
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          author_id: string | null
          card_type: string | null
          category: string | null
          context: string | null
          created_at: string | null
          difficulty_level: number | null
          id: string
          is_active: boolean | null
          language: string | null
          parent_id: string | null
          points: number | null
          score: number | null
          tags: Json | null
          text: string
          version: number | null
        }
        Insert: {
          author_id?: string | null
          card_type?: string | null
          category?: string | null
          context?: string | null
          created_at?: string | null
          difficulty_level?: number | null
          id: string
          is_active?: boolean | null
          language?: string | null
          parent_id?: string | null
          points?: number | null
          score?: number | null
          tags?: Json | null
          text: string
          version?: number | null
        }
        Update: {
          author_id?: string | null
          card_type?: string | null
          category?: string | null
          context?: string | null
          created_at?: string | null
          difficulty_level?: number | null
          id?: string
          is_active?: boolean | null
          language?: string | null
          parent_id?: string | null
          points?: number | null
          score?: number | null
          tags?: Json | null
          text?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "love_language_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      relationship_insights: {
        Row: {
          created_at: string
          generated_at: string
          id: string
          insights_data: Json
          partnership_id: string
          updated_at: string
          week_end: string
          week_start: string
        }
        Insert: {
          created_at?: string
          generated_at?: string
          id?: string
          insights_data: Json
          partnership_id: string
          updated_at?: string
          week_end: string
          week_start: string
        }
        Update: {
          created_at?: string
          generated_at?: string
          id?: string
          insights_data?: Json
          partnership_id?: string
          updated_at?: string
          week_end?: string
          week_start?: string
        }
        Relationships: []
      }
      self_discovery_responses: {
        Row: {
          category: string
          created_at: string | null
          id: string
          is_encrypted: boolean | null
          question_id: string
          question_text: string
          response_text: string
          response_value: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          is_encrypted?: boolean | null
          question_id: string
          question_text: string
          response_text: string
          response_value?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          is_encrypted?: boolean | null
          question_id?: string
          question_text?: string
          response_text?: string
          response_value?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "self_discovery_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_goals: {
        Row: {
          category: string
          completed_milestones: number | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          metadata: Json | null
          milestone_count: number | null
          partnership_id: string
          priority: string | null
          progress_percentage: number | null
          status: string | null
          tags: string[] | null
          target_date: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          completed_milestones?: number | null
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          metadata?: Json | null
          milestone_count?: number | null
          partnership_id: string
          priority?: string | null
          progress_percentage?: number | null
          status?: string | null
          tags?: string[] | null
          target_date?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          completed_milestones?: number | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          milestone_count?: number | null
          partnership_id?: string
          priority?: string | null
          progress_percentage?: number | null
          status?: string | null
          tags?: string[] | null
          target_date?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shared_goals_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_goals_partnership_id_fkey"
            columns: ["partnership_id"]
            isOneToOne: false
            referencedRelation: "partnerships"
            referencedColumns: ["id"]
          },
        ]
      }
      solo_engagement_stats: {
        Row: {
          created_at: string | null
          date: string
          id: string
          journal_entries_created: number | null
          memory_lane_sessions: number | null
          quick_fire_sessions: number | null
          reflections_completed: number | null
          self_discovery_sessions: number | null
          streak_days: number | null
          total_solo_time_minutes: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          journal_entries_created?: number | null
          memory_lane_sessions?: number | null
          quick_fire_sessions?: number | null
          reflections_completed?: number | null
          self_discovery_sessions?: number | null
          streak_days?: number | null
          total_solo_time_minutes?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          journal_entries_created?: number | null
          memory_lane_sessions?: number | null
          quick_fire_sessions?: number | null
          reflections_completed?: number | null
          self_discovery_sessions?: number | null
          streak_days?: number | null
          total_solo_time_minutes?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "solo_engagement_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      solo_reflection_questions: {
        Row: {
          category: string
          created_at: string | null
          difficulty_level: number | null
          id: string
          is_active: boolean | null
          question_text: string
        }
        Insert: {
          category: string
          created_at?: string | null
          difficulty_level?: number | null
          id?: string
          is_active?: boolean | null
          question_text: string
        }
        Update: {
          category?: string
          created_at?: string | null
          difficulty_level?: number | null
          id?: string
          is_active?: boolean | null
          question_text?: string
        }
        Relationships: []
      }
      solo_reflections: {
        Row: {
          answer_text: string
          category: string
          created_at: string | null
          id: string
          is_encrypted: boolean | null
          mood_tag: string | null
          question_id: string
          question_text: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          answer_text: string
          category: string
          created_at?: string | null
          id?: string
          is_encrypted?: boolean | null
          mood_tag?: string | null
          question_id: string
          question_text: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          answer_text?: string
          category?: string
          created_at?: string | null
          id?: string
          is_encrypted?: boolean | null
          mood_tag?: string | null
          question_id?: string
          question_text?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "solo_reflections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          completed_at: string | null
          created_at: string | null
          id: string
          is_completed: boolean | null
          progress: Json | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          progress?: Json | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          progress?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_interactions: {
        Row: {
          created_at: string | null
          date: string
          id: string
          interaction_type: string | null
          is_skipped: boolean | null
          question_id: string
          response_time: number | null
          user_id: string
          viewed_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          interaction_type?: string | null
          is_skipped?: boolean | null
          question_id: string
          response_time?: number | null
          user_id: string
          viewed_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          interaction_type?: string | null
          is_skipped?: boolean | null
          question_id?: string
          response_time?: number | null
          user_id?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_interactions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "love_language_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_interactions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_pack_selections: {
        Row: {
          created_at: string | null
          id: string
          is_selected: boolean | null
          pack_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_selected?: boolean | null
          pack_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_selected?: boolean | null
          pack_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_pack_selections_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "question_packs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_pack_selections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          created_at: string | null
          device_info: Json | null
          expires_at: string
          id: string
          is_active: boolean | null
          refresh_token: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device_info?: Json | null
          expires_at: string
          id?: string
          is_active?: boolean | null
          refresh_token?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          device_info?: Json | null
          expires_at?: string
          id?: string
          is_active?: boolean | null
          refresh_token?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vision_alignments: {
        Row: {
          alignment_score: number | null
          category: string
          created_at: string | null
          id: string
          partnership_id: string
          question_id: string
          scored_at: string | null
          updated_at: string | null
          user1_response: string | null
          user2_response: string | null
        }
        Insert: {
          alignment_score?: number | null
          category: string
          created_at?: string | null
          id?: string
          partnership_id: string
          question_id: string
          scored_at?: string | null
          updated_at?: string | null
          user1_response?: string | null
          user2_response?: string | null
        }
        Update: {
          alignment_score?: number | null
          category?: string
          created_at?: string | null
          id?: string
          partnership_id?: string
          question_id?: string
          scored_at?: string | null
          updated_at?: string | null
          user1_response?: string | null
          user2_response?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vision_alignments_partnership_id_fkey"
            columns: ["partnership_id"]
            isOneToOne: false
            referencedRelation: "partnerships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vision_alignments_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "love_language_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vision_alignments_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_discussions: {
        Row: {
          created_at: string | null
          id: string
          partnership_id: string
          question_id: string
          week_start_date: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          partnership_id: string
          question_id: string
          week_start_date: string
        }
        Update: {
          created_at?: string | null
          id?: string
          partnership_id?: string
          question_id?: string
          week_start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_discussions_partnership_id_fkey"
            columns: ["partnership_id"]
            isOneToOne: false
            referencedRelation: "partnerships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weekly_discussions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "love_language_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weekly_discussions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      active_deep_dive_sessions: {
        Row: {
          category: string | null
          current_part_index: number | null
          current_part_title: string | null
          id: string | null
          partnership_id: string | null
          progress_percentage: number | null
          started_at: string | null
          status: string | null
          template_title: string | null
          total_parts: number | null
          total_time_spent_minutes: number | null
        }
        Relationships: [
          {
            foreignKeyName: "deep_dive_sessions_partnership_fkey"
            columns: ["partnership_id"]
            isOneToOne: false
            referencedRelation: "partnerships"
            referencedColumns: ["id"]
          },
        ]
      }
      completed_deep_dive_sessions: {
        Row: {
          category: string | null
          completed_at: string | null
          id: string | null
          mood_after: number | null
          mood_before: number | null
          mood_improvement: number | null
          partnership_id: string | null
          satisfaction_rating: number | null
          template_title: string | null
          themes: string[] | null
          total_time_spent_minutes: number | null
        }
        Relationships: [
          {
            foreignKeyName: "deep_dive_sessions_partnership_fkey"
            columns: ["partnership_id"]
            isOneToOne: false
            referencedRelation: "partnerships"
            referencedColumns: ["id"]
          },
        ]
      }
      love_language_profiles_view: {
        Row: {
          created_at: string | null
          id: string | null
          last_assessment: string | null
          preferences: Json | null
          primary_language: string | null
          primary_language_name: string | null
          scores: Json | null
          secondary_language: string | null
          secondary_language_name: string | null
          updated_at: string | null
          user_email: string | null
          user_id: string | null
          user_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "love_language_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      love_language_questions: {
        Row: {
          card_type: string | null
          category: string | null
          context: string | null
          difficulty_level: number | null
          id: string | null
          love_language_name: string | null
          points: number | null
          tags: Json | null
          text: string | null
        }
        Insert: {
          card_type?: string | null
          category?: string | null
          context?: string | null
          difficulty_level?: number | null
          id?: string | null
          love_language_name?: never
          points?: number | null
          tags?: Json | null
          text?: string | null
        }
        Update: {
          card_type?: string | null
          category?: string | null
          context?: string | null
          difficulty_level?: number | null
          id?: string | null
          love_language_name?: never
          points?: number | null
          tags?: Json | null
          text?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      accept_partnership_request: {
        Args: { request_id: string }
        Returns: string
      }
      assign_daily_question: {
        Args: { partnership_id: string }
        Returns: string
      }
      assign_daily_question_atomic: {
        Args: { p_date?: string; p_partnership_id: string }
        Returns: string
      }
      assign_daily_questions: {
        Args: {
          dry_run?: boolean
          force_reassignment?: boolean
          process_specific_partnership?: string
        }
        Returns: {
          assignment_date: string
          partnership_id: string
          question_id: string
          selection_reason: string
        }[]
      }
      block_partnership: {
        Args: {
          p_blocked_id: string
          p_blocker_id: string
          p_partnership_id: string
          p_reason?: string
        }
        Returns: undefined
      }
      complete_memory_card: {
        Args: {
          p_card_id: string
          p_partner_id: string
          p_partner_response?: string
          p_photo_url?: string
          p_session_id: string
          p_user_id: string
          p_user_response: string
        }
        Returns: {
          card_id: string
          completed_at: string
          id: string
          partner_id: string
          partner_response: string | null
          photo_url: string | null
          points_earned: number
          session_id: string
          user_id: string
          user_response: string
        }
        SetofOptions: {
          from: "*"
          to: "memory_lane_completions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      get_love_language_compatibility: {
        Args: { user1_uuid: string; user2_uuid: string }
        Returns: {
          compatibility_notes: string[]
          compatibility_score: number
          shared_primary: boolean
          shared_secondary: boolean
        }[]
      }
      get_mixed_questions_by_mode: {
        Args: { p_limit?: number; p_mode: string; p_mode_ratio?: number }
        Returns: {
          card_type: string
          category: string
          context: string
          difficulty_level: number
          id: string
          points: number
          tags: Json
          text: string
        }[]
      }
      get_mood_trends: {
        Args: { days_back?: number; user_uuid: string }
        Returns: {
          avg_energy_level: number
          avg_overall_mood: number
          avg_relationship_satisfaction: number
          avg_stress_level: number
          checkin_count: number
          trend_date: string
        }[]
      }
      get_or_create_memory_session: {
        Args: { p_partnership_id: string }
        Returns: {
          created_at: string
          current_phase: string
          id: string
          last_played_at: string
          partnership_id: string
          settings: Json
          started_at: string
          total_score: number
          unlocked_phases: string[]
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "memory_lane_sessions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      get_questions_by_mode: {
        Args: { p_include_regular?: boolean; p_limit?: number; p_mode: string }
        Returns: {
          author_id: string | null
          card_type: string | null
          category: string | null
          context: string | null
          created_at: string | null
          difficulty_level: number | null
          id: string
          is_active: boolean | null
          language: string | null
          parent_id: string | null
          points: number | null
          score: number | null
          tags: Json | null
          text: string
          version: number | null
        }[]
        SetofOptions: {
          from: "*"
          to: "questions"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_streak: { Args: { user_uuid: string }; Returns: number }
      get_todays_mood_checkin: {
        Args: { user_uuid: string }
        Returns: {
          created_at: string
          energy_level: number
          id: string
          mood_note: string
          mood_tags: string[]
          overall_mood: number
          relationship_satisfaction: number
          stress_level: number
        }[]
      }
      get_user_love_language_profile: {
        Args: { user_uuid: string }
        Returns: {
          id: string
          last_assessment: string
          preferences: Json
          primary_language: string
          primary_language_name: string
          scores: Json
          secondary_language: string
          secondary_language_name: string
          user_id: string
        }[]
      }
      refresh_user_streak: { Args: { user_uuid: string }; Returns: undefined }
      save_love_language_profile: {
        Args: {
          preferences_json?: Json
          primary_lang: string
          scores_json?: Json
          secondary_lang?: string
          user_uuid: string
        }
        Returns: string
      }
      update_streak_history: {
        Args: { points?: number; questions_count?: number; user_uuid: string }
        Returns: undefined
      }
    }
    Enums: {
      adventure_category:
        | "date_adventure"
        | "skill_sharing"
        | "local_exploration"
        | "bucket_list"
        | "challenge"
        | "seasonal_activity"
        | "fitness_together"
        | "creative_project"
        | "food_adventure"
        | "travel_planning"
      adventure_status:
        | "planned"
        | "scheduled"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "postponed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      adventure_category: [
        "date_adventure",
        "skill_sharing",
        "local_exploration",
        "bucket_list",
        "challenge",
        "seasonal_activity",
        "fitness_together",
        "creative_project",
        "food_adventure",
        "travel_planning",
      ],
      adventure_status: [
        "planned",
        "scheduled",
        "in_progress",
        "completed",
        "cancelled",
        "postponed",
      ],
    },
  },
} as const