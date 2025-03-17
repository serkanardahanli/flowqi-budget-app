// src/components/layout/Sidebar.js
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Sidebar = () => {
  const router = useRouter();

  return (
    <div className="w-60 bg-white shadow-md h-screen flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b flex items-center space-x-2">
        <div className="h-8 w-8 rounded-md bg-gradient-to-br from-pink-500 to-pink-400 flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        </div>
        <span className="text-pink-500 font-semibold">Project Management</span>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-2">
          <Link href="/dashboard" legacyBehavior>
            <a className={`flex items-center p-2 rounded-md ${router.pathname === '/dashboard' ? 'bg-purple-100 text-purple-800' : 'text-gray-700 hover:bg-gray-100'}`}>
              <div className="w-5 h-5 mr-3 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span>Home</span>
            </a>
          </Link>

          <Link href="/expenses" legacyBehavior>
            <a className={`flex items-center p-2 rounded-md ${router.pathname === '/expenses' ? 'bg-purple-100 text-purple-800' : 'text-gray-700 hover:bg-gray-100'}`}>
              <div className="w-5 h-5 mr-3 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span>Expenses</span>
            </a>
          </Link>

          <Link href="/projects" legacyBehavior>
            <a className={`flex items-center p-2 rounded-md ${router.pathname === '/projects' ? 'bg-purple-100 text-purple-800' : 'text-gray-700 hover:bg-gray-100'}`}>
              <div className="w-5 h-5 mr-3 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span>Projects</span>
            </a>
          </Link>

          <Link href="/clients" legacyBehavior>
            <a className={`flex items-center p-2 rounded-md ${router.pathname === '/clients' ? 'bg-purple-100 text-purple-800' : 'text-gray-700 hover:bg-gray-100'}`}>
              <div className="w-5 h-5 mr-3 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <span>Clients</span>
            </a>
          </Link>

          <Link href="/forecast" legacyBehavior>
            <a className={`flex items-center p-2 rounded-md ${router.pathname === '/forecast' ? 'bg-purple-100 text-purple-800' : 'text-gray-700 hover:bg-gray-100'}`}>
              <div className="w-5 h-5 mr-3 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span>Forecast</span>
            </a>
          </Link>

          <Link href="/marketing" legacyBehavior>
            <a className={`flex items-center p-2 rounded-md ${router.pathname === '/marketing' ? 'bg-purple-100 text-purple-800' : 'text-gray-700 hover:bg-gray-100'}`}>
              <div className="w-5 h-5 mr-3 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <span>Marketing</span>
            </a>
          </Link>

          <Link href="/invoicing" legacyBehavior>
            <a className={`flex items-center p-2 rounded-md ${router.pathname === '/invoicing' ? 'bg-purple-100 text-purple-800' : 'text-gray-700 hover:bg-gray-100'}`}>
              <div className="w-5 h-5 mr-3 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span>Invoicing</span>
            </a>
          </Link>

          <Link href="/sales" legacyBehavior>
            <a className={`flex items-center p-2 rounded-md ${router.pathname === '/sales' ? 'bg-purple-100 text-purple-800' : 'text-gray-700 hover:bg-gray-100'}`}>
              <div className="w-5 h-5 mr-3 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span>Sales</span>
            </a>
          </Link>
        </nav>
      </div>

      {/* Footer */}
      <div className="mt-auto border-t p-4">
        <div className="flex items-center p-2 text-sm text-gray-600">
          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-yellow-500 text-white text-sm mr-2">?</div>
          <span>Help Center</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;