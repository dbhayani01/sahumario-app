/**
 * Supabase client singleton.
 * Used for Auth (login, signup, session management) and database queries.
 *
 * Environment variables required:
 *   REACT_APP_SUPABASE_URL      — Project URL from Supabase dashboard
 *   REACT_APP_SUPABASE_ANON_KEY — Public anon key (safe to expose to browser)
 *
 * If either var is missing (e.g. env not yet configured) the app renders
 * normally but auth/DB calls will be no-ops — preventing a blank-page crash.
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.REACT_APP_SUPABASE_URL;
const key = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.warn(
    "[Supabase] REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are not set. " +
      "Auth and order sync will not work until these are configured."
  );
}

// Fall back to placeholder values so createClient never throws at module load time.
// Real calls will fail gracefully with network errors instead of crashing the app.
export const supabase = createClient(
  url || "https://placeholder.supabase.co",
  key || "placeholder_anon_key"
);
