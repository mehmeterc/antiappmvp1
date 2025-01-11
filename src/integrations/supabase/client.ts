import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dbmoamofckecdhxgzgfi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRibW9hbW9mY2tlY2RoeGd6Z2ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ5OTg0MDAsImV4cCI6MjAyMDU3NDQwMH0.JqYXuXqm6T4nQQYDAJOQsKQvnNX-JqZGxXHVP7M_KO8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});