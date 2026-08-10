import { createClient } from "@supabase/supabase-js";

export const getSupabaseClient = () => {
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseServiceKey = 
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || 
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

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

  // If user passed just the project ref (e.g. drtjfjspisciyplhyfby), convert to full URL
  if (!supabaseUrl.startsWith("http://") && !supabaseUrl.startsWith("https://")) {
    supabaseUrl = `https://${supabaseUrl}.supabase.co`;
  }

  return createClient(supabaseUrl, supabaseServiceKey);
};
