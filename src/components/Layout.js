// src/components/Layout.js
import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../contexts/AuthContext';

export default function Layout({ children, requireAuth = true, requireAdmin = false }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 pl-64">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

// Helper functie om pagina layout toe te passen op Next.js pagina's
Layout.getLayout = (page, requireAuth = true, requireAdmin = false) => {
  // Geen recursie meer, we geven direct het page object door
  return (
    <Layout requireAuth={requireAuth} requireAdmin={requireAdmin}>
      {page}
    </Layout>
  );
};