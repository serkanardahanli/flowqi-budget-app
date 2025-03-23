import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Login gebruiker met email en wachtwoord
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      router.push('/dashboard');
    } catch (error) {
      setMessage(error.message || 'Er is een fout opgetreden bij het inloggen.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Eerst controleren of de gebruiker al een account heeft
      const checkUserExists = async (email) => {
        // In de echte implementatie zou je hier een check doen via supabase
        // Bijvoorbeeld: await supabase.from('profiles').select('*').eq('email', email)
        return false; // Simuleren dat de gebruiker niet bestaat
      };

      // Als de gebruiker nog niet bestaat, stuur naar registratiepagina
      if (!await checkUserExists()) {
        router.push('/register?provider=google');
        return;
      }

      // Als gebruiker wel bestaat, doorgaan met inloggen
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) throw error;
    } catch (error) {
      setMessage(error.message || 'Er is een fout opgetreden bij het inloggen met Google.');
    }
  };

  const handleMicrosoftLogin = async () => {
    try {
      // Eerst controleren of de gebruiker al een account heeft
      const checkUserExists = async (email) => {
        // In de echte implementatie zou je hier een check doen via supabase
        return false; // Simuleren dat de gebruiker niet bestaat
      };

      // Als de gebruiker nog niet bestaat, stuur naar registratiepagina
      if (!await checkUserExists()) {
        router.push('/register?provider=microsoft');
        return;
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) throw error;
    } catch (error) {
      setMessage(error.message || 'Er is een fout opgetreden bij het inloggen met Microsoft.');
    }
  };

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    padding: '1rem'
  };

  const formContainerStyle = {
    maxWidth: '400px',
    width: '100%',
    padding: '2rem',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white',
    margin: '0 auto'
  };

  const logoContainerStyle = {
    textAlign: 'center',
    marginBottom: '1.5rem'
  };

  const titleStyle = {
    marginTop: '1.5rem',
    textAlign: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#111827'
  };

  const subtitleStyle = {
    marginTop: '0.5rem',
    textAlign: 'center',
    fontSize: '0.875rem',
    color: '#6b7280'
  };

  const inputContainerStyle = {
    marginTop: '2rem',
    marginBottom: '1.5rem'
  };

  const inputStyle = {
    display: 'block',
    width: '100%',
    padding: '0.75rem',
    borderRadius: '0.375rem',
    border: '1px solid #d1d5db',
    marginBottom: '0.75rem'
  };

  const checkboxContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem'
  };

  const rememberMeStyle = {
    display: 'flex',
    alignItems: 'center'
  };

  const buttonStyle = {
    display: 'block',
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#8b5cf6',
    color: 'white',
    borderRadius: '0.375rem',
    fontWeight: '500',
    textAlign: 'center',
    cursor: 'pointer',
    border: 'none'
  };

  const dividerStyle = {
    position: 'relative',
    marginTop: '1.5rem',
    marginBottom: '1.5rem',
    textAlign: 'center'
  };

  const dividerLineStyle = {
    borderTop: '1px solid #e5e7eb',
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0
  };

  const dividerTextStyle = {
    position: 'relative',
    display: 'inline-block',
    padding: '0 0.5rem',
    backgroundColor: 'white',
    color: '#6b7280',
    fontSize: '0.875rem'
  };

  const socialButtonsStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
    marginTop: '1.5rem'
  };

  const socialButtonStyle = {
    display: 'flex',
    justifyContent: 'center',
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    backgroundColor: 'white',
    cursor: 'pointer'
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <div style={logoContainerStyle}>
          <svg width="190" height="195" viewBox="0 0 97 99" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.0872803 0.763474L73.4939 48.3782L55.4226 60.1215L19.0009 43.7102L0.0872803 0.763474Z" fill="#C449FF"/>
            <path d="M55.4222 60.1216L42.9477 98.0844L32.7399 74.8255L55.4222 60.1216Z" fill="#9280FF"/>
            <path d="M45.0243 23.9556L63.4863 35.8824L67.4226 24.0639L96.7653 26.804L53.8197 7.4872L45.0243 23.9556Z" fill="#9280FF"/>
          </svg>
        </div>
        
        <h2 style={titleStyle}>Log in bij uw account</h2>
        <p style={subtitleStyle}>
          Of{' '}
          <Link href="/register" style={{color: '#8b5cf6', fontWeight: '500'}}>
            registreer een nieuw account
          </Link>
        </p>
        
        {message && (
          <div style={{
            padding: '1rem',
            borderRadius: '0.375rem',
            marginTop: '1rem',
            backgroundColor: message.includes('fout') ? '#fee2e2' : '#ecfdf5',
            color: message.includes('fout') ? '#b91c1c' : '#065f46'
          }}>
            <p style={{fontSize: '0.875rem'}}>{message}</p>
          </div>
        )}

        <form onSubmit={handleLogin} style={inputContainerStyle}>
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            style={inputStyle}
            placeholder="Email adres"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            style={inputStyle}
            placeholder="Wachtwoord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div style={checkboxContainerStyle}>
            <div style={rememberMeStyle}>
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{marginRight: '0.5rem'}}
              />
              <label htmlFor="remember-me" style={{fontSize: '0.875rem', color: '#111827'}}>
                Onthoud mij
              </label>
            </div>

            <div>
              <a href="#" style={{fontSize: '0.875rem', color: '#8b5cf6', fontWeight: '500'}}>
                Wachtwoord vergeten?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={buttonStyle}
          >
            {loading ? 'Bezig met inloggen...' : 'Inloggen'}
          </button>
        </form>

        <div style={dividerStyle}>
          <div style={dividerLineStyle}></div>
          <span style={dividerTextStyle}>Of login met</span>
        </div>

        <div style={socialButtonsStyle}>
          <button
            type="button"
            onClick={handleGoogleLogin}
            style={socialButtonStyle}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          </button>

          <button
            type="button"
            onClick={handleMicrosoftLogin}
            style={socialButtonStyle}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <rect width="11" height="11" fill="#F25022" />
              <rect x="12" width="11" height="11" fill="#7FBA00" />
              <rect y="12" width="11" height="11" fill="#00A4EF" />
              <rect x="12" y="12" width="11" height="11" fill="#FFB900" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 