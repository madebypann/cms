require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
  throw new Error('SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, dan SUPABASE_ANON_KEY wajib diisi di .env');
}

// client dengan service_role -> untuk operasi database (bypass RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// client dengan anon key -> khusus untuk verifikasi token login
const supabaseAuthClient = createClient(supabaseUrl, supabaseAnonKey);

module.exports = { supabaseAdmin, supabaseAuthClient };