"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../context/ToastContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const Auth = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const initialMode = searchParams?.get('mode') === 'signup' ? 'signup' : 'login';
  
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const isConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  useEffect(() => {
    if (searchParams?.get('mode') === 'signup') {
      setMode('signup');
    } else {
      setMode('login');
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isConfigured) {
      setError("Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.");
    } else if (!supabaseUrl.startsWith('http')) {
      setError("Supabase URL is invalid. It must start with 'https://'. Current value: " + supabaseUrl);
    }
  }, [isConfigured, supabaseUrl]);

  const testConnection = async () => {
    setTestResult("Testing...");
    try {
      const res = await fetch(`${supabaseUrl}/auth/v1/health`, {
        headers: { 'apikey': supabaseAnonKey }
      });
      if (res.ok) {
        setTestResult("Connection successful! Supabase is reachable.");
      } else {
        setTestResult(`Connection failed with status: ${res.status} ${res.statusText}`);
      }
    } catch (err: any) {
      setTestResult(`Connection error: ${err.message}`);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfigured) {
      setError("Cannot authenticate: Supabase configuration is missing.");
      return;
    }
    if (!supabaseUrl.startsWith('http')) {
      setError("Cannot authenticate: Supabase URL is invalid.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { 
              full_name: fullName,
            }
          }
        });
        
        if (signUpError) throw signUpError;

        showToast('Check your email for the confirmation link!', 'success');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/profile');
      }
    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
        setError("Network error: Failed to connect to Supabase. This usually means your NEXT_PUBLIC_SUPABASE_URL is incorrect or your internet connection is down.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const maskString = (str: string) => {
    if (!str) return "EMPTY";
    if (str.length <= 8) return "****";
    return str.substring(0, 4) + "...." + str.substring(str.length - 4);
  };

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-hidden flex items-center justify-center p-4 pt-32 pb-24">
      {/* Background Glows */}
      <div className="atmospheric-glow w-[600px] h-[600px] bg-amber-500/10 -top-48 -left-24" />
      <div className="atmospheric-glow w-[700px] h-[700px] bg-indigo-500/5 bottom-0 -right-24" />

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl relative z-10"
      >
        <div className="p-12 md:p-16 rounded-[3rem] bg-white/[0.02] border border-white/10 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] -mr-48 -mt-48" />
          
          <div className="relative z-10">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-8">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-amber-500/80">AUTHENTICATION</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-display font-bold leading-tight tracking-tighter mb-6">
                {mode === 'login' ? (
                  <>WELCOME <span className="gold-text">BACK</span></>
                ) : (
                  <>JOIN THE <span className="gold-text">CLUB</span></>
                )}
              </h1>
              <p className="text-sm text-zinc-500 font-bold uppercase tracking-[0.2em]">
                {mode === 'login' ? 'Enter your credentials to continue' : 'Create an account to get started'}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-8">
              <AnimatePresence mode="wait">
                {mode === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 ml-4">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-amber-500 transition-colors" />
                      <input 
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="JOHN DOE"
                        className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 transition-all text-white placeholder:text-zinc-800 font-bold text-[10px] tracking-widest uppercase"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 ml-4">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-amber-500 transition-colors" />
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="NAME@EXAMPLE.COM"
                    className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 transition-all text-white placeholder:text-zinc-800 font-bold text-[10px] tracking-widest uppercase"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between ml-4">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">Password</label>
                  {mode === 'login' && (
                    <button type="button" className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500 hover:text-amber-400 transition-colors">
                      FORGOT?
                    </button>
                  )}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-amber-500 transition-colors" />
                  <input 
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 transition-all text-white placeholder:text-zinc-800 font-bold text-[10px] tracking-widest uppercase"
                  />
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-5 rounded-3xl bg-red-500/10 border border-red-500/20 flex flex-col gap-2 text-red-500 text-xs font-bold uppercase tracking-widest"
                >
                  <div className="flex items-center gap-4">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setShowDebug(!showDebug)}
                    className="text-[8px] text-zinc-500 hover:text-zinc-400 mt-2 self-start"
                  >
                    {showDebug ? "HIDE DEBUG INFO" : "SHOW DEBUG INFO"}
                  </button>
                  {showDebug && (
                    <div className="mt-2 p-4 bg-black/40 rounded-2xl font-mono text-[8px] space-y-1 lowercase tracking-normal">
                      <div>URL: {supabaseUrl || "MISSING"}</div>
                      <div>KEY: {maskString(supabaseAnonKey)}</div>
                      <div>CONFIGURED: {isConfigured ? "YES" : "NO"}</div>
                      <div className="pt-2 flex flex-col gap-1">
                        <button 
                          type="button"
                          onClick={testConnection}
                          className="text-amber-500 hover:text-amber-400 underline self-start"
                        >
                          TEST CONNECTION
                        </button>
                        {testResult && <div className="text-zinc-400 italic">{testResult}</div>}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-6 bg-amber-500 text-black font-bold uppercase tracking-[0.3em] text-xs rounded-full hover:bg-amber-400 transition-all flex items-center justify-center gap-4 shadow-2xl shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-16 text-center">
              <button 
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-amber-500 transition-colors"
              >
                {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                <span className="text-amber-500 underline underline-offset-8 decoration-2">
                  {mode === 'login' ? 'Sign Up' : 'Log In'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
