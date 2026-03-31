"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContent } from '@/context/ContentContext';
import { 
  FacebookIcon, 
  InstagramIcon, 
  YoutubeIcon, 
  GithubIcon 
} from './SocialIcons';
import { 
  Code2, 
  ChevronUp, 
  Bell 
} from 'lucide-react';

const FloatingSidebar = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [hasNewNotice, setHasNewNotice] = useState(false);
  const { content } = useContent();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Logic for new notice red dot
  useEffect(() => {
    const noticesArray = content?.notices?.notices || [];
    if (noticesArray.length > 0) {
      const lastViewedId = localStorage.getItem('lastViewedNoticeId');
      
      // Sort notices by date descending to find the latest
      const sortedNotices = [...noticesArray].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      const latestNotice = sortedNotices[0];

      if (!lastViewedId || lastViewedId !== latestNotice.id) {
        setHasNewNotice(true);
      } else {
        setHasNewNotice(false);
      }
    } else {
      setHasNewNotice(false);
    }

    // Clear notification if we are on the notices page
    if (pathname === '/notices' && noticesArray.length > 0) {
      const sortedNotices = [...noticesArray].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      const latestNotice = sortedNotices[0];
      localStorage.setItem('lastViewedNoticeId', latestNotice.id);
      setHasNewNotice(false);
    }
  }, [content?.notices, pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { icon: FacebookIcon, href: "https://www.facebook.com/2015JMC", color: "hover:text-blue-600", external: true },
    { icon: InstagramIcon, href: "https://instagram.com", color: "hover:text-pink-600", external: true },
    { icon: YoutubeIcon, href: "/404-not-found", color: "hover:text-red-600", external: false },
    { icon: GithubIcon, href: "https://github.com", color: "hover:text-gray-900", external: true },
    { icon: Code2, href: "/developers", color: "hover:text-amber-600", external: false, newTab: true },
  ];

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[60] hidden sm:flex flex-col gap-3 items-center">
      {/* Notification Icon */}
      <Link href="/notices">
        <motion.div 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_15px_35px_-5px_rgba(0,0,0,0.25),0_5px_15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_45px_-5px_rgba(0,0,0,0.3),0_10px_20px_rgba(0,0,0,0.15)] cursor-pointer relative group transition-shadow duration-300"
        >
          <Bell className="w-6 h-6 text-black group-hover:text-amber-500 transition-colors fill-black group-hover:fill-amber-500" />
          {hasNewNotice && (
            <span className="absolute top-2.5 right-2.5 w-3.5 h-3.5 bg-[#C52D2F] rounded-full border-2 border-white group-hover:animate-pulse" />
          )}
        </motion.div>
      </Link>

      {/* Social Sidebar */}
      <motion.div 
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="bg-white rounded-full py-5 px-3 flex flex-col gap-5 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.25),0_5px_15px_rgba(0,0,0,0.1)] items-center"
      >
        {socialLinks.map((social, index) => {
          const Icon = social.icon;
          const linkProps = social.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {};
          
          if (social.external) {
            return (
              <motion.a
                key={index}
                href={social.href}
                {...linkProps}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={`text-black transition-all duration-300 ${social.color}`}
              >
                <Icon className="w-6 h-6" />
              </motion.a>
            );
          }

          return (
            <Link key={index} href={social.href} {...linkProps}>
              <motion.div
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={`text-black transition-all duration-300 cursor-pointer ${social.color}`}
              >
                <Icon className="w-6 h-6" />
              </motion.div>
            </Link>
          );
        })}
      </motion.div>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_15px_35px_-5px_rgba(0,0,0,0.25),0_5px_15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_45px_-5px_rgba(0,0,0,0.3),0_10px_20px_rgba(0,0,0,0.15)] cursor-pointer group transition-shadow duration-300"
          >
            <ChevronUp className="w-6 h-6 text-black group-hover:text-amber-500 transition-colors stroke-[3px]" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingSidebar;
