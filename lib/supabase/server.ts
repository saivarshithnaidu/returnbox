import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

// Server-side client with service role key — bypasses RLS
// Use ONLY in API routes and server components
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
