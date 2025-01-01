import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://dbmoamofckecdhxgzgfi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRibW9hbW9mY2tlY2RoeGd6Z2ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5MjYxNDQsImV4cCI6MjA1MDUwMjE0NH0.WZh61CB9OYbbyWailqg3LQLlJdNbh-ai5hQn4CmvI-E";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);