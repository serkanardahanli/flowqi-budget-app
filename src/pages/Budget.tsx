import React from 'react';
import BudgetTable from '../components/BudgetTable';

const Budget = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Budgetoverzicht</h1>
      <BudgetTable />
    </div>
  );
};

export default Budget;