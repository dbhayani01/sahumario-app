/**
 * Supabase client singleton.
 * Used for Auth (login, signup, session management) and database queries.
 *
 * Environment variables required:
 *   REACT_APP_SUPABASE_URL      — Project URL from Supabase dashboard
 *   REACT_APP_SUPABASE_ANON_KEY — Public anon key (safe to expose to browser)
 */
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);
