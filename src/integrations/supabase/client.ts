import { createClient } from "@supabase/supabase-js";

// These fallback values are public client credentials. They keep Lovable previews
// operational when the local `.env.local` file is not available in the cloud build.
// Privileged credentials such as service_role must never be added here.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "https://gktijtndufrrbzfpiskf.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_lEcEGt7hU84FXbQA_a6XgA_v9tuFFXY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
