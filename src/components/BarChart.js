// src/components/BarChart.js
import React from 'react';

const BarChart = ({ data, title }) => {
  // Vind de hoogste waarde om de schaal te bepalen
  const maxValue = Math.max(...data.map(item => item.amount));
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">{item.month}</span>
              <span className="text-sm font-medium text-gray-700">€{item.amount.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${(item.amount / maxValue) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;