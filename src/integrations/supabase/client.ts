// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://krrrvjfkwoqhjjlzrkna.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtycnJ2amZrd29xaGpqbHpya25hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNTg3NzMsImV4cCI6MjA2MDgzNDc3M30.hUeJ0nbkOk5qx8KyyupBL7ivSFZFzsvoiMUzz6-2q7k";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);