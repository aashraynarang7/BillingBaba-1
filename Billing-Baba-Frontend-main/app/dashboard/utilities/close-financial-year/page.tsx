'use client'; // Required for React hooks

import type { NextPage } from 'next';
import React, { useState } from 'react';
import { YouTubePlayerDialog } from '../component/YouTubePlayerDialog';

// --- Icons ---
const CalendarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

// --- Restart Transaction Numbers ---
const RestartTransactionNumbers = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const transactionTypes = [
    "Invoice*", "Estimate", "Proforma Invoice", "Payment-In",
    "Delivery Challan", "Sale Order", "Purchase Order", "Credit Note"
  ];

  if (!isExpanded) {
    return (
      <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
        <h2 className="font-semibold text-gray-800 text-lg mb-2">Restart Transaction Numbers</h2>
        <p className="text-sm text-gray-500 mb-6">
          Your data remains as it is in your company and only the invoice prefixes are reset for new Financial Year after closing date.
        </p>
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-[var(--primary-red)] text-white font-semibold py-2 px-5 rounded-md hover:bg-[var(--primary-red)] transition-colors"
        >
          CHANGE PREFIXES
        </button>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
      <h2 className="font-semibold text-gray-800 text-lg mb-2">Restart Transaction Numbers</h2>
      <p className="text-sm text-gray-500 mb-6">
        Your data remains as it is in your company and only the invoice prefixes are reset for new Financial Year after closing date.
      </p>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-x-4">
          <span className="font-medium text-sm text-gray-500">Type</span>
          <span className="font-medium text-sm text-gray-500">Prefix</span>
        </div>
        {transactionTypes.map((type) => (
          <div key={type} className="grid grid-cols-2 gap-x-4 items-center">
            <label className="text-sm text-gray-700">
              {type.replace('*', '')}
              {type.includes('*') && <span className="text-red-500">*</span>}
            </label>
            <input type="text" className="border border-gray-300 rounded-md p-2 w-full text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500" />
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-8">
        <button
          onClick={() => setIsExpanded(false)}
          className="bg-gray-400 text-white font-semibold py-2 px-5 rounded-md hover:bg-gray-500 transition-colors"
        >
          CANCEL
        </button>
        <button
          className="bg-[var(--primary-red)] text-white font-semibold py-2 px-5 rounded-md hover:bg-[var(--primary-red)] transition-colors"
        >
          RESTART TXN NUMBER
        </button>
      </div>
    </div>
  );
};

// --- Backup and Start Fresh ---
const BackupAndStartFresh = () => {
  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm h-fit">
      <h2 className="font-semibold text-gray-800 text-lg mb-2">Backup all data and start fresh.</h2>
      <p className="text-sm text-gray-500 mb-6">
        All the transaction data upto the closing date will be backed up and removed from company to start all fresh. You can always access your data from the backup.
      </p>
      <div>
        <label className="block text-xs font-semibold text-cyan-600 mb-2">SELECT CLOSING DATE</label>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              defaultValue="31/08/2025"
              className="border border-gray-300 rounded-md py-2 pl-3 pr-10 w-40 text-sm focus:ring-1 focus:ring-[var(--primary-red)] focus:border-[var(--primary-red)]"
            />
            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
          </div>
          <button className="bg-[var(--primary-red)] text-white font-semibold py-2 px-5 rounded-md hover:bg-[var(--primary-red)] transition-colors">
            START FRESH
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Video Tutorial ---
const VideoTutorial = () => {
  const [language, setLanguage] = useState('Hindi');
  const videoIds = {
    Hindi: 'dQw4w9WgXcQ',
    English: 'xvFZjo5PgG0',
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
      <h2 className="font-semibold text-gray-800 text-lg mb-4">Watch how to do Close Books in Vyapar.</h2>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm text-gray-600">Watch this Video in:</span>
        <div className="flex gap-2">
          <button
            onClick={() => setLanguage('Hindi')}
            className={`py-1 px-5 rounded-md text-sm border transition-all ${language === 'Hindi' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-500 hover:bg-blue-50'}`}
          >
            Hindi
          </button>
          <button
            onClick={() => setLanguage('English')}
            className={`py-1 px-5 rounded-md text-sm border transition-all ${language === 'English' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-500 hover:bg-blue-50'}`}
          >
            English
          </button>
        </div>
      </div>

      <YouTubePlayerDialog videoId={videoIds[language as keyof typeof videoIds]}>
        <div className="relative cursor-pointer group w-full aspect-video bg-red-600 rounded-lg flex flex-col justify-between p-4 text-white overflow-hidden">
          <div className="z-10">
            <h3 className="font-bold text-xl">Close Book karein</h3>
            <h4 className="font-bold text-2xl">Financial Year 2023...</h4>
            <h3 className="font-bold text-xl">Vyapar se</h3>
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="bg-red-500 bg-opacity-80 rounded-full w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform">
              <PlayIcon />
            </div>
          </div>
          <div className="z-10 text-right">
            <p className="text-xs">1 minute me karein</p>
            <p className="text-xs">financial year close</p>
            <p className="text-xs">({language})</p>
          </div>
          <div className="absolute bottom-4 left-4 z-10 font-bold text-2xl">Vyapar</div>
        </div>
      </YouTubePlayerDialog>
    </div>
  );
};

// --- Main Page ---
const CloseBooksPage: NextPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl font-semibold text-gray-700 mb-2">CLOSE BOOKS</h1>
        <p className="text-gray-600 mb-6 border-b pb-6">
          You can select one of the following ways to <a href="#" className="text-blue-500 hover:underline">Close books</a>.
        </p>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col gap-8">
            <RestartTransactionNumbers />
            <VideoTutorial />
          </div>
          <BackupAndStartFresh />
        </div>
      </div>
    </div>
  );
};

export default CloseBooksPage;
