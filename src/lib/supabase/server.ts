import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client for API routes (no cookies dependency)
export function createServerClient() {
  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Admin client with service role key for server-side operations
export function createAdminClient() {
  return createClient<Database>(supabaseUrl, supabaseServiceKey)
}