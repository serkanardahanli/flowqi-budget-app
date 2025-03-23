import React, { useState } from 'react';

const BudgetTable: React.FC = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
  
  // Voorbeeld categorieën voor uitgaven
  const expenseCategories = [
    { id: 1, name: 'Personeel', type: 'expense' },
    { id: 2, name: 'Kantoor', type: 'expense' },
    { id: 3, name: 'Marketing', type: 'expense' },
    { id: 4, name: 'Software', type: 'expense' },
    { id: 5, name: 'Overige kosten', type: 'expense' },
  ];
  
  // Voorbeeld categorieën voor inkomsten
  const revenueCategories = [
    { id: 101, name: 'Consultancy - Project A', type: 'revenue', category: 'consultancy' },
    { id: 102, name: 'Consultancy - Project B', type: 'revenue', category: 'consultancy' },
    { id: 201, name: 'SaaS - Basis module', type: 'revenue', category: 'saas' },
    { id: 202, name: 'SaaS - Pro module', type: 'revenue', category: 'saas' },
    { id: 203, name: 'SaaS - Enterprise module', type: 'revenue', category: 'saas' },
  ];
  
  // Voorbeeld budgetdata (in een echte app zou dit uit een database komen)
  const [budgetData, setBudgetData] = useState({
    expenses: expenseCategories.map(cat => ({
      ...cat,
      monthly: Array(12).fill(0),
      total: 0
    })),
    revenue: revenueCategories.map(cat => ({
      ...cat,
      monthly: Array(12).fill(0),
      total: 0
    }))
  });
  
  // Functie om een budgetwaarde te updaten
  const updateBudgetValue = (type: string, categoryId: string, monthIndex: number, value: string) => {
    const numValue = Number(value) || 0;
    
    setBudgetData(prev => {
      const newData = { ...prev };
      const categoryArray = type === 'expense' ? 'expenses' : 'revenue';
      const categoryIndex = newData[categoryArray].findIndex(cat => cat.id.toString() === categoryId);
      
      if (categoryIndex !== -1) {
        // Update de specifieke maandwaarde
        newData[categoryArray][categoryIndex].monthly[monthIndex] = numValue;
        
        // Herbereken het totaal
        newData[categoryArray][categoryIndex].total = newData[categoryArray][categoryIndex].monthly.reduce((sum, val) => sum + val, 0);
      }
      
      return newData;
    });
  };
  
  // Bereken totalen per maand voor uitgaven en inkomsten
  const calculateMonthlyTotals = (type: string) => {
    const categoryArray = type === 'expense' ? budgetData.expenses : budgetData.revenue;
    return months.map((_, monthIndex) => {
      return categoryArray.reduce((sum, category) => sum + (category.monthly[monthIndex] || 0), 0);
    });
  };
  
  const expenseMonthlyTotals = calculateMonthlyTotals('expense');
  const revenueMonthlyTotals = calculateMonthlyTotals('revenue');
  
  // Bereken totale uitgaven en inkomsten
  const totalExpenses = expenseMonthlyTotals.reduce((sum, val) => sum + val, 0);
  const totalRevenue = revenueMonthlyTotals.reduce((sum, val) => sum + val, 0);
  
  // Bereken resultaat (inkomsten - uitgaven) per maand
  const resultMonthly = months.map((_, i) => revenueMonthlyTotals[i] - expenseMonthlyTotals[i]);
  const totalResult = totalRevenue - totalExpenses;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6 overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Budget {currentYear}</h2>
        <div className="flex space-x-2">
          <button 
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => setCurrentYear(currentYear - 1)}
          >
            &lt;
          </button>
          <span className="px-3 py-1">{currentYear}</span>
          <button 
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => setCurrentYear(currentYear + 1)}
          >
            &gt;
          </button>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2 text-blue-600">Inkomsten</h3>
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-3 text-left">Categorie</th>
              {months.map((month, i) => (
                <th key={i} className="py-2 px-3 text-right">{month}</th>
              ))}
              <th className="py-2 px-3 text-right">Totaal</th>
            </tr>
          </thead>
          <tbody>
            {budgetData.revenue.map((category, catIndex) => (
              <tr key={category.id} className="border-t">
                <td className="py-2 px-3">{category.name}</td>
                {months.map((_, monthIndex) => (
                  <td key={monthIndex} className="py-2 px-3">
                    <input
                      type="number"
                      className="w-full text-right border rounded px-2 py-1"
                      value={category.monthly[monthIndex]}
                      onChange={(e) => updateBudgetValue('revenue', category.id.toString(), monthIndex, e.target.value)}
                    />
                  </td>
                ))}
                <td className="py-2 px-3 text-right font-semibold">€{category.total.toLocaleString()}</td>
              </tr>
            ))}
            <tr className="bg-blue-50 font-semibold">
              <td className="py-2 px-3">Totaal Inkomsten</td>
              {revenueMonthlyTotals.map((total, i) => (
                <td key={i} className="py-2 px-3 text-right">€{total.toLocaleString()}</td>
              ))}
              <td className="py-2 px-3 text-right">€{totalRevenue.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2 text-red-600">Uitgaven</h3>
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-3 text-left">Categorie</th>
              {months.map((month, i) => (
                <th key={i} className="py-2 px-3 text-right">{month}</th>
              ))}
              <th className="py-2 px-3 text-right">Totaal</th>
            </tr>
          </thead>
          <tbody>
            {budgetData.expenses.map((category, catIndex) => (
              <tr key={category.id} className="border-t">
                <td className="py-2 px-3">{category.name}</td>
                {months.map((_, monthIndex) => (
                  <td key={monthIndex} className="py-2 px-3">
                    <input
                      type="number"
                      className="w-full text-right border rounded px-2 py-1"
                      value={category.monthly[monthIndex]}
                      onChange={(e) => updateBudgetValue('expense', category.id.toString(), monthIndex, e.target.value)}
                    />
                  </td>
                ))}
                <td className="py-2 px-3 text-right font-semibold">€{category.total.toLocaleString()}</td>
              </tr>
            ))}
            <tr className="bg-red-50 font-semibold">
              <td className="py-2 px-3">Totaal Uitgaven</td>
              {expenseMonthlyTotals.map((total, i) => (
                <td key={i} className="py-2 px-3 text-right">€{total.toLocaleString()}</td>
              ))}
              <td className="py-2 px-3 text-right">€{totalExpenses.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2 text-green-600">Resultaat</h3>
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-3 text-left">Categorie</th>
              {months.map((month, i) => (
                <th key={i} className="py-2 px-3 text-right">{month}</th>
              ))}
              <th className="py-2 px-3 text-right">Totaal</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-green-50 font-semibold">
              <td className="py-2 px-3">Resultaat</td>
              {resultMonthly.map((total, i) => (
                <td key={i} className="py-2 px-3 text-right" style={{ color: total >= 0 ? 'green' : 'red' }}>
                  €{total.toLocaleString()}
                </td>
              ))}
              <td className="py-2 px-3 text-right" style={{ color: totalResult >= 0 ? 'green' : 'red' }}>
                €{totalResult.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BudgetTable;