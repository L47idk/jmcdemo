"use client";
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { User, Mail, Shield, Calendar, GraduationCap, Edit2, Save, X as CloseIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Profile = () => {
  const { user, profile, loading } = useAuth();
  const [isEditing, setIsEditing] = React.useState(false);
  const [newSchool, setNewSchool] = React.useState('');
  const [updating, setUpdating] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      setNewSchool(profile?.school || user.user_metadata?.school || '');
    }
  }, [user, profile]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-zinc-400">Loading...</div>;
  if (!user) return <div className="min-h-screen flex items-center justify-center text-zinc-400">Please login to view profile.</div>;

  const handleUpdateProfile = async () => {
    setUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { school: newSchool }
      });
      if (error) throw error;
      
      // Also update profiles table if it exists and has the column
      // For now, metadata is the source of truth for the UI
      
      setIsEditing(false);
      window.location.reload(); // Refresh to show changes
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const schoolName = profile?.school || user.user_metadata?.school || 'N/A';

  return (
    <div className="min-h-screen relative py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden"
        >
          <div className="h-40 bg-gradient-to-r from-amber-600 to-amber-800 relative">
            <div className="absolute inset-0 bg-black/40"></div>
            <button 
              onClick={() => setIsEditing(true)}
              className="absolute top-6 right-6 p-3 bg-black/40 hover:bg-black/60 rounded-full text-white/70 hover:text-white transition-all backdrop-blur-md border border-white/10"
            >
              <Edit2 className="w-5 h-5" />
            </button>
          </div>
          <div className="px-10 pb-10">
            <div className="relative -mt-20 mb-8">
              <div className="w-40 h-40 glass border-4 border-amber-500/20 rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden bg-black/60">
                <User className="w-20 h-20 text-amber-500/20" />
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
              <div>
                <h1 className="text-4xl font-bold text-white font-display mb-2">{profile?.name || user.user_metadata?.full_name || 'Josephite Member'}</h1>
                <div className="space-y-2">
                  <p className="text-zinc-400 flex items-center gap-2 text-lg">
                    <Mail className="w-5 h-5 text-amber-500" /> {user.email}
                  </p>
                  <p className="text-zinc-400 flex items-center gap-2 text-lg">
                    <GraduationCap className="w-5 h-5 text-amber-500" /> {schoolName}
                  </p>
                </div>
              </div>
              <span className={`px-5 py-2 rounded-full text-sm font-bold uppercase tracking-widest shadow-lg ${
                profile?.role === 'admin' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' : 'bg-zinc-500/20 text-zinc-400 border border-white/10'
              }`}>
                {profile?.role || 'Member'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                <div className="flex items-center gap-4 text-zinc-500 mb-3">
                  <Shield className="w-6 h-6 text-amber-500" />
                  <span className="text-sm font-bold uppercase tracking-widest">Account Status</span>
                </div>
                <p className="text-white text-xl font-bold font-display">Active Member</p>
              </div>
              <div className="p-6 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                <div className="flex items-center gap-4 text-zinc-500 mb-3">
                  <GraduationCap className="w-6 h-6 text-amber-500" />
                  <span className="text-sm font-bold uppercase tracking-widest">Institution</span>
                </div>
                <p className="text-white text-xl font-bold font-display truncate" title={schoolName}>
                  {schoolName}
                </p>
              </div>
              <div className="p-6 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                <div className="flex items-center gap-4 text-zinc-500 mb-3">
                  <Calendar className="w-6 h-6 text-amber-500" />
                  <span className="text-sm font-bold uppercase tracking-widest">Joined Date</span>
                </div>
                <p className="text-white text-xl font-bold font-display">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card max-w-md w-full p-8 border-white/10"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white font-display uppercase tracking-wider">Edit Profile</h2>
              <button onClick={() => setIsEditing(false)} className="text-zinc-500 hover:text-white transition-colors">
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-zinc-500 uppercase tracking-widest mb-2">School/College Name</label>
                <input 
                  type="text"
                  value={newSchool}
                  onChange={(e) => setNewSchool(e.target.value)}
                  className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-amber-500/50 transition-all"
                  placeholder="Enter institution name"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-3 px-6 rounded-xl border border-white/10 text-zinc-400 font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdateProfile}
                  disabled={updating}
                  className="flex-1 py-3 px-6 rounded-xl bg-amber-500 text-black font-bold uppercase tracking-widest hover:bg-amber-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {updating ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Profile;
