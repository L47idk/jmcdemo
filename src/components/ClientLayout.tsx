"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "@/context/ContentContext";
import Navbar from "@/components/Navbar";
import BackgroundFormulas from "@/components/BackgroundFormulas";
import MathVisualizations from "@/components/MathVisualizations";
import StarField from "@/components/StarField";
import SplashScreen from "@/components/SplashScreen";
import FloatingSidebar from "@/components/FloatingSidebar";
import CustomCursor from "@/components/CustomCursor";
import ErrorBoundary from "@/components/ErrorBoundary";
import Footer from "@/components/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { loading, content } = useContent();
  const [splashFinished, setSplashFinished] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {!splashFinished ? (
        <SplashScreen 
          key="splash" 
          isLoaded={!loading} 
          logoUrl={content?.site?.logoUrl}
          onFinish={() => setSplashFinished(true)} 
        />
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="min-h-screen flex flex-col relative overflow-hidden"
        >
          {/* Atmospheric Background */}
          <div className="fixed inset-0 pointer-events-none -z-30">
            <div className="noise absolute inset-0 opacity-[0.01]" />
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-indigo-500/5" />
          </div>

          <StarField />
          <CustomCursor />
          <MathVisualizations />
          <BackgroundFormulas />
          <Navbar />
          <FloatingSidebar />
          <main className="flex-grow relative z-10">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
          
          <Footer />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
