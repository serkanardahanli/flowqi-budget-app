// src/components/SimpleLayout.js
import React from 'react';
import SimpleNavbar from './SimpleNavbar';

const SimpleLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <SimpleNavbar />
      <main style={{ flexGrow: 1, padding: '20px', backgroundColor: '#f9fafb' }}>
        {children}
      </main>
    </div>
  );
};

export default SimpleLayout;