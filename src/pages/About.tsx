"use client";
import React from 'react';
import { useContent } from '../context/ContentContext';
import { motion } from 'motion/react';
import { Calculator, Trophy, Lightbulb, Heart, Target, Rocket, Zap, Globe } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

const Typewriter = ({ text, delay = 20 }: { text: string; delay?: number }) => {
  const [currentText, setCurrentText] = React.useState("");
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return <span>{currentText}</span>;
};

const About = () => {
  const { content, loading } = useContent();

  if (loading) return null;

  const aboutContent = content.about || {
    title: "What is JMC?",
    description: "The Josephite Math Club is dedicated to cultivating a passion for mathematics. Our mission is to provide a supportive environment for students to explore mathematical concepts, participate in competitions, and engage in math-related events. Join us to experience the world of mathematics in a whole new way!",
    mission: ""
  };

  const stats = [
    { number: "10+", label: "Years of Excellence" },
    { number: "100+", label: "Workshops Conducted" },
    { number: "6", label: "National Festivals" },
    { number: "20k+", label: "Students Impacted" },
  ];

  const objectives = [
    {
      title: "Problem Solving",
      description: "Develop your math skills through challenging problems and real-world applications. Build critical thinking and problem-solving abilities.",
      icon: <Calculator className="w-8 h-8" />,
      color: "text-purple-400"
    },
    {
      title: "Olympiad Preparation",
      description: "Preparing for math Olympiads helps you think outside the box and tackle advanced problems with confidence.",
      icon: <Trophy className="w-8 h-8" />,
      color: "text-amber-400"
    },
    {
      title: "Creativity",
      description: "Learn how creativity fuels problem-solving. Apply mathematical thinking in innovative ways.",
      icon: <Lightbulb className="w-8 h-8" />,
      color: "text-emerald-400"
    },
    {
      title: "Love for Math",
      description: "Embrace your passion for mathematics and explore its beauty in a supportive environment.",
      icon: <Heart className="w-8 h-8" />,
      color: "text-rose-400"
    }
  ];

  return (
    <div className="min-h-screen relative py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* What is JMC Section */}
        <section className="text-center mb-48">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-5xl md:text-8xl font-bold text-white mb-16 font-display tracking-tighter leading-none">
              {aboutContent.title.split(' ').map((word: string, i: number) => (
                <span key={i} className={i === 2 ? "gold-text mr-6" : "mr-6"}>{word}</span>
              ))}
            </h2>
            
            <div className="text-zinc-400 max-w-5xl mx-auto text-xl md:text-3xl leading-relaxed mb-24 font-light tracking-tight min-h-[120px] px-4">
              <Typewriter text={aboutContent.description} />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.8, ease: "easeOut" }}
                className="glass-card p-12 flex flex-col items-center justify-center border-white/5 hover:border-amber-500/30 transition-all group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <span className="text-6xl font-bold text-white mb-6 font-display group-hover:scale-110 transition-transform duration-700 tracking-tighter">
                  {stat.number}
                </span>
                <span className="text-amber-500/60 text-xs font-black uppercase tracking-[0.3em] text-center">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Our Objectives Section */}
        <section className="text-center mb-48">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-24"
          >
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold tracking-[0.3em] uppercase border border-amber-500/20">
              Our Vision
            </div>
            <h2 className="text-5xl md:text-8xl font-bold text-white font-display tracking-tighter leading-none">
              Our <span className="gold-text">Objectives</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {objectives.map((obj, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="moving-border-container"
              >
                <div className="moving-border-content p-12 flex flex-col items-center text-center group relative overflow-hidden h-full">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  <div className={`mb-10 p-6 rounded-3xl bg-white/5 ${obj.color} group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 shadow-2xl`}>
                    {obj.icon}
                  </div>
                  
                  <h3 className="text-3xl font-bold text-white mb-8 font-display tracking-tight border-b border-white/5 pb-6 w-full group-hover:text-amber-400 transition-colors duration-500">
                    {obj.title}
                  </h3>
                  
                  <p className="text-zinc-400 text-base leading-relaxed font-light tracking-tight">
                    {obj.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Vision in 4 Steps Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="text-center mb-20">
            <ScrollReveal direction="up" distance={20} className="inline-block px-3 py-1 mb-4 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold tracking-[0.3em] uppercase border border-indigo-500/20">
              The Path Forward
            </ScrollReveal>
            <ScrollReveal direction="up" distance={30} delay={0.1}>
              <h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-white font-display">
                Vision in <span className="text-indigo-500">4 Steps</span>
              </h2>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent -translate-y-1/2 z-0" />
            
            {[
              { title: "Discovery", desc: "Identifying mathematical potential in every student.", icon: Target, color: "bg-blue-500" },
              { title: "Nurturing", desc: "Providing the resources and mentorship to grow.", icon: Zap, color: "bg-indigo-500" },
              { title: "Excellence", desc: "Achieving mastery through practice and competition.", icon: Rocket, color: "bg-purple-500" },
              { title: "Impact", desc: "Applying math to solve real-world global problems.", icon: Globe, color: "bg-pink-500" }
            ].map((step, i) => (
              <ScrollReveal 
                key={i} 
                direction="up" 
                distance={40} 
                delay={i * 0.2}
                className="relative z-10"
              >
                <div className="glass-card p-10 border-white/5 hover:border-indigo-500/30 transition-all group h-full flex flex-col items-center text-center">
                  <div className={`w-20 h-20 rounded-2xl ${step.color} flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}>
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-indigo-500 font-black text-xl font-display">
                    0{i + 1}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 font-display uppercase tracking-wider">{step.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed font-light">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
