// src/components/NavLayout.js
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const NavLayout = ({ children }) => {
  const router = useRouter();
  
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: '240px', backgroundColor: '#fff', borderRight: '1px solid #e5e7eb', padding: '16px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>FlowQi</h2>
        </div>
        
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '8px' }}>
              <Link href="/dashboard" passHref legacyBehavior>
                <a style={{ 
                  display: 'block', 
                  padding: '8px 12px', 
                  borderRadius: '6px',
                  backgroundColor: router.pathname === '/dashboard' ? '#f3f4f6' : 'transparent',
                  color: '#111827',
                  textDecoration: 'none',
                  fontWeight: router.pathname === '/dashboard' ? 'bold' : 'normal'
                }}>
                  Dashboard
                </a>
              </Link>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Link href="/expenses" passHref legacyBehavior>
                <a style={{ 
                  display: 'block', 
                  padding: '8px 12px', 
                  borderRadius: '6px',
                  backgroundColor: router.pathname === '/expenses' ? '#f3f4f6' : 'transparent',
                  color: '#111827',
                  textDecoration: 'none',
                  fontWeight: router.pathname === '/expenses' ? 'bold' : 'normal'
                }}>
                  Uitgaven
                </a>
              </Link>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Link href="/projects" passHref legacyBehavior>
                <a style={{ 
                  display: 'block', 
                  padding: '8px 12px', 
                  borderRadius: '6px',
                  backgroundColor: router.pathname === '/projects' ? '#f3f4f6' : 'transparent',
                  color: '#111827',
                  textDecoration: 'none',
                  fontWeight: router.pathname === '/projects' ? 'bold' : 'normal'
                }}>
                  Projecten
                </a>
              </Link>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Link href="/sales" passHref legacyBehavior>
                <a style={{ 
                  display: 'block', 
                  padding: '8px 12px', 
                  borderRadius: '6px',
                  backgroundColor: router.pathname === '/sales' ? '#f3f4f6' : 'transparent',
                  color: '#111827',
                  textDecoration: 'none',
                  fontWeight: router.pathname === '/sales' ? 'bold' : 'normal'
                }}>
                  Verkoop
                </a>
              </Link>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Link href="/forecast" passHref legacyBehavior>
                <a style={{ 
                  display: 'block', 
                  padding: '8px 12px', 
                  borderRadius: '6px',
                  backgroundColor: router.pathname === '/forecast' ? '#f3f4f6' : 'transparent',
                  color: '#111827',
                  textDecoration: 'none',
                  fontWeight: router.pathname === '/forecast' ? 'bold' : 'normal'
                }}>
                  Prognose
                </a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Page content */}
      <div style={{ flexGrow: 1, padding: '16px' }}>
        {children}
      </div>
    </div>
  );
};

export default NavLayout;