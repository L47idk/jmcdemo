"use client";
import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen relative py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl font-bold text-white mb-8 font-display"
            >
              Get in Touch
            </motion.h1>
            <p className="text-xl text-zinc-400 mb-16 leading-relaxed">
              Have questions about the club or want to collaborate? Our team of mathematicians is ready to assist you.
            </p>

            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.15
                  }
                }
              }}
              className="space-y-10"
            >
              {[
                { icon: Mail, title: 'Email Us', value: 'hello@josephitemath.club', delay: 0 },
                { icon: Phone, title: 'Call Us', value: '+1 (555) 000-0000', delay: 1 },
                { icon: MapPin, title: 'Visit Us', value: "St. Joseph's Campus, Math Wing, CA 90210", delay: 2 }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  variants={{
                    hidden: { opacity: 0, x: -30 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
                  }}
                  className="flex items-start gap-6"
                >
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 4, repeat: Infinity, delay: item.delay }}
                    className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 shrink-0 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                  >
                    <item.icon className="w-7 h-7" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1 font-display tracking-tight">{item.title}</h3>
                    <p className="text-zinc-400 font-light">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-card p-10 border-amber-500/10 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-amber-500/10 transition-colors duration-700" />
            <form className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">First Name</label>
                  <input
                    type="text"
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Last Name</label>
                  <input
                    type="text"
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Message</label>
                <textarea
                  rows={5}
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                ></textarea>
              </div>
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-2xl font-bold hover:from-amber-400 hover:to-amber-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-amber-600/20"
              >
                Send Message <Send className="w-5 h-5" />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
