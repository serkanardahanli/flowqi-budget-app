// src/components/SimpleNavbar.js
import React from 'react';
import Link from 'next/link';

const SimpleNavbar = () => {
  return (
    <div style={{ width: '250px', backgroundColor: 'white', height: '100vh', padding: '20px', boxShadow: '2px 0 5px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>FlowQi</h2>
      
      <nav>
        <ul>
          <li style={{ marginBottom: '10px' }}>
            <Link href="/dashboard">
              <span style={{ cursor: 'pointer', display: 'block', padding: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>Dashboard</span>
            </Link>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Link href="/expenses">
              <span style={{ cursor: 'pointer', display: 'block', padding: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>Expenses</span>
            </Link>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Link href="/projects">
              <span style={{ cursor: 'pointer', display: 'block', padding: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>Projects</span>
            </Link>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Link href="/sales">
              <span style={{ cursor: 'pointer', display: 'block', padding: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>Sales</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SimpleNavbar;