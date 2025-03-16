import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  description?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, description }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
  );
};

export default SummaryCard;
