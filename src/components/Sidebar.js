// src/components/Sidebar.js
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Sidebar = () => {
  const router = useRouter();
  
  return (
    <div style={{ 
      width: '250px', 
      backgroundColor: '#f5f5f5', 
      padding: '20px', 
      borderRight: '1px solid #e0e0e0',
      minHeight: '100vh'
    }}>
      <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
        FlowQi Budget
      </div>
      
      <nav>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li style={{ marginBottom: '10px' }}>
            <Link href="/dashboard" legacyBehavior>
              <a style={{ 
                textDecoration: 'none', 
                display: 'block',
                padding: '10px',
                backgroundColor: router.pathname === '/dashboard' ? '#e0e0e0' : 'transparent',
                color: '#333',
                borderRadius: '4px'
              }}>
                Dashboard
              </a>
            </Link>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Link href="/expenses" legacyBehavior>
              <a style={{ 
                textDecoration: 'none', 
                display: 'block',
                padding: '10px',
                backgroundColor: router.pathname === '/expenses' ? '#e0e0e0' : 'transparent',
                color: '#333',
                borderRadius: '4px'
              }}>
                Uitgaven
              </a>
            </Link>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Link href="/sales" legacyBehavior>
              <a style={{ 
                textDecoration: 'none', 
                display: 'block',
                padding: '10px',
                backgroundColor: router.pathname === '/sales' ? '#e0e0e0' : 'transparent',
                color: '#333',
                borderRadius: '4px'
              }}>
                Verkoop
              </a>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;