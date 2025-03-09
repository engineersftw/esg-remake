import { createClient } from "@supabase/supabase-js";

export const useSupabase = () => {
  const config = useRuntimeConfig();

  const supabaseUrl: string = config.public.SUPABASE_URL;
  const supabaseKey: string = config.public.SUPABASE_KEY;

  const supabase = createClient(supabaseUrl, supabaseKey);

  return supabase;
};
