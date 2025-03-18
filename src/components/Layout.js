// src/components/Layout.js
import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      
      <div style={{ flexGrow: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default Layout;