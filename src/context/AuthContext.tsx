"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  profile: any | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  profile: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthChange(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleAuthChange(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAuthChange = async (user: User | null) => {
    setUser(user);
    const ADMIN_EMAILS = ["l47idkpro@gmail.com", "jarysucksatgames@gmail.com"];
    
    if (user) {
      // Set isAdmin immediately based on email if needed, or wait for profile
      if (ADMIN_EMAILS.includes(user.email || "")) {
        setIsAdmin(true);
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle(); // Use maybeSingle to avoid error if trigger is slightly delayed
        
        if (data && !error) {
          setProfile(data);
          setIsAdmin(data.role === 'admin' || ADMIN_EMAILS.includes(user.email || ""));
        } else {
          // Fallback if profile doesn't exist yet (trigger delay)
          setProfile({ email: user.email, role: ADMIN_EMAILS.includes(user.email || "") ? 'admin' : 'member' });
          setIsAdmin(ADMIN_EMAILS.includes(user.email || ""));
        }
      } catch (err) {
        console.error("Auth profile fetch error:", err);
        if (ADMIN_EMAILS.includes(user.email || "")) {
          setIsAdmin(true);
          setProfile({ role: 'admin', email: user.email });
        } else {
          setProfile(null);
          setIsAdmin(false);
        }
      }
    } else {
      setProfile(null);
      setIsAdmin(false);
    }
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, profile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
