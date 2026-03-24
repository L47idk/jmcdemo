"use client";
import React from 'react';
import { useContent } from '../context/ContentContext';
import { motion } from 'motion/react';
import { Calendar, MapPin, Clock, ExternalLink, Sparkles } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

const Events = () => {
  const { content } = useContent();
  const events = [...(content?.events || [])].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="min-h-screen py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <ScrollReveal direction="up" distance={30}>
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 font-display tracking-tighter">
              Upcoming <span className="gold-text">Events</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal direction="up" distance={20} delay={0.1}>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto font-light">
              Join us in our journey of mathematical discovery. From workshops to national competitions, stay tuned for what&apos;s next.
            </p>
          </ScrollReveal>
        </div>

        {events.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32 glass-card border-white/10"
          >
            <Sparkles className="w-20 h-20 text-zinc-800 mx-auto mb-8 animate-pulse" />
            <h3 className="text-3xl font-bold text-zinc-500 font-display">No upcoming events</h3>
            <p className="text-zinc-600 mt-4 text-lg">We are planning something exciting. Stay tuned!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-12">
            {events.map((event: any, index: number) => (
              <ScrollReveal
                key={index}
                direction="up"
                distance={40}
                delay={index * 0.1}
                className="glass-card group hover:border-amber-500/30 transition-all duration-700 overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row">
                  {event.imageUrl && (
                    <div className="lg:w-1/3 aspect-video lg:aspect-auto overflow-hidden relative">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent hidden lg:block" />
                    </div>
                  )}
                  <div className="p-10 lg:p-16 flex-grow">
                    <div className="flex flex-wrap gap-6 mb-8">
                      {event.category && (
                        <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                          {event.category}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-amber-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                        <Calendar className="w-4 h-4" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                        <Clock className="w-4 h-4" />
                        {event.time || 'TBA'}
                      </div>
                      <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                        <MapPin className="w-4 h-4" />
                        {event.location || 'TBA'}
                      </div>
                    </div>
                    
                    <h3 className="text-4xl font-bold text-white mb-6 group-hover:text-amber-400 transition-colors duration-500 font-display">
                      {event.title}
                    </h3>
                    
                    <p className="text-zinc-400 text-lg leading-relaxed mb-10 font-light max-w-3xl">
                      {event.description}
                    </p>
                    
                    {event.link && (
                      <a
                        href={event.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-amber-500 text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-amber-400 transition-all duration-500 shadow-xl shadow-amber-500/10"
                      >
                        Register Now
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
