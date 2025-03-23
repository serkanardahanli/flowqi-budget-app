import React, { useState } from 'react';
import BudgetTable from '../components/BudgetTable';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabaseClient';

const Budget = () => {
  const [activeScenario, setActiveScenario] = useState('default');
  const [scenarios, setScenarios] = useState([
    { id: 'default', name: 'Standaard' },
    { id: 'optimistic', name: 'Optimistisch' },
    { id: 'pessimistic', name: 'Pessimistisch' }
  ]);
  const [showNewScenarioForm, setShowNewScenarioForm] = useState(false);
  const [newScenarioName, setNewScenarioName] = useState('');
  
  // Functie om een nieuw scenario toe te voegen
  const addNewScenario = () => {
    if (newScenarioName.trim()) {
      const newScenarioId = newScenarioName.toLowerCase().replace(/\s+/g, '-');
      setScenarios([
        ...scenarios,
        { id: newScenarioId, name: newScenarioName.trim() }
      ]);
      setActiveScenario(newScenarioId);
      setNewScenarioName('');
      setShowNewScenarioForm(false);
    }
  };
  
  // In een echte applicatie zouden we het budget opslaan bij het veranderen van scenario
  const saveCurrentBudget = async () => {
    try {
      // Mock functie voor het opslaan van het budget
      console.log(`Budget opgeslagen voor scenario: ${activeScenario}`);
      
      // Echte implementatie zou een Supabase update doen, bijv:
      // const { error } = await supabase
      //  .from('budgets')
      //  .upsert({
      //    scenario_id: activeScenario,
      //    budget_data: { /* budgetgegevens */ }
      //  });
      
      alert('Budget succesvol opgeslagen!');
    } catch (error) {
      console.error('Fout bij opslaan budget:', error);
      alert('Er is een fout opgetreden bij het opslaan van het budget.');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Budgetplanning</h1>
        <div className="flex space-x-3">
          <button 
            onClick={saveCurrentBudget}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Budget opslaan
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Scenario selecteren</h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {scenarios.map(scenario => (
            <button
              key={scenario.id}
              onClick={() => setActiveScenario(scenario.id)}
              className={`px-4 py-2 rounded-md ${
                activeScenario === scenario.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {scenario.name}
            </button>
          ))}
          
          {!showNewScenarioForm && (
            <button
              onClick={() => setShowNewScenarioForm(true)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md border border-dashed border-gray-400 hover:bg-gray-200"
            >
              + Nieuw scenario
            </button>
          )}
        </div>
        
        {showNewScenarioForm && (
          <div className="flex items-center gap-2 mt-3">
            <input
              type="text"
              value={newScenarioName}
              onChange={e => setNewScenarioName(e.target.value)}
              placeholder="Scenario naam"
              className="border rounded-md px-3 py-2 w-64"
              autoFocus
            />
            <button
              onClick={addNewScenario}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Toevoegen
            </button>
            <button
              onClick={() => {
                setShowNewScenarioForm(false);
                setNewScenarioName('');
              }}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Annuleren
            </button>
          </div>
        )}
        
        <p className="text-sm text-gray-500 mt-2">
          Actief scenario: <span className="font-semibold">{scenarios.find(s => s.id === activeScenario)?.name}</span>
          {activeScenario !== 'default' && (
            <button
              onClick={() => {
                if (confirm('Weet je zeker dat je dit scenario wilt verwijderen?')) {
                  setScenarios(scenarios.filter(s => s.id !== activeScenario));
                  setActiveScenario('default');
                }
              }}
              className="ml-3 text-red-500 hover:text-red-700"
            >
              Verwijder scenario
            </button>
          )}
        </p>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Budget instellingen</h2>
        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Consultancy uurtarief
              </label>
              <div className="flex items-center">
                <span className="mr-2">€</span>
                <input 
                  type="number" 
                  className="border rounded-md px-3 py-2 w-32" 
                  defaultValue="95"
                />
                <span className="ml-2">per uur</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SaaS marge
              </label>
              <div className="flex items-center">
                <input 
                  type="number" 
                  className="border rounded-md px-3 py-2 w-20" 
                  defaultValue="85"
                />
                <span className="ml-2">%</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verwachte consultancy uren per maand
              </label>
              <input 
                type="number" 
                className="border rounded-md px-3 py-2 w-32" 
                defaultValue="160"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verwachte SaaS groei per maand
              </label>
              <div className="flex items-center">
                <input 
                  type="number" 
                  className="border rounded-md px-3 py-2 w-20" 
                  defaultValue="5"
                />
                <span className="ml-2">%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <BudgetTable />
    </div>
  );
};

export default Budget;

// Voeg getLayout functie toe voor consistente layout
Budget.getLayout = (page: React.ReactElement) => Layout.getLayout(page);