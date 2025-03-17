// src/components/Layout.js
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Layout({ children }) {
  const router = useRouter();
  const currentPath = router.pathname;
  
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{ 
        width: '250px', 
        backgroundColor: '#f5f5f5', 
        padding: '20px', 
        borderRight: '1px solid #e0e0e0' 
      }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
          FlowQi Budget
        </div>
        
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '10px' }}>
              <Link href="/dashboard" 
                style={{ 
                  textDecoration: 'none', 
                  display: 'block',
                  padding: '10px',
                  backgroundColor: currentPath === '/dashboard' ? '#e0e0e0' : 'transparent',
                  color: '#333',
                  borderRadius: '4px'
                }}
              >
                Dashboard
              </Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link href="/expenses" 
                style={{ 
                  textDecoration: 'none', 
                  display: 'block',
                  padding: '10px',
                  backgroundColor: currentPath === '/expenses' ? '#e0e0e0' : 'transparent',
                  color: '#333',
                  borderRadius: '4px'
                }}
              >
                Uitgaven
              </Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link href="/sales" 
                style={{ 
                  textDecoration: 'none', 
                  display: 'block',
                  padding: '10px',
                  backgroundColor: currentPath === '/sales' ? '#e0e0e0' : 'transparent',
                  color: '#333',
                  borderRadius: '4px'
                }}
              >
                Verkoop
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Content */}
      <div style={{ flexGrow: 1, padding: '0' }}>
        {children}
      </div>
    </div>
  );
}