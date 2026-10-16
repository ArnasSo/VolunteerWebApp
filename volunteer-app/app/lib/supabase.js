import { createClient } from "@supabase/supabase-js";
// we reading our env variables below - taken from .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
// calling supabase createclient function with our env as arguments
export const supabase = createClient(supabaseUrl, supabaseKey);