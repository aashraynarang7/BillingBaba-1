// src/app/sales/components/SummaryCard.tsx
import React from 'react';

interface SummaryCardProps {
  title: string;
  amount: number;
  received: number;
  balance: number;
}

const SummaryCard = ({ title, amount, received, balance }: SummaryCardProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 w-full max-w-xs">
      <p className="text-sm text-gray-500 mb-2">{title}</p>
      <p className="text-3xl font-bold text-gray-800 mb-4">
        ₹ {amount.toLocaleString('en-IN')}
      </p>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Received: <span className="font-semibold text-green-600">₹ {received.toLocaleString('en-IN')}</span></span>
        <span className="text-gray-600">Balance: <span className="font-semibold text-red-600">₹ {balance.toLocaleString('en-IN')}</span></span>
      </div>
    </div>
  );
};

export default SummaryCard;