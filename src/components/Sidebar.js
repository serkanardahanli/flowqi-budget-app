// src/components/Sidebar.js
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Sidebar() {
  const router = useRouter();
  
  // De hoofdmenu items volgens de specificatie
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊', description: 'Overzicht statistieken' },
    { path: '/budget', label: 'Budget', icon: '💰', description: 'Scenario planning' },
    { path: '/expenses', label: 'Uitgaven', icon: '📈', description: 'Werkelijke uitgaven' },
    { path: '/sales', label: 'Sales', icon: '💎', description: 'Werkelijke omzet' },
    { path: '/crm', label: 'CRM', icon: '👥', description: 'Klantbeheer' },
    { path: '/financial-summary', label: 'Financieel', icon: '📑', description: 'Financieel overzicht' },
    { path: '/settings', label: 'Instellingen', icon: '⚙️', description: 'App instellingen' },
  ];
  
  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col overflow-hidden">
      {/* Logo en app naam */}
      <div className="h-14 flex items-center px-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="h-6 w-6 bg-pink-500 text-white rounded-md flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
              <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" />
              <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z" />
            </svg>
          </div>
          <span className="ml-2 font-medium text-gray-700">FlowQi Budget</span>
        </div>
      </div>
      
      {/* Hoofdmenu items */}
      <div className="flex-1 overflow-y-auto py-2 px-3 space-y-1">
        {menuItems.map((item) => (
          <Link key={item.path} href={item.path} passHref>
            <div className={`flex items-center px-3 py-2 rounded-md text-sm ${
              router.pathname === item.path 
                ? 'bg-gray-100 text-gray-900 font-medium' 
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}>
              <span className="mr-3 text-sm"><span className="emoji">{item.icon}</span></span>
              <span>{item.label}</span>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Gebruikersprofiel onderin */}
      <div className="p-3 border-t border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
              SA
            </div>
          </div>
          <div className="ml-3 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              Serkan Ardahanli
            </p>
            <p className="text-xs text-gray-500 truncate">
              s.ardahanli@flowqi.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}