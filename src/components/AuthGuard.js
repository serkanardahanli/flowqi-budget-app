import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

// Component om pagina's te beschermen tegen ongeautoriseerde toegang
const AuthGuard = ({ children, requireAdmin = false }) => {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(requireAdmin);

  useEffect(() => {
    // Auth status controleren
    const checkAuth = async () => {
      // Als we adminrechten moeten controleren
      if (requireAdmin) {
        if (user) {
          const admin = await isAdmin();
          if (!admin) {
            // Niet geautoriseerd als admin, redirect naar dashboard
            router.push('/dashboard');
            return;
          }
        } else if (!loading) {
          // Geen gebruiker en niet aan het laden, redirect naar login
          router.push(`/login?returnUrl=${router.asPath}`);
          return;
        }
        setCheckingAdmin(false);
      } else {
        // Normale gebruikerscontrole
        if (!user && !loading) {
          // Geen gebruiker en niet aan het laden, redirect naar login
          router.push(`/login?returnUrl=${router.asPath}`);
          return;
        }
      }

      setAuthorized(true);
    };

    checkAuth();
  }, [user, loading, requireAdmin, router, isAdmin]);

  // Toon een laadscherm terwijl we controleren op authenticatie
  if (loading || (!authorized) || (requireAdmin && checkingAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Toon de beveiligde content
  return <>{children}</>;
};

export default AuthGuard; 