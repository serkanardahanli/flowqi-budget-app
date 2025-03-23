import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Luister naar auth changes
    const subscription = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    
    // Check voor bestaande sessie bij laden
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setUser(data.session.user);
      }
      setLoading(false);
    };
    
    checkUser();
    
    return () => subscription.unsubscribe();
  }, []);

  // Functie om gebruiker uit te loggen
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  // Profielgegevens ophalen
  const getUserProfile = async () => {
    try {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error.message);
      return null;
    }
  };

  // Profielgegevens bijwerken
  const updateUserProfile = async (updates) => {
    try {
      if (!user) throw new Error('Gebruiker niet ingelogd');
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user profile:', error.message);
      throw error;
    }
  };

  // Check of de gebruiker admin is (voor toegangscontrole)
  const isAdmin = async () => {
    try {
      if (!user) return false;
      
      const profile = await getUserProfile();
      return profile?.role === 'admin';
    } catch (error) {
      console.error('Error checking admin status:', error.message);
      return false;
    }
  };

  // Value object met user state, loading state en functies
  const value = {
    user,
    session,
    loading,
    signOut,
    getUserProfile,
    updateUserProfile,
    isAdmin,
    signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
    signUp: (email, password) => supabase.auth.signUp({ email, password })
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook om de auth context te gebruiken
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth moet binnen een AuthProvider worden gebruikt');
  }
  return context;
};

export default AuthContext; 