// src/components/SalesContent.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

export default function SalesContent() {
  const [consultancyProjects, setConsultancyProjects] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [monthlyRevenueForecast, setMonthlyRevenueForecast] = useState([]);
  const [monthlyExpensesForecast, setMonthlyExpensesForecast] = useState([]);
  const [liquidityForecast, setLiquidityForecast] = useState([]);
  const [newProject, setNewProject] = useState({
    client: '',
    project: '',
    rate: '',
    hours: '',
    startDate: '',
    endDate: ''
  });
  const [newSubscription, setNewSubscription] = useState({
    client: '',
    users: 0,
    price: 23.99
  });
  const [isLoading, setIsLoading] = useState(true);

  const months = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", 
    "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"
  ];

  // Load data when component mounts
  useEffect(() => {
    fetchSalesData();
    fetchExpensesData();
  }, []);

  // Fetch sales data
  const fetchSalesData = async () => {
    setIsLoading(true);
    try {
      // Fetch consultancy projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('consultancy_projects')
        .select('*')
        .order('end_date', { ascending: true });
      
      if (projectsError) throw projectsError;
      
      // Fetch subscriptions
      const { data: subsData, error: subsError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('active', true);
      
      if (subsError) throw subsError;
      
      setConsultancyProjects(projectsData || []);
      setSubscriptions(subsData || []);
      
      // Calculate monthly revenue forecast
      calculateMonthlyRevenue(projectsData || [], subsData || []);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch expense data
  const fetchExpensesData = async () => {
    try {
      const currentYear = new Date().getFullYear();
      
      // Fetch expenses for current year
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .eq('year', currentYear);
      
      if (expensesError) throw expensesError;
      
      // Process monthly expenses
      const monthlyExpenses = Array(12).fill(0);
      
      expensesData.forEach(expense => {
        if (expense.month >= 0 && expense.month < 12) {
          // Expenses are stored as negative values, take absolute
          monthlyExpenses[expense.month] += Math.abs(expense.amount);
        }
      });
      
      setMonthlyExpensesForecast(monthlyExpenses);
      
      // Update liquidity forecast
      if (monthlyRevenueForecast.length > 0) {
        calculateLiquidityForecast(monthlyRevenueForecast, monthlyExpenses);
      }
    } catch (error) {
      console.error('Error fetching expenses data:', error);
    }
  };

  // Calculate monthly revenue forecast
  const calculateMonthlyRevenue = (projects, subscriptions) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    // Initialize monthly revenue array
    const monthlyRevenue = Array(12).fill(0);
    
    // Add consultancy project revenue
    projects.forEach(project => {
      const startDate = new Date(project.start_date || project.created_at);
      const endDate = new Date(project.end_date);
      
      // Skip if project is in the past
      if (endDate < currentDate && endDate.getFullYear() < currentYear) {
        return;
      }
      
      // Calculate revenue per month
      const totalMonths = Math.ceil((endDate - startDate) / (30 * 24 * 60 * 60 * 1000));
      const monthlyValue = project.hours * project.rate / totalMonths;
      
      // Add revenue to each month the project is active
      for (let i = 0; i < 12; i++) {
        const monthDate = new Date(currentYear, i, 15);
        if (monthDate >= startDate && monthDate <= endDate) {
          monthlyRevenue[i] += monthlyValue;
        }
      }
    });
    
    // Calculate subscription revenue with growth model
    const churnRate = 0.03; // 3% monthly churn
    const growthRate = 0.05; // 5% monthly growth
    
    // Calculate current MRR
    let currentMRR = subscriptions.reduce((total, sub) => total + (sub.price * sub.users), 0);
    
    // Project subscription revenue for the next 12 months
    for (let i = 0; i < 12; i++) {
      if (i >= currentMonth) {
        // Apply growth and churn for future months
        currentMRR = currentMRR * (1 + growthRate - churnRate);
        monthlyRevenue[i] += currentMRR;
      } else {
        // For past months, just add the current MRR
        monthlyRevenue[i] += currentMRR;
      }
    }
    
    setMonthlyRevenueForecast(monthlyRevenue);
    
    // If we have expense data, update liquidity forecast
    if (monthlyExpensesForecast.length > 0) {
      calculateLiquidityForecast(monthlyRevenue, monthlyExpensesForecast);
    }
  };

  // Calculate liquidity forecast
  const calculateLiquidityForecast = (revenue, expenses) => {
    const liquidity = Array(12).fill(0);
    
    for (let i = 0; i < 12; i++) {
      liquidity[i] = revenue[i] - expenses[i];
      
      // Carry forward running balance
      if (i > 0) {
        liquidity[i] += liquidity[i-1];
      }
    }
    
    setLiquidityForecast(liquidity);
  };

  // Add new consultancy project
  const addConsultancyProject = async () => {
    if (!newProject.client || !newProject.project || !newProject.rate || !newProject.hours || !newProject.startDate || !newProject.endDate) {
      alert('Vul alle verplichte velden in');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('consultancy_projects')
        .insert({
          client: newProject.client,
          project: newProject.project,
          rate: parseFloat(newProject.rate),
          hours: parseInt(newProject.hours),
          start_date: newProject.startDate,
          end_date: newProject.endDate,
          total: parseFloat(newProject.rate) * parseInt(newProject.hours)
        });
      
      if (error) throw error;
      
      // Reset form and refresh data
      setNewProject({
        client: '',
        project: '',
        rate: '',
        hours: '',
        startDate: '',
        endDate: ''
      });
      
      fetchSalesData();
    } catch (error) {
      console.error('Error adding project:', error);
      alert('Fout bij toevoegen van project');
    }
  };

  // Add new subscription client
  const addSubscription = async () => {
    if (!newSubscription.client || newSubscription.users <= 0) {
      alert('Vul alle verplichte velden in');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('subscriptions')
        .insert({
          client: newSubscription.client,
          users: parseInt(newSubscription.users),
          price: parseFloat(newSubscription.price),
          active: true,
          start_date: new Date().toISOString()
        });
      
      if (error) throw error;
      
      // Reset form and refresh data
      setNewSubscription({
        client: '',
        users: 0,
        price: 23.99
      });
      
      fetchSalesData();
    } catch (error) {
      console.error('Error adding subscription:', error);
      alert('Fout bij toevoegen van abonnement');
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Verkoop Beheer</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ margin: 0, color: '#666' }}>Beheer je projecten, abonnementen en omzetprognose</p>
          <Link href="/dashboard" style={{ textDecoration: 'none', color: '#2563eb', fontSize: '14px' }}>
            Ga naar dashboard →
          </Link>
        </div>
      </header>
      
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>Gegevens laden...</div>
      ) : (
        <>
          {/* Consultancy Projecten */}
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Consultancy Projecten</h2>
            
            <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #eee' }}>
                <thead>
                  <tr style={{ background: '#f5f5f5' }}>
                    <th style={{ padding: '10px', textAlign: 'left', fontSize: '14px' }}>Klant</th>
                    <th style={{ padding: '10px', textAlign: 'left', fontSize: '14px' }}>Project</th>
                    <th style={{ padding: '10px', textAlign: 'right', fontSize: '14px' }}>Tarief</th>
                    <th style={{ padding: '10px', textAlign: 'right', fontSize: '14px' }}>Uren</th>
                    <th style={{ padding: '10px', textAlign: 'right', fontSize: '14px' }}>Totaal</th>
                    <th style={{ padding: '10px', textAlign: 'left', fontSize: '14px' }}>Einde</th>
                  </tr>
                </thead>
                <tbody>
                  {consultancyProjects.map((project, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px', fontSize: '14px' }}>{project.client}</td>
                      <td style={{ padding: '10px', fontSize: '14px' }}>{project.project}</td>
                      <td style={{ padding: '10px', textAlign: 'right', fontSize: '14px' }}>€{project.rate}</td>
                      <td style={{ padding: '10px', textAlign: 'right', fontSize: '14px' }}>{project.hours}</td>
                      <td style={{ padding: '10px', textAlign: 'right', fontSize: '14px' }}>€{project.total}</td>
                      <td style={{ padding: '10px', fontSize: '14px' }}>{new Date(project.end_date).toLocaleDateString('nl-NL')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>Nieuw Project Toevoegen</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '10px' }}>
              <div>
                <input
                  type="text"
                  placeholder="Klant"
                  value={newProject.client}
                  onChange={(e) => setNewProject({...newProject, client: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Project Naam"
                  value={newProject.project}
                  onChange={(e) => setNewProject({...newProject, project: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Tarief"
                  value={newProject.rate}
                  onChange={(e) => setNewProject({...newProject, rate: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Uren"
                  value={newProject.hours}
                  onChange={(e) => setNewProject({...newProject, hours: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <input
                  type="date"
                  placeholder="Start Datum"
                  value={newProject.startDate}
                  onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <input
                  type="date"
                  placeholder="Eind Datum"
                  value={newProject.endDate}
                  onChange={(e) => setNewProject({...newProject, endDate: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
            </div>
            <button
              onClick={addConsultancyProject}
              style={{ 
                padding: '8px 16px',
                background: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Project Toevoegen
            </button>
          </section>
          
          {/* SaaS Abonnementen */}
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>SaaS Abonnementen</h2>
            <p style={{ marginBottom: '16px', fontSize: '14px' }}>
              MRR: €{subscriptions.reduce((total, sub) => total + (sub.price * sub.users), 0).toFixed(2)}
            </p>
            
            <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #eee' }}>
                <thead>
                  <tr style={{ background: '#f5f5f5' }}>
                    <th style={{ padding: '10px', textAlign: 'left', fontSize: '14px' }}>Klant</th>
                    <th style={{ padding: '10px', textAlign: 'right', fontSize: '14px' }}>Gebruikers</th>
                    <th style={{ padding: '10px', textAlign: 'right', fontSize: '14px' }}>Modules</th>
                    <th style={{ padding: '10px', textAlign: 'right', fontSize: '14px' }}>Waarde</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((sub, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px', fontSize: '14px' }}>{sub.client}</td>
                      <td style={{ padding: '10px', textAlign: 'right', fontSize: '14px' }}>{sub.users}</td>
                      <td style={{ padding: '10px', textAlign: 'right', fontSize: '14px' }}>1</td>
                      <td style={{ padding: '10px', textAlign: 'right', fontSize: '14px' }}>€{(sub.price * sub.users).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>Nieuwe Klant Toevoegen</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '10px' }}>
              <div>
                <input
                  type="text"
                  placeholder="Klantnaam"
                  value={newSubscription.client}
                  onChange={(e) => setNewSubscription({...newSubscription, client: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Aantal gebruikers"
                  value={newSubscription.users}
                  onChange={(e) => setNewSubscription({...newSubscription, users: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Prijs per gebruiker"
                  value={newSubscription.price}
                  onChange={(e) => setNewSubscription({...newSubscription, price: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  step="0.01"
                />
              </div>
            </div>
            <button
              onClick={addSubscription}
              style={{ 
                padding: '8px 16px',
                background: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Klant Toevoegen
            </button>
          </section>
          
          {/* Liquidity Forecast */}
          <section>
            <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Liquiditeitsprognose</h2>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #eee' }}>
                <thead>
                  <tr style={{ background: '#f5f5f5' }}>
                    <th style={{ padding: '10px', textAlign: 'left', fontSize: '14px' }}>Categorie</th>
                    {months.map((month, i) => (
                      <th key={i} style={{ padding: '10px', textAlign: 'right', fontSize: '14px' }}>{month}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '10px', fontSize: '14px', fontWeight: 'bold' }}>Inkomsten</td>
                    {monthlyRevenueForecast.map((amount, i) => (
                      <td key={i} style={{ padding: '10px', textAlign: 'right', fontSize: '14px' }}>
                        {new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(amount)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td style={{ padding: '10px', fontSize: '14px', fontWeight: 'bold' }}>Uitgaven</td>
                    {monthlyExpensesForecast.map((amount, i) => (
                      <td key={i} style={{ padding: '10px', textAlign: 'right', fontSize: '14px' }}>
                        {new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(amount)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td style={{ padding: '10px', fontSize: '14px', fontWeight: 'bold' }}>Maandelijks Saldo</td>
                    {monthlyRevenueForecast.map((amount, i) => (
                      <td key={i} style={{ 
                        padding: '10px', 
                        textAlign: 'right', 
                        fontSize: '14px',
                        color: amount - monthlyExpensesForecast[i] < 0 ? '#ef4444' : '#10b981'
                      }}>
                        {new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(amount - monthlyExpensesForecast[i])}
                      </td>
                    ))}
                  </tr>
                  <tr style={{ background: '#f5f5f5' }}>
                    <td style={{ padding: '10px', fontSize: '14px', fontWeight: 'bold' }}>Cumulatief Saldo</td>
                    {liquidityForecast.map((amount, i) => (
                      <td key={i} style={{ 
                        padding: '10px', 
                        textAlign: 'right', 
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: amount < 0 ? '#ef4444' : '#10b981'
                      }}>
                        {new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(amount)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Waarschuwing voor negatieve liquiditeit */}
            {liquidityForecast.some(amount => amount < 0) && (
              <div style={{ 
                marginTop: '20px', 
                padding: '16px', 
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '8px',
                color: '#B91C1C'
              }}>
                <h3 style={{ fontSize: '16px', marginBottom: '8px', color: '#DC2626' }}>Liquiditeitswaarschuwing</h3>
                <p style={{ fontSize: '14px', marginBottom: '8px' }}>
                  Er zijn maanden met een negatief liquiditeitssaldo. Het is raadzaam om nieuwe projecten aan te trekken of kosten te verlagen.
                </p>
                <p style={{ fontSize: '14px' }}>
                  Eerste maand met negatief saldo: <strong>{months[liquidityForecast.findIndex(amount => amount < 0)]}</strong>
                </p>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}