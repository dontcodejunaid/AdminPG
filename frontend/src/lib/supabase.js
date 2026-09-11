import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://foeyyhjcenfkqlyibmvw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvZXl5aGpjZW5ma3FseWlibXZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxMjExNDAsImV4cCI6MjEwNDY5NzE0MH0.0GOwfl1wEfK8gjUSaTKgceRy9ce5IR6CCmauUHxDYjI';

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
