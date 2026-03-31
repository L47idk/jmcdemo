"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Edit3, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Copy
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useContent } from '../context/ContentContext';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { useToast } from '../context/ToastContext';
import ScrollReveal from '../components/ScrollReveal';

const RegisterMember = () => {
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const { content } = useContent();
  const router = useRouter();
  const { showToast } = useToast();
  
  const [fullName, setFullName] = useState('');
  const [school, setSchool] = useState('');
  const [className, setClassName] = useState('');
  const [section, setSection] = useState('');
  const [roll, setRoll] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'cash' | ''>('');
  const [trxnid, setTrxnid] = useState('');
  const [bkashNumber, setBkashNumber] = useState('');
  const [verified, setVerified] = useState('no');
  const [isMember, setIsMember] = useState(false);
  const [checkingMember, setCheckingMember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const checkMemberStatus = React.useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('member')
        .select('verified, payment_method, trxnid, bkash_number')
        .eq('id', user.id)
        .maybeSingle();
      
      if (data) {
        setIsMember(true);
        setVerified(data.verified || 'no');
        setPaymentMethod(data.payment_method || 'cash');
        setTrxnid(data.trxnid || '');
        setBkashNumber(data.bkash_number || '');
      }
    } catch (err) {
      console.error('Error checking member status:', err);
    } finally {
      setCheckingMember(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
    if (profile) {
      setFullName(profile.full_name || '');
      checkMemberStatus();
    }
  }, [user, authLoading, router, profile, checkMemberStatus]);

  const handleRegisterMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Insert into member table
      const { error: memberError } = await supabase
        .from('member')
        .insert({
          id: user?.id,
          full_name: fullName,
          email: user?.email,
          school,
          class: className,
          section,
          roll,
          payment_method: paymentMethod,
          trxnid: paymentMethod === 'bkash' ? trxnid : null,
          bkash_number: paymentMethod === 'bkash' ? bkashNumber : null,
          verified: 'no'
        });

      if (memberError) throw memberError;

      // 2. Update profile (Crucial: Update full_name here so it shows up globally)
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          school,
          class: className,
          section,
          roll,
          intra_events: true,
          intra_events_chosen: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (profileError) throw profileError;

      await refreshProfile();
      setIsMember(true);
      setSuccess(true);
      showToast('Registration successful!', 'success');
      
      // Close tab after a delay or redirect
      setTimeout(() => {
        window.close();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
      showToast('Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || checkingMember) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080808]">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="atmospheric-glow w-[600px] h-[600px] bg-amber-500/5 -top-48 -left-24" />
      <div className="atmospheric-glow w-[700px] h-[700px] bg-indigo-500/5 bottom-0 -right-24" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto">
          <ScrollReveal direction="up">
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
                <Sparkles className="w-3 h-3" />
                Member Registration
              </div>
              <h1 className="text-5xl font-display font-bold text-white mb-4 tracking-tighter uppercase">
                JOIN THE <span className="gold-text">INTRA-EVENTS</span>
              </h1>
              <p className="text-zinc-500 font-medium">Complete your details to access exclusive club activities.</p>
            </div>

            {isMember ? (
              <div className="p-12 rounded-[40px] bg-white/[0.03] border border-white/10 backdrop-blur-xl text-center space-y-8">
                <div className="w-24 h-24 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 mx-auto border border-amber-500/30">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Already Registered!</h3>
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-zinc-500">You are a member of the Josephite Math Club.</p>
                    
                    <div className="w-full max-w-sm space-y-3">
                      <div className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Payment Status</span>
                        <span className={`text-xs font-bold uppercase tracking-widest ${
                          verified === 'yes' ? 'text-green-500' : 'text-amber-500'
                        }`}>
                          {verified === 'yes' ? 'Paid' : 'Verifying'}
                        </span>
                      </div>

                      {paymentMethod === 'bkash' && (
                        <div className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-left">
                          <div className="flex justify-between items-center">
                            <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-500">TrxID</span>
                            <span className="text-[10px] font-mono font-bold text-white">{trxnid}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-500">bKash Number</span>
                            <span className="text-[10px] font-mono font-bold text-white">{bkashNumber}</span>
                          </div>
                        </div>
                      )}

                      {paymentMethod === 'cash' && (
                        <div className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-left">
                          <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">Payment Method</span>
                          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Cash Payment</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => window.close()}
                  className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
                >
                  Close This Tab
                </button>
              </div>
            ) : (
              <div className="p-8 md:p-12 rounded-[40px] bg-white/[0.03] border border-white/10 backdrop-blur-xl">
                <form onSubmit={handleRegisterMember} className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Full Name</label>
                    <input 
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="YOUR FULL NAME"
                      className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 transition-all text-white font-bold text-sm tracking-wide"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">School</label>
                      <select 
                        required
                        value={school}
                        onChange={(e) => setSchool(e.target.value)}
                        className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-amber-500/50 transition-all text-white font-bold text-sm appearance-none"
                      >
                        <option value="" className="bg-zinc-900 text-zinc-500">SELECT SCHOOL</option>
                        <option value="St Joseph" className="bg-zinc-900">ST JOSEPH</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Class</label>
                      <input 
                        type="text"
                        required
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                        placeholder="e.g. 10"
                        className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-amber-500/50 transition-all text-white font-bold text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Section</label>
                      <input 
                        type="text"
                        required
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        placeholder="e.g. A"
                        className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-amber-500/50 transition-all text-white font-bold text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Roll Number</label>
                      <input 
                        type="text"
                        required
                        value={roll}
                        onChange={(e) => setRoll(e.target.value)}
                        placeholder="e.g. 42"
                        className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-amber-500/50 transition-all text-white font-bold text-sm"
                      />
                    </div>
                  </div>

                  <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-8">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white uppercase tracking-widest">Payment Details</h3>
                      <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[8px] font-bold uppercase tracking-widest">
                        Status: Pending
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Payment Method</label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('bkash')}
                          className={`py-4 rounded-2xl border transition-all font-bold text-xs uppercase tracking-widest ${
                            paymentMethod === 'bkash' 
                              ? 'bg-amber-500 border-amber-500 text-black' 
                              : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/20'
                          }`}
                        >
                          bKash
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('cash')}
                          className={`py-4 rounded-2xl border transition-all font-bold text-xs uppercase tracking-widest ${
                            paymentMethod === 'cash' 
                              ? 'bg-amber-500 border-amber-500 text-black' 
                              : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/20'
                          }`}
                        >
                          Cash
                        </button>
                      </div>
                    </div>

                    {paymentMethod === 'bkash' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Send Money To (bKash)</span>
                            <button 
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(content?.registration?.bkashNumber || '01712345678');
                                showToast('Number copied to clipboard', 'success');
                              }}
                              className="flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all"
                            >
                              <Copy className="w-3 h-3" />
                              Copy
                            </button>
                          </div>
                          <div className="text-xl font-mono font-bold text-white tracking-wider">{content?.registration?.bkashNumber || '01712345678'}</div>
                          <div className="space-y-1">
                            <p className="text-xs text-zinc-300 font-bold uppercase tracking-widest mb-2">
                              Fee: {content?.registration?.fee || '200 BDT'}
                            </p>
                            {(content?.registration?.instructions || [
                              "Go to your bKash app or dial *247#",
                              "Select \"Send Money\" and enter the number above",
                              "Enter the registration fee amount",
                              "Copy the Transaction ID (TrxID) and enter it below"
                            ]).map((step: string, i: number) => (
                              <p key={i} className="text-[9px] text-zinc-500 uppercase tracking-widest leading-relaxed">
                                {i + 1}. {step}
                              </p>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">TrxID</label>
                            <input 
                              type="text"
                              required
                              value={trxnid}
                              onChange={(e) => setTrxnid(e.target.value)}
                              placeholder="TRANSACTION ID"
                              className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-amber-500/50 transition-all text-white font-bold text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Your bKash Number</label>
                            <input 
                              type="text"
                              required
                              value={bkashNumber}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                if (val.length <= 11) setBkashNumber(val);
                              }}
                              placeholder="01XXXXXXXXX"
                              className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-amber-500/50 transition-all text-white font-bold text-sm"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {paymentMethod === 'cash' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20"
                      >
                        <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest text-center">
                          {content?.registration?.cashInstructions || "Please pay your registration fee to the club treasurer."}
                        </p>
                      </motion.div>
                    )}
                  </div>

                  {error && (
                    <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-4 text-red-500 text-xs font-bold uppercase tracking-widest">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-6 bg-amber-500 text-black font-bold uppercase tracking-[0.3em] text-xs rounded-2xl hover:bg-amber-400 transition-all flex items-center justify-center gap-4 shadow-2xl shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        Complete Registration
                        <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

export default RegisterMember;
