"use client";
import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calculator, Brain, Users, ChevronLeft, ChevronRight, Quote, Code, Cpu, Globe, BookOpen, Lightbulb, Zap, Trophy, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ScrollReveal from '../components/ScrollReveal';
import TypewriterText from '../components/TypewriterText';

import { useAnimation } from 'framer-motion';

const Home = () => {
  const { content, loading } = useContent();
  const { home } = content;
  const [currentIndex, setCurrentIndex] = useState(0);
  const controls = useAnimation();
  const [isDragging, setIsDragging] = useState(false);

  const testimonials = home?.testimonials || [];
  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

  const gallery = home?.gallery && home.gallery.length > 0 
    ? home.gallery
    : [
        "/images/gallery/gallery1.jpg",
        "/images/gallery/gallery2.jpg",
        "/images/gallery/gallery3.jpg",
        "/images/gallery/gallery4.jpg",
        "/images/gallery/gallery5.jpg",
        "/images/gallery/gallery6.jpg",
      ];

  useEffect(() => {
    if (gallery.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % gallery.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [gallery.length]);

  useEffect(() => {
    if (!isDragging && testimonials.length > 0) {
      controls.start({
        x: [0, -2000],
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 50,
            ease: "linear",
          },
        },
      });
    } else {
      controls.stop();
    }
  }, [controls, isDragging, testimonials.length]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-zinc-400">Loading...</div>;

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % gallery.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + gallery.length) % gallery.length);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const wordVariants: any = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Innovation Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-500/10 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.03, 0.08, 0.03],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/10 blur-[150px] rounded-full"
        />
      </div>

      {/* Hero Section */}
      <section id="hero" className="relative py-32 md:py-48 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block px-4 py-1.5 mb-8 rounded-full glass text-amber-400 text-xs font-bold tracking-[0.2em] uppercase border-amber-500/20"
            >
              {home?.heroTagline || "Est. 2015 * Excellence in Mathematics"}
            </motion.div>
            
            <div className="overflow-hidden mb-8">
              <h1 className="text-7xl md:text-[10rem] font-bold tracking-tighter text-white font-display leading-[0.85] flex flex-wrap justify-center gap-x-6">
                {(home?.heroTitle || "Josephite Math Club").split(' ').map((word: string, i: number, arr: string[]) => (
                  <motion.span
                    key={i}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={wordVariants}
                    className={i === arr.length - 1 ? "gold-text" : ""}
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-16 leading-relaxed font-light tracking-tight h-[3em] flex items-center justify-center"
            >
              <TypewriterText 
                texts={home?.heroSubtitles || [
                  home?.heroSubtitle || "Where logic meets creativity to solve the world's most beautiful problems.",
                  "Exploring the infinite boundaries of mathematical thought.",
                  "Building a sanctuary for Josephite mathematicians.",
                  "Innovating through the language of the universe."
                ]}
                speed={70}
                delay={3000}
              />
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row justify-center gap-8"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/panel"
                  className="px-12 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-full font-black uppercase tracking-widest hover:from-amber-400 hover:to-amber-500 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-amber-500/30"
                >
                  {home?.joinButtonText || "Join the Club"} <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/about"
                  className="px-12 py-5 glass text-white rounded-full font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center border-white/10"
                >
                  {home?.storyButtonText || "Our Story"}
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Floating Math Symbols */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          {[Calculator, Brain].map((Icon, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0.4, 0.8, 0.4],
                y: [0, -40, 0],
                x: [0, 20, 0],
                rotate: [0, 10, 0]
              }}
              transition={{ 
                duration: 8 + i * 2, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: i * 2
              }}
              className="absolute"
              style={{
                top: `${20 + i * 30}%`,
                left: `${10 + i * 35}%`,
              }}
            >
              <Icon className="w-16 h-16 text-amber-500/60" />
            </motion.div>
          ))}
          
          {/* Integration Expression instead of Word */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.5, 0.9, 0.5],
              y: [0, 50, 0],
              x: [0, -30, 0],
              rotate: [0, -15, 0]
            }}
            transition={{ 
              duration: 12, 
              repeat: Infinity, 
              ease: "easeInOut"
            }}
            className="absolute text-amber-500/60 font-handwritten text-7xl select-none"
            style={{ 
              top: '80%', 
              left: '80%',
              fontFamily: 'var(--font-handwritten)'
            }}
          >
            &int; f(x) dx
          </motion.div>
        </div>
      </section>

      {/* Memories Section */}
      <section id="memories" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <ScrollReveal direction="up" distance={20} className="inline-block px-3 py-1 mb-4 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold tracking-[0.3em] uppercase border border-amber-500/20">
              {home?.memoriesTagline || "Visual Journey"}
            </ScrollReveal>
            <ScrollReveal direction="up" distance={30} delay={0.1}>
              <h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-white font-display">
                {home?.memoriesTitle?.split(' ').map((word: string, i: number, arr: string[]) => (
                  <span key={i} className={i === arr.length - 1 ? "gold-text" : "mr-4"}>
                    {word}
                  </span>
                )) || (
                  <>Our <span className="gold-text">Memories</span></>
                )}
              </h2>
            </ScrollReveal>
          </div>

          <ScrollReveal direction="up" distance={50} delay={0.2} className="relative w-full max-w-6xl mx-auto aspect-[16/9] rounded-[2.5rem] overflow-hidden glass-card border-white/10 group shadow-[0_0_100px_rgba(0,0,0,0.5)]">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={gallery[currentIndex]}
                alt={`Memory ${currentIndex + 1}`}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </AnimatePresence>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-8 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/40 text-white hover:bg-amber-500 hover:text-black transition-all opacity-0 group-hover:opacity-100 backdrop-blur-xl border border-white/10 scale-90 hover:scale-100"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-8 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/40 text-white hover:bg-amber-500 hover:text-black transition-all opacity-0 group-hover:opacity-100 backdrop-blur-xl border border-white/10 scale-90 hover:scale-100"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4">
              {gallery.map((_: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    idx === currentIndex ? 'w-12 bg-amber-500' : 'w-4 bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="text-center">
            <ScrollReveal direction="up" distance={20} className="inline-block px-3 py-1 mb-4 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold tracking-[0.3em] uppercase border border-amber-500/20">
              {home?.testimonialsTagline || "Voices of JMC"}
            </ScrollReveal>
            <ScrollReveal direction="up" distance={30} delay={0.1}>
              <h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-white font-display">
                {home?.testimonialsTitle?.split(' ').map((word: string, i: number, arr: string[]) => (
                  <span key={i} className={i === arr.length - 1 ? "gold-text" : "mr-4"}>
                    {word}
                  </span>
                )) || (
                  <>People About <span className="gold-text">JMC</span></>
                )}
              </h2>
            </ScrollReveal>
          </div>
        </div>

        <div className="relative flex overflow-hidden group py-16 -my-16 cursor-drag">
          <div className="absolute inset-y-0 left-0 w-60 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-60 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

          <motion.div
            drag="x"
            dragConstraints={{ left: -4000, right: 0 }}
            animate={controls}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
            onMouseEnter={() => setIsDragging(true)}
            onMouseLeave={() => setIsDragging(false)}
            className="flex gap-10 w-max px-4"
          >
            {duplicatedTestimonials.map((t: any, i: number) => (
              <motion.div
                key={i}
                whileHover={{ 
                  y: -20, 
                  scale: 1.02,
                  borderColor: "rgba(245, 158, 11, 0.4)",
                  boxShadow: "0 40px 80px -20px rgba(245, 158, 11, 0.2)",
                  zIndex: 50
                }}
                className="w-[500px] shrink-0 glass-card p-10 border-white/10 transition-all duration-700 group/card relative overflow-hidden"
              >
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-amber-500/5 blur-[100px] group-hover/card:bg-amber-500/20 transition-colors duration-700" />
                
                <div className="flex items-start justify-between mb-8 relative z-10">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-500/20 bg-zinc-900 shrink-0 rotate-3 group-hover/card:rotate-0 transition-transform duration-500 relative">
                      {t.imageUrl ? (
                        <Image 
                          src={t.imageUrl} 
                          alt={t.name} 
                          fill
                          className="object-cover" 
                          referrerPolicy="no-referrer" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                          <Users className="w-10 h-10 text-zinc-600" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xl font-bold text-white truncate mb-1">{t.name}</h4>
                      <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">{t.role}</p>
                    </div>
                  </div>
                  <Quote className="w-10 h-10 text-amber-500/10 group-hover/card:text-amber-500/30 transition-colors duration-500" />
                </div>
                <p className="text-zinc-400 text-base leading-relaxed whitespace-normal line-clamp-6 italic font-light relative z-10 tracking-tight">
                  &quot;{t.message}&quot;
                </p>
                
                {/* Decorative Element */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent transform scale-x-0 group-hover/card:scale-x-100 transition-transform duration-700" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Club Agenda Section */}
      <section id="agenda" className="py-32 relative bg-zinc-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <ScrollReveal direction="left" distance={50}>
              <div className="inline-block px-3 py-1 mb-6 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold tracking-[0.3em] uppercase border border-indigo-500/20">
                {home?.agendaTagline || "Our Mission"}
              </div>
              <h2 className="text-5xl md:text-7xl font-bold text-white font-display tracking-tighter mb-8">
                {home?.agendaTitle?.split(' ').map((word: string, i: number, arr: string[]) => (
                  <span key={i} className={i === arr.length - 1 ? "text-indigo-500" : "mr-4"}>
                    {word}
                  </span>
                )) || (
                  <>The Club <span className="text-indigo-500">Agenda</span></>
                )}
              </h2>
              <p className="text-xl text-zinc-400 font-light leading-relaxed mb-12">
                {home?.agendaDescription || "We aim to bridge the gap between theoretical mathematics and practical innovation through a series of structured programs."}
              </p>
              
              <div className="space-y-6">
                {(home?.agendaItems || [
                  { title: "Weekly Workshops", icon: "Zap" },
                  { title: "Monthly Competitions", icon: "Trophy" },
                  { title: "Annual Math Festival", icon: "Star" },
                  { title: "Research Projects", icon: "Lightbulb" }
                ]).map((item: any, i: number) => {
                  const IconMap: any = { Zap, Trophy, Star, Lightbulb };
                  const Icon = IconMap[item.icon] || Zap;
                  return (
                    <div key={i} className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-indigo-500 transition-colors duration-500">
                        <Icon className="w-6 h-6 text-indigo-400 group-hover:text-white transition-colors duration-500" />
                      </div>
                      <span className="text-lg text-white font-medium group-hover:text-indigo-400 transition-colors duration-500">{item.title}</span>
                    </div>
                  );
                })}
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" distance={50} className="relative">
              <div className="aspect-square rounded-[3rem] overflow-hidden glass-card border-white/10 p-2">
                <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative">
                  <Image 
                    src="https://picsum.photos/seed/math-agenda/800/800" 
                    alt="Club Agenda" 
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-indigo-500/20 mix-blend-overlay" />
                </div>
              </div>
              {/* Decorative Floating Elements */}
              <motion.div 
                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -top-10 -right-10 w-32 h-32 glass-card border-indigo-500/30 flex items-center justify-center rounded-3xl backdrop-blur-2xl"
              >
                <Cpu className="w-12 h-12 text-indigo-400" />
              </motion.div>
              <motion.div 
                animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-10 -left-10 w-32 h-32 glass-card border-amber-500/30 flex items-center justify-center rounded-3xl backdrop-blur-2xl"
              >
                <Code className="w-12 h-12 text-amber-400" />
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
