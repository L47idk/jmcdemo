import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Simple check for service role key if it starts with 'service_role' or similar
// (Most Supabase keys are JWTs, so we can't easily check without atob, but we'll skip it for now to avoid SyntaxErrors)

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Use placeholders only if not configured to prevent crash, but we'll check isSupabaseConfigured before use
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);
