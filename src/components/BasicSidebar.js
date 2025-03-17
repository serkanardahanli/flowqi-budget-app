// src/components/BasicSidebar.js
import React from 'react';

const BasicSidebar = () => {
  return (
    <div style={{ position: 'fixed', left: 0, top: 0, width: '250px', height: '100vh', backgroundColor: '#fff', borderRight: '1px solid #eee', padding: '20px', zIndex: 10 }}>
      <h2 style={{ marginBottom: '20px' }}>FlowQi Budget</h2>
      
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ marginBottom: '10px' }}>
          <a href="/dashboard" style={{ display: 'block', padding: '10px', backgroundColor: '#f5f5f5', color: '#333', textDecoration: 'none', borderRadius: '4px' }}>
            Dashboard
          </a>
        </li>
        <li style={{ marginBottom: '10px' }}>
          <a href="/expenses" style={{ display: 'block', padding: '10px', backgroundColor: '#f5f5f5', color: '#333', textDecoration: 'none', borderRadius: '4px' }}>
            Uitgaven
          </a>
        </li>
        <li style={{ marginBottom: '10px' }}>
          <a href="/sales" style={{ display: 'block', padding: '10px', backgroundColor: '#f5f5f5', color: '#333', textDecoration: 'none', borderRadius: '4px' }}>
            Verkoop
          </a>
        </li>
      </ul>
    </div>
  );
};

export default BasicSidebar;