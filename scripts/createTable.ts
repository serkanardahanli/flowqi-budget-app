import { createClient } from '@supabase/supabase-js';

// Supabase-configuratie
const supabaseUrl = 'https://xvhnyvpgifqkmwtmxqjn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2aG55dnBnaWZxa213dG14cWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMTQzOTksImV4cCI6MjA1NzY5MDM5OX0.R1AvSRA2GfEZjcXusoJyyRvLd9rCBGj8tGMRp8PpQGk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
  try {
    // Probeer een simpele query uit te voeren
    const { data, error } = await supabase.from('budgets').select('*').limit(1);
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.log('De tabel "budgets" bestaat nog niet. Maak deze eerst aan in het SQL-dashboard.');
      } else {
        console.error('Error testing connection:', error);
      }
      return;
    }
    
    console.log('Verbinding met Supabase succesvol!');
    console.log('Gegevens uit budgets tabel:', data);
  } catch (error) {
    console.error('Onverwachte fout:', error);
  }
}

testSupabaseConnection();