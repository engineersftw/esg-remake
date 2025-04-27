import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const { SUPABASE_URL, SUPABASE_KEY } = process.env;

console.log('SUPABASE_URL', SUPABASE_URL);
console.log('SUPABASE_KEY', SUPABASE_KEY);

// Create a single supabase client for interacting with your database
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;
