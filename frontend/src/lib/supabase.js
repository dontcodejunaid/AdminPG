import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project-ref')
  );
};

let client = null;
if (isSupabaseConfigured()) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.warn('Frontend Supabase init warning:', e);
  }
}

export const supabase = client;
export default supabase;
