// src/pages/expenses.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Layout from '../components/Layout';

const ExpensesPage = () => {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [isClient, setIsClient] = useState(false);
  
  const [newExpense, setNewExpense] = useState({
    code: '',
    description: '',
    amount: '',
    month: 0
  });

  const months = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", 
    "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"
  ];

  // Volledige kostenstructuur exact zoals in Excel
  const expenseStructure = [
    { code: '4000', description: 'Bruto Loon', isHeader: true, initialValue: -15000 },
    { code: '4300', description: 'Personeelsopleiding en -ontwikkeling', isHeader: true, hasChildren: true, initialValue: 0 },
    { code: '4310', description: 'Training software ontwikkelaars', parentCode: '4300' },
    { code: '4312', description: 'Training voor programmeertalen', parentCode: '4300' },
    { code: '4313', description: 'Workshops voor software-architectuur', parentCode: '4300' },
    { code: '4320', description: 'Klantenservice Opleiding', parentCode: '4300' },
    { code: '4322', description: 'Cursussen voor klantrelatiebeheer (CRM)', parentCode: '4300' },
    { code: '4323', description: 'Workshops voor effectieve communicatie met klanten', parentCode: '4300' },
    { code: '4330', description: 'Algemene Opleidingen', parentCode: '4300' },
    { code: '4400', description: 'Marketingkosten', isHeader: true, hasChildren: true, initialValue: 0 },
    { code: '4410', description: 'Online Marketing', isSubHeader: true, parentCode: '4400', hasChildren: true, color: 'green', initialValue: 0 },
    { code: '4411', description: 'Google Ads', parentCode: '4410' },
    { code: '4412', description: 'Link Building', parentCode: '4410' },
    { code: '4413', description: 'Kosten voor zoekmachineoptimalisatie (SEO)', parentCode: '4410' },
    { code: '4414', description: 'Kosten voor zoekmachine-adverteren (SEA)', parentCode: '4410' },
    { code: '4415', description: 'Uitgaven voor Contentmarketing', parentCode: '4410' },
    { code: '4416', description: 'Social media marketingkosten', parentCode: '4410' },
    { code: '4417', description: 'E-mailmarketing uitgaven', parentCode: '4410' },
    { code: '4418', description: 'Kosten voor online advertentie', parentCode: '4410' },
    { code: '4419', description: 'Overige online marketingkosten', parentCode: '4410' },
    { code: '4420', description: 'Content marketing', isSubHeader: true, parentCode: '4400', hasChildren: true, color: 'green', initialValue: 0 },
    { code: '4421', description: 'Blogposts', parentCode: '4420' },
    { code: '4422', description: 'Kosten voor infographics', parentCode: '4420' },
    { code: '4423', description: 'Kosten voor video content', parentCode: '4420' },
    { code: '4424', description: 'Kosten voor webinars', parentCode: '4420' },
    { code: '4430', description: 'Evenementen en conferenties', isSubHeader: true, parentCode: '4400', hasChildren: true, color: 'green', initialValue: 0 },
    { code: '4431', description: 'Conferentiebezoek Kosten', parentCode: '4430' },
    { code: '4432', description: 'Stand op beurzen', parentCode: '4430' },
    { code: '4433', description: 'Events', parentCode: '4430' },
    { code: '4440', description: 'Offline marketing', isSubHeader: true, parentCode: '4400', hasChildren: true, color: 'green', initialValue: 0 },
    { code: '4441', description: 'Drukwerk', parentCode: '4440' },
    { code: '4442', description: 'Reclame in kranten en tijdschriften', parentCode: '4440' },
    { code: '4443', description: 'Direct mail campagnes', parentCode: '4440' },
    { code: '4500', description: 'Klantondersteuning', isHeader: true, hasChildren: true, initialValue: 0 },
    { code: '4510', description: 'Klantenservice', isSubHeader: true, parentCode: '4500', hasChildren: true, color: 'green', initialValue: 0 },
    { code: '4511', description: 'Software voor klantenservice', parentCode: '4510' },
    { code: '4520', description: 'Technische support', isSubHeader: true, parentCode: '4500', hasChildren: true, color: 'green', initialValue: 0 },
    { code: '4521', description: 'Support ticketing systeem', parentCode: '4520' },
    { code: '4522', description: 'Uitgaven voor support tools', parentCode: '4520' },
    { code: '4600', description: 'R&D Kosten', isHeader: true, hasChildren: true, initialValue: 0 },
    { code: '4610', description: 'Software Ontwikkelingskosten', isSubHeader: true, parentCode: '4600', hasChildren: true, color: 'green', initialValue: 0 },
    { code: '4611', description: 'Kosten voor externe ontwikkelaars', parentCode: '4610' },
    { code: '4612', description: 'Interne ontwikkelingskosten', parentCode: '4610' },
    { code: '4613', description: 'Training en certificering van interne developer', parentCode: '4610' },
    { code: '4614', description: 'Kosten voor UI/UX-ontwerp', parentCode: '4610' },
    { code: '4620', description: 'Cloud Infrastructuurkosten', isSubHeader: true, parentCode: '4600', hasChildren: true, color: 'green', initialValue: 0 },
    { code: '4621', description: 'Kosten voor virtuele machines', parentCode: '4620' },
    { code: '4622', description: 'Kosten voor opslag', parentCode: '4620' },
    { code: '4623', description: 'Kosten voor database toegang', parentCode: '4620' },
    { code: '4624', description: 'Kosten voor netwerkinfrastructuur', parentCode: '4620' },
    { code: '4625', description: 'Kosten voor Azure-functies', parentCode: '4620' },
    { code: '4626', description: 'Kosten voor monitoring en beveiliging', parentCode: '4620' },
    // ... overige expense structure items
  ];

  // Voorkom hydration issues door client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Hoofdfunctionaliteit
  useEffect(() => {
    if (isClient) {
      const initializedExpenses = expenseStructure.map(item => ({
        ...item,
        amounts: Array(12).fill(item.initialValue || 0)
      }));
      setExpenses(initializedExpenses);
      
      // Standaard headers uitklappen
      const initialExpanded = {};
      expenseStructure.forEach(item => {
        if (item.isHeader) {
          initialExpanded[item.code] = true;
        }
      });
      setExpandedCategories(initialExpanded);
      
      fetchExpenses();
    }
  }, [selectedYear, isClient]);

  // Functie om alle parents van een code te vinden
  const findAllParents = (code) => {
    const parents = [];
    let currentCode = code;
    
    while (currentCode) {
      // Zoek het item in de structuur
      const item = expenseStructure.find(e => e.code === currentCode);
      if (item && item.parentCode) {
        parents.push(item.parentCode);
        currentCode = item.parentCode;
      } else {
        break;
      }
    }
    
    return parents;
  };

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('year', selectedYear);
      
      if (error) throw error;
      
      // Initialiseer een nieuwe kopie van expenses met de structuur
      const updatedExpenses = expenseStructure.map(item => ({
        ...item,
        amounts: Array(12).fill(item.initialValue || 0)
      }));
      
      // Verwerk de opgehaalde data
      if (data && data.length > 0) {
        data.forEach(expense => {
          const index = updatedExpenses.findIndex(item => item.code === expense.code);
          if (index !== -1) {
            // Update de hoeveelheid voor de specifieke maand
            const newAmounts = [...updatedExpenses[index].amounts];
            newAmounts[expense.month] = expense.amount;
            updatedExpenses[index].amounts = newAmounts;
          }
        });
      }
      
      // Nu gaan we alle parent totalen bijwerken
      updateAllParentTotals(updatedExpenses);
      
      setExpenses(updatedExpenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Functie om alle parent totalen bij te werken
  const updateAllParentTotals = (expenseArray) => {
    // Maak een set van alle parent codes
    const parentCodes = new Set();
    expenseArray.forEach(expense => {
      if (expense.parentCode) {
        parentCodes.add(expense.parentCode);
      }
    });
    
    // Reset alle parent totalen
    parentCodes.forEach(parentCode => {
      const parentIndex = expenseArray.findIndex(item => item.code === parentCode);
      if (parentIndex !== -1) {
        expenseArray[parentIndex].amounts = Array(12).fill(0);
      }
    });
    
    // Voor elke uitgave, update alle parent totalen
    expenseArray.forEach(expense => {
      // Alleen niet-parent items verwerken om dubbel tellen te voorkomen
      if (!parentCodes.has(expense.code)) {
        const parents = findAllParents(expense.code);
        parents.forEach(parentCode => {
          const parentIndex = expenseArray.findIndex(item => item.code === parentCode);
          if (parentIndex !== -1) {
            for (let month = 0; month < 12; month++) {
              expenseArray[parentIndex].amounts[month] += expense.amounts[month];
            }
          }
        });
      }
    });
  };

  const handleSaveExpense = async () => {
    if (!newExpense.code || !newExpense.description || newExpense.amount === '') {
      alert('Vul alle verplichte velden in');
      return;
    }
    
    // Converteer bedrag naar een negatief getal (als het positief is)
    const amount = parseFloat(newExpense.amount);
    const negativeAmount = amount > 0 ? -amount : amount;
    
    try {
      // Controleer of het record al bestaat
      const { data: existingData } = await supabase
        .from('expenses')
        .select('*')
        .eq('code', newExpense.code)
        .eq('month', newExpense.month)
        .eq('year', selectedYear);
      
      if (existingData && existingData.length > 0) {
        // Update bestaand record
        const { error } = await supabase
          .from('expenses')
          .update({ 
            amount: negativeAmount,
            description: newExpense.description
          })
          .eq('code', newExpense.code)
          .eq('month', newExpense.month)
          .eq('year', selectedYear);
        
        if (error) throw error;
      } else {
        // Voeg nieuw record toe
        const { error } = await supabase
          .from('expenses')
          .insert([{
            code: newExpense.code,
            description: newExpense.description,
            amount: negativeAmount,
            month: parseInt(newExpense.month),
            year: selectedYear
          }]);
        
        if (error) throw error;
      }
      
      // Herlaad de gegevens om alle totalen bij te werken
      fetchExpenses();
      
      // Reset het formulier
      setNewExpense({
        code: '',
        description: '',
        amount: '',
        month: 0
      });
    } catch (error) {
      console.error('Error saving expense:', error);
      alert(`Fout bij opslaan kosten: ${error.message}`);
    }
  };

  const handleExpenseChange = (code, month, value) => {
    // Converteer naar een negatief getal (als het positief is)
    const amount = parseFloat(value) || 0;
    const negativeAmount = amount > 0 ? -Math.abs(amount) : amount;
    
    // Vind de uitgave in de array
    const expenseIndex = expenses.findIndex(expense => expense.code === code);
    if (expenseIndex === -1) return;
    
    // Update de waarde voor de specifieke maand
    const updatedExpenses = [...expenses];
    const updatedAmounts = [...updatedExpenses[expenseIndex].amounts];
    updatedAmounts[month] = negativeAmount;
    updatedExpenses[expenseIndex].amounts = updatedAmounts;
    
    // Update alle parent totalen
    updateAllParentTotals(updatedExpenses);
    
    // Update de state
    setExpenses(updatedExpenses);
    
    // Update de database
    updateExpenseInDb(code, month, negativeAmount, updatedExpenses[expenseIndex].description);
  };

  const updateExpenseInDb = async (code, month, amount, description) => {
    try {
      // Controleer of het record al bestaat
      const { data: existingData } = await supabase
        .from('expenses')
        .select('*')
        .eq('code', code)
        .eq('month', month)
        .eq('year', selectedYear);
      
      if (existingData && existingData.length > 0) {
        // Update bestaand record
        await supabase
          .from('expenses')
          .update({ amount })
          .eq('code', code)
          .eq('month', month)
          .eq('year', selectedYear);
      } else {
        // Voeg nieuw record toe
        await supabase
          .from('expenses')
          .insert([{
            code,
            description,
            amount,
            month,
            year: selectedYear
          }]);
      }
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const toggleCategory = (code) => {
    setExpandedCategories(prev => ({
      ...prev,
      [code]: !prev[code]
    }));
  };

  const toggleAllCategories = (expanded) => {
    const newState = {};
    expenseStructure.forEach(item => {
      if (item.hasChildren) {
        newState[item.code] = expanded;
      }
    });
    setExpandedCategories(newState);
  };

  const isVisible = (expense) => {
    if (expense.isHeader) return true;
    
    if (expense.parentCode) {
      // Controleer of de directe parent is uitgeklapt
      if (!expandedCategories[expense.parentCode]) return false;
      
      // Als deze parent zelf een subitem is, controleer dan of diens parent is uitgeklapt
      const parentItem = expenses.find(item => item.code === expense.parentCode);
      if (parentItem && parentItem.parentCode) {
        return expandedCategories[parentItem.parentCode];
      }
      
      return true;
    }
    
    return false;
  };

  const getIndentLevel = (expense) => {
    if (expense.isHeader) return 0;
    
    if (expense.parentCode) {
      const parentItem = expenses.find(item => item.code === expense.parentCode);
      if (parentItem && parentItem.parentCode) {
        return 2;
      }
      return 1;
    }
    
    return 0;
  };

  // Stijl voor verschillende soorten rijen, gebaseerd op de Excel-voorbeelden
  const getRowStyle = (expense) => {
    if (expense.code === '4000') {
      return { backgroundColor: '#F8F8F8' };
    } else if (expense.isHeader) {
      return { backgroundColor: '#F0F0F0' };
    } else if (expense.isSubHeader) {
      return { backgroundColor: expense.color === 'green' ? '#E8F5E9' : '#F0F0F0' };
    }
    return {};
  };

  // Stijl voor tekst, gebaseerd op de Excel-voorbeelden
  const getTextStyle = (expense) => {
    if (expense.code.startsWith('4000') || expense.code.startsWith('4300')) {
      return { color: '#4285F4', fontWeight: 'bold', fontSize: '11px' };
    } else if (expense.isSubHeader) {
      return { color: expense.color === 'green' ? '#4CAF50' : 'inherit', fontWeight: 'medium', fontSize: '11px' };
    }
    return { fontSize: '11px' };
  };

  // Input field style
  const getInputStyle = (amount) => {
    if (amount === '#REF!') {
      return { color: 'red', fontStyle: 'italic', fontSize: '11px' };
    } else if (amount < 0) {
      return { color: 'red', fontSize: '11px' };
    }
    return { fontSize: '11px' };
  };

  if (!isClient) {
    return <Layout><div className="loading">Loading expenses...</div></Layout>;
  }

  return (
    <Layout>
      <div style={{ padding: '10px', fontSize: '11px' }}>
        <h1 style={{ fontSize: '18px', marginBottom: '8px' }}>Kosten Beheer</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <label style={{ marginRight: '5px', fontSize: '11px' }}>Jaar:</label>
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            style={{ padding: '2px', marginRight: '10px', border: '1px solid #ccc', fontSize: '11px' }}
          >
            {[2023, 2024, 2025, 2026, 2027].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          
          <button 
            onClick={() => window.print()}
            style={{ 
              padding: '2px 8px', 
              display: 'flex', 
              alignItems: 'center', 
              border: '1px solid #ccc', 
              background: '#f9f9f9',
              fontSize: '11px'
            }}
          >
            <span style={{ fontSize: '14px', marginRight: '3px' }}>⇩</span>
            Exporteren
          </button>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <h2 style={{ fontSize: '14px', marginBottom: '4px' }}>Nieuwe Kosten Toevoegen</h2>
          <p style={{ fontSize: '11px', marginBottom: '8px' }}>Voeg nieuwe kostenposten toe per grootboekrekening en maand.</p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'flex-end' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '2px', fontSize: '11px' }}>Code</label>
              <input
                type="text"
                value={newExpense.code}
                onChange={(e) => setNewExpense({...newExpense, code: e.target.value})}
                style={{ padding: '2px', width: '80px', border: '1px solid #ccc', fontSize: '11px' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '2px', fontSize: '11px' }}>Omschrijving</label>
              <input
                type="text"
                value={newExpense.description}
                onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                style={{ padding: '2px', width: '170px', border: '1px solid #ccc', fontSize: '11px' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '2px', fontSize: '11px' }}>Maand</label>
              <select
                value={newExpense.month}
                onChange={(e) => setNewExpense({...newExpense, month: e.target.value})}
                style={{ padding: '2px', width: '80px', border: '1px solid #ccc', fontSize: '11px' }}
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '2px', fontSize: '11px' }}>Bedrag</label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '2px', fontSize: '11px' }}>€</span>
                <input
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  style={{ padding: '2px', width: '100px', border: '1px solid #ccc', fontSize: '11px' }}
                  step="0.01"
                />
              </div>
            </div>
            
            <button
              onClick={handleSaveExpense}
              style={{ 
                padding: '2px 8px', 
                display: 'flex', 
                alignItems: 'center', 
                border: '1px solid #ccc', 
                background: '#f9f9f9',
                fontSize: '11px',
                height: '21px'
              }}
            >
              <span style={{ fontSize: '14px', marginRight: '3px' }}>+</span>
              Toevoegen
            </button>
          </div>
        </div>
        
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
            <h2 style={{ fontSize: '14px' }}>Kostenstructuur</h2>
            
            <div>
              <button
                onClick={() => toggleAllCategories(true)}
                style={{ 
                  padding: '1px 4px', 
                  border: '1px solid #ccc', 
                  marginRight: '4px', 
                  background: '#f9f9f9',
                  fontSize: '10px'
                }}
              >
                Alles uitklappen
              </button>
              <button
                onClick={() => toggleAllCategories(false)}
                style={{ 
                  padding: '1px 4px', 
                  border: '1px solid #ccc', 
                  background: '#f9f9f9',
                  fontSize: '10px'
                }}
              >
                Alles inklappen
              </button>
            </div>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
              <thead>
                <tr style={{ background: '#f2f2f2' }}>
                  <th style={{ padding: '4px', textAlign: 'left', border: '1px solid #ddd', width: '60px', fontSize: '11px' }}>Code</th>
                  <th style={{ padding: '4px', textAlign: 'left', border: '1px solid #ddd', width: '160px', fontSize: '11px' }}>Omschrijving</th>
                  {months.map((month, i) => (
                    <th key={i} style={{ padding: '4px', textAlign: 'center', border: '1px solid #ddd', width: '70px', fontSize: '11px' }}>{month}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {expenses.filter(isVisible).map((expense) => (
                  <tr key={expense.code} style={getRowStyle(expense)}>
                    <td style={{ padding: '2px', border: '1px solid #ddd' }}>
                      <div style={{ display: 'flex', alignItems: 'center', paddingLeft: `${getIndentLevel(expense) * 10}px` }}>
                        {expense.hasChildren && (
                          <button 
                            onClick={() => toggleCategory(expense.code)}
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              cursor: 'pointer', 
                              fontSize: '9px', 
                              marginRight: '3px',
                              padding: 0
                            }}
                          >
                            {expandedCategories[expense.code] ? '▼' : '►'}
                          </button>
                        )}
                        <span style={getTextStyle(expense)}>{expense.code}</span>
                      </div>
                    </td>
                    <td style={{ padding: '2px', border: '1px solid #ddd' }}>
                      <span style={getTextStyle(expense)}>{expense.description}</span>
                    </td>
                    {expense.amounts.map((amount, monthIndex) => (
                      <td key={monthIndex} style={{ padding: '1px', border: '1px solid #ddd' }}>
                        <input
                          type="text"
                          value={amount === '#REF!' ? '#REF!' : amount}
                          onChange={(e) => handleExpenseChange(expense.code, monthIndex, e.target.value)}
                          style={{ 
                            width: '100%', 
                            padding: '1px',
                            textAlign: 'right', 
                            border: '1px solid #eee',
                            ...getInputStyle(amount)
                          }}
                          disabled={expense.isHeader || expense.isSubHeader}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ExpensesPage;