import React from 'react';
import SummaryCard from '../components/SummaryCard';
import BudgetTable from '../components/BudgetTable';
import LiquidityWidget from '../components/LiquidityWidget';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title="Totale Inkomsten" value="€150,000" />
        <SummaryCard title="Totale Uitgaven" value="€100,000" />
        <SummaryCard title="Netto Resultaat" value="€50,000" />
      </div>
      <div className="mt-6">
        <BudgetTable />
      </div>
      <div className="mt-6">
        <LiquidityWidget />
      </div>
    </div>
  );
};

export default Dashboard;
