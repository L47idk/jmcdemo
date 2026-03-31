"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  profile: any | null;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  profile: null,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const lastUserId = React.useRef<string | null>(null);

  const fetchProfile = async (currentUser: User) => {
    const adminEmailsEnv = process.env.NEXT_PUBLIC_ADMIN_EMAILS || "l47idkpro@gmail.com,jarysucksatgames@gmail.com";
    const ADMIN_EMAILS = adminEmailsEnv.split(',').map(e => e.trim());
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();
      
      if (data && !error) {
        setProfile({
          ...data,
          full_name: data.full_name || currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || ""
        });
        setIsAdmin(data.role === 'admin' || ADMIN_EMAILS.includes(currentUser.email || ""));
      } else {
        setProfile({ 
          email: currentUser.email, 
          full_name: currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || "",
          role: ADMIN_EMAILS.includes(currentUser.email || "") ? 'admin' : 'member' 
        });
        setIsAdmin(ADMIN_EMAILS.includes(currentUser.email || ""));
      }
    } catch (err) {
      console.error("AuthContext: Profile fetch exception:", err);
      if (ADMIN_EMAILS.includes(currentUser.email || "")) {
        setIsAdmin(true);
        setProfile({ 
          role: 'admin', 
          email: currentUser.email,
          full_name: currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || ""
        });
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
    }
  };

  const handleAuthChange = React.useCallback(async (user: User | null) => {
    if (user?.id === lastUserId.current && profile && !loading) {
      return;
    }
    
    lastUserId.current = user?.id || null;
    setUser(user);
    const adminEmailsEnv = process.env.NEXT_PUBLIC_ADMIN_EMAILS || "l47idkpro@gmail.com,jarysucksatgames@gmail.com";
    const ADMIN_EMAILS = adminEmailsEnv.split(',').map(e => e.trim());
    
    if (user) {
      if (ADMIN_EMAILS.includes(user.email || "")) {
        setIsAdmin(true);
      }
      
      setLoading(true);
      await fetchProfile(user);
    } else {
      setProfile(null);
      setIsAdmin(false);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshProfile = React.useCallback(async () => {
    if (user) {
      await fetchProfile(user);
    }
  }, [user]);

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
  }, [handleAuthChange]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, profile, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
