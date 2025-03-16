import React from 'react';

const LiquidityWidget = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h3 className="text-lg font-semibold text-gray-700">Liquiditeitsoverzicht</h3>
      <p className="text-xl font-bold text-green-600 mt-2">€ 85.000</p>
      <p className="text-sm text-gray-500">Voorspelde cashflow komende 3 maanden: <span className="text-blue-500">€ 120.000</span></p>
    </div>
  );
};

export default LiquidityWidget;