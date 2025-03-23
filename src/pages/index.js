// src/pages/index.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  // Roep useAuth aan op top-level, niet binnen useEffect
  const { user, loading } = useAuth();
  
  useEffect(() => {
    // Als de auth status is geladen, stuur dan door naar de juiste pagina
    if (!loading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);
  
  // Toon een laadscherm totdat we doorverwijzen
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="animate-pulse">
          <h1 className="text-2xl font-bold mb-4">FlowQi Budget App</h1>
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    </div>
  );
}

// Geen Layout gebruiken op deze pagina
Home.getLayout = (page) => page;