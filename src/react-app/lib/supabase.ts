import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://rcskqcorfmmeignsgcuj.supabase.co";
const anonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjc2txY29yZm1tZWlnbnNnY3VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyODkzMTIsImV4cCI6MjA3Nzg2NTMxMn0.TAT9GudmVgEn5MsrxHyi8DcwbYGYXHDKpodlHfxggZI";

export const supabase: SupabaseClient = createClient(url, anonKey);
