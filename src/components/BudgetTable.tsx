import React from 'react';

const LiquidityWidget: React.FC = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-lg font-bold">Liquide Middelen</h2>
      <p className="text-2xl font-bold text-gray-900">€50,000</p>
      <p className="text-sm text-gray-500">Verwachte cashflow komende 3 maanden</p>
    </div>
  );
};

export default LiquidityWidget;