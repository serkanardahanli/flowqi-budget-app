// src/pages/sales.js
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabaseClient';

export default function SalesPage() {
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState('consultancy'); // 'consultancy' of 'saas'
  const [selectedYear, setSelectedYear] = useState(2024);
  const [isLoading, setIsLoading] = useState(true);
  
  // Consultancy state
  const [consultancyProjects, setConsultancyProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    client_name: '',
    project_name: '',
    hourly_rate: 80,
    hours_per_month: 0,
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
  });
  
  // SaaS state
  const [saasClients, setSaasClients] = useState([]);
  const [products, setProducts] = useState([
    { id: 1, name: 'Basic Subscription', price: 23.99, type: 'per_user' },
    { id: 2, name: 'Sales Tool', price: 21.99, type: 'per_user' },
    { id: 3, name: 'Support Tool', price: 29.99, type: 'per_user' },
    { id: 4, name: 'Marketing Tool', price: 16.99, type: 'per_user' },
    { id: 5, name: 'Invoicing Tool', price: 12.99, type: 'per_user' },
    { id: 6, name: 'Product Tool', price: 16.99, type: 'per_user' },
    { id: 7, name: 'FlowQi Docs', price: 29.99, type: 'per_organization' },
    { id: 8, name: 'FlowQi Forms', price: 29.99, type: 'per_organization' },
  ]);
  const [newSaasClient, setNewSaasClient] = useState({
    client_name: '',
    start_date: new Date().toISOString().split('T')[0],
    subscriptions: []
  });
  const [selectedProduct, setSelectedProduct] = useState(1);
  const [productQuantity, setProductQuantity] = useState(1);

  // Voorkom hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Laad data wanneer jaar of tab verandert
  useEffect(() => {
    if (isClient) {
      if (activeTab === 'consultancy') {
        fetchConsultancyProjects();
      } else {
        fetchSaasClients();
      }
    }
  }, [isClient, selectedYear, activeTab]);

  // Consultancy Projects ophalen
  const fetchConsultancyProjects = async () => {
    setIsLoading(true);
    try {
      // Check of de tabel bestaat
      let hasData = false;
      let projectData = [];

      try {
        const { data, error } = await supabase
          .from('consultancy_projects')
          .select('*')
          .order('start_date', { ascending: false });
        
        if (!error && data) {
          hasData = true;
          projectData = data;
        }
      } catch (e) {
        console.log('Consultancy projects table might not exist yet:', e);
      }
      
      if (hasData) {
        setConsultancyProjects(projectData);
      } else {
        // Dummy data
        setConsultancyProjects([
          { 
            id: 1, 
            client_name: 'JE Consultancy', 
            project_name: 'Haarlemmermeer', 
            hourly_rate: 80,
            hours_per_month: 156,
            start_date: '2024-01-01',
            end_date: '2024-12-31',
            total_value: 80 * 156 * 12,
            monthly_value: 80 * 156,
            status: 'active'
          },
          { 
            id: 2, 
            client_name: 'ABC Corp', 
            project_name: 'Website Redesign', 
            hourly_rate: 95,
            hours_per_month: 80,
            start_date: '2024-03-01',
            end_date: '2024-06-30',
            total_value: 95 * 80 * 4,
            monthly_value: 95 * 80,
            status: 'active'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching consultancy projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // SaaS clients ophalen
  const fetchSaasClients = async () => {
    setIsLoading(true);
    try {
      // Check of de tabel bestaat
      let hasData = false;
      let clientData = [];

      try {
        const { data, error } = await supabase
          .from('saas_clients')
          .select('*, saas_subscriptions(*)')
          .order('client_name', { ascending: true });
        
        if (!error && data) {
          hasData = true;
          clientData = data;
        }
      } catch (e) {
        console.log('SaaS clients table might not exist yet:', e);
      }
      
      if (hasData) {
        setSaasClients(clientData);
      } else {
        // Dummy data voor SaaS clients
        setSaasClients([
          { 
            id: 1, 
            client_name: 'Tech Solutions', 
            start_date: '2024-09-01',
            subscriptions: [
              { product_id: 1, quantity: 5, price: 23.99 },
              { product_id: 2, quantity: 3, price: 21.99 },
              { product_id: 7, quantity: 1, price: 29.99 }
            ],
            monthly_value: (5 * 23.99) + (3 * 21.99) + 29.99,
            status: 'planned'
          },
          { 
            id: 2, 
            client_name: 'Global Marketing', 
            start_date: '2024-10-15',
            subscriptions: [
              { product_id: 1, quantity: 10, price: 23.99 },
              { product_id: 4, quantity: 8, price: 16.99 },
              { product_id: 8, quantity: 1, price: 29.99 }
            ],
            monthly_value: (10 * 23.99) + (8 * 16.99) + 29.99,
            status: 'planned'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching SaaS clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveConsultancyProject = async () => {
    // Validatie
    if (!newProject.client_name || !newProject.project_name || !newProject.hourly_rate || !newProject.hours_per_month) {
      alert('Vul alle verplichte velden in');
      return;
    }
    
    const projectData = {
      ...newProject,
      hourly_rate: parseFloat(newProject.hourly_rate),
      hours_per_month: parseFloat(newProject.hours_per_month),
      total_value: calculateProjectValue(newProject),
      monthly_value: newProject.hourly_rate * newProject.hours_per_month,
      status: 'active'
    };
    
    try {
      // Controleer of de tabel bestaat
      let tableExists = false;
      
      try {
        const { error } = await supabase
          .from('consultancy_projects')
          .select('count')
          .limit(1);
        
        tableExists = !error;
      } catch (e) {
        console.error('Error checking if table exists:', e);
      }
      
      if (tableExists) {
        // Voeg project toe
        const { data, error } = await supabase
          .from('consultancy_projects')
          .insert([projectData]);
        
        if (error) throw error;
        
        // Reset form en herlaad projecten
        resetProjectForm();
        fetchConsultancyProjects();
      } else {
        // Toon bericht dat tabel niet bestaat
        alert('De consultancy_projects tabel bestaat nog niet. Voer het SQL script uit om deze aan te maken.');
        
        // Voor test: toevoegen aan lokale lijst
        setConsultancyProjects([
          ...consultancyProjects,
          { 
            id: consultancyProjects.length + 1,
            ...projectData
          }
        ]);
        
        resetProjectForm();
      }
    } catch (error) {
      console.error('Error saving project:', error);
      alert(`Fout bij opslaan project: ${error.message}`);
    }
  };
  const saveSaasClient = async () => {
    // Validatie
    if (!newSaasClient.client_name || !newSaasClient.start_date || newSaasClient.subscriptions.length === 0) {
      alert('Vul alle verplichte velden in en voeg ten minste één abonnement toe');
      return;
    }
    
    // Bereken maandelijkse waarde
    const monthly_value = newSaasClient.subscriptions.reduce((total, sub) => {
      const product = products.find(p => p.id === sub.product_id);
      return total + (product.price * sub.quantity);
    }, 0);
    
    const clientData = {
      ...newSaasClient,
      monthly_value,
      status: 'planned'
    };
    
    try {
      // Controleer of de tabel bestaat
      let tableExists = false;
      
      try {
        const { error } = await supabase
          .from('saas_clients')
          .select('count')
          .limit(1);
        
        tableExists = !error;
      } catch (e) {
        console.error('Error checking if table exists:', e);
      }
      
      if (tableExists) {
        // In een echte implementatie: voeg client toe en dan de subscriptions
        // Dit is een vereenvoudigde versie
        const { data, error } = await supabase
          .from('saas_clients')
          .insert([clientData]);
        
        if (error) throw error;
        
        // Reset form en herlaad clients
        resetSaasForm();
        fetchSaasClients();
      } else {
        // Toon bericht dat tabel niet bestaat
        alert('De saas_clients tabel bestaat nog niet. Voer het SQL script uit om deze aan te maken.');
        
        // Voor test: toevoegen aan lokale lijst
        setSaasClients([
          ...saasClients,
          { 
            id: saasClients.length + 1,
            ...clientData
          }
        ]);
        
        resetSaasForm();
      }
    } catch (error) {
      console.error('Error saving SaaS client:', error);
      alert(`Fout bij opslaan client: ${error.message}`);
    }
  };

  const deleteConsultancyProject = async (id) => {
    if (!confirm('Weet je zeker dat je dit project wilt verwijderen?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('consultancy_projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      fetchConsultancyProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      
      // Voor test: verwijder uit lokale lijst
      setConsultancyProjects(consultancyProjects.filter(p => p.id !== id));
    }
  };

  const deleteSaasClient = async (id) => {
    if (!confirm('Weet je zeker dat je deze klant en alle bijbehorende abonnementen wilt verwijderen?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('saas_clients')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      fetchSaasClients();
    } catch (error) {
      console.error('Error deleting SaaS client:', error);
      
      // Voor test: verwijder uit lokale lijst
      setSaasClients(saasClients.filter(c => c.id !== id));
    }
  };

  const addSubscription = () => {
    if (!selectedProduct || productQuantity < 1) return;
    
    const product = products.find(p => p.id === parseInt(selectedProduct));
    
    // Als het een per_organization type is, controleer of het al is toegevoegd
    if (product.type === 'per_organization' && 
        newSaasClient.subscriptions.some(s => s.product_id === product.id)) {
      alert(`${product.name} is een abonnement per organisatie en kan maar één keer worden toegevoegd.`);
      return;
    }
    
    // Voeg subscription toe
    setNewSaasClient({
      ...newSaasClient,
      subscriptions: [
        ...newSaasClient.subscriptions,
        {
          product_id: parseInt(selectedProduct),
          product_name: product.name,
          quantity: parseInt(productQuantity),
          price: product.price
        }
      ]
    });
    
    // Reset product formulier
    setProductQuantity(1);
    setSelectedProduct(1);
  };

  const removeSubscription = (index) => {
    const newSubscriptions = [...newSaasClient.subscriptions];
    newSubscriptions.splice(index, 1);
    setNewSaasClient({
      ...newSaasClient,
      subscriptions: newSubscriptions
    });
  };

  const calculateProjectValue = (project) => {
    // Bereken het aantal maanden tussen start en end date
    const start = new Date(project.start_date);
    const end = new Date(project.end_date);
    const monthsDiff = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
    
    // Bereken de totale waarde van het project
    return project.hourly_rate * project.hours_per_month * monthsDiff;
  };

  const resetProjectForm = () => {
    setNewProject({
      client_name: '',
      project_name: '',
      hourly_rate: 80,
      hours_per_month: 0,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
    });
  };

  const resetSaasForm = () => {
    setNewSaasClient({
      client_name: '',
      start_date: new Date().toISOString().split('T')[0],
      subscriptions: []
    });
    setProductQuantity(1);
    setSelectedProduct(1);
  };

  const calculateYearlyRevenue = () => {
    let totalConsultancy = 0;
    let totalSaas = 0;
    
    // Bereken consultancy inkomsten
    consultancyProjects.forEach(project => {
      // Voor projecten die dit jaar actief zijn
      const projectStart = new Date(project.start_date);
      const projectEnd = new Date(project.end_date);
      const yearStart = new Date(selectedYear, 0, 1);
      const yearEnd = new Date(selectedYear, 11, 31);
      
      // Project overlapt met geselecteerd jaar
      if (projectStart <= yearEnd && projectEnd >= yearStart) {
        // Bereken het aantal maanden in dit jaar
        const startMonth = projectStart > yearStart ? projectStart.getMonth() : 0;
        const endMonth = projectEnd < yearEnd ? projectEnd.getMonth() : 11;
        const monthsInYear = endMonth - startMonth + 1;
        
        totalConsultancy += project.monthly_value * monthsInYear;
      }
    });
    
    // Bereken SaaS inkomsten voor het jaar (alleen als ze al gestart zijn)
    saasClients.forEach(client => {
      const clientStart = new Date(client.start_date);
      const yearStart = new Date(selectedYear, 0, 1);
      const yearEnd = new Date(selectedYear, 11, 31);
      
      // Client start in het geselecteerde jaar
      if (clientStart.getFullYear() === selectedYear) {
        // Bereken het aantal maanden vanaf de startdatum
        const monthsActive = 12 - clientStart.getMonth();
        totalSaas += client.monthly_value * monthsActive;
      } 
      // Client is het hele jaar actief
      else if (clientStart < yearStart) {
        totalSaas += client.monthly_value * 12;
      }
    });
    
    return {
      consultancy: totalConsultancy,
      saas: totalSaas,
      total: totalConsultancy + totalSaas
    };
  };

  // Loading state zonder Layout
  if (isLoading) {
    return <div className="loading">Loading sales page...</div>;
  }
  
  // Return zonder Layout
  return (
    <div className="p-6">
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
            <h1 style={{ fontSize: '28px', fontWeight: '600', margin: '0 0 8px 0' }}>Omzet Management</h1>
            <p style={{ fontSize: '16px', color: '#666', margin: 0 }}>Beheer en prognose van inkomstenbronnen</p>
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
              {[2023, 2024, 2025, 2026].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </header>
        
        {/* Omzet samenvatting */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #f3f4f6',
          padding: '24px',
          marginBottom: '32px'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginTop: 0, marginBottom: '16px' }}>Omzet Overzicht {selectedYear}</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#f0f9ff', 
              borderRadius: '8px',
              border: '1px solid #e0f2fe'
            }}>
              <div style={{ fontSize: '14px', color: '#0369a1', marginBottom: '8px' }}>Consultancy Omzet</div>
              <div style={{ fontSize: '24px', fontWeight: '600' }}>€{calculateYearlyRevenue().consultancy.toLocaleString('nl-NL')}</div>
            </div>
            
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#ecfdf5', 
              borderRadius: '8px',
              border: '1px solid #d1fae5'
            }}>
              <div style={{ fontSize: '14px', color: '#047857', marginBottom: '8px' }}>SaaS Omzet</div>
              <div style={{ fontSize: '24px', fontWeight: '600' }}>€{calculateYearlyRevenue().saas.toLocaleString('nl-NL')}</div>
            </div>
            
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#fef3c7', 
              borderRadius: '8px',
              border: '1px solid #fde68a'
            }}>
              <div style={{ fontSize: '14px', color: '#92400e', marginBottom: '8px' }}>Totale Omzet</div>
              <div style={{ fontSize: '24px', fontWeight: '600' }}>€{calculateYearlyRevenue().total.toLocaleString('nl-NL')}</div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
            <button
              onClick={() => setActiveTab('consultancy')}
              style={{
                padding: '12px 24px',
                backgroundColor: activeTab === 'consultancy' ? 'white' : 'transparent',
                borderBottom: activeTab === 'consultancy' ? '2px solid #2563eb' : 'none',
                color: activeTab === 'consultancy' ? '#2563eb' : '#6b7280',
                fontWeight: activeTab === 'consultancy' ? '600' : '400',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Consultancy Projecten
            </button>
            <button
              onClick={() => setActiveTab('saas')}
              style={{
                padding: '12px 24px',
                backgroundColor: activeTab === 'saas' ? 'white' : 'transparent',
                borderBottom: activeTab === 'saas' ? '2px solid #2563eb' : 'none',
                color: activeTab === 'saas' ? '#2563eb' : '#6b7280',
                fontWeight: activeTab === 'saas' ? '600' : '400',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              SaaS Abonnementen
            </button>
          </div>
        </div>
        
        {activeTab === 'consultancy' ? (
          <>
            {/* Consultancy Tab Content */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #f3f4f6',
              padding: '24px',
              marginBottom: '32px'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', marginTop: 0, marginBottom: '16px' }}>Nieuw Consultancy Project</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Opdrachtgever *</label>
                  <input 
                    type="text"
                    value={newProject.client_name}
                    onChange={(e) => setNewProject({...newProject, client_name: e.target.value})}
                    style={{ 
                      width: '100%', 
                      padding: '8px 12px', 
                      borderRadius: '6px', 
                      border: '1px solid #ddd', 
                      fontSize: '14px'
                    }}
                    placeholder="Naam van de opdrachtgever"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Project *</label>
                  <input 
                    type="text"
                    value={newProject.project_name}
                    onChange={(e) => setNewProject({...newProject, project_name: e.target.value})}
                    style={{ 
                      width: '100%', 
                      padding: '8px 12px', 
                      borderRadius: '6px', 
                      border: '1px solid #ddd', 
                      fontSize: '14px'
                    }}
                    placeholder="Naam van het project"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Uurtarief (€) *</label>
                  <input 
                    type="number"
                    value={newProject.hourly_rate}
                    onChange={(e) => setNewProject({...newProject, hourly_rate: e.target.value})}
                    style={{ 
                      width: '100%', 
                      padding: '8px 12px', 
                      borderRadius: '6px', 
                      border: '1px solid #ddd', 
                      fontSize: '14px'
                    }}
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Uren per maand *</label>
                  <input 
                    type="number"
                    value={newProject.hours_per_month}
                    onChange={(e) => setNewProject({...newProject, hours_per_month: e.target.value})}
                    style={{ 
                      width: '100%', 
                      padding: '8px 12px', 
                      borderRadius: '6px', 
                      border: '1px solid #ddd', 
                      fontSize: '14px'
                    }}
                    min="0"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Startdatum *</label>
                  <input 
                    type="date"
                    value={newProject.start_date}
                    onChange={(e) => setNewProject({...newProject, start_date: e.target.value})}
                    style={{ 
                      width: '100%', 
                      padding: '8px 12px', 
                      borderRadius: '6px', 
                      border: '1px solid #ddd', 
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Einddatum *</label>
                  <input 
                    type="date"
                    value={newProject.end_date}
                    onChange={(e) => setNewProject({...newProject, end_date: e.target.value})}
                    style={{ 
                      width: '100%', 
                      padding: '8px 12px', 
                      borderRadius: '6px', 
                      border: '1px solid #ddd', 
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ 
                display: 'flex', 
                gap: '16px', 
                justifyContent: 'flex-end',
                borderTop: '1px solid #f3f4f6',
                paddingTop: '16px',
                marginTop: '8px'
              }}>
                <div style={{ 
                  padding: '12px 16px', 
                  backgroundColor: '#f9fafb', 
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  fontSize: '14px'
                }}>
                  <span style={{ fontWeight: '500' }}>Maandelijkse waarde:</span> 
                  <span style={{ marginLeft: '8px' }}>
                    €{(newProject.hourly_rate * newProject.hours_per_month || 0).toLocaleString('nl-NL')}
                  </span>
                </div>
                
                <div style={{ 
                  padding: '12px 16px', 
                  backgroundColor: '#f9fafb', 
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  fontSize: '14px'
                }}>
                  <span style={{ fontWeight: '500' }}>Totale waarde:</span> 
                  <span style={{ marginLeft: '8px' }}>
                    €{(calculateProjectValue(newProject) || 0).toLocaleString('nl-NL')}
                  </span>
                </div>
                
                <button 
                  onClick={saveConsultancyProject}
                  style={{ 
                    padding: '8px 16px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Project Toevoegen
                </button>
              </div>
            </div>
            
            {/* Consultancy Projecten Overzicht */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #f3f4f6',
              overflow: 'hidden'
            }}>
              <div style={{ padding: '16px 24px', borderBottom: '1px solid #f3f4f6' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Actieve Projecten</h2>
              </div>
              
              {consultancyProjects.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                  Geen consultancy projecten gevonden. Voeg een nieuw project toe om te beginnen.
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}>Opdrachtgever</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}>Project</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}>Looptijd</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '14px', fontWeight: '500' }}>Uren/Mnd</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '14px', fontWeight: '500' }}>Tarief</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '14px', fontWeight: '500' }}>Mnd. Waarde</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '14px', fontWeight: '500' }}>Totale Waarde</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', fontWeight: '500' }}>Acties</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consultancyProjects.map(project => (
                      <tr key={project.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '12px 16px', fontSize: '14px' }}>{project.client_name}</td>
                        <td style={{ padding: '12px 16px', fontSize: '14px' }}>{project.project_name}</td>
                        <td style={{ padding: '12px 16px', fontSize: '14px' }}>
                          {new Date(project.start_date).toLocaleDateString('nl-NL')} - {new Date(project.end_date).toLocaleDateString('nl-NL')}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '14px', textAlign: 'right' }}>{project.hours_per_month}</td>
                        <td style={{ padding: '12px 16px', fontSize: '14px', textAlign: 'right' }}>€{project.hourly_rate}</td>
                        <td style={{ padding: '12px 16px', fontSize: '14px', textAlign: 'right', fontWeight: '500' }}>
                          €{project.monthly_value.toLocaleString('nl-NL')}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '14px', textAlign: 'right', fontWeight: '500' }}>
                          €{project.total_value.toLocaleString('nl-NL')}
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <button 
                            onClick={() => deleteConsultancyProject(project.id)}
                            style={{ 
                              padding: '4px 8px',
                              backgroundColor: 'transparent',
                              color: '#ef4444',
                              border: '1px solid #ef4444',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            Verwijderen
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        ) : (
          <>
            {/* SaaS Tab Content */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #f3f4f6',
              padding: '24px',
              marginBottom: '32px'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', marginTop: 0, marginBottom: '16px' }}>Nieuwe SaaS Klant</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Klantnaam *</label>
                  <input 
                    type="text"
                    value={newSaasClient.client_name}
                    onChange={(e) => setNewSaasClient({...newSaasClient, client_name: e.target.value})}
                    style={{ 
                      width: '100%', 
                      padding: '8px 12px', 
                      borderRadius: '6px', 
                      border: '1px solid #ddd', 
                      fontSize: '14px'
                    }}
                    placeholder="Naam van de klant"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Startdatum *</label>
                  <input 
                    type="date"
                    value={newSaasClient.start_date}
                    onChange={(e) => setNewSaasClient({...newSaasClient, start_date: e.target.value})}
                    style={{ 
                      width: '100%', 
                      padding: '8px 12px', 
                      borderRadius: '6px', 
                      border: '1px solid #ddd', 
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
              
              <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '24px 0 16px 0' }}>Producten Toevoegen</h3>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Product</label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    style={{ 
                      padding: '8px 12px', 
                      borderRadius: '6px', 
                      border: '1px solid #ddd', 
                      fontSize: '14px',
                      minWidth: '200px'
                    }}
                  >
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} (€{product.price}/mnd per {product.type === 'per_user' ? 'gebruiker' : 'organisatie'})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Aantal</label>
                  <input 
                    type="number"
                    value={productQuantity}
                    onChange={(e) => setProductQuantity(e.target.value)}
                    style={{ 
                      padding: '8px 12px', 
                      borderRadius: '6px', 
                      border: '1px solid #ddd', 
                      fontSize: '14px',
                      width: '100px'
                    }}
                    min="1"
                  />
                </div>
                
                <button 
                  onClick={addSubscription}
                  style={{ 
                    padding: '8px 12px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Toevoegen
                </button>
              </div>
              
              {/* Toegevoegde producten */}
              {newSaasClient.subscriptions.length > 0 && (
                <div style={{ 
                  backgroundColor: '#f9fafb', 
                  borderRadius: '8px', 
                  padding: '16px', 
                  marginBottom: '16px',
                  border: '1px solid #e5e7eb'
                }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', marginTop: 0, marginBottom: '12px' }}>Geselecteerde Producten</h4>
                  
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>Product</th>
                        <th style={{ textAlign: 'center', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>Aantal</th>
                        <th style={{ textAlign: 'right', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>Prijs per Eenheid</th>
                        <th style={{ textAlign: 'right', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>Subtotaal</th>
                        <th style={{ textAlign: 'center', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {newSaasClient.subscriptions.map((sub, index) => (
                        <tr key={index}>
                          <td style={{ padding: '8px 0' }}>{sub.product_name}</td>
                          <td style={{ padding: '8px 0', textAlign: 'center' }}>{sub.quantity}</td>
                          <td style={{ padding: '8px 0', textAlign: 'right' }}>€{sub.price.toFixed(2)}/mnd</td>
                          <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: '500' }}>
                            €{(sub.price * sub.quantity).toFixed(2)}/mnd
                          </td>
                          <td style={{ padding: '8px 0', textAlign: 'center' }}>
                            <button 
                              onClick={() => removeSubscription(index)}
                              style={{ 
                                backgroundColor: 'transparent',
                                border: 'none',
                                color: '#ef4444',
                                cursor: 'pointer',
                                fontSize: '16px',
                                padding: '0 4px'
                              }}
                            >
                              ×
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr style={{ borderTop: '1px solid #e5e7eb' }}>
                        <td colSpan="3" style={{ padding: '8px 0', textAlign: 'right', fontWeight: '500' }}>Totaal per maand:</td>
                        <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: '600' }}>
                          €{newSaasClient.subscriptions.reduce((total, sub) => total + (sub.price * sub.quantity), 0).toFixed(2)}
                        </td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
              
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  onClick={saveSaasClient}
                  disabled={newSaasClient.subscriptions.length === 0}
                  style={{ 
                    padding: '8px 16px',
                    backgroundColor: newSaasClient.subscriptions.length > 0 ? '#2563eb' : '#94a3b8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: newSaasClient.subscriptions.length > 0 ? 'pointer' : 'not-allowed'
                  }}
                >
                  Klant Toevoegen
                </button>
              </div>
            </div>
            
            {/* SaaS Klanten Overzicht */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #f3f4f6',
              overflow: 'hidden'
            }}>
              <div style={{ padding: '16px 24px', borderBottom: '1px solid #f3f4f6' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>SaaS Klanten</h2>
              </div>
              
              {saasClients.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                  Geen SaaS klanten gevonden. Voeg een nieuwe klant toe om te beginnen.
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}>Klant</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}>Startdatum</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}>Abonnementen</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '14px', fontWeight: '500' }}>Mnd. Waarde</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', fontWeight: '500' }}>Status</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', fontWeight: '500' }}>Acties</th>
                    </tr>
                  </thead>
                  <tbody>
                    {saasClients.map(client => (
                      <tr key={client.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '12px 16px', fontSize: '14px' }}>{client.client_name}</td>
                        <td style={{ padding: '12px 16px', fontSize: '14px' }}>
                          {new Date(client.start_date).toLocaleDateString('nl-NL')}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '14px' }}>
                          {client.subscriptions.map((sub, idx) => {
                            const product = products.find(p => p.id === sub.product_id);
                            return (
                              <div key={idx} style={{ marginBottom: '4px' }}>
                                <span style={{ fontWeight: '500' }}>{product ? product.name : sub.product_name}</span>
                                <span style={{ color: '#6b7280', marginLeft: '4px' }}>
                                  ({sub.quantity}x)
                                </span>
                              </div>
                            );
                          })}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '14px', textAlign: 'right', fontWeight: '500' }}>
                          €{client.monthly_value.toLocaleString('nl-NL')}
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <span style={{ 
                            display: 'inline-block',
                            padding: '2px 8px',
                            backgroundColor: client.status === 'active' ? '#d1fae5' : '#fef3c7',
                            color: client.status === 'active' ? '#047857' : '#92400e',
                            borderRadius: '9999px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            {client.status === 'active' ? 'Actief' : 'Gepland'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <button 
                            onClick={() => deleteSaasClient(client.id)}
                            style={{ 
                              padding: '4px 8px',
                              backgroundColor: 'transparent',
                              color: '#ef4444',
                              border: '1px solid #ef4444',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            Verwijderen
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Voeg getLayout functie toe voor consistente layout
SalesPage.getLayout = (page) => Layout.getLayout(page);
                    