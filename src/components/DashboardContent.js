// src/components/DashboardContent.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

const DashboardContent = () => {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [summaryData, setSummaryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const months = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", 
    "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"
  ];

  // Alleen de hoofdcategorieën die we in het dashboard willen tonen
  const mainCategories = [
    { code: '4000', description: 'Bruto Loon', color: 'blue' },
    { code: '4300', description: 'Personeelsopleiding en -ontwikkeling', color: 'blue' },
    { code: '4400', description: 'Marketingkosten', color: 'blue' },
    { code: '4500', description: 'Klantondersteuning', color: 'blue' },
    { code: '4600', description: 'R&D Kosten', color: 'blue' },
    { code: '4700', description: 'Algemene en administratiekosten', color: 'blue' },
    { code: '4800', description: 'Reiskosten', color: 'blue' },
    { code: '4810', description: 'Reizen voor klanten (CAC)', color: 'green' },
    { code: '4820', description: 'Reizen voor marketing', color: 'green' },
    { code: '4830', description: 'Reizen voor development', color: 'green' },
    { code: '4840', description: 'Autokosten', color: 'green' }
  ];

  useEffect(() => {
    fetchSummaryData();
  }, [selectedYear]);

  const fetchSummaryData = async () => {
    setIsLoading(true);
    try {
      // Haal alle uitgaven op voor het geselecteerde jaar
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('year', selectedYear);
      
      if (error) throw error;
      
      // Initialiseer de samenvattingsdata met nullen
      const initialSummary = mainCategories.map(category => ({
        ...category,
        amounts: Array(12).fill(0)
      }));
      
      // Verwerk alleen de gegevens voor de hoofdcategorieën
      if (data && data.length > 0) {
        data.forEach(expense => {
          // Zoek of deze uitgave rechtstreeks een van onze hoofdcategorieën is
          const categoryIndex = initialSummary.findIndex(cat => cat.code === expense.code);
          if (categoryIndex !== -1) {
            initialSummary[categoryIndex].amounts[expense.month] += expense.amount;
          }
        });
      }
      
      setSummaryData(initialSummary);
    } catch (error) {
      console.error('Error fetching summary data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', margin: 0 }}>Kosten Dashboard</h1>
        <div>
          <Link href="/expenses" style={{ textDecoration: 'none', color: '#0070f3', marginRight: '20px' }}>
            Ga naar Uitgavenbeheer
          </Link>
        </div>
      </div>
      
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
        <label style={{ marginRight: '10px' }}>Jaar:</label>
        <select 
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          style={{ padding: '5px 10px', borderRadius: '4px', border: '1px solid #ddd', marginRight: '20px' }}
        >
          {[2023, 2024, 2025, 2026, 2027].map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        
        <button 
          onClick={() => window.print()}
          style={{ 
            padding: '5px 15px', 
            background: '#f0f0f0', 
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Exporteren
        </button>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>Kostenstructuur</h2>
        
        {isLoading ? (
          <div style={{ padding: '30px', textAlign: 'center', background: '#f9f9f9' }}>
            <div>Gegevens laden...</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #eee' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Code</th>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Omschrijving</th>
                  {months.map(month => (
                    <th key={month} style={{ padding: '10px', textAlign: 'right', borderBottom: '2px solid #ddd' }}>{month}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {summaryData.map((category, index) => (
                  <tr 
                    key={category.code}
                    style={{ 
                      background: index % 2 === 0 ? '#fff' : '#f9f9f9',
                      borderBottom: '1px solid #eee'
                    }}
                  >
                    <td style={{ 
                      padding: '8px 10px', 
                      color: category.color === 'blue' ? '#4285F4' : 
                            category.color === 'green' ? '#34A853' : '#333',
                      fontWeight: category.color === 'blue' ? 'bold' : 'normal'
                    }}>
                      {category.code}
                    </td>
                    <td style={{ 
                      padding: '8px 10px',
                      color: category.color === 'blue' ? '#4285F4' : 
                            category.color === 'green' ? '#34A853' : '#333',
                      fontWeight: category.color === 'blue' ? 'bold' : 'normal'
                    }}>
                      {category.description}
                    </td>
                    {category.amounts.map((amount, i) => (
                      <td key={i} style={{ 
                        padding: '8px 10px', 
                        textAlign: 'right',
                        color: amount < 0 ? '#DB4437' : '#333'
                      }}>
                        {amount !== 0 ? amount.toFixed(2) : '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div>
        <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>Geplande vs. Werkelijke Kosten</h2>
        <div style={{ 
          padding: '20px', 
          background: '#f9f9f9', 
          borderRadius: '4px',
          color: '#666',
          fontStyle: 'italic'
        }}>
          Deze sectie zal worden geïmplementeerd wanneer integratie met Exact Online beschikbaar is.
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;