import { createClient } from "@supabase/supabase-js";

export const useSupabase = () => {
  const config = useRuntimeConfig();

  const supabaseUrl: string = config.public.supabaseUrl;
  const supabaseKey: string = config.public.supabaseKey;

  const supabase = createClient(supabaseUrl, supabaseKey);

  return supabase;
};
