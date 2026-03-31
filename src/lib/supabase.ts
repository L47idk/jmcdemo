import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Helper to check if the key is a service_role key
const isServiceRoleKey = (key: string) => {
  try {
    const parts = key.split('.');
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1]));
    return payload.role === 'service_role';
  } catch (e) {
    return false;
  }
};

if (typeof window !== 'undefined' && isServiceRoleKey(supabaseAnonKey)) {
  console.error(
    "CRITICAL SECURITY WARNING: You are using a Supabase 'service_role' key in the browser. " +
    "This key has full administrative access to your database and MUST NOT be exposed to users. " +
    "Please replace NEXT_PUBLIC_SUPABASE_ANON_KEY with your public 'anon' key in the environment variables."
  );
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Use placeholders only if not configured to prevent crash, but we'll check isSupabaseConfigured before use
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);
