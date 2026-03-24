"use client";
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  
  const [isHovering, setIsHovering] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isDraggable, setIsDraggable] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Use refs for positions to avoid re-renders and ensure zero latency
  const mousePos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isDrag = !!target.closest('.cursor-drag');
      setIsDraggable(isDrag);

      const isPointer = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        !!target.closest('a') || 
        !!target.closest('button') ||
        target.classList.contains('cursor-pointer') ||
        (window.getComputedStyle(target).cursor === 'pointer');
      
      setIsHovering(isPointer);
    };

    const updateCursor = () => {
      // Accurate positioning for both dot and ring (zero delay between them)
      const x = mousePos.current.x;
      const y = mousePos.current.y;
      const transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;

      if (dotRef.current) {
        dotRef.current.style.transform = transform;
      }

      if (cursorRef.current) {
        cursorRef.current.style.transform = transform;
      }

      rafId.current = requestAnimationFrame(updateCursor);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    
    rafId.current = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Ring - Hardware Accurate Position */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center"
        style={{
          willChange: 'transform',
          transform: 'translate3d(-100%, -100%, 0)', // Initial off-screen
        }}
      >
        <motion.div
          className="absolute inset-0 border border-white rounded-full"
          initial={false}
          animate={{
            scale: isClicked ? 0.8 : (isDraggable ? 2.8 : (isHovering ? 2.2 : 1)),
            backgroundColor: (isHovering || isDraggable) ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0)',
          }}
          transition={{ type: 'spring', stiffness: 250, damping: 25, mass: 0.5 }}
        />
        <AnimatePresence mode="wait">
          {isDraggable && (
            <motion.div
              key="drag-indicator"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1.2 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="relative z-10 flex items-center justify-center gap-1"
            >
              <ChevronLeft className="w-2.5 h-2.5 text-black" />
              <motion.span
                className="text-[9px] font-black text-black uppercase tracking-tighter"
              >
                Drag
              </motion.span>
              <ChevronRight className="w-2.5 h-2.5 text-black" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Inner Dot - Hardware Accurate Position */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-[10000] mix-blend-difference"
        style={{
          willChange: 'transform',
          transform: 'translate3d(-100%, -100%, 0)', // Initial off-screen
        }}
      >
        <motion.div
          className="w-full h-full bg-white rounded-full"
          animate={{
            scale: isClicked ? 1.5 : (isDraggable || isHovering ? 0 : 1)
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      </div>
    </>
  );
};

export default CustomCursor;
