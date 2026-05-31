import { createClient } from "@supabase/supabase-js";

export const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = 
    process.env.SUPABASE_SERVICE_ROLE_KEY || 
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (
    !supabaseUrl || 
    !supabaseServiceKey || 
    supabaseUrl === "YOUR_SUPABASE_URL_HERE" || 
    supabaseServiceKey === "YOUR_SUPABASE_SERVICE_ROLE_KEY_HERE"
  ) {
    throw new Error(
      "Supabase credentials are not configured. Please define NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file."
    );
  }

  return createClient(supabaseUrl, supabaseServiceKey);
};
