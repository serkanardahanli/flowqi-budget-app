// src/pages/sales.js
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabaseClient';

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2024);

  // Voorkom hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Haal verkopen op
  useEffect(() => {
    if (isClient) {
      fetchSales();
    }
  }, [isClient, selectedYear]);

  const fetchSales = async () => {
    setIsLoading(true);
    try {
      // Hier zou normaal gesproken een query naar je 'sales' tabel komen
      // Voor nu simuleren we dit met dummy data omdat de 'sales' tabel nog niet bestaat
      // in je Supabase schema (volgens de gedeelde code)
      
      setTimeout(() => {
        const dummySales = [
          { id: 1, date: '2024-01-15', customer: 'Bedrijf A', description: 'Consultancy diensten', amount: 2500.00 },
          { id: 2, date: '2024-02-22', customer: 'Bedrijf B', description: 'Software licentie', amount: 1800.00 },
          { id: 3, date: '2024-03-05', customer: 'Bedrijf C', description: 'Onderhoud', amount: 750.00 }
        ];
        
        setSales(dummySales);
        setIsLoading(false);
      }, 1000);
      
      // Wanneer je een 'sales' tabel hebt, gebruik je onderstaande code:
      /*
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('year', selectedYear)
        .order('date', { ascending: false });
        
      if (error) throw error;
      
      setSales(data || []);
      */
    } catch (error) {
      console.error('Error fetching sales:', error);
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <Layout>
      <div style={{
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px',
        color: '#333'
      }}>
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '600', margin: '0 0 8px 0' }}>Verkoopoverzicht</h1>
            <p style={{ fontSize: '16px', color: '#666', margin: 0 }}>Beheer en registreer uw verkopen</p>
          </div>
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              style={{ 
                padding: '8px 16px', 
                borderRadius: '6px', 
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
            >
              {[2023, 2024, 2025].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            
            <button 
              style={{ 
                padding: '8px 16px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
              onClick={() => {
                // Hier later functionaliteit voor het toevoegen van verkopen
                alert('Functie voor het toevoegen van verkopen wordt binnenkort geïmplementeerd');
              }}
            >
              Nieuwe verkoop
            </button>
          </div>
        </header>
        
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <p>Data laden...</p>
          </div>
        ) : (
          <div>
            {sales.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '50px 0',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <p>Geen verkopen gevonden voor {selectedYear}</p>
                <button
                  style={{ 
                    padding: '8px 16px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    marginTop: '16px',
                    cursor: 'pointer'
                  }}
                >
                  Voeg je eerste verkoop toe
                </button>
              </div>
            ) : (
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                backgroundColor: 'white',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <thead>
                  <tr style={{ 
                    backgroundColor: '#f9fafb',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Datum</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Klant</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Beschrijving</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Bedrag</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center' }}>Acties</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((sale) => (
                    <tr key={sale.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px 16px' }}>{new Date(sale.date).toLocaleDateString('nl-NL')}</td>
                      <td style={{ padding: '12px 16px' }}>{sale.customer}</td>
                      <td style={{ padding: '12px 16px' }}>{sale.description}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>€{sale.amount.toFixed(2)}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <button style={{ 
                          padding: '4px 8px',
                          backgroundColor: 'transparent',
                          color: '#2563eb',
                          border: '1px solid #2563eb',
                          borderRadius: '4px',
                          marginRight: '8px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}>Bewerken</button>
                        <button style={{ 
                          padding: '4px 8px',
                          backgroundColor: 'transparent',
                          color: '#ef4444',
                          border: '1px solid #ef4444',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}>Verwijderen</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}