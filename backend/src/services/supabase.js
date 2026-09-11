import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project-ref')
  );
};

// Create Supabase client if credentials are present, or a safe fallback proxy
let client = null;

if (isSupabaseConfigured()) {
  try {
    client = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    console.log(`🔗 Supabase PostgreSQL Connected: ${supabaseUrl}`);
  } catch (err) {
    console.warn(`⚠️ Supabase client initialization warning:`, err.message);
  }
} else {
  console.log(`ℹ️ Supabase credentials not set or placeholder in .env. Running on local JSON persistence engine.`);
}

export const supabase = client;
export default supabase;
