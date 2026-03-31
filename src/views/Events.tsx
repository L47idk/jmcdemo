"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ArrowRight, Filter, Search, Trophy, Users, BookOpen, Sparkles } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import ScrollReveal from '../components/ScrollReveal';
import Image from 'next/image';

const Events = () => {
  const { content } = useContent();
  const eventsContent = content?.events || {};
  const events = eventsContent.events || [];
  const [filter, setFilter] = React.useState('all');
  const [search, setSearch] = React.useState('');

  const filteredEvents = events.filter((e: any) => {
    const matchesFilter = filter === 'all' || e.category?.toLowerCase() === filter.toLowerCase();
    const title = e.title || '';
    const description = e.description || '';
    const matchesSearch = title.toLowerCase().includes(search.toLowerCase()) || 
                          description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const categories = eventsContent.categories || [
    { id: 'all', name: 'All', icon: 'Calendar' },
    { id: 'competition', name: 'Competitions', icon: 'Trophy' },
    { id: 'workshop', name: 'Workshops', icon: 'BookOpen' },
    { id: 'seminar', name: 'Seminars', icon: 'Users' },
  ];

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-hidden">
      {/* Background Glows */}
      <div className="atmospheric-glow w-[500px] h-[500px] bg-amber-500/5 -top-48 -right-24" />
      <div className="atmospheric-glow w-[600px] h-[600px] bg-indigo-500/5 bottom-0 -left-24" />

      <div className="pt-40 pb-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <ScrollReveal>
            <div className="max-w-5xl mb-24">
              <div className="flex items-center gap-4 mb-8">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-amber-500/80">{eventsContent.subtitle || 'UPCOMING EVENTS'}</span>
              </div>
              <h1 className="text-7xl md:text-[9rem] font-display font-bold leading-[0.85] tracking-tighter mb-12">
                {eventsContent.title?.split(' ').map((word: string, i: number) => (
                  <span key={i} className={i === 1 ? 'gold-text' : 'block'}>{word} </span>
                )) || (
                  <>
                    <span className="block">BEYOND</span>
                    <span className="gold-text">NUMBERS</span>
                  </>
                )}
              </h1>
              <p className="text-xl md:text-3xl text-zinc-400 font-light leading-relaxed max-w-3xl">
                {eventsContent.description || 'Join us for a series of challenging competitions, insightful workshops, and engaging seminars designed to push your mathematical boundaries.'}
              </p>
            </div>
          </ScrollReveal>

          {/* Filters & Search */}
          <div className="mb-24 flex flex-col lg:flex-row items-center justify-between gap-12">
            <ScrollReveal direction="left">
              <div className="flex flex-wrap items-center gap-3">
                {categories.map((cat: any) => {
                  const IconMap: any = { Calendar, Trophy, BookOpen, Users };
                  const Icon = IconMap[cat.icon] || Calendar;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setFilter(cat.id)}
                      className={`px-8 py-4 rounded-full text-[10px] uppercase tracking-widest font-bold flex items-center gap-3 transition-all duration-500 border ${
                        filter === cat.id 
                          ? 'bg-amber-500 text-black border-amber-500 shadow-xl shadow-amber-500/20' 
                          : 'bg-white/5 text-zinc-500 border-white/10 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="relative w-full lg:w-96 group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-amber-500 transition-colors" />
                <input 
                  type="text"
                  placeholder="SEARCH EVENTS..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 transition-all text-white placeholder:text-zinc-600 font-bold text-[10px] tracking-widest uppercase"
                />
              </div>
            </ScrollReveal>
          </div>

          {/* Events Grid */}
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredEvents.map((event: any, i: number) => (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <div className="group relative h-full">
                    <div className="absolute -inset-2 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700" />
                    <div className="relative glass-card h-full flex flex-col">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image 
                          src={event.imageUrl || `https://picsum.photos/seed/event-${i}/800/600`} 
                          alt={event.title} 
                          fill
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60 group-hover:opacity-100"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-6 left-6 flex flex-col gap-2">
                          <div className="px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-widest text-amber-500">
                            {event.category || 'Event'}
                          </div>
                          {event.tag && (
                            <div className={`px-4 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest border self-start ${
                              event.tag === 'important' ? 'bg-red-500/20 text-red-500 border-red-500/30' :
                              event.tag === 'urgent' ? 'bg-orange-500/20 text-orange-500 border-orange-500/30' :
                              event.tag === 'success' ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30' :
                              'bg-blue-500/20 text-blue-500 border-blue-500/30'
                            }`}>
                              {event.tag}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="p-10 flex-grow flex flex-col">
                        <h3 className="text-3xl font-display font-bold mb-6 group-hover:text-amber-500 transition-colors leading-tight">{event.title}</h3>
                        <p className="text-zinc-500 leading-relaxed mb-10 flex-grow font-light">
                          {event.description}
                        </p>
                        <div className="space-y-4 mb-10">
                          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-zinc-600">
                            <Calendar className="w-4 h-4 text-amber-500" />
                            {event.date}
                          </div>
                          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-zinc-600">
                            <Clock className="w-4 h-4 text-amber-500" />
                            {event.time}
                          </div>
                          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-zinc-600">
                            <MapPin className="w-4 h-4 text-amber-500" />
                            {event.location}
                          </div>
                        </div>
                        <a 
                          href={event.registrationLink || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all duration-500 flex items-center justify-center gap-3 group/btn shadow-lg shadow-black/20"
                        >
                          {event.buttonText || 'Register Now'}
                          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                        </a>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <ScrollReveal>
              <div className="text-center py-40 rounded-[3rem] bg-white/[0.02] border border-dashed border-white/10">
                <Calendar className="w-20 h-20 text-zinc-800 mx-auto mb-8 opacity-20" />
                <h3 className="text-3xl font-display font-bold text-zinc-600 mb-4">No events found</h3>
                <p className="text-zinc-700 uppercase tracking-widest text-xs font-bold">Try adjusting your filters or search terms.</p>
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
