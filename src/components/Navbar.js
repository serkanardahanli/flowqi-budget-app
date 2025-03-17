// src/components/Navbar.js
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar = () => {
  const router = useRouter();
  
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">FlowQi</span>
            </div>
            <div className="ml-10 flex items-center space-x-4">
              <Link href="/dashboard" passHref>
                <span className={`px-3 py-2 rounded-md text-sm font-medium ${router.pathname === '/dashboard' ? 'bg-blue-100 text-blue-800' : 'text-gray-500 hover:text-gray-700'} cursor-pointer`}>
                  Dashboard
                </span>
              </Link>
              <Link href="/expenses" passHref>
                <span className={`px-3 py-2 rounded-md text-sm font-medium ${router.pathname === '/expenses' ? 'bg-blue-100 text-blue-800' : 'text-gray-500 hover:text-gray-700'} cursor-pointer`}>
                  Kosten
                </span>
              </Link>
              <Link href="/sales" passHref>
                <span className={`px-3 py-2 rounded-md text-sm font-medium ${router.pathname === '/sales' ? 'bg-blue-100 text-blue-800' : 'text-gray-500 hover:text-gray-700'} cursor-pointer`}>
                  Verkoop
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;