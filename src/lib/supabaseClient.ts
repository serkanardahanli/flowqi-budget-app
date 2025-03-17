// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xvhnyvpgifqkmwtmxqjn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2aG55dnBnaWZxa213dG14cWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMTQzOTksImV4cCI6MjA1NzY5MDM5OX0.R1AvSRA2GfEZjcXusoJyyRvLd9rCBGj8tGMRp8PpQGk';
export const supabase = createClient(supabaseUrl, supabaseKey);

// Haal uitgaven op
export async function getExpenses() {
  try {
    // Voor echte implementatie: vervang dit door een query naar je uitgaven tabel
    const { data, error } = await supabase
      .from('expenses')
      .select('*');
    
    if (error) throw error;

    // In een echte implementatie zou je deze berekeningen doen op basis van echte data
    // Dit is mockdata voor demonstratie
    return {
      total: 38500,
      monthly: [
        { month: 'Jan', amount: 3200 },
        { month: 'Feb', amount: 2800 },
        { month: 'Mar', amount: 3400 },
        { month: 'Apr', amount: 3650 },
        { month: 'May', amount: 3200 },
        { month: 'Jun', amount: 3100 }
      ],
      categories: [
        { name: 'Personeel', value: 18000 },
        { name: 'Kantoor', value: 7500 },
        { name: 'Marketing', value: 5000 },
        { name: 'Software', value: 4500 },
        { name: 'Overig', value: 3500 }
      ]
    };
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return null;
  }
}

// Haal inkomsten op
export async function getRevenue() {
  try {
    // Voor echte implementatie: vervang dit door een query naar je inkomsten tabel
    const { data, error } = await supabase
      .from('revenue')
      .select('*');
    
    if (error) throw error;

    // Mockdata voor demonstratie
    return {
      total: 62500,
      monthly: [
        { month: 'Jan', amount: 9500 },
        { month: 'Feb', amount: 9800 },
        { month: 'Mar', amount: 10200 },
        { month: 'Apr', amount: 10500 },
        { month: 'May', amount: 11200 },
        { month: 'Jun', amount: 11300 }
      ],
      categories: [
        { name: 'Product A', value: 28000 },
        { name: 'Product B', value: 15500 },
        { name: 'Service C', value: 12000 },
        { name: 'Consulting', value: 7000 }
      ]
    };
  } catch (error) {
    console.error('Error fetching revenue:', error);
    return null;
  }
}