
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://ajxeqiiumzuqfljbkhln.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqeGVxaWl1bXp1cWZsamJraGxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MjgwNDEsImV4cCI6MjA3MzEwNDA0MX0.CmJggZy3NJOoyq4xm5zxnXB0AEdP4Jz-uON7_BQCuyA";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;