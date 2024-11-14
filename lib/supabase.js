import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jcoqmsqlgqfyffuymfdq.supabase.co'; // Supabase projenizin URL'si
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjb3Ftc3FsZ3FmeWZmdXltZmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg2NjYwMjEsImV4cCI6MjA0NDI0MjAyMX0.w_W0dliw7rxzNuoYOFtGZAXFaREwh4vjeOi2AKC2APg'; // Supabase anonim anahtarınız
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
