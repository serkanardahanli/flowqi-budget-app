// src/components/PieChart.js
import React from 'react';

const COLORS = [
  'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
  'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-red-500'
];

const PieChart = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
      
      <div className="flex flex-col space-y-2">
        {data.map((item, index) => {
          const percentage = ((item.value / total) * 100).toFixed(1);
          return (
            <div key={index} className="flex items-center">
              <div className={`w-4 h-4 ${COLORS[index % COLORS.length]} rounded mr-2`}></div>
              <span className="text-sm text-gray-700 flex-1">{item.name}</span>
              <span className="text-sm font-medium">€{item.value.toLocaleString()} ({percentage}%)</span>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 flex justify-center">
        <div className="w-32 h-32 rounded-full border-4 border-gray-200 relative">
          {data.map((item, index) => {
            // Een zeer eenvoudige pie chart visualisatie
            // Voor een echte app zou je hier een library zoals Chart.js of Recharts gebruiken
            const startAngle = index > 0 
              ? data.slice(0, index).reduce((sum, d) => sum + (d.value / total) * 360, 0) 
              : 0;
            const angle = (item.value / total) * 360;
            
            return (
              <div 
                key={index}
                className={`absolute inset-0 ${COLORS[index % COLORS.length]}`}
                style={{
                  clipPath: `polygon(50% 50%, 50% 0%, ${startAngle > 90 ? '100% 0%, 100% 100%, 0% 100%, 0% 0%,' : ''} ${50 + 50 * Math.cos((startAngle + angle) * Math.PI / 180)}% ${50 - 50 * Math.sin((startAngle + angle) * Math.PI / 180)}%)`
                }}
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PieChart;