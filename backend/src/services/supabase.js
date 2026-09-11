import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://foeyyhjcenfkqlyibmvw.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvZXl5aGpjZW5ma3FseWlibXZ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTEyMTE0MCwiZXhwIjoyMTA0Njk3MTQwfQ.Q6Z3w1AGA-ZL3DUm-mTQ54lOe8cAcxQs99QGlsrQeTs';

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
