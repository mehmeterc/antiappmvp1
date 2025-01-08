import { createRoot } from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import App from './App';
import './index.css';

const supabase = createClient(
  "https://dbmoamofckecdhxgzgfi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRibW9hbW9mY2tlY2RoeGd6Z2ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5MjYxNDQsImV4cCI6MjA1MDUwMjE0NH0.WZh61CB9OYbbyWailqg3LQLlJdNbh-ai5hQn4CmvI-E"
);

const root = createRoot(document.getElementById('root')!);

root.render(
  <SessionContextProvider supabaseClient={supabase}>
    <App />
  </SessionContextProvider>
);