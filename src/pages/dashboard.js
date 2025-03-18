// src/pages/dashboard.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';
import Layout from '../components/Layout';

export default function ExecutiveDashboard() {
  const [isClient, setIsClient] = useState(false);
  const [yearData, setYearData] = useState({
    revenue: 0,
    expenses: 0,
    profit: 0,
    margin: 0
  });
  const [selectedYear, setSelectedYear] = useState(2024);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryTotals, setCategoryTotals] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [trends, setTrends] = useState({
    revenue: { percent: 0, isUp: true },
    expenses: { percent: 0, isUp: true },
    profit: { percent: 0, isUp: true },
    margin: { percent: 0, isUp: true }
  });
  const [revenueData, setRevenueData] = useState({
    current: 0,
    previous: 0
  });
  const [showRevenueInput, setShowRevenueInput] = useState(false);
  const [inputRevenue, setInputRevenue] = useState('');

  // Voorkom hydration issues door client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Haal data op wanneer het jaar verandert
  useEffect(() => {
    if (isClient) {
      fetchDashboardData();
    }
  }, [selectedYear, isClient]);

  const fetchRevenueData = async () => {
    try {
      // Probeer omzet te halen uit de 'revenue' tabel
      const { data: currentYearRevenue, error: currentError } = await supabase
        .from('revenue')
        .select('*')
        .eq('year', selectedYear);
      
      if (currentError) throw currentError;
      
      const { data: previousYearRevenue, error: previousError } = await supabase
        .from('revenue')
        .select('*')
        .eq('year', selectedYear - 1);
      
      if (previousError) throw previousError;
      
      // Gebruik de gevonden waarden of 0 als fallback
      const currentAmount = currentYearRevenue && currentYearRevenue.length > 0 
        ? currentYearRevenue[0].amount 
        : 0;
        
      const previousAmount = previousYearRevenue && previousYearRevenue.length > 0 
        ? previousYearRevenue[0].amount 
        : 0;
      
      console.log('Revenue data fetched:', { current: currentAmount, previous: previousAmount });
      
      setRevenueData({
        current: currentAmount,
        previous: previousAmount
      });
      
      return { current: currentAmount, previous: previousAmount };
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      return { current: 0, previous: 0 };
    }
  };

  // Functie om verkoopgegevens op te halen
  const fetchSalesData = async () => {
    try {
      // Haal verkoopgegevens op uit je 'sales' of 'invoices' tabel
      const { data: salesData, error: salesError } = await supabase
        .from('sales') // Vervang 'sales' door de naam van je verkooptabel
        .select('*')
        .gte('due_date', `${selectedYear}-01-01`) // Neem alleen verkopen van het geselecteerde jaar
        .lt('due_date', `${selectedYear + 1}-01-01`);
      
      if (salesError) throw salesError;
      
      // Haal abonnementsgegevens op (MRR)
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions') // Vervang 'subscriptions' door de naam van je abonnementsentabel
        .select('*')
        .eq('active', true); // Neem alleen actieve abonnementen
      
      if (subscriptionError) throw subscriptionError;
      
      // Bereken totale omzet uit verkopen
      let salesRevenue = 0;
      if (salesData && salesData.length > 0) {
        salesRevenue = salesData.reduce((total, sale) => total + (sale.amount || 0), 0);
      }
      
      // Bereken omzet uit abonnementen (MRR * 12 maanden)
      let subscriptionRevenue = 0;
      if (subscriptionData && subscriptionData.length > 0) {
        const mrr = subscriptionData.reduce((total, sub) => total + (sub.monthly_amount || 0), 0);
        subscriptionRevenue = mrr * 12; // Jaarlijkse abonnementsomzet
      }
      
      // Totale omzet berekenen
      const totalRevenue = salesRevenue + subscriptionRevenue;
      
      console.log('Sales revenue:', salesRevenue);
      console.log('Subscription revenue:', subscriptionRevenue);
      console.log('Total revenue:', totalRevenue);
      
      return totalRevenue;
    } catch (error) {
      console.error('Error fetching sales data:', error);
      return 0;
    }
  };

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Haal uitgaven op
      const { data: currentYearData, error: currentYearError } = await supabase
        .from('expenses')
        .select('*')
        .eq('year', selectedYear);
      
      if (currentYearError) throw currentYearError;

      const { data: previousYearData, error: previousYearError } = await supabase
        .from('expenses')
        .select('*')
        .eq('year', selectedYear - 1);
      
      if (previousYearError) throw previousYearError;

      // Haal omzetgegevens op uit revenue tabel
      const revData = await fetchRevenueData();
      
      // Haal verkoopgegevens op
      const salesRevenue = await fetchSalesData();
      
      // Als er verkoopgegevens zijn, gebruik die in plaats van de handmatig ingevoerde omzet
      if (salesRevenue > 0) {
        revData.current = salesRevenue;
      }

      // Verwerk de data voor het dashboard
      processExpenseData(currentYearData, previousYearData, revData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processExpenseData = (currentYearData, previousYearData, revenueInfo) => {
    // Definieer de hoofdcategorieën met hun codes
    const mainCategories = [
      { code: '4000', description: 'Personeelskosten' },
      { code: '4400', description: 'Marketing' },
      { code: '4600', description: 'R&D' },
      { code: '4700', description: 'Kantoorkosten' },
      { code: '4500', description: 'Klantondersteuning' },
      { code: '4800', description: 'Reiskosten' }
    ];

    // Verwerk huidige jaar data
    const currentYearCategories = {};
    let currentYearTotalExpenses = 0;

    // Initialiseer de categorieën
    mainCategories.forEach(cat => {
      currentYearCategories[cat.code] = {
        category: cat.description,
        amount: 0,
        monthlyAmounts: Array(12).fill(0)
      };
    });

    // Verwerk alle uitgaven van het huidige jaar
    currentYearData.forEach(expense => {
      // Zoek welke hoofdcategorie deze uitgave behoort
      const categoryCode = expense.code.substring(0, 2) + '00';
      
      // Als we deze categorie kennen, tel het bedrag op
      if (currentYearCategories[categoryCode]) {
        // Uitgaven worden negatief opgeslagen, daarom nemen we de absolute waarde
        const amount = Math.abs(expense.amount);
        currentYearCategories[categoryCode].amount += amount;
        
        // Voeg ook toe aan de maandelijkse uitgaven als er een maand is gespecificeerd
        if (expense.month >= 0 && expense.month < 12) {
          currentYearCategories[categoryCode].monthlyAmounts[expense.month] += amount;
        }
        
        // Tel op bij totale uitgaven
        currentYearTotalExpenses += amount;
      }
    });

    // Verwerk vorig jaar data voor trends
    const previousYearCategories = {};
    let previousYearTotalExpenses = 0;

    // Initialiseer de categorieën voor vorig jaar
    mainCategories.forEach(cat => {
      previousYearCategories[cat.code] = {
        category: cat.description,
        amount: 0
      };
    });

    // Verwerk alle uitgaven van het vorige jaar
    previousYearData.forEach(expense => {
      const categoryCode = expense.code.substring(0, 2) + '00';
      
      if (previousYearCategories[categoryCode]) {
        const amount = Math.abs(expense.amount);
        previousYearCategories[categoryCode].amount += amount;
        previousYearTotalExpenses += amount;
      }
    });

    // Bereken trends en percentages
    const categoriesArray = Object.keys(currentYearCategories).map(code => {
      const currentAmount = currentYearCategories[code].amount;
      const previousAmount = previousYearCategories[code]?.amount || 0;
      
      // Bereken de verandering in percentage
      let changePercent = 0;
      if (previousAmount > 0) {
        changePercent = ((currentAmount - previousAmount) / previousAmount) * 100;
      }
      
      return {
        ...currentYearCategories[code],
        percent: currentYearTotalExpenses > 0 ? (currentAmount / currentYearTotalExpenses) * 100 : 0,
        change: changePercent,
        previousAmount
      };
    });

    // Sorteren op bedrag (hoogste eerst)
    categoriesArray.sort((a, b) => b.amount - a.amount);
    
    // Update state met verwerkte data
    setCategoryTotals(categoriesArray);
    
    // Bereken maandelijkse data voor grafiek
    const monthlyExpenseData = [];
    for (let i = 0; i < 12; i++) {
      let monthTotal = 0;
      Object.values(currentYearCategories).forEach(cat => {
        monthTotal += cat.monthlyAmounts[i];
      });
      monthlyExpenseData.push(monthTotal);
    }
    setMonthlyData(monthlyExpenseData);
    
    // Gebruik de doorgegeven omzetgegevens, fallback naar schatting indien nodig
    const currentRevenue = revenueInfo.current || currentYearTotalExpenses * 1.5;
    const previousRevenue = revenueInfo.previous || previousYearTotalExpenses * 1.5;
    
    console.log('Using revenue values:', { currentRevenue, previousRevenue });
    
    // Bereken winst en marge
    const currentProfit = currentRevenue - currentYearTotalExpenses;
    const previousProfit = previousRevenue - previousYearTotalExpenses;
    
    const currentMargin = currentRevenue > 0 ? (currentProfit / currentRevenue) * 100 : 0;
    const previousMargin = previousRevenue > 0 ? (previousProfit / previousRevenue) * 100 : 0;
    
    // Bereken trends
    const revenueTrend = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;
    const expensesTrend = previousYearTotalExpenses > 0 ? ((currentYearTotalExpenses - previousYearTotalExpenses) / previousYearTotalExpenses) * 100 : 0;
    const profitTrend = previousProfit > 0 ? ((currentProfit - previousProfit) / previousProfit) * 100 : 0;
    const marginTrend = previousMargin > 0 ? (currentMargin - previousMargin) : 0;
    
    console.log('Calculated trends:', { revenueTrend, expensesTrend, profitTrend, marginTrend });
    
    // Update state met actuele gegevens
    setYearData({
      revenue: currentRevenue,
      expenses: currentYearTotalExpenses,
      profit: currentProfit,
      margin: currentMargin
    });
    
    // Update trends
    setTrends({
      revenue: { 
        percent: Math.abs(revenueTrend), 
        isUp: revenueTrend >= 0 
      },
      expenses: { 
        percent: Math.abs(expensesTrend), 
        isUp: expensesTrend >= 0 
      },
      profit: { 
        percent: Math.abs(profitTrend), 
        isUp: profitTrend >= 0 
      },
      margin: { 
        percent: Math.abs(marginTrend), 
        isUp: marginTrend >= 0 
      }
    });
  };

  const saveRevenue = async () => {
    if (!inputRevenue) return;
    
    try {
      const amount = parseFloat(inputRevenue);
      
      // Controleer of er al een record is
      const { data, error: checkError } = await supabase
        .from('revenue')
        .select('*')
        .eq('year', selectedYear);
      
      if (checkError) throw checkError;
      
      if (data && data.length > 0) {
        // Update bestaand record
        const { error: updateError } = await supabase
          .from('revenue')
          .update({ amount })
          .eq('id', data[0].id);
          
        if (updateError) throw updateError;
      } else {
        // Maak nieuw record
        const { error: insertError } = await supabase
          .from('revenue')
          .insert({ year: selectedYear, amount });
          
        if (insertError) throw insertError;
      }
      
      console.log('Revenue saved successfully:', amount);
      
      // Reset input veld
      setInputRevenue('');
      setShowRevenueInput(false);
      
      // Herlaad dashboard data
      fetchDashboardData();
    } catch (error) {
      console.error('Error saving revenue:', error);
      alert('Er is een fout opgetreden bij het opslaan van de omzet.');
    }
  };
  
  if (!isClient) {
    return <Layout><div className="loading">Loading executive dashboard...</div></Layout>;
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
            <h1 style={{ fontSize: '28px', fontWeight: '600', margin: '0 0 8px 0' }}>Financial Dashboard</h1>
            <p style={{ fontSize: '16px', color: '#666', margin: 0 }}>Overzicht van belangrijke financiële indicatoren</p>
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
            
            <Link 
              href="/expenses" 
              style={{ 
                textDecoration: 'none', 
                color: '#2563eb', 
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Ga naar uitgavenbeheer →
            </Link>
          </div>
        </header>
        
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <p>Data laden...</p>
          </div>
        ) : (
          <>
            {/* KPI Overzicht */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '24px',
              marginBottom: '32px'
            }}>
              {/* Omzet KPI card */}
              <div style={{
                padding: '24px',
                borderRadius: '12px',
                backgroundColor: 'white',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #f3f4f6'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '14px', color: '#6b7280', margin: '0', fontWeight: '500' }}>Omzet</h3>
                  <button 
                    onClick={() => {
                      setInputRevenue(yearData.revenue.toString());
                      setShowRevenueInput(true);
                    }} 
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer', 
                      fontSize: '12px',
                      color: '#2563eb'
                    }}
                  >
                    Bewerken
                  </button>
                </div>
                
                {showRevenueInput ? (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <input
                        type="number"
                        value={inputRevenue}
                        onChange={(e) => setInputRevenue(e.target.value)}
                        placeholder="Voer omzet in..."
                        style={{ 
                          padding: '4px 8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          flex: 1
                        }}
                      />
                      <button 
                        onClick={saveRevenue}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: '#2563eb',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Opslaan
                      </button>
                      <button 
                        onClick={() => setShowRevenueInput(false)}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: '#f3f4f6',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: '28px', fontWeight: '600', marginTop: '8px', marginBottom: '16px' }}>
                      {`€${(yearData.revenue/1000).toFixed(0)}K`}
                    </div>
                    <div style={{ fontSize: '14px', color: trends.revenue.isUp ? '#10b981' : '#ef4444' }}>
                      {trends.revenue.isUp ? '↑' : '↓'} {trends.revenue.percent.toFixed(1)}% t.o.v. vorig jaar
                    </div>
                  </>
                )}
              </div>
              
              <KpiCard 
                title="Uitgaven" 
                value={`€${(yearData.expenses/1000).toFixed(0)}K`}
                trend={`${trends.expenses.percent.toFixed(1)}%`}
                trendUp={trends.expenses.isUp}
                trendIsGood={false}
              />
              <KpiCard 
                title="Winst" 
                value={`€${(yearData.profit/1000).toFixed(0)}K`}
                trend={`${trends.profit.percent.toFixed(1)}%`}
                trendUp={trends.profit.isUp}
              />
              <KpiCard 
                title="Marge" 
                value={`${yearData.margin.toFixed(1)}%`}
                trend={`${trends.margin.percent.toFixed(1)}%`}
                trendUp={trends.margin.isUp}
              />
            </div>
            
            {/* Kostenstructuur Overzicht */}
            <div style={{
              borderRadius: '12px',
              border: '1px solid #eee',
              padding: '24px',
              marginBottom: '32px',
              backgroundColor: 'white'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Kostenstructuur</h2>
                <button 
                  onClick={() => window.print()}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    background: 'white',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Exporteren
                </button>
              </div>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                      <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '14px', fontWeight: '500' }}>Categorie</th>
                      <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '14px', fontWeight: '500' }}>Totaal</th>
                      <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '14px', fontWeight: '500' }}>% van Uitgaven</th>
                      <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '14px', fontWeight: '500' }}>YoY Δ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryTotals.map(category => (
                      <ExpenseRow 
                        key={category.category}
                        category={category.category} 
                        amount={category.amount} 
                        percent={category.percent} 
                        change={category.change} 
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Maandelijkse Uitgaven */}
            <div style={{
              borderRadius: '12px',
              border: '1px solid #eee',
              padding: '24px',
              backgroundColor: 'white'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', marginTop: 0, marginBottom: '16px' }}>Maandelijkse Uitgaven</h2>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                      <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '14px', fontWeight: '500' }}>Categorie</th>
                      {['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'].map(month => (
                        <th key={month} style={{ textAlign: 'right', padding: '12px 8px', fontSize: '14px', fontWeight: '500' }}>{month}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {categoryTotals.map(category => (
                      <MonthlyExpenseRow 
                        key={category.category}
                        category={category.category} 
                        values={category.monthlyAmounts} 
                      />
                    ))}
                    <tr style={{ borderTop: '2px solid #eee', fontWeight: 'bold' }}>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>Totaal</td>
                      {Array(12).fill(0).map((_, i) => {
                        const monthTotal = categoryTotals.reduce((sum, cat) => sum + cat.monthlyAmounts[i], 0);
                        return (
                          <td key={i} style={{ textAlign: 'right', padding: '12px 8px', fontSize: '14px' }}>
                            {new Intl.NumberFormat('nl-NL', { 
                              style: 'currency', 
                              currency: 'EUR',
                              maximumFractionDigits: 0
                            }).format(monthTotal)}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

// Herbruikbare componenten
function KpiCard({ title, value, trend, trendUp, trendIsGood = true }) {
  const trendColor = trendUp === trendIsGood ? '#10b981' : '#ef4444';
  
  return (
    <div style={{
      padding: '24px',
      borderRadius: '12px',
      backgroundColor: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #f3f4f6'
    }}>
      <h3 style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0', fontWeight: '500' }}>{title}</h3>
      <div style={{ fontSize: '28px', fontWeight: '600', marginBottom: '16px' }}>{value}</div>
      <div style={{ fontSize: '14px', color: trendColor }}>
        {trendUp ? '↑' : '↓'} {trend} t.o.v. vorig jaar
      </div>
    </div>
  );
}

function ExpenseRow({ category, amount, percent, change }) {
  const amountFormatted = new Intl.NumberFormat('nl-NL', { 
    style: 'currency', 
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(amount);
  
  return (
    <tr style={{ borderBottom: '1px solid #eee' }}>
      <td style={{ padding: '12px 16px', fontSize: '14px' }}>{category}</td>
      <td style={{ textAlign: 'right', padding: '12px 16px', fontSize: '14px' }}>{amountFormatted}</td>
      <td style={{ textAlign: 'right', padding: '12px 16px', fontSize: '14px' }}>{percent.toFixed(1)}%</td>
      <td style={{ 
        textAlign: 'right', 
        padding: '12px 16px', 
        fontSize: '14px',
        color: change >= 0 ? '#10b981' : '#ef4444'
      }}>
        {change >= 0 ? '+' : ''}{change.toFixed(1)}%
      </td>
    </tr>
  );
}

function MonthlyExpenseRow({ category, values }) {
  return (
    <tr style={{ borderBottom: '1px solid #eee' }}>
      <td style={{ padding: '12px 16px', fontSize: '14px' }}>{category}</td>
      {values.map((value, index) => (
        <td key={index} style={{ textAlign: 'right', padding: '12px 8px', fontSize: '14px' }}>
          {new Intl.NumberFormat('nl-NL', { 
            style: 'currency', 
            currency: 'EUR',
            maximumFractionDigits: 0
          }).format(value)}
        </td>
      ))}
    </tr>
  );
}