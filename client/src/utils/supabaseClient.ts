import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database.types'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please create a .env.local file with:')
  console.error('  VITE_SUPABASE_URL=your_project_url')
  console.error('  VITE_SUPABASE_ANON_KEY=your_anon_key')
  throw new Error('Missing required Supabase configuration')
}

export const supabase = createClient<Database>(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'scratchypad-auth',
  },
})

// Export a helper to check if client is configured
export const isSupabaseConfigured = Boolean(url && anonKey)